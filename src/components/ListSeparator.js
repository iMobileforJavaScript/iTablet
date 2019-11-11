/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { color } from '../styles'
// import { scaleSize } from '../utils'
import PropTypes from 'prop-types'

export default class ListSeparator extends React.Component {
  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    mode: PropTypes.string,
    color: PropTypes.string,
    newStyle: PropTypes.object,
  }

  static defaultProps = {
    mode: 'horizontal',
  }

  render() {
    if (this.props.mode === 'vertical') {
      return (
        <View
          style={[
            styles.vSeparator,
            this.props.color && { backgroundColor: this.props.color },
            this.props.height && { height: this.props.height },
            this.props.width && { width: this.props.width },
            this.props.newStyle,
          ]}
        />
      )
    } else {
      return (
        <View
          style={[
            styles.hSeparator,
            this.props.color && { backgroundColor: this.props.color },
            this.props.height && { height: this.props.height },
            this.props.width && { width: this.props.width },
            this.props.newStyle,
          ]}
        />
      )
    }
  }
}

const styles = StyleSheet.create({
  hSeparator: {
    flex: 1,
    height: 1,
    marginHorizontal: 0,
    backgroundColor: color.bgG,
    // marginLeft: scaleSize(16),
    // marginRight: scaleSize(16),
  },
  vSeparator: {
    // flex: 1,
    width: 1,
    backgroundColor: color.bgG,
    // marginLeft: scaleSize(16),
    // marginRight: scaleSize(16),
  },
})

ListSeparator.mode = {
  VERTICAL: 'vertical', // 纵向的分割线
  HORIZONTAL: 'horizontal', // 横向的分割线
}
