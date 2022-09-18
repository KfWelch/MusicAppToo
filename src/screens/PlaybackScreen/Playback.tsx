import React, { useEffect, useRef, useState } from "react";
import { Pressable, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, { Event, usePlaybackState, useTrackPlayerEvents } from "react-native-track-player";
import SongCard from "../../components/Cards/SongCard/SongCard";
import PlaybackControl from "../../components/PlaybackControl/PlaybackControl";
import { Song } from "../../models/MusicModel";
import { useTypedSelector } from "../../state/reducers";
import { convertSongListToTracks, convertSongToTrack, getSongId } from "../../utils/musicUtils";
import styles from "./Playback.style";
import { useDispatch } from "react-redux";
import { setCurrentPlayArray, setLastSongPlayed, setRandomNextSong } from "../../state/actions/Playlist";
import { playable } from "../../utils/trackPlayUtils";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { MARGIN, SongCardHeight } from "../../components/Cards/SongCard/SongCard.style";
import { PlaybackMode, RandomizationType } from "../../state/reducers/Playlist";
import { getRandomizedNextSong } from "../../utils/PlaylistRandomization";

const CARD_HEIGHT = SongCardHeight + MARGIN * 2;

const Playback = () => {
    const { currentPlaylist, playbackOptions } = useTypedSelector(state => state.Playlist);
    const options = useTypedSelector(state => state.Options);
    const dispatch = useDispatch();
    const playbackState = usePlaybackState();
    const [currentTrack, setCurrentTrack] = useState(0);
    const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : systemColorScheme === 'dark';

    const translationY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler((event) => {
        translationY.value = event.contentOffset.y;
    });

    useTrackPlayerEvents([Event.PlaybackTrackChanged], event => {
        if (event.type === Event.PlaybackTrackChanged) {
            TrackPlayer.getCurrentTrack().then(value => {
                setCurrentTrack(value);
                dispatch(setLastSongPlayed(value));
            });
            if (playbackOptions.mode === PlaybackMode.RANDOMIZE && currentPlaylist) {
                const nextSong: Song = getRandomizedNextSong(
                    currentPlaylist,
                    playbackOptions.randomizeOptions.weighted
                );
                dispatch(setRandomNextSong(nextSong));
                TrackPlayer.add(convertSongToTrack(nextSong));
            }
        }
    });

    const pickerRef = useRef<Animated.FlatList<Song>>(null);

    const startPlayback = async () => {
        const tracks = await TrackPlayer.getQueue();
        if (currentPlaylist) {
            if (!tracks.length) {
                if (playbackOptions.mode === PlaybackMode.RANDOMIZE) {
                    const initialSongs: Song[] = [];
                    for (let i = 0; i < options.randomizationBuffer; i++) {
                        initialSongs.push(getRandomizedNextSong(
                            currentPlaylist,
                            playbackOptions.randomizeOptions.weighted
                        ));
                    }
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
                restart={() => {}}
                seek={pos => TrackPlayer.seekTo(pos)}
                setVol={() => {}}
                skipBack={() => TrackPlayer.skipToPrevious()}
                skipForward={() => TrackPlayer.skipToNext()}
                skipTo={() => {}}
                stop={() => TrackPlayer.stop()}
            />
        </SafeAreaView>
    )
};

export default Playback;
