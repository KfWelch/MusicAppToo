import React from "react";
import { ProgressBarAndroidBase, SafeAreaView, TouchableOpacity, View } from "react-native";
import TrackPlayer, { State, usePlaybackState, useProgress } from 'react-native-track-player';
import Icon from "react-native-vector-icons/AntDesign";
import styles from "./PlaybackControl.style";

interface PlaybackControlProps {
    play: () => void;
    pause: () => void;
    stop: () => void;
    restart: () => void;
    seek: (pos: number) => void;
    setVol: (volume: number) => void;
    skipForward: () => void;
    skipBack: () => void;
    skipTo: () => void;
}

const PlaybackControl = (props: PlaybackControlProps) => {
    const { play, pause, stop, restart, seek, setVol, skipForward, skipBack, skipTo } = props;
    const progress = useProgress();
    const playbackState = usePlaybackState();
    const playing = playbackState === State.Playing;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                <ProgressBarAndroidBase
                    progress={progress.position / progress.duration}
                />
            </View>
            <View style={styles.controlsContainer}>
                <TouchableOpacity onPress={skipBack}>
                    <Icon name="stepBackward" size={30}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => playing ? pause() : play()}>
                    <Icon name={playing ? 'pause' : 'caretright'} size={40} />
                </TouchableOpacity>
                <TouchableOpacity onPress={skipForward}>
                    <Icon name="stepforward" size={30} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
};

export default PlaybackControl;
