import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const NAV_SET = 'NAV_SET'

// Actions
// --------------------------------------------------
export const setNav = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: NAV_SET,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({})

export default handleActions(
  {
    [`${NAV_SET}`]: (state, { payload }) => {
      return fromJS(payload)
    },
    // [REHYDRATE]: state => {
    //   // return payload && payload.nav ? fromJS(payload.nav) : state
    //   return state
    // },
  },
  initialState,
)
