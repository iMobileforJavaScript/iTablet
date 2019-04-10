/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import { getPublicAssets } from '../assets'
import { CheckStatus } from '../constants'

const bgColor = 'transparent'

export default class CheckBox extends React.PureComponent {
  props: {
    onChange: () => {},
    checkStatus: string,
    style?: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: false,
    }
  }

  _btnPress = () => {
    this.setState(
      oldState => {
        let newState = !oldState.checked
        return {
          checked: newState,
        }
      },
      (() => {
        this.props.onChange(this.state.checked)
      }).bind(this),
    )
  }

  render() {
    let icon
    switch (this.props.checkStatus) {
      case CheckStatus.CHECKED:
        icon = getPublicAssets().common.icon_radio_selected
        break
      case CheckStatus.UN_CHECK_DISABLE:
        icon = getPublicAssets().common.icon_radio_unselected
        break
      case CheckStatus.CHECKED_DISABLE:
        icon = getPublicAssets().common.icon_radio_selected_disable
        break
      case CheckStatus.UN_CHECK:
        icon = getPublicAssets().common.icon_radio_unselected_disable
        break
    }
    return (
      <TouchableOpacity
        style={[styles.btn]}
        onPress={this._btnPress}
        underlayColor={bgColor}
      >
        <Image style={[styles.btn_image]} source={icon} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 20,
    width: 20,
    borderRadius: 5,
    backgroundColor: bgColor,
  },
  btn_image: {
    height: 20,
    width: 20,
  },
})
