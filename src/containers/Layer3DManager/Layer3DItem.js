import React, { Component } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
// import { SScene } from 'imobile_for_reactnative'
import styles from './styles'

export default class Layer3DItem extends Component {
  props: {
    item: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      name: props.item.name,
      visible: props.item.visible,
      selectable: props.item.selectable,
    }
  }

  changeSelect = async () => {
    let oldVisible = this.state.visible
    let newVisible = !oldVisible
    // await SScene.setVisible(this.state.name,newVisible)
    this.setState({ visible: newVisible })
    // console.log(this.state.visible)
  }

  changeVisible = async () => {
    let oldselectable = this.state.selectable
    let newselectable = !oldselectable
    //   await SScene.setSelectable(this.state.name,newselectable)
    this.setState({ selectable: newselectable })
    // console.log(this.state.selectable)
  }

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
          <Text style={styles.itemName}>{this.state.name}</Text>
          <TouchableOpacity style={styles.moreView} onPress={this.more}>
            <View style={styles.moreImg} />
          </TouchableOpacity>
        </View>
        <View style={styles.itemSeparator} />
      </View>
    )
  }
}
