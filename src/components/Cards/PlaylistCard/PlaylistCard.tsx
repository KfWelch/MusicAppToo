import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Pressable,
    SafeAreaView,
    Text,
    useColorScheme,
    View
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { Album, Playlist, Song } from '../../../models/MusicModel';
import {
    removePlaylist,
    setCurrentPlayArray,
    setCurrentPlaylist,
    shuffleCurrentPlaylist
} from '../../../state/actions/Playlist';
import { convertSongListToTracks, getPlayArray } from '../../../utils/musicUtils';
import AlbumCard from '../AlbumCard/AlbumCard';
import SongCard from '../SongCard/SongCard';
import ComponentDropDown from '../ComponentDropDown/ComponentDropDown';
import styles from './PlaylistCard.style';
import { useTypedSelector } from '../../../state/reducers';
import { PlaybackMode } from '../../../state/reducers/Playlist';
import { getRandomizedSongs } from '../../../utils/PlaylistRandomization';
import { color } from '../../../constant/Color';

interface PlaylistCardProps {
    playlist: Playlist,
    navigation: NavigationProp<any>
}

const PlaylistCard = (props: PlaylistCardProps) => {
    const { playlist, navigation } = props;
    const dispatch = useDispatch();
    const options = useTypedSelector(state => state.Options);
    const { currentPlaylist, playbackOptions } = useTypedSelector(state => state.Playlist);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : systemColorScheme === 'dark';
    const scheme = isDarkMode ? 'dark' : 'light';
    const [startPlayback, setStartPlayback] = useState(false);

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

    const goToPlaylist = () => {
        dispatch(setCurrentPlaylist(playlist));
        props.navigation.navigate('Playlist');
    };

    const playPlaylist = async () => {
        await TrackPlayer.reset();
        dispatch(setCurrentPlaylist(playlist));
        switch (playbackOptions.mode) {
            case PlaybackMode.NORMAL:
                const playArray = getPlayArray(playlist);
                dispatch(setCurrentPlayArray(playArray));
                break;
            case PlaybackMode.SHUFFLE:
                if (currentPlaylist) {
                    dispatch(setCurrentPlayArray(getPlayArray(currentPlaylist)));
                    dispatch(shuffleCurrentPlaylist());
                }
                break;
            case PlaybackMode.RANDOMIZE:
                const initialSongs = getRandomizedSongs(
                    playlist,
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

    return (
        <SafeAreaView style={{...styles.cardView, borderColor: isDarkMode ? color.DARK_RED : color.DARK_SLATE_BLUE}}>
            <Pressable style={styles.infoView} onPress={goToPlaylist} onLongPress={playPlaylist}>
                <Text style={styles.title}>{playlist.name}</Text>
                <Text style={styles.subtitle}>{`Total songs: ${playlist.playArray.length}`}</Text>
            </Pressable>
            <Pressable onPress={playPlaylist}>
                <MaterialCommunityIcons name="playlist-play" size={40} />
            </Pressable>
            <Pressable onLongPress={() => dispatch(removePlaylist(playlist.name))}>
                <MaterialCommunityIcons name="playlist-remove" size={30} />
            </Pressable>
        </SafeAreaView>
    );
};

export default PlaylistCard;
