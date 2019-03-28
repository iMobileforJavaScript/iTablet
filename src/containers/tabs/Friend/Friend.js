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
import { SOnlineService, SMessageService } from 'imobile_for_reactnative'
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

let searchImg = getThemeAssets().friend.friend_search
let addFriendImg = getThemeAssets().friend.friend_add

// let sIP = '192.168.0.106'
// let sPort = 5672
// let sHostName = '/'
// let sUserName = 'androidtest'
// let sPassword = 'androidtest'
let sIP = '111.202.121.144'
let sPort = 5672
let sHostName = '/'
let sUserName = 'admin'
let sPassword = 'admin'

let g_curUserId = ''
let g_connectService = false
export default class Friend extends Component {
  props: {
    navigation: Object,
    user: Object,
    chat: Array,
    addChat: () => {},
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.bHasUserInfo = false
    this.friendMessage = {}
    this.friendList = {}
    this.friendGroup = {}
    this.curChat = undefined
    this.state = {
      data: [{}],
      isRefresh: false,
      progressWidth: this.screenWidth * 0.4,
      isLoadingData: false,
    }
  }

  componentDidMount() {}

  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  refreshList = () => {
    if (this.friendList && this.friendList.refresh) this.friendList.refresh()
    if (this.friendGroup && this.friendGroup.refresh) this.friendGroup.refresh()
  }

