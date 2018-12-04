import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'

export const ATTRIBUTE_SET = 'ATTRIBUTE_SET'

// Actions
// ---------------------------------.3-----------------
export const setAttribute = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: ATTRIBUTE_SET,
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
    [`${ATTRIBUTE_SET}`]: (state, { payload }) => {
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
    [REHYDRATE]: (state, { payload }) => {
      return payload && payload.user ? fromJS(payload.user) : state
    },
  },
  initialState,
)
