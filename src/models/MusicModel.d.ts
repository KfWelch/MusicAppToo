export interface Artist {
    artist: string,
    albums: Album[]
}

export interface Album {
    albumName: string;
    artistName: string;
    category?: string;
    year?: number;
    songs: Song[];
    ordered?: boolean;
}

export interface Song {
    title: string,
    length?: string,
    rating?: string,
    contributingArtist?: string,
    albumName: string;
    numberInAlbum: number;
    path?: string;
    position?: number;
    weight: number
}

export interface Playlist {
    name: string;
    albums: Album[];
    songs: Song[];
    playArray: Song[];
}
