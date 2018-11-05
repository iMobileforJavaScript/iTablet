/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, TouchableOpacity } from 'react-native'

import styles from './styles'

export default class ChooseColor extends PureComponent {
  props: {
    title: string,
    value: any,
    defaultValue: any,
    getValue?: () => {},
  }

  static defaultProps = {
    value: 'blue',
  }

  constructor(props) {
    super(props)
  }

  getValue = () => {
    this.props.getValue && this.props.getValue(this.props.value)
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.chooseColorContainer}
        accessible={true}
        accessibilityLabel={this.props.title}
        onPress={() => this.getValue()}
      >
        <View
          style={[
            styles.subChooseColorContainer,
            { backgroundColor: this.props.value },
          ]}
        />
      </TouchableOpacity>
    )
  }
}
