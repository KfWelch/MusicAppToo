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
import { Button, FlatList, SafeAreaView, Text } from 'react-native';
import ArtistCard from '../../components/Cards/ArtistCard/ArtistCard';
import { getAlbumId, getSongId } from '../../utils/musicUtils';
import { TextInput } from 'react-native-gesture-handler';

const Tab = createMaterialTopTabNavigator();

const NewPlaylist = () => {
    const artists = useTypedSelector(state => state.Albums.artists);
    const newPlaylist = useTypedSelector(state => state.Playlist.newPlaylist);
    const savedPlaylists = useTypedSelector(state => state.Playlist.savedPlaylists);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [playlistName, setPlaylistName] = useState('');
    
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
                />
            )}
        />
    );

    const availableArtistView = ({ item }: { item: Artist }) => (
        <ComponentDropDown
            mainItemCard={(<ArtistCard artist={item} />)}
            subItemFlatlist={(
                <FlatList
                    data={item.albums}
                    renderItem={availableAlbumView}  
                />
            )}
        />
    );

    const availableMusicView = () => (
        <SafeAreaView>
            <FlatList
                data={artists}
                renderItem={availableArtistView}
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
                />
            )}
        />
    );

    const selectedSongView = ({ item }: { item: Song }) => (
        <SongCard song={item} onRemove={() => dispatch(removeSong(getSongId(item)))} />
    );

    const selectedMusicView = () => (
        <SafeAreaView>
            <Text>Enter playlist name</Text>
            <TextInput value={playlistName} onChangeText={setPlaylistName} />
            <Text>Albums</Text>
            <FlatList
                data={newPlaylist.albums}
                renderItem={selectedAlbumView}
            />
            <Text>Individual songs</Text>
            <FlatList
                data={newPlaylist.individualSongs}
                renderItem={selectedSongView}
            />
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
