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
    setViewingPlayArray,
    setShuffleType,
    setPlaybackMode,
    setRandomizeType,
    setReshuffle,
    setSongWeight,
    setCurrentPlaylistAsPlaying,
    shuffleViewingPlaylist
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
import colorScheme from '../../constant/Color';
import MultipleChoiceModal from '../../components/Modal/MultipleChoiceModal/MultipleChoiceModal';

const playbackModeOptions: PlaybackMode[] = [PlaybackMode.NORMAL, PlaybackMode.SHUFFLE, PlaybackMode.RANDOMIZE];
const shuffleTypeOptions: ShuffleType[] = [
    ShuffleType.STANDARD,
    ShuffleType.SPREAD,
    ShuffleType.SPREAD_ORDERED,
    ShuffleType.ORDERED,
    ShuffleType.POWER_ORDERED
];

const Tab = createMaterialTopTabNavigator();

const Playlist = () => {
    const { viewingPlaylist, playbackOptions } = useTypedSelector(state => state.Playlist);
    const playerOptions = useTypedSelector(state => state.Playlist.playbackOptions);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : systemColorScheme === 'dark';
    const currentScheme = colorScheme[isDarkMode ? 'dark' : 'light'];

    const [isAlreadyShuffled, setIsAlreadyShuffled] = useState(false);
    const [startPlayback, setStartPlayback] = useState(false);

    const [showShuffleOptions, setShowShuffleOptions] = useState(false);
    const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);

    navigation.addListener('focus', () => {
        if (viewingPlaylist) {
            setIsAlreadyShuffled(false);
            setStartPlayback(false);
            dispatch(setViewingPlayArray(getPlayArray(viewingPlaylist)));
        }
    });

    useEffect(() => {
        if (navigation.isFocused() && viewingPlaylist && startPlayback) {
            setStartPlayback(false);
            TrackPlayer.add(convertSongListToTracks(viewingPlaylist.playArray))
                .then(() => {
                    dispatch(setCurrentPlaylistAsPlaying());
                    TrackPlayer.play();
                    // @ts-ignore
                    navigation.navigate('HomeTabs', { screen: 'Playback' });
                });
        }
    }, [viewingPlaylist, startPlayback]);

    const songView = ({ item }: { item: Song }) => (
        <SongCard
            song={item}
            onWeightChange={playerOptions.mode === PlaybackMode.RANDOMIZE
                ? value => dispatch(setSongWeight(getSongId(item), value))
                : undefined}
            colorScheme={isDarkMode ? 'dark' : 'light'}
        />
    );

    const albumView = ({ item }: { item: Album }) => (
        <ComponentDropDown
            mainItemCard={(
                <AlbumCard
                    album={item}
                    setAlbumOrdered={playerOptions.mode === PlaybackMode.SHUFFLE
                        ? ordered => dispatch(setAlbumOrdered(getAlbumId(item), ordered))
                        : undefined}
                />
            )}
            subItemFlatlist={(
                <FlatList
                    data={item.songs}  
                    renderItem={songView}
                    keyExtractor={(item, index) => `${item.title}-${index}`}
                />
            )}
            style={{ width: '95%' }}
        />
    );

    const playbackOptionsView = () => (
        <View style={styles.controlBarColumn}>
            <Pressable
                onPress={() => setShowPlaybackOptions(true)}
                style={{ ...styles.optionButton, borderColor: currentScheme.outline }}
            >
                <Text style={styles.controlBarColumnTitle}>Playback Mode</Text>
                <ModalDropdown
                    options={playbackModeOptions}
                    defaultValue={playbackOptions.mode}
                    onSelect={(index, option) => {
                        dispatch(setPlaybackMode(option));
                    }}

                />
            </Pressable>
        </View>
    );

    const shuffleOptionsViewButton = () => (
        <Pressable
            onPress={() => setShowShuffleOptions(true)}
            style={{ ...styles.optionButton, borderColor: currentScheme.outline }}
        >
            <Text style={styles.controlBarColumnTitle}>Shuffle Algorithm</Text>
            <Text>{playbackOptions.shuffleOptions.orderedType}</Text>
        </Pressable>
    )

    const shuffleOptionsView = () => playerOptions.mode === PlaybackMode.SHUFFLE && (
        <View style={styles.controlBarColumn}>
            {shuffleOptionsViewButton()}
            <Pressable
                onPress={() => dispatch(setReshuffle(!playbackOptions.shuffleOptions.reshuffleOnRepeat))}
                style={{
                    ...styles.optionButton,
                    borderColor: currentScheme.outline,
                    backgroundColor: playbackOptions.shuffleOptions.reshuffleOnRepeat
                        ? currentScheme.contentBackground
                        : currentScheme.background
                }}
            >
                <Text>Shuffle on repeat?</Text>
            </Pressable>
        </View>
    );

    const randomizationOptionsView = () => playerOptions.mode === PlaybackMode.RANDOMIZE && (
        <View style={styles.controlBarColumn}>
            <Pressable
                onPress={() => dispatch(setRandomizeType(playbackOptions.randomizeOptions.weighted
                    ? RandomizationType.WEIGHTLESS : RandomizationType.WEIGHTED))}
                style={{
                    ...styles.optionButton,
                    borderColor: currentScheme.outline,
                    backgroundColor: playbackOptions.randomizeOptions.weighted
                        ? currentScheme.contentBackground
                        : currentScheme.background
                }}
            >
                <Text>{playbackOptions.randomizeOptions.weighted ? RandomizationType.WEIGHTED : RandomizationType.WEIGHTLESS}</Text>
            </Pressable>
        </View>
    );

    const handlePlay = async () => {
        await TrackPlayer.reset();
        if (viewingPlaylist) {
            switch (playbackOptions.mode) {
                case PlaybackMode.NORMAL:
                    const playArray = getPlayArray(viewingPlaylist);
                    dispatch(setViewingPlayArray(playArray));
                    break;
                case PlaybackMode.SHUFFLE:
                    if (!isAlreadyShuffled) {
                        dispatch(setViewingPlayArray(getPlayArray(viewingPlaylist)));
                        dispatch(shuffleViewingPlaylist());
                    }
                    break;
                case PlaybackMode.RANDOMIZE:
                    const initialSongs = getRandomizedSongs(
                        viewingPlaylist,
                        options.randomizationForwardBuffer,
                        playbackOptions.randomizeOptions.weighted,
                        options.randomizationShouldNotRepeatSongs
                    );
                    dispatch(setViewingPlayArray(initialSongs));
                    break;
                default:
                    return;
            }
            dispatch(setCurrentPlaylistAsPlaying());
            setStartPlayback(true);
        }
    }

    const controlBar = () => (
        <View style={styles.controlBar}>
            {playbackOptionsView()}
            <Pressable onPress={handlePlay}>
                <MaterialCommunityIcons name="play-circle-outline" size={40} />
            </Pressable>
            {shuffleOptionsView()}
            {randomizationOptionsView()}
        </View>
    );

    const detailsAlbums = () => !!viewingPlaylist?.albums.length && (
        <View style={styles.albumsView}>
            <FlatList
                data={viewingPlaylist?.albums}
                renderItem={albumView}
                keyExtractor={(item, index) => `${item.albumName}-${index}`}
                ItemSeparatorComponent={() => (<View style={styles.separator} />)}
            />
        </View>
    );

    const detailsSongs = () => !!viewingPlaylist?.songs.length && (
        <View style={styles.songsView}>
            <FlatList
                data={viewingPlaylist?.songs}
                renderItem={songView}
                keyExtractor={(item, index) => `${item.title}-${index}`}
            />
        </View>
    );

    const separator = () => (
        <View style={{...styles.sectionSeparator, borderColor: currentScheme.outline}} />
    );

    const detailsView = () => (
        <View style={styles.flatListView}>
            {detailsAlbums()}
            {viewingPlaylist?.songs.length && viewingPlaylist.albums.length ? separator() : null}
            {detailsSongs()}
        </View>
    );

    const songsView = () => (
        <View style={styles.flatListView}>
            {playbackOptions.mode === PlaybackMode.SHUFFLE && <Button
                onPress={() => {
                    dispatch(shuffleViewingPlaylist());
                    setIsAlreadyShuffled(true);
                }}
                title="Shuffle Playlist"
            />}
            <FlatList
                data={viewingPlaylist?.playArray}
                renderItem={songView}
                keyExtractor={(item, index) => `${item.title}-${index}`}
                style={styles.songsFlatlist}
            />
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <MultipleChoiceModal
                title="Shuffle Options"
                description="Please choose which shuffle algorithm to use"
                choices={shuffleTypeOptions}
                onCancel={() => setShowShuffleOptions(false)}
                isVisible={showShuffleOptions}
                onConfirm={option => {
                    dispatch(setShuffleType(option));
                    setShowShuffleOptions(false);
                }}
                isDarkMode={isDarkMode}
            />
            <MultipleChoiceModal
                title="Playback Mode"
                description="Please choose which playback mode to use"
                choices={playbackModeOptions}
                onCancel={() => setShowPlaybackOptions(false)}
                isVisible={showPlaybackOptions}
                onConfirm={option => {
                    dispatch(setPlaybackMode(option));
                    setShowPlaybackOptions(false);
                }}
                isDarkMode={isDarkMode}
            />
            <Tab.Navigator style={styles.content}>
                <Tab.Screen name="Details">
                    {() => detailsView()}
                </Tab.Screen>
                <Tab.Screen
                    name="Songs"
                    listeners={{
                        focus: () => viewingPlaylist && dispatch(setViewingPlayArray(getPlayArray(viewingPlaylist)))
                    }}
                >
                    {() => songsView()}
                </Tab.Screen>
            </Tab.Navigator>
            {separator()}
            {controlBar()}
        </SafeAreaView>
    );
};

export default Playlist;
