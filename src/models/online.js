import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'

// Constants
// --------------------------------------------------
export const SHARING = 'SHARING'
// Actions
// ---------------------------------.3-----------------
export const setSharing = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SHARING,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  share: [],
  // {
  //   module: '',
  //   name: '',
  //   progress: 0,
  // }
})

export default handleActions(
  {
    [`${SHARING}`]: (state, { payload }) => {
      let shareList = state.toJS().share
      let exist = false
      for (let i = 0; i < shareList.length; i++) {
        if (
          shareList[i].module === shareList[i].module &&
          shareList[i].name === shareList[i].name
        ) {
          if (payload === undefined) {
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
    [REHYDRATE]: () => {
      // return payload && payload.user ? fromJS(payload.user) : state
      return initialState
    },
  },
  initialState,
)
