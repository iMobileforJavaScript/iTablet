/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View, StyleSheet, Text } from 'react-native'

import { TextBtn } from '../../../components'

export default class Tips extends React.Component {

  props: {
    tipText: String,
    btnText: String,
    btnClick: () => {},
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.tipsContainer}>
          <Text style={styles.tips}>{this.props.tipText}</Text>
        </View>
        <TextBtn btnText={this.props.btnText} btnClick={this.props.btnClick}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    height: 40,
    marginTop: 5,
  },
  tipsContainer: {
    height:40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tips: {
    fontSize: 17,
  },
})