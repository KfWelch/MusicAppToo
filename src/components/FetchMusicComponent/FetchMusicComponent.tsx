
import _ from 'lodash';
import React, { useState } from 'react';
import {
    Button,
    SafeAreaView,
    useColorScheme,
    View
} from 'react-native';
import {
    check,
    PERMISSIONS,
    request,
    RESULTS
} from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import * as RNFS from 'react-native-fs';
import { TagType } from 'jsmediatags/types';
import jsmediatags from 'jsmediatags';
// @ts-ignore
import ReactNativeFileReader from 'jsmediatags/build2/ReactNativeFileReader';
// @ts-ignore
import Circle from 'react-native-progress/Circle';
// @ts-ignore
import RNAndroidAudioStore from '@yajanarao/react-native-get-music-files';
import styles from './FetchMusicComponent.style';
import { Album, Artist, Song } from '../../models/MusicModel';
import { useTypedSelector } from '../../state/reducers';
import { useDispatch } from 'react-redux';
import {
    addAlbum,
    addArtist,
    combineMultiDiscAlbums,
    resetSavedAlbums
} from '../../state/actions/Albums';
import {
    disclessAlbumName,
    getAlbumId,
    getArtistFromPath,
    getMusicAlbumId,
    getMusicTrackId
} from '../../utils/musicUtils';
import { useNavigation } from '@react-navigation/native';
import { GetMusicAlbum, GetMusicTrack } from '../../models/GetMusicFiles';
import colorScheme from '../../constant/Color';

interface Progress {
    total: number;
    progress: number;
}

const DEBUG_LOAD = false;

