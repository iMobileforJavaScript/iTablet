/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import Container from '../../../components/Container'
import {
  Dimensions,
  TouchableOpacity,
  Image,
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  Platform,
  AppState,
  NetInfo,
} from 'react-native'
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view'

// eslint-disable-next-line
import { SMessageService, SOnlineService } from 'imobile_for_reactnative'
import NavigationService from '../../NavigationService'
import { scaleSize } from '../../../utils/screen'
import { Toast } from '../../../utils/index'
import { styles } from './Styles'

import { getThemeAssets } from '../../../assets'
import FriendMessage from './FriendMessage/FriendMessage'
import FriendGroup from './FriendGroup/FriendGroup'
import FriendList from './FriendList/FriendList'
import UserType from '../../../constants/UserType'
// import Chat from './Chat/Chat'
import FriendListFileHandle from './FriendListFileHandle'
import InformSpot from './InformSpot'
import AddMore from './AddMore'
import MSGConstant from './MsgConstant'
import { getLanguage } from '../../../language/index'
import MessageDataHandle from './MessageDataHandle'
import { FileTools } from '../../../native'
import ConstPath from '../../../constants/ConstPath'
// eslint-disable-next-line import/no-unresolved
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import { EventConst } from '../../../constants'
import JPushService from './JPushService'
import { Buffer } from 'buffer'
import SMessageServiceHTTP from './SMessageServiceHTTP'
const SMessageServiceiOS = NativeModules.SMessageService
const appUtilsModule = NativeModules.AppUtils
const iOSEventEmitter = new NativeEventEmitter(SMessageServiceiOS)
// let searchImg = getThemeAssets().friend.friend_search
let addFriendImg = getThemeAssets().friend.friend_addMenu

let g_connectService = false
export default class Friend extends Component {
  props: {
    language: string,
    navigation: Object,
    user: Object,
    chat: Array,
    addChat: () => {},
    editChat: () => {},
    setConsumer: () => {},
    setUser: () => {},
    openWorkspace: () => {},
    closeWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.friendMessage = {}
    this.friendList = {}
    this.friendGroup = {}
    this.curChat = undefined
    this.curMod = undefined
    MessageDataHandle.setHandle(this.props.addChat)
    FriendListFileHandle.refreshCallback = this.refreshList
    FriendListFileHandle.refreshMessageCallback = this.refreshMsg
    this.state = {
      data: [{}],
      bHasUserInfo: false,
      progressWidth: this.screenWidth * 0.4,
      isLoadingData: false,
      showPop: false,
    }
    AppState.addEventListener('change', this.handleStateChange)
    NetInfo.addEventListener('connectionChange', this.handleNetworkState)
    this.addFileListener()
    this.stateChangeCount = 0
    this._receiveMessage = this._receiveMessage.bind(this)
    global.getFriend = this._getFriend
  }

  _getFriend = () => {
    if (this.props.user.currentUser.userId !== undefined) {
      return this
    } else {
      return undefined
    }
  }

