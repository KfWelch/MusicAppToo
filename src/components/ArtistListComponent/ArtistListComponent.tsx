import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';
import { useDispatch } from 'react-redux';
import { Album, Artist, Song } from '../../models/MusicModel';
import { selectArtist } from '../../state/actions/Albums';
import { setAlbumAsPlayingPlaylist, setViewingPlayArray, shuffleViewingPlaylist } from '../../state/actions/Playlist';
import { useTypedSelector } from '../../state/reducers';
import { PlaybackMode } from '../../state/reducers/Playlist';
import {
    convertSongListToTracks,
    getAlbumId,
    getPlayArray,
    getSongId
} from '../../utils/musicUtils';
import { getRandomizedSongs } from '../../utils/PlaylistRandomization';
import AlbumCard from '../Cards/AlbumCard/AlbumCard';
import ArtistCard from '../Cards/ArtistCard/ArtistCard';
import ComponentDropDown from '../Cards/ComponentDropDown/ComponentDropDown';
import SongCard from '../Cards/SongCard/SongCard';
import styles from './ArtistListComponent.style';

const ArtistList = () => {
    const albumsState = useTypedSelector(state => state.Albums);
    const { viewingPlaylist: currentPlaylist, playbackOptions } = useTypedSelector(state => state.Playlist);
    const { artists } = albumsState;
    const autoPlay = useTypedSelector(state => state.Options.playbackAutoPlayOnReload);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : systemColorScheme === 'dark';
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

    const selectArtistFromList = (artistName: string, pressedTitle: string) => {
        dispatch(selectArtist(artistName));
        // @ts-ignore
        navigation.navigate('ArtistScreen');
    };

    useEffect(() => {
        if (autoPlay) {
            TrackPlayer.reset().then(() => {
                if (navigation.isFocused() && currentPlaylist) {
                    if (playbackOptions.mode === PlaybackMode.RANDOMIZE) {
                        const initialSongs = getRandomizedSongs(
                            currentPlaylist,
                            options.randomizationForwardBuffer,
                            playbackOptions.randomizeOptions.weighted,
                            options.randomizationShouldNotRepeatSongs
                        );
                        dispatch(setViewingPlayArray(initialSongs));
                        TrackPlayer.add(convertSongListToTracks(initialSongs))
                            .then(() => {
                                TrackPlayer.play();
                                // @ts-ignore
                                navigation.navigate('Playback');
                            });
                    } else {
                        TrackPlayer.add(convertSongListToTracks(currentPlaylist.playArray))
                            .then(() => {
                                TrackPlayer.play();
                                // @ts-ignore
                                navigation.navigate('Playback');
                            });
                    }
                }
            });
        }
    }, []);

    const itemSeparator = () => (<View style={styles.itemSeparator} />);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={artists}
                renderItem={({ item }: { item: Artist }) => (
                    <ComponentDropDown
                        mainItemCard={(<ArtistCard artist={item} />)}
                        subItemFlatlist={(
                            <FlatList
                                data={item.albums}
                                renderItem={({ item }: { item: Album }) => (
                                    <ComponentDropDown
                                        mainItemCard={(<AlbumCard album={item} onPlay={async () => {
                                            dispatch(setAlbumAsPlayingPlaylist(item));
                                            await TrackPlayer.reset();
                                            await TrackPlayer.removeUpcomingTracks();
                                            if (currentPlaylist) {
                                                switch (playbackOptions.mode) {
                                                    case PlaybackMode.NORMAL:
                                                        const playArray = getPlayArray(currentPlaylist);
                                                        dispatch(setViewingPlayArray(playArray));
                                                        break;
                                                    case PlaybackMode.SHUFFLE:
                                                        dispatch(setViewingPlayArray(getPlayArray(currentPlaylist)));
                                                        dispatch(shuffleViewingPlaylist());
                                                        break;
                                                    case PlaybackMode.RANDOMIZE:
                                                        const initialSongs = getRandomizedSongs(
                                                            currentPlaylist,
                                                            options.randomizationForwardBuffer,
                                                            playbackOptions.randomizeOptions.weighted,
                                                            options.randomizationShouldNotRepeatSongs
                                                        );
                                                        dispatch(setViewingPlayArray(initialSongs));
                                                        break;
                                                    default:
                                                        return;
                                                }
                                                setStartPlayback(true);
                                            }
                                        }} />)}  
                                        subItemFlatlist={(
                                            <FlatList
                                                data={item.songs}
                                                renderItem={({ item }: { item: Song }) => (<SongCard song={item} colorScheme={isDarkMode ? 'dark' : 'light'} />)}
                                                keyExtractor={(item, index) => `${getSongId(item)}-${index}`}
                                                extraData={item}
                                            />
                                        )}
                                    />
                                )}
                                keyExtractor={(item, index) => `${getAlbumId(item)}-${index}`}
                                extraData={item}
                            />
                        )}
                    />
                )}
                keyExtractor={(item, index) => `${item.artist}-${index}`}
                ItemSeparatorComponent={itemSeparator}
                extraData={albumsState}
            />
        </SafeAreaView>
    );
};

export default ArtistList;
