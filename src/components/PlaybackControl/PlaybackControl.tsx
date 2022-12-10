// @ts-ignore
import Slider from 'react-native-sliders';
import React, { useState } from 'react';
import {
    SafeAreaView,
    Pressable,
    View,
    Dimensions,
    Text
} from 'react-native';
import {
    RepeatMode,
    State,
    usePlaybackState,
    useProgress
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getMinSec } from '../../utils/timeUtils';
import styles from './PlaybackControl.style';

const width = Dimensions.get('window').width;

interface PlaybackControlProps {
    play: () => void;
    pause: () => void;
    stop?: () => void;
    restart: () => void;
    seek: (pos: number) => void;
    setVol: (volume: number) => void;
    skipForward: () => void;
    skipBack: () => void;
    repeatMode: RepeatMode;
    setRepeatMode: React.Dispatch<React.SetStateAction<RepeatMode>>
}

const PlaybackControl = (props: PlaybackControlProps) => {
    const {
        play,
        pause,
        stop,
        restart,
        seek,
        setVol,
        skipForward,
        skipBack,
        repeatMode,
        setRepeatMode
    } = props;
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
    );

    const repeatIcon = () => {
        let icon = '';
        switch (repeatMode) {
            case RepeatMode.Off:
                icon = 'repeat-off';
                break;
            case RepeatMode.Queue:
                icon = 'repeat';
                break;
            case RepeatMode.Track:
                icon = 'repeat-once';
                break;
            default:
                icon = 'repeat-off';
        }
        return (
            <MaterialCommunityIcons name={icon} size={20} />
        );
    };

    const setRepeat = () => {
        switch (repeatMode) {
            case RepeatMode.Off:
                setRepeatMode(RepeatMode.Queue);
                break;
            case RepeatMode.Queue:
                setRepeatMode(RepeatMode.Track);
                break;
            case RepeatMode.Track:
                setRepeatMode(RepeatMode.Off);
                break;
            default:
                setRepeatMode(RepeatMode.Off);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.progressContainer}>
                {sliderNumberView()}
                <Slider
                    value={progress.position || 0}
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
                <Pressable onPress={restart} hitSlop={5}>
                    <MaterialCommunityIcons name="replay" size={20} />
                </Pressable>
                <Pressable onPress={skipBack}>
                    <Icon name="stepbackward" size={30} />
                </Pressable>
                <Pressable onPress={() => playing ? pause() : play()} onLongPress={stop}>
                    <Icon name={playing ? 'pause' : 'caretright'} size={40} />
                </Pressable>
                <Pressable onPress={skipForward}>
                    <Icon name="stepforward" size={30} />
                </Pressable>
                <Pressable onPress={setRepeat} hitSlop={5}>
                    {repeatIcon()}
                </Pressable>
            </View>
        </SafeAreaView>
    )
};

export default PlaybackControl;
