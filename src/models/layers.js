import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const SET_EDIT_LAYER = 'SET_EDIT_LAYER'
export const SET_SELECTION = 'SET_SELECTION'
export const SET_CURRENT_ATTRIBUTE = 'SET_CURRENT_ATTRIBUTE'
export const SET_ANALYST_LAYER = 'SET_ANALYST_LAYER'

// Actions
// --------------------------------------------------
export const setEditLayer = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_EDIT_LAYER,
    payload: params || {},
  })
  cb && cb()
}

export const setSelection = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_SELECTION,
    payload: params || {},
  })
  cb && cb()
}

export const setCurrentAttribute = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_CURRENT_ATTRIBUTE,
    payload: params || {},
  })
  cb && cb()
}

export const setAnalystLayer = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_ANALYST_LAYER,
    payload: params || {},
  })
  cb && cb()
}

const initialState = fromJS({
  layers: {},
  editLayer: {},
  selection: {},
  currentAttribute: {},
  analystLayer: {},
})

export default handleActions(
  {
    [`${SET_EDIT_LAYER}`]: (state, { payload }) => {
      return state.setIn(['editLayer'], fromJS(payload))
    },
    [`${SET_SELECTION}`]: (state, { payload }) => {
      return state.setIn(['selection'], fromJS(payload))
    },
    [`${SET_CURRENT_ATTRIBUTE}`]: (state, { payload }) => {
      return state.setIn(['currentAttribute'], fromJS(payload))
    },
    [`${SET_ANALYST_LAYER}`]: (state, { payload }) => {
      return state.setIn(['analystLayer'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      return payload && payload.layers ? fromJS(payload.layers) : state
    },
  },
  initialState,
)
