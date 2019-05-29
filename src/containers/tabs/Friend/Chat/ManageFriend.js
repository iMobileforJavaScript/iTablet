import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { Container, Dialog } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'
import TouchableItemView from '../TouchableItemView'
import { getThemeAssets } from '../../../../assets'
import { scaleSize } from '../../../../utils'
import FriendListFileHandle from '../FriendListFileHandle'
import MessageDataHandle from '../MessageDataHandle'
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
    this.targetUser = this.props.navigation.getParam('targetUser')
    this.language = this.props.navigation.getParam('language')
    this.chat = this.props.navigation.getParam('chat')
    this.state = {
      contacts: [],
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
    this.delDialog.setDialogVisible(false)
    NavigationService.reset()
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
        {this.renderDelDialog()}
        {this.renderSettings()}
      </Container>
    )
  }

  renderDelDialog = () => {
    return (
      <Dialog
        ref={ref => (this.delDialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(this.language).Friends.CANCEL}
        confirmAction={this._deleteFriend}
        info={getLanguage(this.language).Friends.ALERT_DEL_FRIEND}
      />
    )
  }

  renderSettings = () => {
    return (
      <ScrollView>
        <TouchableItemView
          item={{
            //发消息
            image: getThemeAssets().friend.friend_message,
            text: getLanguage(this.language).Friends.SEND_MESSAGE,
          }}
          onPress={() => {
            NavigationService.goBack('ManageFriend')
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
            this.delDialog.setDialogVisible(true)
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