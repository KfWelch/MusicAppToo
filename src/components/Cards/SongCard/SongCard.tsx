import React from 'react';
import {
    Dimensions,
    Pressable,
    Text,
    View
} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
    useDerivedValue
} from 'react-native-reanimated';
import colorScheme from '../../../constant/Color';
import { Song } from '../../../models/MusicModel';
import styles, { MARGIN, SongCardHeight } from './SongCard.style';

interface SongCardAnimatedProps {
    song: Song;
    onRemove?: () => void;
    onAdd?: () => void;
    onWeightChange?: (value: number) => void;
    isPlaying?: boolean;
    animated?: { index: number; yOffset: SharedValue<number> };
    colorScheme: string;
}

const height = Dimensions.get('window').height * .5;
const CARD_HEIGHT = SongCardHeight + 2 * MARGIN;

const SongCard = (props: SongCardAnimatedProps) => {
    const { song, onAdd, onRemove, onWeightChange, isPlaying, animated } = props;

    let animatedStyle: Object = {};
    if (animated) {
        const { index, yOffset } = animated;
        const position = useDerivedValue(() => {
            return index * CARD_HEIGHT - yOffset.value
        });
        const disappearHeight = -CARD_HEIGHT;
        const topHeight = 0;
        const bottomHeight = height - CARD_HEIGHT;
        const appearHeight = height;
    
        animatedStyle = useAnimatedStyle(() => {
            const translateY = yOffset.value + interpolate(
                yOffset.value,
                [0, 0.0001 + index * CARD_HEIGHT],
                [0, -index * CARD_HEIGHT],
                { extrapolateRight: Extrapolation.CLAMP }
            ) + interpolate(
                position.value,
                [bottomHeight, appearHeight],
                [0, -CARD_HEIGHT / 4],
                Extrapolation.CLAMP
            );
    
            const scale = interpolate(
                position.value,
                [disappearHeight, topHeight, bottomHeight, appearHeight],
                [0.5, 1, 1, 0.5],
                Extrapolation.CLAMP
            );
            const opacity = interpolate(
                position.value,
                [disappearHeight, topHeight, bottomHeight, appearHeight],
                [0.5, 1, 1, 0.5]
            );
    
            return {
                opacity, transform: [{ translateY }, { scale }]
            }
        });
    }
    
    const weightView = () => onWeightChange && (
        <View style={styles.infoView}>
            <Text style={styles.subtitle}>Randomization weight</Text>
            <NumericInput
                value={song.weight}
                minValue={1}
                rounded
                onChange={onWeightChange}
                textColor={colorScheme[props.colorScheme].content}
            />
        </View>
    );

    const removeView = () => onRemove && (
        <Pressable onPress={onRemove}>
            <MaterialCommunityIcons name="music-note-off" size={30} />
        </Pressable>
    );

    const addView = () => onAdd && (
        <Pressable onPress={onAdd}>
            <MaterialCommunityIcons name="plus-box-outline" size={30} />
        </Pressable>
    );

    const cardView = () => (
        <>
        <MaterialCommunityIcons
            name="music-box-outline"
            size={40}
            color={!isPlaying ? colorScheme[props.colorScheme].content : 'salmon'}
        />
        {/* <Text style={styles.indexNumber}>{`${song.position || song.numberInAlbum || ''})`}</Text> */}
        <View style={styles.infoView}>
            <Text style={styles.title}>{song.title}</Text>
            <Text style={styles.subtitle}>{song.albumName}</Text>
        </View>
        {weightView()}
        {addView()}
        {removeView()}
        </>
    );

    return !animated ? (
        <View
            style={[styles.cardView, { borderColor: colorScheme[props.colorScheme].outline }]}
        >
            {cardView()}
        </View>
    ) : (
        <Animated.View
            style={[styles.cardView, { borderColor: colorScheme[props.colorScheme].outline }, animatedStyle]}
        >
            {cardView()}
        </Animated.View>
    )
};

export default SongCard;
