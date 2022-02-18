export interface GetMusicFileType {
    id: number;
    title: string;
    author: string;
    album: string;
    genre: string | null;
    duration: number;
    cover?: string;
    fileName: string;
    path: string;
}

export interface GetMusicArtist {
    key: string;
    artist: string;
    numberOfAlbums: string;
    numberOfSongs: string;
    id: string;
}

export interface GetMusicAlbum {
    id: string;
    album: string;
    author: string;
    cover: string;
    numberOfSongs: string;
}

export interface GetMusicTrack {
    id: string;
    title: string;
    artist: string;
    album: string;
    duration: string;
    path: string;
}