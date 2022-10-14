import { Album, Playlist, Song } from '../../models/MusicModel';
import { ShuffleType, PlaybackMode, RandomizationType } from '../reducers/Playlist';

export const ADD_SONG = 'PLAYLIST/ADD_SONG';
export const REMOVE_SONG = 'PLAYLIST/REMOVE_SONG';
export const ADD_ALBUM = 'PLAYLIST/ADD_ALBUM';
export const REMOVE_ALBUM = 'PLAYLIST/REMOVE_ALBUM';
export const GENERATE_PLAYLIST = 'PLAYLIST/GENERATE_PLAYLIST';
export const EDIT_PLAYLIST = 'PLAYLIST/EDIT';

export const SET_CURRENT_PLAYLIST = 'PLAYLIST/SET_CURRENT';
export const SET_ALBUM_AS_PLAYLIST = 'PLAYLIST/SET_ALBUM_AS';

export const SET_ALBUM_ORDERED = 'PLAYLIST/SET_ALBUM_ORDERED';
export const SET_SONG_WEIGHT = 'PLAYLIST/SET_SONG_WEIGHT';
export const SHUFFLE_CURRENT_PLAYLIST = 'PLAYLIST/SHUFFLE_CURRENT';
export const SET_CURRENT_PLAY_ARRAY = 'PLAYLIST/SET_PLAY_ARRAY';
export const SET_RANDOM_NEXT_SONG = 'PLAYLIST/SET_RANDOM_NEXT_SONG';
export const REMOVE_OLDEST_RANDOM_SONG = 'PLAYLIST/REMOVE_OLDEST_RANDOM';

export const SET_SAVED_PLAYLISTS = 'PLAYLIST/SET_SAVED_LISTS';
export const SET_PLAYLIST_TO_EDIT = 'PLAYLIST/SET_TO_EDIT';
export const REMOVE_PLAYLIST = 'PLAYLIST/REMOVE';

export const SET_PLAYBACK_MODE = 'PLAYLIST/SET_PLAYBACK_MODE';
export const SET_REPEAT = 'PLAYLIST/SET_REPEAT';
export const SET_SHUFFLE_TYPE = 'PLAYLIST/SET_ORDERED_TYPE';
export const SET_RESHUFFLE = 'PLAYLIST/SET_RESHUFFLE';
export const SET_RANDOMIZE_TYPE = 'PLAYLIST/SET_RANDOMIZE_TYPE';

export const SET_LAST_SONG_PLAYED = 'PLAYLIST/SET_LAST_SONG';

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

export const editPlaylist = (playlistName: string, newName?: string) => ({
    type: EDIT_PLAYLIST,
    payload: { playlistName, newName }
} as const);

export const setCurrentPlaylist = (playlist: Playlist) => ({
    type: SET_CURRENT_PLAYLIST,
    payload: playlist
} as const);

export const setAlbumAsCurrentPlaylist = (album: Album) => ({
    type: SET_ALBUM_AS_PLAYLIST,
    payload: album
} as const);

export const setAlbumOrdered = (albumId: string, ordered: boolean, playlistName?: string) => ({
    type: SET_ALBUM_ORDERED,
    payload: { playlistName, albumId, ordered }
} as const);

export const setSongWeight = (songId: string, weight: number, playlistName?: string) => ({
    type: SET_SONG_WEIGHT,
    payload: { playlistName, songId, weight }
} as const);

export const shuffleCurrentPlaylist = () => ({
    type: SHUFFLE_CURRENT_PLAYLIST
} as const);

export const setCurrentPlayArray = (songs: Song[]) => ({
    type: SET_CURRENT_PLAY_ARRAY,
    payload: songs
} as const);

export const setRandomNextSongs = (songs: Song[]) => ({
    type: SET_RANDOM_NEXT_SONG,
    payload: songs
} as const);

export const removeOldestRandomSongs = (numberToRemove = 1) => ({
    type: REMOVE_OLDEST_RANDOM_SONG,
    payload: numberToRemove
} as const);

export const setSavedPlaylists = (playlists: Playlist[]) => ({
    type: SET_SAVED_PLAYLISTS,
    payload: playlists
} as const);

export const setPlaylistToEdit = () => ({
    type: SET_PLAYLIST_TO_EDIT
} as const);

export const removePlaylist = (playlistName: string) => ({
    type: REMOVE_PLAYLIST,
    payload: playlistName
} as const);

export const setPlaybackMode = (playbackMode: PlaybackMode) => ({
    type: SET_PLAYBACK_MODE,
    payload: playbackMode
} as const);

export const setRepeat = (repeat: boolean) => ({
    type: SET_REPEAT,
    payload: repeat
} as const);

export const setShuffleType = (orderedType: ShuffleType) => ({
    type: SET_SHUFFLE_TYPE,
    payload: orderedType
} as const);

export const setReshuffle = (reshuffle: boolean) => ({
    type: SET_RESHUFFLE,
    payload: reshuffle
} as const);

export const setRandomizeType = (randomizeType: RandomizationType) => ({
    type: SET_RANDOMIZE_TYPE,
    payload: randomizeType
} as const);

export const setLastSongPlayed = (index: number) => ({
    type: SET_LAST_SONG_PLAYED,
    payload: index
} as const);

export type Actions =
    ReturnType<typeof addSong>
    | ReturnType<typeof removeSong>
    | ReturnType<typeof addAlbum>
    | ReturnType<typeof removeAlbum>
    | ReturnType<typeof generatePlaylist>
    | ReturnType<typeof editPlaylist>
    | ReturnType<typeof setCurrentPlaylist>
    | ReturnType<typeof setAlbumAsCurrentPlaylist>
    | ReturnType<typeof setAlbumOrdered>
    | ReturnType<typeof setSongWeight>
    | ReturnType<typeof shuffleCurrentPlaylist>
    | ReturnType<typeof setCurrentPlayArray>
    | ReturnType<typeof setRandomNextSongs>
    | ReturnType<typeof removeOldestRandomSongs>
    | ReturnType<typeof setSavedPlaylists>
    | ReturnType<typeof setPlaylistToEdit>
    | ReturnType<typeof removePlaylist>
    | ReturnType<typeof setPlaybackMode>
    | ReturnType<typeof setRepeat>
    | ReturnType<typeof setShuffleType>
    | ReturnType<typeof setReshuffle>
    | ReturnType<typeof setRandomizeType>
    | ReturnType<typeof setLastSongPlayed>;
