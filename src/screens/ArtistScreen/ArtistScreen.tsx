import React, { useEffect, useState } from 'react';
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';
import AlbumList from '../../components/AlbumListComponent/AlbumList';
import PlaybackControl from '../../components/PlaybackControl/PlaybackControl';
import { useTypedSelector } from '../../state/reducers';

const ArtistScreen = (): JSX.Element => {
    const artists = useTypedSelector(state => state.Albums);
    // const showPlaybackControl = TrackPlayer.

    return (
        <>
        <AlbumList />
        <PlaybackControl
            play={() => TrackPlayer.play()}
            pause={() => TrackPlayer.pause()}
            restart={() => {}}
            seek={() => {}}
            setVol={() => {}}
            skipBack={() => TrackPlayer.skipToPrevious()}
            skipForward={() => TrackPlayer.skipToNext()}
            skipTo={() => {}}
            stop={() => {}}
        />
        </>
    )
}

export default ArtistScreen;
