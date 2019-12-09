import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { SMap, SScene } from 'imobile_for_reactnative'
import { Toast, dataUtil } from '../utils'
import { ConstInfo } from '../constants'
import { getLanguage } from '../language/index'
// Constants
// --------------------------------------------------
export const SET_EDIT_LAYER = 'SET_EDIT_LAYER'
export const SET_SELECTION = 'SET_SELECTION'
export const SET_CURRENT_ATTRIBUTE = 'SET_CURRENT_ATTRIBUTE'
export const SET_CURRENT_LAYER = 'SET_CURRENT_LAYER'
export const SET_ANALYST_LAYER = 'SET_ANALYST_LAYER'
export const GET_LAYERS = 'GET_LAYERS'
export const GET_ATTRIBUTES_REFRESH = 'GET_ATTRIBUTES_REFRESH'
export const GET_ATTRIBUTES_LOAD = 'GET_ATTRIBUTES_LOAD'
export const GET_ATTRIBUTES_FAILED = 'GET_ATTRIBUTES_FAILED'
export const SET_ATTRIBUTES = 'SET_ATTRIBUTES'
export const ADD_ATTRIBUTE_HISTORY = 'ADD_ATTRIBUTE_HISTORY'
export const SET_ATTRIBUTE_HISTORY = 'SET_ATTRIBUTE_HISTORY'
export const CLEAR_ATTRIBUTE_HISTORY = 'CLEAR_ATTRIBUTE_HISTORY'
export const GET_LAYER3DLIST = 'GET_LAYER3DLIST'
export const SET_CURRENTLAYER3D = 'SET_CURRENTLAYER3D'
// Actions
// --------------------------------------------------

export const setEditLayer = (params, cb = () => {}) => async dispatch => {
  if (params && params.path) {
    await SMap.setLayerEditable(params.path, true)
  }
  await dispatch({
    type: SET_EDIT_LAYER,
    payload: params || {},
  })
  cb && cb()
}

export const setSelection = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_SELECTION,
    payload: params || [],
  })
  cb && cb()
}

export const setCurrentAttribute = (
  params,
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: SET_CURRENT_ATTRIBUTE,
    payload: params || {},
  })
  cb && cb()
}

export const setCurrentLayer = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_CURRENT_LAYER,
    payload: params || {},
  })
  cb && cb()
}

export const setAnalystLayer = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_ANALYST_LAYER,
    payload: params || {},
  })
  cb && cb()
}

export const getLayers = (params = -1, cb = () => {}) => async dispatch => {
  if (typeof params === 'number') {
    params = {
      type: params,
      currentLayerIndex: -1,
    }
  } else {
    params = {
      type: params.type >= 0 ? params.type : -1,
      currentLayerIndex: params.currentLayerIndex || -1,
    }
  }
  let layers = await SMap.getLayersByType(params.type)
  await dispatch({
    type: GET_LAYERS,
    payload:
      {
        layers,
        currentLayerIndex: params.currentLayerIndex,
      } || {},
  })
  cb && cb(layers)
  return layers
}

// 获取图层属性
// export const getAttributes = (params, cb = () => {}) => async (
//   dispatch,
//   getState,
// ) => {
//   try {
//     // 当page为0时，则为刷新
//     let path,
//       page = 0,
//       size = 20
//     if (params) {
//       if (!params.path && getState().layers.toJS().currentLayer.path) {
//         path = getState().layers.toJS().currentLayer.path
//       } else {
//         path = params.path
//       }
//       if (params.page >= 0) {
//         page = params.page
//       }
//       if (params.size >= 0) {
//         size = params.size
//       }
//     }
//     let attribute = await SMap.getLayerAttribute(path, page, size)
//
//     let action = page === 0 ? GET_ATTRIBUTES_REFRESH : GET_ATTRIBUTES_LOAD
//     await dispatch({
//       type: action,
//       payload: attribute || [],
//     })
//     cb && cb(attribute)
//     return attribute
//   } catch (e) {
//     await dispatch({
//       type: GET_ATTRIBUTES_FAILED,
//     })
//     cb && cb()
//     return e
//   }
// }

export const setAttributes = (data = [], cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_ATTRIBUTES,
    payload: data || {},
  })
  cb && cb(data)
}

