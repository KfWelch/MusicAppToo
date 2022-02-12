import { State } from "react-native-track-player";

/**
 * Used to find out whether we are currently playing music
 * @param playbackState 
 * @returns 
 */
export const playable = (playbackState: State): boolean => {
    switch (playbackState) {
        case State.Playing:
        case State.Paused:
        case State.Buffering:
            return true;
        default:
            return false;
    }
};
