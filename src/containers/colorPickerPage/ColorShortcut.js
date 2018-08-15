/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/
import * as React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { scaleSize } from '../../utils'
import { color } from '../../styles'

const styles = StyleSheet.create({
  container: {
    marginVertical: scaleSize(30),
    marginHorizontal: scaleSize(30),
    flexDirection: 'row',
    height: scaleSize(100),
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(8),
    borderWidth: scaleSize(2),
    borderColor: color.grayLight,
  },
})

export default class ColorShortcut extends React.Component {

  props: {
    onPress: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      colors: [
        color.white, color.red, color.yellow,
        color.grassGreen, color.cyan, color.black,
      ],
    }
  }

  action = color => {
    this.props.onPress && this.props.onPress(color)
  }

  renderItem = color => {
    return (
      <TouchableOpacity
        key={color}
        activeOpacity={0.8}
        style={[styles.item, {backgroundColor: color}]}
        onPress={() => this.action(color)}
      />
    )
  }

  renderItems = () => {
    let colorViews = []
    this.state.colors.forEach(color => {
      colorViews.push(this.renderItem(color))
    })
    return colorViews
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderItems()}
      </View>
    )
  }
}
