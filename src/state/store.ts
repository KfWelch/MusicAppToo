import { composeWithDevTools } from '@redux-devtools/extension';
import { applyMiddleware, compose, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

const enhancer = composeWithDevTools(
    compose(applyMiddleware(sagaMiddleware)),
);

const store = createStore(rootReducer, enhancer);

sagaMiddleware.run(rootSaga);

export const persistor = persistStore(store);
export default store
