/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React from 'react'
import { ConstToolType } from '../../../../constants/index'
import { TouchableOpacity, View, FlatList } from 'react-native'
import { scaleSize } from '../../../../utils/index'
import { color } from '../../../tabs/Mine/MyService/Styles'

export default class ColorTable extends React.Component {
  props: {
    language: string,
    data: Array,
    device: Object,
    itemAction?: () => {},
  }

  constructor(props) {
    super(props)
    this.listKeyIndex = 0
    this.height =
      this.props.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[7]
        : ConstToolType.THEME_HEIGHT[3]
    this.ColumnNums = this.props.device.orientation === 'LANDSCAPE' ? 12 : 8

    this.state = {
      data: this.dealData(this.props.data),
    }
  }

  shouldComponentUpdate(nextProps) {
    if (
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device) ||
      JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.device.orientation !== this.props.device.orientation) {
      this.height =
        prevProps.device.orientation === 'LANDSCAPE'
          ? ConstToolType.THEME_HEIGHT[7]
          : ConstToolType.THEME_HEIGHT[3]
      this.ColumnNums = prevProps.device.orientation === 'LANDSCAPE' ? 12 : 8
      this.listKeyIndex++
    }
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        data: this.dealData(this.props.data),
      })
    }
  }

  dealData = data => {
    let newData = data.clone()
    while (newData.length % this.ColumnNums !== 0) {
      newData.push({
        useSpace: true,
      })
    }
    return newData
  }

  itemAction = async item => {
    if (this.props.itemAction) {
      this.props.itemAction(item)
    }
  }

  renderItem = ({ item }) => {
    if (typeof item === 'object' && item.useSpace)
      return (
        <View
          style={{
            flex: 1,
            height: this.props.device.width / this.ColumnNums - scaleSize(4),
            backgroundColor: color.white,
            borderWidth: scaleSize(2),
            borderColor: color.white,
            marginVertical: scaleSize(2),
            marginHorizontal: scaleSize(2),
          }}
        />
      )
    return (
      <TouchableOpacity
        onPress={() => {
          this.itemAction(item)
        }}
        style={{
          flex: 1,
          height: this.props.device.width / this.ColumnNums - scaleSize(4),
          backgroundColor: typeof item === 'string' ? item : item.key,
          borderWidth: scaleSize(2),
          borderColor: color.gray,
          marginVertical: scaleSize(2),
          marginHorizontal: scaleSize(2),
        }}
      />
    )
  }

  render() {
    return (
      <View
        style={{
          height: this.height,
          width: '100%',
          // justifyContent: 'flex-end',
          backgroundColor: color.white,
        }}
      >
        <FlatList
          key={'listKey' + this.listKeyIndex}
          renderItem={this.renderItem}
          data={this.state.data}
          keyExtractor={(item, index) =>
            (typeof item === 'string' ? item : item.key) + index
          }
          numColumns={this.ColumnNums}
        />
      </View>
    )
  }
}
