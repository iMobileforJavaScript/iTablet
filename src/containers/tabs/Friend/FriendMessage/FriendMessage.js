/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native'

import NavigationService from '../../../NavigationService'
import { scaleSize } from '../../../../utils/screen'
import { Dialog } from '../../../../components'
import { styles } from './Styles'
import { dialogStyles } from './../Styles'
import FriendListFileHandle from '../FriendListFileHandle'

// import Friend from './../Friend'

class FriendMessage extends Component {
  props: {
    navigation: Object,
    user: Object,
    chat: Array,
    friend: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.inFormData = []
    this.chat
    this.state = {
      data: [],
      bRefesh: true,
    }
  }

  refresh = chat => {
    if (chat) {
      if (JSON.stringify(this.chat) !== JSON.stringify(chat)) {
        this.chat = chat
        this.getContacts(this.props)
      }
    }
  }
  componentDidMount() {
    this.chat = this.props.friend.props.chat
    this.getContacts(this.props)
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  // componentDidUpdate(prevProps) {
  //   if (JSON.stringify(prevProps)!==JSON.stringify(this.state)) {
  //     this.getContacts()
  //   }
  // }

  // eslint-disable-next-line
  // componentWillReceiveProps(nextProps) {
  //   this.getContacts(nextProps)
  // }

  getContacts = nextProps => {
    let srcData = []
    this.inFormData = []
    let currentUser
    if (this.chat.hasOwnProperty(nextProps.user.userId)) {
      currentUser = this.chat[nextProps.user.userId]
      for (let key in currentUser) {
        let messageHistory = currentUser[key]
        if (key === '1') {
          //通知类
          for (let i in messageHistory) {
            let messageStruct = messageHistory[i]
            // {messageId:uuid, users: ['白小白'], message: [{msg,time}], type: 2 },
            let messageObj = {}

            //此处应该查询好友或者群组列表
            //通知类
            //通知类消息，直接接收
            messageObj['users'] = []
            messageObj['users'].push(messageStruct.name)
            messageObj['type'] = messageStruct.type
            messageObj['messageId'] = messageStruct.id
            messageObj['message'] = messageStruct.msg
            messageObj['time'] = messageStruct.time
            messageObj['title'] = messageStruct.name
            this.inFormData.push(messageObj)
          }
        } else {
          let obj = FriendListFileHandle.findFromFriendList(key)
          if (obj) {
            let friend = {
              id: key,
              users: [obj.markName],
              message: messageHistory,
              title: obj.markName,
            }
            srcData.push(friend)
          }
        }
      }
    }
    // let ss =  DataHandler.getKeys();
    // srcData = [
    //   {
    //     users: ['白小白'],
    //     message: '你好',
    //     time: 151464465465,
    //     messageType: 2,
    //   },
    //   {
    //     users: ['阿凡达'],
    //     message: 'nice to meet U ',
    //     time: 151464465465,
    //     messageType: 2,
    //   },
    //   {
    //     users: ['白小白', '黄二', 'alice', '文胖'],
    //     message: '黄二:来群聊',
    //     time: 151464465465,
    //     messageType: 3,
    //   },
    //   {
    //     users: ['白小白'],
    //     message: '你好,请求添加您为好友',
    //     time: 151464465465,
    //     messageType: 1,
    //   },
    //   {
    //     users: ['黄二'],
    //     message: '你好,请求添加您为好友',
    //     time: 151464465465,
    //     messageType: 1,
    //   },
    // ]

    this.setState({
      data: srcData,
    })
  }

  _onSectionselect = item => {
    this.target = item
    NavigationService.navigate('Chat', {
      target: item,
      curUser: this.props.user,
      friend: this.props.friend,
    })
  }

  render() {
    //console.log(params.user);
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          style={[
            styles.ItemViewStyle,
            { borderBottomWidth: 1, borderColor: 'rgba(213,213,213,1.0)' },
          ]}
          activeOpacity={0.75}
          onPress={() => {
            NavigationService.navigate('InformMessage', {
              user: this.props.user,
              messageInfo: this.inFormData,
              friend: this.props.friend,
            })
          }}
        >
          <View
            style={[
              styles.ITemHeadTextViewStyle,
              { backgroundColor: 'orange' },
            ]}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              <Text style={styles.ITemHeadTextStyle}>通</Text>
            </View>
          </View>
          <View style={styles.ITemTextViewStyle}>
            <Text style={styles.ITemTextStyle}>消息通知</Text>
          </View>
          <View
            style={{
              marginRight: scaleSize(20),
              flexDirection: 'row',
              justifyContent: 'flex-end',
              flexGrow: 1,
            }}
          >
            <Image
              source={require('../../../../assets/lightTheme/friend/app_friend_arrow.png')}
              style={{ width: scaleSize(30), height: scaleSize(30) }}
            />
          </View>
        </TouchableOpacity>
        <FlatList
          ItemSeparatorComponent={() => {
            return <View style={styles.SectionSeparaLineStyle} />
          }}
          data={this.state.data}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
        {this.renderDialog()}
        {this.renderDialogConfirm()}
      </View>
    )
  }

