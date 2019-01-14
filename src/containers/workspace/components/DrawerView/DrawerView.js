/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import {
  View,
  PanResponder,
  Animated,
  TouchableOpacity,
  Image,
} from 'react-native'
import { scaleSize } from '../../../../utils'
import styles from './styles'

const drawerHeight = scaleSize(300) // 默认View高度
const drawerBtnHeight = scaleSize(40) // 默认伸缩按钮高度

export default class DrawerView extends React.Component {
  props: {
    hiddenAble: boolean,
    showBtn: any,
    showBtnStyle: any,
    showBtnImage: any,
    showBtnAction: () => {},
    children: any,
    heightChangeListener: () => {},
    containerStyle: any,
    activeOpacity: number,
    title: string,
    thresholds: [], // 最小值 0； 最大值如果是 'max'，择为当前父组件的高度; DrawerView初始显示默认高度为
    activeOpacity: any,
    title: any,
  }

  static defaultProps = {
    thresholds: [],
    hiddenAble: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: true,
    }
    this._drawerHeight =
      props.thresholds.length > 0 ? props.thresholds[0] : drawerHeight
    // this._animatedHeight = new Animated.Value(this._drawerHeight)
    this._panBtnStyles = {
      style: {
        height: this._drawerHeight,
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
    this.props.heightChangeListener &&
      this.props.heightChangeListener({
        drawerHeight: this._drawerHeight,
        childrenHeight: this._drawerHeight - drawerBtnHeight,
      })
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
    let y = this._drawerHeight - gestureState.dy
    this._panBtnStyles.style.height = y
    this.props.heightChangeListener &&
      this.props.heightChangeListener({
        drawerHeight: y,
        childrenHeight: y - drawerBtnHeight,
      })
    this._updateNativeStyles()
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    this._drawerHeight -= gestureState.dy
    this._drawerHeight = this.threshold(this._drawerHeight)
    this._panBtnStyles.style.height = this._drawerHeight
    this.props.heightChangeListener &&
      this.props.heightChangeListener({
        drawerHeight: this._drawerHeight,
        childrenHeight: this._drawerHeight - drawerBtnHeight,
      })
    this._updateNativeStyles()
    if (this.props.hiddenAble && this._drawerHeight === 0) {
      this.setState({
        visible: false,
      })
    }
  }

  /**
   * 找到最接近的阈值
   * @param value
   */
  threshold = value => {
    let thresholds = JSON.parse(JSON.stringify(this.props.thresholds))
    if (thresholds.length <= 0) return value
    thresholds.sort(function(a, b) {
      return a - b
    })
    if (value <= thresholds[0]) {
      if (value >= thresholds[0] / 2) {
        return thresholds[0]
      } else {
        return 0
      }
    } else if (value >= thresholds[thresholds.length - 1]) {
      return thresholds[thresholds.length - 1]
    }
    for (let i = 0; i < thresholds.length; i++) {
      if (value > thresholds[i]) {
        continue
      }
      if (value > (thresholds[i] + thresholds[i - 1]) / 2) {
        return thresholds[i]
      } else {
        return thresholds[i - 1]
      }
    }
  }

  _updateNativeStyles = () => {
    this.drawer && this.drawer.setNativeProps(this._panBtnStyles)
  }

  setDialogVisible = visible => {
    visible !== this.state.visible && this.setState({ visible: visible })
  }

  getDrawerHeight = () => {
    return this._drawerHeight
  }

  getChildrenHeight = () => {
    return this._drawerHeight - drawerBtnHeight
  }

  showBtnAction = () => {
    this.props.showBtnAction && this.props.showBtnAction()
    this.setState(
      {
        visible: true,
      },
      () => {
        this._drawerHeight =
          this.props.thresholds.length > 0
            ? this.props.thresholds[0]
            : drawerHeight
        this.props.heightChangeListener &&
          this.props.heightChangeListener({
            drawerHeight: this._drawerHeight,
            childrenHeight: this._drawerHeight - drawerBtnHeight,
          })
      },
    )
  }

  render() {
    if (this.props.hiddenAble && !this.state.visible) {
      if (this.props.showBtn) {
        return this.props.showBtn
      }
      return (
        <TouchableOpacity
          ref={ref => (this.mtBtn = ref)}
          accessible={true}
          activeOpacity={this.props.activeOpacity}
          accessibilityLabel={this.props.title}
          style={
            this.props.showBtnStyle
              ? this.props.showBtnStyle
              : styles.showBtnStyle
          }
          onPress={this.showBtnAction}
        >
          <Image
            resizeMode={'contain'}
            style={styles.showBtnImage}
            source={
              this.props.showBtnImage ||
              require('../../../../assets/map/icon-arrow-up.png')
            }
          />
        </TouchableOpacity>
      )
    }
    return (
      <Animated.View
        style={[
          styles.container,
          this.props.containerStyle,
          this.props.thresholds.length > 0 && {
            height: this.props.thresholds[0],
          },
        ]}
        ref={ref => (this.drawer = ref)}
      >
        <View
          style={styles.drawerBtn}
          ref={ref => (this.drawerBtn = ref)}
          {...this._panResponder.panHandlers}
        >
          <Image
            style={styles.drawerBtnImage}
            source={require('../../../../assets/map/icon-drawer.png')}
          />
        </View>
        {this.props.children}
      </Animated.View>
    )
  }
}
