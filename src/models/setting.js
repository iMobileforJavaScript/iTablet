import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { DatasetType, SMap } from 'imobile_for_reactnative'
import { getMapSettings } from '../containers/mapSetting/settingData'

// Constants
// --------------------------------------------------
export const BUFFER_SETTING_SET = 'BUFFER_SETTING_SET'
export const OVERLAY_SETTING_SET = 'OVERLAY_SETTING_SET'
export const ROUTE_SETTING_SET = 'ROUTE_SETTING_SET'
export const TRACKING_SETTING_SET = 'TRACKING_SETTING_SET'
export const SETTING_DATA = 'SETTING_DATA'
export const MAP_SETTING = 'MAP_SETTING'
export const SETTING_LANGUAGE = 'SETTING_LANGUAGE'
export const MAP_LEGEND = 'MAP_LEGEND'

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

export const setSettingData = (data = [], cb = () => {}) => async dispatch => {
  await dispatch({
    type: SETTING_DATA,
    payload: data,
  })
  cb && cb()
}

export const setMapSetting = (cb = () => {}) => async dispatch => {
  await dispatch({
    type: MAP_SETTING,
    payload: [],
  })
  cb && cb()
}

export const setLanguage = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SETTING_LANGUAGE,
    payload: params,
  })
  cb && cb()
}
export const setMapLegend = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_LEGEND,
    payload: params || false,
  })
}

export const getMapSetting = (params = {}, cb = () => {}) => async dispatch => {
  try {
    let isAntialias = true
    let isOverlapDisplayed = false
    let isVisibleScalesEnabled = false

    isAntialias = await SMap.isAntialias()
    isOverlapDisplayed = await SMap.isOverlapDisplayed()
    isVisibleScalesEnabled = await SMap.isVisibleScalesEnabled()

    let newData = getMapSettings()
    newData[0].data[0].value = isAntialias
    newData[0].data[1].value = isOverlapDisplayed
    newData[1].data[0].value = isVisibleScalesEnabled

    await dispatch({
      type: MAP_SETTING,
      payload: newData || [],
    })
    cb && cb(newData)
  } catch (e) {
    await dispatch({
      type: MAP_SETTING,
      payload: params || [],
    })
    cb && cb()
  }
}

const initialState = fromJS({
  buffer: {
    endType: 1,
    distance: 10,
    selectedLayer: {},
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
  settingData: [],
  mapSetting: [],
  language: 'CN',
  mapLegend: false,
})

export default handleActions(
  {
    [`${SETTING_LANGUAGE}`]: (state, { payload }) => {
      return state.setIn(['language'], fromJS(payload))
    },
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
    [`${SETTING_DATA}`]: (state, { payload }) => {
      let data = state.toJS().settingData
      if (payload) {
        data = payload
      } else {
        data = []
      }
      return state.setIn(['settingData'], fromJS(data))
    },
    [`${MAP_SETTING}`]: (state, { payload }) => {
      let data = state.toJS().mapSetting
      if (payload) {
        data = payload
      } else {
        data = []
      }
      return state.setIn(['mapSetting'], fromJS(data))
    },
    [`${MAP_LEGEND}`]: (state, { payload }) => {
      let data = state.toJS().mapLegend
      if (payload) {
        data = payload
      } else {
        data = false
      }
      return state.setIn(['mapLegend'], fromJS(data))
    },
    [REHYDRATE]: (state, { payload }) => {
      return payload && payload.setting ? fromJS(payload.setting) : state
    },
  },
  initialState
)

