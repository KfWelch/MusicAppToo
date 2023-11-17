import { Album, Playlist, Song } from '../models/MusicModel';
import { ShuffleType } from '../state/reducers/Playlist';
import { getSongId } from './musicUtils';

interface songIdPos {
    id: string;
    position: number;
}

const songListToPlaylist = (songList: songIdPos[], unorderedPlaylist: Song[]): Song[] => {
    unorderedPlaylist.forEach(song => {
        song.position = (songList.find(item => item.id === getSongId(song)))?.position;
    });
    
    const orderedPlaylist: Song[] = unorderedPlaylist.sort((a, b) => {
        if (a.position && b.position) return a.position - b.position;
        return 0;
    });

    orderedPlaylist.forEach((song, index) => song.position = index);

    return orderedPlaylist;    
};

const isRandomNumberUsed = (songList: songIdPos[], pos: number) => (songList.reduce((prevVal, currentVal) => {
    prevVal.push(currentVal.position);
    return prevVal;
}, [] as number [])).includes(pos);

export const spreadOrderedAlbumShuffle = (albums: Album[], individualSongs: Song[]): Song[] => {
    const songList: songIdPos[] = [];
    let unorderedPlaylist: Song[] = [...individualSongs];

    individualSongs.forEach(song => {
        let pos = Math.random();
        while (isRandomNumberUsed(songList, pos)) {
            pos = Math.random();
        }
        songList.push({
            position: pos,
            id: getSongId(song)
        });
    });

    albums.forEach(album => {
        unorderedPlaylist = unorderedPlaylist.concat(album.songs);
        if (!album.ordered) {
            album.songs.forEach(song => {
                let pos = Math.random();
                // Need to make sure we aren't using the same number in our positioning
                while (isRandomNumberUsed(songList, pos)) {
                    pos = Math.random();
                }
                songList.push({
                    position: pos,
                    id: getSongId(song)
                });
            });
        } else {
            // We need the album sorted by position in album here for indices to be right
            const songs = album.songs.sort((a, b) => a.numberInAlbum - b.numberInAlbum);
            const albumLength = album.songs.length;
            songs.forEach((song, index) => {
                let pos = (Math.random() + index) / albumLength;
                while (isRandomNumberUsed(songList, pos)) {
                    pos = (Math.random() + index) / albumLength;
                }
                songList.push({
                    position: pos,
                    id: getSongId(song)
                });
            });
        }
    });

    return songListToPlaylist(songList, unorderedPlaylist);    
};

export const spreadAlbumShuffle = (albums: Album[], individualSongs: Song[]): Song[] => {
    const songList: songIdPos[] = [];
    let unorderedPlaylist: Song[] = [...individualSongs];

    individualSongs.forEach(song => {
        let pos = Math.random();
        while (isRandomNumberUsed(songList, pos)) {
            pos = Math.random();
        }
        songList.push({
            position: pos,
            id: getSongId(song)
        });
    });

    albums.forEach(album => {
        unorderedPlaylist = unorderedPlaylist.concat(album.songs);
        const slots: number[] = [];

        const { songs } = album;
        const { length } = songs;
        songs.forEach(song => {
            // make sure we've got an empty slot
            let slot = Math.floor(Math.random() * length);
            while (slots.includes(slot)) {
                slot = Math.floor(Math.random() * length);
            }
            slots.push(slot);

            // make sure we've got an empty position in that slot
            let pos = (Math.random() + slot) / length;
            while (isRandomNumberUsed(songList, pos)) {
                pos = (Math.random() + slot) / length;
            }
            songList.push({
                position: pos,
                id: getSongId(song)
            });
        });
    });

    return songListToPlaylist(songList, unorderedPlaylist);
}

export const standardShuffle = (albums: Album[], individualSongs: Song[]): Song[] => {
    const songList: songIdPos[] = [];
    let unorderedPlaylist: Song[] = [...individualSongs];

    individualSongs.forEach(song => {
        let pos = Math.random();
        while (isRandomNumberUsed(songList, pos)) {
            pos = Math.random();
        }
        songList.push({
            position: pos,
            id: getSongId(song)
        });
    });

    albums.forEach(album => {
        unorderedPlaylist = unorderedPlaylist.concat(album.songs);
        album.songs.forEach(song => {
            let pos = Math.random();
            // Need to make sure we aren't using the same number in our positioning
            while (isRandomNumberUsed(songList, pos)) {
                pos = Math.random();
            }
            songList.push({
                position: pos,
                id: getSongId(song)
            });
        });
    });

    return songListToPlaylist(songList, unorderedPlaylist); 
};

export const getShuffledByType = (playlist: Playlist, type: ShuffleType): Song[] => {
    switch (type) {
        case ShuffleType.STANDARD:
            return standardShuffle(playlist.albums, playlist.songs);
        case ShuffleType.STANDARD_ORDERED:
            // TODO implement random ordered shuffle
            return [];
        case ShuffleType.SPREAD_ORDERED:
            return spreadOrderedAlbumShuffle(playlist.albums, playlist.songs);
        case ShuffleType.SPREAD:
            return spreadAlbumShuffle(playlist.albums, playlist.songs);
        default:
            return playlist.playArray;
    }
};
