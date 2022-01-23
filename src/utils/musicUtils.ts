import { Track } from "react-native-track-player";
import { Song } from "../models/MusicModel";

export const convertSongToTrack = (song: Song): Track => {
    return {
        url: song.path || '',
        album: song.albumName,
        title: song.title
    }
};
