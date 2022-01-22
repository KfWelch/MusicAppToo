import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const enhancer = composeWithDevTools(
    compose(applyMiddleware(sagaMiddleware)),
);

export default createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);
