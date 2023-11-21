import { Album, Playlist, Song } from '../models/MusicModel';
import { ShuffleType } from '../state/reducers/Playlist';
import { getSongId } from './musicUtils';

interface songIdPos {
    id: string;
    position: number;
}

const DECPRECISION = 10e-17;
const RANDMAX = 1 - DECPRECISION;

/**
 * Takes the unordered playlist and orders it according to
 * the positions that have been given via the songList array
 * @param songList 
 * @param unorderedPlaylist 
 * @returns 
 */
class Shuffle {
    static songListToPlaylist(songList: songIdPos[], unorderedPlaylist: Song[]): Song[] {
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

    /**
     * Checks if a given position is present in the list of to set song positions
     * it ensures that we don't end up with multiple songs having the same position as it would break sorting
     * @param songList 
     * @param pos 
     * @returns 
     */
    static isRandomNumberUsed(songList: songIdPos[], pos: number): boolean {
        return (songList.reduce((prevVal, currentVal) => {
            prevVal.push(currentVal.position);
            return prevVal;
        }, [] as number [])).includes(pos);
    };

    /**
     * Shuffles a playlist while keeping marked albums in order
     * 
     * This algorithm, upon encountering an album marked for ordering, will treat each song in the album
     * as if it has a "slot" that it can go into.  Each of these slots represents a fractional part of 1,
     * to which the randomly generated number is restricted.  For example, the third song in an album of
     * twelve will generate a position between 1/6 and 1/4 (2/12 and 3/12).  This ensures that while the
     * ordering of songs is still random in the playlist, each song in a marked album will be spread
     * throughout the playlist, hence the "spread" qualifier
     * @param albums 
     * @param individualSongs 
     * @returns 
     */
    static spreadOrderedAlbum(albums: Album[], individualSongs: Song[]): Song[] {
        const songList: songIdPos[] = [];
        let unorderedPlaylist: Song[] = [...individualSongs];

        individualSongs.forEach(song => {
            let pos = Math.random();
            while (this.isRandomNumberUsed(songList, pos)) {
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
                    while (this.isRandomNumberUsed(songList, pos)) {
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
                    while (this.isRandomNumberUsed(songList, pos)) {
                        pos = (Math.random() + index) / albumLength;
                    }
                    songList.push({
                        position: pos,
                        id: getSongId(song)
                    });
                });
            }
        });

        return this.songListToPlaylist(songList, unorderedPlaylist);
    };

