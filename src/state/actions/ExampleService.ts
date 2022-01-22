import { AxiosError, AxiosResponse } from 'axios';
import { makeAsyncActionCreators, makeAsyncActionTypes } from './generic/makeAsyncActions.ts';

interface ExampleDataType {
    cetra: boolean;
}

interface ExampleResponseData {
    stuff: string;
}

export type ExampleGetRequest = { example: string };
export type ExampleGetResponse = AxiosResponse<ExampleResponseData>;
export type ExampleGetError = AxiosError;

export type ExamplePostRequest = { example: string, data: ExampleDataType };
export type ExamplePostResponse = AxiosResponse<ExampleResponseData>;
export type ExamplePostErrror = AxiosError;

export const GetExampleDataActions = makeAsyncActionTypes('API/GET_EXAMPLE_DATA');
export const GetExampleDataActionCreators = makeAsyncActionCreators<ExampleGetRequest, ExampleGetResponse, ExampleGetError>(GetExampleDataActions);

// ditto examplePost

/**
 * Create Saga Initiator function.  This ActionCreator function is what is called with dispatch
 * to initiate a saga with a request payload
 */
export const GET_EXAMPLE_DATA_SAGA = 'SAGA/GET_EXAMPLE_DATA';
export const POST_EXAMPLE_DATA_SAGA = 'SAGA/POST_EXAMPLE_DATA';

export const getExampleData = (payload: ExampleGetRequest) => ({
  type: GET_EXAMPLE_DATA_SAGA,
  payload
});

export const postExampleData = (payload: ExamplePostRequest) => ({
  type: POST_EXAMPLE_DATA_SAGA,
  payload
});