  _renderItem(item, index) {
    let lastMessage = item['message'][item['message'].length - 1]
    let time = lastMessage.time
    let ctime = new Date(time)
    let timeString =
      '' +
      ctime.getFullYear() +
      '/' +
      (ctime.getMonth() + 1) +
      '/' +
      ctime.getDate() +
      ' ' +
      ctime.getHours() +
      ':' +
      ctime.getMinutes()

    return (
      <TouchableOpacity
        style={styles.ItemViewStyle}
        activeOpacity={0.75}
        onPress={() => {
          this._onSectionselect(item, index)
        }}
      >
        <View style={styles.ITemHeadTextViewStyle}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {this._renderItemHeadView(item)}
          </View>
        </View>
        <View style={styles.ITemTextViewStyle}>
          {this._renderItemTitleView(item)}
          <Text
            style={{
              fontSize: scaleSize(20),
              color: 'grey',
              top: scaleSize(10),
            }}
          >
            {lastMessage.msg}
          </Text>
        </View>
        <View
          style={{
            marginRight: scaleSize(20),
            flexDirection: 'column',
            justifyContent: 'flex-end',
            flexGrow: 1,
          }}
        >
          <Text
            style={{
              fontSize: scaleSize(20),
              color: 'grey',
              textAlign: 'right',
            }}
          >
            {timeString}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderItemHeadView(item) {
    if (item['messageType'] === 3) {
      let texts = []
      for (var i in item['users']) {
        if (i > 4) break
        texts.push(
          <Text
            style={{ fontSize: scaleSize(18), color: 'white', top: 2, left: 1 }}
          >
            {item['users'][i][0].toUpperCase() + ' '}
          </Text>,
        )
      }
      return texts
    } else {
      return <Text style={styles.ITemHeadTextStyle}>{item['users'][0][0]}</Text>
    }
  }
  // eslint-disable-next-line
  _renderItemTitleView(item) {
    return <Text style={styles.ITemTextStyle}>{item['title']}</Text>
  }

  renderDialogConfirm = () => {
    return (
      <Dialog
        ref={ref => (this.dialogConfirm = ref)}
        type={'modal'}
        confirmBtnTitle={'确定'}
        confirmAction={() => this.dialogConfirm.setDialogVisible(false)}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={dialogStyles.dialogBackgroundX}
      />
    )
  }

  renderDialogChildren = () => {
    return (
      <View style={dialogStyles.dialogHeaderViewX}>
        <Image
          source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={dialogStyles.dialogHeaderImgX}
        />
        <Text style={dialogStyles.promptTtileX}>同意对方添加请求 ？</Text>
      </View>
    )
  }
  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={'modal'}
        confirmBtnTitle={'确定'}
        cancelBtnTitle={'取消'}
        confirmAction={this._acceptFriendAdd}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={dialogStyles.dialogBackgroundX}
      >
        {this.renderDialogChildren()}
      </Dialog>
    )
  }
}

export default FriendMessage
