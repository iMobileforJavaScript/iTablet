import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const MODULES_SET = 'MODULES_SET'
export const MODULES_SET_CUT_MAP_MODULE = 'MODULES_SET_CUT_MAP_MODULE'

// Actions
// --------------------------------------------------
export const setModules = (params, cb = () => {}) => async dispatch => {
  if (!params) return
  await dispatch({
    type: MODULES_SET,
    payload: params,
  })
  cb && cb()
}

export const setCurrentMapModule = (
  params,
  cb = () => {},
) => async dispatch => {
  if (params >= 0) {
    await dispatch({
      type: MODULES_SET_CUT_MAP_MODULE,
      payload: params,
    })
    cb && cb()
  }
}

const initialState = fromJS({})

export default handleActions(
  {
    [`${MODULES_SET}`]: (state, { payload }) => {
      let appConfig = payload
      return fromJS(appConfig)
    },
    [`${MODULES_SET_CUT_MAP_MODULE}`]: (state, { payload }) => {
      return state.setIn(['currentMapModule'], fromJS(payload))
    },
    [REHYDRATE]: (state, payload) => {
      return payload && payload.appConfig ? fromJS(payload.appConfig) : state
    },
  },
  initialState,
)
