import {
    call, cancelled, put, select, takeLatest
} from 'redux-saga/effects';
import _ from 'lodash';
import Axios, { AxiosError, CancelToken } from 'axios';
import { GenericActionTypes } from '../../actions/generic/makeAsyncActions';
import { AsyncSelector, asyncSelector } from '../../reducers/AsyncSelectors';

export function makeAsyncSaga<Q = any, R = any, E = AxiosError>(
    INITIATOR: string,
    opActions: GenericActionTypes<Q, R>,
    service: (payload: Q, cancelToken: CancelToken) => Promise<R>,
    selector: AsyncSelector<Q, R, E> = asyncSelector,
    handleError = _.noop
) {
    function* worker(initiationAction: { type: string; payload: Q }) {
        const { payload } = initiationAction;
        const initiator = opActions.START(payload).type;
        const initiatesUsingOpAction = INITIATOR === initiator;

        if (!initiatesUsingOpAction) {
            // If we decide to remove saga actions, then this put goes away
            yield put(opActions.START(payload));
        }

        const cancelSource = Axios.CancelToken.source();
        try {
            const serviceResult = yield call<(payload: Q, cancelToken: CancelToken) => Promise<R>>(
                service,
                payload,
                cancelSource.token);
            
            yield put(opActions.SUCCEED(serviceResult));
            return serviceResult;
        } catch (error) {
            yield put(opActions.FAIL(error));
            yield call(handleError, error);

            return null;
        } finally {
            if (yield cancelled()) {
                yield call(cancelSource.cancel, `${INITIATOR} Saga cancelled`);
            }
            yield put(opActions.COMPLETE(yield select(selector)));
        }
    }

    function* watcher() {
        // takeLatest will automatically cancel existing Sagas before starting a new one
        yield takeLatest(INITIATOR, worker);
    }

    return watcher;
}
