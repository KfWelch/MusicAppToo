import { all, call, spawn } from 'redux-saga/effects';
import { makeAsyncSaga } from './generic/makeAsyncSaga';
import { exampleGet } from '../../services/Example.service';
import { GetExampleDataActionCreators, GET_EXAMPLE_DATA_SAGA } from '../actions/ExampleService';

const genericSagas = [
    makeAsyncSaga(GET_EXAMPLE_DATA_SAGA, GetExampleDataActionCreators, exampleGet)
];

const customSagas: any[] = [];

export default function* rootSaga() {
    yield all(
        [...genericSagas, ...customSagas].map(saga => spawn(function* spawner() {
            while (true) {
                try {
                    yield call(saga);
                    break;
                } catch (err) {
                    // TODO actual error handling
                    console.error(err);
                }
            }
        }))
    );
}
