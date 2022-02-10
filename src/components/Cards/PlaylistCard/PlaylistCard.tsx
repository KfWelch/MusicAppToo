import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { FlatList, Pressable, SafeAreaView, Switch, Text, View } from "react-native";
import NumericInput from "react-native-numeric-input";
import TrackPlayer from "react-native-track-player";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from "react-redux";
import { Album, Playlist, Song } from "../../../models/MusicModel";
import { removeAlbumFromPlaylist, removePlaylist, removeSongFromPlaylist, setAlbumOrdered, setCurrentPlaylist, setSongWeight } from "../../../state/actions/Playlist";
import { convertSongListToTracks, getAlbumId, getSongId } from "../../../utils/musicUtils";
import AlbumCard from "../AlbumCard/AlbumCard";
import SongCard from "../SongCard/SongCard";
import ComponentDropDown from "../ComponentDropDown/ComponentDropDown";
import styles from "./PlaylistCard.style";

interface PlaylistCardProps {
    playlist: Playlist,
    navigation: NavigationProp<any>
}

const PlaylistCard = (props: PlaylistCardProps) => {
    const { playlist } = props;
    const dispatch = useDispatch();

    const flatListItemSeparator = () => (<View style={styles.flatlistSeparator} />);

    const renderAlbumSong = ({ item }: { item: Song }) => (<SongCard song={item} />);

    const renderAlbumFlatlist = (album: Album) => (
        <View>
            <FlatList
                data={album.songs}
                renderItem={renderAlbumSong}
                ItemSeparatorComponent={flatListItemSeparator}
                keyExtractor={(item, index) => `${item.title}-${index}`}
            />
        </View>
    );

    const renderPlaylistAlbums = ({ item }: { item: Album }) => (
        <ComponentDropDown
            mainItemCard={(
                <AlbumCard
                    album={item}
                    onRemove={() => dispatch(removeAlbumFromPlaylist(getAlbumId(item), playlist.name))}
                />
            )}
            subItemFlatlist={renderAlbumFlatlist(item)}
        />
    );

    const renderPlaylistSongs = ({ item }: { item: Song}) => (
        <SongCard
            song={item}
            onRemove={() => dispatch(removeSongFromPlaylist(getSongId(item), playlist.name))}
        />
    );

    const playlistSubItemsFlatlist = () => (
        <View>
            <FlatList
                data={playlist.albums}
                renderItem={renderPlaylistAlbums}
                key="Albums"
                ItemSeparatorComponent={flatListItemSeparator}
                keyExtractor={(item, index) => `${item.albumName}-${index}`}
            />
            <FlatList
                data={playlist.songs}
                renderItem={renderPlaylistSongs}
                key="Songs"
                ItemSeparatorComponent={flatListItemSeparator}
                keyExtractor={(item, index) => `${item.title}-${index}`}
            />
        </View>
    );

    const goToPlaylist = () => {
        dispatch(setCurrentPlaylist(playlist));
        props.navigation.navigate('Playlist');
    };

    const playPlaylist = async () => {
        dispatch(setCurrentPlaylist(playlist));
        await TrackPlayer.reset();
        await TrackPlayer.add(convertSongListToTracks(playlist.playArray));
        TrackPlayer.play();
        props.navigation.navigate('Playback');
    }

    const playlistView = () => (
        <View style={styles.cardView}>
            <Pressable style={styles.infoView} onPress={goToPlaylist} onLongPress={playPlaylist}>
                <Text style={styles.title}>{playlist.name}</Text>
                <Text style={styles.subtitle}>{`Total songs: ${playlist.playArray.length}`}</Text>
            </Pressable>
            <Pressable onPress={playPlaylist}>
                <MaterialCommunityIcons name="playlist-play" size={40} />
            </Pressable>
            <Pressable onLongPress={() => dispatch(removePlaylist(playlist.name))}>
                <MaterialCommunityIcons name="playlist-remove" size={30} />
            </Pressable>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ComponentDropDown
                mainItemCard={playlistView()}
                subItemFlatlist={playlistSubItemsFlatlist()}
            />
        </SafeAreaView>
    );
};

export default PlaylistCard;
