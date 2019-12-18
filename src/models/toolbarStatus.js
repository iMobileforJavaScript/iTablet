import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const TOOLBAR_STATUS = 'TOOLBAR_STATUS'
// Actions
// ---------------------------------.3-----------------
export const setToolbarStatus = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: TOOLBAR_STATUS,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  canRedo: false,
  canUndo: false,
})

export default handleActions(
  {
    [`${TOOLBAR_STATUS}`]: (state, { payload }) => {
      let oldState = state.toJS()
      if (payload === null) {
        return initialState
      } else {
        return fromJS(Object.assign(oldState, payload))
      }
    },
  },
  initialState,
)
