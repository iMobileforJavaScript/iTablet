/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 * description: 二级左右联动菜单组件
 */

import React from 'react'
import {
  TouchableOpacity,
  View,
  FlatList,
  Text,
  PanResponder,
  Image,
} from 'react-native'
import { scaleSize, screen } from '../../utils'
import { getPublicAssets } from '../../assets'
import styles from './styles'

const LEFT_MIN_WIDTH = scaleSize(240)
export default class LinkageList extends React.Component {
  props: {
    language: String,
    data: Array, // 菜单数据
    titles: Array, //左右侧标题
    onLeftPress?: () => {}, //左侧点击
    onRightPress?: () => {}, //右侧点击
    styles?: Object, //样式
    adjustmentWidth?: boolean,
  }

  static defaultProps = {
    adjustmentWidth: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: 0,
      rightSelected: 0,
      // data: props.data || [],
      rightData: (props.data && props.data[0] && props.data[0].data) || [],
    }
    this.styles = this.props.styles
      ? Object.assign(styles, this.props.styles)
      : styles

    if (props.adjustmentWidth) {
      this._panBtnStyles = {
        style: {
          width: LEFT_MIN_WIDTH,
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
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        rightData:
          (this.props.data[this.state.selected] &&
            this.props.data[this.state.selected].data) ||
          [],
      })
    }
    if (this._panBtnStyles.style.width > screen.getScreenWidth()) {
      this._panBtnStyles.style.width = screen.getScreenWidth() - LEFT_MIN_WIDTH
      this._updateNativeStyles()
    }
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
    this._panBtnStyles.style.width = gestureState.moveX
    if (this._panBtnStyles.style.width < LEFT_MIN_WIDTH) {
      this._panBtnStyles.style.width = LEFT_MIN_WIDTH
    } else if (
      this._panBtnStyles.style.width >
      screen.getScreenWidth() - LEFT_MIN_WIDTH
    ) {
      this._panBtnStyles.style.width = screen.getScreenWidth() - LEFT_MIN_WIDTH
    }
    this._updateNativeStyles()
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    this._panBtnStyles.style.width = gestureState.moveX
    if (this._panBtnStyles.style.width < LEFT_MIN_WIDTH) {
      this._panBtnStyles.style.width = LEFT_MIN_WIDTH
    } else if (
      this._panBtnStyles.style.width >
      screen.getScreenWidth() - LEFT_MIN_WIDTH
    ) {
      this._panBtnStyles.style.width = screen.getScreenWidth() - LEFT_MIN_WIDTH
    }
    this._updateNativeStyles()
  }

  _updateNativeStyles = () => {
    this.leftList && this.leftList.setNativeProps(this._panBtnStyles)
  }

  select = ({ leftIndex, rightIndex }) => {
    let state = {}
    if (leftIndex >= 0) state.selected = leftIndex
    if (rightIndex >= 0) state.rightSelected = rightIndex
    if (
      this.props.data &&
      this.props.data.length > 0 &&
      this.props.data[leftIndex] &&
      this.props.data[leftIndex].data &&
      this.props.data[leftIndex].data.length > 0
    ) {
      state.rightData = this.props.data[leftIndex].data
    }
    if (Object.keys(state).length > 0) {
      this.setState(state)
    }
  }

  onLeftPress = ({ item, index }) => {
    if (this.props.onLeftPress) return this.props.onLeftPress({ item, index })
    this.setState({
      selected: index,
      rightData: item.data,
    })
  }

  onRightPress = async ({ item, index }) => {
    let data = this.props.data
    let parent = {}
    for (let p of data) {
      if (p.title === item.parentTitle) {
        parent = p
      }
    }
    if (index !== this.state.rightSelected) {
      this.setState({ rightSelected: index }, () => {
        if (this.props.onRightPress)
          return this.props.onRightPress({ parent, item, index })
      })
    } else {
      if (this.props.onRightPress)
        return this.props.onRightPress({ parent, item, index })
    }
  }

  renderLeftItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={
          this.state.selected === index
            ? this.styles.leftWrapSelect
            : this.styles.leftWrap
        }
        onPress={() => {
          this.onLeftPress({ item, index })
        }}
      >
        {this.state.selected === index && <View style={styles.leftSelectTag} />}
        <Text style={this.styles.leftItem} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  renderRightItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={
          this.state.rightSelected === index
            ? this.styles.leftWrapSelect
            : this.styles.leftWrap
        }
        onPress={() => {
          this.onRightPress({ item, index })
        }}
      >
        <Text style={this.styles.rightItem} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    let panHandlers = {}
    if (this._panResponder && this._panResponder.panHandlers) {
      panHandlers = this._panResponder.panHandlers
    }
    return (
      <View style={this.styles.container}>
        <View
          ref={ref => (this.leftList = ref)}
          style={this.styles.leftFlatListContainer}
        >
          <View style={this.styles.headContainer}>
            <Text style={this.styles.menuTitle}>{this.props.titles[0]}</Text>
          </View>
          <FlatList
            style={{ flex: 1 }}
            renderItem={this.renderLeftItem}
            data={this.props.data}
            extraData={this.state.selected}
            keyExtractor={(item, index) => item + index}
          />
        </View>
        {this.props.adjustmentWidth && (
          <View style={styles.moveSeparator} {...panHandlers}>
            <Image
              style={styles.dragIcon}
              source={getPublicAssets().common.icon_drag}
              resizeMode={'contain'}
            />
          </View>
        )}
        <View style={this.styles.rightFlatListContainer}>
          <View style={this.styles.headContainer}>
            <View style={styles.shortLine1} />
            <Text style={this.styles.menuTitle}>{this.props.titles[1]}</Text>
            <View style={styles.shortLine2} />
          </View>
          <FlatList
            renderItem={this.renderRightItem}
            data={this.state.rightData}
            extraData={this.state.rightSelected}
            keyExtractor={(item, index) => item + index}
          />
        </View>
      </View>
    )
  }
}
