import React, { useEffect, useRef, useState } from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, { Event, RepeatMode, usePlaybackState, useTrackPlayerEvents } from "react-native-track-player";
import BackgroundTimer from 'react-native-background-timer';
import SongCard from "../../components/Cards/SongCard/SongCard";
import PlaybackControl from "../../components/PlaybackControl/PlaybackControl";
import { Song } from "../../models/MusicModel";
import { useTypedSelector } from "../../state/reducers";
import { convertSongListToTracks, getSongId } from "../../utils/musicUtils";
import styles from "./Playback.style";
import { useDispatch } from "react-redux";
import { removeOldestRandomSongs, setCurrentPlayArray, setLastSongPlayed, setRandomNextSongs } from "../../state/actions/Playlist";
import { playable } from "../../utils/trackPlayUtils";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { MARGIN, SongCardHeight } from "../../components/Cards/SongCard/SongCard.style";
import { PlaybackMode } from "../../state/reducers/Playlist";
import { getRandomizedNextSong, getRandomizedSongs } from "../../utils/PlaylistRandomization";

const CARD_HEIGHT = SongCardHeight + MARGIN * 2;

const Playback = () => {
    const { currentPlaylist, playbackOptions } = useTypedSelector(state => state.Playlist);
    const options = useTypedSelector(state => state.Options);
    const dispatch = useDispatch();
    const playbackState = usePlaybackState();
    const [currentTrack, setCurrentTrack] = useState(0);
    const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);
    const [waitCounter, setWaitCounter] = useState(0);
    const [countTo, setCountTo] = useState(options.randomizationMaxRandomWaitTimeSeconds);
    const [repeatMode, setRepeatMode] = useState(RepeatMode.Off);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : systemColorScheme === 'dark';

    const translationY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler((event) => {
        translationY.value = event.contentOffset.y;
    });

    useEffect(() => {
        TrackPlayer.getRepeatMode().then(mode => {
            setRepeatMode(mode);
        });
    }, []);

    useEffect(() => {
        TrackPlayer.setRepeatMode(repeatMode);
    }, [repeatMode]);

    useEffect(() => {
        if (waitCounter >= countTo) {
            BackgroundTimer.stopBackgroundTimer();
            TrackPlayer.play();
            setWaitCounter(0);
        }
    }, [waitCounter]);

    const startRandomWaitTimer = () => {
        TrackPlayer.pause();
        setCountTo(Math.ceil(Math.random() * options.randomizationMaxRandomWaitTimeSeconds));
        BackgroundTimer.runBackgroundTimer(() => {
            setWaitCounter(counter => counter + 1);
        }, 1000);
    };

    useTrackPlayerEvents([Event.PlaybackTrackChanged], event => {
        if (event.type === Event.PlaybackTrackChanged) {
            if (playbackOptions.mode === PlaybackMode.RANDOMIZE && options.randomizationEnableRandomWaitTime) {
                startRandomWaitTimer();
            }
            TrackPlayer.getCurrentTrack().then(currentIndex => {
                if (playbackOptions.mode === PlaybackMode.RANDOMIZE && currentPlaylist) {
                    const { randomizationForwardBuffer, randomizationBackwardBuffer } = options;
                    const totalBuffer = randomizationBackwardBuffer + randomizationForwardBuffer;
                    const totalCurrentSongs = currentPlaylist && currentPlaylist.playArray.length;
                    const currentForwardBuffer = totalCurrentSongs - currentIndex;

                    // We need to add when the forward buffer is smaller than we need
                    if (currentForwardBuffer < randomizationForwardBuffer) {
                        const bufferNeeded = randomizationForwardBuffer - currentForwardBuffer;
                        const songsToAdd: Song[] = [];
                        if (options.randomizationShouldNotRepeatSongs) {
                            songsToAdd.push(getRandomizedNextSong(
                                currentPlaylist,
                                playbackOptions.randomizeOptions.weighted,
                                currentPlaylist.playArray[currentPlaylist.playArray.length - 1]
                            ));
                        } else {
                            songsToAdd.push(getRandomizedNextSong(currentPlaylist, playbackOptions.randomizeOptions.weighted));
                        }
                        for (let i = 1; i < bufferNeeded; i++) {
                            let nextSong: Song;
                            if (options.randomizationShouldNotRepeatSongs) {
                                nextSong = getRandomizedNextSong(
                                    currentPlaylist,
                                    playbackOptions.randomizeOptions.weighted,
                                    songsToAdd[i - 1]
                                );
                            } else {
                                nextSong = getRandomizedNextSong(
                                    currentPlaylist,
                                    playbackOptions.randomizeOptions.weighted
                                );
                            }
                            songsToAdd.push(nextSong);
                        }
                        dispatch(setRandomNextSongs(songsToAdd));
                        TrackPlayer.add(convertSongListToTracks(songsToAdd));

                        // We need to remove when we have more than the total buffer
                        if (totalCurrentSongs > totalBuffer) {
                            const songsToRemove = totalCurrentSongs - totalBuffer;
                            TrackPlayer.remove([...Array(songsToRemove).keys()]);
                            dispatch(removeOldestRandomSongs(songsToRemove));
                            // We need to subtract here however many songs we removed
                            currentIndex = currentIndex - songsToRemove;
                        }
                    }
                }
                setCurrentTrack(currentIndex);
                dispatch(setLastSongPlayed(currentIndex));
            });
        }
    });

    const pickerRef = useRef<Animated.FlatList<Song>>(null);

    const startPlayback = async () => {
        const tracks = await TrackPlayer.getQueue();
        if (currentPlaylist) {
            if (!tracks.length) {
                if (playbackOptions.mode === PlaybackMode.RANDOMIZE) {
                    const initialSongs = getRandomizedSongs(
                        currentPlaylist,
                        options.randomizationForwardBuffer,
                        playbackOptions.randomizeOptions.weighted,
                        options.randomizationShouldNotRepeatSongs
                    );
                    dispatch(setCurrentPlayArray(initialSongs));
                    await TrackPlayer.add(convertSongListToTracks(initialSongs));
                } else {
                    // Here we need to take back from the play array because we are resuming,
                    // not playing a new playlist
                    await TrackPlayer.add(convertSongListToTracks(currentPlaylist.playArray));
                    if (currentPlaylist.lastSongPlayed && !playable(playbackState)) {
                        await TrackPlayer.skip(currentPlaylist.lastSongPlayed);
                    }
                }
            }
            TrackPlayer.play();
        }
    }

    useEffect(() => {
        setCurrentSong(currentPlaylist?.playArray[currentTrack]);
        // @ts-ignore
        pickerRef.current?.scrollToIndex({
            animated: true,
            index: currentTrack,
            viewPosition: 0.5
        });
    }, [currentTrack]);

    const renderSongCard = ({ item, index }: { item: Song, index: number }) => (
        <Pressable onPress={async () => await TrackPlayer.skip(index)}>
            <SongCard
                song={item}
                colorScheme={isDarkMode ? 'dark' : 'light'}
                isPlaying={currentSong && currentTrack === index}
                animated={{ index, yOffset: translationY }}
            />
        </Pressable>
    );

    const songView = () => !!(currentPlaylist && currentSong) && (
        <View style={styles.scrollView}>
            <Animated.FlatList
                data={currentPlaylist.playArray}
                renderItem={renderSongCard}
                keyExtractor={(item, index) => getSongId(item) + index}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                ref={pickerRef}
                getItemLayout={(data, index) => (
                    {length: CARD_HEIGHT, offset: CARD_HEIGHT * index, index}
                )}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {songView()}
            <PlaybackControl
                play={() => startPlayback()}
                pause={() => TrackPlayer.pause()}
                restart={() => TrackPlayer.seekTo(0)}
                seek={pos => TrackPlayer.seekTo(pos)}
                setVol={() => {}}
                skipBack={() => TrackPlayer.skipToPrevious()}
                skipForward={() => TrackPlayer.skipToNext()}
                stop={() => TrackPlayer.stop()}
                repeatMode={repeatMode}
                setRepeatMode={setRepeatMode}
            />
        </SafeAreaView>
    )
};

export default Playback;
