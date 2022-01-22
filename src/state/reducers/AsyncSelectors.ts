import { PartialState, RootState } from ".";
import { AsyncState } from "./generic/makeAsyncReducer";

export type AsyncSelector<Q, R, E> = (state: RootState) => AsyncState<Q, R, E> | PartialState;

export const asyncSelector = (state: RootState) => state.async;