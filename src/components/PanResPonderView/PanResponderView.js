/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 * description: 铺满容器的PanResponder 可选带顶部指示条
 */
import React from 'react'
import { StyleSheet, View, PanResponder } from 'react-native'
import { color } from '../../styles'
import { scaleSize } from '../../utils'

const STATE_TYPE = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
}
export default class PanResponderView extends React.PureComponent {
  props: {
    onHandleMove: () => {}, //处理move事件
    onHandleMoveEnd?: () => {}, //停止move事件
    withTopBar: boolean,
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
    this.state = {
      currentState: STATE_TYPE.CENTER,
    }
  }
  _handleStartShouldSetPanResponder = () => {
    return true
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    if (this.props.withTopBar) {
      this.setState({
        currentState: STATE_TYPE.CENTER,
      })
    }
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
    if (this.props.withTopBar) {
      let currentState = this.state.currentState
      if (gestureState.dx > 10 && currentState !== STATE_TYPE.RIGHT) {
        currentState = STATE_TYPE.RIGHT
      } else if (gestureState.dx < -10 && currentState !== STATE_TYPE.LEFT) {
        currentState = STATE_TYPE.LEFT
      } else if (
        Math.abs(gestureState.dx) <= 10 &&
        currentState !== STATE_TYPE.CENTER
      ) {
        currentState = STATE_TYPE.CENTER
      }
      if (currentState !== this.state.currentState) {
        this.setState({
          currentState,
        })
      }
    }
    this.props.onHandleMove && this.props.onHandleMove(evt, gestureState)
  }

  _renderTopBar = () => {
    let curStyle
    switch (this.state.currentState) {
      case STATE_TYPE.LEFT:
        curStyle = { left: 0 }
        break
      case STATE_TYPE.CENTER:
        curStyle = { left: '49%' }
        break
      case STATE_TYPE.RIGHT:
        curStyle = { right: 0 }
        break
    }
    return (
      <View style={styles.topbar}>
        <View style={styles.track} />
        <View style={[styles.circle, curStyle]} />
      </View>
    )
  }
  render() {
    return (
      <View style={styles.overlay} {...this._panResponder.panHandlers}>
        {this.props.withTopBar && this._renderTopBar()}
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
  topbar: {
    position: 'absolute',
    top: scaleSize(20),
    width: '100%',
    paddingHorizontal: scaleSize(40),
    height: scaleSize(30),
  },
  track: {
    width: '100%',
    height: scaleSize(10),
    borderRadius: scaleSize(5),
    marginVertical: scaleSize(10),
    backgroundColor: color.blue1,
  },
  circle: {
    marginHorizontal: scaleSize(25),
    position: 'absolute',
    width: scaleSize(30),
    height: scaleSize(30),
    borderRadius: scaleSize(15),
    backgroundColor: color.blue1,
  },
})
