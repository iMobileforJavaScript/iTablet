import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SMap, SScene } from 'imobile_for_reactnative'
import { FileTools } from '../native'
import { Toast } from '../utils'
import { ConstPath, ConstInfo } from '../constants'
import fs from 'react-native-fs'
import UserType from '../constants/UserType'
import ConstOnline from '../constants/ConstOnline'
import { getLanguage } from '../language'
// Constants
// --------------------------------------------------
export const OPEN_WORKSPACE = 'OPEN_WORKSPACE'
export const GET_MAPS = 'GET_MAPS'
export const SET_LATEST_MAP = 'SET_LATEST_MAP'
export const SET_MAP_VIEW = 'SET_MAP_VIEW'
export const SET_CURRENT_MAP = 'SET_CURRENT_MAP'
export const SET_BASEMAP = 'SET_BASEMAP'
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
    // await SMap.closeDatasource()
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
export const openMap = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  try {
    if (
      params === null ||
      params === undefined ||
      (!params.title && !params.name) ||
      !params.path
    )
      return
    let absolutePath = await FileTools.appendingHomeDirectory(params.path)
    let userName = getState().user.toJS().currentUser.userName || 'Customer'
    let moduleName = GLOBAL.Type
    let module = params.module || ''
    let fileName = params.name || params.title
    let isCustomerPath = params.path.indexOf(ConstPath.CustomerPath) >= 0
    let importResult = await SMap.openMapName(fileName, {
      Module: module,
      IsPrivate: !isCustomerPath,
    })
    let expFilePath =
      absolutePath.substr(0, absolutePath.lastIndexOf('.')) + '.exp'
    let openMapResult = importResult && (await SMap.openMap(fileName))
    let mapInfo = await SMap.getMapInfo()
    if (openMapResult) {
      let expIsExist = await FileTools.fileIsExist(expFilePath)
      if (expIsExist) {
        let data = await fs.readFile(expFilePath)
        Object.assign(mapInfo, JSON.parse(data), { path: params.path })
        await SMap.resetMapFixColorsModeValue(true)
        await dispatch({
          type: SET_CURRENT_MAP,
          payload: mapInfo || {},
          extData: {
            userName,
            moduleName,
          },
        })

        cb && cb(mapInfo)
        return mapInfo
      }
    } else {
      return openMapResult
    }
  } catch (e) {
    cb && cb(false)
    return false
  }
}

// 保存地图地图
export const saveMap = (params = {}, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  try {
    let mapName = params.mapName
    let currentMap = getState().map.toJS().currentMap
    let curMapName = currentMap.name
    let userName = getState().user.toJS().currentUser.userName
    let path = ''
    if (!params.notSaveToXML) {
      mapName = await SMap.saveMapName(
        params.mapName,
        params.nModule || '',
        params.addition,
        params.isNew,
      )
      path =
        ConstPath.UserPath +
        userName +
        '/' +
        ConstPath.RelativePath.Map +
        mapName +
        '.xml'
    }

    // 另存为 和 未打开一幅已命名的地图，则需要重新设置当前地图
    // 另存不需要重新设置当前地图
    if (!params.isNew /*|| curMapName !== mapName*/) {
      let mapInfo = {}
      if (curMapName === mapName) {
        Object.assign(mapInfo, currentMap, { path, name: mapName })
      } else {
        mapInfo = { path, name: mapName }
      }
      await dispatch({
        type: SET_CURRENT_MAP,
        payload: mapInfo,
        extData: {
          userName,
          moduleName: GLOBAL.Type,
        },
      })
    }
    cb && cb()
    return mapName
  } catch (e) {
    cb && cb()
    return null
  }
}

// 关闭地图
export const closeMap = (cb = () => {}) => async dispatch => {
  try {
    await SMap.resetMapFixColorsModeValue(false)
    await SMap.closeMap()
    await SMap.removeMap(-1) // 移除所有地图
    await SMap.closeDatasource()
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
  // let result = params && await SMap.importWorkspace(params)
  await dispatch({
    type: SET_CURRENT_MAP,
    payload: params || {},
  })
  cb && cb()
}

// 导出模版
export const exportWorkspace = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  if (isExporting) {
    Toast.show(getLanguage(global.language).Prompt.TYR_AGAIN_LATER)
    //''请稍后再试')
    return false
  }
  isExporting = true
  let exportResult = false
  let zipResult = false
  try {
    let userName = getState().user.toJS().currentUser.userName || 'Customer'
    let workspace = getState().map.toJS().workspace
    let path = params.outPath,
      fileName = '',
      fileNameWithoutExtension = '',
      parentPath = '',
      zipPath = params.zipPath
    let exportResult = false
    if (!path) {
      fileName = workspace.server.substr(workspace.server.lastIndexOf('/') + 1)
      fileNameWithoutExtension = fileName.substr(0, fileName.lastIndexOf('.'))
      parentPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
          userName +
          '/' +
          ConstPath.RelativePath.Temp +
          fileNameWithoutExtension,
      )
      path = parentPath + '/' + fileName
    } else {
      parentPath = path.substr(0, path.lastIndexOf('/'))
    }
    // 导出工作空间
    if (params.maps && params.maps.length > 0) {
      let fileReplace =
        params.fileReplace === undefined ? true : params.fileReplace
      if (params.isOpenMap) {
        let isLogin =
          getState().user.toJS().currentUser.userType !==
          UserType.PROBATION_USER
        exportResult = await SMap.exportWorkspaceByMap(params.maps[0], path, {
          Module: '',
          IsPrivate: isLogin,
        })
      } else {
        exportResult = await SMap.exportWorkspace(
          params.maps,
          path,
          fileReplace,
          params.extra,
        )
      }
    }
    // console.warn(exportResult)
    // 压缩工作空间
    if (exportResult) {
      zipPath = zipPath ? zipPath : parentPath + '.zip'
      zipResult = await FileTools.zipFile(parentPath, zipPath)
    }
    // 删除导出的工作空间
    await FileTools.deleteFile(parentPath)
    isExporting = false
    cb && cb(exportResult && zipResult, zipPath)
  } catch (e) {
    isExporting = false
    if (!exportResult) {
      Toast.show(getLanguage(global.language).Prompt.EXPORT_FAILED)
      //ConstInfo.EXPORT_WORKSPACE_FAILED)
    } else if (!zipResult) {
      Toast.show(ConstInfo.ZIP_FAILED)
    }
    cb && cb(exportResult && zipResult, '')
  }
}

