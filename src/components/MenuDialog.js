import React from 'react'
import {
  TouchableHighlight,
  Text,
  StyleSheet,
  View,
  Image,
  PanResponder,
  Dimensions,
} from 'react-native'
import { scaleSize, screen } from '../utils'
import { size, color } from '../styles'
import { Const } from '../constants'

const ITEM_HEIGHT = scaleSize(80)
const ARROW_HEIGHT = scaleSize(30)
const VIEW_WIDTH = scaleSize(360)

export default class MenuDialog extends React.PureComponent {
  props: {
    data: Array, // 数据
    selectKey?: '', // 当前选中的key
    viewableItems?: number, // 可见范围item的数量
    autoSelect?: boolean, // 松手自动选择
    onSelect?: () => {}, // 选中item的回调
  }

  static defaultProps = {
    data: [],
    viewableItems: 3,
    autoSelect: false,
  }

  constructor(props) {
    super(props)
    this.screenWidth = screen.getScreenWidth()
    this.lastIndex = this.getIndexByKey(props.data, props.selectKey)
    this.state = {
      currentIndex: this.lastIndex,
      data: props.data,
    }

    this.selectedViewTop =
      (Dimensions.get('window').height - Const.BOTTOM_HEIGHT - ITEM_HEIGHT) / 2
    this.moveViewHeight =
      ITEM_HEIGHT * this.state.data.length + ARROW_HEIGHT * 2

    this._previousTop =
      this.selectedViewTop -
      (this.state.currentIndex * ITEM_HEIGHT + ARROW_HEIGHT)
    this._moveViewBgStyles = {
      style: {
        top: this._previousTop,
        width: VIEW_WIDTH,
      },
    }
    this._moveViewStyles = {
      style: {
        top: this._previousTop,
        width: VIEW_WIDTH,
      },
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })

