import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const SET_CURRENT_SYMBOL = 'SET_CURRENT_SYMBOL'

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

const initialState = fromJS({
  currentSymbol: -1,
  latestSymbols: [],
  maxLength: 20,
})

export default handleActions(
  {
    [`${SET_CURRENT_SYMBOL}`]: (state, { payload }) => {
      let newData = state.toJS().latestSymbols || []
      let maxLength = state.toJS().maxLength || initialState.toJS().maxLength
      let isExist = false
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].currentSymbol === payload.currentSymbol) {
          newData.slice(i, 1)
          newData.unshift(payload.currentSymbol)
          if (newData.length >= maxLength) {
            newData = newData.slice(0, maxLength)
          }
          isExist = true
          break
        }
      }
      if (!isExist) {
        newData.unshift(payload.currentSymbol)
        if (newData.length >= maxLength) {
          newData = newData.slice(0, maxLength)
        }
      }
      return state
        .setIn(['currentSymbol'], fromJS(payload.currentSymbol))
        .setIn(['latestSymbols'], fromJS(newData))
        .setIn(['maxLength'], fromJS(payload.maxLength))
    },
    [REHYDRATE]: state => {
      // return payload && payload.nav ? fromJS(payload.nav) : state
      return state
    },
  },
  initialState,
)
