import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { DatasetType } from 'imobile_for_javascript'

// Constants
// --------------------------------------------------
export const BUFFER_SETTING_SET = 'BUFFER_SETTING_SET'
export const OVERLAY_SETTING_SET = 'OVERLAY_SETTING_SET'
export const ROUTE_SETTING_SET = 'ROUTE_SETTING_SET'
export const TRACKING_SETTING_SET = 'TRACKING_SETTING_SET'

// Actions
// --------------------------------------------------
export const setBufferSetting = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: BUFFER_SETTING_SET,
    payload: params || {},
  })
  cb && cb()
}

export const setOverlaySetting = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: OVERLAY_SETTING_SET || {},
    payload: params,
  })
  cb && cb()
}

export const setRouteSetting = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: ROUTE_SETTING_SET,
    payload: params,
  })
  cb && cb()
}

export const setTrackingSetting = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: TRACKING_SETTING_SET,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  buffer: {
    endType: 1,
    distance: 10,
  },
  overlay: {
    datasetVector: {},
    targetDatasetVector: {},
    resultDataset: {},
    method: 'clip',
    overlayType: DatasetType.POINT,
  },
  route: {
    mode: '',
  },
})

export default handleActions(
  {
    [`${BUFFER_SETTING_SET}`]: (state, { payload }) => {
      return state.setIn(['buffer'], fromJS(payload))
    },
    [`${OVERLAY_SETTING_SET}`]: (state, { payload }) => {
      let data = state.toJS().overlay
      if (payload) {
        Object.assign(data, payload)
      } else {
        data = initialState.toJS().overlay
      }
      return state.setIn(['overlay'], fromJS(data))
    },
    [`${ROUTE_SETTING_SET}`]: (state, { payload }) => {
      let data = state.toJS().overlay
      if (payload) {
        Object.assign(data, payload)
      } else {
        data = initialState.toJS().overlay
      }
      return state.setIn(['overlay'], fromJS(data))
    },
    [`${TRACKING_SETTING_SET}`]: (state, { payload }) => {
      let data = state.toJS().overlay
      if (payload) {
        Object.assign(data, payload)
      } else {
        data = initialState.toJS().overlay
      }
      return state.setIn(['overlay'], fromJS(data))
    },
    [REHYDRATE]: (state, { payload }) => {
      return payload && payload.setting ? fromJS(payload.setting) : state
    },
  },
  initialState,
)
