import { DarkTheme, DefaultTheme, NavigationContainer, NavigationProp, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Pressable, useColorScheme, View } from "react-native";
import TrackPlayer, { State, usePlaybackState } from "react-native-track-player";
import Icon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colorScheme } from "../constant/Color";
import ArtistScreen from "../screens/ArtistScreen/ArtistScreen";
import Home from "../screens/Home/Home";
import NewPlaylist from "../screens/NewPlaylist/NewPlaylist";
import Options from "../screens/Options/Options";
import Playback from "../screens/PlaybackScreen/Playback";
import Playlist from "../screens/Playlist/Playlist";
import PlaylistList from "../screens/PlaylistList/PlaylistList";
import { useTypedSelector } from "../state/reducers";
import styles from "./HomeNavigator.style";

export type HomeStackNavigatorParams = {
    Home: undefined;
    ArtistScreen: undefined;
    Options: undefined;
    NewPlaylist: undefined;
    Playback: undefined;
    Playlist: undefined;
    PlaylistList: undefined;
};
const Stack = createNativeStackNavigator<HomeStackNavigatorParams>();

const darkTheme = {
    dark: true,
    colors: {
        primary: 'crimson',
        background: colorScheme.dark.background,
        card: 'crimson',
        text: colorScheme.dark.content,
        border: colorScheme.dark.outline,
        notification: 'red'
    }
};

const lightTheme = {
    dark: false,
    colors: {
        primary: 'skyblue',
        background: colorScheme.light.background,
        card: 'skyblue',
        text: colorScheme.light.content,
        border: colorScheme.light.outline,
        notification: 'royalblue'
    }
}

export const HomeNavigator = () => {
    const options = useTypedSelector(state => state.Options);
    const colorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : colorScheme === 'dark';
    const currentArtist = useTypedSelector(state => state.Albums.selectedArtist);
    const savedPlaylists = useTypedSelector(state => state.Playlist.savedPlaylists);
    const playbackState = usePlaybackState();
    const playing = playbackState === State.Playing;

    const playable = () => {
        switch (playbackState) {
            case State.Playing:
            case State.Paused:
            case State.Buffering:
                return true;
            default:
                return false;
        }
    };

    const playbackButton = () => playable() && (playing ? (
        <Pressable style={styles.optionButton} onPress={TrackPlayer.pause} onLongPress={TrackPlayer.stop}>
            <Icon name="caretright" size={20} />
        </Pressable>
    ) : (
        <Pressable style={styles.optionButton} onPress={TrackPlayer.play}>
            <Icon name="pause" size={20} />
        </Pressable>
    ));

    const optionsButton = (navigation: NavigationProp<any>) => (
        <Pressable style={styles.optionButton} onPress={() => navigation.navigate('Options')}>
            <Icon name="setting" size={20} />
        </Pressable>
    );

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

    return (
        <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme}>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={Home}
                    options={({ navigation }: { navigation: NavigationProp<any> }) => ({
                        headerTitle: 'Home',
                        headerRight: () => (
                            <View style={styles.headerContainer}>
                                {optionsButton(navigation)}
                                {playlistButton(navigation)}
                                {playbackButton()}
                            </View>
                        )
                    })}
                />
                <Stack.Screen
                    name="ArtistScreen"
                    component={ArtistScreen}
                    options={{
                        headerTitle: `${currentArtist && currentArtist.artist || 'Artist'}`
                    }}
                />
                <Stack.Screen
                    name="Options"
                    component={Options}
                    options={{
                        headerTitle: 'Options'
                    }}
                />
                <Stack.Screen
                    name="NewPlaylist"
                    component={NewPlaylist}
                    options={{
                        headerTitle: 'New Playlist'
                    }}
                />
                <Stack.Screen
                    name="PlaylistList"
                    component={PlaylistList}
                    options={({ navigation }: { navigation: NavigationProp<any> }) => ({
                        headerTitle: 'Saved Playlists',
                        headerRight: () => (
                            <View>
                                {addPlaylistButton(navigation)}
                            </View>
                        )
                    })}
                />
                <Stack.Screen
                    name="Playback"
                    component={Playback}
                    options={{
                        headerTitle: 'Playback'
                    }}
                />
                <Stack.Screen
                    name="Playlist"
                    component={Playlist}
                    options={{
                        headerTitle: 'Playlist'
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
