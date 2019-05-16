import React, { Component } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { Container } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'
import TouchableItemView from '../TouchableItemView'
import { getThemeAssets } from '../../../../assets'
import { scaleSize } from '../../../../utils'

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
    this.state = {
      contacts: [],
    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.targetUser['title'],
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
            image: getThemeAssets().friend.friend_message,
            text: getLanguage(this.language).Friends.SEND_MESSAGE,
          }}
          onPress={() => {
            NavigationService.goBack('ManageGroup')
          }}
        />
        <TouchableItemView
          item={{
            image: getThemeAssets().friend.friend_edit,
            text: getLanguage(this.language).Friends.SET_MARKNAME,
          }}
          onPress={() => {}}
        />
        <TouchableOpacity
          style={{ alignItems: 'center', paddingVertical: scaleSize(20) }}
          onPress={() => {}}
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
