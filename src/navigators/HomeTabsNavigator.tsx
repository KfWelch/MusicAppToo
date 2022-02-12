import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { usePlaybackState } from 'react-native-track-player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../screens/Home/Home';
import Playback from '../screens/PlaybackScreen/Playback';
import PlaylistList from '../screens/PlaylistList/PlaylistList';
import { playable } from '../utils/trackPlayUtils';

export type HomeTabNavParams = {
    Home: undefined;
    PlaylistList: undefined;
    Playback: undefined;
};
const Tab = createBottomTabNavigator<HomeTabNavParams>();

interface TabNavProps {
    currentTab: string;
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
}

const HomeTabs = (props: TabNavProps) => {
    const playbackState = usePlaybackState();
    const navigation = useNavigation();

    const homeIcon = (size: number, color: string) => (
        <MaterialCommunityIcons name="record-circle-outline" size={size} color={color} />
    );

    const playlistListIcon = (size: number, color: string) => (
        <MaterialCommunityIcons name="playlist-music-outline" size={size} color={color} />
    );

    const playbackIcon = (size: number, color: string) => (
        <MaterialCommunityIcons name="playlist-play" size={size} color={color} />
    );

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                listeners={{
                    focus: () => props.setCurrentTab('Home')
                }}
                options={{
                    tabBarIcon: props => homeIcon(props.size, props.color)
                }}
            />
            <Tab.Screen
                name="PlaylistList"
                component={PlaylistList}
                listeners={{
                    focus: () => props.setCurrentTab('PlaylistList')
                }}
                options={{
                    tabBarIcon: props => playlistListIcon(props.size, props.color)
                }}
            />
            <Tab.Screen
                name="Playback"
                component={Playback}
                listeners={{
                    focus: () => props.setCurrentTab('Playback')
                }}
                options={{
                    tabBarIcon: props => playbackIcon(props.size, props.color)
                }}
            />
        </Tab.Navigator>
    );
};

export default HomeTabs;
