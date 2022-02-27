import Slider from "@react-native-community/slider";
import React, { useState } from "react";
import { SafeAreaView, Pressable, View, Dimensions, Text } from "react-native";
import { State, usePlaybackState, useProgress } from 'react-native-track-player';
import Icon from "react-native-vector-icons/AntDesign";
import { getMinSec } from "../../utils/timeUtils";
import styles from "./PlaybackControl.style";

const width = Dimensions.get('window').width;

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
    const progress = useProgress(100);
    const playing = usePlaybackState() === State.Playing;
    const [seeking, setSeeking] = useState(false);
    const [sliderPos, setSliderPos] = useState(0);

    const sliderNumberView = () => seeking && (
        <View style={{
            marginLeft: Math.floor(sliderPos * width * .87 / progress.duration),
            marginBottom: 15
        }}>
            <Text>{getMinSec(sliderPos)}</Text>
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                {sliderNumberView()}
                <Slider
                    value={progress.position}
                    minimumValue={0}
                    maximumValue={progress.duration}
                    onSlidingStart={() => setSeeking(true)}
                    onValueChange={(value: number) => setSliderPos(value)}
                    onSlidingComplete={(value: number) => {
                        seek(Math.floor(value));
                        setSeeking(false);
                    }}
                />
                <View style={styles.progressRow}>
                    <Text>{getMinSec(progress.position || 0)}</Text>
                    <Text>{getMinSec(progress.duration || 0)}</Text>
                </View>
            </View>
            <View style={styles.controlsContainer}>
                <Pressable onPress={skipBack}>
                    <Icon name="stepbackward" size={30} />
                </Pressable>
                <Pressable onPress={() => playing ? pause() : play()} onLongPress={stop}>
                    <Icon name={playing ? 'pause' : 'caretright'} size={40} />
                </Pressable>
                <Pressable onPress={skipForward}>
                    <Icon name="stepforward" size={30} />
                </Pressable>
            </View>
        </SafeAreaView>
    )
};

export default PlaybackControl;
