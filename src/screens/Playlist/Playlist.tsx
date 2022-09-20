import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, FlatList, Pressable, Switch, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import ModalDropdown from 'react-native-modal-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ComponentDropDown from "../../components/Cards/ComponentDropDown/ComponentDropDown";
import AlbumCard from "../../components/Cards/AlbumCard/AlbumCard";
import SongCard from "../../components/Cards/SongCard/SongCard";
import { Album, Song } from "../../models/MusicModel";
import { setAlbumOrdered, setCurrentPlayArray, setOrderedType, setPlaybackMode, setRandomizeType, setReshuffle, setSongWeight, shuffleCurrentPlaylist } from "../../state/actions/Playlist";
import { useTypedSelector } from "../../state/reducers";
import { ShuffleType, PlaybackMode, RandomizationType } from "../../state/reducers/Playlist";
import { convertSongListToTracks, getAlbumId, getPlayArray, getSongId } from "../../utils/musicUtils";
import styles from "./Playlist.style";
import TrackPlayer from "react-native-track-player";
import { getRandomizedSongs } from "../../utils/PlaylistRandomization";

    const playbackModeOptions: PlaybackMode[] = [PlaybackMode.NORMAL, PlaybackMode.SHUFFLE, PlaybackMode.RANDOMIZE];
    const orderedTypeOptions: ShuffleType[] = [ShuffleType.STANDARD, ShuffleType.SPREAD, ShuffleType.SPREAD_ORDERED, ShuffleType.STANDARD_ORDERED];
    const randomizationType: RandomizationType[] = [RandomizationType.WEIGHTED, RandomizationType.WEIGHTLESS];

const Tab = createMaterialTopTabNavigator();

const Playlist = () => {
    const { currentPlaylist, playbackOptions } = useTypedSelector(state => state.Playlist);
    const playerOptions = useTypedSelector(state => state.Playlist.playbackOptions);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : systemColorScheme === 'dark';


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
                options={orderedTypeOptions}
                defaultIndex={0}
                onSelect={(index, option) => { dispatch(setOrderedType(option)); }}
            />
            <Text>Shuffle on repeat?</Text>
            <Switch onValueChange={value => { dispatch(setReshuffle(value)); }} />
        </View>
    );

    const randomizationOptionsView = () => playerOptions.mode === PlaybackMode.RANDOMIZE && (
        <ModalDropdown
            options={randomizationType}
            defaultIndex={0}
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
                    setCurrentPlayArray(playArray);
                    await TrackPlayer.add(convertSongListToTracks(playArray));
                    break;
                case PlaybackMode.SHUFFLE:
                    dispatch(setCurrentPlayArray(getPlayArray(currentPlaylist)));
                    dispatch(shuffleCurrentPlaylist());
                    await TrackPlayer.add(convertSongListToTracks(currentPlaylist.playArray));
                    break;
                case PlaybackMode.RANDOMIZE:
                    const initialSongs = getRandomizedSongs(
                        currentPlaylist,
                        options.randomizationForwardBuffer,
                        playbackOptions.randomizeOptions.weighted,
                        options.randomizationShouldNotRepeatSongs
                    );
                    dispatch(setCurrentPlayArray(initialSongs));
                    await TrackPlayer.add(convertSongListToTracks(initialSongs));
                    break;
                default:
                    return;
            }
            TrackPlayer.play();
            // @ts-ignore
            navigation.navigate('HomeTabs', { screen: 'Playback' });
        }
    }

    const controlBar = () => (
        <View style={styles.controlBar}>
            <ModalDropdown
                options={playbackModeOptions}
                defaultIndex={0}
                onSelect={(index, option) => {
                    dispatch(setPlaybackMode(option));
                }}
            />
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
            <Button onPress={() => dispatch(shuffleCurrentPlaylist())} title="Shuffle Playlist" />
            <FlatList
                data={currentPlaylist?.playArray}
                renderItem={individualSongView}
                keyExtractor={(item, index) => `${item.title}-${index}`}
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
