/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import React from 'react'
import {
  TouchableOpacity,
  View,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native'
import { scaleSize, setSpText } from '../../../../../../../utils'
import { color } from '../../../../../../../styles'

export default class SelectList extends React.Component {
  props: {
    data: Array,
    listAction?: () => {},
  }

  constructor(props) {
    super(props)
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

  _onPress = item => {
    if (item.action) {
      item.action()
    } else if (this.props.listAction) {
      this.props.listAction(item)
    }
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this._onPress(item)
        }}
      >
        <View style={styles.row}>
          <Text style={styles.itemName}>{item.value}</Text>
        </View>
        {this.renderLine()}
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <FlatList
        renderItem={this.renderItem}
        data={this.props.data}
        keyExtractor={(item, index) => item.value + index}
        numColumns={1}
      />
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: 'row',
    height: scaleSize(80),
    paddingHorizontal: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemName: {
    color: '#303030',
    fontSize: setSpText(26),
  },
})
