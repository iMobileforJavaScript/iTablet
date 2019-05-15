/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
//com.supermap.RN.Map.Legend.legend_content_change
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
export const HEADER_HEIGHT = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)

export default class RNLegendView extends React.Component {
  props: {
    device: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      columns: props.device.orientation === 'LANDSCAPE' ? 4 : 2,
      backgroundColor: '#FFFFFF',
      title: '图例',
      width: 450,
      height: 325,
      currentPosition: 'topLeft',
      topLeft: { left: 0, top: HEADER_HEIGHT },
      topRight: { right: 0, top: HEADER_HEIGHT },
      leftBottom: { left: 0, bottom: FOOTER_HEIGHT },
      rightBottom: { right: 0, bottom: FOOTER_HEIGHT },
      legendSource: '',
      flatListKey: 0,
      visible: true,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.setState({
        columns: this.props.device.orientation === 'LANDSCAPE' ? 4 : 2,
      })
    }
    this.state.legendSource === '' && this.getLegendData()
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
    legendSource.sort(this.sortMethod('type'))
    this.setState({
      legendSource,
    })
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
            fontSize: setSpText(18),
            backgroundColor: 'transparent',
            fontWeight: 'bold',
            height: scaleSize(20),
          }}
        >
          {item.item.title}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    if (!this.state.visible) return <View />
    return (
      <View
        style={{
          position: 'absolute',
          width: scaleSize(this.state.width),
          height: scaleSize(this.state.height),
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
            fontSize: setSpText(24),
            textAlign: 'center',
            backgroundColor: 'transparent',
            fontWeight: 'bold',
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
