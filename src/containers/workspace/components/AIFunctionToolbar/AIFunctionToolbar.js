/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Animated, FlatList, Platform } from 'react-native'
import { MTBtn } from '../../../../components'
import { ConstToolType, Const } from '../../../../constants'
import { scaleSize, setSpText } from '../../../../utils'
import styles from './styles'
import PropTypes from 'prop-types'
import constants from '../../constants'

const COLLECTION = 'COLLECTION'
const NETWORK = 'NETWORK'
const EDIT = 'EDIT'
// const MAP_THEME = 'MAP_THEME'
/**
 * @deprecated 移除当前的类型，使用constants
 */
export { COLLECTION, NETWORK, EDIT }
import { getLanguage } from '../../../../language/index'

const HeaderHeight = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)
const BottomHeight = scaleSize(100)

export default class AIFunctionToolbar extends React.Component {
  props: {
    language: string,
    style?: any,
    hide?: boolean,
    device: Object,
    type: string,
    data?: Array,
    layers: PropTypes.object,
    getToolRef: () => {},
    showFullMap: () => {},

    device: Object,
    user: Object,
  }

  static defaultProps = {
    type: constants.MAP_COLLECTION,
    hide: false,
    direction: 'column',
    separator: 20,
  }

  constructor(props) {
    super(props)
    let data = props.data || this.getData(props.type)
    this.state = {
      type: props.type,
      data: data,
      right: new Animated.Value(scaleSize(20)),
    }
    this.visible = true
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device)
    ) {
      return true
    }
    return false
  }

  setVisible = (visible, immediately = false) => {
    if (this.visible === visible) return
    Animated.timing(this.state.right, {
      toValue: visible ? scaleSize(20) : scaleSize(-200),
      duration: immediately ? 0 : Const.ANIMATED_DURATION,
    }).start()
    this.visible = visible
  }

  start = type => {
    this.setVisible(false)
    const toolRef = this.props.getToolRef()
    let height
    if (ConstToolType.AIMapSuspension === type) {
      height =
        this.props.device.orientation === 'LANDSCAPE'
          ? ConstToolType.HEIGHT[0]
          : ConstToolType.HEIGHT[1]
    } else {
      height = ConstToolType.HEIGHT[1]
    }
    if (toolRef) {
      GLOBAL.AIMAPSUSPENSION = true
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, type, {
        containerType: 'table',
        column: this.props.device.orientation === 'LANDSCAPE' ? 5 : 4,
        height: height,
      })
    }
  }

  /** 获取一级数据 **/
  getData = type => {
    let data
    switch (type) {
      case constants.MAP_AR:
        data = [
          {
            key: '开始',
            title: getLanguage(this.props.language).Map_Main_Menu.START,
            // title: '开始',
            action: () => this.start(ConstToolType.AIMapSuspension),
            image: require('../../../../assets/function/icon_function_start.png'),
          },
        ]
        break
    }
    return data
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.btnView} key={this._keyExtractor(item, index)}>
        <MTBtn
          style={styles.btn}
          key={index}
          title={item.title}
          textColor={'black'}
          textStyle={{ fontSize: setSpText(20) }}
          size={MTBtn.Size.NORMAL}
          image={item.image}
          onPress={item.action}
          activeOpacity={0.5}
          // separator={scaleSize(2)}
        />
      </View>
    )
  }

  _renderItemSeparatorComponent = () => {
    return <View style={styles.separator} />
  }

  _keyExtractor = (item, index) => index + '-' + item.title

  renderList = () => {
    return (
      <FlatList
        style={{
          maxHeight:
            this.props.device.height -
            HeaderHeight -
            BottomHeight -
            scaleSize(100),
        }}
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    )
  }

  render() {
    if (this.props.hide) {
      return null
    }
    return (
      <Animated.View
        style={[
          styles.container,
          this.props.style,
          { right: this.state.right },
        ]}
      >
        {this.renderList()}
      </Animated.View>
    )
  }
}
