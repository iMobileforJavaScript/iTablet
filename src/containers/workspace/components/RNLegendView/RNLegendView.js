/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { FOOTER_HEIGHT } from '../../pages/mapView/MapView'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import color from '../../../../styles/color'

export const HEADER_HEIGHT = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)

export default class RNLegendView extends React.Component {
  props: {
    device: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    this.state = {
      columns: props.device.orientation === 'LANDSCAPE' ? 4 : 2,
      backgroundColor: '#FFFFFF',
      title: getLanguage(this.props.language).Map_Settings.THEME_LEGEND,
      width: 600,
      height: 420,
      widthPercent: 80,
      heightPercent: 80,
      currentPosition: 'topLeft',
      topLeft: { left: 0, top: HEADER_HEIGHT },
      topRight: { right: 0, top: HEADER_HEIGHT },
      leftBottom: { left: 0, bottom: FOOTER_HEIGHT },
      rightBottom: { right: 0, bottom: FOOTER_HEIGHT },
      legendSource: '',
      flatListKey: 0,
    }
    this.startTime = 0
    this.endTime = 0
    this.INTERVAL = 300
  }

  UNSAFE_componentWillMount() {
    if (this.state.legendSource === '') {
      this.getLegendData()
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    let returnFlag = false
    if (this.props.device.orientation !== nextProps.device.orientation) {
      let flatListKey = this.state.flatListKey + 1
      this.setState({
        columns: this.props.device.orientation === 'LANDSCAPE' ? 4 : 2,
        flatListKey,
      })
      returnFlag = true
    }
    if (
      nextState.backgroundColor !== this.state.backgroundColor ||
      nextState.widthPercent !== this.state.widthPercent ||
      nextState.heightPercent !== this.state.heightPercent ||
      nextState.legendSource !== this.state.legendSource
    ) {
      returnFlag = true
    }
    return returnFlag
  }

  componentWillUnmount() {
    SMap.removeLegendListener()
  }
  /**
   *  更改图例属性
   * @param title 标题
   * @param column 列数
   * @param bgcolor 背景色
   * @param width 宽度
   * @param height 高度
   * @param position 位置
   * 位置的四个值 topLeft topRight leftBottom rightBottom
   */
  // changeLegendConfig = ({
  //   title = '图例',
  //   column = 2,
  //   bgcolor = 'white',
  //   width = 300,
  //   height = 325,
  //   position = 'topLeft',
  // } = {}) => {
  //   let legendConfig = { title, column, bgcolor, width, height, position }
  //   this.setState({
  //     legendConfig,
  //   })
  // }

  /**
   * 获取图例数据方法
   * @returns {Promise<void>}
   */
  getLegendData = async () => {
    await SMap.addLegendDelegate({
      legendContentChange: this._contentChange,
    })
  }

  /**
   * 图例内容改变回调
   * @param legendSource
   * @private
   */
  _contentChange = legendSource => {
    this.endTime = +new Date()
    if (this.endTime - this.startTime > this.INTERVAL) {
      legendSource.sort(this.sortMethod('type'))
      this.setState(
        {
          legendSource,
        },
        () => {
          this.startTime = this.endTime
        },
      )
    }
  }
  /**
   * 排序 按照对象属性值
   * @param type
   * @returns {function(*, *): number}
   */
  sortMethod = type => (a, b) => {
    let value1 = a[type]
    let value2 = b[type]
    return value1 - value2
  }

  /**
   * 渲染FlatList里面的图例项
   * @param item
   * @returns {*}
   */
  renderLegendItem = item => {
    let curImageSource = `data:image/png;base64,${item.item.image}`
    return (
      <TouchableOpacity
        style={{
          width: (1 / this.state.columns) * 100 + '%',
          height: scaleSize(80),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        <Image
          source={{ uri: curImageSource }}
          style={{
            width: scaleSize(65),
            height: scaleSize(30),
            resizeMode: 'contain',
          }}
        />
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={{
            flex: 1,
            fontSize: setSpText(20),
            backgroundColor: 'transparent',
            fontWeight: 'bold',
            height: scaleSize(24),
          }}
        >
          {item.item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          width: scaleSize((this.state.width * this.state.widthPercent) / 100),
          height: scaleSize(
            (this.state.height * this.state.heightPercent) / 100,
          ),
          borderColor: 'black',
          borderWidth: scaleSize(3),
          paddingRight: scaleSize(5),
          backgroundColor: this.state.backgroundColor,
          zIndex: 1,
          ...this.state[this.state.currentPosition],
        }}
      >
        <Text
          style={{
            left: '49%',
            position: 'absolute',
            top: 0,
            fontSize: setSpText(12),
            letterSpacing: scaleSize(2),
            color: color.white,
            fontWeight: '900',
          }}
        >
          {this.state.title}
        </Text>
        <Text
          style={{
            position: 'absolute',
            top: 0.5,
            left: '49%',
            letterSpacing: scaleSize(3),
            fontSize: setSpText(12),
          }}
        >
          {this.state.title}
        </Text>
        <FlatList
          style={{
            flex: 1,
          }}
          renderItem={this.renderLegendItem}
          data={this.state.legendSource}
          keyExtractor={(item, index) => item.title + index}
          numColumns={this.state.columns}
          key={this.state.flatListKey}
        />
      </View>
    )
  }
}
