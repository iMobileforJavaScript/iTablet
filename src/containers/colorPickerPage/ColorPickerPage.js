/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/
import * as React from 'react'
import { View, Text, TextInput } from 'react-native'
import BorderInput from '../../containers/register&getBack/border_input'
import { Container, BtnTwo } from '../../components'
import { Toast, dataUtil } from '../../utils'
import NavigationService from '../NavigationService'
import styles from './styles'
import { ColorPicker, TriangleColorPicker } from 'react-native-color-picker'

export default class ColorPickerPage extends React.Component {

  props: {
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    const { nav } = this.props
    this.cb = params && params.cb
    this.defaultColor = params && params.defaultColor || '#000000'
    this.state = {
      InputText: '',
      color: this.defaultColor,
    }
  }

  onColorChange = color => {
    this.setState({ color })
  }
  
  renderColorAttrRow = ({key, value}) => {
    return (
      <View style={styles.row}>
        <Text>{key}</Text>
        <Text>{value}</Text>
      </View>
    )
  }
  
  renderColorAttr = () => {
    let rows = []
    let rgba = dataUtil.colorRgba(this.state.color) || {}
    for (let key in Object.keys(rgba)) {
      rows.push(this.renderColorAttrRow(key, rgba[key]))
    }
    return (
      <View style={styles.rows}>
        {rows}
      </View>
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        scrollable
        headerProps={{
          title: '新建图层',
          navigation: this.props.navigation,
        }}>
        <TriangleColorPicker
          oldColor={this.defaultColor}
          color={this.state.color}
          onColorChange={this.onColorChange}
          // onColorSelected={color => alert(`Color selected: ${color}`)}
          onOldColorSelected={this.onColorChange}
          style={styles.colorPicker}
        />
        {this.renderColorAttr()}
      </Container>
    )
  }
}
