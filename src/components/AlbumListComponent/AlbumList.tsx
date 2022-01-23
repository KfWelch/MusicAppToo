import React from "react";
import { FlatList, View } from "react-native";
import { Album } from "../../models/MusicModel";
import { useTypedSelector } from "../../state/reducers";
import DropDownCard from "../DropDownCard/DropDownCard";
import styles from "./AlbumList.style";

const AlbumList = () => {
    const albums = useTypedSelector(state => state.Albums);
    const currentArtist = albums.selectedArtist;
    const currentAlbums = albums.artists.find(artist => artist.artist === currentArtist?.artist)?.albums;

    const selectSong = (albumName: string, song: string) => {
        // TODO implement playing song
    };

    const renderItem = ({ item }: { item: Album }) => (
        <DropDownCard
            mainItem={`${item.albumName} - ${item.songs.length} songs`}
            subItems={item.songs.reduce((prevVal, currVal) => prevVal.concat(currVal.title), [] as string[])}
            onItemClick={text => selectSong(item.albumName, text)}
        />
    );

    const itemSeparator = () => (<View style={styles.itemSeparator} />);

    return (
        <FlatList
            data={currentAlbums}
            renderItem={renderItem}
            keyExtractor={item => item.albumName}
            ItemSeparatorComponent={itemSeparator}
        />
    )
}

export default AlbumList
