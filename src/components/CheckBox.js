/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import { getPublicAssets } from '../assets'

export default class CheckBox extends React.Component {
  props: {
    onChange: () => {},
    checkStatus: string,
    style?: Object,
    imgStyle?: Object,
    disable?: boolean,
  }

  static defaultProps = {
    disable: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  _btnPress = () => {
    if (this.props.disable) return
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
    if (!this.props.disable) {
      icon = this.state.checked
        ? getPublicAssets().common.icon_check
        : getPublicAssets().common.icon_uncheck
    } else {
      icon = this.state.checked
        ? getPublicAssets().common.icon_check_disable
        : getPublicAssets().common.icon_uncheck_disable
    }
    return (
      <TouchableOpacity
        disable={this.props.disable}
        style={[styles.btn, this.props.style]}
        onPress={this._btnPress}
        underlayColor={'transparent'}
      >
        <Image
          resizeMode={'contain'}
          style={[styles.btn_image, this.props.imgStyle]}
          source={icon}
        />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
    borderRadius: 5,
    backgroundColor: 'transparent',
  },
  btn_image: {
    height: 30,
    width: 30,
  },
})
