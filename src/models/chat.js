import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const ADD_CHAT = 'ADD_CHAT'

// Actions
// ---------------------------------.3-----------------
export const addChat = (params = {}, cb = () => {}) => async dispatch => {
  await dispatch({
    type: ADD_CHAT,
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
      if (currentUser.hasOwnProperty(payload.messageUsr.id) === false) {
        currentUser[payload.messageUsr.id] = []
      }
      chats = currentUser[payload.messageUsr.id]
      chats.push({
        msg: payload.message,
        time: payload.time,
        type: payload.type,
        name: payload.messageUsr.name,
        id: payload.messageUsr.id,
      })

      // for (let i = 0; i < allChat.length; i++) {
      //   if (allChat[i].userId === payload.userId) {
      //     currentUser = allChat[i];
      //     break
      //   }
      // }

      // //登陆用户
      // if(!currentUser){
      //   currentUser = {};
      //   currentUser['userId'] = payload.userId;
      //   //登陆用户聊天列表
      //   currentUser['chats'] = [];
      //
      //   //当前聊天
      //   let chat = {};
      //   chat['messageUsr'] = payload.messageUsr;
      //   chat['type'] = payload.type;
      //   //当前聊天历史记录列表
      //   chat['history'] = [];
      //   chat['history'].push({msg:payload.message,time:payload.time,type:payload.type});
      //
      //   //添加
      //   currentUser['chats'].push(chat);
      //   allChat.push(currentUser);
      // }else{
      //   let curChat;
      //   for (let i = 0; i < currentUser['chats'].length; i++){
      //     if( currentUser['chats'][i].messageUsr.id===  payload.messageUsr.id){
      //       curChat = currentUser['chats'][i];
      //       break;
      //     }
      //   }
      //   //未找到当前用户聊天，新建
      //   if(!curChat){
      //     curChat = {};
      //     curChat['messageUsr'] = payload.messageUsr;
      //     curChat['type'] = payload.type;
      //     curChat['history'] = [];
      //   }
      //   curChat['history'].push({msg:payload.message,time:payload.time,type:payload.type});
      // }

      return fromJS(allChat)
    },
    [REHYDRATE]: (state, { payload }) => {
      return payload && payload.chat ? fromJS(payload.chat) : state
      // return initialState
    },
  },
  initialState,
)
