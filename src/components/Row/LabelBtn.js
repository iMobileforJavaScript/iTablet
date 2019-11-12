/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'

import styles from './styles'

export default class LabelBtn extends PureComponent {

  props: {
    style?: StyleSheet,
    valueStyle?: StyleSheet,
    title: string,
    value: any,
    defaultValue: any,
    getValue?: () => {},
  }

  static defaultProps = {
    unit: 'm',
    minValue: 1,
    maxValue: 5,
    defaultValue: '请选择',
  }

  constructor(props) {
    super(props)
    // this.state = {
    //   value: props.defaultValue,
    // }
  }

  getValue = () => {
    this.props.getValue && this.props.getValue(this.props.value)
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.textBtnContainer}
        accessible={true}
        accessibilityLabel={this.props.title}
        onPress={() => this.getValue()}
      >
        <Text style={styles.textBtnTitle}>{this.props.value}</Text>
      </TouchableOpacity>
    )
  }
}