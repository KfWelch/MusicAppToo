import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, FlatList, Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import ModalDropdown from 'react-native-modal-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ComponentDropDown from "../../components/Cards/ComponentDropDown/ComponentDropDown";
import AlbumCard from "../../components/Cards/AlbumCard/AlbumCard";
import SongCard from "../../components/Cards/SongCard/SongCard";
import { Album, Song } from "../../models/MusicModel";
import { setAlbumOrdered, setOrderedType, setPlaybackMode, setRandomizeType, setReshuffle, setSongWeight, shuffleCurrentPlaylist } from "../../state/actions/Playlist";
import { useTypedSelector } from "../../state/reducers";
import { OrderedType, PlaybackMode, RandomizationType } from "../../state/reducers/Playlist";
import { convertSongListToTracks, getAlbumId, getSongId } from "../../utils/musicUtils";
import styles from "./Playlist.style";
import TrackPlayer from "react-native-track-player";

    const playbackModeOptions: PlaybackMode[] = [PlaybackMode.NORMAL, PlaybackMode.SHUFFLE, PlaybackMode.RANDOMIZE];
    const orderedTypeOptions: OrderedType[] = [OrderedType.NONE, OrderedType.SPREAD, OrderedType.RANDOM];
    const randomizationType: RandomizationType[] = [RandomizationType.WEIGHTED, RandomizationType.WEIGHTLESS];

const Tab = createMaterialTopTabNavigator();

const Playlist = () => {
    const currentPlaylist = useTypedSelector(state => state.Playlist.currentPlaylist);
    const playerOptions = useTypedSelector(state => state.Playlist.playbackOptions);
    const dispatch = useDispatch();
    const navigation = useNavigation();


    const songView = ({ item }: { item: Song }) => (
        <SongCard song={item} onWeightChange={value => dispatch(setSongWeight(getSongId(item), value))}/>
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
            disabled
        />
    );

    const handlePlay = async () => {
        await TrackPlayer.reset();
        if (currentPlaylist) {
            await TrackPlayer.add(convertSongListToTracks(currentPlaylist?.playArray));
            TrackPlayer.play();
            // @ts-ignore
            navigation.navigate('Playback');
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

    const detailsView = () => (
        <SafeAreaView style={styles.container}>
            <View style={styles.albumsView}>
                <FlatList
                    data={currentPlaylist?.albums}
                    renderItem={albumView}
                    keyExtractor={(item, index) => `${item.albumName}-${index}`}
                />
            </View>
            <View style={styles.songsView}>
                <FlatList
                    data={currentPlaylist?.songs}
                    renderItem={songView}
                    keyExtractor={(item, index) => `${item.title}-${index}`}
                />
            </View>
            {controlBar()}
        </SafeAreaView>
    );

    const individualSongView = ({ item }: { item: Song }) => (
        <SongCard song={item} onWeightChange={newWeight => dispatch(setSongWeight(getSongId(item), newWeight))} />
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
            <Tab.Screen name="Songs">
                {() => songsView()}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default Playlist;
