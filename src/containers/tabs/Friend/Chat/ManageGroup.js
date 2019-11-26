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
import MsgConstant from '../MsgConstant'
import { SMessageService } from 'imobile_for_reactnative'
import { SimpleDialog } from '../index'

class ManageGroup extends Component {
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
    NavigationService.popToTop()
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
    NavigationService.popToTop()
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
    for (let member = 0; member < members.length; member++) {
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
        <TouchableItemView
          //发消息
          image={getThemeAssets().friend.new_chat}
          text={getLanguage(this.language).Friends.SEND_MESSAGE}
          onPress={() => {
            if (this.chat) {
              NavigationService.goBack('ManageGroup')
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
          //设置备注
          image={getThemeAssets().friend.friend_edit}
          text={getLanguage(this.language).Friends.SET_GROUPNAME}
          onPress={() => {
            NavigationService.navigate('InputPage', {
              placeholder: FriendListFileHandle.getGroup(this.targetUser.id)
                .groupName,
              headerTitle: getLanguage(this.language).Friends.SET_GROUPNAME,
              type: 'name',
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
                this._modifyGroupName(value)
                NavigationService.goBack('InputPage')
              },
            })
          }}
        />
        <TouchableItemView
          //查看群员
          image={getThemeAssets().friend.friend_group}
          text={getLanguage(this.language).Friends.LIST_MEMBERS}
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
          //添加群员
          image={getThemeAssets().friend.friend_group}
          text={getLanguage(this.language).Friends.ADD_MEMBER}
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
            //移除群员
            image={getThemeAssets().friend.friend_group}
            text={getLanguage(this.language).Friends.DELETE_MEMBER}
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
              this.SimpleDialog.setText(
                getLanguage(this.language).Friends.DEL_GROUP_CONFIRM2,
              )
              this.SimpleDialog.setConfirm(() => {
                this.SimpleDialog.setVisible(false)
                this._disbandGroup()
              })
            } else {
              this.SimpleDialog.setText(
                getLanguage(this.language).Friends.DEL_GROUP_CONFIRM,
              )
              this.SimpleDialog.setConfirm(() => {
                this.SimpleDialog.setVisible(false)
                this._leaveGroup()
              })
            }
            this.SimpleDialog.setVisible(true)
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
