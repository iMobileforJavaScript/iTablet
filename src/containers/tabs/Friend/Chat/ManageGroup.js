import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity, FlatList } from 'react-native'
import { Container, Dialog } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'
import TouchableItemView from '../TouchableItemView'
import { getThemeAssets } from '../../../../assets'
import { scaleSize } from '../../../../utils'
import FriendListFileHandle from '../FriendListFileHandle'
import MessageDataHandle from '../MessageDataHandle'
import MsgConstant from '../MsgConstant'
import { SMessageService } from 'imobile_for_reactnative'

class ManageGroup extends Component {
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
      contacts: this.targetUser.users,
    }
  }

  _leaveGroup = async () => {
    let ctime = new Date()
    let time = Date.parse(ctime)
    await this.friend._sendMessage(
      JSON.stringify({
        user: {
          name: this.user.nickname,
          id: this.user.userId,
          groupID: this.targetUser.id,
          groupName: FriendListFileHandle.getGroup(this.targetUser.id)
            .groupName,
        },
        type: MsgConstant.MSG_REMOVE_MEMBER,
        time: time,
        message: {
          user: {
            id: this.user.userId,
            name: this.user.nickname,
          },
        },
      }),
      this.targetUser.id,
    )
    SMessageService.exitSession(this.user.userId, this.targetUser.id)
    MessageDataHandle.delMessage({
      userId: this.user.userId, //当前登录账户的id
      talkId: this.targetUser.id, //会话ID
    })
    FriendListFileHandle.delFromGroupList(this.targetUser.id)
    this.leaveDialog.setDialogVisible(false)
    NavigationService.reset()
  }

  _renderMember = ({ item }) => {
    return (
      <TouchableItemView
        item={{
          // image: getThemeAssets().friend.friend_edit,
          text: item.name,
        }}
        onPress={() => {
          // NavigationService.navigate('ManageFriend', {
          //   ...this.props.navigation.state.params,
          //   targetUser: item,
          // })
        }}
      />
    )
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
        {this.renderLeaveDialog()}
        {this.renderSettings()}
      </Container>
    )
  }

  renderLeaveDialog = () => {
    return (
      <Dialog
        ref={ref => (this.leaveDialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(this.language).Friends.CANCEL}
        confirmAction={this._leaveGroup}
        info={getLanguage(this.language).Friends.DEL_GROUP_CONFIRM}
      />
    )
  }

  renderSettings = () => {
    return (
      <ScrollView>
        {/* {好友列表} */}
        <FlatList
          style={{
            top: scaleSize(10),
          }}
          data={this.state.contacts}
          renderItem={this._renderMember}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableItemView
          item={{
            //发消息
            image: getThemeAssets().friend.friend_message,
            text: getLanguage(this.language).Friends.SEND_MESSAGE,
          }}
          onPress={() => {
            NavigationService.goBack('ManageGroup')
          }}
        />
        <TouchableItemView
          item={{
            //设置备注
            image: getThemeAssets().friend.friend_edit,
            text: getLanguage(this.language).Friends.SET_GROUPNAME,
          }}
          onPress={() => {
            NavigationService.navigate('InputPage', {
              placeholder: FriendListFileHandle.getGroup(this.targetUser.id)
                .groupName,
              headerTitle: getLanguage(this.language).Friends.SET_GROUPNAME,
              cb: value => {
                FriendListFileHandle.modifyGroupList(this.targetUser.id, value)
                this.chat && this.chat.onFriendListChanged()
                NavigationService.goBack('InputPage')
              },
            })
          }}
        />
        {/* {退出群聊} */}
        <TouchableOpacity
          style={{ alignItems: 'center', paddingVertical: scaleSize(20) }}
          onPress={() => {
            this.leaveDialog.setDialogVisible(true)
          }}
        >
          <Text style={{ color: 'red', fontSize: scaleSize(26) }}>
            {getLanguage(this.language).Friends.LEAVE_GROUP}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

export default ManageGroup
