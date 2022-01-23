
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Toast from 'react-native-toast-message';
import * as RNFS from 'react-native-fs';
import styles from './FetchMusicComponent.style';
import { Album } from '../../models/MusicModel';

const FetchMusicComponent = () => {
    const [currentFiles, setCurrentFiles] = useState<RNFS.ReadDirItem[]>([]);
    const [filesList, setFilesList] = useState<RNFS.ReadDirItem[]>([]);
    const [foundMusicFiles, setFoundMusicFiles] = useState<Album[]>([]);

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

    const getMusicFiles = async (recursiveFiles: RNFS.ReadDirItem[]) => {
        const directories = recursiveFiles.filter(item => item.isDirectory());
        if (directories.length === 0) {
            
        }

        directories.forEach(directory => {
            RNFS.readDir(directory.path)
                .then(files => {

                })
        })
    }

    const getFiles = async () => {
        const path = `${RNFS.ExternalStorageDirectoryPath}/Music`
        RNFS.readDir(path)
            .then(files => {
                setCurrentFiles(files);
                setFilesList(files.filter(file => file.isFile()));
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
