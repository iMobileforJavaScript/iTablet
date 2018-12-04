import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const SET_CURRENT_SYMBOL = 'SET_CURRENT_SYMBOL'
export const SET_CURRENT_SYMBOLS = 'SET_CURRENT_SYMBOLS'
export const SET_SYMBOLS_MAXLENGTH = 'SET_SYMBOLS_MAXLENGTH'

// Actions
// --------------------------------------------------
export const setCurrentSymbol = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: SET_CURRENT_SYMBOL,
    payload: params,
  })
  cb && cb()
}

export const setCurrentSymbols = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: SET_CURRENT_SYMBOLS,
    payload: params,
  })
  cb && cb()
}

export const setSymbolsMaxLength = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: SET_SYMBOLS_MAXLENGTH,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  currentSymbol: {},
  latestSymbols: [],
  currentSymbols: [],
  maxLength: 40,
})

export default handleActions(
  {
    [`${SET_CURRENT_SYMBOLS}`]: (state, { payload }) => {
      return state.setIn(['currentSymbols'], fromJS(payload))
    },
    [`${SET_SYMBOLS_MAXLENGTH}`]: (state, { payload }) => {
      return state.setIn(['maxLength'], fromJS(payload))
    },
    [`${SET_CURRENT_SYMBOL}`]: (state, { payload }) => {
      let newData = state.toJS().latestSymbols || []
      let maxLength = state.toJS().maxLength || initialState.toJS().maxLength
      let index = newData.indexOf(payload.id)
      index > -1 && newData.splice(index, 1)
      newData.unshift(payload.id)
      if (newData.length >= maxLength) {
        newData = newData.slice(0, maxLength)
      }
      return state
        .setIn(['currentSymbol'], fromJS(payload))
        .setIn(['latestSymbols'], fromJS(newData))
    },
    [REHYDRATE]: state => {
      // return payload && payload.nav ? fromJS(payload.nav) : state
      return state
        .setIn(['currentSymbols'], fromJS([]))
        .setIn(['currentSymbol'], fromJS({}))
    },
  },
  initialState,
)