/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { Text, StyleSheet, TouchableOpacity } from 'react-native'

import styles from './styles'

export default class Button extends PureComponent {
  props: {
    style?: StyleSheet,
    titleStyle?: StyleSheet,
    title: string,
    activeOpacity?: number,
    type?: string,
    onPress: () => {},
  }

  static defaultProps = {
    activeOpacity: 0.8,
    type: 'BLUE',
  }

  constructor(props) {
    super(props)
  }

  action = () => {
    this.props.onPress && this.props.onPress()
  }

  render() {
    let color, textColor
    switch (this.props.type) {
      case 'GRAY':
        color = styles.gray
        textColor = 'white'
        break
      case 'RED':
        color = styles.red
        textColor = 'white'
        break
      case 'BLUE':
      default:
        color = styles.blue
        textColor = 'white'
        break
    }
    return (
      <TouchableOpacity
        accessible={true}
        accessibilityLabel={this.props.title}
        activeOpacity={this.props.activeOpacity}
        style={[styles.baseStyle, color, this.props.style]}
        onPress={this.action}
      >
        <Text
          style={[
            styles.btnTitle,
            textColor && { color: textColor },
            this.props.titleStyle,
          ]}
        >
          {this.props.title}
        </Text>
      </TouchableOpacity>
    )
  }
}

Button.Type = {
  BLUE: 'BLUE',
  RED: 'RED',
  GRAY: 'GRAY',
}
