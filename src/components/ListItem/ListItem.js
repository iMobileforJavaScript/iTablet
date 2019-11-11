/**
 * 列表item
 */
import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, Image, View } from 'react-native'

import styles from './styles'

export default class ListItem extends PureComponent {
  props: {
    icon?: any, // 左边的图标
    type?: string, // item类型
    title: string, // 标题
    value?: string, // 标题
    onPress?: () => {}, // 点击事件
  }

  static defaultProps = {
    clickAble: true,
    type: 'normal', // arrow
  }

  constructor(props) {
    super(props)
  }

  _onPress = () => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      this.props.onPress()
    }
  }

  render() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.container, { width: '100%' }]}
        onPress={this._onPress}
      >
        <View style={styles.contentView}>
          {this.props.icon && (
            <Image
              style={styles.image}
              resizeMode={'contain'}
              source={this.props.icon}
            />
          )}
          <Text style={styles.title}>{this.props.title}</Text>
          <Text style={styles.value}>{this.props.value}</Text>
          {this.props.type === 'arrow' &&
            (this.props.onPress ? (
              <Image
                style={styles.image}
                resizeMode={'contain'}
                source={require('../../assets/Mine/mine_my_arrow.png')}
              />
            ) : (
              <View style={styles.image} />
            ))}
        </View>
        <View style={styles.separator} />
      </TouchableOpacity>
    )
  }
}
