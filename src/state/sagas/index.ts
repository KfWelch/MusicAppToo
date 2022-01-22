import { all, call, spawn } from 'redux-saga/effects';
import { makeAsyncSaga } from './generic/makeAsyncSaga';
import { exampleGet } from '../../services/Example.service';

const genericSagas = [
    makeAsyncSaga(GET_EXAMPLE_SAGA, GetExampleActionCreators, exampleGet)
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
