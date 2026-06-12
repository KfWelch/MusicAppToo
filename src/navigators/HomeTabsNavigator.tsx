import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {usePlaybackState} from 'react-native-track-player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../screens/Home/Home';
import Playback from '../screens/PlaybackScreen/Playback';
import PlaylistList from '../screens/PlaylistList/PlaylistList';
import {SearchType} from './HomeStackNavigator';
import {TextInput} from 'react-native';

export type HomeTabNavParams = {
    Home: undefined;
    PlaylistList: undefined;
    Playback: undefined;
};
const Tab = createBottomTabNavigator<HomeTabNavParams>();

interface TabNavProps {
    currentTab: string;
    setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
    searchType: SearchType;
    resetSearch: () => void;
}

const HomeTabs = (props: TabNavProps) => {
    const {searchType, resetSearch, currentTab, setCurrentTab} = props;
    const [searched, setSearched] = useState('');
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

    useEffect(() => {
        if (searchType === 'none') {
            setSearched('');
        }
    }, [searchType]);

    const searchBarView = () => (
        <TextInput
            value={searched}
            onChangeText={setSearched}
            onEndEditing={() => {
                if (!searched) {
                    resetSearch();
                }
            }}
        />
    );

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: currentTab === 'Home' && searchType !== 'none',
                header: searchBarView
            }}>
            <Tab.Screen
                name="Home"
                listeners={{
                    focus: () => setCurrentTab('Home')
                }}
                options={{
                    tabBarIcon: props => homeIcon(props.size, props.color)
                }}>
                {props => <Home searched={searched} isFilteredSearch={searchType === 'filter'} />}
            </Tab.Screen>
            <Tab.Screen
                name="PlaylistList"
                component={PlaylistList}
                listeners={{
                    focus: () => setCurrentTab('PlaylistList')
                }}
                options={{
                    tabBarIcon: props => playlistListIcon(props.size, props.color)
                }}
            />
            <Tab.Screen
                name="Playback"
                component={Playback}
                listeners={{
                    focus: () => setCurrentTab('Playback')
                }}
                options={{
                    tabBarIcon: props => playbackIcon(props.size, props.color)
                }}
            />
        </Tab.Navigator>
    );
};

export default HomeTabs;
