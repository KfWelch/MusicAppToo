import React from "react";
import { FlatList, View } from "react-native";
import TrackPlayer, { Track } from 'react-native-track-player';
import { Album } from "../../models/MusicModel";
import { useTypedSelector } from "../../state/reducers";
import { convertSongToTrack } from "../../utils/musicUtils";
import DropDownCard from "../Cards/DropDownCard/DropDownCard";
import styles from "./AlbumList.style";

const AlbumList = () => {
    const albums = useTypedSelector(state => state.Albums);
    const currentArtist = albums.selectedArtist;
    const currentAlbums = albums.artists.find(artist => artist.artist === currentArtist?.artist)?.albums;

    const selectSong = async (albumName: string, songText: string) => {
        const tracks: Track[] = [];
        console.log('albumName and songText', albumName, songText);
        if (songText === albumName) {
            const songs = currentAlbums?.find(album => album.albumName === albumName)?.songs;
            if (songs) {
                songs.forEach(song => {
                    tracks.push(convertSongToTrack(song));
                });
            }
        } else {
            const song = currentAlbums?.find(album => album.albumName === albumName)?.songs.find(song => song.title === songText);
            if (song) {
                tracks.push(convertSongToTrack(song));
            }
        }
        TrackPlayer.add(tracks);
    };

    const renderItem = ({ item }: { item: Album }) => (
        <DropDownCard
            mainItem={item.albumName}
            mainItemHelperText={`${item.songs.length} songs`}
            subItems={item.songs.reduce((prevVal, currVal) => prevVal.concat(currVal.title), [] as string[])}
            onItemClick={text => selectSong(item.albumName, text)}
        />
    );

    const itemSeparator = () => (<View style={styles.itemSeparator} />);

    return (
        <FlatList
            data={currentAlbums}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.albumName}-${index}`}
            ItemSeparatorComponent={itemSeparator}
        />
    )
}

export default AlbumList;
