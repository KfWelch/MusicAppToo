import React, { createRef, useEffect } from 'react';
import { Pressable, Text, useColorScheme, View } from 'react-native';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import NumericInput from 'react-native-numeric-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colorScheme } from '../../../constant/Color';
import { Song } from '../../../models/MusicModel';
import { useTypedSelector } from '../../../state/reducers';
import styles from './SongCard.style';

interface SongCardProps {
    song: Song;
    onRemove?: () => void;
    onAdd?: () => void;
    onWeightChange?: (value: number) => void;
    distFromCurrent?: number;
}

const zooms = [
    1,
    .9,
    .8,
    .7
];

const SongCard = (props: SongCardProps) => {
    const { song, onAdd, onRemove, onWeightChange, distFromCurrent } = props;
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : systemColorScheme === 'dark';
    
    const weightView = () => onWeightChange && (
        <View style={styles.infoView}>
            <Text style={styles.subtitle}>Randomization weight</Text>
            <NumericInput
                value={song.weight}
                minValue={1}
                rounded
                onChange={onWeightChange}
                textColor={colorScheme[isDarkMode ? 'dark' : 'light'].content}
            />
        </View>
    );

    const removeView = () => onRemove && (
        <Pressable onLongPress={onRemove}>
            <MaterialCommunityIcons name="music-note-off" size={30} />
        </Pressable>
    );

    const addView = () => onAdd && (
        <Pressable onPress={onAdd}>
            <MaterialCommunityIcons name="plus-box-outline" size={30} />
        </Pressable>
    );

    const zoomRef = createRef<ReactNativeZoomableView>();

    useEffect(() => {
        if (distFromCurrent !== undefined) {
            zoomRef.current?.zoomTo(distFromCurrent < 4 ? zooms[distFromCurrent] : zooms[3]);
        }
    }, [distFromCurrent])

    return (
        <ReactNativeZoomableView
            zoomEnabled={false}
            style={styles.cardView}
            initialZoom={1}
            ref={zoomRef}
        >
            <MaterialCommunityIcons name="music-box-outline" size={40} />
            {/* <Text style={styles.indexNumber}>{`${song.position || song.numberInAlbum || ''})`}</Text> */}
            <View style={styles.infoView}>
                <Text style={styles.title}>{song.title}</Text>
                <Text style={styles.subtitle}>{song.albumName}</Text>
            </View>
            {weightView()}
            {addView()}
            {removeView()}
        </ReactNativeZoomableView>
    );
};

export default SongCard;
