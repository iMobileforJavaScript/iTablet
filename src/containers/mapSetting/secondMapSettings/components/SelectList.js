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
    }
  }

  showFullMap = () => {
    Animated.timing(this.state.bottom, {
      toValue: 0,
      duration: 150,
    }).start()
  }

  hideSelectList = () => {
    Animated.timing(this.state.bottom, {
      toValue: -this.height,
      duration: 150,
    }).start()
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
            let isSuccess = await item.action()
            if (isSuccess) this.props.callback(item.value)
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