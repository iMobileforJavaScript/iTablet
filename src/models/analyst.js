/**
 * 记录Android物理返回按钮的事件
 */
import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const SET_ANALYST_PARAMS = 'SET_ANALYST_PARAMS'
export const BACK_ACTION_REMOVE = 'BACK_ACTION_REMOVE'

// Actions
// --------------------------------------------------
export const setAnalystParams = (params = {}) => async dispatch => {
  return dispatch({
    type: SET_ANALYST_PARAMS,
    payload: params,
  })
}

export const removeBackAction = (params = {}) => async (dispatch, getState) => {
  if (!params.key) {
    let nav = getState().nav.toJS()
    let current = nav.routes[nav.index]
    while (current.routes) {
      current = current.routes[current.index]
    }
    params.key = current.routeName
  }

  await dispatch({
    type: BACK_ACTION_REMOVE,
    payload: params,
  })
}

const initialState = fromJS({
  params: null,
})

export default handleActions(
  {
    [`${SET_ANALYST_PARAMS}`]: (state, { payload }) => {
      return state.setIn(['params'], fromJS(payload))
    },
  },
  initialState,
)
