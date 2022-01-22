import { Album, Song } from '../models/MusicModel';

interface songIdPos {
    id: string;
    position: number;
}

const getSongId = (song: Song): string => `${song.albumName}-${song.numberInAlbum}`;

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
}

export const spreadOrderedAlbumShuffle = (albums: Album[]): Song[] => {
    const songList: songIdPos[] = [];
    const unorderedPlaylist: Song[] = [];
    albums.forEach(album => {
        unorderedPlaylist.concat(album.songs);
        if (album.ordered) {
            album.songs.forEach(song => {
                let pos = Math.random();
                // Need to make sure we aren't using the same number in our positioning
                while ((songList.reduce((prevVal, currentVal) => {
                    prevVal.push(currentVal.position);
                    return prevVal;
                }, [] as number [])).includes(pos)) {
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
                while ((songList.reduce((prevVal, currentVal) => {
                    prevVal.push(currentVal.position);
                    return prevVal;
                }, [] as number [])).includes(pos)) {
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
}

export const randomOrderedAlbumShuffle = (albums: Album[]): Song[] => {

}
