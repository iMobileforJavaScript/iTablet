/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { size } from '../styles'

export default class EmptyView extends PureComponent {

  props: {
    style?: StyleSheet,
    titleStyle?: StyleSheet,
    children: any,
    title: string,
  }

  static defaultProps = {
    title: '数据为空',
  }

  renderEmptyInfo = () => {
    return (
      <Text></Text>
    )
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {
          this.props.children
            ? this.props.children
            : <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: size.fontSize.fontSizeLg,
  },
})
