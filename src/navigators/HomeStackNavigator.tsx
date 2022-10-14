import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';
import Icon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './HomeNavigator.style';
import ArtistScreen from '../screens/ArtistScreen/ArtistScreen';
import NewPlaylist from '../screens/NewPlaylist/NewPlaylist';
import Playlist from '../screens/Playlist/Playlist';
import { useTypedSelector } from '../state/reducers';
import HomeTabs from './HomeTabsNavigator';
import { playable } from '../utils/trackPlayUtils';
import { useDispatch } from 'react-redux';
import { setPlaylistToEdit } from '../state/actions/Playlist';

export type HomeStackNavigatorParams = {
    HomeTabs: undefined;
    ArtistScreen: undefined;
    NewPlaylist: undefined;
    Playlist: undefined;
};
const Stack = createNativeStackNavigator<HomeStackNavigatorParams>();

const HomeStack = () => {
    const currentArtist = useTypedSelector(state => state.Albums.selectedArtist);
    const { savedPlaylists } = useTypedSelector(state => state.Playlist);
    const { newPlaylist } = useTypedSelector(state => state.Playlist);
    const dispatch = useDispatch();
    const playbackState = usePlaybackState();
    const [currentTab, setCurrentTab] = useState('Home');
    const playing = playbackState === State.Playing;

    const playbackButton = () => playable(playbackState) && (playing ? (
        <Pressable style={styles.optionButton} onPress={TrackPlayer.pause} onLongPress={TrackPlayer.stop}>
            <Icon name="caretright" size={20} />
        </Pressable>
    ) : (
        <Pressable style={styles.optionButton} onPress={TrackPlayer.play}>
            <Icon name="pause" size={20} />
        </Pressable>
    ));

    const playlistButton = (navigation: NavigationProp<any>) => (
        <Pressable style={styles.optionButton} onPress={() => navigation.navigate(savedPlaylists.length ? 'PlaylistList' : 'NewPlaylist')}>
            <MaterialCommunityIcons name={savedPlaylists.length ? 'playlist-music' : 'playlist-plus'} size={25} />
        </Pressable>
    );

    const addPlaylistButton = (navigation: NavigationProp<any>) => (
        <Pressable style={styles.optionButton} onPress={() => navigation.navigate('NewPlaylist')}>
            <MaterialCommunityIcons name="playlist-plus" size={30} />
        </Pressable>
    );

    const editPlaylistButton = (navigation: NavigationProp<any>) => (
        <Pressable style={styles.optionButton} onPress={() => {
            dispatch(setPlaylistToEdit());
            navigation.navigate('NewPlaylist')
        }}>
            <MaterialCommunityIcons name="playlist-edit" size={30} />
        </Pressable>
    );    

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="HomeTabs"
                options={({ navigation }: { navigation: NavigationProp<any> }) => ({
                    headerTitle: 'Home',
                    headerRight: () => (
                        <View style={styles.headerContainer}>
                            {currentTab === 'PlaylistList' ? addPlaylistButton(navigation) : playlistButton(navigation)}
                            {playbackButton()}
                        </View>
                    )
                })}
            >{props => <HomeTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />}</Stack.Screen>
            <Stack.Screen
                name="ArtistScreen"
                component={ArtistScreen}
                options={{
                    headerTitle: `${currentArtist && currentArtist.artist || 'Artist'}`
                }}
            />
            <Stack.Screen
                name="NewPlaylist"
                component={NewPlaylist}
                options={{
                    headerTitle: newPlaylist.title ? 'Edit Playlist' : 'New Playlist'
                }}
            />
            <Stack.Screen
                name="Playlist"
                component={Playlist}
                options={({ navigation }: { navigation: NavigationProp<any> }) => ({
                    headerTitle: 'Playlist',
                    headerRight: () => (
                        editPlaylistButton(navigation)
                    )
                })}
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
