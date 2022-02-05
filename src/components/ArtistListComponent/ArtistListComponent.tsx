import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { Album, Artist, Song } from "../../models/MusicModel";
import { selectArtist } from "../../state/actions/Albums";
import { useTypedSelector } from "../../state/reducers";
import AlbumCard from "../Cards/AlbumCard/AlbumCard";
import ArtistCard from "../Cards/ArtistCard/ArtistCard";
import ComponentDropDown from "../Cards/ComponentDropDown/ComponentDropDown";
import DropDownCard from "../Cards/DropDownCard/DropDownCard";
import SongCard from "../Cards/SongCard/SongCard";
import styles from "./ArtistListComponent.style";

const ArtistList = () => {
    const artists = useTypedSelector(state => state.Albums.artists);
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const selectArtistFromList = (artistName: string, pressedTitle: string) => {
        dispatch(selectArtist(artistName));
        // @ts-ignore
        navigation.navigate('ArtistScreen');
    };

    const renderItem = ({ item }: { item: Artist }) => (
        <DropDownCard
            mainItem={item.artist}
            mainItemHelperText={`${item.albums.length} albums`}
            onItemClick={(text) => selectArtistFromList(item.artist, text)}
            subItems={item.albums.reduce((prevVal, currVal) => prevVal.concat(currVal.albumName), [] as string[])}
        />
    );

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
                                                keyExtractor={(item, index) => `${item.title}-${index}`}
                                            />
                                        )}
                                    />
                                )}
                                keyExtractor={(item, index) => `${item.albumName}-${index}`}
                            />
                        )}
                    />
                )}
                keyExtractor={(item, index) => `${item.artist}-${index}`}
                ItemSeparatorComponent={itemSeparator}
            />
        </SafeAreaView>
    );
};

export default ArtistList;
