import { Album, Artist, Song } from "../../models/MusicModel";

export const ADD_ARTIST = 'ALBUMS/ADD_ARTIST';
export const ADD_ALBUM = 'ALBUMS/ADD_ALBUM';
export const ADD_SONGS_TO_ALBUM = 'ALBUMS/ADD_SONGS';

export const addArtist = (artist: Artist) => ({
    type: ADD_ARTIST,
    payload: artist
} as const);

export const addAlbum = (artistName: string, album: Album) => ({
    type: ADD_ALBUM,
    payload: { artistName, album }
} as const);

export const addSongsToAlbum = (artistName: string, albumName: string, songs: Song[]) => ({
    type: ADD_SONGS_TO_ALBUM,
    payload: { artistName, albumName, songs }
} as const);

export type Actions =
    ReturnType<typeof addArtist>
    | ReturnType<typeof addAlbum>
    | ReturnType<typeof addSongsToAlbum>;
