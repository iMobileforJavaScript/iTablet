import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SMap } from 'imobile_for_reactnative'
// Constants
// --------------------------------------------------
export const SET_EDIT_LAYER = 'SET_EDIT_LAYER'
export const SET_SELECTION = 'SET_SELECTION'
export const SET_CURRENT_ATTRIBUTE = 'SET_CURRENT_ATTRIBUTE'
export const SET_CURRENT_LAYER = 'SET_CURRENT_LAYER'
export const SET_ANALYST_LAYER = 'SET_ANALYST_LAYER'
export const GET_LAYERS = 'GET_LAYERS'
export const GET_ATTRIBUTES = 'GET_ATTRIBUTES'
export const SET_ATTRIBUTES = 'SET_ATTRIBUTES'

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
    payload: params || {},
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
      isResetCurrentLayer: false,
    }
  } else {
    params = {
      type: params.type >= 0 ? params.type : -1,
      isResetCurrentLayer: params.isResetCurrentLayer || false,
    }
  }
  let layers = await SMap.getLayersByType(params.type)
  await dispatch({
    type: GET_LAYERS,
    payload:
      {
        layers,
        isResetCurrentLayer: params.isResetCurrentLayer,
      } || {},
  })
  cb && cb(layers)
}

export const getAttributes = (
  layerPath = '',
  cb = () => {},
) => async dispatch => {
  let attribute = await SMap.getLayerAttribute(layerPath)
  await dispatch({
    type: GET_ATTRIBUTES,
    payload: attribute || {},
  })
  cb && cb(attribute)
}

export const setAttributes = (data = [], cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_ATTRIBUTES,
    payload: data || {},
  })
  cb && cb(data)
}

const initialState = fromJS({
  layers: [],
  editLayer: {},
  selection: {},
  currentAttribute: {},
  attributes: {
    head: [],
    data: [],
  },
  currentLayer: {},
  analystLayer: {},
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
      let currentLayer = {}
      if (
        (JSON.stringify(state.toJS().currentLayer) === '{}' ||
          payload.isResetCurrentLayer) &&
        payload.layers.length > 0
      ) {
        currentLayer = payload.layers[0]
      }
      return state
        .setIn(['layers'], fromJS(payload.layers))
        .setIn(['currentLayer'], fromJS(currentLayer))
    },
    [`${GET_ATTRIBUTES}`]: (state, { payload }) => {
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
    [REHYDRATE]: () => {
      // return payload && payload.layers ? fromJS(payload.layers) : state
      return initialState
    },
  },
  initialState,
)
