import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { screen } from '../utils'
// Constants
// --------------------------------------------------
export const SHOW_SET = 'SHOW_SET'
// Actions
// ---------------------------------.3-----------------
export const setShow = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SHOW_SET,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  device: {
    orientation:
      screen.deviceHeight > screen.deviceWidth ? 'PORTRAIT' : 'LANDSCAPE',
    width: screen.deviceWidth,
    height: screen.deviceHeight,
  },
})

export default handleActions(
  {
    [`${SHOW_SET}`]: (state, { payload }) => {
      let device = state.toJS().device
      if (payload.orientation) {
        device.orientation = payload.orientation
        if (payload.orientation === 'LANDSCAPE') {
          device.width =
            screen.deviceWidth > screen.deviceHeight
              ? screen.deviceWidth
              : screen.deviceHeight
          device.height =
            screen.deviceWidth < screen.deviceHeight
              ? screen.deviceWidth
              : screen.deviceHeight
        } else {
          device.width =
            screen.deviceWidth < screen.deviceHeight
              ? screen.deviceWidth
              : screen.deviceHeight
          device.height =
            screen.deviceWidth > screen.deviceHeight
              ? screen.deviceWidth
              : screen.deviceHeight
        }
      }
      return state.setIn(['device'], fromJS(device))
    },
    [REHYDRATE]: () => {
      // return payload && payload.user ? fromJS(payload.user) : state
      return initialState
    },
  },
  initialState,
)
