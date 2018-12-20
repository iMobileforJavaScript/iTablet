import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SMap, Utility, WorkspaceType } from 'imobile_for_reactnative'
import { FileTools } from '../native'
import { Toast } from '../utils'
import { ConstPath, ConstInfo } from '../constants'
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

// 导入模版
export const openTemplate = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  let workspace = getState().map.toJS().workspace
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
    // let alias = fileName.split('.')[0].toString()
    let fileType = fileName.split('.')[1].toString()
    let tempDirPath = params.path.substr(0, params.path.lastIndexOf('/'))
    let tempParentDirName = tempDirPath.substr(tempDirPath.lastIndexOf('/') + 1)
    let targetPath =
      userPath + '/' + ConstPath.RelativePath.Workspace + tempParentDirName // 目标文件目录，不含文件名
    let targetFilePath = targetPath + '/' + fileName

    let type
    switch (fileType) {
      case 'SXW':
        type = WorkspaceType.SXW
        break
      case 'SMW':
        type = WorkspaceType.SMW
        break
      case 'SXWU':
        type = WorkspaceType.SXWU
        break
      case 'SMWU':
      default:
        type = WorkspaceType.SMWU
    }

    if (workspace.server === targetFilePath) {
      cb &&
        cb({ copyResult, openResult, msg: ConstInfo.WORKSPACE_ALREADY_OPENED })
    } else {
      copyResult = await FileTools.copyFile(tempDirPath, targetPath)
      openResult = false
      if (copyResult) {
        // 关闭所有地图
        await SMap.closeMap()
        await SMap.closeWorkspace()
        let data = { server: targetFilePath, type }
        openResult = await SMap.openWorkspace(data)
        // 导入新的模板工作空间
        if (params.isImportWorkspace) {
          let importWSData = { server: params.path, type }
          await SMap.importWorkspace(importWSData)
        }
        params.isImportWorkspace !== undefined &&
          delete params.isImportWorkspace

        let maps = await SMap.getMaps()
        await SMap.openMap(maps.length > 0 ? maps.length - 1 : -1)
        let mapInfo = await SMap.getMapInfo()

        Object.assign(params, { path: targetFilePath })
        payload = {
          templateInfo: params,
          mapInfo,
        }
      }
    }
    await dispatch({
      type: OPEN_TEMPLATE,
      payload: payload || {},
    })
    cb && cb({ copyResult, openResult })
  } catch (e) {
    cb && cb({ copyResult, openResult })
  }
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
    parentPath = await Utility.appendingHomeDirectory(
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
      if (path === map.template.path && map.template.symbols.length > 0) {
        cb && cb(params)
        return
      }
      let tempPath = path.substr(0, path.lastIndexOf('/') + 1)
      Utility.getPathListByFilter(tempPath, {
        extension: 'xml',
        type: 'file',
      }).then(xmlList => {
        if (xmlList && xmlList.length > 0 && !xmlList[0].isDirectory) {
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
    cb && cb(params)
  }
}

const initialState = fromJS({
  latestMap: [],
  map: {},
  maps: [],
  currentMap: {},
  template: {
    symbols: [],
    path: '',
    name: '',
  }, // 当前使用的模板
  templates: [], // 是用的模板列表，最近使用的在前面
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
      let newData = state.toJS().templates || []
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
      return state
        .setIn(
          ['template'],
          fromJS(Object.assign({}, payload.templateInfo, { symbols: [] })),
        )
        .setIn(['templates'], fromJS(newData))
        .setIn(['currentMap'], fromJS(payload.currentMap))
        .setIn(['workspace'], fromJS({ server: payload.templateInfo.path }))
    },
    [`${SET_TEMPLATE}`]: (state, { payload }) => {
      return state.setIn(['template'], fromJS(payload))
    },
    [`${GET_SYMBOL_TEMPLATES}`]: (state, { payload }) => {
      let newData = state.toJS().templates || []
      let template = state.toJS().template || {}
      for (let i = 0; i < newData.length; i++) {
        if (newData[i].templateInfo.path === payload.path) {
          Object.assign(newData[i].templateInfo, payload)
          Object.assign(template, payload)
          break
        }
      }
      return state
        .setIn(['templates'], fromJS(newData))
        .setIn(['template'], fromJS(template))
    },
    [REHYDRATE]: (state, { payload }) => {
      let data,
        payloadData = (payload && payload.map) || state.toJS()
      data = Object.assign({}, payloadData, {
        currentMap: {},
        template: {
          symbols: [],
          path: '',
          name: '',
        },
        maps: [],
        currentTemplateInfo: {},
        workspace: {},
      })
      return fromJS(data)
    },
  },
  initialState,
)
