import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const DOWN_SET = 'DOWN_SET'
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
    // [REHYDRATE]: () => {
    //   // return payload && payload.down ? fromJS(payload.down) : state
    //   return initialState
    // },
  },
  initialState,
)
