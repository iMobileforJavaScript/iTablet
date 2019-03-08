/*
  图片按钮
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: ysl19910917@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import PropTypes from 'prop-types'
import { scaleSize, setSpText } from '../utils'
import { color } from '../styles'

export default class ImageButton extends React.Component {
  static propTypes = {
    activeOpacity: PropTypes.number,
    containerStyle: PropTypes.any,
    titleStyle: PropTypes.any,
    iconBtnStyle: PropTypes.any,
    iconStyle: PropTypes.any,
    onPress: PropTypes.func,
    icon: PropTypes.any,
    title: PropTypes.string,
    // type: PropTypes.string,
    direction: PropTypes.string,
    enabled: PropTypes.bool,
  }

  static defaultProps = {
    activeOpacity: 0.8,
    direction: 'column',
    enabled: true,
  }

  render() {
    if (!this.props.icon) {
      return null
    }

    return (
      <TouchableOpacity
        enabled={this.props.enabled}
        accessible={true}
        accessibilityLabel={'图片按钮'}
        style={[
          styles.container,
          { flexDirection: this.props.direction },
          this.props.containerStyle,
        ]}
        activeOpacity={this.props.activeOpacity}
        onPress={() => {
          if (this.props.enabled) {
            this.props.onPress && this.props.onPress()
          }
        }}
      >
        <View
          style={[
            // this.props.type === 'normal' ? styles.iconBgNormal : styles.iconBg,
            styles.iconBg,
            this.props.iconBtnStyle,
          ]}
        >
          <Image
            style={[styles.icon, this.props.iconStyle]}
            source={this.props.icon}
          />
        </View>
        {this.props.title && (
          <Text style={[styles.iconTitle, this.props.titleStyle]}>
            {this.props.title}
          </Text>
        )}
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconBg: {
    // borderRadius: scaleSize(80),
    height: scaleSize(80),
    width: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  icon: {
    height: scaleSize(50),
    width: scaleSize(50),
  },
  iconTitle: {
    marginTop: scaleSize(10),
    fontSize: setSpText(20),
    color: color.blue2,
    backgroundColor: 'transparent',
  },
})