  setCurChat = chat => {
    this.curChat = chat
    if (this.curChat) {
      this.setReadTalk(
        this.props.user.currentUser.userId,
        this.curChat.targetUser.id,
      )
    }
  }
  setReadTalk = (userId, talkId) => {
    this.props.addChat &&
      this.props.addChat({
        //清除未读信息
        userId: userId, //当前登录账户的id
        talkId: talkId, //会话ID
      })
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
    this._disconnectService()
  }
  // eslint-disable-next-line
  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
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
        sIP,
        sPort,
        sHostName,
        sUserName,
        sPassword,
        g_curUserId,
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
      this.props.addChat &&
        this.props.addChat({
          userId: userId, //当前登录账户的id
          talkId: talkId,
          messageUsr: messageObj.user, //消息{ name: curUserName, id: uuid },
          message: messageObj.message,
          time: messageObj.time,
          type: messageObj.type, //消息类型
          system: messageObj.system,
        })
    }
    // this.refresh()
  }

  _sendFile = (messageStr, filepath, talkId) => {
    let connectInfo = {
      serverIP : sIP,
      port : sPort,
      hostName : sHostName,
      userName : sUserName,
      passwd : sPassword,
      userID : g_curUserId,
    }
    SMessageService.sendFile(JSON.stringify(connectInfo), messageStr, filepath, talkId)
    .then(res => {
        let messageObj = JSON.parse(messageStr)
        let ctime = new Date()
        let time = Date.parse(ctime)
        let fileinform = {
          message: "[长按接收文件" + res.fileName + "]",
          type: 4,//文件接收通知
          user: messageObj.user,
          time: time,
          system: 0,
          fileName: res.fileName,
          queueName: res.queueName
        }
        this._sendMessage(JSON.stringify(fileinform), talkId, false)
    })
  }

  _receiveMessage = message => {
    if (g_connectService) {
      //  DataHandler.dealWithMessage(this.props.user.currentUser.userId,message['message']);
      let messageObj = JSON.parse(message['message'])
      //message {{
      //type 1:通知类 2.单人消息 3.群组消息
      //message: str
      //use:{name:curUserName,id:uuid}
      //time:time
      //system:n, 0:非系统消息 1：拒收 2:删除操作
      //}}
      if (messageObj.type < 9) {
        //非通知消息，判断是否接收
        let obj = FriendListFileHandle.findFromFriendList(messageObj.user.id)
        if (!obj) {
          //非好友
          let ctime = new Date()
          let time = Date.parse(ctime)
          let message = {
            message: '对方还未添加您为好友',
            type: 1,
            user: {
              name: this.props.user.currentUser.name,
              id: this.props.user.currentUser.userId,
            },
            time: time,
            system: 1,
          }
          SMessageService.sendMessage(
            JSON.stringify(message),
            messageObj.user.id,
          )
          return
        }
      }

      let userId = this.props.user.currentUser.userId
      if (userId === messageObj.user.id) {
        //自己的消息，返回
        return
      }

      if (messageObj.system === 0) {
        let bUnReadMsg = false
        if (
          !this.curChat ||
          this.curChat.targetUser.id !== messageObj.user.id ||
          messageObj.type > 9
        ) {
          bUnReadMsg = true
        }

        this.props.addChat &&
          this.props.addChat({
            userId: userId, //当前登录账户的id
            talkId: messageObj.user.id, //会话ID
            messageUsr: messageObj.user, //消息{ name: curUserName, id: uuid },
            message: messageObj.message,
            time: messageObj.time,
            type: messageObj.type, //消息类型
            unReadMsg: bUnReadMsg,
          })
      } else {
        if (messageObj.system > 1) {
          //to do 系统消息，做处理机制
          return
        }
      }
      // eslint-disable-next-line
      if (this.curChat && this.curChat.onReceive) {
        this.curChat.onReceive(message['message'])
      }
      // this.refresh()
    }
  }
  _connectService = () => {
    if (g_connectService === false) {
      SMessageService.connectService(
        sIP,
        sPort,
        sHostName,
        sUserName,
        sPassword,
        this.props.user.currentUser.userId,
      )
        .then(res => {
          if (!res) {
            Toast.show('连接消息服务失败！')
          } else {
            g_curUserId = this.props.user.currentUser.userId
            g_connectService = true
            if (this.bHasUserInfo === true) {
              SMessageService.startReceiveMessage(
                this.props.user.currentUser.userId,
                { callback: this._receiveMessage },
              )
            }
          }
        })
        .catch(() => {
          Toast.show('连接消息服务失败！')
        })
    }
  }

  _disconnectService = async () => {
    SMessageService.disconnectionService()
    SMessageService.stopReceiveMessage()
    g_connectService = false
    g_curUserId = ''
  }

  render() {
    this.bHasUserInfo = false
    if (this.props.user.currentUser.hasOwnProperty('userType') === true) {
      let usrType = this.props.user.currentUser.userType
      this.bHasUserInfo = usrType === UserType.COMMON_USER ? true : false
    }

    let bHasUserInfo = false
    if (this.props.user.currentUser.hasOwnProperty('userType') === true) {
      let usrType = this.props.user.currentUser.userType
      bHasUserInfo = usrType === UserType.COMMON_USER ? true : false
      if (bHasUserInfo === true) {
        this._connectService()
      } else {
        SMessageService.stopReceiveMessage()
      }
    }

    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '好友',
          headerLeft:
            this.bHasUserInfo === true ? (
              <TouchableOpacity
                style={styles.addFriendView}
                onPress={() => {
                  NavigationService.navigate('AddFriend', {
                    user: this.props.user.currentUser,
                    friend: this,
                  })
                }}
              >
                <Image source={addFriendImg} style={styles.addFriendImg} />
              </TouchableOpacity>
            ) : null,
          headerRight:
            this.bHasUserInfo === true ? (
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
        {this.bHasUserInfo === true ? this.renderTab() : this.renderNOFriend()}
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
            tabLabel="消息"
            user={this.props.user.currentUser}
            chat={this.props.chat}
            friend={this}
          />
          <FriendList
            ref={ref => (this.friendList = ref)}
            tabLabel="好友"
            user={this.props.user.currentUser}
            friend={this}
          />
          <FriendGroup
            ref={ref => (this.friendGroup = ref)}
            tabLabel="群组"
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
            亲,您还没有好友关系哦
          </Text>
        </View>
      </View>
    )
  }
}
