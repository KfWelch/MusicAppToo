import {
    Actions,
    OVERRIDE_APPEARANCE,
    SET_DARKMODE,
    SET_OPTION
} from '../actions/Options';

interface OptionsState {
    generalOverrideSystemAppearance: boolean;
    generalDarkmode: boolean;
    playbackAutoPlayOnReload: boolean;
    randomizationForwardBuffer: number;
    randomizationBackwardBuffer: number;
    randomizationShouldNotRepeatSongs: boolean;
};

const initialState: OptionsState = {
    generalOverrideSystemAppearance: false,
    generalDarkmode: false,
    playbackAutoPlayOnReload: false,
    randomizationForwardBuffer: 10,
    randomizationBackwardBuffer: 25,
    randomizationShouldNotRepeatSongs: true
};

export const Options = (state = initialState, action: Actions): OptionsState => {
    switch (action.type) {
        case OVERRIDE_APPEARANCE:
            return {
                ...state,
                generalOverrideSystemAppearance: action.payload
            };
        case SET_DARKMODE:
            return {
                ...state,
                generalDarkmode: action.payload
            };
        case SET_OPTION: {
            const newOptions = { ...state };
            // @ts-ignore
            newOptions[action.payload.key] = action.payload.value;
            return newOptions;
        }
        default:
            return state;
    }
};
