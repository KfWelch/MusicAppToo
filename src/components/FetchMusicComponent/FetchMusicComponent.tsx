
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

    const getPermission = () => {
        check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
            .then(result => {
                switch (result) {
                    case RESULTS.GRANTED: 
                        Toast.show({
                            type: 'info',
                            text1: 'Already have permissions'
                        });
                        break;
                    case RESULTS.UNAVAILABLE:
                        Toast.show({ type: 'error', text1: 'Unable to access external storage' });
                        break;
                    default:
                        request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
                            .then(result => {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Successfully got permissions'
                                });
                            })
                            .catch(e => {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Failed to get permissions'
                                });
                            });
                }
            })
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
                    const song: Song = {
                        title: songFile.name,
                        albumName: directories[i].name,
                        numberInAlbum: index,
                        path: songFile.path
                    };
                    songs.push(song);
                });
                const album: Album = {
                    albumName: directories[i].name,
                    songs
                };
                tempArtist.albums = tempArtist.albums.concat([album])
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
        const files = await RNFS.readDir(path)
        const musicFiles = await getMusicFiles(files);
        musicFiles.forEach(artist => dispatch(addArtist(artist)));
        setCurrentFiles(files);
        setFilesList(files.filter(file => file.isFile()));
        console.log(files);
    };

    const itemSeparator = () => (<View style={styles.itemSeparator} />);

    const renderItem = ({ item }: { item: RNFS.ReadDirItem }) => (
        <View style={styles.itemView}>
            <Text>{item.name}</Text>
            <Text>{item.path}</Text>
            <Text>{`type: ${(item.isDirectory() && 'Directory') || (item.isFile() && 'File')}`}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Button onPress={getPermission} title="get folder permission" />
            {itemSeparator()}
            <Button onPress={getFiles} title="scan for music" />
            <FlatList
                data={filesList}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                ItemSeparatorComponent={itemSeparator}
            />
        </SafeAreaView>
    )
};

export default FetchMusicComponent;
