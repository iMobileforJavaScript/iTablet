/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import React from 'react'
import { TouchableOpacity, View, Animated, FlatList, Text } from 'react-native'
import { color } from '../../../tabs/Mine/MyService/Styles'
import styles from '../styles'

export default class SelectList extends React.Component {
  props: {
    language: string,
    data: Array,
    height: string,
    device: Object,
    callback: () => {},
  }

  constructor(props) {
    super(props)
    this.height = this.props.height
    this.state = {
      bottom: new Animated.Value(-this.height),
      boxHeight: new Animated.Value(-this.props.device.height),
    }
  }

  showFullMap = () => {
    let anims = [
      Animated.timing(this.state.bottom, {
        toValue: 0,
        duration: 150,
      }),
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: 150,
      }),
    ]
    Animated.parallel(anims).start()
  }

  hideSelectList = () => {
    let anims = [
      Animated.timing(this.state.bottom, {
        toValue: -this.height,
        duration: 150,
      }),
      Animated.timing(this.state.boxHeight, {
        toValue: -this.props.device.height,
        duration: 150,
      }),
    ]
    Animated.parallel(anims).start()
  }

  renderLine = () => {
    return (
      <View
        style={{
          flex: 1,
          height: 1,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={async () => {
            let isSucess = await item.action()
            if (isSucess) this.props.callback(item.value)
          }}
        >
          <View style={styles.row}>
            <Text style={styles.itemName}>{item.value}</Text>
          </View>
        </TouchableOpacity>
        {this.renderLine()}
      </View>
    )
  }
  render() {
    return (
      <View>
        <Animated.View
          style={{
            width: this.props.device.width,
            height: this.props.device.height,
            position: 'absolute',
            backgroundColor: color.gray1,
            opacity: 0.5,
            bottom: this.state.boxHeight,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.hideSelectList()
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
          }}
        >
          <FlatList
            renderItem={this.renderItem}
            data={this.props.data}
            keyExtractor={(item, index) => item.value + index}
            numColumns={1}
          />
        </Animated.View>
      </View>
    )
  }
}
