/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import * as Util from '../utils/constUtil'

const WIDTH = Util.WIDTH

export default class SimpleHeader extends React.Component {
  props: {
    title: any,
  }

  render() {
    const title = this.props.title ? this.props.title : 'header'
    return (
      <View style={styles.header}>
        <Text style={styles.text}>{title}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: Util.HEADER_HEIGHT,
    width: WIDTH,
    backgroundColor: Util.HEADER_COLOR,
  },
  text: {
    color: 'white',
    fontSize: 23,
  },
})