const FetchMusicComponent = () => {
    const artists = useTypedSelector(state => state.Albums.artists);
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.generalOverrideSystemAppearance ? options.generalDarkmode : systemColorScheme === 'dark';
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [totalAlbums, setTotalAlbums] = useState(1);
    const [albumProgress, setAlbumProgress] = useState(0);
    const [totalSongs, setTotalSongs] = useState(1);
    const [songProgress, setSongProgress] = useState(0);
    const [loadingMusic, setLoadingMusic] = useState(0);

    const getMusicProgress = () => {
        const singleAlbumProgress = 1 / totalAlbums;
        const singleSongProgress = singleAlbumProgress / totalSongs;
        return singleSongProgress * songProgress + singleAlbumProgress * albumProgress;
    };

    const condenseAlbums = () => {
        artists.forEach(artist => {
            const uniqueArray = artist.albums.reduce((arrayOfUnique: Array<Array<Album>>, currentAlbum) => {
                // What if we do it by checking the artist's albums
                const alreadyMatched = arrayOfUnique
                    // If the set of unique albums arrays includes an array where the current album already is
                    .some((uniqueAlbums: Album[]) => uniqueAlbums
                        .some((album: Album) => currentAlbum.albumName === album.albumName));

                if (alreadyMatched) {
                    return arrayOfUnique;
                }
                /* Then, after we know that the current album is *not* already matched, we filter
                 * the current artist's albums for any where the current album's discless name
                 * is present within the album name
                 * 
                 * We do it this way to cover the case where sometimes a music provider has an exclusive
                 * song edition (Amazon with TSO's album Night Castle) and the exclusive song "album"
                 * has a lower index in the array than the rest of the album(s)
                */
                const matchingAlbums = artist.albums.filter(artistAlbum => artistAlbum.albumName.includes(disclessAlbumName(currentAlbum.albumName)));
                arrayOfUnique.push(matchingAlbums);
                return arrayOfUnique;
            }, []);

            // Filter out uniques where there's only one album
            const albumArraysToCombine = uniqueArray.reduce((combinables: Array<Array<Album>>, currentUnique) => {
                if (currentUnique.length > 1) {
                    return combinables.concat([currentUnique]);
                }
                return combinables;
            }, []);

            albumArraysToCombine.forEach(albumArray => dispatch(combineMultiDiscAlbums(albumArray)));
        });
    };

    const getPermission = async (showToast = true) => {
        const checkResult = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
        switch (checkResult) {
            case RESULTS.GRANTED: 
                showToast && Toast.show({
                    type: 'info',
                    text1: 'Already have permissions'
                });
                break;
            case RESULTS.UNAVAILABLE:
                Toast.show({ type: 'error', text1: 'Unable to access external storage' });
                break;
            default:
                const getResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
                switch (getResult) {
                    case 'granted':
                        Toast.show({
                            type: 'success',
                            text1: 'Successfully got permissions'
                        });
                        break;
                    default:
                        Toast.show({
                            type: 'error',
                            text1: 'Failed to get permissions'
                        });
                }
        }
    };

    const getSongTags = (path: string) => new Promise<TagType | null>(resolve => {
        try {
            new jsmediatags.Reader(path)
                .setFileReader(ReactNativeFileReader)
                .read({
                    onSuccess: tag => {
                        resolve(tag);
                    },
                    onError: e => {
                        console.error('Error getting tags for file %o, error %o', path, e);
                        resolve(null);
                    }
                });
        } catch (e) {
            console.error('Error getting tags for file %o, error %o', path, e);
            resolve(null);
        }
    });

    const getMusic = async () => {
        await getPermission(false);
        setTotalAlbums(1);
        setTotalSongs(1);
        setSongProgress(0);
        setAlbumProgress(0);
        setLoadingMusic(2);
        let failedAlbumsGetMusic = 0;
        let failedSongsGetMusic = 0;

        const albums: GetMusicAlbum[] = await RNAndroidAudioStore.getAlbums();

        let existingAlbums: Album[] = [];
        artists.forEach(artist => {
            existingAlbums = existingAlbums.concat(artist.albums);
        });

        const onlyNewAlbums = albums.reduce((filtered: GetMusicAlbum[], currentAlbum) => {
            if (existingAlbums.some(album => getAlbumId(album) === getMusicAlbumId(currentAlbum))) {
                return filtered;
            } else {
                return [...filtered, currentAlbum]
            }
        }, []);

        const duplicateless = onlyNewAlbums.reduce((filtered: GetMusicAlbum[], currentAlbum) => {
            if (filtered.some(album => getMusicAlbumId(album) === getMusicAlbumId(currentAlbum))) {
                console.log('Found duplicate album', currentAlbum.album);
                return filtered;
            } else {
                return [...filtered, currentAlbum];
            }
        }, []);
        setTotalAlbums(duplicateless.length || 1);

        const newArtists: Artist[] = [];

        for (const [albumIndex, album] of duplicateless.entries()) {
            let songs: GetMusicTrack[] = await RNAndroidAudioStore.getSongs({ artist: album.author, album: album.album });
            // We do this because artist & album will not get everything for some
            // various artist albums
            if (songs.length < Number.parseInt(album.numberOfSongs, 10)) {
                songs = await RNAndroidAudioStore.getSongs({ album: album.album });
            }

            // We're using reduce instead of filter because it's acting wonky
            const solomon = songs.reduce((filtered: GetMusicTrack[], currentTrack) => {
                if (
                    filtered.find(track => getMusicTrackId(track) === getMusicTrackId(currentTrack))
                    || getArtistFromPath(currentTrack.path) === '0'
                ) {
                    return filtered;
                }
                return [...filtered, currentTrack];
            }, []);
            const albumSongs: Song[] = [];

            setSongProgress(0);
            setTotalSongs(solomon.length || 1);
            setAlbumProgress(albumIndex);
            let albumFailedSongs = 0;

            for (const [songIndex, song] of solomon.entries()) {
                setSongProgress(songIndex);
                const filePath = song.path;
                const tags = await getSongTags(filePath);
                
                if (tags) {
                    const track = tags.tags.track;
                    const numberInAlbum = parseInt(track?.includes('/') ? track.substring(0, track?.indexOf('/')) : track || '0') || 1;
                    const albumSong: Song = {
                        albumName: album.album,
                        contributingArtist: song.artist,
                        title: song.title,
                        path: song.path,
                        weight: 1,
                        numberInAlbum,
                        length: song.duration
                    };
                    albumSongs.push(albumSong);
                } else {
                    albumFailedSongs++;
                }
            }
            
            if (albumSongs.length) {
                // Have to do this because some albums have various artists
                // So we use filepath
                const folderArtist = getArtistFromPath(albumSongs[0].path || `a/b/${album.author}/album/song`).replace('_', ' ');
                if (existingAlbums.some(existingAlbum => getAlbumId(existingAlbum) === `${folderArtist}§${disclessAlbumName(album.album)}`)) {
                    console.warn('Already have album, skipping adding to redux', album.album);
                    continue;
                }
                if (!newArtists.some(artist => artist.artist === folderArtist)) {
                    const newArtist: Artist = {
                        albums: [{
                            albumName: album.album,
                            artistName: folderArtist,
                            songs: albumSongs
                        }],
                        artist: folderArtist
                    };
                    if (!DEBUG_LOAD) {
                        dispatch(addArtist(newArtist));
                    } else {
                        console.log('Adding artist', newArtist.artist)
                    }
                    newArtists.push(newArtist);
                } else {
                    const newAlbum: Album = {
                        albumName: album.album,
                        artistName: folderArtist,
                        songs: albumSongs
                    };
                    if (!DEBUG_LOAD) {
                        dispatch(addAlbum(folderArtist, newAlbum));
                    } else {
                        console.log('Adding album', newAlbum.albumName, 'to artist', folderArtist)
                    }
                    const artistIndex = newArtists.findIndex(artist => _.isEqual(artist.artist, newAlbum.artistName));
                    newArtists[artistIndex].albums.push(newAlbum);
                    if (!newArtists.some(artist => artist.albums.some(album => getAlbumId(album) === getAlbumId(newAlbum)))) {
                    }
                }
                if (albumFailedSongs) {
                    failedSongsGetMusic += albumFailedSongs;
                    failedAlbumsGetMusic++;
                }
            } else {
                console.log('Not adding album with no songs');
            }
        }

        setLoadingMusic(0);
        if (failedAlbumsGetMusic) {
            Toast.show({
                position: 'bottom',
                type: 'info',
                text1: `Failed to get ${failedSongsGetMusic} songs`,
                text2: `This has affected ${failedAlbumsGetMusic} albums`,
                visibilityTime: 5000
            });
        } else {
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: `Finished loading music`
            });
        }

        condenseAlbums();

        // @ts-ignore
        navigation.navigate('HomeStack');
    };

    const reloadMusic = () => {
        dispatch(resetSavedAlbums());
        getMusic();
    };

    const clearMusic = () => {
        dispatch(resetSavedAlbums());
    };

    const itemSeparator = () => (<View style={styles.itemSeparator} />);

    const progressView = () => !!loadingMusic && (
        <View style={styles.loadingLPView}>
            <Circle
                progress={getMusicProgress()}
                size={300}
                thickness={100}
                showsText
                direction='clockwise'
                fill='crimson'
                color='black'
                borderColor='crimson'
                unfilledColor='crimson'
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Button onPress={getMusic} title="Scan for music" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
                {itemSeparator()}
                <Button onPress={clearMusic} title="Clear saved music" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
                {itemSeparator()}
                <Button onPress={reloadMusic} title="Reload music" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
            </View>
            {progressView()}
        </SafeAreaView>
    );
};

export default FetchMusicComponent;
