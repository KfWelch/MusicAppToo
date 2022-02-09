import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { Album, Artist, Song } from "../../models/MusicModel";
import { selectArtist } from "../../state/actions/Albums";
import { useTypedSelector } from "../../state/reducers";
import { getAlbumId, getSongId } from "../../utils/musicUtils";
import AlbumCard from "../Cards/AlbumCard/AlbumCard";
import ArtistCard from "../Cards/ArtistCard/ArtistCard";
import ComponentDropDown from "../Cards/ComponentDropDown/ComponentDropDown";
import SongCard from "../Cards/SongCard/SongCard";
import styles from "./ArtistListComponent.style";

const ArtistList = () => {
    const albumsState = useTypedSelector(state => state.Albums);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { artists } = albumsState;

    const selectArtistFromList = (artistName: string, pressedTitle: string) => {
        dispatch(selectArtist(artistName));
        // @ts-ignore
        navigation.navigate('ArtistScreen');
    };
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
                                        mainItemCard={(<AlbumCard album={item} />)}  
                                        subItemFlatlist={(
                                            <FlatList
                                                data={item.songs}
                                                renderItem={({ item }: { item: Song }) => (<SongCard song={item} />)}
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
