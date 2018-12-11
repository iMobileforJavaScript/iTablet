import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const SET_LATEST_MAP = 'SET_LATEST_MAP'
export const SET_MAP_VIEW = 'SET_MAP_VIEW'
export const SET_CURRENT_MAP = 'SET_CURRENT_MAP'

// Actions
// --------------------------------------------------
export const setLatestMap = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_LATEST_MAP,
    payload: params || {},
  })
  cb && cb()
}

export const setMapView = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_MAP_VIEW,
    payload: params || {},
  })
  cb && cb()
}

export const setCurrentMap = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_CURRENT_MAP,
    payload: params || {},
  })
  cb && cb()
}

const initialState = fromJS({
  latestMap: [],
  map: {},
  currentMap: '',
  workspace: {},
  mapControl: {},
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
    [`${SET_MAP_VIEW}`]: (state, { payload }) => {
      if (payload.workspace) {
        state.setIn(['workspace'], fromJS(payload.workspace))
      }
      if (payload.map) {
        state.setIn(['map'], fromJS(payload.map))
      }
      if (payload.mapControl) {
        state.setIn(['mapControl'], fromJS(payload.mapControl))
      }
      return state
    },
    [`${SET_CURRENT_MAP}`]: (state, { payload }) => {
      return state.setIn(['currentMap'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      let data = {}
      if (payload && payload.map) {
        data = Object.assign({}, payload.map, { currentMap: '' })
      } else {
        data = Object.assign({}, state.toJS(), { currentMap: '' })
      }
      return fromJS(data)
    },
  },
  initialState,
)
