import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import * as reducers from '../models'
import middlewares from './middlewares'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native

const persistConfig = {
  key: 'root',
  storage,
}

// export default () => {
//   let reducer = persistCombineReducers(persistConfig, reducers);
//   let store = createStore(reducer, applyMiddleware(...middlewares));
//   let persistor = persistStore(store);
//   return { persistor, store }
// }

const persistedReducer = persistCombineReducers(persistConfig, reducers)
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
  let store = createStore(persistedReducer, composeEnhancers(applyMiddleware(...middlewares)))
  let persistor = persistStore(store)
  return { store, persistor }
}