    /**
     * Shuffles a playlist while keeping marked albums in order
     * 
     * This algorithm, upon encountering an album marked for ordering, generates an array of randomized
     * numbers, one for each song in the album.  It then gives each song in the album one of these
     * random numbers in an ordered fashion
     * @param albums 
     * @param individualSongs 
     * @returns a shuffled playlist
     */
    static orderedAlbum(albums: Album[], individualSongs: Song[]): Song[] {
        const songList: songIdPos[] = [];
        let unorderedPlaylist: Song[] = [...individualSongs];

        individualSongs.forEach(song => {
            let pos = Math.random();
            while (this.isRandomNumberUsed(songList, pos)) {
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
                    while (this.isRandomNumberUsed(songList, pos)) {
                        pos = Math.random();
                    }
                    songList.push({
                        position: pos,
                        id: getSongId(song)
                    });
                });
            } else {
                const positions: number[] = [];

                for (let i = 0; i < album.songs.length; i++) {
                    let newPos = Math.random();
                    while (this.isRandomNumberUsed(songList, newPos) || positions.includes(newPos)) {
                        newPos = Math.random();
                    }
                    positions.push(newPos);
                }

                positions.sort();

                album.songs.forEach((song, index) => {
                    songList.push({
                        position: positions[index],
                        id: getSongId(song)
                    });
                });
            }
        });
        
        return this.songListToPlaylist(songList, unorderedPlaylist);
    }

    /**
     * Shuffles a playlist while keeping marked albums in order
     * 
     * This algorithm, upon encountering an album marked for ordering, procedurally goes through the album's
     * songs and gives it a random position.  If the song is too close to the end to fit the rest of the
     * album's songs, it will generate a new number.  If not, it will then proceed to the next song,
     * generating a position within the remaining space.  If the song is just close enough to fit the rest
     * of the songs after it within JS's numeric limitations, it will stop generating random numbers and
     * put them in sequence at the end of the positions.  To help avoid this, every randomly generated number
     * is raised to an exponent to weight it to a lower number, hence the "power" qualifier
     * @param albums 
     * @param individualSongs 
     * @returns 
     */
    static powerOrderedAlbum(albums: Album[], individualSongs: Song[]): Song[] {
        const songList: songIdPos[] = [];
        let unorderedPlaylist: Song[] = [...individualSongs];

        individualSongs.forEach(song => {
            let pos = Math.random();
            while (this.isRandomNumberUsed(songList, pos)) {
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
                    while (this.isRandomNumberUsed(songList, pos)) {
                        pos = Math.random();
                    }
                    songList.push({
                        position: pos,
                        id: getSongId(song)
                    });
                });
            } else {
                const { length } = album.songs;
                let previousPos = 0;
                // need to also get all previously used positions which are that close to the maximum
                // we need to make sure there's enough room for all the songs in the album,
                // this'll let the program know if there's enough slots at the end
                // if we find any end songs we need to add on to the available slots we look at for it
                const endSongs = songList.reduce((ends: number[], currentSong) => {
                    if (currentSong.position > RANDMAX - (length + ends.length) * DECPRECISION) {
                        ends.push(currentSong.position);
                    }
                    return ends;
                }, []).sort();
                for (let index = 0; index < album.songs.length; index++) {
                    const song = album.songs[index];
                    // choose a random that is higher than the previous position
                    // raising the rand to a >1 power to weight it lower and allow more room
                    // because it can easily squeeze to the end
                    let pos = (Math.random() ** 1.5) * (1 - previousPos) + previousPos;
                    // get amount of end songs that are after the new position attempt
                    let songsAfter = endSongs.reduce((total, currentPos) => currentPos > pos ? total + 1 : total, 0);
                    // reroll if it is too high
                    while (pos < previousPos || pos > RANDMAX - (
                        length - index // how many songs left to go in the album
                        + songsAfter // number of other songs taking up space in the end slots
                    ) * DECPRECISION) {
                        pos = (Math.random() ** 1.5) * (1 - previousPos) + previousPos;
                        songsAfter = endSongs.reduce((total, currentPos) => currentPos > pos ? total + 1 : total, 0);
                    }

                    if (pos === RANDMAX - (length - index + songsAfter) * DECPRECISION) {
                        // this case needs to force the rest of the songs in order

                        for (let i = 0; i < length - index + songsAfter; i++) {
                            const toSavePos = pos + i * DECPRECISION; 
                            if (endSongs.includes(toSavePos)) {
                                continue;
                            }
                            songList.push({
                                position: toSavePos,
                                id: getSongId(album.songs[i + index])
                            });
                        }
                        break;
                    }

                    songList.push({
                        position: pos,
                        id: getSongId(song)
                    });
                    previousPos = pos;
                };
            }
        });

        return this.songListToPlaylist(songList, unorderedPlaylist);
    }

    /**
     * This algorithm shuffles a playlist so that for every album, its songs are spread throughout the
     * playlist.  It accomplishes this similar to the spreadOrderedAlbumShuffle(), although instead of
     * restricting the third song in an album to that album's third slot, an album's song may go into any
     * available slot
     * @param albums 
     * @param individualSongs 
     * @returns 
     */
    static spreadAlbum(albums: Album[], individualSongs: Song[]): Song[] {
        const songList: songIdPos[] = [];
        let unorderedPlaylist: Song[] = [...individualSongs];

        individualSongs.forEach(song => {
            let pos = Math.random();
            while (this.isRandomNumberUsed(songList, pos)) {
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
                while (this.isRandomNumberUsed(songList, pos)) {
                    pos = (Math.random() + slot) / length;
                }
                songList.push({
                    position: pos,
                    id: getSongId(song)
                });
            });
        });

        return this.songListToPlaylist(songList, unorderedPlaylist);
    }

    /**
     * This algorithm is the simplest shuffling algorithm, as it does nothing more than give every
     * song in the playlist a unique random number for its position
     * @param albums 
     * @param individualSongs 
     * @returns 
     */
    static standard(albums: Album[], individualSongs: Song[]): Song[] {
        const songList: songIdPos[] = [];
        let unorderedPlaylist: Song[] = [...individualSongs];

        individualSongs.forEach(song => {
            let pos = Math.random();
            while (this.isRandomNumberUsed(songList, pos)) {
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
                while (this.isRandomNumberUsed(songList, pos)) {
                    pos = Math.random();
                }
                songList.push({
                    position: pos,
                    id: getSongId(song)
                });
            });
        });

        return this.songListToPlaylist(songList, unorderedPlaylist); 
    };
};

export default Shuffle;

/**
 * This is a utility function to shuffle a playlist by the given type instead of
 * littering the code with the same switch statement
 * @param playlist 
 * @param type 
 * @returns 
 */
export const getShuffledByType = (playlist: Playlist, type: ShuffleType): Song[] => {
    switch (type) {
        case ShuffleType.STANDARD:
            return Shuffle.standard(playlist.albums, playlist.songs);
        case ShuffleType.ORDERED:
            return Shuffle.orderedAlbum(playlist.albums, playlist.songs);
        case ShuffleType.POWER_ORDERED:
            return Shuffle.powerOrderedAlbum(playlist.albums, playlist.songs);
        case ShuffleType.SPREAD_ORDERED:
            return Shuffle.spreadOrderedAlbum(playlist.albums, playlist.songs);
        case ShuffleType.SPREAD:
            return Shuffle.spreadAlbum(playlist.albums, playlist.songs);
        default:
            return playlist.playArray;
    }
};
