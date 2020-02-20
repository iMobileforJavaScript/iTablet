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
    legendSettings: Object,
    setMapLegend: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      title: getLanguage(this.props.language).Map_Settings.THEME_LEGEND,
      width: 600,
      height: 420,
      topLeft: { left: 0, top: HEADER_HEIGHT },
      topRight: { right: 0, top: HEADER_HEIGHT },
      leftBottom: { left: 0, bottom: FOOTER_HEIGHT },
      rightBottom: { right: 0, bottom: FOOTER_HEIGHT },
      legendSource: '',
      flatListKey: 0,
      imageSize: scaleSize(120),
      fontSize: setSpText(40),
    }
    this.startTime = 0
    this.endTime = 0
    this.INTERVAL = 300
  }

  setMapLegend = ({ backgroundColor }) => {
    let settings = this.props.legendSettings
    settings[GLOBAL.Type].backgroundColor = backgroundColor
    this.props.setMapLegend && this.props.setMapLegend(settings)
  }

  UNSAFE_componentWillMount() {
    if (this.state.legendSource === '') {
      this.getLegendData()
    }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   let returnFlag = false
  //   if (this.props.device.orientation !== nextProps.device.orientation) {
  //     let flatListKey = this.state.flatListKey + 1
  //     this.setState({
  //       columns: this.props.legendSettings.column,
  //       flatListKey,
  //     })
  //     returnFlag = true
  //   }
  //   if (
  //     nextState.legendSource !== this.state.legendSource ||
  //     JSON.stringify(nextProps) !== JSON.stringify(this.props)
  //   ) {
  //     returnFlag = true
  //   }
  //   return returnFlag
  // }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.legendSettings[GLOBAL.Type].column !==
      this.props.legendSettings[GLOBAL.Type].column
    ) {
      let flatListKey = this.state.flatListKey + 1
      this.setState({
        flatListKey,
      })
    }
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
    await SMap.addLegendListener({
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
    let curImageSize =
      (this.state.imageSize *
        this.props.legendSettings[GLOBAL.Type].imagePercent) /
      100
    let curFontSize =
      (this.state.fontSize *
        this.props.legendSettings[GLOBAL.Type].fontPercent) /
      100
    return (
      <TouchableOpacity
        style={{
          width:
            (1 / this.props.legendSettings[GLOBAL.Type].column) * 100 + '%',
          height: scaleSize(80),
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
      >
        {item.item.image && (
          <Image
            source={{ uri: `data:image/png;base64,${item.item.image}` }}
            style={{
              width: curImageSize,
              height: curImageSize / 2,
              resizeMode: 'contain',
            }}
          />
        )}
        {item.item.color && (
          <View
            style={{
              width: curImageSize,
              height: curImageSize / 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: (curImageSize * 3) / 4,
                height: (curImageSize * 9) / 16,
                backgroundColor: item.item.color,
              }}
            />
          </View>
        )}
        <Text
          numberOfLines={1}
          ellipsizeMode={'tail'}
          style={{
            flex: 1,
            fontSize: curFontSize,
            backgroundColor: 'transparent',
            fontWeight: 'bold',
            height: curFontSize + scaleSize(4),
          }}
        >
          {item.item.title.replace(/\s<=?\sX\s<\s/, '~')}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    if (this.props.legendSettings[GLOBAL.Type]) {
      let frontStyle =
        this.props.language === 'CN'
          ? {
            position: 'absolute',
            top: 0,
            left: '46%',
            letterSpacing: scaleSize(2),
            fontSize: setSpText(18),
          }
          : {
            position: 'absolute',
            top: 0,
            left: '35%',
            letterSpacing: scaleSize(2),
            fontSize: setSpText(18),
          }
      let backStyle =
        this.props.language === 'CN'
          ? {
            left: '46%',
            position: 'absolute',
            top: 0,
            fontSize: setSpText(18),
            letterSpacing: scaleSize(2),
            color: color.white,
            fontWeight: '900',
          }
          : {
            left: '35%',
            position: 'absolute',
            top: 0,
            fontSize: setSpText(18),
            letterSpacing: scaleSize(1.1),
            color: color.white,
            fontWeight: '900',
          }
      return (
        <View
          style={{
            position: 'absolute',
            width: scaleSize(
              (this.state.width *
                this.props.legendSettings[GLOBAL.Type].widthPercent) /
                100,
            ),
            height: scaleSize(
              (this.state.height *
                this.props.legendSettings[GLOBAL.Type].heightPercent) /
                100,
            ),
            borderColor: 'black',
            borderWidth: scaleSize(3),
            paddingRight: scaleSize(5),
            backgroundColor: this.props.legendSettings[GLOBAL.Type]
              .backgroundColor,
            zIndex: 1,
            ...this.state[
              this.props.legendSettings[GLOBAL.Type].legendPosition
            ],
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: scaleSize(30),
              backgroundColor: this.props.legendSettings[GLOBAL.Type]
                .backgroundColor,
              zIndex: 999,
            }}
          >
            <Text style={backStyle}>{this.state.title}</Text>
            <Text style={frontStyle}>{this.state.title}</Text>
          </View>
          <FlatList
            style={{
              flex: 1,
            }}
            renderItem={this.renderLegendItem}
            data={this.state.legendSource}
            keyExtractor={(item, index) => item.title + index}
            numColumns={this.props.legendSettings[GLOBAL.Type].column}
            key={this.state.flatListKey}
          />
        </View>
      )
    }
    return null
  }
}
