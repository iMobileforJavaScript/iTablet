/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React from 'react'
import { ConstToolType } from '../../../../constants/index'
import { TouchableOpacity, View, FlatList, Text } from 'react-native'
import { scaleSize } from '../../../../utils/index'
import { color } from '../../../tabs/Mine/MyService/Styles'

export default class ColorTable extends React.Component {
  props: {
    language: string,
    data: Array,
    device: Object,
    itemAction?: () => {},
    callback?: () => {},
  }

  constructor(props) {
    super(props)
    this.listKeyIndex = 0
    this.height =
      this.props.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[7]
        : ConstToolType.THEME_HEIGHT[3]
    this.ColumnNums = this.props.device.orientation === 'LANDSCAPE' ? 12 : 8
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.device.orientation !== this.props.device.orientation) {
      this.height =
        nextProps.device.orientation === 'LANDSCAPE'
          ? ConstToolType.THEME_HEIGHT[7]
          : ConstToolType.THEME_HEIGHT[3]
      this.ColumnNums = nextProps.device.orientation === 'LANDSCAPE' ? 12 : 8
      this.listKeyIndex++
    }
  }
  itemAction = async item => {
    if (this.props.itemAction) {
      this.props.itemAction(item)
    } else {
      let isSuccess = await item.action()
      if (isSuccess) this.props.callback && this.props.callback(item.key)
    }
  }
  renderItem = ({ item }) => {
    if (item.useSpace)
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
          backgroundColor: item.key,
          borderWidth: scaleSize(2),
          borderColor: color.gray,
          marginVertical: scaleSize(2),
          marginHorizontal: scaleSize(2),
        }}
      >
        <View
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {item.text ? (
            <Text
              style={{
                fontSize: scaleSize(25),
                color: 'black',
                textAlign: 'center',
              }}
            >
              {item.text}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    let data = this.props.data
    while (data.length % this.ColumnNums !== 0) {
      data.push({
        useSpace: true,
      })
    }
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
          data={this.props.data}
          keyExtractor={(item, index) => item.key + index}
          numColumns={this.ColumnNums}
        />
      </View>
    )
  }
}
