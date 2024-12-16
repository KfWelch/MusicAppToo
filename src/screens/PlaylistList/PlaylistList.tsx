import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useTypedSelector } from '../../state/reducers';
import { FlatList, SafeAreaView, View } from 'react-native';
import { Playlist } from '../../models/MusicModel';
import PlaylistCard from '../../components/Cards/PlaylistCard/PlaylistCard';
import styles from './PlaylistList.style';
import { titleSort } from '../../utils/stringUtils';

const PlaylistList = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const playlists = useTypedSelector(state => state.Playlist.savedPlaylists);

    const sortedPlaylists = useMemo(() => (
        [...playlists].sort((a, b) => titleSort(a.name, b.name))
    ), [playlists]);

    const renderPlaylistItem = ({ item }: { item: Playlist }) => (
        <PlaylistCard
            playlist={item}
            navigation={navigation}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={sortedPlaylists}
                renderItem={renderPlaylistItem}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                ItemSeparatorComponent={() => (<View style={{ height: 2 }} />)}
            />
        </SafeAreaView>
    )
}

export default PlaylistList;
