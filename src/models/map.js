import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SMap, Utility } from 'imobile_for_reactnative'
import { FileTools } from '../native'
import { Toast } from '../utils'
import { ConstPath } from '../constants'
import fs from 'react-native-fs'
import xml2js from 'react-native-xml2js'
let parser = new xml2js.Parser()
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
export const closeWorkspace = (params, cb = () => {}) => async dispatch => {
  try {
    let result = await SMap.closeWorkspace(params)
    await dispatch({
      type: OPEN_WORKSPACE,
      payload: params || {},
    })
    cb && cb(result)
  } catch (e) {
    await dispatch({
      type: OPEN_WORKSPACE,
      payload: {},
    })
    cb && cb(false)
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

// 导入模版
export const openTemplate = (params, cb = () => {}) => async dispatch => {
  let payload = {
    templateInfo: {},
    mapInfo: {},
  }
  let copyResult = true,
    openResult = false
  try {
    // 查看模板工作空间是否存在
    // 拷贝模板文件
    let userPath = params.path.substr(0, params.path.indexOf('/Data/Template'))
    let fileName = params.path.substr(params.path.lastIndexOf('/') + 1)
    let tempDirPath = params.path.substr(0, params.path.lastIndexOf('/'))
    let tempParentDirName = tempDirPath.substr(tempDirPath.lastIndexOf('/') + 1)
    let targetPath =
      userPath + '/' + ConstPath.RelativePath.Workspace + tempParentDirName // 目标文件目录，不含文件名
    let targetFilePath = targetPath + '/' + fileName
    copyResult = await FileTools.copyFile(tempDirPath, targetPath)
    openResult = false
    if (copyResult) {
      // 关闭所有地图
      await SMap.closeMap()
      await SMap.closeWorkspace()
      let data = { server: params.path }
      openResult = await SMap.openWorkspace(data)
      await SMap.openMap(0)
      let mapInfo = await SMap.getMapInfo()

      Object.assign(params, { path: targetFilePath })
      payload = {
        templateInfo: params,
        mapInfo,
      }
    }
    cb && cb({ copyResult, openResult })
  } catch (e) {
    cb && cb({ copyResult, openResult })
  }

  await dispatch({
    type: OPEN_TEMPLATE,
    payload: payload || {},
  })
}

// 导入模版
export const importTemplate = (params, cb = () => {}) => async dispatch => {
  // 关闭所有地图
  await SMap.closeMap()
  // 导入工作空间
  let result = await SMap.importWorkspace(params)
  // 默认打开第一幅地图
  let mapList = (await SMap.getMaps(0)) || []
  mapList.length > 0 && (await SMap.openMap(mapList.length - 1))
  let mapInfo = await SMap.getMapInfo()
  Object.assign(params, mapInfo)
  let payload = {
    templateInfo: params,
    mapInfo,
  }
  await dispatch({
    type: OPEN_TEMPLATE,
    payload: payload || {},
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
  let userName = getState().user.toJS().currentUser.userName || 'Customer'
  let workspace = getState().map.toJS().workspace
  let path = params.outPath,
    fileName = '',
    zipPath = ''
  let result = false
  if (!path) {
    fileName = workspace.server.substr(workspace.server.lastIndexOf('/') + 1)
    path =
      ConstPath.UserPath +
      userName +
      '/' +
      ConstPath.RelativePath.Temp +
      fileName
    path = await Utility.appendingHomeDirectory(path)
  }
  // 导出工作空间
  if (params.maps && params.maps.length > 0) {
    let fileReplace =
      params.fileReplace === undefined ? true : params.fileReplace
    result = await SMap.exportWorkspace(params.maps, path, fileReplace)
  }
  // 压缩工作空间
  if (result) {
    zipPath =
      path.substr(0, path.lastIndexOf('/') + 1) +
      fileName.substr(0, fileName.lastIndexOf('.')) +
      '.zip'
    result = await FileTools.zipFile(path, zipPath)
  }
  // 删除导出的工作空间
  await FileTools.deleteFile(path)
  isExporting = true
  cb && cb(result, zipPath)
}

// 设置模版
export const setTemplate = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_TEMPLATE,
    payload: params || {},
  })
  cb && cb()
}

// 设置当前选中的模板符号
export const setCurrentTemplateInfo = (
  params,
  cb = () => {},
) => async dispatch => {
  let data = {}
  if (params && params.fields) {
    let tempInfo = params.fields[0].field,
      fieldInfo = []
    tempInfo.forEach(item => {
      fieldInfo.push(item.$)
    })
    data = {
      ...params.$,
      field: fieldInfo,
    }
  }
  await dispatch({
    type: SET_CURRENT_TEMPLATE_INFO,
    payload: data || {},
  })
  cb && cb(params)
}

// 获取xml文件中的模板符号
export const getSymbolTemplates = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  try {
    let map = getState().map.toJS()
    let template = map.template
    let path = (params && params.path) || template.path
    if (path) {
      if (
        path === map.symbolTemplates.path &&
        map.symbolTemplates.symbols.length > 0
      ) {
        cb && cb(params)
        return
      }
      let tempPath = path.substr(0, path.lastIndexOf('/') + 1)
      Utility.getPathListByFilter(tempPath, {
        type: 'xml',
      }).then(xmlList => {
        if (xmlList && xmlList.length > 0) {
          let xmlInfo = xmlList[0]
          Utility.appendingHomeDirectory(xmlInfo.path).then(xmlPath => {
            fs.readFile(xmlPath).then(data => {
              parser.parseString(data, async (err, result) => {
                await dispatch({
                  type: GET_SYMBOL_TEMPLATES,
                  payload: {
                    symbols: result.featureSymbol.template[0].feature || [],
                    path,
                  },
                })
                cb && cb(params)
              })
            })
          })
        }
      })
    }
  } catch (e) {
    await dispatch({
      type: GET_SYMBOL_TEMPLATES,
      payload: {
        symbols: [],
        path: '',
      },
    })
  }
}

const initialState = fromJS({
  latestMap: [],
  map: {},
  maps: [],
  currentMap: {},
  template: {},
  symbolTemplates: {
    symbols: [],
    path: '',
  },
  currentTemplateInfo: {},
  workspace: {},
  // mapControl: {},
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
    [`${GET_MAPS}`]: (state, { payload }) => {
      return state.setIn(['maps'], fromJS(payload))
    },
    [`${SET_CURRENT_MAP}`]: (state, { payload }) => {
      return state.setIn(['currentMap'], fromJS(payload))
    },
    [`${SET_CURRENT_TEMPLATE_INFO}`]: (state, { payload }) => {
      return state.setIn(['currentTemplateInfo'], fromJS(payload))
    },
    [`${OPEN_TEMPLATE}`]: (state, { payload }) => {
      return state
        .setIn(['template'], fromJS(payload.templateInfo))
        .setIn(['currentMap'], fromJS(payload.currentMap))
    },
    [`${SET_TEMPLATE}`]: (state, { payload }) => {
      return state.setIn(['template'], fromJS(payload))
    },
    [`${GET_SYMBOL_TEMPLATES}`]: (state, { payload }) => {
      return state.setIn(['symbolTemplates'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      let data,
        payloadData = (payload && payload.map) || state.toJS()
      data = Object.assign({}, payloadData, {
        currentMap: {},
        template: {},
        maps: [],
        currentTemplateInfo: {},
        symbolTemplates: {
          symbols: [],
          path: '',
        },
      })
      return fromJS(data)
    },
  },
  initialState,
)
