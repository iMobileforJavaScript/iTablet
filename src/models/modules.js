import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const MODULES_SET = 'MODULES_SET'

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

const initialState = fromJS({})

export default handleActions(
  {
    [`${MODULES_SET}`]: (state, { payload }) => {
      let modules = payload
      return fromJS(modules)
    },
    [REHYDRATE]: (state, payload) => {
      return payload && payload.modules ? fromJS(payload.modules) : state
    },
  },
  initialState,
)
