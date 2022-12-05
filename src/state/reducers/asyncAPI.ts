import { combineReducers } from 'redux';
import {
    ExampleGetError,
    ExampleGetRequest,
    ExampleGetResponse,
    GetExampleDataActions
} from '../actions/ExampleService';
import { makeAsyncReducer } from './generic/makeAsyncReducer';

export const asyncReducer = combineReducers({
    example: makeAsyncReducer<ExampleGetRequest, ExampleGetResponse, ExampleGetError>(GetExampleDataActions)
});

export default asyncReducer;
