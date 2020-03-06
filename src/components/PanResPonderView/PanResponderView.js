/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 * description: 铺满容器的PanResponder
 */
import React from 'react'
import { StyleSheet, View, PanResponder } from 'react-native'
import { color } from '../../styles'

export default class PanResponderView extends React.PureComponent {
  props: {
    onHandleMove: () => {}, //处理move事件
    onHandleMoveEnd?: () => {}, //停止move事件
    children: any,
  }

  constructor(props) {
    super(props)
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })
  }
  _handleStartShouldSetPanResponder = () => {
    return true
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    this.props.onHandleMoveEnd && this.props.onHandleMoveEnd(evt, gestureState)
  }
  _handleMoveShouldSetPanResponder = (evt, gestureState) => {
    if (Math.abs(gestureState.dy) < 1) {
      return false
    } else {
      return true
    }
  }

  _handlePanResponderMove = (evt, gestureState) => {
    this.props.onHandleMove && this.props.onHandleMove(evt, gestureState)
  }

  render() {
    return (
      <View style={styles.overlay} {...this._panResponder.panHandlers}>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.transOverlay,
  },
})