/**
 * 修改对象属性，并记录到历史列表中
 * @param params
 *  {
 *    mapName:   String 地图名称,
 *    layerPath: String 图层路径,
 *    fieldInfo: Array  修改的属性，
 *    params:    Object 查询信息,
 *      {
           index: int,      // 当前对象所在记录集中的位置
           filter: string,  // 过滤条件
           cursorType: int, // 2: DYNAMIC, 3: STATIC
         }
 *  }
 * @param cb
 */
export const setLayerAttributes = (
  params = [],
  cb = () => {},
) => async dispatch => {
  let bRes = false
  try {
    if (params && params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        bRes = await SMap.setLayerFieldInfo(
          params[i].layerPath,
          params[i].fieldInfo,
          params[i].params,
        )
      }
    }

    await dispatch({
      type: ADD_ATTRIBUTE_HISTORY,
      payload: params || [],
    })
    cb && cb(bRes)
    return bRes
  } catch (e) {
    return false
  }
}

export const setAttributeHistory = (params = {}, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  if (!params.type) {
    params.type = 'undo'
  }

  let _type

  switch (params.type) {
    case 'undo':
      _type = 'UNDO'
      break
    case 'redo':
      _type = 'REDO'
      break
    case 'revert':
      _type = 'RECOVER'
      break
  }
  try {
    // if (!params || !params.mapName || !params.layerPath)
    if (!params || !params.layerPath)
      return {
        msg: getLanguage(global.language).Prompt[`${_type}_FAILED`],
        result: false,
      }
    let attributesHistory = getState().layers.toJS().attributesHistory
    let layerHistory = {}

    if (attributesHistory.length === 0)
      return {
        msg: getLanguage(global.language).Prompt[`${_type}_FAILED`],
        result: false,
      }

    for (let i = 0; i < attributesHistory.length; i++) {
      if (attributesHistory[i].mapName === params.mapName) {
        let layerExist = false
        for (let j = 0; j < attributesHistory[i].layers.length; j++) {
          if (attributesHistory[i].layers[j].layerPath === params.layerPath) {
            layerExist = true
            layerHistory = attributesHistory[i].layers[j]
            break
          }
        }
        if (layerExist) break
      }
    }

    if (!layerHistory.layerPath)
      return { msg: ConstInfo[`${_type}_UNABLE`], result: false }

    let currentHistory = [],
      currentIndex = layerHistory.currentIndex

    switch (params.type) {
      case 'undo':
        if (layerHistory.currentIndex < layerHistory.history.length - 1) {
          currentIndex = layerHistory.currentIndex + 1

          // 去掉还原记录, 还原记录在history中是两个连续数组，前一个为还原值，后一个为还原前的值
          if (
            layerHistory.history[layerHistory.currentIndex] instanceof Array &&
            layerHistory.history[currentIndex] instanceof Array
          ) {
            currentHistory =
              layerHistory.history[currentIndex] instanceof Array
                ? layerHistory.history[currentIndex]
                : [layerHistory.history[currentIndex]]
            layerHistory.history.splice(layerHistory.currentIndex, 2)
            currentIndex = layerHistory.currentIndex
          } else if (
            !(
              layerHistory.history[layerHistory.currentIndex] instanceof Array
            ) &&
            layerHistory.history[currentIndex] instanceof Array
          ) {
            currentHistory =
              layerHistory.history[currentIndex + 1] instanceof Array
                ? layerHistory.history[currentIndex + 1]
                : [layerHistory.history[currentIndex + 1]]
            layerHistory.history.splice(currentIndex, 2)
            currentIndex = layerHistory.currentIndex + 1
          } else {
            // 在undo中，当前对象 和 之前的对象是同一个，则可以直接undo
            // 若当前对象和上一个不是一个对象，则表明该对象为当前属性表中显示的对象，则找下一个对象
            currentHistory = [layerHistory.history[currentIndex]]
            if (currentIndex > 0) {
              if (
                layerHistory.history[currentIndex - 1].fieldInfo[0].smID !==
                  currentHistory[0].fieldInfo[0].smID ||
                layerHistory.history[currentIndex - 1].fieldInfo[0].name !==
                  currentHistory[0].fieldInfo[0].name
              ) {
                currentIndex++
                currentHistory = [layerHistory.history[currentIndex]]
              }
            }
          }

          // currentHistory =
          //   layerHistory.history[currentIndex] instanceof Array
          //     ? layerHistory.history[currentIndex]
          //     : [layerHistory.history[currentIndex]]
        } else {
          return { msg: ConstInfo[`${_type}_UNABLE`], result: false }
        }
        break
      case 'redo':
        if (layerHistory.currentIndex > 0) {
          currentIndex = layerHistory.currentIndex - 1

          if (layerHistory.history[currentIndex] instanceof Array) {
            currentHistory = layerHistory.history[currentIndex]
          } else {
            // redo，当前对象 和 上一个对象是同一个，则可以直接undo
            // 若当前对象和上一个不是一个对象，则表明该对象为当前属性表中显示的对象，则找下一个对象
            currentHistory = [layerHistory.history[currentIndex]]
            if (
              currentIndex < layerHistory.history.length - 1 &&
              currentIndex > 0
            ) {
              if (
                layerHistory.history[currentIndex + 1].fieldInfo[0].smID !==
                  currentHistory[0].fieldInfo[0].smID ||
                layerHistory.history[currentIndex + 1].fieldInfo[0].name !==
                  currentHistory[0].fieldInfo[0].name
              ) {
                currentIndex--
                currentHistory = [layerHistory.history[currentIndex]]
              }
            }
          }

          currentHistory =
            layerHistory.history[currentIndex] instanceof Array
              ? layerHistory.history[currentIndex]
              : [layerHistory.history[currentIndex]]
        } else {
          return { msg: ConstInfo[`${_type}_UNABLE`], result: false }
        }
        break
      case 'revert':
        // 如果最新的历史记录是数组，那么就是还原的操作
        if (!(layerHistory.history[0] instanceof Array)) {
          // 还原到最初状态，并把本次操作记录到新的历史记录中
          currentIndex = 0
          let latestHistory = [] // 存放还原前最新数据

          for (let x = 0; x < layerHistory.history.length; x++) {
            let exist = false

            for (let y = 0; y < currentHistory.length; y++) {
              if (
                JSON.stringify(currentHistory[y].params) ===
                  JSON.stringify(layerHistory.history[x].params) &&
                currentHistory[y].fieldInfo[0].name ===
                  layerHistory.history[x].fieldInfo[0].name
              ) {
                exist = true
                if (
                  currentHistory[y].fieldInfo[0].value ===
                  layerHistory.history[x].fieldInfo[0].value
                ) {
                  continue
                }
                currentHistory[y] = layerHistory.history[x]
              }
            }
            if (currentHistory.length === 0 || !exist) {
              currentHistory.push(layerHistory.history[x])
              !exist && latestHistory.push(layerHistory.history[x])
            }
          }
          layerHistory.history.unshift(latestHistory) // 存放还原前最新数据
          layerHistory.history.unshift(currentHistory) // 存放更改前数据
        } else {
          return { msg: ConstInfo[`${_type}_UNABLE`], result: false }
        }
    }

    if (currentHistory && currentHistory && currentHistory.length > 0) {
      for (let i = 0; i < currentHistory.length; i++) {
        await SMap.setLayerFieldInfo(
          layerHistory.layerPath,
          currentHistory[i].fieldInfo,
          currentHistory[i].params,
        )
      }
    }

    layerHistory.currentIndex = currentIndex

    await dispatch({
      type: SET_ATTRIBUTE_HISTORY,
      payload: attributesHistory || [],
    })
    cb &&
      cb({
        msg: '成功',
        result: true,
        data: currentHistory,
      })
    return {
      msg: '成功',
      result: true,
      data: currentHistory,
    }
  } catch (e) {
    return {
      msg: getLanguage(global.language).Prompt[`${_type}_FAILED`],
      result: false,
    }
  }
}

