/**
 * 记录Android物理返回按钮的事件
 */
import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import NavigationService from '../containers/NavigationService'
// Constants
// --------------------------------------------------
export const BACK_ACTION_SET = 'BACK_ACTION_SET'
export const BACK_ACTION_REMOVE = 'BACK_ACTION_REMOVE'

// Actions
// --------------------------------------------------
export const setBackAction = (params = {}) => async (dispatch, getState) => {
  if (!params.key) {
    let nav = getState().nav.toJS()

    // 防止初始化时，nav为空
    if (!nav || !nav.routes) {
      nav = NavigationService.getTopLevelNavigator().state.nav
    }
    let current = nav.routes[nav.index]
    while (current.routes) {
      current = current.routes[current.index]
    }
    params.key = current.routeName
  }

  await dispatch({
    type: BACK_ACTION_SET,
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

const initialState = fromJS({})

export default handleActions(
  {
    [`${BACK_ACTION_SET}`]: (state, { payload }) => {
      return state.setIn([payload.key], fromJS(payload.action))
    },
    [`${BACK_ACTION_REMOVE}`]: (state, { payload }) => {
      return state.removeIn([payload.key])
    },
  },
  initialState,
)
