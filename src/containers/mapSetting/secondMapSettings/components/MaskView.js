/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React from 'react'

import { TouchableOpacity } from 'react-native'
import { color } from '../../../tabs/Mine/MyService/Styles'

export default class MaskView extends React.Component {
  props: {
    device: Object,
    callback: () => {},
  }

  constructor(props) {
    super(props)
  }

  render() {
    //todo height还需要减去虚拟按键栏的高度
    // let height = this.props.device.height - HEADER_HEIGHT + 2
    return (
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: color.UNDERLAYCOLOR,
        }}
        activeOpacity={0.1}
        onPress={() => {
          this.props.callback()
        }}
      />
    )
  }
}
