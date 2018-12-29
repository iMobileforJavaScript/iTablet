import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SMap, SScene } from 'imobile_for_reactnative'
import { FileTools } from '../native'
import { Toast } from '../utils'
import { ConstPath } from '../constants'
// Constants
// --------------------------------------------------
export const OPEN_WORKSPACE = 'OPEN_WORKSPACE'
export const GET_MAPS = 'GET_MAPS'
export const SET_LATEST_MAP = 'SET_LATEST_MAP'
export const SET_MAP_VIEW = 'SET_MAP_VIEW'
export const SET_CURRENT_MAP = 'SET_CURRENT_MAP'
export const OPEN_TEMPLATE = 'OPEN_TEMPLATE'
export const SET_TEMPLATE = 'SET_TEMPLATE'
export const SET_CURRENT_TEMPLATE_INFO = 'SET_CURRENT_TEMPLATE_INFO'
export const GET_SYMBOL_TEMPLATES = 'GET_SYMBOL_TEMPLATES'
// const Fs = require('react-native-fs')
let isExporting = false

// Actions
// --------------------------------------------------
// 打开工作空间
export const openWorkspace = (params, cb = () => {}) => async dispatch => {
  try {
    let result = await SMap.openWorkspace(params)
    await dispatch({
      type: OPEN_WORKSPACE,
      payload: params || {},
    })
    cb && cb(result)
    return result
  } catch (e) {
    await dispatch({
      type: OPEN_WORKSPACE,
      payload: {},
    })
    cb && cb(false)
    return false
  }
}

// 关闭工作空间
export const closeWorkspace = (cb = () => {}) => async dispatch => {
  try {
    let result = await SMap.closeWorkspace()
    await dispatch({
      type: OPEN_WORKSPACE,
      payload: {},
    })
    cb && cb(result)
    return result
  } catch (e) {
    await dispatch({
      type: OPEN_WORKSPACE,
      payload: {},
    })
    cb && cb(false)
    return false
  }
}

// 打开地图
export const openMap = (params, cb = () => {}) => async dispatch => {
  try {
    if (params === null || params === undefined) return
    let result = await SMap.openMap(params)
    if (result) {
      let mapInfo = await SMap.getMapInfo()
      await dispatch({
        type: SET_CURRENT_MAP,
        payload: mapInfo || {},
      })
    }
    cb && cb(result)
    return result
  } catch (e) {
    cb && cb(false)
    return false
  }
}

// 打开地图
export const closeMap = (cb = () => {}) => async dispatch => {
  try {
    await SMap.closeMap()
    await dispatch({
      type: SET_CURRENT_MAP,
      payload: {},
    })
    cb && cb()
  } catch (e) {
    cb && cb()
  }
}

// 获取当前工作空间的地图列表
export const getMaps = (cb = () => {}) => async dispatch => {
  try {
    let maps = await SMap.getMaps()
    await dispatch({
      type: GET_MAPS,
      payload: maps || [],
    })
    cb && cb(maps)
  } catch (e) {
    await dispatch({
      type: GET_MAPS,
      payload: [],
    })
    cb && cb(false)
  }
}

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
  let result = await SMap.importWorkspace(params)
  await dispatch({
    type: SET_CURRENT_MAP,
    payload: params || {},
  })
  cb && cb(result)
}

// 导出模版
export const exportWorkspace = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  if (isExporting) {
    Toast.show('请稍后再试')
    return false
  }
  isExporting = true
  let userName = getState().user.toJS().currentUser.userName || 'Customer'
  let workspace = getState().map.toJS().workspace
  let path = params.outPath,
    fileName = '',
    fileNameWithoutExtention = '',
    parentPath = '',
    zipPath = ''
  let result = false
  if (!path) {
    fileName = workspace.server.substr(workspace.server.lastIndexOf('/') + 1)
    fileNameWithoutExtention = fileName.substr(0, fileName.lastIndexOf('.'))
    parentPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        userName +
        '/' +
        ConstPath.RelativePath.Temp +
        fileNameWithoutExtention,
    )
    path = parentPath + '/' + fileName
  }
  // 导出工作空间
  if (params.maps && params.maps.length > 0) {
    let fileReplace =
      params.fileReplace === undefined ? true : params.fileReplace
    result = await SMap.exportWorkspace(params.maps, path, fileReplace)
  }
  // 压缩工作空间
  if (result) {
    zipPath = parentPath + '.zip'
    result = await FileTools.zipFile(parentPath, zipPath)
  }
  // 删除导出的工作空间
  await FileTools.deleteFile(parentPath)
  isExporting = false
  cb && cb(result, zipPath)
}
//导出工作空间
// export const map3DleadWorkspace = (
//   params = {},
//   cb = () => {},
// ) => async getState => {}

//到入三维工作空间
export const improtSceneWorkspace = params => async getState => {
  let userName = getState().user.toJS().currentUser.userName || 'Customer'
  if (userName !== 'Customer') {
    let path = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + userName + '/' + ConstPath.RelativePath.Scene,
    )
    await SScene.setCustomerDirectory(path)
  }
  if (params.server) {
    let result = SScene.is3DWorkspace()
    if (result) {
      await SScene.import3DWorkspaceInfo({ server: params.server })
    } else {
      Toast.show('倒入失败')
    }
  }
}

const initialState = fromJS({
  latestMap: [],
  map: {},
  maps: [],
  currentMap: {},
  workspace: {},
})

export default handleActions(
  {
    [`${OPEN_WORKSPACE}`]: (state, { payload }) => {
      return state.setIn(['workspace'], fromJS(payload))
    },
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
      if (!isExist && payload) {
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
    [`${GET_MAPS}`]: (state, { payload }) => {
      return state.setIn(['maps'], fromJS(payload))
    },
    [`${SET_CURRENT_MAP}`]: (state, { payload }) => {
      return state.setIn(['currentMap'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      let data,
        payloadData = (payload && payload.map) || state.toJS()
      data = Object.assign({}, payloadData, {
        currentMap: {},
        maps: [],
        workspace: {},
      })
      return fromJS(data)
    },
  },
  initialState,
)
