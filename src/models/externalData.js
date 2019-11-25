import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const SET_IMPORT_ITEM = 'SET_IMPORT_ITEM'

// Actions
// --------------------------------------------------
export const setImportItem = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_IMPORT_ITEM,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  importItem: '', // 正在导入的数据
  importProgress: 0,
})

export default handleActions(
  {
    [`${SET_IMPORT_ITEM}`]: (state, { payload }) => {
      return state.setIn(['importItem'], fromJS(payload))
    },
  },
  initialState,
)
