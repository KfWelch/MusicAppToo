
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, Text, View } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import * as RNFS from 'react-native-fs';
import styles from './FetchMusicComponent.style';
import { Album, Artist, Song } from '../../models/MusicModel';
import { useTypedSelector } from '../../state/reducers';
import { useDispatch } from 'react-redux';
import { addArtist } from '../../state/actions/Albums';

const FetchMusicComponent = () => {
    const [currentFiles, setCurrentFiles] = useState<RNFS.ReadDirItem[]>([]);
    const [filesList, setFilesList] = useState<RNFS.ReadDirItem[]>([]);
    const [foundMusicFiles, setFoundMusicFiles] = useState<Album[]>([]);
    const artists = useTypedSelector(state => state.Albums);
    const dispatch = useDispatch();

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
        const tempArtist: Artist = { ...(artist || { artist: '', albums: [] }) };
        let artists: Artist[] = [];

        // 1st iteration, for each artist
        // 2nd iteration, for each album
        // By iteration, I mean levels deep of the recursion
        for (let i = 0; i < directories.length; i++) {
            const files = await RNFS.readDir(directories[i].path);
            // 1st iteration, we are looking at an artist, and recurse to go through all albums
            if (!artist) {
                artists = artists.concat(await getMusicFiles(files, { artist: directories[i].name, albums: [] }));
            // 2nd iteration, we are looking at an album, and we already have all the songs in the files
            } else {
                const songs: Song[] = [];
                files.forEach((songFile, index) => {
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
                        numberInAlbum,
                        path: songFile.path,
                        weight: 1
                    };
                    songs.push(song);
                });
                const album: Album = {
                    albumName: directories[i].name,
                    artistName: artist.artist,
                    songs
                };
                tempArtist.albums = tempArtist.albums.concat([album]);
            }
        }
        if (artist) {
            return Promise.resolve([tempArtist]);
        } else {
            return Promise.resolve(artists);
        }
    }

    const getFiles = async () => {
        const path = `${RNFS.ExternalStorageDirectoryPath}/Music`
        await getPermission(false);
        const files = await RNFS.readDir(path)
        const musicFiles = await getMusicFiles(files);
        musicFiles.forEach(artist => dispatch(addArtist(artist)));
        setCurrentFiles(files);
        setFilesList(files.filter(file => file.isFile()));
    };

    const itemSeparator = () => (<View style={styles.itemSeparator} />);

    return (
        <SafeAreaView style={styles.container}>
            <Button onPress={() => getPermission()} title="get folder permission" />
            {itemSeparator()}
            <Button onPress={getFiles} title="scan for music" />
        </SafeAreaView>
    )
};

export default FetchMusicComponent;
