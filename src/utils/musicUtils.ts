import { Track } from 'react-native-track-player';
import { GetMusicAlbum, GetMusicTrack } from '../models/GetMusicFiles.d';
import { Album, Artist, Playlist, Song } from '../models/MusicModel.d';

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

export const getSongId = (song: Song): string => `${song.contributingArtist}§${song.albumName}§${song.title}`;
export const getAlbumIdFromSongId = (songId: string): string => songId.substring(0, songId.lastIndexOf('§'));
export const getSongTitleFromId = (songId: string): string => songId.substring(songId.lastIndexOf('§') + 1);

export const getAlbumId = (album: Album): string => `${album.artistName}§${album.albumName}`;
export const getArtistFromAlbumId = (albumId: string): string => albumId.substring(0, albumId.indexOf('§'));

export const getMusicTrackId = (track: GetMusicTrack) => `${track.artist}§${track.album}§${track.title}`;
export const getMusicAlbumId = (album: GetMusicAlbum) => `${album.author}§${album.album}`;

export const getPlayArray = (playlist: Playlist): Song[] => {
    const { albums, songs } = playlist;
    const playArray = albums.reduce((prevVal: Song[], currVal) => prevVal.concat(currVal.songs), []);

    return playArray
        .concat(songs)
        .reduce(
            (prevVal: Song[], currVal) => prevVal.includes(currVal) ? prevVal : prevVal.concat([currVal]),
            []
        );
};

export const getNewPlayArray = (albums: Album[], songs: Song[]) => {
    const playArray = albums.reduce((prevVal: Song[], currVal) => prevVal.concat(currVal.songs), []);

    return playArray
        .concat(songs)
        .reduce(
            (prevVal: Song[], currVal) => prevVal.includes(currVal) ? prevVal : prevVal.concat([currVal]),
            []
        );
};

export const disclessAlbumName = (albumName: string): string => albumName.toLowerCase().includes('disc')
    ? albumName.substring(0, albumName.lastIndexOf(' ', albumName.toLowerCase().lastIndexOf('disc') - 1))
    : albumName;

export const getArtistFromPath = (filePath: string): string => {
    const folders = filePath.split(/\\.|(\/)/g);
    return folders[folders.length - 5];
};

export const getTotalNumberOfAlbums = (artists: Artist[]): number => {
    let count = 0;
    artists.forEach(artist => {
        count += artist.albums.length;
    });
    return count;
};
