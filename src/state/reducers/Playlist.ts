import _ from 'lodash';
import { Album, Playlist as PlaylistModel, Song } from '../../models/MusicModel.d';
import { getAlbumIdFromSongId, getAlbumId, getPlayArray, getSongId, getSongTitleFromId, getNewPlayArray } from '../../utils/musicUtils';
import { spreadOrderedAlbumShuffle, standardShuffle } from '../../utils/PlaylistShuffle';
import {
    Actions,
    ADD_ALBUM,
    ADD_ALBUM_TO_PLAYLIST,
    ADD_SONG,
    ADD_SONG_TO_PLAYLIST,
    GENERATE_PLAYLIST,
    REMOVE_ALBUM,
    REMOVE_ALBUM_FROM_PLAYLIST,
    REMOVE_OLDEST_RANDOM_SONG,
    REMOVE_PLAYLIST,
    REMOVE_SONG,
    REMOVE_SONG_FROM_PLAYLIST,
    SET_ALBUM_AS_PLAYLIST,
    SET_ALBUM_ORDERED,
    SET_CURRENT_PLAYLIST,
    SET_CURRENT_PLAY_ARRAY,
    SET_LAST_SONG_PLAYED,
    SET_SHUFFLE_TYPE,
    SET_PLAYBACK_MODE,
    SET_RANDOMIZE_TYPE,
    SET_RANDOM_NEXT_SONG,
    SET_REPEAT,
    SET_RESHUFFLE,
    SET_SONG_WEIGHT,
    SHUFFLE_CURRENT_PLAYLIST
} from '../actions/Playlist';

export enum PlaybackMode {
    NORMAL = 'Normal',
    SHUFFLE = 'Shuffle',
    RANDOMIZE = 'Randomize'
}

export enum ShuffleType {
    SPREAD_ORDERED = 'SpreadOrdered',
    STANDARD_ORDERED = 'RandomOrdered',
    SPREAD = 'Spread',
    STANDARD = 'Standard'
};

export enum RandomizationType {
    WEIGHTLESS = 'Weightless',
    WEIGHTED = 'Weighted'
}

interface PlaylistState {
    currentPlaylist: PlaylistModel | null;
    currentPlaylistTrack: number;
    savedPlaylists: PlaylistModel[];
    newPlaylist: {
        individualSongs: Song[];
        albums: Album[];
    };
    playbackOptions: {
        mode: PlaybackMode;
        repeat: boolean;
        shuffleOptions: {
            orderedType: ShuffleType;
            reshuffleOnRepeat: boolean;
        };
        randomizeOptions: {
            weighted: boolean;
        };
    };
};

const initialState: PlaylistState = {
    currentPlaylist: null,
    currentPlaylistTrack: -1,
    savedPlaylists: [],
    newPlaylist: {
        individualSongs: [],
        albums: []
    },
    playbackOptions: {
        mode: PlaybackMode.NORMAL,
        repeat: false,
        shuffleOptions: {
            orderedType: ShuffleType.STANDARD,
            reshuffleOnRepeat: false
        },
        randomizeOptions: {
            weighted: false
        }
    }
};

