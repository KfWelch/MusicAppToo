import { Album, Artist, Song } from "../../models/MusicModel";
import { disclessAlbumName } from "../../utils/musicUtils";
import {
    Actions,
    ADD_ALBUM,
    ADD_ARTIST,
    ADD_SONGS_TO_ALBUM,
    COMBINE_MULTI_DISC_ALBUMS,
    DESELECT_ARTIST,
    RESET,
    SELECT_ARTIST
} from '../actions/Albums';

interface AlbumsState {
    artists: Artist[];
    selectedArtist?: Artist;
};

const initialState: AlbumsState = {
    artists: [],
    selectedArtist: undefined
};

export const Albums = (state = initialState, action: Actions): AlbumsState => {
    const oldState: AlbumsState = { ...state };
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
        case SELECT_ARTIST:
            return {
                ...state,
                selectedArtist: state.artists.find(artist => artist.artist === action.payload)
            };
        case DESELECT_ARTIST:
            return {
                ...state,
                selectedArtist: undefined
            }
        case COMBINE_MULTI_DISC_ALBUMS: {
            const artistIndex = oldState.artists.findIndex(artist => artist.artist === action.payload[0].artistName);
            const artist: Artist = { ...oldState.artists[artistIndex] };
            if (artistIndex >= 0) {
                const newAlbum: Album = {
                    albumName: disclessAlbumName(action.payload[0].albumName),
                    artistName: artist.artist,
                    songs: action.payload.reduce((songs: Song[], album) => songs.concat(album.songs), [])
                };
                const newAlbums = artist.albums.filter(album => !action.payload.includes(album));
                newAlbums.push(newAlbum);
                artist.albums = newAlbums;
                oldState.artists.splice(artistIndex, 1, artist);
                return {
                    ...state,
                    artists: oldState.artists
                };
            }
            return state;
        }
        case RESET:
            return {
                artists: [],
                selectedArtist: undefined
            };
        default:
            return state;
    }
}