  componentDidMount() {
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.restartService()
      JPushService.init(this.props.user.currentUser.userId)
    }
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.user.currentUser.userId) !==
      JSON.stringify(this.props.user.currentUser.userId)
    ) {
      this.downloadFriendList(this.props.user.currentUser)
      this.restartService()
      JPushService.init(this.props.user.currentUser.userId)
    }
    // if (
    //   JSON.stringify(prevProps.user.currentUser.hasUpdateFriend) !==
    //   JSON.stringify(this.props.user.currentUser.hasUpdateFriend)
    // ) {
    //   this.refreshList()
    // }
  }

  componentWillUnmount() {
    this.removeFileListener()
    AppState.removeEventListener('change', this.handleStateChange)
    NetInfo.removeEventListener('connectionChange', this.handleNetworkState)
  }
  // eslint-disable-next-line
  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state) ||
      prevProps.language !== this.props.language ||
      Dimensions.get('window').width !== this.screenWidth
    ) {
      return true
    }
    return false
  }

  handleStateChange = async appState => {
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      if (appState === 'inactive') {
        return
      }
      let count = this.stateChangeCount + 1
      this.stateChangeCount = count
      await appUtilsModule.pause(2)
      if (this.stateChangeCount !== count) {
        return
      } else if (this.prevAppstate === appState) {
        return
      } else {
        this.prevAppstate = appState
        this.stateChangeCount = 0
        if (appState === 'active') {
          this.restartService()
        } else if (appState === 'background') {
          this.disconnectService()
        }
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  handleNetworkState = state => {
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.restartService()
    }
  }

  startCheckAvailability = () => {
    NetInfo.isConnected.fetch().done(async isConnected => {
      global.network = isConnected
      //记录本次连接的consumer
      let consumer = await SMessageServiceHTTP.getConsumer(
        this.props.user.currentUser.userId,
      )
      //服务器还没来得及生成，等待
      if (!consumer) {
        setTimeout(this.startCheckAvailability, 2000)
        return
      }
      this.props.setConsumer(consumer)
      this.endCheckAvailability()
      //每隔一分钟查询连接到服务器的consumer
      this.interval = setInterval(async () => {
        let isConnected = await NetInfo.isConnected.fetch()
        if (isConnected) {
          let consumer = await SMessageServiceHTTP.getConsumer(
            this.props.user.currentUser.userId,
          )
          if (!consumer || consumer !== this.props.chat.consumer) {
            this.restartService()
          }
        }
      }, 60000)
    })
  }

  endCheckAvailability = () => {
    this.interval && clearInterval(this.interval)
  }

  refreshMsg = () => {
    if (this.friendMessage && this.friendMessage.refresh)
      this.friendMessage.refresh()
  }

  refreshList = () => {
    if (this.friendList && this.friendList.refresh) this.friendList.refresh()
    if (this.friendGroup && this.friendGroup.refresh) this.friendGroup.refresh()
  }

  downloadFriendList = async user => {
    FriendListFileHandle.download(user)
  }

  setCurChat = chat => {
    //防止replace chat页面时变量设置错误
    if (chat !== undefined && this.curChat !== undefined) {
      setTimeout(() => this.setCurChat(chat), 1000)
      return
    }
    this.curChat = chat
    if (this.curChat) {
      MessageDataHandle.readMessage({
        //清除未读信息
        userId: this.props.user.currentUser.userId, //当前登录账户的id
        talkId: this.curChat.targetUser.id, //会话ID
      })
    }
  }

  //设置协作模块
  setCurMod = async Module => {
    this.curMod = Module
  }

  addFileListener = () => {
    if (Platform.OS === 'iOS') {
      this.receiveFileListener = iOSEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_RECEIVE_FILE,
        this.onReceiveProgress,
      )
      this.sendFileListener = iOSEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_SEND_FILE,
        this.onReceiveProgress,
      )
    } else {
      this.receiveFileListener = RCTDeviceEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_RECEIVE_FILE,
        this.onReceiveProgress,
      )
      this.sendFileListener = RCTDeviceEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_SEND_FILE,
        this.onReceiveProgress,
      )
    }
  }

  removeFileListener = () => {
    this.receiveFileListener && this.receiveFileListener.remove()
    this.sendFileListener && this.sendFileListener.remove()
  }

  onReceiveProgress = value => {
    let msg = this.getMsgByMsgId(value.talkId, value.msgId)
    msg.originMsg.message.message.progress = value.percentage
    MessageDataHandle.editMessage({
      userId: this.props.user.currentUser.userId,
      talkId: value.talkId,
      msgId: value.msgId,
      editItem: msg,
    })

    if (this.curChat && this.curChat.targetUser.id === value.talkId) {
      this.curChat.onReceiveProgress(value)
    }
  }

  //构造chat页面等需要的targetUser对象
  getTargetUser = targetId => {
    let name = ''
    if (targetId.indexOf('Group_') != -1) {
      name = FriendListFileHandle.getGroup(targetId).groupName
    } else {
      name = FriendListFileHandle.getFriend(targetId).markName
    }

    let chatObj = {}
    let friend = {
      id: targetId,
      message: chatObj,
      title: name,
    }

    if (this.props.chat.hasOwnProperty(this.props.user.currentUser.userId)) {
      let chats = this.props.chat[this.props.user.currentUser.userId]
      if (chats.hasOwnProperty(targetId)) {
        chatObj = chats[targetId].history
        friend = {
          id: targetId,
          message: chatObj,
          title: name,
        }
      }
    }
    return friend
  }

  createGroupTalk = members => {
    let ctime = new Date()
    let time = Date.parse(ctime)
    let newMembers = JSON.parse(JSON.stringify(members))

    members.unshift({
      id: this.props.user.currentUser.userId,
      name: this.props.user.currentUser.nickname,
    })
    let groupId = 'Group_' + time + '_' + this.props.user.currentUser.userId

    let groupName = ''
    for (let i in members) {
      if (i > 3) break
      if (i === '0') {
        groupName += members[i].name
      } else {
        groupName += '、' + members[i].name
      }
    }
    FriendListFileHandle.addToGroupList({
      id: groupId,
      members: members,
      groupName: groupName,
      masterID: this.props.user.currentUser.userId,
    })
    let msgObj = {
      user: {
        name: this.props.user.currentUser.nickname,
        id: this.props.user.currentUser.userId,
        groupID: groupId,
        groupName: groupName, //群组消息带个群组名
      },
      type: MSGConstant.MSG_CREATE_GROUP,
      time: time,
      message: {
        oldMembers: [
          {
            id: this.props.user.currentUser.userId,
            name: this.props.user.currentUser.nickname,
          },
        ],
        newMembers: newMembers,
      },
    }
    let msgStr = JSON.stringify(msgObj)
    this._sendMessage(msgStr, groupId, false)
    NavigationService.navigate('Chat', {
      targetId: groupId,
    })
  }

  addGroupMember = (groupId, members) => {
    let ctime = new Date()
    let time = Date.parse(ctime)

    let oldMembers = FriendListFileHandle.readGroupMemberList(groupId)
    FriendListFileHandle.addGroupMember(groupId, members)
    let group = FriendListFileHandle.getGroup(groupId)
    let msgObj = {
      user: {
        name: this.props.user.currentUser.nickname,
        id: this.props.user.currentUser.userId,
        groupID: groupId,
        groupName: group.groupName, //群组消息带个群组名
      },
      type: MSGConstant.MSG_CREATE_GROUP,
      time: time,
      message: {
        oldMembers: oldMembers,
        newMembers: members,
      },
    }
    let msgStr = JSON.stringify(msgObj)
    this._sendMessage(msgStr, groupId, false)
  }

  removeGroupMember = async (groupId, members) => {
    let ctime = new Date()
    let time = Date.parse(ctime)

    let group = FriendListFileHandle.getGroup(groupId)
    let msgObj = {
      user: {
        name: this.props.user.currentUser.nickname,
        id: this.props.user.currentUser.userId,
        groupID: groupId,
        groupName: group.groupName, //群组消息带个群组名
      },
      type: MSGConstant.MSG_REMOVE_MEMBER,
      time: time,
      message: {
        members: members,
      },
    }
    let msgStr = JSON.stringify(msgObj)
    await this._sendMessage(msgStr, groupId, false)

    FriendListFileHandle.removeGroupMember(groupId, members)
    for (let member in members) {
      SMessageService.exitSession(members[member].id, groupId)
    }
  }

  isGroupMsg = messageStr => {
    let messageObj = JSON.parse(messageStr)
    let type = messageObj.type
    let isGroup = false
    if (type === MSGConstant.MSG_GROUP) {
      isGroup = true
    } else if (type > 9) {
      //大于2的都是系统消息
      if (type > 910 && type < 920) {
        //群组相关的系统消息
        isGroup = true
      }
    }
    return isGroup
  }

  _sendMessage = async (messageStr, talkId, bInform) => {
    let bCon = true
    if (!g_connectService) {
      bCon = await SMessageService.connectService(
        MSGConstant.MSG_IP,
        MSGConstant.MSG_Port,
        MSGConstant.MSG_HostName,
        MSGConstant.MSG_UserName,
        MSGConstant.MSG_Password,
        this.props.user.currentUser.userId,
      )
    }
    if (bCon) {
      let talkIds = []
      if (this.isGroupMsg(messageStr)) {
        let members = FriendListFileHandle.readGroupMemberList(talkId)
        await SMessageService.declareSession(members, talkId)
        for (let key in members) {
          talkIds.push(members[key].id)
        }
      } else {
        talkIds.push(talkId)
      }
      //对接桌面
      let messageObj = JSON.parse(messageStr)
      if (messageObj.type < 10 && typeof messageObj.message === 'string') {
        messageObj.message = Buffer.from(messageObj.message).toString('base64')
      }
      let generalMsg = JSON.stringify(messageObj)
      await SMessageService.sendMessage(generalMsg, talkId)
      JPushService.push(messageStr, talkIds)
    } else {
      Toast.show(getLanguage(this.props.language).Friends.MSG_SERVICE_FAILED)
    }
    if (!bInform) {
      //todo
    }
  }

  storeMessage = (messageObj, talkId, msgId) => {
    let userId = this.props.user.currentUser.userId
    let type = 0
    if (
      messageObj.type === MSGConstant.MSG_SINGLE ||
      messageObj.type === MSGConstant.MSG_GROUP
    ) {
      type = messageObj.message.type
        ? messageObj.message.type
        : MSGConstant.MSG_TEXT
    } else {
      type = messageObj.type
    }
    let bSystem = false
    if (type > 100) {
      bSystem = true
    }
    let storeMsg = {
      userId: userId, //用户id
      talkId: talkId, //对方或群组id
      msgId: msgId, //消息id
      type: type,
      originMsg: messageObj, //原始消息体
      text: '', //消息要显示的文字信息
      unReadMsg: messageObj.unReadMsg, //消息已读未读
      system: bSystem,
    }

    MessageDataHandle.pushMessage(storeMsg)
    return storeMsg
  }

  loadMsgByMsgId = (talkId, msgId) => {
    let msg = this.getMsgByMsgId(talkId, msgId)
    return this.loadMsg(msg)
  }

  loadMsg = msg => {
    let text = ''
    switch (msg.type) {
      case MSGConstant.MSG_TEXT:
        text = msg.originMsg.message
        break
      case MSGConstant.MSG_ACCEPT_FRIEND:
        text = getLanguage(this.props.language).Friends.SYS_FRIEND_REQ_ACCEPT
        break
      case MSGConstant.MSG_REJECT:
        text = getLanguage(this.props.language).Friends.SYS_MSG_REJ
        break
      case MSGConstant.MSG_MAP:
        text = getLanguage(this.props.language).Friends.SYS_MSG_MAP
        break
      case MSGConstant.MSG_LAYER:
        text = getLanguage(this.props.language).Friends.SYS_MSG_LAYER
        break
      case MSGConstant.MSG_DATASET:
        text = getLanguage(this.props.language).Friends.SYS_MSG_DATASET
        break
      case MSGConstant.MSG_LOCATION:
        text = msg.originMsg.message.message.message
        break
      case MSGConstant.MSG_ADD_FRIEND:
        text = getLanguage(this.props.language).Friends.SYS_MSG_ADD_FRIEND
        break
      case MSGConstant.MSG_REMOVE_MEMBER:
        {
          let memberList = []
          let isInList = false
          for (let member in msg.originMsg.message.members) {
            memberList.push(msg.originMsg.message.members[member].name)
            if (
              msg.originMsg.message.members[member].id ===
              this.props.user.currentUser.userId
            ) {
              isInList = true
            }
          }
          if (isInList) {
            text =
              msg.originMsg.user.name +
              getLanguage(this.props.language).Friends
                .SYS_MSG_REMOVED_FROM_GROUP
          } else if (
            msg.originMsg.message.members.length === 1 &&
            msg.originMsg.message.members[0].id === msg.originMsg.user.id
          ) {
            text =
              msg.originMsg.user.name +
              getLanguage(this.props.language).Friends.SYS_MSG_LEAVE_GROUP
          } else {
            let memberStr = ''
            for (let key in memberList) {
              memberStr += memberList[key] + ' '
              if (key > 5) {
                memberStr += getLanguage(this.props.language).Friends
                  .SYS_MSG_ETC
                break
              }
            }
            text =
              msg.originMsg.user.name +
              getLanguage(this.props.language).Friends
                .SYS_MSG_REMOVE_OUT_GROUP +
              memberStr +
              getLanguage(this.props.language).Friends.SYS_MSG_REMOVE_OUT_GROUP2
          }
        }
        break
      case MSGConstant.MSG_CREATE_GROUP:
        {
          let memberStr = ''
          for (let member in msg.originMsg.message.newMembers) {
            memberStr += msg.originMsg.message.newMembers[member].name + ' '
            if (member > 5) {
              memberStr += getLanguage(this.props.language).Friends.SYS_MSG_ETC
              break
            }
          }
          text =
            msg.originMsg.user.name +
            getLanguage(this.props.language).Friends.SYS_MSG_ADD_INTO_GROUP +
            memberStr +
            getLanguage(this.props.language).Friends.SYS_MSG_ADD_INTO_GROUP2
        }
        break
      case MSGConstant.MSG_MODIFY_GROUP_NAME:
        text =
          msg.originMsg.user.name +
          getLanguage(this.props.language).Friends.SYS_MSG_MOD_GROUP_NAME +
          msg.originMsg.message.name
        break
      default:
        break
    }
    msg.text = text
    return msg
  }

  getMsgId = talkId => {
    let userId = this.props.user.currentUser.userId
    let msgId = 0
    let chatHistory = []
    if (this.props.chat[userId] && this.props.chat[userId][talkId]) {
      chatHistory = this.props.chat[userId][talkId].history
    }
    if (chatHistory.length !== 0) {
      msgId = chatHistory[chatHistory.length - 1].msgId + 1
    }
    return msgId
  }

  getMsgByMsgId = (talkId, msgId) => {
    let userId = this.props.user.currentUser.userId
    let chatHistory = []
    let msg = undefined
    if (this.props.chat[userId] && this.props.chat[userId][talkId]) {
      chatHistory = this.props.chat[userId][talkId].history
    }
    if (chatHistory.length !== 0) {
      msg = chatHistory[msgId]
    }
    return msg
  }

  _sendFile = (messageStr, filepath, talkId, msgId, informMsg) => {
    let connectInfo = {
      serverIP: MSGConstant.MSG_IP,
      port: MSGConstant.MSG_Port,
      hostName: MSGConstant.MSG_HostName,
      userName: MSGConstant.MSG_UserName,
      passwd: MSGConstant.MSG_Password,
      userID: this.props.user.currentUser.userId,
    }
    SMessageService.sendFile(
      JSON.stringify(connectInfo),
      messageStr,
      filepath,
      talkId,
      msgId,
    ).then(res => {
      let msg = this.getMsgByMsgId(talkId, msgId)
      msg.originMsg.message.message.queueName = res.queueName
      MessageDataHandle.editMessage({
        userId: this.props.user.currentUser.userId,
        talkId: talkId,
        msgId: msgId,
        editItem: msg,
      })

      informMsg.message.message.queueName = res.queueName
      informMsg.message.message.filePath = ''
      // informMsg.message.type=3       要给桌面发文件需要将类型改为3
      this._sendMessage(JSON.stringify(informMsg), talkId, false)
      Toast.show(getLanguage(this.props.language).Friends.SEND_SUCCESS)
    })
  }

  _receiveFile = async (
    fileName,
    queueName,
    receivePath,
    talkId,
    msgId,
    userId,
    fileSize,
    cb,
  ) => {
    if (g_connectService) {
      let homePath = await FileTools.appendingHomeDirectory()
      SMessageService.receiveFile(
        fileName,
        queueName,
        homePath + receivePath,
        talkId,
        msgId,
        userId,
        fileSize,
      ).then(res => {
        let message = this.props.chat[this.props.user.currentUser.userId][
          talkId
        ].history[msgId]
        if (res === true) {
          Toast.show(getLanguage(this.props.language).Friends.RECEIVE_SUCCESS)
          message.originMsg.message.message.filePath =
            receivePath + '/' + fileName
          MessageDataHandle.editMessage({
            userId: this.props.user.currentUser.userId,
            talkId: talkId,
            msgId: msgId,
            editItem: message,
          })
        } else {
          Toast.show(
            getLanguage(this.props.language).Friends.RECEIVE_FAIL_EXPIRE,
          )
          FileTools.deleteFile(homePath + receivePath + '/' + fileName)
        }
        if (cb && typeof cb === 'function') {
          cb(res)
        }
      })
    } else {
      Toast.show(getLanguage(this.props.language).Friends.RECEIVE_FAIL_NETWORK)
      if (cb && typeof cb === 'function') {
        cb(false)
      }
    }
  }

  _logout = async () => {
    try {
      if (this.props.user.userType !== UserType.PROBATION_USER) {
        SOnlineService.logout()
      }
      this.props.closeWorkspace(async () => {
        SOnlineService.removeCookie()
        let customPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace,
        )
        this.props.setUser({
          userName: 'Customer',
          userType: UserType.PROBATION_USER,
        })
        NavigationService.popToTop('Tabs')
        this.props.openWorkspace({ server: customPath })
        Toast.show(
          getLanguage(this.props.language).Friends.SYS_LOGIN_ON_OTHER_DEVICE,
        )
      })
    } catch (e) {
      //
    }
  }

  async _receiveMessage(message) {
    let messageObj = JSON.parse(message['message'])
    // messageObj.message.type=6;   桌面发送的文件类型是3，要接收桌面发送过来的文件需要把type改为6
    // messageObj.message.message.progress=0;    桌面发送的数据没有progress参数，不能显示进度
    if (messageObj.type === MSGConstant.MSG_LOGOUT) {
      if (messageObj.time !== this.loginTime) {
        this._logout()
      }
      return
    }
    let userId = this.props.user.currentUser.userId
    if (userId === messageObj.user.id) {
      //自己的消息，返回
      return
    }

    //对接桌面
    if (messageObj.type < 10 && typeof messageObj.message === 'string') {
      messageObj.message = Buffer.from(messageObj.message, 'base64').toString()
    }

    if (!FriendListFileHandle.friends) {
      setTimeout(() => {
        this._receiveMessage(message)
      }, 500)
      return
    }

    let bSystem = false
    let bUnReadMsg = false
    let msgId = 0
    let bSysStore = false //系统消息是否保存
    let bSysShow = false //系统消息是否显示在聊天窗口
    //系统消息
    if (messageObj.type > 9) {
      bSystem = true
    }
    if (
      !this.curChat ||
      this.curChat.targetUser.id !== messageObj.user.groupID //个人会话这个ID和groupID是同一个，就用一个吧
    ) {
      bUnReadMsg = true
    }

    if (messageObj.type === MSGConstant.MSG_ADD_FRIEND) {
      msgId = this.getMsgId(1)
    } else if (this.isGroupMsg(message['message'])) {
      msgId = this.getMsgId(messageObj.user.groupID)
    } else {
      msgId = this.getMsgId(messageObj.user.id)
    }

    if (!bSystem) {
      //普通消息
      if (messageObj.type === 2) {
        let obj = FriendListFileHandle.findFromGroupList(
          messageObj.user.groupID,
        )
        if (!obj) {
          return
        }
      }

      let isFriend = FriendListFileHandle.getIsFriend(messageObj.user.id)
      if (isFriend === undefined || isFriend === 0) {
        //非好友,正常情况下不应该收到非好友的消息，收到后让对方删除
        let delMessage = {
          message: '',
          type: MSGConstant.MSG_DEL_FRIEND,
          user: {
            name: this.props.user.currentUser.userName,
            id: this.props.user.currentUser.userId,
            groupID: this.props.user.currentUser.userId,
          },
          time: Date.parse(new Date()),
        }
        SMessageService.sendMessage(
          JSON.stringify(delMessage),
          messageObj.user.id,
        )

        let rejMessage = {
          message: '',
          type: MSGConstant.MSG_REJECT,
          user: {
            name: this.props.user.currentUser.userName,
            id: this.props.user.currentUser.userId,
            groupID: this.props.user.currentUser.userId,
          },
          time: Date.parse(new Date()),
        }
        SMessageService.sendMessage(
          JSON.stringify(rejMessage),
          messageObj.user.id,
        )
        return
      }
    } else {
      //系统消息，做处理机制
      let isFriend = FriendListFileHandle.getIsFriend(messageObj.user.groupID)
      let time = Date.parse(new Date())
      /*
       * 添加好友
       */
      if (messageObj.type === MSGConstant.MSG_ADD_FRIEND) {
        if (isFriend === undefined) {
          bSysStore = true
          messageObj.consumed = false
        } else if (isFriend === 0) {
          FriendListFileHandle.modifyIsFriend(messageObj.user.groupID, 1)
          let message = {
            message: '',
            type: MSGConstant.MSG_ACCEPT_FRIEND,
            user: {
              name: this.props.user.currentUser.userName,
              id: this.props.user.currentUser.userId,
              groupID: this.props.user.currentUser.userId,
              groupName: '',
            },
            time: time,
          }
          SMessageService.sendMessage(
            JSON.stringify(message),
            messageObj.user.id,
          )
        } else if (isFriend === 1) {
          let message = {
            message: '',
            type: MSGConstant.MSG_ACCEPT_FRIEND,
            user: {
              name: this.props.user.currentUser.userName,
              id: this.props.user.currentUser.userId,
              groupID: this.props.user.currentUser.userId,
              groupName: '',
            },
            time: time,
          }
          SMessageService.sendMessage(
            JSON.stringify(message),
            messageObj.user.id,
          )
        }
      } else if (messageObj.type === MSGConstant.MSG_ACCEPT_FRIEND) {
        /*
         * 同意添加好友
         */
        bSysStore = true
        bSysShow = true
        FriendListFileHandle.modifyIsFriend(messageObj.user.groupID, 1)
      } else if (messageObj.type === MSGConstant.MSG_DEL_FRIEND) {
        /*
         * 删除好友关系
         */
        FriendListFileHandle.modifyIsFriend(messageObj.user.groupID, 0)
      } else if (messageObj.type === MSGConstant.MSG_CREATE_GROUP) {
        /*
         * 添加群员
         */
        bSysStore = true
        bSysShow = true
        if (
          FriendListFileHandle.isInGroup(
            messageObj.user.groupID,
            this.props.user.currentUser.userId,
          )
        ) {
          FriendListFileHandle.addGroupMember(
            messageObj.user.groupID,
            messageObj.message.newMembers,
          )
        } else {
          //加入群
          let members = messageObj.message.oldMembers.concat(
            messageObj.message.newMembers,
          )
          FriendListFileHandle.addToGroupList({
            id: messageObj.user.groupID,
            members: members,
            groupName: messageObj.user.groupName,
            masterID: messageObj.user.id,
          })
        }
      } else if (messageObj.type === MSGConstant.MSG_REJECT) {
        /*
         * 拒收消息
         */
        bSysStore = true
        bSysShow = true
      } else if (messageObj.type === MSGConstant.MSG_REMOVE_MEMBER) {
        /*
         * 移除群员
         */
        bSysStore = true
        bSysShow = true
        let inList = false
        for (let member in messageObj.message.members) {
          if (
            messageObj.message.members[member].id ===
            this.props.user.currentUser.userId
          ) {
            inList = true
            break
          }
        }
        if (inList) {
          bSysStore = false
          bSysShow = false
          FriendListFileHandle.delFromGroupList(messageObj.user.groupID)
          MessageDataHandle.delMessage({
            userId: this.props.user.currentUser.userId,
            talkId: messageObj.user.groupID,
          })
          if (
            this.curChat &&
            this.curChat.targetId === messageObj.user.groupID
          ) {
            NavigationService.goBack()
            Toast.show(
              messageObj.user.name +
                getLanguage(this.props.language).Friends
                  .SYS_MSG_REMOVED_FROM_GROUP,
            )
          }
        } else {
          FriendListFileHandle.removeGroupMember(
            messageObj.user.groupID,
            messageObj.message.members,
          )
        }
      } else if (messageObj.type === MSGConstant.MSG_DISBAND_GROUP) {
        /*
         * 解散群
         */
        FriendListFileHandle.delFromGroupList(messageObj.user.groupID)
        MessageDataHandle.delMessage({
          userId: this.props.user.currentUser.userId,
          talkId: messageObj.user.groupID,
        })
      } else if (messageObj.type === MSGConstant.MSG_MODIFY_GROUP_NAME) {
        /*
         * 修改群名
         */
        bSysStore = true
        bSysShow = true
        FriendListFileHandle.modifyGroupList(
          messageObj.user.groupID,
          messageObj.message.name,
        )
        this.curChat && this.curChat.onFriendListChanged()
      }
    }

    //保存
    if ((bSystem && bSysStore) || !bSystem) {
      messageObj.unReadMsg = bUnReadMsg
      this.storeMessage(messageObj, messageObj.user.groupID, msgId)
    }
    //显示
    if ((bSystem && bSysShow) || !bSystem) {
      if (this.curChat) {
        //在当前聊天窗口,则显示这条消息
        if (this.curChat.targetUser.id === messageObj.user.groupID) {
          this.curChat.onReceive(msgId)
        } else {
          this.curChat.showInformSpot(true)
        }
      } else {
        JPushService.sendLocalNotification(messageObj)
      }
    }
  }

  getContacts = async () => {
    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + this.props.user.currentUser.userName + '/Data/Temp',
    )
    await FriendListFileHandle.getContacts(userPath, 'friend.list', () => {})
  }

  connectService = async () => {
    let bHasUserInfo = false
    if (this.props.user.currentUser.hasOwnProperty('userType') === true) {
      let usrType = this.props.user.currentUser.userType
      bHasUserInfo = usrType === UserType.COMMON_USER ? true : false
      if (bHasUserInfo === true) {
        if (g_connectService === false) {
          try {
            let res = await SMessageService.connectService(
              MSGConstant.MSG_IP,
              MSGConstant.MSG_Port,
              MSGConstant.MSG_HostName,
              MSGConstant.MSG_UserName,
              MSGConstant.MSG_Password,
              this.props.user.currentUser.userId,
            )
            if (!res) {
              Toast.show(
                getLanguage(this.props.language).Friends.MSG_SERVICE_FAILED,
              )
              this.disconnectService()
            } else {
              //是否有其他连接
              let connection = await SMessageServiceHTTP.getConnection(
                this.props.user.currentUser.userId,
              )
              //是否是login时调用
              if (global.isLogging) {
                if (connection) {
                  this.loginTime = Date.parse(new Date())
                  await this._sendMessage(
                    JSON.stringify({
                      type: MSGConstant.MSG_LOGOUT,
                      user: {},
                      time: this.loginTime,
                      message: '',
                    }),
                    this.props.user.currentUser.userId,
                  )
                  await SMessageServiceHTTP.closeConnection(connection)
                }
                global.isLogging = false
              } else {
                if (connection) {
                  //检查是否之前consumer
                  let consumer = await SMessageServiceHTTP.getConsumer(
                    this.props.user.currentUser.userId,
                  )
                  if (this.props.chat.consumer === consumer) {
                    await SMessageServiceHTTP.closeConnection(connection)
                  } else {
                    this._logout()
                    return
                  }
                }
              }

              await SMessageService.startReceiveMessage(
                this.props.user.currentUser.userId,
                { callback: this._receiveMessage },
              )

              this.startCheckAvailability()

              g_connectService = true
            }
          } catch (error) {
            Toast.show(
              getLanguage(this.props.language).Friends.MSG_SERVICE_FAILED,
            )
            this.disconnectService()
          }
        }
      } else {
        this.disconnectService()
      }
    }

    // this.setState({ bHasUserInfo })
  }

  disconnectService = async fromRestarting => {
    //重复调用，退出
    if (this.disconnecting) {
      return
    }
    //重启中，等待重启完成
    if (!fromRestarting && this.restarting) {
      setTimeout(this.disconnectService, 3000)
    } else {
      if (!g_connectService) {
        return
      }
      this.disconnecting = true
      this.endCheckAvailability()
      await SMessageService.stopReceiveMessage()
      await SMessageService.disconnectionService()
      g_connectService = false
      this.disconnecting = false
    }
  }

  restartService = async () => {
    //重复调用，退出
    if (this.restarting) {
      return
    }
    //正在断开连接，等待完成
    if (this.disconnecting) {
      setTimeout(this.restartService, 3000)
    } else {
      this.restarting = true
      g_connectService && (await this.disconnectService(true))
      await this.connectService()
      this.restarting = false
    }
  }

  addMore = index => {
    if (index === 1) {
      //add friend
      NavigationService.navigate('AddFriend', {
        user: this.props.user.currentUser,
        friend: this,
        language: this.props.language,
      })
    } else if (index === 2) {
      NavigationService.navigate('CreateGroupChat', {
        user: this.props.user.currentUser,
        friend: this,
        language: this.props.language,
      })
    } else if (index === 3) {
      NavigationService.navigate('RecommendFriend', {
        user: this.props.user.currentUser,
        friend: this,
        language: this.props.language,
      })
    }
  }
  render() {
    this.screenWidth = Dimensions.get('window').width
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Navigator_Label.FRIENDS,
          headerLeft:
            this.props.user.currentUser.userType === UserType.COMMON_USER ? (
              <TouchableOpacity
                style={styles.addFriendView}
                onPress={() => {
                  this.setState({ showPop: true })
                }}
              >
                <Image source={addFriendImg} style={styles.addFriendImg} />
              </TouchableOpacity>
            ) : null,
          // headerRight:
          //   this.state.bHasUserInfo === true ? (
          //     <TouchableOpacity
          //       onPress={() => {
          //         {
          //           //  let usr = this.props.user
          //         }
          //       }}
          //       style={styles.searchView}
          //     >
          //       <Image
          //         resizeMode={'contain'}
          //         source={searchImg}
          //         style={styles.searchImg}
          //       />
          //     </TouchableOpacity>
          //   ) : null,
          withoutBack: true,
          navigation: this.props.navigation,
        }}
      >
        {this.props.user.currentUser.userType === UserType.COMMON_USER
          ? this.renderTab()
          : this.renderNOFriend()}
        <AddMore
          show={this.state.showPop}
          closeModal={show => {
            this.setState({ showPop: show })
          }}
          addMore={this.addMore}
        />
      </Container>
    )
  }

  renderTab() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollableTabView
          renderTabBar={() => (
            <DefaultTabBar
              renderTab={(name, page, isTabActive, onPressHandler) => {
                let activeTextColor = 'rgba(70,128,223,1.0)'
                let inactiveTextColor = 'black'
                const textColor = isTabActive
                  ? activeTextColor
                  : inactiveTextColor
                const fontWeight = isTabActive ? 'bold' : 'normal'

                return (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    key={name}
                    accessible={true}
                    accessibilityLabel={name}
                    accessibilityTraits="button"
                    onPress={() => onPressHandler(page)}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingVertical: scaleSize(10),
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: textColor,
                            fontWeight,
                            fontSize: scaleSize(25),
                            textAlign: 'center',
                          }}
                        >
                          {name}
                        </Text>
                        {name ===
                          getLanguage(this.props.language).Friends.MESSAGES && (
                          <InformSpot
                            style={{
                              top: scaleSize(-5),
                              right: scaleSize(-15),
                            }}
                          />
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          )}
          initialPage={1}
          tabBarUnderlineStyle={{
            backgroundColor: 'rgba(70,128,223,1.0)',
            height: 2,
            width: 20,
            marginLeft: this.screenWidth / 3 / 2 - 10,
          }}
        >
          <FriendMessage
            ref={ref => (this.friendMessage = ref)}
            tabLabel={getLanguage(this.props.language).Friends.MESSAGES}
            //"消息"
            language={this.props.language}
            user={this.props.user.currentUser}
            chat={this.props.chat}
            friend={this}
          />
          <FriendList
            ref={ref => (this.friendList = ref)}
            tabLabel={getLanguage(this.props.language).Friends.FRIENDS}
            //"好友"
            language={this.props.language}
            user={this.props.user.currentUser}
            friend={this}
          />
          <FriendGroup
            ref={ref => (this.friendGroup = ref)}
            tabLabel={getLanguage(this.props.language).Friends.GROUPS}
            //"群组"
            language={this.props.language}
            user={this.props.user.currentUser}
            friend={this}
          />
        </ScrollableTabView>
      </View>
    )
  }
  renderNOFriend() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View>
          <Text
            style={{
              fontSize: scaleSize(20),
              textAlign: 'center',
              margin: scaleSize(10),
            }}
          >
            {getLanguage(this.props.language).Friends.LOGOUT}
          </Text>
        </View>
      </View>
    )
  }
}
