import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { DeepPartial } from '../../models/MappedTypes.d';
import asyncReducer from './asyncAPI';
import { Albums } from './Albums';
import { Playlist } from './Playlist';
import { Options } from './Options';

const persistAlbumsConfig = {
    key: 'albums',
    storage: AsyncStorage
};

const persistPlaylistsConfig = {
    key: 'playlist',
    storage: AsyncStorage,
    blacklist: ['newPlaylist']
};

const persistOptionsConfig = {
    key: 'options',
    storage: AsyncStorage
};

const rootReducer = combineReducers({
    async: asyncReducer,
    Albums: persistReducer(persistAlbumsConfig, Albums),
    Playlist: persistReducer(persistPlaylistsConfig, Playlist),
    Options: persistReducer(persistOptionsConfig, Options)
});

export default rootReducer;

// This pulls the types out of the root reducer, for typing the redux state
export type RootState = ReturnType<typeof rootReducer>;
export type PartialState = DeepPartial<RootState>;
// This cleans up the definition of the state in useSelector(...)
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