    this.offset = this.state.currentIndex * ITEM_HEIGHT
  }

  componentDidUpdate(prevProps) {
    if (this.screenWidth !== screen.getScreenWidth()) {
      this.moveToIndex()
      this.screenWidth = screen.getScreenWidth()
    } else if (
      JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)
    ) {
      this.setState({ data: this.props.data.concat() || [] })
    }
    if (this.props.selectKey !== prevProps.selectKey) {
      let index = this.getIndexByKey(this.props.data, this.props.selectKey)
      this.moveToIndex(index)
    }
  }

  componentDidMount() {
    let curIndex = this.getIndexByKey(this.state.data, this.props.selectKey)
    this.moveToIndex(curIndex)

    if (this.state.data.length > curIndex) {
      this.lastIndex = curIndex
      this.onSelect(this.state.data[curIndex])
    }
  }

  moveToIndex = index => {
    let curIndex

    if (index === undefined) {
      curIndex = this.state.currentIndex
    } else if (index < 0) {
      curIndex = 0
    } else if (index > this.state.data.length - 1) {
      curIndex = this.state.data.length - 1
    } else {
      curIndex = index
    }
    this.selectedViewTop =
      (Dimensions.get('window').height - Const.BOTTOM_HEIGHT - ITEM_HEIGHT) / 2
    this.moveViewHeight =
      ITEM_HEIGHT * this.state.data.length + ARROW_HEIGHT * 2

    this._previousTop =
      this.selectedViewTop - (curIndex * ITEM_HEIGHT + ARROW_HEIGHT)

    this._moveViewBgStyles.style.top = this._previousTop
    this._moveViewStyles.style.top = this._moveViewBgStyles.style.top

    this.setState({
      currentIndex: curIndex,
    })

    this._updateNativeStyles()
  }

  getIndexByKey = (data = [], key) => {
    if (!key) return 0
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].selectKey === key) {
          return i
        }
      }
    }
    return 1
  }

  _handleStartShouldSetPanResponder = () => {
    return true
  }

  _handleMoveShouldSetPanResponder = (evt, gestureState) => {
    if (Math.abs(gestureState.dy) < 1) {
      return false
    } else {
      return true
    }
  }

  _handlePanResponderMove = (evt, gestureState) => {
    this.handleMove(evt, gestureState)
  }

  handleMove = (evt, gestureState) => {
    let y = this._previousTop + gestureState.dy
    if (y > this.selectedViewTop - ARROW_HEIGHT) {
      // 向下滑动
      y = this.selectedViewTop - ARROW_HEIGHT
    } else if (
      y <
      this.selectedViewTop - this.moveViewHeight + ITEM_HEIGHT + ARROW_HEIGHT
    ) {
      // 向上滑动
      y =
        this.selectedViewTop - this.moveViewHeight + ITEM_HEIGHT + ARROW_HEIGHT
    }

    this._moveViewBgStyles.style.top = y
    this._moveViewStyles.style.top = this._moveViewBgStyles.style.top

    let currentIndex =
      ((this.selectedViewTop - y - ARROW_HEIGHT) / ITEM_HEIGHT).toFixed() -
      1 +
      1
    if (this.state.currentIndex !== currentIndex) {
      this.setState({
        currentIndex,
      })
    }

    this._updateNativeStyles()
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    this.handleEnd(evt, gestureState)
  }

  handleEnd = (evt, gestureState) => {
    let y = this._previousTop + gestureState.dy

    if (y > this.selectedViewTop - ARROW_HEIGHT) {
      // 向下滑动
      y = this.selectedViewTop - ARROW_HEIGHT
    } else if (
      y <
      this.selectedViewTop - this.moveViewHeight + ITEM_HEIGHT + ARROW_HEIGHT
    ) {
      // 向上滑动
      y =
        this.selectedViewTop - this.moveViewHeight + ITEM_HEIGHT + ARROW_HEIGHT
    }
    this._previousTop = y

    this.moveToIndex(this.state.currentIndex)
    this.lastIndex = this.state.currentIndex

    if (this.props.autoSelect) {
      this.onSelect(this.state.data[this.state.currentIndex])
      this.callCurrentAction()
    }
  }

  scroll = moveIndex => {
    this.moveToIndex(this.state.currentIndex + moveIndex)
  }

  _updateNativeStyles = () => {
    this.moveViewBg && this.moveViewBg.setNativeProps(this._moveViewBgStyles)
    this.moveView && this.moveView.setNativeProps(this._moveViewStyles)
  }

  callCurrentAction = () => {
    if (this.state.data.length > this.state.currentIndex) {
      let item = this.state.data[this.state.currentIndex]
      item && item.action && item.action(item)
    }
  }

  onSelect = item => {
    this.props.onSelect && this.props.onSelect(item)
  }

  itemAction = ({ item, index }) => {
    if (index !== this.state.currentIndex) {
      this.setState({
        lastIndex: index,
        data: this.state.data.concat(),
      })
    }
    this.onSelect(item)
    item.action && item.action(item)
  }

  _renderItem = ({ item, index }) => {
    if (item && item.key) {
      return (
        <TouchableHighlight
          key={item.key}
          activeOpacity={0.8}
          underlayColor="#4680DF"
          style={styles.item}
          onPress={() => this.itemAction({ item, index })}
        >
          <Text
            style={
              index === this.state.currentIndex
                ? styles.textHighLight
                : styles.text
            }
          >
            {item.key}
          </Text>
        </TouchableHighlight>
      )
    } else {
      return <View key={index + ''} style={styles.item} />
    }
  }

  renderList = () => {
    let data = []
    this.state.data.forEach((item, index) => {
      data.push(this._renderItem({ item, index }))
    })
    return data
  }

  render() {
    this.selectedViewTop =
      (Dimensions.get('window').height - Const.BOTTOM_HEIGHT - ITEM_HEIGHT) / 2
    return (
      <View style={styles.overlay} {...this._panResponder.panHandlers}>
        <View style={styles.dialogView}>
          <View
            ref={ref => (this.moveViewBg = ref)}
            style={[
              styles.moveViewBg,
              { top: this.state.top },
              { height: this.moveViewHeight },
            ]}
          />
          <View
            key={'selected_view'}
            style={[styles.selectedView, { top: this.selectedViewTop }]}
          />
          <View
            ref={ref => (this.moveView = ref)}
            style={[
              styles.moveView,
              {
                top: this.state.top,
                height: this.moveViewHeight,
              },
              // { height: ITEM_HEIGHT * this.props.viewableItems + ARROW_HEIGHT * 2 },
            ]}
          >
            <TouchableHighlight
              key={'up'}
              onPress={() => this.scroll(-1)}
              style={styles.arrowView}
            >
              <Image
                resizeMode={'contain'}
                style={styles.arrowImg}
                source={require('../assets/public/icon_arrow_up.png')}
              />
            </TouchableHighlight>

            {this.renderList()}

            <TouchableHighlight
              key={'down'}
              onPress={() => this.scroll(1)}
              style={styles.arrowView}
            >
              <Image
                resizeMode={'contain'}
                style={styles.arrowImg}
                source={require('../assets/public/icon_arrow_down.png')}
              />
            </TouchableHighlight>
          </View>
        </View>
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
  dialogView: {
    height: '100%',
    width: VIEW_WIDTH,
    flexDirection: 'column',
    backgroundColor: color.transOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moveViewBg: {
    position: 'absolute',
    minHeight: scaleSize(200),
    width: VIEW_WIDTH,
    flexDirection: 'column',
    backgroundColor: color.transView,
  },
  moveView: {
    position: 'absolute',
    minHeight: scaleSize(200),
    width: VIEW_WIDTH,
    flexDirection: 'column',
    backgroundColor: color.transOverlay,
  },
  text: {
    color: color.font_color_white,
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  textHighLight: {
    color: color.content_white,
    fontWeight: 'bold',
    fontSize: size.fontSize.fontSizeXl,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    backgroundColor: 'transparent',
    minWidth: scaleSize(100),
    width: VIEW_WIDTH,
  },
  selectedView: {
    position: 'absolute',
    height: ITEM_HEIGHT,
    backgroundColor: '#4680DF',
    minWidth: scaleSize(100),
    width: VIEW_WIDTH,
  },
  arrowView: {
    height: ARROW_HEIGHT,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImg: {
    height: scaleSize(9),
    width: scaleSize(24),
  },
})
