/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { Component } from 'react'
import { View, Image, TouchableOpacity, Text, Animated } from 'react-native'
import Slider from 'react-native-slider'
import { ToolbarModule } from '../ToolBar/modules'
import { SThemeCartography } from 'imobile_for_reactnative'
import styles from './styles'
import { color } from '../../../../styles'
import { scaleSize, setSpText, Toast } from '../../../../utils'
import { ColorWheel } from 'react-native-color-wheel'
import colorsys from 'colorsys'
import { ConstToolType } from '../../../../constants'
import { getLanguage } from '../../../../language'

export default class PreviewColorPicker extends Component {
  props: {
    navigation: Object,
    device: Object,
    language: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      leftSelect: true,
      data: [],
      r: 0,
      g: 0,
      b: 0,
    }
    this.containerHeight =
      this.props.device.orientation === 'LANDSCAPE'
        ? scaleSize(280)
        : scaleSize(400)
    this.bottom = new Animated.Value(-this.containerHeight)
    this.visible = false
    this.selectedIndex = -1
  }

  setVisible = (visible, index = -1) => {
    if (visible === this.visible) {
      return
    }
    this.visible = visible
    this.selectedIndex = index
    Animated.timing(this.bottom, {
      toValue: visible ? 0 : -this.containerHeight,
      time: 300,
    }).start()

    visible && this._getData()
    !visible && this._clearData()
  }

  _clearData = () => {
    this.setState({
      leftSelect: true,
      data: [],
      r: 0,
      g: 0,
      b: 0,
    })
  }

  _getData = () => {
    let data = ToolbarModule.getData().customModeData
    let color = data[this.selectedIndex].color
    let { r, g, b } = color
    this.setState({
      data,
      r,
      g,
      b,
    })
  }

  _changeLeftSelect = select => {
    if (this.state.leftSelect === select) {
      return
    }
    this.setState({
      leftSelect: select,
    })
  }

  _onValueChange = ({ name, value, rgbColor }) => {
    let data = JSON.parse(JSON.stringify(this.state.data))
    let r, g, b
    if (rgbColor !== undefined) {
      r = rgbColor.r
      g = rgbColor.g
      b = rgbColor.b
    } else {
      r = this.state.r
      g = this.state.g
      b = this.state.b
    }
    data[this.selectedIndex].color = {
      r,
      g,
      b,
    }
    if (name !== undefined) {
      this.setState({
        [`${name}`]: value,
        data,
      })
    } else {
      this.setState({
        r,
        g,
        b,
        data,
      })
    }
  }

  _setAttrToMap = async () => {
    let type = ToolbarModule.getData().type
    let data = JSON.parse(JSON.stringify(this.state.data))
    let params = {
      LayerName: GLOBAL.currentLayer.name,
      RangeList: data,
    }
    let rel = false
    switch (type) {
      case ConstToolType.MAP_THEME_PARAM_RANGE_MODE:
        rel = await SThemeCartography.setCustomThemeRange(params)
        break
      case ConstToolType.MAP_THEME_PARAM_RANGELABEL_MODE:
        rel = await SThemeCartography.setCustomRangeLabel(params)
        break
      case ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR:
        rel = await SThemeCartography.setCustomThemeUnique(params)
        break
      case ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_COLOR:
        rel = await SThemeCartography.setCustomUniqueLabel(params)
        break
    }
    if (rel) {
      ToolbarModule.addData({ customModeData: data })
    } else {
      Toast.show(getLanguage(GLOBAL.language).Prompt.PARAMS_ERROR)
    }
  }

  _renderProgress = () => {
    let { r, g, b } = this.state
    let backStyle = {
      backgroundColor: `rgb(${r},${g},${b})`,
    }
    let marginStyle =
      this.props.device.orientation === 'LANDSCAPE'
        ? { marginTop: scaleSize(10) }
        : { marginTop: scaleSize(40) }
    return (
      <View style={styles.progressContainer}>
        <View style={[styles.colorView, backStyle]} />
        <View style={[styles.progresses, marginStyle]}>
          {this._renderSlider({ text: 'r', value: r })}
          {this._renderSlider({ text: 'g', value: g })}
          {this._renderSlider({ text: 'b', value: b })}
        </View>
      </View>
    )
  }

  _renderSlider = ({ text, value }) => {
    const minus = require('../../../../assets/mapTool/icon_minus.png')
    const plus = require('../../../../assets/mapTool/icon_plus.png')
    let sliderStyle =
      this.props.device.orientation === 'LANDSCAPE'
        ? { height: scaleSize(40) }
        : { height: scaleSize(60) }
    return (
      <View style={styles.progressItem}>
        <Text style={styles.sliderText}>{text.toUpperCase()}</Text>
        <TouchableOpacity
          onPress={() => {
            this._onValueChange({
              name: text,
              value: this.state[`${text}`] - 1,
            })
            this._setAttrToMap()
          }}
        >
          <Image source={minus} style={styles.leftIcon} />
        </TouchableOpacity>
        <Slider
          style={[styles.slider, sliderStyle]}
          thumbStyle={{
            backgroundColor: color.item_selected_bg,
            width: scaleSize(30),
            height: scaleSize(30),
            borderRadius: scaleSize(15),
          }}
          trackStyle={{
            height: scaleSize(5),
          }}
          value={value}
          minimumValue={0}
          maximumValue={255}
          step={1}
          minimumTrackTintColor={color.item_selected_bg}
          maximumTrackTintColor={color.gray}
          onValueChange={val => {
            this._onValueChange({ name: text, value: val })
          }}
          onSlidingComplete={this._setAttrToMap}
        />
        <TouchableOpacity
          onPress={() => {
            this._onValueChange({
              name: text,
              value: this.state[`${text}`] + 1,
            })
            this._setAttrToMap()
          }}
        >
          <Image source={plus} style={styles.rightIcon} />
        </TouchableOpacity>
        <Text style={styles.sliderText}>{value}</Text>
      </View>
    )
  }

  _renderColorPicker = () => {
    let extraStyle = {},
      extraTxtStyle = {},
      colorWheelStyle = {
        width: scaleSize(300),
        height: scaleSize(300),
      },
      colorPickerTextStyle = {
        fontSize: setSpText(16),
        paddingLeft: scaleSize(10),
        paddingVertical: scaleSize(30),
      }
    if (this.props.device.orientation === 'LANDSCAPE') {
      extraStyle = { marginLeft: scaleSize(140) }
      extraTxtStyle = { marginRight: scaleSize(140) }
      colorWheelStyle = { width: scaleSize(180), height: scaleSize(180) }
      colorPickerTextStyle = {
        fontSize: setSpText(16),
        paddingLeft: scaleSize(10),
        paddingVertical: scaleSize(10),
      }
    }

    let { r, g, b } = this.state
    let colorHex = colorsys.rgb2Hex({
      r,
      g,
      b,
    })
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ ...extraStyle, flex: 1 }}>
          <ColorWheel
            style={colorWheelStyle}
            initialColor={colorHex}
            thumbSize={scaleSize(30)}
            onColorChange={hsvColor => {
              let rgbColor = colorsys.hsv2Rgb(hsvColor)
              this._onValueChange({ rgbColor })
            }}
            onColorChangeComplete={hsvColor => {
              let rgbColor = colorsys.hsv2Rgb(hsvColor)
              this._onValueChange({ rgbColor })
              this._setAttrToMap()
            }}
          />
        </View>
        <View
          style={{
            width: scaleSize(200),
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            ...extraTxtStyle,
          }}
        >
          <Text style={colorPickerTextStyle}>R: {this.state.r}</Text>
          <Text style={colorPickerTextStyle}>G: {this.state.g}</Text>
          <Text style={colorPickerTextStyle}>B: {this.state.b}</Text>
        </View>
      </View>
    )
  }
  render() {
    let leftStyle, rightStyle, leftText, rightText
    if (this.state.leftSelect) {
      leftStyle = { ...styles.headerItem, backgroundColor: '#303030' }
      leftText = { ...styles.headerTxt, color: '#fbfbfb' }
      rightStyle = styles.headerItem
      rightText = styles.headerTxt
    } else {
      rightStyle = { ...styles.headerItem, backgroundColor: '#303030' }
      rightText = { ...styles.headerTxt, color: '#fbfbfb' }
      leftStyle = styles.headerItem
      leftText = styles.headerTxt
    }
    let height =
      this.props.device.orientation === 'LANDSCAPE'
        ? scaleSize(280)
        : scaleSize(400)
    return (
      <Animated.View
        style={[styles.container, { bottom: this.bottom }, { height: height }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={leftStyle}
            onPress={() => {
              this._changeLeftSelect(true)
            }}
          >
            <Text style={leftText}>RGB</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={rightStyle}
            onPress={() => {
              this._changeLeftSelect(false)
            }}
          >
            <Text style={rightText}>
              {getLanguage(this.props.language).Map_Main_Menu.COLOR_PICKER}
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.leftSelect && this._renderProgress()}
        {!this.state.leftSelect && this._renderColorPicker()}
      </Animated.View>
    )
  }
}
