import React, { Component } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import styles from './styles'

export default class Layer3DItem extends Component {
  props: {
    item: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      item: props.item,
      visible: props.item.visible,
      select: props.item.selectable,
    }
  }

  changeSelect = async () => {}

  changeVisible = async () => {}

  more = async () => {}

  render() {
    return (
      <View>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.selectImg}
            onPress={this.changeSelect}
          >
            <View />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.visibleImg}
            onPress={this.changeVisible}
          >
            <View />
          </TouchableOpacity>
          <View style={styles.type} />
          <Text style={styles.itemName}>{this.state.item.name}</Text>
          <TouchableOpacity style={styles.moreView} onPress={this.more}>
            <View style={styles.moreImg} />
          </TouchableOpacity>
        </View>
        <View style={styles.itemSeparator} />
      </View>
    )
  }
}
