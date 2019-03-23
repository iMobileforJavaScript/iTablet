/**
 * Created by imobile-xzy on 2019/3/23.
 */

import React, { Component } from 'react'
import { scaleSize } from '../../utils'
import { View } from 'react-native'
export default class InformSpot extends Component {
  props: {
    navigation: Object,
    user: Object,
    chat: Array,
    addChat: () => {},
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
