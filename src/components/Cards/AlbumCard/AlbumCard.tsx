import React from 'react';
import {
    Pressable,
    Switch,
    Text,
    View
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Album } from '../../../models/MusicModel';
import styles from './AlbumCard.style';

interface AlbumCardProps {
    album: Album;
    setAlbumOrdered?: (value: boolean) => void;
    onRemove?: () => void;
    onAdd?: () => void;
    onPlay?: () => void;
}

const AlbumCard = (props: AlbumCardProps) => {
    const { album, setAlbumOrdered, onAdd, onRemove, onPlay } = props;

    const orderedAlbumSelectorView = (ordered = false) => setAlbumOrdered && (
        <View style={{...styles.infoView, flex: 1}}>
            <Text style={styles.subsubtitle}>Order this album?</Text>
            <Switch value={ordered} onValueChange={setAlbumOrdered} />
        </View>
    );

    const removeView = () => onRemove && (
        <Pressable onPress={onRemove}>
            <MaterialCommunityIcons name="music-off" size={30} />
        </Pressable>
    );

    const playView = () => onPlay && (
        <Pressable onPress={onPlay}>
            <MaterialCommunityIcons name="play-outline" size={30} />
        </Pressable>
    );

    const addView = () => onAdd && (
        <Pressable onPress={onAdd}>
            <MaterialCommunityIcons name="plus-box-multiple-outline" size={30} />
        </Pressable>
    );

    return (
        <View style={styles.cardView}>
            <MaterialCommunityIcons name="music-box-multiple-outline" size={40} />
            <View style={{...styles.infoView, flex: 3}}>
                <Text style={styles.title}>{album.albumName}</Text>
                <Text style={styles.subtitle}>{album.artistName}</Text>
                <Text style={styles.subtitle}>{`${album.songs.length} songs`}</Text>
            </View>
            {orderedAlbumSelectorView(album.ordered)}
            {playView()}
            {addView()}
            {removeView()}
        </View>
    );
};

export default AlbumCard;
