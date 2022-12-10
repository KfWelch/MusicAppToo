import React from 'react';
import { SafeAreaView } from 'react-native';
import ArtistList from '../../components/ArtistListComponent/ArtistListComponent';
import styles from './Home.style';

const Home = () => (
    <SafeAreaView style={styles.container}>
        <ArtistList />
    </SafeAreaView>
);


export default Home;
