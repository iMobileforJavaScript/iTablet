/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { FlatList, Animated, TouchableOpacity, Text } from 'react-native'
import { ListSeparator } from '../../../../components'
import { scaleSize } from '../../../../utils'

import styles from './styles'

const BAR_WIDTH = scaleSize(400)

export default class DrawerBar extends React.Component {
  props: {
    data: Array,
    onChange: () => {},
  }

  static defaultProps = {
    data: [],
  }

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      left: new Animated.Value(-BAR_WIDTH),
    }
  }

  showBar = isShow => {
    Animated.timing(this.state.left, {
      toValue: isShow ? 0 : -BAR_WIDTH,
      duration: 300,
    }).start()
  }

  action = ({ item, index }) => {
    this.setState(() => {
      // copy the map rather than modifying state.
      const currentIndex = index
      return { currentIndex }
    })
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(item, index)
    }
  }

  _renderItem = ({ item, index }) => {
    let itemStyle =
      this.state.currentIndex === index ? styles.itemSelected : styles.item
    return (
      <TouchableOpacity
        style={itemStyle}
        onPress={() => this.action({ item, index })}
      >
        <Text style={styles.text}>{item.layerInfo.name}</Text>
      </TouchableOpacity>
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator />
  }

  _keyExtractor = (item, index) => item.layerInfo.name + '_' + index

  render() {
    return (
      <Animated.View style={[styles.container, { left: this.state.left }]}>
        <FlatList
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          style={styles.list}
          data={this.props.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          extraData={this.state}
        />
      </Animated.View>
    )
  }
}
