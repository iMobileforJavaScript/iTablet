import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ModelUtils } from '../utils'
// Constants
// --------------------------------------------------
export const USER_SET = 'USER_SET'
export const USER_DELETE = 'USER_DELETE'

// Actions
// ---------------------------------.3-----------------
export const setUser = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: USER_SET,
    payload: params,
  })
  cb && cb()
}

export const deleteUser = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: USER_DELETE,
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
      return state
        .setIn(['currentUser'], fromJS(payload))
        .setIn(['users'], fromJS(users))
    },
    [`${USER_DELETE}`]: (state, { payload }) => {
      let payloadString = JSON.stringify(payload)
      let users = state.toJS().users
      for (let i = 0; i < users.length; i++) {
        if (JSON.stringify(users[i]) === payloadString) {
          users.splice(i, 1)
          break
        }
      }
      return state.setIn(['users'], fromJS(users))
    },
    [REHYDRATE]: (state, { payload }) => {
      let _data = ModelUtils.checkModel(state, payload && payload.user)
      // return payload && payload.user ? fromJS(payload.user) : state
      return _data
    },
  },
  initialState,
)
