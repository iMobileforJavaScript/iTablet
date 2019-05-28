import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { screen } from '../utils'
// Constants
// --------------------------------------------------
export const SHOW_SET = 'SHOW_SET'
// Actions
// ---------------------------------.3-----------------

//横竖屏切换，使用
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
    width: screen.getScreenWidth(),
    height: screen.getScreenHeight(),
  },
})

export default handleActions(
  {
    [`${SHOW_SET}`]: (state, { payload }) => {
      let device = state.toJS().device
      let deviceWidth = screen.getScreenWidth()
      let deviceHeight = screen.getScreenHeight()
      if (payload.orientation) {
        device.orientation = payload.orientation
        if (payload.orientation === 'LANDSCAPE') {
          device.width = deviceWidth > deviceHeight ? deviceWidth : deviceHeight
          device.height =
            deviceWidth < deviceHeight ? deviceWidth : deviceHeight
        } else {
          device.width = deviceWidth < deviceHeight ? deviceWidth : deviceHeight
          device.height =
            deviceWidth > deviceHeight ? deviceWidth : deviceHeight
        }
      }
      return state.setIn(['device'], fromJS(device))
    },
    // [REHYDRATE]: (state, { payload }) => {
    //   return payload && payload.device ? fromJS(payload.device) : state
    // },
  },
  initialState,
)
