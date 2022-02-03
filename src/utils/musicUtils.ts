import { Track } from "react-native-track-player";
import { Album, Song } from "../models/MusicModel";

export const convertSongToTrack = (song: Song): Track => {
    return {
        url: song.path || '',
        album: song.albumName,
        title: song.title,
        artist: song.contributingArtist
    }
};

export const convertSongListToTracks = (songs: Song[]): Track[] => {
    const trackList: Track[] = [];
    songs.forEach(song => trackList.push(convertSongToTrack(song)));
    return trackList;
}

export const getSongId = (song: Song): string => `${song.albumName}§${song.title}`;
export const getAlbumFromSongId = (songId: string): string => songId.substring(0, songId.indexOf('§'));
export const getSongTitleFromId = (songId: string): string => songId.substring(songId.indexOf('§'));

export const getAlbumId = (album: Album): string => `${album.artistName}§${album.albumName}`;
export const getArtistFromAlbumId = (albumId: string): string => albumId.substring(0, albumId.indexOf('§'));

export const getPlayArray = (albums: Album[], songs: Song[]): Song[] => {
    const playArray = albums.reduce((prevVal: Song[], currVal) => prevVal.concat(currVal.songs), []);

    return playArray
        .concat(songs)
        .reduce(
            (prevVal: Song[], currVal) => prevVal.includes(currVal) ? prevVal : prevVal.concat([currVal]),
            []
        );
};
