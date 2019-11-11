import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const SET_COLLECTION_INFO = 'SET_COLLECTION_INFO'

// Actions
// --------------------------------------------------
export const setCollectionInfo = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_COLLECTION_INFO,
    payload: params || {},
  })
  cb && cb()
}

const initialState = fromJS({
  datasourceName: '',
  datasourceParentPath: '',
  datasourceServer: '',
  datasourceType: '',
})

export default handleActions(
  {
    [`${SET_COLLECTION_INFO}`]: (state, { payload }) => {
      return state
        .setIn(
          ['datasourceName'],
          fromJS((payload && payload.datasourceName) || ''),
        )
        .setIn(
          ['datasourceParentPath'],
          fromJS((payload && payload.datasourceParentPath) || ''),
        )
        .setIn(
          ['datasourceType'],
          fromJS((payload && payload.datasourceType) || ''),
        )
        .setIn(
          ['datasourceServer'],
          fromJS((payload && payload.datasourceServer) || ''),
        )
    },
    // [REHYDRATE]: () => {
    //   return initialState
    // },
  },
  initialState,
)
