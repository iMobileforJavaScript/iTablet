import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SMap, WorkspaceType } from 'imobile_for_reactnative'
import { FileTools } from '../native'
import { ConstInfo } from '../constants'
import fs from 'react-native-fs'
import xml2js from 'react-native-xml2js'
let parser = new xml2js.Parser()
// Constants
// --------------------------------------------------
export const SET_TEMPLATE = 'SET_TEMPLATE'
export const SET_CURRENT_TEMPLATE_INFO = 'SET_CURRENT_TEMPLATE_INFO'
export const SET_CURRENT_TEMPLATE_SYMBOL_LIST =
  'SET_CURRENT_TEMPLATE_SYMBOL_LIST'
export const GET_SYMBOL_TEMPLATES = 'GET_SYMBOL_TEMPLATES'

// let isExporting = false

// Actions
// --------------------------------------------------
// 导入模版
// export const openTemplate = (params, cb = () => {}) => async (
//   dispatch,
//   getState,
// ) => {
//   let workspace = getState().map.toJS().workspace
//   let payload = {}
//   let copyResult = true,
//     openResult = false
//   try {
//     // 查看模板工作空间是否存在
//     // 拷贝模板文件
//     let userPath = params.path.substr(0, params.path.indexOf('/Data/Template'))
//     let fileName = params.path.substr(params.path.lastIndexOf('/') + 1)
//     // let alias = fileName.split('.')[0].toString()
//     let fileType = fileName.split('.')[1].toString()
//     let tempDirPath = params.path.substr(0, params.path.lastIndexOf('/'))
//     let tempParentDirName = tempDirPath.substr(tempDirPath.lastIndexOf('/') + 1)
//     let targetPath =
//       userPath + '/' + ConstPath.RelativePath.Workspace + tempParentDirName // 目标文件目录，不含文件名
//     let targetFilePath = targetPath + '/' + fileName
//
//     let type
//     switch (fileType) {
//       case 'SXW':
//         type = WorkspaceType.SXW
//         break
//       case 'SMW':
//         type = WorkspaceType.SMW
//         break
//       case 'SXWU':
//         type = WorkspaceType.SXWU
//         break
//       case 'SMWU':
//       default:
//         type = WorkspaceType.SMWU
//     }
//
//     if (workspace.server === targetFilePath) {
//       cb &&
//         cb({ copyResult, openResult, msg: ConstInfo.WORKSPACE_ALREADY_OPENED })
//     } else {
//       copyResult = await FileTools.copyFile(tempDirPath, targetPath)
//       openResult = false
//       if (copyResult) {
//         // 关闭所有地图
//         await SMap.closeMap()
//         await SMap.closeWorkspace()
//         let data = { server: targetFilePath, type }
//         openResult = await SMap.openWorkspace(data)
//         // 导入新的模板工作空间
//         if (params.isImportWorkspace) {
//           let importWSData = { server: params.path, type }
//           await SMap.importWorkspace(importWSData)
//         }
//         params.isImportWorkspace !== undefined &&
//           delete params.isImportWorkspace
//
//         // let maps = await SMap.getMaps()
//         // await SMap.openMap(maps.length > 0 ? maps.length - 1 : -1)
//         // let mapInfo = await SMap.getMapInfo()
//
//         Object.assign(params, { path: targetFilePath })
//         payload = params
//       }
//     }
//     await dispatch({
//       type: SET_TEMPLATE,
//       payload: payload || {},
//     })
//     cb && cb({ copyResult, openResult })
//     return { copyResult, openResult }
//   } catch (e) {
//     cb && cb({ copyResult, openResult })
//     return { copyResult, openResult }
//   }
// }
export const openTemplate = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  let workspace = getState().map.toJS().workspace
  let payload = {}
  let mapsInfo = []
  try {
    // 查看模板工作空间是否存在
    // 拷贝模板文件
    let paths = params.path.split('/')
    let fileName = paths[paths.length - 1]
    let fileType = fileName.split('.')[1].toString()

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

    if (workspace.server === params.path) {
      cb && cb({ mapsInfo, msg: ConstInfo.WORKSPACE_ALREADY_OPENED })
    } else {
      // 关闭所有地图
      await SMap.closeMap()
      let data = { server: params.path, type }
      mapsInfo = await SMap.importWorkspaceInfo(data, params.module)
      payload = params
    }
    await dispatch({
      type: SET_TEMPLATE,
      payload: payload || {},
    })
    cb && cb({ mapsInfo })
    return { mapsInfo }
  } catch (e) {
    cb && cb({ mapsInfo, msg: e })
    return { mapsInfo, msg: e }
  }
}

// 导入模版
export const importTemplate = (params, cb = () => {}) => async dispatch => {
  // 关闭所有地图
  await SMap.closeMap()
  // 导入工作空间
  let result = await SMap.importWorkspace(params)
  // // 默认打开第一幅地图
  // let mapList = (await SMap.getMaps(0)) || []
  // mapList.length > 0 && (await SMap.openMap(mapList.length - 1))
  // let mapInfo = await SMap.getMapInfo()
  // Object.assign(params, mapInfo)
  // let payload = {
  //   templateInfo: params,
  //   mapInfo,
  // }
  let payload = params
  await dispatch({
    type: SET_TEMPLATE,
    payload: payload || {},
  })
  cb && cb(result)
  return result
}

