import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { Artist } from "../../models/MusicModel";
import { selectArtist } from "../../state/actions/Albums";
import { useTypedSelector } from "../../state/reducers";
import DropDownCard from "../Cards/DropDownCard/DropDownCard";
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
        <FlatList
            data={artists}
            renderItem={renderItem}
            keyExtractor={item => item.artist}
            ItemSeparatorComponent={itemSeparator}
        />
    );
};

export default ArtistList;
