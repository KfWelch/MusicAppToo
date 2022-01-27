import { Track } from "react-native-track-player";
import { Album, Song } from "../models/MusicModel";

export const convertSongToTrack = (song: Song): Track => {
    return {
        url: song.path || '',
        album: song.albumName,
        title: song.title
    }
};

export const getSongId = (song: Song): string => `${song.albumName}-${song.title}`;

export const getAlbumId = (album: Album): string => `${album.artistName}-${album.albumName}`;
