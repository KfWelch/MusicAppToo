import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import _ from 'lodash';
import { useTypedSelector } from '../../state/reducers';
import { Album, Artist, Song } from '../../models/MusicModel';
import SongCard from '../../components/Cards/SongCard/SongCard';
import { addAlbum, addSong, editPlaylist, generatePlaylist, removeAlbum, removeSong } from '../../state/actions/Playlist';
import ComponentDropDown from '../../components/Cards/ComponentDropDown/ComponentDropDown';
import AlbumCard from '../../components/Cards/AlbumCard/AlbumCard';
import { Button, FlatList, SafeAreaView, Text, useColorScheme, View } from 'react-native';
import ArtistCard from '../../components/Cards/ArtistCard/ArtistCard';
import { getAlbumId, getSongId } from '../../utils/musicUtils';
import { TextInput } from 'react-native-gesture-handler';
import styles from './NewPlaylist.style';
import { colorScheme } from '../../constant/Color';

const Tab = createMaterialTopTabNavigator();

const NewPlaylist = () => {
    const artists = useTypedSelector(state => state.Albums.artists);
    const newPlaylist = useTypedSelector(state => state.Playlist.newPlaylist);
    const savedPlaylists = useTypedSelector(state => state.Playlist.savedPlaylists);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : systemColorScheme === 'dark';

    const [playlistName, setPlaylistName] = useState('');

    navigation.addListener('focus', () => {
        if (newPlaylist.title) {
            setPlaylistName(newPlaylist.title)
        }
    });

    const areSongsInPlaylist = () => !!(newPlaylist.individualSongs.length || newPlaylist.albums.length);
    const isPlaylistEdited = (): boolean => {
        const playlist = savedPlaylists.find(playlist => playlist.name === newPlaylist.title);
        if (playlist) {
            const albumPDiff = _.differenceWith(playlist.albums, newPlaylist.albums);
            const albumNDiff = _.differenceWith(newPlaylist.albums, playlist.albums);
            const songPDiff = _.differenceWith(playlist.songs, newPlaylist.individualSongs);
            const songNDiff = _.differenceWith(newPlaylist.individualSongs, playlist.songs);
            return !!(
                albumPDiff.length || albumNDiff.length
                || songPDiff.length || songNDiff.length
            );
        }
        return true;
    };

    const albumInPlaylist = (album: Album) => newPlaylist.albums.includes(album);
    const songInPlaylist = (song: Song) => newPlaylist.individualSongs.includes(song);
    
    const availableSongView = ({ item }: { item: Song }) => (
        <SongCard
            song={item}
            onAdd={!songInPlaylist(item) ? (() => dispatch(addSong(item))) : undefined}
            onRemove={songInPlaylist(item) ? (() => dispatch(removeSong(getSongId(item)))) : undefined}
            colorScheme={isDarkMode ? 'dark' : 'light'}
        />
    );

    const availableAlbumView = ({ item }: { item: Album }) => (
        <ComponentDropDown
            mainItemCard={(
                <AlbumCard
                    album={item}
                    onAdd={!albumInPlaylist(item) ? (() => dispatch(addAlbum(item))) : undefined}
                    onRemove={albumInPlaylist(item) ? (() => dispatch(removeAlbum(getAlbumId(item)))) : undefined}
                />
            )}
            subItemFlatlist={(
                <FlatList
                    data={item.songs}  
                    renderItem={availableSongView}
                    keyExtractor={(item, index) => `${item.title}-${index}`}
                />
            )}
        />
    );

    const availableArtistView = ({ item }: { item: Artist }) => (
        <ComponentDropDown
            mainItemCard={(<ArtistCard artist={item} onAdd={() => item.albums.forEach(album => dispatch(addAlbum(album)))} />)}
            subItemFlatlist={(
                <FlatList
                    data={item.albums}
                    renderItem={availableAlbumView}
                    keyExtractor={(item, index) => `${item.albumName}-${index}`}
                />
            )}
        />
    );

    const availableMusicView = () => (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={artists}
                renderItem={availableArtistView}
                keyExtractor={(item, index) => `${item.artist}-${index}`}
            />
        </SafeAreaView>
    );

    const selectedSongAlbumView = ({ item }: { item: Song }) => (<SongCard song={item} colorScheme={isDarkMode ? 'dark' : 'light'} />);

    const selectedAlbumView = ({ item }: { item: Album }) => (
        <ComponentDropDown
            mainItemCard={(<AlbumCard album={item} onRemove={() => dispatch(removeAlbum(getAlbumId(item)))} />)}
            subItemFlatlist={(
                <FlatList
                    data={item.songs}  
                    renderItem={selectedSongAlbumView}
                    keyExtractor={(item, index) => `${item.title}-${index}`}
                />
            )}
        />
    );

    const selectedSongView = ({ item }: { item: Song }) => (
        <SongCard song={item} onRemove={() => dispatch(removeSong(getSongId(item)))} colorScheme={isDarkMode ? 'dark' : 'light'} />
    );

    const makePlaylistButton = () => (areSongsInPlaylist() && playlistName) ? (
        <View style={styles.makeButtonView}>
            <Button
                onPress={() => {
                    if (savedPlaylists.some(playlist => playlist.name === playlistName)) {
                        Toast.show({
                            type: 'error',
                            position: 'bottom',
                            text1: 'Cannot create playlist',
                            text2: 'Name already taken',
                            visibilityTime: 4000
                        });
                    } else {
                        dispatch(generatePlaylist(playlistName));
                        // @ts-ignore
                        navigation.navigate('PlaylistList');
                    }
                }}
                title="Make playlist"
            />
        </View>
    ) : null;

    const saveEditsButton = () => (areSongsInPlaylist() && isPlaylistEdited() && playlistName) ? (
        <View style={styles.makeButtonView}>
            <Button
                onPress={() => {
                    if (playlistName !== newPlaylist.title && savedPlaylists.some(playlist => playlist.name === playlistName)) {
                        Toast.show({
                            type: 'error',
                            position: 'bottom',
                            text1: 'Cannot create playlist',
                            text2: 'Name already taken',
                            visibilityTime: 4000
                        });
                    } else {
                        dispatch(editPlaylist(newPlaylist.title || '', playlistName));
                        // @ts-ignore
                        navigation.navigate('PlaylistList')
                    }
                }}
                title="Save changes"
            />
        </View>
    ) : null;

    const selectedMusicView = () => (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={{
                    ...styles.textInput,
                    backgroundColor: colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground
                }}
                value={playlistName} onChangeText={setPlaylistName}
                placeholder="Enter Playlist Name"
                editable={areSongsInPlaylist()}
                textAlign='center'
            />
            <View style={styles.selectedMusicView}>
                <View style={styles.selectedAlbums}>
                    <ComponentDropDown
                        mainItemCard={(<Text style={styles.titleText}>Albums</Text>)}
                        subItemFlatlist={(
                            <FlatList
                                data={newPlaylist.albums}
                                renderItem={selectedAlbumView}
                                keyExtractor={(item, index) => `${item.albumName}-${index}`}
                            />
                        )}
                    />
                </View>
                <View style={styles.selectedSongs}>
                    <ComponentDropDown
                        mainItemCard={(<Text style={styles.titleText}>Individual songs</Text>)}
                        subItemFlatlist={(
                            <FlatList
                                data={newPlaylist.individualSongs}
                                renderItem={selectedSongView}
                                keyExtractor={(item, index) => `${item.title}-${index}`}
                            />
                        )}
                    />
                </View>
            </View>
            {newPlaylist.title ? saveEditsButton() : makePlaylistButton()}
        </SafeAreaView>
    );

    return (
        <Tab.Navigator>
            <Tab.Screen name="Available Music">
                {() => availableMusicView()}
            </Tab.Screen>
            <Tab.Screen name="New Playlist">
                {() => selectedMusicView()}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default NewPlaylist;
