
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import * as RNFS from 'react-native-fs';
import styles from './FetchMusicComponent.style';
import { Album, Artist, Song } from '../../models/MusicModel';
import { useTypedSelector } from '../../state/reducers';

const FetchMusicComponent = () => {
    const [currentFiles, setCurrentFiles] = useState<RNFS.ReadDirItem[]>([]);
    const [filesList, setFilesList] = useState<RNFS.ReadDirItem[]>([]);
    const [foundMusicFiles, setFoundMusicFiles] = useState<Album[]>([]);
    const artists = useTypedSelector(state => state.Albums);

    const getPermission = () => {
        check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
            .then(result => {
                switch (result) {
                    case RESULTS.GRANTED: break;
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

    const getMusicFiles = async (recursiveFiles: RNFS.ReadDirItem[], artist?: Artist): Artist => {
        const directories = recursiveFiles.filter(item => item.isDirectory());
        const albums: Album[] = [];

        // 1st iteration, for each artist
        // 2nd iteration, for each album
        directories.forEach(directory => {
            RNFS.readDir(directory.path)
                .then(files => {
                    // 1st iteration, we are looking at an artist, and recurse to go through all albums
                    if (!artist) {
                        getMusicFiles(files, { artist: directory.name, albums: [] });
                    // 2nd iteration, we are looking at an album, and we already have all the songs in the files
                    } else {
                        const songs: Song[] = [];
                        files.forEach((songFile, index) => {
                            const song: Song = {
                                title: songFile.name,
                                albumName: directory.name,
                                numberInAlbum: index,
                                path: songFile.path
                            };
                            songs.push(song);
                        });
                        const album: Album = {
                            albumName: directory.name,
                            songs
                        };
                        const tempArtist: Artist = {
                            artist: artist.artist,
                            albums: artist.albums.concat([album])
                        };
                    }
                })
        })
    }

    const getFiles = async () => {
        const path = `${RNFS.ExternalStorageDirectoryPath}/Music`
        RNFS.readDir(path)
            .then(files => {
                setCurrentFiles(files);
                setFilesList(files.filter(file => file.isFile()));
                console.log(files);
            })
            .catch(e => {
                Toast.show({
                    type: 'error',
                    text1: e.message,
                    text2: e.code
                });
            });
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
        <View style={styles.container}>
            <Button onPress={getPermission} title="get folder permission" />
            {itemSeparator()}
            <Button onPress={getFiles} title="scan for music" />
            <FlatList
                data={filesList}
                renderItem={renderItem}
                keyExtractor={item => item.name}
                ItemSeparatorComponent={itemSeparator}
            />
        </View>
    )
};

export default FetchMusicComponent;
