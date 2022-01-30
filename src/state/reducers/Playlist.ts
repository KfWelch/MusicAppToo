import { Album, Playlist as PlaylistModel, Song } from '../../models/MusicModel.d';
import { getAlbumFromSongId, getAlbumId, getPlayArray, getSongId, getSongTitleFromId } from '../../utils/musicUtils';
import { spreadOrderedAlbumShuffle } from '../../utils/OrderedAlbumShuffle';
import {
    Actions,
    ADD_ALBUM,
    ADD_ALBUM_TO_PLAYLIST,
    ADD_SONG,
    ADD_SONG_TO_PLAYLIST,
    GENERATE_PLAYLIST,
    OrderedType,
    REMOVE_ALBUM,
    REMOVE_ALBUM_FROM_PLAYLIST,
    REMOVE_PLAYLIST,
    REMOVE_SONG,
    REMOVE_SONG_FROM_PLAYLIST,
    SET_ALBUM_AS_PLAYLIST,
    SET_ALBUM_ORDERED,
    SET_CURRENT_PLAYLIST,
    SET_SONG_WEIGHT,
    SHUFFLE_CURRENT_PLAYLIST
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
            const playlist: PlaylistModel = {
                name: action.payload,
                albums: state.newPlaylist.albums,
                songs: state.newPlaylist.individualSongs,
                playArray: getPlayArray(state.newPlaylist.albums, state.newPlaylist.individualSongs)
            };
            return {
                ...state,
                savedPlaylists: [...state.savedPlaylists, playlist],
                newPlaylist: {
                    albums: [],
                    individualSongs: []
                }
            };
        }
        case ADD_SONG_TO_PLAYLIST: {
            const playlistIndex = state.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
            const playlist = state.savedPlaylists.at(playlistIndex);
            if (playlist) {
                playlist.songs.push(action.payload.song);
                playlist.playArray.push(action.payload.song);
                return {
                    ...state,
                    savedPlaylists: state.savedPlaylists.splice(playlistIndex, 1, playlist)
                };
            }
            return state;
        }
        case REMOVE_SONG_FROM_PLAYLIST: {
            const playlistIndex = state.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
            const playlist = state.savedPlaylists.at(playlistIndex);
            if (playlist) {
                playlist.songs = playlist.songs.splice(playlist.songs.findIndex(song => getSongId(song) === action.payload.songId), 1);
                playlist.playArray = getPlayArray(playlist.albums, playlist.songs);
                return {
                    ...state,
                    savedPlaylists: state.savedPlaylists.splice(playlistIndex, 1, playlist)
                };
            }
            return state;
        }
        case ADD_ALBUM_TO_PLAYLIST: {
            const playlistIndex = state.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
            const playlist = state.savedPlaylists.at(playlistIndex);
            if (playlist) {
                playlist.albums.push(action.payload.album);
                playlist.playArray = getPlayArray(playlist.albums, playlist.songs);
                return {
                    ...state,
                    savedPlaylists: state.savedPlaylists.splice(playlistIndex, 1, playlist)
                };
            }
            return state;
        }
        case REMOVE_ALBUM_FROM_PLAYLIST: {
            const playlistIndex = state.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
            const playlist = state.savedPlaylists.at(playlistIndex);
            if (playlist) {
                playlist.albums = playlist.albums.splice(playlist.albums.findIndex(album => getAlbumId(album) === action.payload.albumId), 1);
                playlist.playArray = getPlayArray(playlist.albums, playlist.songs);
                return {
                    ...state,
                    savedPlaylists: state.savedPlaylists.splice(playlistIndex, 1, playlist)
                };
            }
            return state;
        }
        case SET_CURRENT_PLAYLIST:
            return {
                ...state,
                currentPlaylist: action.payload
            };
        case SET_ALBUM_AS_PLAYLIST:
            return {
                ...state,
                currentPlaylist: {
                    albums: [action.payload],
                    name: getAlbumId(action.payload),
                    playArray: action.payload.songs,
                    songs: []
                }
            };
        case SET_ALBUM_ORDERED: {
            if (action.payload.playlistName) {
                const playlistIndex = state.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
                const playlist = state.savedPlaylists.at(playlistIndex);
                if (playlist) {
                    const albumIndex = playlist.albums.findIndex(album => getAlbumId(album) === action.payload.albumId);
                    playlist.albums[albumIndex].ordered = action.payload.ordered;
                    return {
                        ...state,
                        savedPlaylists: state.savedPlaylists.splice(playlistIndex, 1, playlist)
                    };
                }
            } else if (state.currentPlaylist) {
                const currentPlaylist = { ...state.currentPlaylist };
                const albumIndex = currentPlaylist.albums.findIndex(album => getAlbumId(album) === action.payload.albumId);
                currentPlaylist.albums[albumIndex].ordered = action.payload.ordered;
                return {
                    ...state,
                    currentPlaylist
                };
            }
            return state;
        }
        case SET_SONG_WEIGHT: {
            if (action.payload.playlistName) {
                const playlistIndex = state.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
                const playlist = state.savedPlaylists.at(playlistIndex);
                if (playlist) {
                    const albumName = getAlbumFromSongId(action.payload.songId);
                    const title = getSongTitleFromId(action.payload.songId);
                    const albumIndex = playlist.albums.findIndex(album => album.albumName === albumName);
                    const album = playlist.albums.at(albumIndex);
                    if (album) {
                        const songIndex = album.songs.findIndex(song => song.title === title);
                        album.songs[songIndex].weight = action.payload.weight;
                        playlist.albums.splice(albumIndex, 1, album);
                        return {
                            ...state,
                            savedPlaylists: state.savedPlaylists.splice(playlistIndex, 1, playlist)
                        };
                    } else {
                        const songIndex = playlist.songs.findIndex(song => song.title === title);
                        playlist.songs[songIndex].weight = action.payload.weight;
                        return {
                            ...state,
                            savedPlaylists: state.savedPlaylists.splice(playlistIndex, 1, playlist)
                        };
                    }
                }
            } else if (state.currentPlaylist) {
                const currentPlaylist = { ...state.currentPlaylist };
                const albumName = getAlbumFromSongId(action.payload.songId);
                    const title = getSongTitleFromId(action.payload.songId);
                    const albumIndex = currentPlaylist.albums.findIndex(album => album.albumName === albumName);
                    const album = currentPlaylist.albums.at(albumIndex);
                    if (album) {
                        const songIndex = album.songs.findIndex(song => song.title === title);
                        album.songs[songIndex].weight = action.payload.weight;
                        currentPlaylist.albums.splice(albumIndex, 1, album);
                        return {
                            ...state,
                            currentPlaylist
                        };
                    } else {
                        const songIndex = currentPlaylist.songs.findIndex(song => song.title === title);
                        currentPlaylist.songs[songIndex].weight = action.payload.weight;
                        return {
                            ...state,
                            currentPlaylist
                        };
                    }
            }
            return state;
        }
        case SHUFFLE_CURRENT_PLAYLIST: {
            switch (action.payload) {
                case OrderedType.NONE:
                    // TODO implement normal shuffle
                    break;
                case OrderedType.RANDOM:
                    // TODO implement normal shuffle
                    break;
                case OrderedType.SPREAD:
                    if (state.currentPlaylist) {
                        return {
                            ...state,
                            currentPlaylist: {
                                ...state.currentPlaylist,
                                playArray: spreadOrderedAlbumShuffle(state.currentPlaylist.albums, state.currentPlaylist.songs)
                            }
                        };
                    }
                    return state;
            }
            return state;
        }
        case REMOVE_PLAYLIST: {
            const playlistIndex = state.savedPlaylists.findIndex(playlist => playlist.name === action.payload);
            return {
                ...state,
                savedPlaylists: state.savedPlaylists.splice(playlistIndex, 1)
            };
        }
        default:
            return state;
    }
}
