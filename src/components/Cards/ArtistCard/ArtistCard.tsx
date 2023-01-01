import React from 'react';
import { Pressable, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Artist } from '../../../models/MusicModel';
import styles from './ArtistCard.style';

interface ArtistCardProps {
    artist: Artist;
    onAdd?: () => void;
    onRemove?: () => void;
}

const ArtistCard = (props: ArtistCardProps) => {
    const { artist, onAdd, onRemove } = props;

    const removeView = () => onRemove && (
        <Pressable onPress={onRemove}>
            <MaterialCommunityIcons name="minus-box-multiple" size={30} />
        </Pressable>
    );

    const addView = () => onAdd && (
        <Pressable onPress={onAdd}>
            <MaterialCommunityIcons name="plus-box-multiple" size={30} />
        </Pressable>
    );

    return (
        <View style={styles.cardView}>
            <MaterialCommunityIcons name="head" size={40} />
            <View style={styles.infoView}>
                <Text style={styles.title}>{artist.artist}</Text>
                <Text style={styles.subtitle}>{`${artist.albums.length} album${artist.albums.length === 1 ? '' : 's'}`}</Text>
            </View>
            {addView()}
            {removeView()}
        </View>
    )
}

export default ArtistCard;
