import { Album, Playlist as PlaylistModel, Song } from '../../models/MusicModel.d';
import { getAlbumId, getSongId } from '../../utils/musicUtils';
import { spreadOrderedAlbumShuffle } from '../../utils/OrderedAlbumShuffle';
import {
    Actions, ADD_ALBUM, ADD_SONG, ADD_SONG_TO_PLAYLIST, GENERATE_PLAYLIST, OrderedType, REMOVE_ALBUM, REMOVE_SONG
} from '../actions/Playlist';

interface PlaylistState {
    currentPlaylist: PlaylistModel | null;
    savedPlaylists: PlaylistModel[];
    newPlaylist: {
        individualSongs: Song[];
        albums: Album[];
    };
};

const initialState: PlaylistState = {
    currentPlaylist: null,
    savedPlaylists: [],
    newPlaylist: {
        individualSongs: [],
        albums: []
    }
};

export const Playlist = (state = initialState, action: Actions): PlaylistState => {
    switch (action.type) {
        case ADD_SONG:
            // no checking logic here because we want to return feedback 
            return {
                ...state,
                newPlaylist: {
                    ...state.newPlaylist,
                    individualSongs: [...state.newPlaylist.individualSongs, action.payload]
                }
            };
        case REMOVE_SONG: {
            const newSongs = state.newPlaylist.individualSongs.filter(song => getSongId(song) !== action.payload);
            return {
                ...state,
                newPlaylist: {
                    ...state.newPlaylist,
                    individualSongs: newSongs
                }
            };
        }
        case ADD_ALBUM:
            // ditto to line 28
            return {
                ...state,
                newPlaylist: {
                    ...state.newPlaylist,
                    albums: [...state.newPlaylist.albums, action.payload]
                }
            };
        case REMOVE_ALBUM: {
            const newAlbums = state.newPlaylist.albums.filter(album => getAlbumId(album) !== action.payload);
            return {
                ...state,
                newPlaylist: {
                    ...state.newPlaylist,
                    albums: newAlbums
                }
            };
        }
        case GENERATE_PLAYLIST: {
            
        }
        default:
            return state;
    }
}
