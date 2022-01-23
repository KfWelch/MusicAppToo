import { Artist } from "../../models/MusicModel";


interface AlbumsState {
    artists: Artist[];
};

const initialState: AlbumsState = {
    artists: []
};


