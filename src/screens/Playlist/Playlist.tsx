import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Pressable, Switch, Text, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ComponentDropDown from '../../components/Cards/ComponentDropDown/ComponentDropDown';
import AlbumCard from '../../components/Cards/AlbumCard/AlbumCard';
import SongCard from '../../components/Cards/SongCard/SongCard';
import { Album, Song } from '../../models/MusicModel';
import {
    setAlbumOrdered,
    setCurrentPlayArray,
    setShuffleType,
    setPlaybackMode,
    setRandomizeType,
    setReshuffle,
    setSongWeight,
    shuffleCurrentPlaylist
} from '../../state/actions/Playlist';
import { useTypedSelector } from '../../state/reducers';
import { ShuffleType, PlaybackMode, RandomizationType } from '../../state/reducers/Playlist';
import {
    convertSongListToTracks,
    getAlbumId,
    getPlayArray,
    getSongId
} from '../../utils/musicUtils';
import styles from './Playlist.style';
import TrackPlayer from 'react-native-track-player';
import { getRandomizedSongs } from '../../utils/PlaylistRandomization';

    const playbackModeOptions: PlaybackMode[] = [PlaybackMode.NORMAL, PlaybackMode.SHUFFLE, PlaybackMode.RANDOMIZE];
    const shuffleTypeOptions: ShuffleType[] = [ShuffleType.STANDARD, ShuffleType.SPREAD, ShuffleType.SPREAD_ORDERED, ShuffleType.STANDARD_ORDERED];
    const randomizationType: RandomizationType[] = [RandomizationType.WEIGHTED, RandomizationType.WEIGHTLESS];

const Tab = createMaterialTopTabNavigator();

