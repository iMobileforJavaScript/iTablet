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
} from 'react-native'
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view'

// eslint-disable-next-line
import { SMessageService } from 'imobile_for_reactnative'
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
const SMessageServiceiOS = NativeModules.SMessageService
const iOSEventEmitter = new NativeEventEmitter(SMessageServiceiOS)
let searchImg = getThemeAssets().friend.friend_search
let addFriendImg = getThemeAssets().friend.friend_add

let g_connectService = false
export default class Friend extends Component {
  props: {
    language: string,
    navigation: Object,
    user: Object,
    chat: Array,
    addChat: () => {},
    editChat: () => {},
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.friendMessage = {}
    this.friendList = {}
    this.friendGroup = {}
    this.curChat = undefined
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

    this._receiveMessage = this._receiveMessage.bind(this)
  }

  componentDidMount() {
    this.connectService()
    this.addFileListener()
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.user.currentUser.userId) !==
      JSON.stringify(this.props.user.currentUser.userId)
    ) {
      this.disconnectService()
      this.connectService()
    }
    if (
      JSON.stringify(prevProps.user.currentUser.hasUpdateFriend) !==
      JSON.stringify(this.props.user.currentUser.hasUpdateFriend)
    ) {
      this.refreshList()
    }
  }

  componentWillUnmount() {
    this.removeFileListener()
  }
  // eslint-disable-next-line
  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state) ||
      prevProps.language !== this.props.language
    ) {
      return true
    }
    return false
  }

  refreshMsg = () => {
    if (this.friendMessage && this.friendMessage.refresh)
      this.friendMessage.refresh()
  }

  refreshList = () => {
    if (this.friendList && this.friendList.refresh) this.friendList.refresh()
    if (this.friendGroup && this.friendGroup.refresh) this.friendGroup.refresh()
  }

  setCurChat = chat => {
    this.curChat = chat
    if (this.curChat) {
      MessageDataHandle.readMessage({
        //清除未读信息
        userId: this.props.user.currentUser.userId, //当前登录账户的id
        talkId: this.curChat.targetUser.id, //会话ID
      })
    }
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
    msg.msg.message.progress = value.percentage
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
  // eslint-disable-next-line
  createGroupTalk = members => {
    let ctime = new Date()
    let time = Date.parse(ctime)
    // eslint-disable-next-line

    members.push({
      id: this.props.user.currentUser.userId,
      name: this.props.user.currentUser.nickname,
    })
    let groupId = 'Group_' + time + '_' + this.props.user.currentUser.userId
    //服务绑定
    SMessageService.declareSession(members, groupId)

    let msgObj = {
      user: {
        name: this.props.user.currentUser.nickname,
        id: this.props.user.currentUser.userId,
        groupID: groupId,
      },
      members: members,
      type: 912,
      time: time,
      message: this.props.user.currentUser.nickname + '邀请您加入群聊',
    }
    let groupName = ''
    for (let i in members) {
      if (i > 3) break
      groupName += members[i].name
      if (i !== members.length - 2) groupName += '、'
    }
    FriendListFileHandle.addToGroupList({
      id: groupId,
      members: members,
      groupName: groupName,
      masterID: this.props.user.currentUser.userId,
    })
    let msgStr = JSON.stringify(msgObj)
    for (let i in members) {
      this._sendMessage(msgStr, members[i].id, false)
    }

    // console.warn(members + groupId)
  }

  _sendMessage = (messageStr, talkId, bInform) => {
    if (!g_connectService) {
      SMessageService.connectService(
        MSGConstant.MSG_IP,
        MSGConstant.MSG_Port,
        MSGConstant.MSG_HostName,
        MSGConstant.MSG_UserName,
        MSGConstant.MSG_Password,
        this.props.user.currentUser.userId,
      )
        .then(() => {
          SMessageService.sendMessage(messageStr, talkId)
        })
        .catch(() => {
          Toast.show('连接消息服务失败！')
        })
      Toast.show('未能连接消息服务！')
    } else {
      SMessageService.sendMessage(messageStr, talkId)
    }
    if (!bInform) {
      //todo
    }
  }

  storeMessage = (messageObj, talkId, msgId) => {
    let userId = this.props.user.currentUser.userId
    MessageDataHandle.pushMessage({
      userId: userId,
      talkId: talkId,
      messageUsr: messageObj.user,
      message: messageObj.message,
      time: messageObj.time,
      type: messageObj.type,
      unReadMsg: messageObj.unReadMsg,
      msgId: msgId,
    })
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
      msg.msg.message.queueName = res.queueName
      MessageDataHandle.editMessage({
        userId: this.props.user.currentUser.userId,
        talkId: talkId,
        msgId: msgId,
        editItem: msg,
      })

      informMsg.message.message.queueName = res.queueName
      informMsg.message.message.filePath = ''
      this._sendMessage(JSON.stringify(informMsg), talkId, false)
      Toast.show('分享完成')
    })
  }

  _receiveFile = (fileName, queueName, receivePath, talkId, msgId) => {
    if (g_connectService) {
      SMessageService.receiveFile(
        fileName,
        queueName,
        receivePath,
        talkId,
        msgId,
      ).then(res => {
        if (res === true) {
          Toast.show('接收完成')
          let message = this.props.chat[this.props.user.currentUser.userId][
            talkId
          ].history[msgId]
          message.msg.message.isReceived = 1
          message.msg.message.filePath = receivePath + '/' + fileName
          MessageDataHandle.editMessage({
            userId: this.props.user.currentUser.userId,
            talkId: talkId,
            msgId: msgId,
            editItem: message,
          })
        }
      })
    }
  }

  async _receiveMessage(message) {
    if (g_connectService) {
      let messageObj = JSON.parse(message['message'])
      let userId = this.props.user.currentUser.userId
      if (userId === messageObj.user.id) {
        //自己的消息，返回
        return
      }

      if (!FriendListFileHandle.friends) {
        await this.getContacts()
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
      if (messageObj.type === 2) {
        msgId = this.getMsgId(messageObj.user.groupID)
      } else {
        msgId = this.getMsgId(messageObj.user.id)
      }

      if (!bSystem) {
        //非通知消息，判断是否接收
        let obj = undefined
        if (messageObj.type === 1) {
          obj = FriendListFileHandle.findFromFriendList(messageObj.user.id)
        } else if (messageObj.type === 2) {
          obj = FriendListFileHandle.findFromGroupList(messageObj.user.groupID)
          if (!obj) {
            return
          }
        }
        if (!obj) {
          //非好友
          let ctime = new Date()
          let time = Date.parse(ctime)
          let message = {
            message: '对方还未添加您为好友',
            type: MSGConstant.MSG_REJECT,
            user: {
              name: this.props.user.currentUser.userName,
              id: this.props.user.currentUser.userId,
              groupID: this.props.user.currentUser.userId,
            },
            time: time,
          }
          SMessageService.sendMessage(
            JSON.stringify(message),
            messageObj.user.id,
          )
          return
        }

        //文件通知消息
        if (
          messageObj.message.type &&
          messageObj.message.type === MSGConstant.MSG_FILE_NOTIFY
        ) {
          messageObj.message.message.isReceived = 0
        }
      } else {
        //to do 系统消息，做处理机制
        if (messageObj.type === MSGConstant.MSG_ADD_FRIEND) {
          bSysStore = true
        }
        if (messageObj.type === MSGConstant.MSG_CREATE_GROUP) {
          //加入群
          let groupName = ''
          for (let i in messageObj.members) {
            if (i > 3) break
            groupName += messageObj.members[i].name
            if (i !== messageObj.members.length - 2) groupName += '、'
          }
          FriendListFileHandle.addToGroupList({
            id: messageObj.user.groupID,
            members: messageObj.members,
            groupName: groupName,
            masterID: messageObj.user.id,
          })
          return
        }
        if (messageObj.type === MSGConstant.MSG_REJECT) {
          bSysStore = true
          bSysShow = true
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
        }
      }
    }
  }

  getContacts = async () => {
    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + this.props.user.currentUser.userName + '/Data/Temp',
    )
    await FriendListFileHandle.getContacts(userPath, 'friend.list', () => {})
  }

  connectService = () => {
    let bHasUserInfo = false

    if (this.props.user.currentUser.hasOwnProperty('userType') === true) {
      let usrType = this.props.user.currentUser.userType
      bHasUserInfo = usrType === UserType.COMMON_USER ? true : false
      if (bHasUserInfo === true) {
        if (g_connectService === false) {
          SMessageService.connectService(
            MSGConstant.MSG_IP,
            MSGConstant.MSG_Port,
            MSGConstant.MSG_HostName,
            MSGConstant.MSG_UserName,
            MSGConstant.MSG_Password,
            this.props.user.currentUser.userId,
          )
            .then(res => {
              if (!res) {
                Toast.show('连接消息服务失败！')
              } else {
                g_connectService = true
                SMessageService.startReceiveMessage(
                  this.props.user.currentUser.userId,
                  { callback: this._receiveMessage },
                )
              }
            })
            .catch(() => {
              Toast.show('连接消息服务失败！')
            })
        }
      } else {
        this.disconnectService()
      }
    }

    this.setState({ bHasUserInfo })
  }

  disconnectService = async () => {
    SMessageService.disconnectionService()
    SMessageService.stopReceiveMessage()
    g_connectService = false
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
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Navigator_Lable.FRIENDS,
          headerLeft:
            this.state.bHasUserInfo === true ? (
              <TouchableOpacity
                style={styles.addFriendView}
                onPress={() => {
                  this.setState({ showPop: true })
                }}
              >
                <Image source={addFriendImg} style={styles.addFriendImg} />
              </TouchableOpacity>
            ) : null,
          headerRight:
            this.state.bHasUserInfo === true ? (
              <TouchableOpacity
                onPress={() => {
                  {
                    //  let usr = this.props.user
                  }
                }}
                style={styles.searchView}
              >
                <Image
                  resizeMode={'contain'}
                  source={searchImg}
                  style={styles.searchImg}
                />
              </TouchableOpacity>
            ) : null,
          withoutBack: true,
          navigation: this.props.navigation,
        }}
      >
        {this.state.bHasUserInfo === true
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
          renderTabBar={() => <DefaultTabBar />}
          initialPage={1}
          tabBarUnderlineStyle={{
            backgroundColor: 'rgba(70,128,223,1.0)',
            height: 2,
            width: 20,
            marginLeft: this.screenWidth / 3 / 2 - 10,
          }}
          tabBarBackgroundColor="white"
          tabBarActiveTextColor="rgba(70,128,223,1.0)"
          tabBarInactiveTextColor="black"
          tabBarTextStyle={{
            fontSize: scaleSize(25),
            textAlign: 'center',
            marginTop: 10,
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

        <InformSpot
          style={{
            position: 'absolute',
            backgroundColor: 'red',
            justifyContent: 'center',
            height: scaleSize(15),
            width: scaleSize(15),
            borderRadius: scaleSize(25),
            top: scaleSize(10),
            left: this.screenWidth / 3 / 2 + 10,
          }}
        />
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
            {/* 亲,您还没有好友关系哦 */}
          </Text>
        </View>
      </View>
    )
  }
}