export const Playlist = (state = initialState, action: Actions): PlaylistState => {
    const oldState = _.cloneDeep(state);
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
                playArray: getNewPlayArray(state.newPlaylist.albums, state.newPlaylist.individualSongs)
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
            const playlistIndex = oldState.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
            if (playlistIndex >= 0) {
                const playlist = oldState.savedPlaylists[playlistIndex];
                playlist.songs.push(action.payload.song);
                playlist.playArray.push(action.payload.song);
                oldState.savedPlaylists.splice(playlistIndex, 1, playlist);
                return {
                    ...oldState,
                    savedPlaylists: oldState.savedPlaylists
                };
            }
            return oldState;
        }
        case REMOVE_SONG_FROM_PLAYLIST: {
            const playlistIndex = oldState.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
            if (playlistIndex >= 0) {
                const playlist = oldState.savedPlaylists[playlistIndex];
                playlist.songs = playlist.songs.splice(playlist.songs.findIndex(song => getSongId(song) === action.payload.songId), 1);
                playlist.playArray = getPlayArray(playlist);
                oldState.savedPlaylists.splice(playlistIndex, 1, playlist);
                return {
                    ...oldState,
                    savedPlaylists: oldState.savedPlaylists
                };
            }
            return oldState;
        }
        case ADD_ALBUM_TO_PLAYLIST: {
            const playlistIndex = oldState.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
            if (playlistIndex >= 0) {
                const playlist = oldState.savedPlaylists[playlistIndex];
                playlist.albums.push(action.payload.album);
                playlist.playArray = getPlayArray(playlist);
                oldState.savedPlaylists.splice(playlistIndex, 1, playlist);
                return {
                    ...oldState,
                    savedPlaylists: oldState.savedPlaylists
                };
            }
            return oldState;
        }
        case REMOVE_ALBUM_FROM_PLAYLIST: {
            const playlistIndex = oldState.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
            if (playlistIndex >= 0) {
                const playlist = oldState.savedPlaylists[playlistIndex];
                playlist.albums = playlist.albums.splice(playlist.albums.findIndex(album => getAlbumId(album) === action.payload.albumId), 1);
                playlist.playArray = getPlayArray(playlist);
                oldState.savedPlaylists.splice(playlistIndex, 1, playlist);
                return {
                    ...oldState,
                    savedPlaylists: oldState.savedPlaylists
                };
            }
            return oldState;
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
                const playlistIndex = oldState.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
                if (playlistIndex >= 0) {
                    const playlist = oldState.savedPlaylists[playlistIndex];
                    const albumIndex = playlist.albums.findIndex(album => getAlbumId(album) === action.payload.albumId);
                    playlist.albums[albumIndex].ordered = action.payload.ordered;
                    oldState.savedPlaylists.splice(playlistIndex, 1, playlist);
                    return {
                        ...oldState,
                        savedPlaylists: oldState.savedPlaylists
                    };
                }
            } else if (oldState.currentPlaylist) {
                const currentPlaylist = { ...oldState.currentPlaylist };
                const albumIndex = currentPlaylist.albums.findIndex(album => getAlbumId(album) === action.payload.albumId);
                currentPlaylist.albums[albumIndex].ordered = action.payload.ordered;
                return {
                    ...oldState,
                    currentPlaylist
                };
            }
            return oldState;
        }
        case SET_SONG_WEIGHT: {
            if (action.payload.playlistName) {
                const playlistIndex = oldState.savedPlaylists.findIndex(playlist => playlist.name === action.payload.playlistName);
                const playlist = oldState.savedPlaylists[playlistIndex];
                if (playlistIndex >= 0) {
                    const albumId = getAlbumIdFromSongId(action.payload.songId);
                    const title = getSongTitleFromId(action.payload.songId);
                    const albumIndex = playlist.albums.findIndex(album => getAlbumId(album) === albumId);
                    const album = playlist.albums[albumIndex];
                    if (albumIndex >= 0) {
                        const songIndex = album.songs.findIndex(song => song.title === title);
                        album.songs[songIndex].weight = action.payload.weight;
                        playlist.albums.splice(albumIndex, 1, album);
                        oldState.savedPlaylists.splice(playlistIndex, 1, playlist);
                        return {
                            ...oldState,
                            savedPlaylists: oldState.savedPlaylists
                        };
                    } else {
                        const songIndex = playlist.songs.findIndex(song => song.title === title);
                        playlist.songs[songIndex].weight = action.payload.weight;
                        oldState.savedPlaylists.splice(playlistIndex, 1, playlist);
                        return {
                            ...oldState,
                            savedPlaylists: oldState.savedPlaylists
                        };
                    }
                }
            } else if (oldState.currentPlaylist) {
                const currentPlaylist = { ...oldState.currentPlaylist };
                const albumId = getAlbumIdFromSongId(action.payload.songId);
                const title = getSongTitleFromId(action.payload.songId);
                const albumIndex = currentPlaylist.albums.findIndex(album => getAlbumId(album) === albumId);
                const album = currentPlaylist.albums[albumIndex];
                if (albumIndex >= 0) {
                    const songIndex = album.songs.findIndex(song => song.title === title);
                    album.songs[songIndex].weight = action.payload.weight;
                    currentPlaylist.albums.splice(albumIndex, 1, album);
                    return {
                        ...oldState,
                        currentPlaylist
                    };
                } else {
                    const songIndex = currentPlaylist.songs.findIndex(song => song.title === title);
                    currentPlaylist.songs[songIndex].weight = action.payload.weight;
                    return {
                        ...oldState,
                        currentPlaylist
                    };
                }
            }
            return oldState;
        }
        case SHUFFLE_CURRENT_PLAYLIST: {
            if (state.currentPlaylist) {
                switch (state.playbackOptions.shuffleOptions.orderedType) {
                    case ShuffleType.STANDARD:
                        return {
                            ...state,
                            currentPlaylist: {
                                ...state.currentPlaylist,
                                playArray: standardShuffle(state.currentPlaylist.albums, state.currentPlaylist.songs)
                            }
                        };
                    case ShuffleType.STANDARD_ORDERED:
                        // TODO implement random ordered shuffle
                        break;
                    case ShuffleType.SPREAD_ORDERED:
                        return {
                            ...state,
                            currentPlaylist: {
                                ...state.currentPlaylist,
                                playArray: spreadOrderedAlbumShuffle(state.currentPlaylist.albums, state.currentPlaylist.songs)
                            }
                        };
                    default:
                        break;
                }
            }
            return state;
        }
        case SET_CURRENT_PLAY_ARRAY: {
            if (state.currentPlaylist) {
                return {
                    ...state,
                    currentPlaylist: {
                        ...state.currentPlaylist,
                        playArray: action.payload
                    }
                };
            } else {
                return {...state};
            }
        }
        case SET_RANDOM_NEXT_SONG: {
            if (state.currentPlaylist) {
                return {
                    ...state,
                    currentPlaylist: {
                        ...state.currentPlaylist,
                        playArray: [...state.currentPlaylist.playArray, ...action.payload]
                    }
                }
            } else {
                return {...state};
            }
        }
        case REMOVE_OLDEST_RANDOM_SONG:
            if (state.currentPlaylist) {
                return {
                    ...state,
                    currentPlaylist: {
                        ...state.currentPlaylist,
                        playArray: state.currentPlaylist.playArray.slice(action.payload)
                    }
                };
            } else {
                return {...state};
            }
        case REMOVE_PLAYLIST: {
            const playlistIndex = oldState.savedPlaylists.findIndex(playlist => playlist.name === action.payload);
            oldState.savedPlaylists.splice(playlistIndex, 1);
            return {
                ...oldState,
                savedPlaylists: oldState.savedPlaylists
            };
        }
        case SET_PLAYBACK_MODE:
            return {
                ...state,
                playbackOptions: {
                    ...state.playbackOptions,
                    mode: action.payload
                }
            };
        case SET_REPEAT:
            return {
                ...state,
                playbackOptions: {
                    ...state.playbackOptions,
                    repeat: action.payload
                }
            };
        case SET_SHUFFLE_TYPE:
            return {
                ...state,
                playbackOptions: {
                    ...state.playbackOptions,
                    shuffleOptions: {
                        ...state.playbackOptions.shuffleOptions,
                        orderedType: action.payload
                    }
                }
            };
        case SET_RESHUFFLE:
            return {
                ...state,
                playbackOptions: {
                    ...state.playbackOptions,
                    shuffleOptions: {
                        ...state.playbackOptions.shuffleOptions,
                        reshuffleOnRepeat: action.payload
                    }
                }
            };
        case SET_RANDOMIZE_TYPE:
            return {
                ...state,
                playbackOptions: {
                    ...state.playbackOptions,
                    randomizeOptions: {
                        weighted: action.payload === RandomizationType.WEIGHTED
                    }
                }
            };
        case SET_LAST_SONG_PLAYED:
            if (state.currentPlaylist) {
                return {
                    ...state,
                    currentPlaylist: {
                        ...state.currentPlaylist,
                        lastSongPlayed: action.payload
                    }
                };
            }
            return state;
        default:
            return state;
    }
}