//导出工作空间
export const exportmap3DWorkspace = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  // return
  let userName = getState().user.toJS().currentUser.userName || 'Customer'
  if (params.name) {
    if (isExporting) {
      Toast.show(getLanguage(global.language).Prompt.TYR_AGAIN_LATER)
      //'请稍后再试')
      return false
    }
    isExporting = true
    let path = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        userName +
        '/' +
        ConstPath.RelativePath.Temp +
        params.name,
    )
    let result = await SScene.export3DScenceName(params.name, path)
    if (result) {
      let zipPath = path + '.zip'
      result = await FileTools.zipFile(path, zipPath)
      if (result) {
        await FileTools.deleteFile(path)
        Toast.show(getLanguage(global.language).Prompt.SHARE_START)
        //'导出成功,开始分享')
        isExporting = false
        cb && cb(result, zipPath)
      }
    } else {
      Toast.show(getLanguage(global.language).Prompt.EXPORT_FAILED)
      //'导出失败')
    }
    // let result = await SScene.is3DWorkspace({ server: params.server })
    // if (result) {
    //   let result2 = await SScene.import3DWorkspace({ server: params.server })
    //   if (result2) {
    //     Toast.show('倒入成功')
    //   } else {
    //     Toast.show('倒入失败')
    //   }
    // } else {
    //   Toast.show('倒入失败')
    // }
  }
}
//导入三维工作空间
export const importSceneWorkspace = params => async (dispatch, getState) => {
  let userName = getState().user.toJS().currentUser.userName || 'Customer'
  // return
  if (userName !== 'Customer') {
    let path = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + userName,
    )
    await SScene.setCustomerDirectory(path)
  }
  if (params.server) {
    let result = await SScene.is3DWorkspace({ server: params.server })
    if (result) {
      let result2 = await SScene.import3DWorkspace({ server: params.server })
      if (result2) {
        // Toast.show('导入成功')
        return result2
      } else {
        // Toast.show('导入失败')
        return result2
      }
    } else {
      // Toast.show('导入失败')
      // return
      return result
    }
  }
}

export const setBaseMap = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_BASEMAP,
    payload: params || {},
  })
  cb && cb()
}

const initialState = fromJS({
  latestMap: {},
  map: {},
  maps: [],
  currentMap: {},
  workspace: {},
  baseMaps: {
    default: [
      ConstOnline.Baidu,
      ConstOnline.Google,
      ConstOnline.OSM,
      ConstOnline.SuperMapCloud,
    ],
  },
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
    [`${SET_CURRENT_MAP}`]: (state, { payload, extData }) => {
      let newData = state.toJS().latestMap || {}
      if (extData) {
        if (!newData[extData.userName]) {
          newData[extData.userName] = {}
        }
        if (!newData[extData.userName][extData.moduleName]) {
          newData[extData.userName][extData.moduleName] = []
        }
        let isExist = false
        for (
          let i = 0;
          i < newData[extData.userName][extData.moduleName].length;
          i++
        ) {
          if (!payload.path) break
          if (
            newData[extData.userName][extData.moduleName][i].path ===
            payload.path
          ) {
            newData[extData.userName][extData.moduleName][i] = payload
            let temp = newData[extData.userName][extData.moduleName][0]
            newData[extData.userName][extData.moduleName][0] =
              newData[extData.userName][extData.moduleName][i]
            newData[extData.userName][extData.moduleName][i] = temp
            isExist = true
            break
          }
        }
        if (!isExist && payload && payload.path) {
          newData[extData.userName][extData.moduleName].unshift(payload)
        }

        return state
          .setIn(['currentMap'], fromJS(payload))
          .setIn(['latestMap'], fromJS(newData))
      } else {
        return state.setIn(['currentMap'], fromJS(payload))
      }
    },
    //payload {userId:id,baseMaps:[]}
    [`${SET_BASEMAP}`]: (state, { payload }) => {
      let allBaseMap = state.toJS()
      if (allBaseMap.baseMaps.hasOwnProperty(payload.userId) === false) {
        allBaseMap.baseMaps[payload.userId] = []
      }
      // let newData
      if (payload.baseMaps.length > 0) {
        allBaseMap.baseMaps[payload.userId] = payload.baseMaps
      }
      return state.setIn(['baseMaps'], fromJS(allBaseMap.baseMaps))
    },
    [REHYDRATE]: (state, { payload }) => {
      if (payload && payload.map) {
        let data = payload.map
        data.maps = []
        data.currentMap = {}
        data.workspace = {}
        if (data.baseMaps === undefined) {
          data.baseMaps = initialState.toJS().baseMaps
        }
        return fromJS(data)
      } else {
        return state
      }
    },
  },
  initialState,
)
