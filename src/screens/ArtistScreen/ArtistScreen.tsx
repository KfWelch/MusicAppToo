import React from 'react';
import AlbumList from '../../components/AlbumListComponent/AlbumList';
import { useTypedSelector } from '../../state/reducers';

const ArtistScreen = (): JSX.Element => {
    const artists = useTypedSelector(state => state.Albums);

    return (
        <>
        <AlbumList />
        </>
    )
}

export default ArtistScreen;
