import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { SOnlineService } from 'imobile_for_reactnative'
import { FileTools } from '../native'
import { request } from '../utils'

// Constants
// --------------------------------------------------
export const SHARING = 'SHARING'

export const UPLOADING = 'UPLOADING'
export const UPDATEDOWNLIST = 'UPDATEDOWNLIST'
export const REMOVEITEMPFDOWNLIST = 'REMOVEITEMPFDOWNLIST'
export const ISERVER_LOGIN = 'ISERVER_LOGIN'
export const ISERVER_GET_DATASET_INFO = 'ISERVER_GET_DATASET_INFO'
// export const UPLOADED = 'UPLOADED'
// Actions
// ---------------------------------.3-----------------
export const setSharing = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SHARING,
    payload: params,
  })
  cb && cb()
}

export const uploading = (params = {}, cb = () => {}) => async dispatch => {
  if (
    !params ||
    !params.archivePaths ||
    !(params.archivePaths instanceof Array) ||
    !params.targetPath ||
    !params.name
  ) {
    return false
  }
  let zipResult = await FileTools.zipFiles(
    params.archivePaths,
    params.targetPath,
  )
  let uploadResult =
    zipResult &&
    (await SOnlineService.uploadFilebyType(
      params.targetPath,
      params.name,
      'UDB',
      {
        onProgress: async progress => {
          await dispatch({
            type: UPLOADING,
            payload: {
              progress,
              archivePaths: params.archivePaths,
              targetPath: params.targetPath,
              name: params.name,
            },
          })
          params.onProgress && params.onProgress(progress)
        },
        onResult: async result => {
          await dispatch({
            type: UPLOADING,
            payload: {
              archivePaths: params.archivePaths,
              targetPath: params.targetPath,
              name: params.name,
            },
          })
          FileTools.deleteFile(params.targetPath)
          params.onResult && params.onResult(result, params.name)
        },
      },
    ))
  await dispatch({
    type: UPLOADING,
    payload: params,
  })
  cb && cb(uploadResult)
}

export const updateDownList = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: UPDATEDOWNLIST,
    payload: params,
  })
  cb && cb()
}

export const removeItemOfDownList = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: REMOVEITEMPFDOWNLIST,
    payload: params,
  })
  cb && cb()
}

export const loginIServer = (params, cb = () => {}) => async dispatch => {
  let response = await request(
    'http://' +
      params.ip +
      ':' +
      params.port +
      '/iserver/services/security/login.json',
    'POST',
    {
      body: {
        userName: params.userName,
        password: params.password,
        rememberme: true,
      },
    },
  )

  cb && cb(response)

  await dispatch({
    type: ISERVER_LOGIN,
    payload: {
      ip: params.ip,
      port: params.port,
      userName: params.userName,
      password: params.password,
    },
  })

  return response
}

export const getDatasetInfoFromIServer = params => async () => {
  let url =
    'http://' +
    params.ip +
    ':' +
    params.port +
    '/iserver/services/datacatalog/rest/datacatalog/sharefile/' +
    params.dataset +
    '/fields.json'
  return request(url, 'GET', {
    headers: {
      Cookie: global.cookie,
    },
  })
}

const initialState = fromJS({
  share: [], // { module: '', name: '', progress: 0}
  upload: [], // { module: '', name: '', progress: 0}
  down: [],
  iServerData: {
    ip: '',
    port: '',
    userName: '',
    password: '',
  },
})

export default handleActions(
  {
    [`${SHARING}`]: (state, { payload }) => {
      let shareList = state.toJS().share
      let exist = false
      for (let i = 0; i < shareList.length; i++) {
        if (
          shareList[i].module === payload.module &&
          shareList[i].name === payload.name
        ) {
          if (payload.progress === undefined) {
            shareList.splice(i, 1)
          } else {
            shareList[i] = payload
          }
          exist = true
          break
        }
      }
      if (!exist) {
        shareList.unshift(payload)
      }
      return state.setIn(['share'], fromJS(shareList))
    },
    [`${UPLOADING}`]: (state, { payload }) => {
      let list = state.toJS().share
      let exist = false
      for (let i = 0; i < list.length; i++) {
        if (
          JSON.stringify(list[i].archivePaths) ===
            JSON.stringify(payload.archivePaths) &&
          list[i].name === payload.name
        ) {
          if (payload.progress === undefined) {
            list.splice(i, i + 1)
          } else {
            list[i] = payload
          }
          exist = true
          break
        }
      }
      if (!exist) {
        list.unshift(payload)
      }
      return state.setIn(['upload'], fromJS(list))
    },
    [`${UPDATEDOWNLIST}`]: (state, { payload }) => {
      let down = state.toJS().down
      if (payload.id) {
        if (down.length > 0) {
          let isItem = false
          for (let index = 0; index < down.length; index++) {
            const element = down[index]
            if (element.id === payload.id) {
              isItem = true
              if (payload.progress > element.progress || payload.downed) {
                down[index] = payload
              }
              break
            }
          }
          if (!isItem) {
            down.push(payload)
          }
        } else {
          down.push(payload)
        }
      }
      return state.setIn(['down'], fromJS(down))
    },
    [`${REMOVEITEMPFDOWNLIST}`]: (state, { payload }) => {
      let down = state.toJS().down
      if (payload.id) {
        for (let index = 0; index < down.length; index++) {
          const element = down[index]
          if (element.id === payload.id) {
            down.splice(index, 1)
            break
          }
        }
      }
      return state.setIn(['down'], fromJS(down))
    },
    [`${ISERVER_LOGIN}`]: (state, { payload }) => {
      let iServerData = state.toJS().iServerData
      if (payload) {
        for (let key in payload) {
          iServerData[key] = payload[key]
        }
      } else {
        iServerData = initialState.toJS().iServerData
      }
      return state.setIn(['iServerData'], fromJS(iServerData))
    },
    // [REHYDRATE]: () => {
    //   // return payload && payload.online ? fromJS(payload.online) : state
    //   return initialState
    // },
  },
  initialState,
)
