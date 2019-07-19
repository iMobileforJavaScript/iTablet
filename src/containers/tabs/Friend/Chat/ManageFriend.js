import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { Container } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'
import TouchableItemView from '../TouchableItemView'
import { getThemeAssets } from '../../../../assets'
import { scaleSize, Toast } from '../../../../utils'
import FriendListFileHandle from '../FriendListFileHandle'
import MessageDataHandle from '../MessageDataHandle'
import { SimpleDialog } from '../index'
// import MsgConstant from '../MsgConstant'

class ManageFriend extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.friend = this.props.navigation.getParam('friend')
    this.user = this.props.navigation.getParam('user')
    this.targetId = this.props.navigation.getParam('targetId')
    this.targetUser = this.friend.getTargetUser(this.targetId)
    this.language = global.language
    this.chat = this.props.navigation.getParam('chat')
    this.state = {
      contacts: [],
      coworkMode: global.coworkMode,
    }
  }

  _deleteFriend = async () => {
    // let ctime = new Date()
    // let time = Date.parse(ctime)
    // await this.friend._sendMessage(JSON.stringify({
    //   user:{
    //     name: this.user.name,
    //     id: this.user.id,
    //     groupId: this.targetUser.id,
    //     groupName:
    //   },
    //   type: MsgConstant.MSG_REMOVE_MEMBER,
    //   time: time,
    //   message:'',
    // }), this.targetUser.id)
    MessageDataHandle.delMessage({
      userId: this.user.userId, //当前登录账户的id
      talkId: this.targetUser.id, //会话ID
    })
    FriendListFileHandle.delFromFriendList(this.targetUser.id)
    NavigationService.popToTop()
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this.renderSimpleDialog()}
        {this.renderSettings()}
      </Container>
    )
  }

  renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
  }

  renderSettings = () => {
    return (
      <ScrollView>
        {!this.state.coworkMode && !this.chat.action && (
          <TouchableItemView
            item={{
              //地图协作
              image: getThemeAssets().friend.friend_map,
              text: getLanguage(global.language).Friends.COWORK,
            }}
            onPress={() => {
              NavigationService.navigate('SelectModule', {
                callBack: value => {
                  this.friend.setCurMod(value)
                  NavigationService.goBack('ManageFriend')
                  this.setState({ coworkMode: true })
                  this.chat.setCoworkMode(true)
                  global.coworkMode = true
                },
              })
            }}
          />
        )}
        {this.state.coworkMode ? (
          <TouchableItemView
            item={{
              //退出协作
              image: getThemeAssets().friend.friend_map,
              text: getLanguage(global.language).Friends.EXIT_COWORK,
            }}
            onPress={() => {
              this.chat.back()
              // this.friend.setCurMap(undefined)
              // this.setState({coworkMode : false})
              // this.chat.setCoworkMode(false)
            }}
          />
        ) : null}
        <TouchableItemView
          item={{
            //发消息
            image: getThemeAssets().friend.friend_message,
            text: getLanguage(this.language).Friends.SEND_MESSAGE,
          }}
          onPress={() => {
            if (this.chat) {
              NavigationService.goBack('ManageFriend')
            } else {
              this.props.navigation.navigate('Chat', {
                targetId: this.targetId,
                curUser: this.user,
                friend: this.friend,
              })
            }
          }}
        />
        <TouchableItemView
          item={{
            //设置备注
            image: getThemeAssets().friend.friend_edit,
            text: getLanguage(this.language).Friends.SET_MARKNAME,
          }}
          onPress={() => {
            NavigationService.navigate('InputPage', {
              placeholder: FriendListFileHandle.getFriend(this.targetUser.id)
                .markName,
              headerTitle: getLanguage(this.language).Friends.SET_MARKNAME,
              cb: value => {
                let len = 0
                for (var i = 0; i < value.length; i++) {
                  if (value.charCodeAt(i) > 127 || value.charCodeAt(i) == 94) {
                    len += 2
                  } else {
                    len++
                  }
                }
                if (len > 40) {
                  Toast.show(
                    getLanguage(this.language).Friends.EXCEED_NAME_LIMIT,
                  )
                  return
                }
                FriendListFileHandle.modifyFriendList(this.targetUser.id, value)
                this.chat && this.chat.onFriendListChanged()
                NavigationService.goBack('InputPage')
              },
            })
          }}
        />
        {/* {删除好友} */}
        <TouchableOpacity
          style={{ alignItems: 'center', paddingVertical: scaleSize(20) }}
          onPress={() => {
            this.SimpleDialog.setText(
              getLanguage(this.language).Friends.ALERT_DEL_FRIEND,
            )
            this.SimpleDialog.setConfirm(() => {
              this.SimpleDialog.setVisible(false)
              this._deleteFriend()
            })
            this.SimpleDialog.setVisible(true)
          }}
        >
          <Text style={{ color: 'red', fontSize: scaleSize(26) }}>
            {getLanguage(this.language).Friends.DELETE_FRIEND}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

export default ManageFriend
