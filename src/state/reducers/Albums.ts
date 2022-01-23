import { Artist } from "../../models/MusicModel";
import { Actions, ADD_ALBUM, ADD_ARTIST, ADD_SONGS_TO_ALBUM } from '../actions/Albums';

interface AlbumsState {
    artists: Artist[];
};

const initialState: AlbumsState = {
    artists: []
};

export const Albums = (state = initialState, action: Actions): AlbumsState => {
    switch (action.type) {
        case ADD_ARTIST:
            return {
                ...state,
                artists: [...state.artists, action.payload]
            };
        case ADD_ALBUM: {
            const index = state.artists.findIndex(artist => artist.artist === action.payload.artistName);
            const newArtists = [...state.artists];
            newArtists[index].albums.push(action.payload.album);
            return {
                ...state,
                artists: newArtists
            };
        }
        case ADD_SONGS_TO_ALBUM: {
            const artistIndex = state.artists.findIndex(artist => artist.artist === action.payload.artistName);
            const newArtists = [...state.artists];
            const albumIndex = state.artists[artistIndex].albums.findIndex(album => album.albumName === action.payload.albumName);
            const newAlbums = [...state.artists[artistIndex].albums];
            const newSongs = newAlbums[albumIndex].songs.concat(action.payload.songs);
            newAlbums[albumIndex].songs = newSongs;
            newArtists[artistIndex].albums = newAlbums;
            return {
                ...state,
                artists: newArtists
            }
        }
        default:
            return state;
    }
}
