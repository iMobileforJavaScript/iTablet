/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import Container from '../../../components/Container'
import { Dimensions, TouchableOpacity, Image, View, Text } from 'react-native'
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
import{getLanguage}from '../../../language/index'
import MessageDataHandle from './MessageDataHandle'

let searchImg = getThemeAssets().friend.friend_search
let addFriendImg = getThemeAssets().friend.friend_add

let g_connectService = false
export default class Friend extends Component {
  props: {
    language:Object,
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

  // componentDidUpdate(prevProps) {
  //   // if (JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user)) {
  //   //  // this
  //   //  // this
  //   // }
  //
  //   return true
  // }

  componentWillUnmount() {
    // this.connectService()
  }
  // eslint-disable-next-line
  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)||
      prevProps.language!==this.props.language
    ) {
      return true
    }
    return false
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
  // eslint-disable-next-line
  // componentWillReceiveProps(nextProps) {
  //   if (this.friendMessage.refresh) {
  //     this.friendMessage.refresh(nextProps.chat)
  //   }
  // }

  //message {{
  //type 1+:通知类(暂定大于10,10申请添加,11同意添加)  2.单人消息 3.群组消息
  //message: str
  //use:{name:curUserName,id:uuid}
  //time:time
  //}}

  //targetId
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
      let messageObj = JSON.parse(messageStr)
      //message {{
      //talkId:talkId
      //type 10+:通知类 单人消息1 群组消息2
      //message: str
      //use:{name:curUserName,id:uuid}
      //time:time
      //system:n, 0:非系统消息 1：拒收 2:删除操作
      //}}
      let userId = this.props.user.currentUser.userId
      let msgId = this._getMsgId(talkId)
      MessageDataHandle.pushMessage({
        userId: userId, //当前登录账户的id
        talkId: talkId,
        messageUsr: messageObj.user, //消息{ name: curUserName, id: uuid },
        message: messageObj.message,
        time: messageObj.time,
        type: messageObj.type, //消息类型
        system: messageObj.system,
        msgId: msgId,
      })
    }
    // this.refresh()
  }

  _getMsgId = talkId => {
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

  _sendFile = (messageStr, filepath, talkId, msgId) => {
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
      let messageObj = JSON.parse(messageStr)
      let ctime = new Date()
      let time = Date.parse(ctime)
      let informMsg = {
        type: messageObj.type,
        user: messageObj.user,
        time: time,
        system: 0,
        message: {
          type: MSGConstant.MSG_FILE_NOTIFY, //文件接收通知
          message: {
            message: '[文件]',
            fileName: res.fileName,
            fileSize: res.fileSize,
            queueName: res.queueName,
            progress: 0,
          },
        },
      }
      this._sendMessage(JSON.stringify(informMsg), talkId, false)
      Toast.show('分享完成')
    })
  }

  _onReceiveProgress = value => {
    let reduxMessage = this.props.chat[this.props.user.currentUser.userId][
      value.talkId
    ].history[value.msgId]
    reduxMessage.message.message.progress = value.percentage
    MessageDataHandle.editMessage({
      userId: this.props.user.currentUser.userId,
      talkId: value.talkId,
      msgId: value.msgId,
      editItem: reduxMessage,
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

  _receiveMessage(message) {
    if (g_connectService) {
      //  DataHandler.dealWhgjgithMessage(this.props.user.currentUser.userId,message['message']);
      let messageObj = JSON.parse(message['message'])

      let userId = this.props.user.currentUser.userId
      if (userId === messageObj.user.id) {
        //自己的消息，返回
        return
      }

      //message {{
      //type 1:通知类 2.单人消息 3.群组消息
      //message: str
      //use:{name:curUserName,id:uuid}
      //time:time
      //system:n, 0:非系统消息 1：拒收 2:删除操作
      //}}

      let bSystem = false
      //系统消息
      if (messageObj.type > 910 && messageObj.type < 930) {
        bSystem = true
      }

      //个人,或者群组
      if (messageObj.type < 9) {
        //非通知消息，判断是否接收
        let obj = undefined
        if (messageObj.type === 1 || messageObj.type === 4) {
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
            type: 920,
            user: {
              name: this.props.user.currentUser.name,
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
      }

      if (!bSystem) {
        let bUnReadMsg = false
        if (
          !this.curChat ||
          this.curChat.targetUser.id !== messageObj.user.groupID || //个人会话这个ID和groupID是同一个，就用一个吧
          messageObj.type > 9
        ) {
          bUnReadMsg = true
        }

        // let chatHistory = []
        // let msgId = 0
        // if (messageObj.type === 2 && this.props.chat[userId]
        //     && this.props.chat[userId][messageObj.user.groupID]) {
        //     chatHistory = this.props.chat[userId][messageObj.user.groupID]
        //       .history
        // } else if ( this.props.chat[userId] && this.props.chat[userId][messageObj.user.id] ) {
        //     chatHistory = this.props.chat[userId][messageObj.user.id].history
        // }
        // if (chatHistory.length !== 0) {
        //   msgId = chatHistory[chatHistory.length - 1].msgId + 1
        // }
        let msgId = 0
        if (messageObj.type === 2) {
          msgId = this._getMsgId(messageObj.user.groupID)
        } else {
          msgId = this._getMsgId(messageObj.user.id)
        }

        //文件通知消息
        if (messageObj.message.type && messageObj.message.type === MSGConstant.MSG_FILE_NOTIFY) {
          messageObj.message.message.isReceived = 0
        }

        MessageDataHandle.pushMessage({
          userId: userId, //当前登录账户的id
          talkId: messageObj.user.groupID, //会话ID
          messageUsr: messageObj.user, //消息{ name: curUserName, id: uuid },
          message: messageObj.message,
          time: messageObj.time,
          type: messageObj.type, //消息类型
          unReadMsg: bUnReadMsg,
          msgId: msgId,
          isReceived: 0,
        })
      } else {
        //to do 系统消息，做处理机制
        if (messageObj.type === 912) {
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
      }
      // eslint-disable-next-line
      if (this.curChat) {
        if (this.curChat.targetUser.id === messageObj.user.groupID) {
          this.curChat.onReceive(message['message'], bSystem)
        } else {
          this.curChat.showInformSpot(true)
        }
      }

      // this.refresh()
    }
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
      })
    } else if (index === 2) {
      NavigationService.navigate('CreateGroupChat', {
        user: this.props.user.currentUser,
        friend: this,
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
            tabLabel= {getLanguage(this.props.language).Friends.MESSAGES}
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
