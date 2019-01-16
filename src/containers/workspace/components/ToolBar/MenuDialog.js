import React from 'react'
import {
  TouchableHighlight,
  Text,
  FlatList,
  StyleSheet,
  View,
  Image,
  PanResponder,
} from 'react-native'
import { scaleSize } from '../../../../utils'
import { size, color } from '../../../../styles'

const ITEM_HEIGHT = scaleSize(80)
const ARROW_HEIGHT = scaleSize(30)

export default class MenuDialog extends React.PureComponent {
  props: {
    list: Array, // 数据
    selectKey?: '', // 当前选中的key
    viewableItems?: number, // 可见范围item的数量
    onSelect?: () => {}, // 选中item的回调
  }

  static defaultProps = {
    list: [],
    viewableItems: 3,
  }

  constructor(props) {
    super(props)
    let data = [].concat(props.list)
    data.unshift({})
    data.push({})
    let lastIndex = this.getIndexByKey(data, props.selectKey)
    this.state = {
      lastIndex: lastIndex,
      data: data,
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    })

    this.offset = lastIndex * ITEM_HEIGHT
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.list) !== JSON.stringify(this.props.list)) {
      this.setState({ data: this.props.list.concat() || [] })
    } else if (this.props.selectKey !== prevProps.selectKey) {
      let data = [].concat(this.props.list)
      data.unshift({})
      data.push({})
      let index = this.getIndexByKey(data, this.props.selectKey)
      this.setState({
        lastIndex: index,
        data,
      })
      this.selectList &&
        this.selectList.scrollToIndex({ index: index, viewOffset: ITEM_HEIGHT })
      this.onSelect(this.state.data[index])
    }
  }

  componentDidMount() {
    let curIndex = this.getIndexByKey(this.state.data, this.props.selectKey)
    if (this.state.data.length > curIndex) {
      this.selectList &&
        this.selectList.scrollToIndex({
          index: curIndex,
          viewOffset: ITEM_HEIGHT,
          animated: false,
        })
      this.setState({ lastIndex: curIndex })
      this.onSelect(this.state.data[curIndex])
    }
  }

  getIndexByKey = (data = [], key) => {
    if (!key) return 1
    if (data.length - 2 > 0) {
      for (let i = 1; i < data.length - 1; i++) {
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

  _handleMoveShouldSetPanResponder = () => {
    return true
  }

  _handlePanResponderMove = () => {
    // TODO 调整滑动
    // let speed = gestureState.dy, rate
    // if ((this.offset - gestureState.dy) < 0) {
    //   // rate = Math.ceil((Math.abs(this.offset - gestureState.dy) - ITEM_HEIGHT) / ITEM_HEIGHT) + 1
    //   rate = Math.ceil(Math.abs(this.offset - gestureState.dy) / ITEM_HEIGHT) + 1
    //   speed = gestureState.dy / rate
    // } else if ((this.offset - gestureState.dy) > ITEM_HEIGHT * this.state.data.length) {
    //   // rate = Math.ceil((this.offset - gestureState.dy - ITEM_HEIGHT * (this.props.list.length - 1)) / ITEM_HEIGHT) + 1
    //   rate = Math.ceil((this.offset - gestureState.dy - ITEM_HEIGHT * this.state.data.length) / ITEM_HEIGHT) + 1
    //   speed = gestureState.dy / rate
    // }
    //
    // let currentOffset = this.offset - speed
    // // if (Platform.OS === 'android') { // Android滑倒上下边界则不移动
    // if (currentOffset < ITEM_HEIGHT) {
    //   currentOffset = ITEM_HEIGHT
    // } else if (currentOffset > ITEM_HEIGHT * (this.state.data.length - 1)) {
    //   currentOffset = ITEM_HEIGHT * (this.state.data.length - 1)
    // }
    // // }
    // // this.selectList && this.selectList.scrollToOffset({offset: currentOffset, animated: true})
    // this.offset = currentOffset
  }

  _handlePanResponderEnd = (evt, gestureState) => {
    let currentIndex = this.state.lastIndex
    let dy = gestureState.dy < 0 ? Math.abs(gestureState.dy) : gestureState.dy
    let moveIndex = (dy / ITEM_HEIGHT).toFixed() - 1 + 1
    if (gestureState.dy > 0 && currentIndex > 1) {
      currentIndex -= moveIndex
      if (currentIndex < 1) {
        currentIndex = 1
      }
    } else if (
      gestureState.dy < 0 &&
      currentIndex < this.state.data.length - 2
    ) {
      currentIndex += moveIndex
      if (currentIndex > this.state.data.length - 2) {
        currentIndex = this.state.data.length - 2
      }
    }

    // this.selectList && this.selectList.scrollToIndex({index: currentIndex, viewOffset: ITEM_HEIGHT, animated: true})
    this.offset = (currentIndex - 1) * ITEM_HEIGHT
    this.selectList.scrollToOffset({ offset: this.offset, animated: true })
    if (this.state.lastIndex !== currentIndex) {
      this.setState({
        lastIndex: currentIndex,
        data: this.state.data.concat(),
      })
    }
  }

  scroll = moveIndex => {
    let currentIndex = this.state.lastIndex + moveIndex
    if (currentIndex < 1) {
      currentIndex = 1
    } else if (currentIndex > this.state.data.length - 2) {
      currentIndex = this.state.data.length - 2
    }
    if (currentIndex === this.state.lastIndex) return
    this.setState({
      lastIndex: currentIndex,
      data: this.state.data.concat(),
    })
    this.selectList.scrollToIndex({
      index: currentIndex,
      viewOffset: ITEM_HEIGHT,
      animated: true,
    })
  }

  callCurrentAction = () => {
    if (this.state.data.length > this.state.lastIndex) {
      let item = this.state.data[this.state.lastIndex]
      item && item.action && item.action(item)
    }
  }

  onSelect = item => {
    this.props.onSelect && this.props.onSelect(item)
  }

  itemAction = ({ item, index }) => {
    if (index !== this.state.index) {
      this.setState({
        lastIndex: index,
        data: this.state.data.concat(),
      })
      this.selectList &&
        this.selectList.scrollToIndex({ index: index, viewOffset: ITEM_HEIGHT })
    }
    item.action && item.action(item)
    this.onSelect(item)
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
          <Text style={styles.text}>{item.key}</Text>
        </TouchableHighlight>
      )
    } else {
      return <View key={index + ''} style={styles.item} />
    }
  }

  _getItemLayout = (data, index) => {
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index, // + Math.floor(this.props.viewableItems / 2)
      index,
    }
  }

  renderList = () => {
    return (
      <View
        style={[
          styles.selectList,
          { height: ITEM_HEIGHT * this.props.viewableItems + ARROW_HEIGHT * 2 },
        ]}
      >
        {this.state.lastIndex !== 1 ? (
          <TouchableHighlight
            key={'up'}
            onPress={() => this.scroll(-1)}
            style={styles.arrowView}
          >
            <Image
              resizeMode={'contain'}
              style={styles.arrowImg}
              source={require('../../../../assets/public/arrow_up.png')}
            />
          </TouchableHighlight>
        ) : (
          <View key={'up_placeholder'} style={styles.arrowView} />
        )}
        <View
          key={'selected_view'}
          style={[
            styles.selectedView,
            { position: 'absolute', top: ITEM_HEIGHT + scaleSize(30) },
          ]}
        />
        <FlatList
          key={'list'}
          ref={ref => (this.selectList = ref)}
          data={this.state.data}
          showsVerticalScrollIndicator={false}
          renderItem={this._renderItem}
          getItemLayout={this._getItemLayout}
        />
        {this.state.lastIndex !== this.state.data.length - 2 ? (
          <TouchableHighlight
            key={'down'}
            onPress={() => this.scroll(1)}
            style={styles.arrowView}
          >
            <Image
              resizeMode={'contain'}
              style={styles.arrowImg}
              source={require('../../../../assets/public/arrow_down.png')}
            />
          </TouchableHighlight>
        ) : (
          <View key={'down_placeholder'} style={styles.arrowView} />
        )}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.overlay} {...this._panResponder.panHandlers}>
        {this.renderList()}
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
  selectList: {
    minHeight: scaleSize(300),
    width: scaleSize(330),
    flexDirection: 'column',
    backgroundColor: color.transView,
  },
  text: {
    color: 'white',
    fontSize: size.fontSize.fontSizeLg,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    backgroundColor: 'transparent',
    minWidth: scaleSize(100),
    width: scaleSize(330),
  },
  selectedView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    backgroundColor: '#4680DF',
    minWidth: scaleSize(100),
    width: scaleSize(330),
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
