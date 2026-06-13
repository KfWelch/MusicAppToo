import React from 'react';
import {Pressable, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Artist} from '../../../models/MusicModel';
import styles from './ArtistCard.style';

interface ArtistCardProps {
    artist: Artist;
    onAdd?: () => void;
    onRemove?: () => void;
    searched?: string;
}

export const getFoundColor = (artist: Artist, searched?: string) => {
    if (searched) {
        if (artist.artist.toLowerCase().includes(searched.toLowerCase())) {
            return 'yellow';
        } else if (
            artist.albums.some(
                album =>
                    album.albumName.toLowerCase().includes(searched.toLowerCase()) ||
                    album.songs.some(song => song.title.toLowerCase().includes(searched.toLowerCase()))
            )
        ) {
            return 'orange';
        }
    }
};

const ArtistCard = (props: ArtistCardProps) => {
    const {artist, onAdd, onRemove, searched} = props;

    const removeView = () =>
        onRemove && (
            <Pressable onPress={onRemove}>
                <MaterialCommunityIcons name="minus-box-multiple" size={30} />
            </Pressable>
        );

    const addView = () =>
        onAdd && (
            <Pressable onPress={onAdd}>
                <MaterialCommunityIcons name="plus-box-multiple" size={30} />
            </Pressable>
        );

    return (
        <View style={styles.cardView}>
            <MaterialCommunityIcons name="head" size={40} />
            <View style={styles.infoView}>
                <Text style={{...styles.title, color: getFoundColor(artist, searched)}}>{artist.artist}</Text>
                <Text style={styles.subtitle}>{`${artist.albums.length} album${
                    artist.albums.length === 1 ? '' : 's'
                }`}</Text>
            </View>
            {addView()}
            {removeView()}
        </View>
    );
};

export default ArtistCard;
