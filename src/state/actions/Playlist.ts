import { Album, Playlist, Song } from '../../models/MusicModel';

export const ADD_SONG = 'PLAYLIST/ADD_SONG';
export const REMOVE_SONG = 'PLAYLIST/REMOVE_SONG';
export const ADD_ALBUM = 'PLAYLIST/ADD_ALBUM';
export const REMOVE_ALBUM = 'PLAYLIST/REMOVE_ALBUM';
export const GENERATE_PLAYLIST = 'PLAYLIST/GENERATE_PLAYLIST';
export const ADD_SONG_TO_PLAYLIST = 'PLAYLIST/ADD_SONG_TO_PLAYLIST';
export const REMOVE_SONG_FROM_PLAYLIST = 'PLAYLIST/REMOVE_SONG_FROM_PLAYLIST';
export const ADD_ALBUM_TO_PLAYLIST = 'PLAYLIST/ADD_ALBUM_TO_PLAYLIST';
export const REMOVE_ALBUM_FROM_PLAYLIST = 'PLAYLIST/REMOVE_ALBUM_FROM_PLAYLIST';
export const SET_CURRENT_PLAYLIST = 'PLAYLIST/SET_CURRENT';
export const SHUFFLE_CURRENT_PLAYLIST = 'PLAYLIST/SHUFFLE_CURRENT';
export const SET_SAVED_PLAYLISTS = 'PLAYLIST/SET_SAVED_LISTS';

export enum OrderedType {
    NONE,
    SPREAD,
    RANDOM
};

export enum RandomizationType {
    NONE,
    WEIGHTLESS,
    WEIGHTED
}

export const addSong = (song: Song) => ({
    type: ADD_SONG,
    payload: song
} as const);

export const removeSong = (songId: string) => ({
    type: REMOVE_SONG,
    payload: songId
} as const);

export const addAlbum = (album: Album) => ({
    type: ADD_ALBUM,
    payload: album
} as const);

export const removeAlbum = (albumName: string) => ({
    type: REMOVE_ALBUM,
    payload: albumName
} as const);

export const generatePlaylist = (playlistName: string) => ({
    type: GENERATE_PLAYLIST,
    payload: playlistName
} as const);

export const addSongToPlaylist = (song: Song, playlistName: string) => ({
    type: ADD_SONG_TO_PLAYLIST,
    payload: { song, playlistName }
} as const);

export const removeSongFromPlaylist = (songId: string, playlistName: string) => ({
    type: REMOVE_SONG_FROM_PLAYLIST,
    payload: { songId, playlistName }
} as const);

export const addAlbumToPlaylist = (album: Album, playlistName: string) => ({
    type: ADD_ALBUM_TO_PLAYLIST,
    payload: { album, playlistName }
} as const);

export const removeAlbumFromPlaylist = (albumName: string, playlistName: string) => ({
    type: REMOVE_ALBUM_FROM_PLAYLIST,
    payload: { albumName, playlistName }
} as const);

export const setCurrentPlaylist = (playlist: Playlist) => ({
    type: SET_CURRENT_PLAYLIST,
    payload: playlist
} as const);

export const shuffleCurrentPlaylist = (playlistName: string, orderedType: OrderedType) => ({
    type: SHUFFLE_CURRENT_PLAYLIST,
    payload: { playlistName, orderedType }
} as const);

export const setSavedPlaylists = (playlists: Playlist[]) => ({
    type: SET_SAVED_PLAYLISTS,
    payload: playlists
} as const);

export type Actions =
    ReturnType<typeof addSong>
    | ReturnType<typeof removeSong>
    | ReturnType<typeof addAlbum>
    | ReturnType<typeof removeAlbum>
    | ReturnType<typeof generatePlaylist>
    | ReturnType<typeof addSongToPlaylist>
    | ReturnType<typeof removeSongFromPlaylist>
    | ReturnType<typeof addAlbumToPlaylist>
    | ReturnType<typeof removeAlbumFromPlaylist>
    | ReturnType<typeof setCurrentPlaylist>
    | ReturnType<typeof shuffleCurrentPlaylist>
    | ReturnType<typeof setSavedPlaylists>;
