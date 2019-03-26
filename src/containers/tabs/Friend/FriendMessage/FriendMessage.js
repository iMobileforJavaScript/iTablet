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
    friend: Object,
    user: Object,
    chat: Array,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.inFormData = []

    //this.chat;
    this.state = {
      data: [],
      bRefesh: true,
      hasInformMsg: 0,
    }
  }

  // refresh = () =>
  // {
  //   if (JSON.stringify(this.chat) !== JSON.stringify(this.props.friend.props.chat)) {
  //     this.chat = this.props.friend.props.chat;
  //     this.getContacts(this.props)
  //   }
  // }
  componentDidMount() {
    // this.chat = this.props.friend.props.chat
    this.getContacts()
  }

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

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat)
    ) {
      this.getContacts()
    }
  }

  // eslint-disable-next-line
  // componentWillReceiveProps(nextProps) {
  //   this.getContacts(nextProps)
  // }

  getContacts = () => {
    let srcData = []
    this.inFormData = []
    let currentUser
    if (this.props.chat.hasOwnProperty(this.props.user.userId)) {
      currentUser = this.props.chat[this.props.user.userId]
      for (let key in currentUser) {
        let messageHistory = currentUser[key].history
        let unReadMsg = currentUser[key].unReadMsg
        if (key === '1') {
          this.setState({ hasInformMsg: unReadMsg })
          // this.hasInformMsg = unReadMsg;
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
            messageObj['unReadMsg'] = messageStruct.unReadMsg
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
              unReadMsg: unReadMsg,
            }
            srcData.push(friend)
          }
        }
      }
    }
    this.inFormData = this.inFormData.sort((obj1, obj2) => {
      let time1 = obj1.time
      let time2 = obj2.time
      return time2 - time1
    })
    srcData = srcData.sort((obj1, obj2) => {
      let time1 = obj1['message'][obj1['message'].length - 1].time
      let time2 = obj2['message'][obj2['message'].length - 1].time
      return time2 - time1
    })
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
        {this._renderInformItem()}
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

  _renderInformItem() {
    return (
      <TouchableOpacity
        style={[
          styles.ItemViewStyle,
          { borderBottomWidth: 1, borderColor: 'rgba(213,213,213,1.0)' },
        ]}
        activeOpacity={0.75}
        onPress={() => {
          this.props.friend.setReadTalk(this.props.user.userId, 1)
          NavigationService.navigate('InformMessage', {
            user: this.props.user,
            messageInfo: this.inFormData,
            friend: this.props.friend,
          })
        }}
      >
        <View
          style={[styles.ITemHeadTextViewStyle, { backgroundColor: 'orange' }]}
        >
          {this.state.hasInformMsg > 0 ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'red',
                justifyContent: 'center',
                height: scaleSize(25),
                width: scaleSize(25),
                borderRadius: scaleSize(25),
                top: scaleSize(-6),
                right: scaleSize(-12),
              }}
            >
              <Text
                style={{
                  fontSize: scaleSize(20),
                  color: 'white',
                  textAlign: 'center',
                }}
              >
                {this.state.hasInformMsg}
              </Text>
            </View>
          ) : null}
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
    )
  }
  _renderItem(item, index) {
    if (item && item['message'].length > 0) {
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
            {item.unReadMsg > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  backgroundColor: 'red',
                  justifyContent: 'center',
                  height: scaleSize(25),
                  width: scaleSize(25),
                  borderRadius: scaleSize(25),
                  top: scaleSize(-6),
                  right: scaleSize(-12),
                }}
              >
                <Text
                  style={{
                    fontSize: scaleSize(20),
                    color: 'white',
                    textAlign: 'center',
                  }}
                >
                  {item.unReadMsg}
                </Text>
              </View>
            ) : null}
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
