import React from 'react';
import { SafeAreaView } from 'react-native';
import ArtistList from '../../components/ArtistListComponent/ArtistListComponent';
import styles from './Home.style';

interface HomeProps {
    searched: string;
}

const Home = (props: HomeProps) => (
    <SafeAreaView style={styles.container}>
        <ArtistList searched={props.searched} />
    </SafeAreaView>
);


export default Home;
