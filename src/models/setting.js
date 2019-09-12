import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { DatasetType, SMap } from 'imobile_for_reactnative'
import { getMapSettings } from '../containers/mapSetting/settingData'
import { ModelUtils } from '../utils'

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
export const MAP_SCALEVIEW = 'MAP_SCALEVIEW'
export const MAP_NAVIGATION = 'MAP_NAVIGATION'
export const MAP_2DTO3D = 'MAP_2DTO3D'
export const MAP_IS3D = 'MAP_IS3D'
export const MAP_NAVIGATIONSHOW = 'MAP_NAVIGATIONSHOW'
export const MAP_INDOORNAViGATION = 'MAP_INDOORNAViGATION'
export const NAVIGATION_CHANGEAR = 'NAVIGATION_CHANGEAR'
export const NAVIGATION_POIVIEW = 'NAVIGATION_POIVIEW'
export const MAP_SELECT_POINT = 'MAP_SELECT_POINT'
export const AGREE_TO_PROTOCOL = 'AGREE_TO_PROTOCOL'
export const NAVIGATION_HISTORY = 'NAVIGATION_HISTORY'
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
export const setMapNavigation = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_NAVIGATION,
    payload: params || false,
  })
}
export const setMap2Dto3D = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_2DTO3D,
    payload: params || false,
  })
}
export const setMapIs3D = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_IS3D,
    payload: params || false,
  })
}
export const setMapNavigationShow = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_NAVIGATIONSHOW,
    payload: params || false,
  })
}
export const setMapIndoorNavigation = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_INDOORNAViGATION,
    payload: params || false,
  })
}
export const setNavigationChangeAR = (params = {}) => async dispatch => {
  await dispatch({
    type: NAVIGATION_CHANGEAR,
    payload: params || false,
  })
}
export const setNavigationPoiView = (params = {}) => async dispatch => {
  await dispatch({
    type: NAVIGATION_POIVIEW,
    payload: params || false,
  })
}
export const setMapSelectPoint = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_SELECT_POINT,
    payload: params || false,
  })
}
export const setNavigationHistory = (
  data = [],
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: NAVIGATION_HISTORY,
    payload: data,
  })
  cb && cb()
}
export const setMapScaleView = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_SCALEVIEW,
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

export const setAgreeToProtocol = (params = {}) => async dispatch => {
  await dispatch({
    type: AGREE_TO_PROTOCOL,
    payload: params || false,
  })
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
  mapLegend: {
    isShow: false,
    backgroundColor: 'white',
    column: 2,
    widthPercent: 80,
    heightPercent: 80,
  },
  mapNavigation: {
    isShow: false,
    name: '',
  },
  map2Dto3D: false,
  mapIs3D: false,
  mapNavigationShow: false,
  mapScaleView: true,
  mapIndoorNavigation: false,
  navigationChangeAR: false,
  navigationPoiView: false,
  mapSelectPoint: {
    firstPoint: '选择起点',
    secondPoint: '选择终点',
  },
  isAgreeToProtocol: false,
  navigationhistory: [],
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
    [`${MAP_SCALEVIEW}`]: (state, { payload }) => {
      let data = state.toJS().mapScaleView
      if (payload) {
        data = payload
      } else {
        data = false
      }
      return state.setIn(['mapScaleView'], fromJS(data))
    },
    [`${MAP_LEGEND}`]: (state, { payload }) => {
      let data = state.toJS().mapLegend
      if (payload) {
        data = payload
      } else {
        data = {
          isShow: false,
          backgroundColor: 'white',
          column: 2,
          widthPercent: 80,
          heightPercent: 80,
        }
      }
      return state.setIn(['mapLegend'], fromJS(data))
    },
    [`${MAP_NAVIGATION}`]: (state, { payload }) => {
      let data = state.toJS().mapNavigation
      if (payload) {
        data = payload
      } else {
        data = {
          isShow: false,
          name: '',
        }
      }
      return state.setIn(['mapNavigation'], fromJS(data))
    },
    [`${MAP_2DTO3D}`]: (state, { payload }) => {
      let data = state.toJS().map2Dto3D
      if (payload !== undefined) {
        data = payload
      } else {
        data = false
      }
      return state.setIn(['map2Dto3D'], fromJS(data))
    },
    [`${MAP_IS3D}`]: (state, { payload }) => {
      let data = state.toJS().mapIs3D
      if (payload !== undefined) {
        data = payload
      } else {
        data = false
      }
      return state.setIn(['mapIs3D'], fromJS(data))
    },
    [`${MAP_NAVIGATIONSHOW}`]: (state, { payload }) => {
      let data = state.toJS().mapNavigationShow
      if (payload !== undefined) {
        data = payload
      } else {
        data = true
      }
      return state.setIn(['mapNavigationShow'], fromJS(data))
    },
    [`${MAP_INDOORNAViGATION}`]: (state, { payload }) => {
      let data = state.toJS().mapIndoorNavigation
      if (payload !== undefined) {
        data = payload
      } else {
        data = false
      }
      return state.setIn(['mapIndoorNavigation'], fromJS(data))
    },
    [`${NAVIGATION_CHANGEAR}`]: (state, { payload }) => {
      let data = state.toJS().navigationChangeAR
      if (payload !== undefined) {
        data = payload
      } else {
        data = true
      }
      return state.setIn(['navigationChangeAR'], fromJS(data))
    },
    [`${NAVIGATION_POIVIEW}`]: (state, { payload }) => {
      let data = state.toJS().navigationPoiView
      if (payload !== undefined) {
        data = payload
      } else {
        data = true
      }
      return state.setIn(['navigationPoiView'], fromJS(data))
    },
    [`${MAP_SELECT_POINT}`]: (state, { payload }) => {
      let data = state.toJS().mapSelectPoint
      if (payload) {
        data = payload
      } else {
        data = {
          firstPoint: '选择起点',
          secondPoint: '选择终点',
        }
      }
      return state.setIn(['mapSelectPoint'], fromJS(data))
    },
    [`${NAVIGATION_HISTORY}`]: (state, { payload }) => {
      let data = state.toJS().navigationhistory
      if (payload) {
        data = payload
      } else {
        data = []
      }
      return state.setIn(['navigationhistory'], fromJS(data))
    },
    [`${AGREE_TO_PROTOCOL}`]: (state, { payload }) => {
      let data = payload || false
      return state.setIn(['isAgreeToProtocol'], fromJS(data))
    },
    [REHYDRATE]: (state, { payload }) => {
      // if (payload && payload.setting) {
      //   payload.setting.language = payload.setting.language === undefined ? 'CN' : payload.setting.language
      // }
      // return payload && payload.setting ? fromJS(payload.setting) : state
      return ModelUtils.checkModel(state, payload && payload.setting)
    },
  },
  initialState,
)