const Playlist = () => {
    const { currentPlaylist, playbackOptions } = useTypedSelector(state => state.Playlist);
    const playerOptions = useTypedSelector(state => state.Playlist.playbackOptions);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : systemColorScheme === 'dark';
    const [isAlreadyShuffled, setIsAlreadyShuffled] = useState(false);
    const [startPlayback, setStartPlayback] = useState(false);

    navigation.addListener('focus', () => {
        if (currentPlaylist) {
            setIsAlreadyShuffled(false);
            setStartPlayback(false);
            dispatch(setCurrentPlayArray(getPlayArray(currentPlaylist)));
        }
    });

    useEffect(() => {
        if (navigation.isFocused() && currentPlaylist && startPlayback) {
            setStartPlayback(false);
            TrackPlayer.add(convertSongListToTracks(currentPlaylist.playArray))
                .then(() => {
                    TrackPlayer.play();
                    // @ts-ignore
                    navigation.navigate('HomeTabs', { screen: 'Playback' });
                });
        }
    }, [currentPlaylist, startPlayback]);

    const songView = ({ item }: { item: Song }) => (
        <SongCard
            song={item}
            onWeightChange={value => dispatch(setSongWeight(getSongId(item), value))}
            colorScheme={isDarkMode ? 'dark' : 'light'}
        />
    );

    const albumView = ({ item }: { item: Album }) => (
        <ComponentDropDown
            mainItemCard={(
                <AlbumCard
                    album={item}
                    setAlbumOrdered={ordered => dispatch(setAlbumOrdered(getAlbumId(item), ordered))}
                />
            )}
            subItemFlatlist={(
                <FlatList
                    data={item.songs}  
                    renderItem={songView}
                    keyExtractor={(item, index) => `${item.title}-${index}`}
                />
            )}
        />
    );

    const shuffleOptionsView = () => playerOptions.mode === PlaybackMode.SHUFFLE && (
        <View style={styles.controlBarColumn}>
            <Text style={styles.controlBarColumnTitle}>Shuffle options</Text>
            <ModalDropdown
                options={shuffleTypeOptions}
                defaultValue={playbackOptions.shuffleOptions.orderedType}
                onSelect={(index, option) => {
                    dispatch(setShuffleType(option));
                }}
            />
            <Text>Shuffle on repeat?</Text>
            <Switch
                onValueChange={value => { dispatch(setReshuffle(value)); }}
                value={playbackOptions.shuffleOptions.reshuffleOnRepeat}
            />
        </View>
    );

    const randomizationOptionsView = () => playerOptions.mode === PlaybackMode.RANDOMIZE && (
        <ModalDropdown
            options={randomizationType}
            defaultValue={playbackOptions.randomizeOptions.weighted ? RandomizationType.WEIGHTED : RandomizationType.WEIGHTLESS}
            onSelect={(index, option) => {
                dispatch(setRandomizeType(option));
            }}
        />
    );

    const handlePlay = async () => {
        await TrackPlayer.reset();
        if (currentPlaylist) {
            switch (playbackOptions.mode) {
                case PlaybackMode.NORMAL:
                    const playArray = getPlayArray(currentPlaylist);
                    dispatch(setCurrentPlayArray(playArray));
                    break;
                case PlaybackMode.SHUFFLE:
                    if (!isAlreadyShuffled) {
                        dispatch(setCurrentPlayArray(getPlayArray(currentPlaylist)));
                        dispatch(shuffleCurrentPlaylist());
                    }
                    break;
                case PlaybackMode.RANDOMIZE:
                    const initialSongs = getRandomizedSongs(
                        currentPlaylist,
                        options.randomizationForwardBuffer,
                        playbackOptions.randomizeOptions.weighted,
                        options.randomizationShouldNotRepeatSongs
                    );
                    dispatch(setCurrentPlayArray(initialSongs));
                    break;
                default:
                    return;
            }
            setStartPlayback(true);
        }
    }

    const controlBar = () => (
        <View style={styles.controlBar}>
            <View style={styles.controlBarColumn}>
                <Text style={styles.controlBarColumnTitle}>Playback Mode</Text>
                <ModalDropdown
                    options={playbackModeOptions}
                    defaultValue={playbackOptions.mode}
                    onSelect={(index, option) => {
                        dispatch(setPlaybackMode(option));
                    }}

                />
            </View>
            {shuffleOptionsView()}
            {randomizationOptionsView()}
            <Pressable onPress={handlePlay}>
                <MaterialCommunityIcons name="play-circle-outline" size={40} />
            </Pressable>
        </View>
    );

    const detailsAlbums = () => !!currentPlaylist?.albums.length && (
        <View style={styles.albumsView}>
            <FlatList
                data={currentPlaylist?.albums}
                renderItem={albumView}
                keyExtractor={(item, index) => `${item.albumName}-${index}`}
            />
        </View>
    );

    const detailsSongs = () => !!currentPlaylist?.songs.length && (
        <View style={styles.songsView}>
            <FlatList
                data={currentPlaylist?.songs}
                renderItem={songView}
                keyExtractor={(item, index) => `${item.title}-${index}`}
            />
        </View>
    );

    const detailsView = () => (
        <SafeAreaView style={styles.container}>
            {detailsAlbums()}
            {detailsSongs()}
            {controlBar()}
        </SafeAreaView>
    );

    const individualSongView = ({ item }: { item: Song }) => (
        <SongCard
            song={item}
            onWeightChange={newWeight => dispatch(setSongWeight(getSongId(item), newWeight))}
            colorScheme={isDarkMode ? 'dark' : 'light'}
        />
    );

    const songsView = () => (
        <SafeAreaView style={styles.container}>
            {playbackOptions.mode === PlaybackMode.SHUFFLE && <Button
                onPress={() => {
                    dispatch(shuffleCurrentPlaylist());
                    setIsAlreadyShuffled(true);
                }}
                title="Shuffle Playlist"
            />}
            <FlatList
                data={currentPlaylist?.playArray}
                renderItem={individualSongView}
                keyExtractor={(item, index) => `${item.title}-${index}`}
                style={styles.songsFlatlist}
            />
            {controlBar()}
        </SafeAreaView>
    )

    return (
        <Tab.Navigator>
            <Tab.Screen name="Details">
                {() => detailsView()}
            </Tab.Screen>
            <Tab.Screen
                name="Songs"
                listeners={{
                    focus: () => currentPlaylist && dispatch(setCurrentPlayArray(getPlayArray(currentPlaylist)))
                }}
            >
                {() => songsView()}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default Playlist;
