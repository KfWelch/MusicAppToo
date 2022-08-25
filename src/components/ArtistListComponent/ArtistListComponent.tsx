import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { FlatList, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";
import { useDispatch } from "react-redux";
import { Album, Artist, Song } from "../../models/MusicModel";
import { selectArtist } from "../../state/actions/Albums";
import { setAlbumAsCurrentPlaylist } from "../../state/actions/Playlist";
import { useTypedSelector } from "../../state/reducers";
import { convertSongListToTracks, getAlbumId, getSongId } from "../../utils/musicUtils";
import AlbumCard from "../Cards/AlbumCard/AlbumCard";
import ArtistCard from "../Cards/ArtistCard/ArtistCard";
import ComponentDropDown from "../Cards/ComponentDropDown/ComponentDropDown";
import SongCard from "../Cards/SongCard/SongCard";
import styles from "./ArtistListComponent.style";

const ArtistList = () => {
    const albumsState = useTypedSelector(state => state.Albums);
    const currentPlaylist = useTypedSelector(state => state.Playlist.currentPlaylist);
    const autoPlay = useTypedSelector(state => state.Options.autoPlayOnReload);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const options = useTypedSelector(state => state.Options);
    const systemColorScheme = useColorScheme();
    const isDarkMode = options.overrideSystemAppearance ? options.isDarkmode : systemColorScheme === 'dark';
    const { artists } = albumsState;

    const selectArtistFromList = (artistName: string, pressedTitle: string) => {
        dispatch(selectArtist(artistName));
        // @ts-ignore
        navigation.navigate('ArtistScreen');
    };

    useEffect(() => {
        if (autoPlay) {
            TrackPlayer.reset().then(() => {
                if (navigation.isFocused() && currentPlaylist) {
                    TrackPlayer.add(convertSongListToTracks(currentPlaylist.playArray))
                        .then(() => {
                            TrackPlayer.play();
                            // @ts-ignore
                            navigation.navigate('Playback');
                        });
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
                                            dispatch(setAlbumAsCurrentPlaylist(item));
                                            await TrackPlayer.reset();
                                            if (currentPlaylist) {
                                                await TrackPlayer.add(convertSongListToTracks(currentPlaylist.playArray));
                                                TrackPlayer.play();
                                                // @ts-ignore
                                                navigation.navigate('Playback')
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
