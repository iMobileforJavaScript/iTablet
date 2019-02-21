import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SMap, SScene } from 'imobile_for_reactnative'
import { Toast } from '../utils'
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
export const SET_LAYERS_ATTRIBUTES = 'SET_LAYERS_ATTRIBUTES'
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
export const getAttributes = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  try {
    // 当page为0时，则为刷新
    let path,
      page = 0,
      size = 20
    if (params) {
      if (!params.path && getState().layers.toJS().currentLayer.path) {
        path = getState().layers.toJS().currentLayer.path
      } else {
        path = params.path
      }
      if (params.page >= 0) {
        page = params.page
      }
      if (params.size >= 0) {
        size = params.size
      }
    }
    let attribute = await SMap.getLayerAttribute(path, page, size)

    let action = page === 0 ? GET_ATTRIBUTES_REFRESH : GET_ATTRIBUTES_LOAD
    await dispatch({
      type: action,
      payload: attribute || [],
    })
    cb && cb(attribute)
    return attribute
  } catch (e) {
    await dispatch({
      type: GET_ATTRIBUTES_FAILED,
    })
    cb && cb()
    return e
  }
}

// 获取选择集属性
export const getAttributesBySelection = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  try {
    // 当page为0时，则为刷新
    let path,
      page = 0,
      size = 20
    if (params) {
      if (!params.path && getState().layers.toJS().currentLayer.path) {
        path = getState().layers.toJS().currentLayer.path
      } else {
        path = params.path
      }
      if (params.page >= 0) {
        page = params.page
      }
      if (params.size >= 0) {
        size = params.size
      }
    }
    let attribute = await SMap.getLayerAttribute(path, page, size)

    let action = page === 0 ? GET_ATTRIBUTES_REFRESH : GET_ATTRIBUTES_LOAD
    await dispatch({
      type: action,
      payload: attribute || [],
    })
    cb && cb(attribute)
    return attribute
  } catch (e) {
    await dispatch({
      type: GET_ATTRIBUTES_FAILED,
    })
    cb && cb()
    return e
  }
}

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
  try {
    if (params && params.length > 0) {
      for (let i = 0; i < params.length; i++) {
        await SMap.setLayerFieldInfo(
          params[i].layerPath,
          params[i].fieldInfo,
          params[i].params,
        )
      }
    }

    // SMap.refreshMap()

    await dispatch({
      type: SET_LAYERS_ATTRIBUTES,
      payload: params || [],
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
    ablelist = [],
    terrainList = []
  for (let index = 0; index < result.length; index++) {
    const element = result[index]
    let item = { ...element, isShow: true }
    if (item.type === 'IMAGEFILE') {
      basemaplist.push(item)
    } else if (item.name === 'NodeAnimation') {
      ablelist.push(item)
    } else {
      layerlist.push(item)
    }
  }
  let data = [
    {
      title: '我的标注',
      data: ablelist,
      visible: true,
      index: 0,
    },
    {
      title: '我的图层',
      data: layerlist,
      visible: true,
      index: 1,
    },
    {
      title: '我的底图',
      data: basemaplist,
      visible: true,
      index: 2,
    },
    {
      title: '我的地形',
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
  modifiedAttributeHistory: [],
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
      let currentLayer = {},
        currentLayerIndex = payload.currentLayerIndex || -1
      if (currentLayerIndex >= 0 && payload.layers.length > currentLayerIndex) {
        currentLayer = payload.layers[0]
      }
      return state
        .setIn(['layers'], fromJS(payload.layers))
        .setIn(['currentLayer'], fromJS(currentLayer))
    },
    [`${GET_ATTRIBUTES_REFRESH}`]: (state, { payload }) => {
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
          if (item.fieldInfo.caption.toString().toLowerCase() === 'smid') {
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
    [`${GET_ATTRIBUTES_LOAD}`]: (state, { payload }) => {
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
          if (item.fieldInfo.caption.toString().toLowerCase() === 'smid') {
            tableHead.unshift(item.fieldInfo.caption)
          } else {
            tableHead.push(item.fieldInfo.caption)
          }
        })
      } else {
        tableHead = attributes.head
      }
      attributes.head = tableHead
      attributes.data = (attributes.data || []).concat(payload)
      return state
        .setIn(['attributes'], fromJS(attributes))
        .setIn(['currentAttribute'], fromJS(currentAttribute))
    },
    [`${GET_ATTRIBUTES_FAILED}`]: state => {
      let currentAttribute = {},
        attributes = state.toJS().attributes
      attributes.head = []
      attributes.data = []
      return state
        .setIn(['attributes'], fromJS(attributes))
        .setIn(['currentAttribute'], fromJS(currentAttribute))
    },
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
        Toast.show('当前图层为 ' + currentLayer3d.name)
      }
      return state.setIn(['currentLayer3d'], fromJS(currentLayer3d))
    },
    [`${SET_LAYERS_ATTRIBUTES}`]: state => {
      let modifiedAttributeHistory = state.toJS().modifiedAttributeHistory

      return state.setIn(
        ['modifiedAttributeHistory'],
        fromJS(modifiedAttributeHistory),
      )
    },
    [REHYDRATE]: () => {
      // return payload && payload.layers ? fromJS(payload.layers) : state
      return initialState
    },
  },
  initialState,
)
