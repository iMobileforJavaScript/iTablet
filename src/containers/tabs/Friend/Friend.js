/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import Container from '../../../components/Container'
import { Dimensions, TouchableOpacity, Image, View, Text } from 'react-native'
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view'

import { SMessageService } from 'imobile_for_reactnative'
import NavigationService from '../../NavigationService'
import { scaleSize } from '../../../utils/screen'
import { Toast } from '../../../utils/index'
import { styles } from './Styles'
//import color from '../../../styles/color'
//import FetchUtils from '../../../utils/FetchUtils'
import { getThemeAssets } from '../../../assets'
import FriendMessage from './FriendMessage/FriendMessage'
import FriendGroup from './FriendGroup/FriendGroup'
import FriendList from './FriendList/FriendList'
//import DataHandler from './DataHandler'
import UserType from '../../../constants/UserType'

let searchImg = getThemeAssets().friend.friend_search
let addFriendImg = getThemeAssets().friend.friend_add

let sIP = '192.168.0.106'
let sPort = 5672
let sHostName = '/'
let sUserName = 'androidtest'
let sPassword = 'androidtest'
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
    // setInterval(this._receiveMessage,500);
    this.state = {
      data: [{}],
      isRefresh: false,
      progressWidth: this.screenWidth * 0.4,
      isLoadingData: false,
    }
  }

  componentDidMount() {}

  componentWillUnmount() {
    this._disconnectService()
  }
  // eslint-disable-next-line
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props === nextProps) {
      return false
    }
    return true
  }
  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
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
  }

  //message {{
  //type 1+:通知类(暂定大于10,10申请添加,11同意添加)  2.单人消息 3.群组消息
  //message: str
  //use:{name:curUserName,id:uuid}
  //time:time
  //}}

  //targetId
  static _sendMessage = (messageStr, uuid) => {
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
          SMessageService.sendMessage(messageStr, uuid)
        })
        .catch(() => {
          Toast.show('连接消息服务失败！')
        })
      Toast.show('未能连接消息服务！')
    } else {
      SMessageService.sendMessage(messageStr, uuid)
    }
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
      //}}
      let userId = this.props.user.currentUser.userId
      // if(messageObj.type > 9){
      //   userId = 1;
      // }
      this.props.addChat &&
        this.props.addChat({
          userId: userId,
          messageUsr: messageObj.user,
          message: messageObj.message,
          time: messageObj.time,
          type: messageObj.type,
        })
      // eslint-disable-next-line
      console.warn(message)
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
            /**
             * [
             *    {
             *        userID,
             *       chat:[
             *           {
             *             userInfo: {},
             *             history: [{msg, time}]
             *           }
             *       ]
             *   }
             *
             * ]
             * @type {any}
             */
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
        />
        <FriendList
          ref={ref => (this.friendList = ref)}
          tabLabel="好友"
          user={this.props.user.currentUser}
        />
        <FriendGroup
          ref={ref => (this.friendGroup = ref)}
          tabLabel="群组"
          user={this.props.user.currentUser}
        />
      </ScrollableTabView>
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
