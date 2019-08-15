/**
 * Created by imobile-xzy on 2019/3/23.
 */

import React, { Component } from 'react'
import { scaleSize } from '../../../../utils'
import { View, Platform } from 'react-native'
export default class InformSpot extends Component {
  props: {
    navigation: Object,
    user: Object,
    chat: Array,
    addChat: () => {},
    style: Object,
    device: Object,
  }

  constructor(props) {
    super(props)
    //this.chat;
    this.state = {
      bRefesh: false,
    }
  }

  componentDidMount() {
    // this.chat = this.props.friend.props.chat
    this.getContacts()
  }

  getContacts = () => {
    let bInform = false
    let currentUser
    if (this.props.chat.hasOwnProperty(this.props.user.currentUser.userId)) {
      currentUser = this.props.chat[this.props.user.currentUser.userId]
      for (let key in currentUser) {
        bInform = currentUser[key].unReadMsg
        if (bInform) break
      }
    }

    this.setState({
      bRefesh: bInform,
    })
  }
  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat) ||
      JSON.stringify(prevProps.device) !== JSON.stringify(this.props.device) ||
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
  render() {
    let right =
      Platform.OS === 'android'
        ? this.props.device.width > this.props.device.height
          ? scaleSize(100)
          : scaleSize(50)
        : 0
    return this.state.bRefesh ? (
      <View
        style={[
          {
            position: 'absolute',
            backgroundColor: 'red',
            justifyContent: 'center',
            height: scaleSize(15),
            width: scaleSize(15),
            borderRadius: scaleSize(25),
            top: scaleSize(0),
            right: right,
          },
          this.props.style,
        ]}
      />
    ) : null
  }
}
