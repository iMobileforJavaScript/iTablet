/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { FlatList, Animated } from 'react-native'
import { ListSeparator, ImageButton } from '../../../../components'
import { scaleSize } from '../../../../utils'
import { getLayerIconByType } from '../../../../assets'

import styles from './styles'

const BAR_WIDTH = scaleSize(400)

export default class DrawerBar extends React.Component {
  props: {
    data: Array,
    index: number,
    onChange: () => {},
  }

  static defaultProps = {
    data: [],
    index: 0,
  }

  constructor(props) {
    super(props)
    this.state = {
      currentIndex: props.index,
      left: new Animated.Value(-BAR_WIDTH),
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.index !== this.props.index &&
      this.props.index !== this.state.currentIndex
    ) {
      this.setState({
        currentIndex: this.props.index,
      })
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
      this.props.onChange({ item, index })
    }
  }

  _renderItem = ({ item, index }) => {
    let icon,
      iconStyle = styles.icon,
      containerStyle = styles.item,
      textStyle = styles.text,
      iconBtnStyle = styles.iconBtn
    if (this.state.currentIndex === index) {
      containerStyle = styles.selectedItem
      textStyle = styles.selectedText
      iconBtnStyle = styles.selectedIconBtn
    }
    icon = getLayerIconByType(item.layerInfo.type)

    return (
      <ImageButton
        containerStyle={containerStyle}
        titleStyle={textStyle}
        iconBtnStyle={iconBtnStyle}
        iconStyle={iconStyle}
        icon={icon}
        title={item.layerInfo.name}
        direction={'row'}
        onPress={() => this.action({ item, index })}
      />
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
