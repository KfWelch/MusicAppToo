import React, { useEffect, useRef, useState } from "react";
import { Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, { Event, useTrackPlayerEvents } from "react-native-track-player";
import SmoothPicker from 'react-native-smooth-picker';
import SongCard from "../../components/Cards/SongCard/SongCard";
import PlaybackControl from "../../components/PlaybackControl/PlaybackControl";
import { Song } from "../../models/MusicModel";
import { useTypedSelector } from "../../state/reducers";
import { getSongId } from "../../utils/musicUtils";
import styles from "./Playback.style";
import { colorScheme } from "../../constant/Color";

const Playback = () => {
    const currentPlaylist = useTypedSelector(state => state.Playlist.currentPlaylist);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : systemColorScheme === 'dark';

    useTrackPlayerEvents([Event.PlaybackTrackChanged], event => {
        if (event.type === Event.PlaybackTrackChanged) {
            TrackPlayer.getCurrentTrack().then(value => {
                setCurrentTrack(value);
            });
        }
    });

    const currentSongView = () => currentSong && (
        <SongCard song={currentSong} />
    );

    const pickerRef = useRef(null);

    useEffect(() => {
        setCurrentSong(currentPlaylist?.playArray[currentTrack]);
        // @ts-ignore
        pickerRef.current?.scrollToIndex({
            animated: true,
            index: currentTrack
        });
    }, [currentTrack]);

    const songView = () => !!(currentPlaylist && currentSong) && (
        <View style={styles.scrollView}>
            <SmoothPicker
                data={currentPlaylist.playArray}
                keyExtractor={(item, index) => `${getSongId(item)}-${index}`}
                renderItem={({ item, index }: { item: Song, index: number }) => (
                    <View style={{ ...styles.songCardView, borderColor: colorScheme[isDarkMode ? 'dark' : 'light'].outline}}>
                        <SongCard song={item} distFromCurrent={Math.abs(index - currentTrack)} />
                    </View>
                )}
                initialScrollToIndex={currentTrack}
                scrollAnimation
                refFlatList={pickerRef}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {songView()}
            <PlaybackControl
                play={() => TrackPlayer.play()}
                pause={() => TrackPlayer.pause()}
                restart={() => {}}
                seek={() => {}}
                setVol={() => {}}
                skipBack={() => TrackPlayer.skipToPrevious()}
                skipForward={() => TrackPlayer.skipToNext()}
                skipTo={() => {}}
                stop={() => {}}
            />
        </SafeAreaView>
    )
};

export default Playback;
