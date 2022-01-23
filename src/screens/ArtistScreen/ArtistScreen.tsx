import React from 'react';
import { useTypedSelector } from '../../state/reducers';

const ArtistScreen = () => {
    const artists = useTypedSelector(state => state.Albums);
}
