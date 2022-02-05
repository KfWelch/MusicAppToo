
import _, { indexOf } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, Text, useColorScheme, View } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import * as RNFS from 'react-native-fs';
import { TagType } from 'jsmediatags/types';
import { Reader } from 'jsmediatags';
// @ts-ignore
import ReactNativeFileReader from 'jsmediatags/build2/ReactNativeFileReader';
import { Circle } from 'react-native-progress';
import styles from './FetchMusicComponent.style';
import { Album, Artist, Song } from '../../models/MusicModel';
import { useTypedSelector } from '../../state/reducers';
import { useDispatch } from 'react-redux';
import { addArtist, combineMultiDiscAlbums, resetSavedAlbums } from '../../state/actions/Albums';
import { colorScheme } from '../../constant/Color';
import { disclessAlbumName } from '../../utils/musicUtils';

const FetchMusicComponent = () => {
    const artists = useTypedSelector(state => state.Albums.artists);
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : systemColorScheme === 'dark';
    const dispatch = useDispatch();
    const [totalArtists, setTotalArtists] = useState(1);
    const [artistProgress, setArtistProgress] = useState(0);
    const [totalAlbums, setTotalAlbums] = useState(1);
    const [albumProgress, setAlbumProgress] = useState(0);
    const [totalSongs, setTotalSongs] = useState(1);
    const [songProgress, setSongProgress] = useState(0);
    const [loadingMusic, setLoadingMusic] = useState(false);

    const getProgress = () => {
        const singleArtistProgress = 1 / totalArtists;
        const singleAlbumProgress = singleArtistProgress / totalAlbums;
        const singleSongProgress = singleAlbumProgress / totalSongs;
        return singleSongProgress * songProgress + singleAlbumProgress * albumProgress + singleArtistProgress * artistProgress;
    };

    const condenseAlbums = () => {
        artists.forEach(artist => {
            const uniqueArray = artist.albums.reduce((arrayOfUnique: Array<Array<Album>>, currentAlbum) => {
                // If we find an index of unique discless album names where it matches,
                // we need to add this current album to that array of uniques
                const uniquesIndex = arrayOfUnique
                    .findIndex(uniqueNamedAlbums => uniqueNamedAlbums
                        .some(album => currentAlbum.albumName.includes(disclessAlbumName(album.albumName))));
                if (uniquesIndex !== -1) {
                    // If we find one where there's matching after removing the disc part of the title,
                    // we need to add this album to that list of uniques
                    arrayOfUnique[uniquesIndex].push(currentAlbum);
                } else {
                    // Otherwise, we add it as its own new unique
                    arrayOfUnique.push([currentAlbum]);
                }
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

    const getMusicFiles = async (recursiveFiles: RNFS.ReadDirItem[], artist?: Artist): Promise<Artist[]> => {
        const directories = recursiveFiles.filter(item => item.isDirectory() && !item.name.startsWith('.'));
        if (!artist) {
            setTotalArtists(directories.length);
        } else {
            setTotalAlbums(directories.length);
        }
        const tempArtist: Artist = { ...(artist || { artist: '', albums: [] }) };
        let artists: Artist[] = [];

        // 1st iteration, for each artist
        // 2nd iteration, for each album
        // By iteration, I mean levels deep of the recursion
        for (let i = 0; i < directories.length; i++) {
            // Have to do this here for smoother progress vinyl LP
            if (!artist) {
                setArtistProgress(i);
            } else {
                setAlbumProgress(i);
            }
            const files = await RNFS.readDir(directories[i].path);
            // 1st iteration, we are looking at an artist, and recurse to go through all albums
            if (!artist) {
                artists = artists.concat(await getMusicFiles(files, { artist: directories[i].name, albums: [] }));
            // 2nd iteration, we are looking at an album, and we already have all the songs in the files
            } else {
                setTotalSongs(files.length);
                const songs: Song[] = [];
                for (let j = 0; j < files.length; j++) {
                    setSongProgress(j);
                    const filePath = files[j].path;
                    const tags = await new Promise<TagType | null>((resolve, reject) => {
                        try {
                            new Reader(filePath)
                                .setFileReader(ReactNativeFileReader)
                                .read({
                                    onSuccess: tag => {
                                        resolve(tag);
                                    },
                                    onError: e => {
                                        console.error('Error getting tags for file %o, error %o', files[j], e);
                                        resolve(null);
                                    }
                                });
                        } catch (e) {
                            console.error('Error getting tags for file %o, error %o', files[j], e);
                            resolve(null);
                        }
                    });
                    
                    if (tags) {
                        const track = tags.tags.track;
                        const numberInAlbum = parseInt(track?.includes('/') ? track.substring(0, track?.indexOf('/')) : track || '0') || j + 1;
                        const song: Song = {
                            albumName: tags.tags.album || '',
                            contributingArtist: tags.tags.artist || '',
                            title: tags.tags.title || '',
                            path: files[j].path,
                            weight: 1,
                            numberInAlbum
                        };
                        songs.push(song);
                    }
                }
                /* files.forEach((songFile, index) => {
                    const nameStart = songFile.name.search(/[a-zA-Z]/);
                    const title = songFile.name.substring(nameStart, songFile.name.lastIndexOf('.'));
                    // minus one because there's a space between the leading number and the title
                    const leadingNumber = songFile.name.substring(0, nameStart - 1);
                    let numberInAlbum = 0;
                    if (leadingNumber.endsWith('--')) {
                        numberInAlbum = index + 1;
                    } else {
                        numberInAlbum = Number.parseInt(leadingNumber.substring(leadingNumber.length - 2), 10);
                    }
                    const song: Song = {
                        title,
                        albumName: directories[i].name,
                        contributingArtist: artist.artist,
                        numberInAlbum,
                        path: songFile.path,
                        weight: 1
                    };
                    songs.push(song);
                }); */
                if (songs.length) {
                    const album: Album = {
                        albumName: directories[i].name,
                        artistName: artist.artist,
                        songs
                    };
                    tempArtist.albums = tempArtist.albums.concat([album]);
                }
            }
        }
        if (artist) {
            if (tempArtist.albums.length) {
                return Promise.resolve([tempArtist]);
            } else {
                return Promise.resolve([]);
            }
        } else {
            return Promise.resolve(artists);
        }
    }

    const getFiles = async () => {
        const path = `${RNFS.ExternalStorageDirectoryPath}/Music`
        await getPermission(false);
        const files = await RNFS.readDir(path)
        setLoadingMusic(true);
        const musicFiles = await getMusicFiles(files);
        musicFiles.forEach(artist => dispatch(addArtist(artist)));
        setLoadingMusic(false);
    };

    const reloadMusic = () => {
        dispatch(resetSavedAlbums());
        getFiles();
    };

    const itemSeparator = () => (<View style={styles.itemSeparator} />);

    const progressView = () => loadingMusic && (
        <View style={styles.loadingLPView}>
            <Circle
                progress={getProgress()}
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
            <Button onPress={() => getPermission()} title="get folder permission" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground}/>
            {itemSeparator()}
            <Button onPress={getFiles} title="scan for music" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
            {itemSeparator()}
            <Button onPress={reloadMusic} title="Reload music" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
            {itemSeparator()}
            <Button onPress={condenseAlbums} title="Condense albums by discs" color={colorScheme[isDarkMode ? 'dark' : 'light'].contentBackground} />
            {progressView()}
        </SafeAreaView>
    );
};

export default FetchMusicComponent;
