import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers';
import { FlatList, SafeAreaView } from 'react-native';
import { Playlist } from '../../models/MusicModel';
import PlaylistCard from '../../components/Cards/PlaylistCard/PlaylistCard';
import styles from './PlaylistList.style';

const PlaylistList = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const playlists = useTypedSelector(state => state.Playlist.savedPlaylists);

    const renderPlaylistItem = ({ item }: { item: Playlist }) => (
        <PlaylistCard
            playlist={item}
            navigation={navigation}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={playlists}
                renderItem={renderPlaylistItem}
                keyExtractor={(item, index) => `${item.name}-${index}`}
            />
        </SafeAreaView>
    )
}

export default PlaylistList;
