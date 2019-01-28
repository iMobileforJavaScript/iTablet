import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SOnlineService } from 'imobile_for_reactnative'
import { FileTools } from '../native'

// Constants
// --------------------------------------------------
export const SHARING = 'SHARING'

export const UPLOADING = 'UPLOADING'
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
    (await SOnlineService.uploadFile(params.targetPath, params.name, {
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
        params.onResult && params.onResult(result)
      },
    }))
  await dispatch({
    type: UPLOADING,
    payload: params,
  })
  cb && cb(uploadResult)
}

const initialState = fromJS({
  share: [], // { module: '', name: '', progress: 0}
  upload: [], // { module: '', name: '', progress: 0}
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
            shareList.splice(i, i + 1)
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
    [REHYDRATE]: () => {
      // return payload && payload.user ? fromJS(payload.user) : state
      return initialState
    },
  },
  initialState,
)
