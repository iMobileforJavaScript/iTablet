import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const SET_LATEST_MAP = 'SET_LATEST_MAP'
export const SET_MAP = 'SET_MAP'
export const SET_WORKSPACE = 'SET_WORKSPACE'
export const SET_WORKSPACE_MAP = 'SET_WORKSPACE_MAP'

// Actions
// --------------------------------------------------
export const setLatestMap = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_LATEST_MAP,
    payload: params || {},
  })
  cb && cb()
}

export const setMap = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_MAP,
    payload: params || {},
  })
  cb && cb()
}

export const setWorkspace = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_MAP,
    payload: params || {},
  })
  cb && cb()
}

export const setWsAndMap = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_MAP,
    payload: params || {},
  })
  cb && cb()
}

const initialState = fromJS({
  latestMap: [],
  currentMap: {},
  currentWs: {},
})

export default handleActions(
  {
    [`${SET_LATEST_MAP}`]: (state, { payload }) => {
      let newData = state.toJS().latestMap || []
      let isExist = false
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].path === payload.path) {
          newData[i] = payload
          let temp = newData[0]
          newData[0] = newData[i]
          newData[i] = temp
          isExist = true
          break
        }
      }
      if (!isExist) {
        newData.unshift(payload)
      }
      return state.setIn(['latestMap'], fromJS(newData))
    },
    [`${SET_MAP}`]: (state, { payload }) => {
      return state.setIn(['currentMap'], fromJS(payload))
    },
    [`${SET_WORKSPACE}`]: (state, { payload }) => {
      return state.setIn(['currentWs'], fromJS(payload))
    },
    [`${SET_WORKSPACE_MAP}`]: (state, { payload }) => {
      return state.setIn(['currentWs'], fromJS(payload))
        .setIn(['currentMap'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      return payload && payload.map ? fromJS(payload.map) : state
    },
  },
  initialState,
)