// 设置模版
export const setTemplate = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_TEMPLATE,
    payload: params || {},
  })
  cb && cb()
  return
}

// 设置当前选中的模板符号
export const setCurrentTemplateInfo = (
  params,
  cb = () => {},
) => async dispatch => {
  let data = {}
  if (params && params.field) {
    let tempInfo = params.field,
      fieldInfo = []
    tempInfo.forEach(item => {
      fieldInfo.push(item.$)
    })
    data = {
      ...params.$,
      layerPath: params.layerPath,
      field: fieldInfo,
      originData: params,
    }
  }
  await dispatch({
    type: SET_CURRENT_TEMPLATE_INFO,
    payload: data || {},
  })
  cb && cb(params)
  return
}

// 获取xml文件中的模板符号
export const getSymbolTemplates = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  try {
    let templateData = getState().template.toJS()
    let template = templateData.template
    let path = (params && params.path) || template.path
    if (
      path === templateData.template.path &&
      templateData.template.symbols.length > 0
    ) {
      cb && cb(params)
      return
    }
    if (path && path.substr(path.lastIndexOf('.') + 1) === 'xml') {
      fs.readFile(path).then(data => {
        parser.parseString(data, async (err, result) => {
          await dispatch({
            type: GET_SYMBOL_TEMPLATES,
            payload: {
              symbols: result.featureSymbol.template[0].feature || [],
              ...params,
            },
          })
          cb && cb(params)
        })
      })
    } else if (path) {
      let tempPath = path.substr(0, path.lastIndexOf('/') + 1)
      FileTools.getPathListByFilter(tempPath, {
        extension: 'xml',
        type: 'file',
      }).then(xmlList => {
        if (xmlList && xmlList.length > 0 && !xmlList[0].isDirectory) {
          let xmlInfo = xmlList[0]
          FileTools.appendingHomeDirectory(xmlInfo.path).then(xmlPath => {
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
    return
  } catch (e) {
    cb && cb(params)
    return
  }
}

// 设置当前选择模板符号列表
export const setCurrentTemplateList = (
  params,
  cb = () => {},
) => async dispatch => {
  try {
    let list = [{ ...params.$, field: params.fields[0].field }]
    let getData = function(data) {
      if (!data.feature || data.feature.length === 0) return
      for (let i = 0; i < data.feature.length; i++) {
        let item = data.feature[i]
        list.push({ ...item.$, field: item.fields[0].field })
        if (item.feature && item.feature.length > 0) {
          getData(item)
        }
      }
    }
    getData(params)

    await dispatch({
      type: SET_CURRENT_TEMPLATE_SYMBOL_LIST,
      payload: list || [],
    })
    return
  } catch (e) {
    cb && cb(params)
    return
  }
}

const initialState = fromJS({
  template: {
    symbols: [],
    path: '',
    name: '',
  }, // 当前使用的模板
  templates: [], // 是用的模板列表，最近使用的在前面
  currentTemplateInfo: {},
  currentTemplateList: [],
  latestTemplateSymbols: [],
})

export default handleActions(
  {
    [`${SET_CURRENT_TEMPLATE_INFO}`]: (state, { payload }) => {
      let newData = state.toJS().latestTemplateSymbols || []
      let isExist = false
      let originData = payload.originData
      for (let i = 0; i < newData.length; i++) {
        if (originData && newData[i].code === originData.code) {
          newData[i] = originData
          let temp = newData[0]
          newData[0] = newData[i]
          newData[i] = temp
          isExist = true
          break
        }
      }
      if (!isExist && originData) {
        newData.unshift(originData)
      }
      delete payload.originData
      return state
        .setIn(['currentTemplateInfo'], fromJS(payload))
        .setIn(['latestTemplateSymbols'], fromJS(newData))
    },
    [`${SET_CURRENT_TEMPLATE_SYMBOL_LIST}`]: (state, { payload }) => {
      return state.setIn(['currentTemplateList'], fromJS(payload))
    },
    [`${SET_TEMPLATE}`]: (state, { payload }) => {
      let newData = state.toJS().templates || []
      let isExist = false
      if (payload.path) {
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
      }
      if (!isExist && payload && payload.path) {
        newData.unshift(payload)
      }
      return state
        .setIn(
          ['template'],
          fromJS(Object.assign({}, payload, { symbols: [] })),
        )
        .setIn(['templates'], fromJS(newData))
      // .setIn(['currentMap'], fromJS(payload.currentMap))
      // .setIn(['workspace'], fromJS({ server: payload.templateInfo.path }))
    },
    // [`${SET_TEMPLATE}`]: (state, { payload }) => {
    //   return state.setIn(['template'], fromJS(payload))
    // },
    [`${GET_SYMBOL_TEMPLATES}`]: (state, { payload }) => {
      let newData = state.toJS().templates || []
      if (newData.length > 0) {
        for (let i = 0; i < newData.length; i++) {
          if (!newData[i].path || newData[i].path === payload.path) {
            Object.assign(newData[i], payload)
            // Object.assign(template, payload)
            break
          }
        }
      } else {
        newData.push(payload)
      }
      return state
        .setIn(['templates'], fromJS(newData))
        .setIn(['template'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      let data,
        payloadData = (payload && payload.map) || state.toJS()
      data = Object.assign({}, payloadData, {
        template: {
          symbols: [],
          path: '',
          name: '',
        },
        currentTemplateInfo: {},
      })
      return fromJS(data)
    },
  },
  initialState,
)
