import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import RNFS from 'react-native-fs'
// Constants
// --------------------------------------------------
export const DOWN_SET = 'DOWN_SET'
export const DOWNLOADING_FILE = 'DOWNLOADING_FILE'
export const DOWNLOADED_FILE_DELETE = 'DOWNLOADED_FILE_DELETE'
// Actions
// ---------------------------------.3-----------------
export const setDownInformation = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: DOWN_SET,
    payload: params,
  })
  cb && cb()
}

export const downloadFile = (params = {}) => async dispatch => {
  params.progress = async res => {
    // if (params.progress) {
    //   params.progress(res)
    // }
    const data = {
      id: params.fileName,
      progress: res.progress,
      params: params,
    }
    await dispatch({
      type: DOWNLOADING_FILE,
      payload: data,
    })
  }
  let result = RNFS.downloadFile(params)
  return result.promise
}

export const deleteDownloadFile = (params = {}) => async dispatch => {
  await dispatch({
    type: DOWNLOADED_FILE_DELETE,
    payload: params,
  })
}

const initialState = fromJS({
  downList: [
    {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      index: 0,
    },
    {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      index: 1,
    },
    {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      index: 2,
    },
    {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      index: 3,
    },
  ],
  downloads: [],
})

export default handleActions(
  {
    [`${DOWN_SET}`]: (state, { payload }) => {
      let downList = state.toJS().downList
      if (payload.index) {
        let index = payload.index
        downList[index].index = payload.index

        if (payload.isShowProgressView) {
          downList[index].isShowProgressView = payload.isShowProgressView
        }
        if (payload.progress) {
          downList[index].progress = payload.progress
        }
        if (payload.disabled) {
          downList[index].disabled = payload.disabled
        }
      }
      return state.setIn(['downList'], fromJS(downList))
    },
    [`${DOWNLOADING_FILE}`]: (state, { payload }) => {
      let downloads = state.toJS().downloads
      if (payload.id) {
        if (downloads.length > 0) {
          let isItem = false
          for (let index = 0; index < downloads.length; index++) {
            const element = downloads[index]
            if (element.id === payload.id) {
              isItem = true
              downloads[index] = payload
              break
            }
          }
          if (!isItem) {
            downloads.push(payload)
          }
        } else {
          downloads.push(payload)
        }
      }
      return state.setIn(['downloads'], fromJS(downloads))
    },
    [`${DOWNLOADED_FILE_DELETE}`]: (state, { payload }) => {
      let downloads = state.toJS().downloads
      if (payload.id) {
        if (downloads.length > 0) {
          for (let index = 0; index < downloads.length; index++) {
            const element = downloads[index]
            if (element.id === payload.id) {
              downloads.splice(index, 1)
              break
            }
          }
        }
      }
      return state.setIn(['downloads'], fromJS(downloads))
    },
    // [REHYDRATE]: () => {
    //   // return payload && payload.down ? fromJS(payload.down) : state
    //   return initialState
    // },
  },
  initialState,
)
