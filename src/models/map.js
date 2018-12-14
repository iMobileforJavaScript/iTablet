import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SMap, Utility } from 'imobile_for_reactnative'
import { FileTools } from '../native'
import { ConstPath } from '../constants'
import fs from 'react-native-fs'
import xml2js from 'react-native-xml2js'
let parser = new xml2js.Parser()
// Constants
// --------------------------------------------------
export const SET_LATEST_MAP = 'SET_LATEST_MAP'
export const SET_MAP_VIEW = 'SET_MAP_VIEW'
export const SET_CURRENT_MAP = 'SET_CURRENT_MAP'
export const OPEN_TEMPLATE = 'OPEN_TEMPLATE'
export const SET_TEMPLATE = 'SET_TEMPLATE'
export const SET_CURRENT_TEMPLATE_INFO = 'SET_CURRENT_TEMPLATE_INFO'
export const GET_SYMBOL_TEMPLATES = 'GET_SYMBOL_TEMPLATES'

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
  currentMap: {},
  template: {},
  symbolTemplates: {
    symbols: [],
    path: '',
  },
  currentTemplateInfo: {},
  // workspace: {},
  // mapControl: {},
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
