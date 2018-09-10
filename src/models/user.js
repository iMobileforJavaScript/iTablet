import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const USER_SET = 'USER_SET'

// Actions
// --------------------------------------------------
export const setUser = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: USER_SET,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  currentUser: {},
  users: [],
})

export default handleActions(
  {
    [`${USER_SET}`]: (state, { payload }) => {
      let users = state.toJS().users
      let userExist = false
      for (let i = 0; i < users.length; i++) {
        if (users[i].userName === payload.userName) {
          users[i] = payload
          userExist = true
        }
      }
      if (!userExist && payload.userName) {
        users.push(payload)
      }
      return state.setIn(['currentUser'], fromJS(payload))
        .setIn(['users'], fromJS(users))
    },
    [REHYDRATE]: (state, { payload }) => {
      return payload && payload.user ? fromJS(payload.user) : state
    },
  },
  initialState,
)
