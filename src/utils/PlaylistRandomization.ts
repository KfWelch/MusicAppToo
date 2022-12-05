import _ from 'lodash';
import { Playlist, Song } from '../models/MusicModel.d';

export const getRandomizedSongs = (playlist: Playlist, numberToGet: number, weighted: boolean, noSkip: boolean): Song[] => {
    const songsToAdd: Song[] = [];
    songsToAdd.push(getRandomizedNextSong(playlist, weighted));
    for (let i = 1; i < numberToGet; i++) {
        let nextSong: Song;
        if (noSkip) {
            nextSong = getRandomizedNextSong(
                playlist,
                weighted,
                songsToAdd[i - 1]
            );
        } else {
            nextSong = getRandomizedNextSong(
                playlist,
                weighted
            );
        }
        songsToAdd.push(nextSong);
    }
    return songsToAdd;
}

export const getRandomizedNextSong = (playlist: Playlist, weighted: boolean, previousSong?: Song): Song => {
    const availableSongs = weighted ? getWeightedAvailableSongs(playlist) : getAvailableSongs(playlist);

    const numberOfSongs = availableSongs.length;
    let randomIndex = Math.floor(Math.random() * numberOfSongs);
    while (_.isEqual(availableSongs[randomIndex], previousSong)) {
        randomIndex = Math.floor(Math.random() * numberOfSongs);
    }
    return availableSongs[randomIndex];
};

const getAvailableSongs = (playlist: Playlist): Song[] => {
    let availableSongs: Song[] = [...playlist.songs];
    playlist.albums.forEach(album => availableSongs = availableSongs.concat(album.songs));

    return availableSongs;
};

const getWeightedAvailableSongs = (playlist: Playlist): Song[] => {
    const availableSongs: Song[] = [];
    playlist.songs.forEach(song => {
        for (let i = 0; i < song.weight; i++) {
            availableSongs.push(song)
        }
    });
    playlist.albums.forEach(album => {
        album.songs.forEach(song => {
            for (let i = 0; i < song.weight; i++) {
                availableSongs.push(song);
            }
        });
    });

    return availableSongs;
};
