import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { Container } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'
import TouchableItemView from '../TouchableItemView'
import { getThemeAssets } from '../../../../assets'
import { scaleSize } from '../../../../utils'
import FriendListFileHandle from '../FriendListFileHandle'

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

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this.renderSettings()}
      </Container>
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
          onPress={() => {}}
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
