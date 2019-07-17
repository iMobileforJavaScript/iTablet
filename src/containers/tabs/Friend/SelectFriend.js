import React, { Component } from 'react'
import FriendList from './FriendList/FriendList'
import { Container } from '../../../components'
import { getLanguage } from '../../../language/index'

class SelectFriend extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.user = this.props.navigation.getParam('user')
    this.callBack = this.props.navigation.getParam('callBack')
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Friends.TITLE_CHOOSE_FRIEND,
          navigation: this.props.navigation,
        }}
      >
        <FriendList
          ref={ref => (this.friendList = ref)}
          language={global.language}
          user={this.user.currentUser}
          friend={global.getFriend()}
          callBack={targetId => {
            this.callBack(targetId)
          }}
        />
      </Container>
    )
  }
}

export default SelectFriend
