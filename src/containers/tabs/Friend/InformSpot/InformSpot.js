/**
 * Created by imobile-xzy on 2019/3/23.
 */

import React, { Component } from 'react'
import { scaleSize } from '../../../../utils/screen'
import { View } from 'react-native'
export default class InformSpot extends Component {
  props: {
    navigation: Object,
    user: Object,
    chat: Array,
    addChat: () => {},
  }

  constructor(props) {
    super(props)
    //this.chat;
    this.state = {
      bRefesh: true,
    }
  }

  componentDidMount() {
    // this.chat = this.props.friend.props.chat
    //  this.getContacts()
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
      //this.getContacts()
    }
  }
  render() {
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          justifyContent: 'center',
          height: scaleSize(15),
          width: scaleSize(15),
          borderRadius: scaleSize(25),
          top: scaleSize(0),
          right: scaleSize(0),
        }}
      />
    )
  }
}
