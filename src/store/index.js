import { AsyncStorage } from 'react-native'
import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore, persistCombineReducers } from 'redux-persist'
import * as reducers from '../models'
import middlewares from './middlewares'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'setting',
    'user',
    'chat',
    'template',
    'symbol',
    'map',
    'histories',
    'appConfig',
  ],
  blacklist: [
    'nav',
    'collection',
    'down',
    'layers',
    'online',
    'device',
    'backActions',
    'analyst',
    'localData',
    'toolbarStatus',
  ],
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
  let reducer = persistCombineReducers(persistConfig, reducers)
  let store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlewares)),
  )
  let persistor = persistStore(store)
  return { persistor, store }
}
