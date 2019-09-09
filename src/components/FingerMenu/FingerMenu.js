import React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { scaleSize } from '../../utils/index'
import { size, color } from '../../styles/index'

import MenuItem from './MenuItem'

const ITEM_HEIGHT = scaleSize(80)
const VIEW_WIDTH = scaleSize(360)

export default class FingerMenu extends React.Component {
  props: {
    data: Array, // 数据
    initialKey: string, // 初始数据
    selectKey?: '', // 当前选中的key
    viewableItems?: number, // 可见范围item的数量，单数
    autoSelect?: boolean, // 松手自动选择
    onSelect?: () => {}, // 选中item的回调
    onScroll?: () => {}, // 滚动选中item的回调
    rowHeight?: number,
    style?: Object,
  }

  static defaultProps = {
    data: [],
    initialKey: '',
    viewableItems: 5,
    rowHeight: ITEM_HEIGHT,
  }

  constructor(props) {
    super(props)
    const data = this.dealData(props.data)
    let currentIndex = this._getCurrentIndex(data)

    this.state = {
      currentIndex,
      data,
    }

    this.timer = null
    this.contentOffset = null
  }

  componentDidMount() {
    if (this.state.data.length > this.state.currentIndex) {
      // InteractionManager.runAfterInteractions(() => {
      //
      // })
      setTimeout(() => {
        this.list &&
          this.list.scrollToIndex({
            index: this.state.currentIndex,
            viewPosition: 0.5,
            animated: false,
          })
      }, 500)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.data &&
      this.props.data instanceof Array &&
      this.props.data.length > 0 &&
      prevProps.data !== this.props.data
    ) {
      let data = this.dealData(this.props.data)
      let currentIndex = this._getCurrentIndex(data)
      this.setState(
        {
          data: data,
          currentIndex,
        },
        () => {
          this.list &&
            this.list.scrollToIndex({
              index: this.state.currentIndex,
              viewPosition: 0.5,
              animated: false,
            })
        },
      )
    } else if (!this.props.data || this.props.data.length === 0) {
      this.setState({
        data: [],
      })
      this.contentOffset = null
    }
  }

  /**
   * 前后增加 Math.floor(viewableItems) 个空对象
   */
  dealData = data => {
    if (
      !this.props.data ||
      !(this.props.data instanceof Array) ||
      this.props.data.length <= 0
    )
      return []
    let newData = JSON.parse(JSON.stringify(data))
    let zombieNums = Math.floor(this.props.viewableItems / 2)
    for (let i = 0; i < zombieNums; i++) {
      newData.unshift({})
      newData.push({})
    }
    return newData
  }

  _getCurrentIndex = data => {
    let currentIndex =
      data.length > 0 ? Math.floor(this.props.viewableItems / 2) : 0
    if (this.props.initialKey !== undefined && this.props.initialKey !== '') {
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].key !== undefined &&
          data[i].key === this.props.initialKey
        ) {
          currentIndex = i
          break
        }
      }
    }
    return currentIndex
  }

  getCurrentData = () => {
    return {
      data: this.props.data[this.state.currentIndex - 2],
      index: this.state.currentIndex - Math.floor(this.props.viewableItems / 2),
    }
  }

  itemAction = ({ data, index }) => {
    this.setState({
      currentIndex: index,
    })
    this.props.onSelect && this.props.onSelect(data)
  }

  _renderItem = ({ item, index }) => {
    if (item && item.key !== undefined) {
      return (
        <MenuItem
          data={item}
          index={index}
          highLight={index === this.state.currentIndex}
          onPress={itemData => {
            if (itemData.data && itemData.data.key) {
              this.list &&
                this.list.scrollToIndex({
                  index,
                  viewPosition: 0.5,
                })
              this.itemAction(itemData)
            }
          }}
        />
      )
    } else {
      return (
        <View
          key={index + ''}
          style={[styles.item, { height: this.props.rowHeight }]}
        />
      )
    }
  }

  renderSelectedView = () => {
    return (
      <View
        key={'selected_view'}
        style={[
          styles.selectedView,
          {
            top:
              Math.floor(this.props.viewableItems / 2) * this.props.rowHeight,
            height: this.props.rowHeight,
            width: '100%',
          },
        ]}
      />
    )
  }

  getItemLayout = (data, index) => {
    return {
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }
  }

  _scrollToIndex = (index = 0) => {
    if (!this.list || !this.contentOffset) return
    let zombieNums = Math.floor(this.props.viewableItems / 2)
    // let currentIndex = index >= 0 ? index : parseInt(
    //   (this.contentOffset.y / this.props.rowHeight).toFixed(),
    // )
    let currentIndex = index + zombieNums
    if (currentIndex === this.state.currentIndex) return
    if (currentIndex >= 0) {
      let index =
        currentIndex >= this.state.data.length - zombieNums
          ? this.state.data.length - zombieNums - 1
          : currentIndex

      this.list.scrollToIndex({
        index: index,
        viewPosition: 0.5,
      })
    } else {
      this.list.scrollToIndex({
        index: zombieNums,
        viewPosition: 0.5,
      })
    }
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
      this.event = null
    }
  }

  render() {
    return (
      <View style={[styles.menuContainer, { width: '100%' }, this.props.style]}>
        {this.renderSelectedView()}
        <FlatList
          initialNumToRender={20}
          ref={ref => (this.list = ref)}
          style={{
            width: '100%',
            height: this.props.viewableItems * this.props.rowHeight,
            backgroundColor: 'transparent',
          }}
          data={this.state.data}
          renderItem={this._renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          // onMomentumScrollEnd={event => {
          //   if (this.timer) {
          //     this.contentOffset = event.nativeEvent.contentOffset
          //     clearTimeout(this.timer)
          //     this.timer = null
          //     this.timer = setTimeout(() => this._scrollToIndex(), 500)
          //   }
          // }}
          // onScrollBeginDrag={() => {
          //   if (this.timer) {
          //     clearTimeout(this.timer)
          //     this.timer = null
          //   }
          // }}
          // onScrollEndDrag={event => {
          //   if (!this.timer) {
          //     this.contentOffset = event.nativeEvent.contentOffset
          //     this.timer = setTimeout(() => this._scrollToIndex(), 500)
          //   }
          // }}
          onScroll={event => {
            this.contentOffset = event.nativeEvent.contentOffset
            let zombieNums = Math.floor(this.props.viewableItems / 2)
            let _index = parseInt(
              (
                event.nativeEvent.contentOffset.y / this.props.rowHeight
              ).toFixed(),
            )
            let currentIndex = _index + zombieNums
            if (
              currentIndex >= zombieNums &&
              currentIndex !== this.state.currentIndex
            ) {
              this.setState({
                currentIndex: currentIndex,
              })
              if (this.props.onScroll && typeof this.props.onScroll) {
                this.props.onScroll(this.state.data[currentIndex])
              }
            }
          }}
          getItemLayout={this.getItemLayout}
          extraData={this.state.currentIndex}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'column',
    backgroundColor: color.bgW,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedView: {
    position: 'absolute',
    height: ITEM_HEIGHT,
    backgroundColor: '#4680DF',
    width: VIEW_WIDTH,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    height: ITEM_HEIGHT,
    backgroundColor: 'transparent',
    width: '100%',
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
})
