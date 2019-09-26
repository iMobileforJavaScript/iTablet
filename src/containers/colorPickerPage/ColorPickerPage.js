/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/
import * as React from 'react'
import { Dimensions, View, Text, TextInput } from 'react-native'
import { Container, Button } from '../../components'
import { dataUtil, scaleSize } from '../../utils'
import { color } from '../../styles'
import NavigationService from '../NavigationService'
import styles from './styles'
import { TriangleColorPicker, fromHsv } from 'react-native-color-picker'
import ColorShortcut from './ColorShortcut'

import { ColorWheel } from 'react-native-color-wheel'
import colorsys from 'colorsys'

export default class ColorPickerPage extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.defaultColor = (params && params.defaultColor) || '#000000'
    let colorHex =
      (params &&
        params.defaultColor &&
        dataUtil.colorRgba(this.defaultColor)) ||
      {}
    this.lastValidColor = this.defaultColor // 记录上一次正确格式的十六进制颜色
    this.colorViewType = params && params.colorViewType
    this.state = {
      InputText: '',
      color: this.defaultColor,
      colorHex: colorHex,
    }
  }

  componentDidMount() {
    if (this.colorWheel) {
      this.colorWheel.resetPanHandler()
    }
  }

  onColorChange = color => {
    let hex = fromHsv(color)
    this.setState({
      color: hex,
      colorHex: dataUtil.colorRgba(fromHsv(color)),
    })
  }

  renderColorAttrRow = (key, value) => {
    let isRgb = key === 'r' || key === 'g' || key === 'b' || key === 'a'
    return (
      <View style={styles.row} key={key}>
        <Text style={styles.text}>{key.toUpperCase()}</Text>
        {/*<Text>{value}</Text>*/}
        <TextInput
          accessible={true}
          keyboardType={isRgb ? 'numeric' : 'default'}
          accessibilityLabel={key}
          maxLength={isRgb ? 3 : 7}
          // value={isRgb ? (this.state.colorHex[key] + '') : this.state.color}
          value={value + ''}
          onChangeText={text => {
            if (!isRgb) {
              if (dataUtil.checkColor(text)) this.lastValidColor = text
              let reg = /^([0-9a-fA-F])$/
              if (
                text.length !== 1 &&
                !reg.test(text.charAt(text.length - 1))
              ) {
                return
              }

              this.setState({
                color: text === '' ? '#' : text,
                colorHex: dataUtil.colorRgba(this.lastValidColor),
              })
              return
            }
            let val
            if (text === '') {
              val = 0
            } else {
              val = parseInt(text)
            }
            if (isNaN(val) || val < 0 || val > 255) {
              return
            }
            let newColor = this.state.colorHex
            Object.assign(newColor, { [key]: val })
            this.setState({
              colorHex: newColor,
              color: dataUtil.colorHex(newColor),
            })
          }}
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholderTextColor={color.USUAL_SEPARATORCOLOR}
        />
      </View>
    )
  }

  renderColorAttr = () => {
    let rows = []
    let keys = Object.keys(this.state.colorHex)
    for (let i = 0; i < keys.length; i++) {
      if (this.colorViewType == 'ColorWheel' && keys[i] == 'a') {
        continue
      }
      rows.push(
        this.renderColorAttrRow(
          keys[i].toString(),
          this.state.colorHex[keys[i]],
        ),
      )
    }
    rows.push(this.renderColorAttrRow('16进制', this.state.color))
    return <View style={styles.rows}>{rows}</View>
  }

  confirm = () => {
    this.cb && this.cb(this.state.color)
    NavigationService.goBack()
  }

  reset = () => {
    this.setState({
      color: this.defaultColor,
      colorHex: dataUtil.colorRgba(this.defaultColor),
    })
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
        <Button type={Button.Type.GRAY} title={'重置'} onPress={this.reset} />
        <Button title={'确定'} onPress={this.confirm} />
      </View>
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: '颜色选择',
          navigation: this.props.navigation,
        }}
      >
        <ColorShortcut
          onPress={color => {
            this.setState({
              color: color,
              colorHex: dataUtil.colorRgba(color),
            })
          }}
        />
        {this.colorViewType === 'ColorWheel' ? (
          <View style={{ flex: 2 }}>
            <ColorWheel
              ref={ref => (this.colorWheel = ref)}
              initialColor={this.defaultColor}
              onColorChange={color => {
                this.setState({
                  color: colorsys.hsv2Hex(color),
                  colorHex: dataUtil.colorRgba(colorsys.hsv2Hex(color)),
                })
              }}
              onColorChangeComplete={() => {
                this.colorWheel.onLayout()
              }}
              // style={{ marginLeft: 20, padding: 40, height: 200, width: 200 }}
              style={{
                width: Dimensions.get('window').width,
                height: scaleSize(200),
                alignSelf: 'center',
              }}
              thumbStyle={{ height: 30, width: 30, borderRadius: 30 }}
            />
          </View>
        ) : (
          <TriangleColorPicker
            oldColor={this.defaultColor}
            color={
              dataUtil.checkColor(this.state.color)
                ? this.state.color
                : this.lastValidColor
            }
            onColorChange={this.onColorChange}
            // onColorSelected={color => alert(`Color selected: ${color}`)}
            onOldColorSelected={this.onColorChange}
            style={styles.colorPicker}
          />
        )}
        {this.renderColorAttr()}
        {this.renderBtns()}
      </Container>
    )
  }
}
