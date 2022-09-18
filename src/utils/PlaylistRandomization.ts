import { Playlist, Song } from "../models/MusicModel.d";

export const getRandomizedNextSong = (playlist: Playlist, weighted = false): Song => {
    const availableSongs = weighted ? getWeightedAvailableSongs(playlist) : getAvailableSongs(playlist);

    const numberOfSongs = availableSongs.length;
    const randomIndex = Math.floor(Math.random() * numberOfSongs);
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
