import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer, { Event, useTrackPlayerEvents } from "react-native-track-player";
import SongCard from "../../components/Cards/SongCard/SongCard";
import PlaybackControl from "../../components/PlaybackControl/PlaybackControl";
import { Song } from "../../models/MusicModel";
import { useTypedSelector } from "../../state/reducers";

const Playback = () => {
    const currentPlaylist = useTypedSelector(state => state.Playlist.currentPlaylist);
    const [currentTrack, setCurrentTrack] = useState(0);
    const [currentSong, setCurrentSong] = useState<Song | undefined>(undefined);

    useTrackPlayerEvents([Event.PlaybackTrackChanged], event => {
        if (event.type === Event.PlaybackTrackChanged) {
            TrackPlayer.getCurrentTrack().then(value => {
                setCurrentTrack(value);
            });
        }
    });

    useEffect(() => {
        setCurrentSong(currentPlaylist?.playArray[currentTrack]);
    }, [currentTrack]);

    const currentSongView = () => currentSong && (
        <SongCard song={currentSong} />
    );

    return (
        <SafeAreaView>
            <Text>Current track</Text>
            {currentSongView()}
            <PlaybackControl
                play={() => TrackPlayer.play()}
                pause={() => TrackPlayer.pause()}
                restart={() => {}}
                seek={() => {}}
                setVol={() => {}}
                skipBack={() => TrackPlayer.skipToPrevious()}
                skipForward={() => TrackPlayer.skipToNext}
                skipTo={() => {}}
                stop={() => {}}
            />
        </SafeAreaView>
    )
};

export default Playback;
