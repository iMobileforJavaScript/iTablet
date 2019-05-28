/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React from 'react'
import { ConstToolType } from '../../../../constants/index'

import { TouchableOpacity, View, Animated, FlatList } from 'react-native'
import { scaleSize } from '../../../../utils/index'
import { color } from '../../../tabs/Mine/MyService/Styles'
import { HEADER_HEIGHT } from '../../../../components/Header/styles'

export default class ColorTable extends React.Component {
  props: {
    language: string,
    data: Array,
    device: Object,
    setColorBlock: () => {},
  }

  constructor(props) {
    super(props)
    this.height =
      this.props.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[7]
        : ConstToolType.THEME_HEIGHT[3]
    this.ColumeNums = this.props.device.orientation === 'LANDSCAPE' ? 16 : 8
    this.state = {
      bottom: new Animated.Value(-this.height),
      boxOpacity: new Animated.Value(0),
      boxBottom: new Animated.Value(HEADER_HEIGHT - this.props.device.height),
    }
  }

  showFullMap = () => {
    let anims = [
      Animated.timing(this.state.bottom, {
        toValue: 0,
        duration: 150,
      }),
      Animated.timing(this.state.boxOpacity, {
        toValue: 0.5,
        duration: 150,
      }),
      Animated.timing(this.state.boxBottom, {
        toValue: 0,
        duration: 10,
      }),
    ]
    Animated.parallel(anims).start()
  }

  hideColorList = () => {
    let anims = [
      Animated.timing(this.state.bottom, {
        toValue: -this.height,
        duration: 150,
      }),
      Animated.timing(this.state.boxOpacity, {
        toValue: 0,
        duration: 150,
      }),
      Animated.timing(this.state.boxBottom, {
        toValue: HEADER_HEIGHT - this.props.device.height,
        duration: 10,
      }),
    ]
    Animated.parallel(anims).start()
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          let isSuccess = await item.action()
          if (isSuccess) this.props.setColorBlock(item.key)
        }}
        style={{
          width: this.props.device.width / this.ColumeNums - 2,
          height: this.props.device.width / this.ColumeNums - 2,
          backgroundColor: item.key,
          borderWidth: scaleSize(2),
          borderColor: color.gray,
          marginVertical: scaleSize(2),
          marginHorizontal: scaleSize(2),
        }}
      />
    )
  }

  render() {
    let height = this.props.device.height - HEADER_HEIGHT + 2
    return (
      <View>
        <Animated.View
          style={{
            width: this.props.device.width,
            height: height,
            position: 'absolute',
            backgroundColor: color.gray1,
            opacity: this.state.boxOpacity,
            bottom: this.state.boxBottom,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.hideColorList()
            }}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </Animated.View>
        <Animated.View
          style={{
            height: this.height,
            width: '100%',
            position: 'absolute',
            bottom: this.state.bottom,
            backgroundColor: color.white,
          }}
        >
          <FlatList
            renderItem={this.renderItem}
            data={this.props.data}
            keyExtractor={(item, index) => item.key + index}
            numColumns={this.ColumeNums}
          />
        </Animated.View>
      </View>
    )
  }
}
