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
    this.masterID = FriendListFileHandle.getGroup(this.targetUser.id).masterID
  }

  _modifyGroupName = value => {
    FriendListFileHandle.modifyGroupList(this.targetUser.id, value)
    this.chat && this.chat.onFriendListChanged()
    let ctime = new Date()
    let time = Date.parse(ctime)
    this.friend._sendMessage(
      JSON.stringify({
        user: {
          name: this.user.nickname,
          id: this.user.userId,
          groupID: this.targetUser.id,
          groupName: FriendListFileHandle.getGroup(this.targetUser.id)
            .groupName,
        },
        type: MsgConstant.MSG_MODIFY_GROUP_NAME,
        time: time,
        message: {
          name: value,
        },
      }),
      this.targetUser.id,
    )
  }

  _leaveGroup = async () => {
    this.leaveDialog.setDialogVisible(false)
    NavigationService.reset()
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
          members: [
            {
              id: this.user.userId,
              name: this.user.nickname,
            },
          ],
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
  }

  _disbandGroup = async () => {
    this.disbandDialog.setDialogVisible(false)
    NavigationService.reset()
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
        type: MsgConstant.MSG_DISBAND_GROUP,
        time: time,
        message: '',
      }),
      this.targetUser.id,
    )
    let members = FriendListFileHandle.readGroupMemberList(this.targetUser.id)
    for (let member in members) {
      SMessageService.exitSession(members[member].id, this.targetUser.id)
    }
    MessageDataHandle.delMessage({
      userId: this.user.userId, //当前登录账户的id
      talkId: this.targetUser.id, //会话ID
    })
    FriendListFileHandle.delFromGroupList(this.targetUser.id)
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
        {this.renderDisbandDialog()}
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

  renderDisbandDialog = () => {
    return (
      <Dialog
        ref={ref => (this.disbandDialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(this.language).Friends.CANCEL}
        confirmAction={this._disbandGroup}
        info={getLanguage(this.language).Friends.DEL_GROUP_CONFIRM2}
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
                this._modifyGroupName(value)
                NavigationService.goBack('InputPage')
              },
            })
          }}
        />
        <TouchableItemView
          item={{
            //查看群员
            // image: getThemeAssets().friend.friend_edit,
            text: getLanguage(this.language).Friends.LIST_MEMBERS,
          }}
          onPress={() => {
            NavigationService.navigate('GroupMemberList', {
              user: this.user,
              friend: this.friend,
              language: this.language,
              groupID: this.targetUser.id,
              mode: 'view',
              cb: () => {},
            })
          }}
        />
        <TouchableItemView
          item={{
            //添加群员
            // image: getThemeAssets().friend.friend_edit,
            text: getLanguage(this.language).Friends.ADD_MEMBER,
          }}
          onPress={() => {
            NavigationService.navigate('CreateGroupChat', {
              user: this.user,
              friend: this.friend,
              language: this.language,
              groupID: this.targetUser.id,
              cb: () => {},
            })
          }}
        />
        {this.user.userId === this.masterID ? (
          <TouchableItemView
            item={{
              //移除群员
              // image: getThemeAssets().friend.friend_edit,
              text: getLanguage(this.language).Friends.DELETE_MEMBER,
            }}
            onPress={() => {
              NavigationService.navigate('GroupMemberList', {
                user: this.user,
                friend: this.friend,
                language: this.language,
                groupID: this.targetUser.id,
                mode: 'select',
                cb: members => {
                  this.friend.removeGroupMember(this.targetUser.id, members)
                },
              })
            }}
          />
        ) : null}
        {/* {退出或解散群聊} */}
        <TouchableOpacity
          style={{ alignItems: 'center', paddingVertical: scaleSize(20) }}
          onPress={() => {
            if (this.user.userId === this.masterID) {
              this.disbandDialog.setDialogVisible(true)
            } else {
              this.leaveDialog.setDialogVisible(true)
            }
          }}
        >
          <Text style={{ color: 'red', fontSize: scaleSize(26) }}>
            {this.user.userId === this.masterID
              ? getLanguage(this.language).Friends.DISBAND_GROUP
              : getLanguage(this.language).Friends.LEAVE_GROUP}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

export default ManageGroup
