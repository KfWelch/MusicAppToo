import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, useColorScheme, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import TrackPlayer from 'react-native-track-player';
import {useDispatch} from 'react-redux';
import {Album, Artist, Song} from '../../models/MusicModel';
import {selectArtist} from '../../state/actions/Albums';
import {setAlbumAsPlayingPlaylist, setViewingPlayArray, shuffleViewingPlaylist} from '../../state/actions/Playlist';
import {useTypedSelector} from '../../state/reducers';
import {PlaybackMode} from '../../state/reducers/Playlist';
import {convertSongListToTracks, getAlbumId, getPlayArray, getSongId} from '../../utils/musicUtils';
import {getRandomizedSongs} from '../../utils/PlaylistRandomization';
import ArtistCard, {getFoundColor as getArtistFound} from '../Cards/ArtistCard/ArtistCard';
import AlbumCard, {getFoundColor as getAlbumFound} from '../Cards/AlbumCard/AlbumCard';
import SongCard from '../Cards/SongCard/SongCard';
import ComponentDropDown from '../Cards/ComponentDropDown/ComponentDropDown';
import styles from './ArtistListComponent.style';
import {titleSort} from '../../utils/stringUtils';

interface ArtistListProps {
    isFilteredSearch: boolean;
    searched: string;
}

const ArtistList = (props: ArtistListProps) => {
    const {searched, isFilteredSearch} = props;
    const albumsState = useTypedSelector(state => state.Albums);
    const {playingPlaylist: currentPlaylist, playbackOptions} = useTypedSelector(state => state.Playlist);
    const {artists} = albumsState;
    const autoPlay = useTypedSelector(state => state.Options.playbackAutoPlayOnReload);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : systemColorScheme === 'dark';
    const [startPlayback, setStartPlayback] = useState(false);

    const sortedArtists = useMemo(() => {
        const filtered =
            searched && isFilteredSearch ? artists.filter(artist => getArtistFound(artist, searched)) : [...artists];
        return filtered.sort((a, b) => titleSort(a.artist, b.artist));
    }, [artists, isFilteredSearch]);

    useEffect(() => {
        if (navigation.isFocused() && currentPlaylist && startPlayback) {
            setStartPlayback(false);
            TrackPlayer.add(convertSongListToTracks(currentPlaylist.playArray)).then(() => {
                TrackPlayer.play();
                // @ts-ignore
                navigation.navigate('HomeTabs', {screen: 'Playback'});
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
                        TrackPlayer.add(convertSongListToTracks(initialSongs)).then(() => {
                            TrackPlayer.play();
                            // @ts-ignore
                            navigation.navigate('Playback');
                        });
                    } else {
                        TrackPlayer.add(convertSongListToTracks(currentPlaylist.playArray)).then(() => {
                            TrackPlayer.play();
                            // @ts-ignore
                            navigation.navigate('Playback');
                        });
                    }
                }
            });
        }
    }, []);

    const renderArtist = ({item}: {item: Artist}) => {
        const filtered =
            searched && isFilteredSearch
                ? item.albums.filter(album => getAlbumFound(album, searched))
                : [...item.albums];
        const sortedAlbums = filtered.sort((a, b) => titleSort(a.albumName, b.albumName));
        return (
            <ComponentDropDown
                mainItemCard={<ArtistCard artist={item} searched={searched || undefined} />}
                subItemFlatlist={
                    <FlatList
                        data={sortedAlbums}
                        renderItem={({item}: {item: Album}) => (
                            <ComponentDropDown
                                mainItemCard={
                                    <AlbumCard
                                        album={item}
                                        onPlay={async () => {
                                            dispatch(setAlbumAsPlayingPlaylist(item));
                                            await TrackPlayer.reset();
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
                                        }}
                                        searched={searched || undefined}
                                    />
                                }
                                subItemFlatlist={
                                    <FlatList
                                        data={item.songs}
                                        renderItem={({item}: {item: Song}) => (
                                            <SongCard
                                                song={item}
                                                colorScheme={isDarkMode ? 'dark' : 'light'}
                                                searched={searched || undefined}
                                            />
                                        )}
                                        keyExtractor={(item, index) => `${getSongId(item)}-${index}`}
                                        extraData={item}
                                    />
                                }
                            />
                        )}
                        keyExtractor={(item, index) => `${getAlbumId(item)}-${index}`}
                        extraData={item}
                    />
                }
            />
        );
    };

    const itemSeparator = () => <View style={styles.itemSeparator} />;

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={sortedArtists}
                renderItem={renderArtist}
                keyExtractor={(item, index) => `${item.artist}-${index}`}
                ItemSeparatorComponent={itemSeparator}
                extraData={albumsState}
            />
        </SafeAreaView>
    );
};

export default ArtistList;
