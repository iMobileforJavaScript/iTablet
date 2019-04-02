import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const ADD_CHAT = 'ADD_CHAT'
export const EDIT_CHAT = 'EDIT_CHAT'
// Actions
// ---------------------------------.3-----------------
export const addChat = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: ADD_CHAT,
    payload: params,
  })
  cb && cb()
}

export const editChat =  (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: EDIT_CHAT,
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

      if (payload.type > 9) {
        if (currentUser.hasOwnProperty(1) === false) {
          currentUser[1] = { unReadMsg: 0, history: [] }
        }
        chats = currentUser[1]
      } else {
        if (currentUser.hasOwnProperty(payload.talkId) === false) {
          //currentUser[payload.talkId] = []
          currentUser[payload.talkId] = { unReadMsg: 0, history: [] }
        }
        chats = currentUser[payload.talkId]
      }

      if (!payload.messageUsr) {
        chats.unReadMsg = 0 //清除未读信息
      } else {
        let pushMsg = {
          msg: payload.message,
          time: payload.time,
          type: payload.type,
          name: payload.messageUsr.name,
          id: payload.messageUsr.id,
          unReadMsg: payload.unReadMsg,
          msgId: payload.msgId,
        }
        switch(payload.type){
          case 4:
            pushMsg.queueName = payload.queueName
            pushMsg.fileName= payload.fileName
            pushMsg.isReceived= payload.isReceived
          break
          default:
          break
        }
        chats.history.push(pushMsg)
        
        if (payload.unReadMsg) {
          chats.unReadMsg++
        }
      }

      return fromJS(allChat)
    },
    [REHYDRATE]: (state, { payload }) => {
      return payload && payload.chat ? fromJS(payload.chat) : state
    },
    [`${EDIT_CHAT}`]: (state, { payload }) => {
      let allChat = state.toJS() || {}
      // console.log(allChat)
      let message = allChat[payload.userId][payload.talkId].history[payload.msgId]
      Object.assign(message, payload.editItem)
      return fromJS(allChat)
    },
  },
  initialState,
)
