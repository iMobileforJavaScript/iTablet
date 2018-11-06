/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  Image,
  StyleSheet,
  PanResponder,
  TouchableOpacity,
} from 'react-native'
import { screen } from '../../utils'

import styles from './styles'

const positionBorder = 10 // 默认边距
const positionLeft = screen.deviceWidth - positionBorder // 默认相对左边的位置（不含按钮宽度）
const positionTop = screen.deviceHeight - positionBorder // 默认相对顶部的位置（不含按钮高度）
/**
 * 可移动的按钮
 */
export default class PanAudioButton extends PureComponent {
  props: {
    style?: StyleSheet,
    titleStyle?: StyleSheet,
    title: string,
    activeOpacity: number,
    type: string,
    onPress: () => {},
    fixed?: boolean,
    width?: number,
    height?: number,
    borderRadius?: number,
  }

  static defaultProps = {
    activeOpacity: 0.8,
    height: 50,
    width: 50,
    borderRadius: 25,
    fixed: false,
  }

  constructor(props) {
    super(props)
    // 初始化位置
    this._previousLeft = positionLeft - this.props.width - 10
    this._previousTop = positionTop - this.props.height - 120
    this._panBtnStyles = {
      style: {
        left: this._previousLeft,
        top: this._previousTop,
      },
    }
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })
  }

  componentDidMount() {
    this._updateNativeStyles(this._panBtnStyles)
  }

  _handleStartShouldSetPanResponder = () => {
    // evt, gestureState
    return true
  }

  _handleMoveShouldSetPanResponder = () => {
    // evt, gestureState
    return true
  }

  _handlePanResponderMove = (evt, gestureState) => {
    let x = this._previousLeft + gestureState.dx
    let y = this._previousTop + gestureState.dy
    this._panBtnStyles.style.left =
      x > positionLeft - this.props.width
        ? positionLeft - this.props.width
        : x < positionBorder
          ? positionBorder
          : x
    this._panBtnStyles.style.top =
      y > positionTop - this.props.height
        ? positionTop - this.props.height
        : y < positionBorder
          ? positionBorder
          : y
    this._updateNativeStyles()
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    let x = this._previousLeft + gestureState.dx
    let y = this._previousTop + gestureState.dy
    this._previousLeft =
      x > positionLeft - this.props.width
        ? positionLeft - this.props.width
        : x < positionBorder
          ? positionBorder
          : x
    this._previousTop =
      y > positionTop - this.props.height
        ? positionTop - this.props.height
        : y < positionBorder
          ? positionBorder
          : y
    this._updateNativeStyles()
  }

  _updateNativeStyles = () => {
    this.panBtn && this.panBtn.setNativeProps(this._panBtnStyles)
  }

  action = () => {
    this.props.onPress && this.props.onPress()
  }

  render() {
    return (
      <View
        ref={ref => (this.panBtn = ref)}
        style={[
          styles.container,
          {
            width: this.props.width,
            height: this.props.height,
            borderRadius: this.props.borderRadius,
          },
        ]}
        {...this._panResponder.panHandlers}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPressOut={() => {
            this.action()
          }}
        >
          <Image
            resizeMode={'contain'}
            style={[
              styles.image,
              { width: this.props.width, height: this.props.height },
            ]}
            source={require('../../assets/public/icon-recording2.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }
}
