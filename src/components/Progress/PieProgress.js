/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { Component } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { Pie } from 'react-native-progress'
import { scaleSize } from '../../utils'

const styles = StyleSheet.create({
  container: {},
  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
  },
  progress: {},
})

export default class PieProgress extends Component {
  static propTypes = {
    ...View.propTypes,
    progress: PropTypes.number, //当前进度 0 - 1
    indeterminate: PropTypes.bool, // 不确定进度
    size: PropTypes.number, // 大小
  }

  static defaultProps = {
    size: scaleSize(18),
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            width: this.props.size + 1,
            height: this.props.size + 1,
          },
          this.props.style,
        ]}
        onLayout={this._onLayout}
      >
        <Pie
          size={this.props.size}
          style={styles.progress}
          progress={this.props.progress}
          indeterminate={false}
        />
        {this.props.progress === 1 && (
          <Image
            source={require('../../assets/public/icon_share_completed.png')}
            style={[
              styles.img,
              { width: this.props.size, height: this.props.size },
            ]}
          />
        )}
      </View>
    )
  }
}
