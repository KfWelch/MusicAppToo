import { Album, Artist, Song } from "../../models/MusicModel";

export const ADD_ARTIST = 'ALBUMS/ADD_ARTIST';
export const ADD_ALBUM = 'ALBUMS/ADD_ALBUM';
export const ADD_SONGS_TO_ALBUM = 'ALBUMS/ADD_SONGS';
export const SELECT_ARTIST = 'ALBUMS/SELECT_ARTIST';
export const DESELECT_ARTIST = 'ALBUMS/DESELECT_ARTIST';
export const COMBINE_MULTI_DISC_ALBUMS = 'ALBUMS/COMBINE_MULTI_DISC';
export const RESET = 'ALBUMS/RESET';

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

export const selectArtist = (artistName: string) => ({
    type: SELECT_ARTIST,
    payload: artistName
} as const);

export const deselectArtist = () => ({
    type: DESELECT_ARTIST
} as const);

/**
 * All albums supplied to this must be of the same artist
 * @param albums 
 * @returns 
 */
export const combineMultiDiscAlbums = (albums: Album[]) => ({
    type: COMBINE_MULTI_DISC_ALBUMS,
    payload: albums
} as const);

export const resetSavedAlbums = () => ({
    type: RESET
} as const);

export type Actions =
    ReturnType<typeof addArtist>
    | ReturnType<typeof addAlbum>
    | ReturnType<typeof addSongsToAlbum>
    | ReturnType<typeof selectArtist>
    | ReturnType<typeof deselectArtist>
    | ReturnType<typeof combineMultiDiscAlbums>
    | ReturnType<typeof resetSavedAlbums>;
