import React, { useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { useTypedSelector } from '../../state/reducers';
import { Album, Artist, Song } from '../../models/MusicModel';
import SongCard from '../../components/Cards/SongCard/SongCard';
import { addAlbum, addSong, generatePlaylist, removeAlbum, removeSong } from '../../state/actions/Playlist';
import ComponentDropDown from '../../components/Cards/ComponentDropDown/ComponentDropDown';
import AlbumCard from '../../components/Cards/AlbumCard/AlbumCard';
import { Button, FlatList, SafeAreaView, Text, useColorScheme, View } from 'react-native';
import ArtistCard from '../../components/Cards/ArtistCard/ArtistCard';
import { getAlbumId, getSongId } from '../../utils/musicUtils';
import { TextInput } from 'react-native-gesture-handler';
import styles from './NewPlaylist.style';
import color, { colorScheme } from '../../constant/Color';

const Tab = createMaterialTopTabNavigator();

const NewPlaylist = () => {
    const artists = useTypedSelector(state => state.Albums.artists);
    const newPlaylist = useTypedSelector(state => state.Playlist.newPlaylist);
    const savedPlaylists = useTypedSelector(state => state.Playlist.savedPlaylists);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : systemColorScheme === 'dark';

    const [playlistName, setPlaylistName] = useState('');

    const songsInPlaylist = () => !!(newPlaylist.individualSongs.length || newPlaylist.albums.length);
    
    const availableSongView = ({ item }: { item: Song }) => (
        <SongCard song={item} onAdd={() => dispatch(addSong(item))} />
    );

    const availableAlbumView = ({ item }: { item: Album }) => (
        <ComponentDropDown
            mainItemCard={(<AlbumCard album={item} onAdd={() => dispatch(addAlbum(item))} />)}
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

    const selectedSongAlbumView = ({ item }: { item: Song }) => (<SongCard song={item} />);

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
        <SongCard song={item} onRemove={() => dispatch(removeSong(getSongId(item)))} />
    );

    const makePlaylistButton = () => (songsInPlaylist() && playlistName) ? (
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

    const selectedMusicView = () => (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={{
                    ...styles.textInput,
                    backgroundColor: colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground
                }}
                value={playlistName} onChangeText={setPlaylistName}
                placeholder="Enter Playlist Name"
                editable={songsInPlaylist()}
                textAlign='center'
            />
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
            {makePlaylistButton()}
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
