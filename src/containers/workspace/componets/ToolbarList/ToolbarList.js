/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, FlatList } from 'react-native'
import { MTBtn } from '../../../../components'
import styles from './styles'

export default class ToolbarList extends React.Component {
  props: {
    data: Array,
    style?: any,
    hide?: boolean,
    direction?: string,
    separator?: number,
  }

  static defaultProps = {
    data: [],
    hide: false,
    direction: 'column',
    separator: 20,
  }

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: -1,
    }
  }

  itemAction = ({ item, index }) => {
    this.setState(
      {
        currentIndex: index,
      },
      () => {
        item.action && item.action()
      },
    )
  }

  _renderItem = ({ item, index }) => {
    return (
      <MTBtn
        key={index}
        style={styles.btn}
        selected={index === this.state.currentIndex}
        title={item.title}
        textColor={'white'}
        size={MTBtn.Size.NORMAL}
        image={item.image}
        onPress={() => {
          this.itemAction({ item, index })
        }}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <View style={styles.separator} />
  }

  _keyExtractor = item => item.key

  render() {
    if (this.props.hide) {
      return null
    }
    return (
      <FlatList
        style={[styles.container, this.props.style]}
        data={this.props.data}
        renderItem={this._renderItem}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        ListFooterComponent={this._renderItemSeparatorComponent}
        ListHeaderComponent={this._renderItemSeparatorComponent}
        keyExtractor={this._keyExtractor}
      />
    )
  }
}
