import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import MSGConstant from '../../src/containers/tabs/Friend/MsgConstant'
import { ModelUtils } from '../utils'
// Constants
// --------------------------------------------------
export const ADD_CHAT = 'ADD_CHAT'
export const EDIT_CHAT = 'EDIT_CHAT'
export const SET_CONSUMER = 'SET_CONSUMER'
// Actions
// ---------------------------------.3-----------------
export const addChat = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: ADD_CHAT,
    payload: params,
  })
  cb && cb()
}

export const editChat = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: EDIT_CHAT,
    payload: params,
  })
  cb && cb()
}

export const setConsumer = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_CONSUMER,
    payload: params,
  })
  cb && cb()
}
/**
 * [
 *    {
 *        userID,id
 *       chats:[
 *           {
 *             userInfo: {},
 *             history: [{msg, time}]
 *           }
 *           {
 *             userInfo: {},
 *             history: [{msg, time}]
 *           }
 *       ]
 *   }
 *   {
 *        userID,id
 *       chats:[
 *           {
 *             messageUsr: {},
 *             history: [{msg, time}]
 *           }
 *           {
 *             messageUsr: {},
 *             history: [{msg, time}]
 *           }
 *       ]
 *   }
 *
 * ]
 * @type {any}
 */
const initialState = fromJS({})

export default handleActions(
  {
    [`${ADD_CHAT}`]: (state, { payload }) => {
      let allChat = state.toJS() || {}

      // userId: this.props.user.currentUser.userId,
      //   messageUsr: messageObj.messageUsr,
      //   msg: messageObj.message,
      //   time: messageObj.time,

      let currentUser
      if (allChat.hasOwnProperty(payload.userId) === false) {
        allChat[payload.userId] = {}
      }
      currentUser = allChat[payload.userId]

      let chats

      if (payload.type === MSGConstant.MSG_ADD_FRIEND) {
        //inform
        if (currentUser.hasOwnProperty(1) === false) {
          currentUser[1] = { unReadMsg: 0, history: [] }
        }
        chats = currentUser[1]
      } else {
        //normal
        if (currentUser.hasOwnProperty(payload.talkId) === false) {
          //currentUser[payload.talkId] = []
          currentUser[payload.talkId] = { unReadMsg: 0, history: [] }
        }
        chats = currentUser[payload.talkId]
      }

      if (payload.operate === 'unRead') {
        chats.unReadMsg = 1 //设置未读
      } else if (payload.operate === 'read') {
        chats.unReadMsg = 0 //清除未读信息
      } else if (payload.operate === 'del') {
        delete currentUser[payload.talkId]
      } else if (payload.operate === 'add') {
        let pushMsg = {
          msgId: payload.msgId,
          type: payload.type,
          originMsg: payload.originMsg,
          text: payload.text,
          unReadMsg: payload.unReadMsg,
          system: payload.system,
        }
        chats.history.push(pushMsg)

        if (payload.unReadMsg) {
          chats.unReadMsg++
        }
      } else if (payload.operate === 'edit') {
        let message = chats.history[payload.msgId]
        Object.assign(message, payload.editItem)
      }

      // if (!payload.messageUsr) {
      //   chats.unReadMsg = 0 //清除未读信息
      // } else {
      //
      // }

      return fromJS(allChat)
    },
    [`${EDIT_CHAT}`]: (state, { payload }) => {
      let allChat = state.toJS() || {}
      // console.log(allChat)
      let message =
        allChat[payload.userId][payload.talkId].history[payload.msgId]
      Object.assign(message, payload.editItem)
      return fromJS(allChat)
    },
    [`${SET_CONSUMER}`]: (state, { payload }) => {
      let allChat = state.toJS() || {}
      // console.log(allChat)
      allChat.consumer = payload
      return fromJS(allChat)
    },
    [REHYDRATE]: (state, { payload }) => {
      let _data = ModelUtils.checkModel(state, payload && payload.chat)
      return _data
      // return payload && payload.chat ? fromJS(payload.chat) : state
    },
  },
  initialState,
)
