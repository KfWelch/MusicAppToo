import { NavigationProp } from "@react-navigation/native";
import React from "react";
import { FlatList, Pressable, SafeAreaView, Switch, Text, useColorScheme, View } from "react-native";
import NumericInput from "react-native-numeric-input";
import TrackPlayer from "react-native-track-player";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from "react-redux";
import { Album, Playlist, Song } from "../../../models/MusicModel";
import { removeAlbumFromPlaylist, removePlaylist, removeSongFromPlaylist, setAlbumOrdered, setCurrentPlayArray, setCurrentPlaylist, setSongWeight, shuffleCurrentPlaylist } from "../../../state/actions/Playlist";
import { convertSongListToTracks, getAlbumId, getPlayArray, getSongId } from "../../../utils/musicUtils";
import AlbumCard from "../AlbumCard/AlbumCard";
import SongCard from "../SongCard/SongCard";
import ComponentDropDown from "../ComponentDropDown/ComponentDropDown";
import styles from "./PlaylistCard.style";
import { useTypedSelector } from "../../../state/reducers";
import { PlaybackMode } from "../../../state/reducers/Playlist";
import { getRandomizedNextSong } from "../../../utils/PlaylistRandomization";
import { spreadOrderedAlbumShuffle } from "../../../utils/OrderedAlbumShuffle";

interface PlaylistCardProps {
    playlist: Playlist,
    navigation: NavigationProp<any>
}

const PlaylistCard = (props: PlaylistCardProps) => {
    const { playlist } = props;
    const dispatch = useDispatch();
    const options = useTypedSelector(state => state.Options);
    const { currentPlaylist, playbackOptions } = useTypedSelector(state => state.Playlist);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : systemColorScheme === 'dark';
    const scheme = isDarkMode ? 'dark' : 'light';

    const flatListItemSeparator = () => (<View style={styles.flatlistSeparator} />);

    const renderAlbumSong = ({ item }: { item: Song }) => (<SongCard song={item} colorScheme={scheme} />);

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
            colorScheme={scheme}
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
        await TrackPlayer.reset();
        dispatch(setCurrentPlaylist(playlist));
        switch (playbackOptions.mode) {
            case PlaybackMode.NORMAL:
                const playArray = getPlayArray(playlist);
                setCurrentPlayArray(playArray);
                await TrackPlayer.add(convertSongListToTracks(playArray));
                break;
            case PlaybackMode.SHUFFLE:
                if (currentPlaylist) {
                    dispatch(setCurrentPlayArray(getPlayArray(currentPlaylist)));
                    dispatch(shuffleCurrentPlaylist());
                    await TrackPlayer.add(convertSongListToTracks(currentPlaylist.playArray));
                }
                break;
            case PlaybackMode.RANDOMIZE:
                const initialSongs: Song[] = [];
                for (let i = 0; i < options.randomizationForwardBuffer; i++) {
                    initialSongs.push(getRandomizedNextSong(
                        playlist,
                        playbackOptions.randomizeOptions.weighted
                    ));
                }
                dispatch(setCurrentPlayArray(initialSongs));
                await TrackPlayer.add(convertSongListToTracks(initialSongs));
                break;
            default:
                return;
        }
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