export const clearAttributeHistory = (cb = () => {}) => async dispatch => {
  try {
    await dispatch({
      type: CLEAR_ATTRIBUTE_HISTORY,
    })
    cb && cb(true)
    return true
  } catch (e) {
    return false
  }
}

export const setCurrentLayer3d = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: SET_CURRENTLAYER3D,
    payload: params || {},
  })
  cb && cb()
}

export const refreshLayer3dList = (cb = () => {}) => async dispatch => {
  let result = await SScene.getLayerList()
  let basemaplist = [],
    layerlist = [],
    lablelist = [],
    terrainList = []
  for (let index = 0; index < result.length; index++) {
    const element = result[index]
    let item = { ...element, isShow: true }
    if (item.type === 'IMAGEFILE') {
      basemaplist.push(item)
    } else if (item.name === 'NodeAnimation') {
      lablelist.push(item)
    } else {
      layerlist.push(item)
    }
  }

  let Terrains = await SScene.getTerrainLayerList()
  for (let index = 0; index < Terrains.length; index++) {
    const element = Terrains[index]
    let item = { ...element, isShow: true }
    terrainList.push(item)
  }

  //map = @{@"name":name,@"visible": @(visible),@"selectable": @(0),@"basemap":@(0),@"type":@"Terrain"};
  //默认显示个不存在地形
  if (terrainList.length === 0) {
    terrainList.push({
      name: 'cache',
      visible: true,
      selectable: false,
      type: 'Terrain',
      basemap: false,
      isShow: true,
    })
  }

  if (basemaplist.length === 0) {
    basemaplist.push({
      name: 'cache',
      visible: true,
      selectable: false,
      type: 'IMAGEFILE',
      basemap: true,
      isShow: true,
    })
  }

  let data = [
    {
      title: getLanguage(global.language).Map_Layer.PLOTS,
      //'我的标注',
      data: lablelist,
      visible: true,
      index: 0,
    },
    {
      title: getLanguage(global.language).Map_Layer.LAYERS,
      //'我的图层',
      data: layerlist,
      visible: true,
      index: 1,
    },
    {
      title: getLanguage(global.language).Map_Layer.BASEMAP,
      //'我的底图',
      data: basemaplist,
      visible: true,
      index: 2,
    },
    {
      title: getLanguage(global.language).Map_Layer.MY_TERRAIN,
      //'我的地形',
      data: terrainList,
      visible: true,
      index: 3,
    },
  ]
  await dispatch({
    type: GET_LAYER3DLIST,
    payload: data || {},
  })
  cb && cb(data)
}

