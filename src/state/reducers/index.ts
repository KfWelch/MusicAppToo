import { combineReducers } from 'redux';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { DeepPartial } from '../../models/MappedTypes.d';
import asyncReducer from './asyncAPI';
import { Albums } from './Albums';

const rootReducer = combineReducers({
    async: asyncReducer,
    Albums
});

export default rootReducer;

// This pulls the types out of the root reducer, for typing the redux state
export type RootState = ReturnType<typeof rootReducer>;
export type PartialState = DeepPartial<RootState>;
// This cleans up the definition of the state in useSelector(...)
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
