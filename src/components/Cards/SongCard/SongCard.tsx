import React from 'react';
import { Pressable, Text, View } from 'react-native';
import NumericInput from 'react-native-numeric-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Song } from '../../../models/MusicModel';
import styles from './SongCard.style';

interface SongCardProps {
    song: Song;
    onRemove?: () => void;
    onAdd?: () => void;
    onWeightChange?: (value: number) => void;
}

const SongCard = (props: SongCardProps) => {
    const { song, onAdd, onRemove, onWeightChange } = props;

    const weightView = () => onWeightChange && (
        <View style={styles.infoView}>
            <Text style={styles.subtitle}>Randomization weight</Text>
            <NumericInput value={song.weight} minValue={1} rounded onChange={onWeightChange} />
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

    return (
        <View style={styles.cardView}>
            <Text style={styles.indexNumber}>{`${song.position || song.numberInAlbum})`}</Text>
            <View style={styles.infoView}>
                <Text style={styles.title}>{song.title}</Text>
                <Text style={styles.subtitle}>{song.length}</Text>
            </View>
            {weightView()}
            {addView()}
            {removeView()}
        </View>
    );
};

export default SongCard;