const initialState = fromJS({
  layers: [],
  editLayer: {},
  /**
   * selection: 选择集中的信息。包含图层信息和对象IDs
   * [
       {
         layerInfo: {},
         ids: [],
       }
   * ]
   */
  selection: [],
  /** 当前选中的对象 **/
  currentAttribute: {},
  attributes: {
    head: [],
    data: [],
  },
  /**
   * selectionAttributes: 选择集中对象的属性，可包含多个图层的属性
   * [
       {
         layerPath: '',
         head: [],
         data: [],
       }
   * ]
   */
  selectionAttributes: [],
  currentLayer: {},
  analystLayer: {},
  layer3dList: [],
  currentLayer3d: {},
  /**
   * attributesHistory: 属性修改历史记录，且下标越小，记录越新
   * [
   *    {
   *      mapName: '',
   *      currentIndex: 0,
   *      layers: [{
   *        layerPath: '',
   *        currentIndex: 0,
   *        history: [
   *          {
   *            fieldInfo: [],
   *            params: {}, // 查询参数
   *          }
   *        ],
   *      }],
   *    }
   * ]
   */
  attributesHistory: [],
  attributesHistoryKey: [], // 储存attributesHistory中对象的key，相同对象只有一个
})

export default handleActions(
  {
    [`${SET_EDIT_LAYER}`]: (state, { payload }) => {
      return state.setIn(['editLayer'], fromJS(payload))
    },
    [`${SET_SELECTION}`]: (state, { payload }) => {
      return state.setIn(['selection'], fromJS(payload))
    },
    [`${SET_CURRENT_ATTRIBUTE}`]: (state, { payload }) => {
      return state.setIn(['currentAttribute'], fromJS(payload))
    },
    [`${SET_CURRENT_LAYER}`]: (state, { payload }) => {
      return state.setIn(['currentLayer'], fromJS(payload))
    },
    [`${SET_ANALYST_LAYER}`]: (state, { payload }) => {
      return state.setIn(['analystLayer'], fromJS(payload))
    },
    [`${GET_LAYERS}`]: (state, { payload }) => {
      let currentLayer,
        currentLayerIndex = payload.currentLayerIndex || -1
      if (currentLayerIndex >= 0 && payload.layers.length > currentLayerIndex) {
        currentLayer = payload.layers[currentLayerIndex]
      }
      if (currentLayer) {
        state.setIn(['currentLayer'], fromJS(currentLayer))
      }
      return state.setIn(['layers'], fromJS(payload.layers))
    },
    // [`${GET_ATTRIBUTES_REFRESH}`]: (state, { payload }) => {
    //   let currentAttribute = {},
    //     attributes = state.toJS().attributes
    //   if (
    //     JSON.stringify(state.toJS().currentAttribute) === '{}' &&
    //     payload.length > 0
    //   ) {
    //     currentAttribute = payload[0]
    //   }
    //   let tableHead = []
    //   if (payload && payload.length > 0) {
    //     payload[0].forEach(item => {
    //       if (item.fieldInfo.caption.toString().toLowerCase() === 'smid') {
    //         tableHead.unshift(item.fieldInfo.caption)
    //       } else {
    //         tableHead.push(item.fieldInfo.caption)
    //       }
    //     })
    //   }
    //   attributes.head = tableHead
    //   attributes.data = payload
    //   return state
    //     .setIn(['attributes'], fromJS(attributes))
    //     .setIn(['currentAttribute'], fromJS(currentAttribute))
    // },
    // [`${GET_ATTRIBUTES_LOAD}`]: (state, { payload }) => {
    //   let currentAttribute = {},
    //     attributes = state.toJS().attributes
    //   if (
    //     JSON.stringify(state.toJS().currentAttribute) === '{}' &&
    //     payload.length > 0
    //   ) {
    //     currentAttribute = payload[0]
    //   }
    //   let tableHead = []
    //   if (payload && payload.length > 0) {
    //     payload[0].forEach(item => {
    //       if (item.fieldInfo.caption.toString().toLowerCase() === 'smid') {
    //         tableHead.unshift(item.fieldInfo.caption)
    //       } else {
    //         tableHead.push(item.fieldInfo.caption)
    //       }
    //     })
    //   } else {
    //     tableHead = attributes.head
    //   }
    //   attributes.head = tableHead
    //   attributes.data = (attributes.data || []).concat(payload)
    //   return state
    //     .setIn(['attributes'], fromJS(attributes))
    //     .setIn(['currentAttribute'], fromJS(currentAttribute))
    // },
    // [`${GET_ATTRIBUTES_FAILED}`]: state => {
    //   let currentAttribute = {},
    //     attributes = state.toJS().attributes
    //   attributes.head = []
    //   attributes.data = []
    //   return state
    //     .setIn(['attributes'], fromJS(attributes))
    //     .setIn(['currentAttribute'], fromJS(currentAttribute))
    // },
    [`${SET_ATTRIBUTES}`]: (state, { payload }) => {
      let currentAttribute = {},
        attributes = state.toJS().attributes
      if (
        JSON.stringify(state.toJS().currentAttribute) === '{}' &&
        payload.length > 0
      ) {
        currentAttribute = payload[0]
      }
      let tableHead = []
      if (payload && payload.length > 0) {
        payload[0].forEach(item => {
          if (item.fieldInfo.caption.toString().toLowerCase() === 'id') {
            tableHead.unshift(item.fieldInfo.caption)
          } else {
            tableHead.push(item.fieldInfo.caption)
          }
        })
      }
      attributes.head = tableHead
      attributes.data = payload
      return state
        .setIn(['attributes'], fromJS(attributes))
        .setIn(['currentAttribute'], fromJS(currentAttribute))
    },
    [`${GET_LAYER3DLIST}`]: (state, { payload }) => {
      let layer3dList = state.toJS().layer3dList
      if (payload.length > 0) {
        layer3dList = payload
      }
      return state.setIn(['layer3dList'], fromJS(layer3dList))
    },
    [`${SET_CURRENTLAYER3D}`]: (state, { payload }) => {
      let currentLayer3d = state.toJS().currentLayer3d
      if (JSON.stringify(payload) !== '{}') {
        currentLayer3d = payload
        Toast.show(
          //'当前图层为 '
          getLanguage(global.language).Prompt.THE_CURRENT_LAYER +
            '  ' +
            currentLayer3d.name,
        )
      }
      return state.setIn(['currentLayer3d'], fromJS(currentLayer3d))
    },
    [`${ADD_ATTRIBUTE_HISTORY}`]: (state, { payload }) => {
      let attributesHistory = state.toJS().attributesHistory
      let attributesHistoryKey = state.toJS().attributesHistoryKey

      // let checkIsIncludeKey = function(data) {
      //   for (let i = 0; i < attributesHistoryKey.length; i++) {
      //     if (
      //       attributesHistoryKey[i].filter === data.params.filter &&
      //       attributesHistoryKey[i].name === data.fieldInfo[0].name
      //     ) {
      //       return true
      //     }
      //   }
      //   return false
      // }

      payload.forEach(item => {
        item.params = item.params || {}
        let mapExist = false // 判断历史记录是否包含该地图
        for (let i = 0; i < attributesHistory.length; i++) {
          if (attributesHistory[i].mapName === item.mapName) {
            mapExist = true
            let layers = attributesHistory[i].layers
            let layerExist = false // 判断历史记录是否包含该地图中的图层
            for (let j = 0; j < layers.length; j++) {
              if (layers[j].layerPath === item.layerPath) {
                layerExist = true
                // 添加新的记录时，如果当前历史记录指向的位置不是最新的（0）记录
                // 则把0 到 currentIndex的记录删除，然后向0添加新的记录
                if (layers[j].currentIndex > 0) {
                  layers[j].history.splice(0, layers[j].currentIndex)
                  layers[j].currentIndex = 0
                }
                // if (!checkIsIncludeKey(item)) {
                //   layers[j].history.unshift({
                //     fieldInfo: item.prevData,
                //     params: item.params,
                //   })
                //   attributesHistoryKey.unshift({
                //     name: item.fieldInfo[0].name,
                //     filter: item.params.filter,
                //   })
                // }

                // 若修改的对象和之前最新的对象不是一个对象，则把被修改对象之前的值加入到历史记录中
                if (
                  layers[j].history[0].params.filter !== item.params.filter || // 判断是否是同一条数据
                  layers[j].history[0].fieldInfo.length !==
                    item.fieldInfo.length ||
                  layers[j].history[0].fieldInfo[0].name !==
                    item.fieldInfo[0].name //判断是否是同一条数据不同属性
                ) {
                  layers[j].history.unshift({
                    fieldInfo: item.prevData,
                    params: item.params,
                  })
                }

                layers[j].history.unshift({
                  fieldInfo: item.fieldInfo,
                  params: item.params,
                })
                // 最新被修改的图层放到第一位
                layers = dataUtil.swapArray(layers, 0, j)
                break
              }
            }
            if (!layerExist) {
              // 若新建 地图-图层-历史记录，且包含prevData，则prevData作为初始数据，支持还原功能
              layers.unshift({
                currentIndex: 0,
                layerPath: item.layerPath,
                history: [
                  {
                    fieldInfo: item.fieldInfo,
                    params: item.params,
                  },
                  {
                    fieldInfo: item.prevData,
                    params: item.params,
                  },
                ],
              })
              attributesHistoryKey.push({
                name: item.fieldInfo[0].name,
                filter: item.params.filter,
              })
              // layers.unshift({
              //   currentIndex: 0,
              //   layerPath: item.layerPath,
              //   history: [{
              //     fieldInfo: item.prevData,
              //     params: item.params,
              //   }],
              // })
            }
            attributesHistory[i].layers = layers

            // 最新被修改的地图放到第一位
            attributesHistory = dataUtil.swapArray(attributesHistory, 0, i)
            if (layerExist) break
          }
        }

        if (!mapExist) {
          let history = [
            {
              fieldInfo: item.fieldInfo,
              params: item.params,
            },
          ]
          // 若新建 地图-图层-历史记录，且包含prevData，则prevData作为初始数据，支持还原功能
          if (item.prevData) {
            history.push({
              fieldInfo: item.prevData,
              params: item.params,
            })
          }

          attributesHistory.unshift({
            mapName: item.mapName,
            layers: [
              {
                currentIndex: 0,
                layerPath: item.layerPath,
                history,
              },
            ],
          })

          attributesHistoryKey.push({
            name: item.fieldInfo[0].name,
            filter: item.params.filter,
          })
        }
      })

      return state
        .setIn(['attributesHistory'], fromJS(attributesHistory))
        .setIn(['attributesHistoryKey'], fromJS(attributesHistoryKey))
    },
    [`${SET_ATTRIBUTE_HISTORY}`]: (state, { payload }) => {
      return state.setIn(['attributesHistory'], fromJS(payload))
    },
    [`${CLEAR_ATTRIBUTE_HISTORY}`]: state => {
      return state
        .setIn(['attributesHistory'], fromJS([]))
        .setIn(['attributesHistoryKey'], fromJS([]))
    },
    // [REHYDRATE]: () => {
    //   // return payload && payload.layers ? fromJS(payload.layers) : state
    //   return initialState
    // },
  },
  initialState,
)
