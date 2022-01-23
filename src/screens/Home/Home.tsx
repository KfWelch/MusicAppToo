import React from "react";
import { SafeAreaView } from "react-native";
import ArtistList from "../../components/ArtistListComponent/ArtistListComponent";
import FetchMusicComponent from "../../components/FetchMusicComponent/FetchMusicComponent";
import styles from "./Home.style";

const Home = () => (
    <SafeAreaView style={styles.container}>
        <FetchMusicComponent />
        <ArtistList />
    </SafeAreaView>
);

export default Home;
