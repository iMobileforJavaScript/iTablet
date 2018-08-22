/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import * as Util from '../../utils/constUtil'

const bgColor = Util.USUAL_BLUE
const fontColor = 'white'

export default class BtnTwo extends React.Component {

  props: {
    style: any,
    text: string,
    width: number,
    radius: number,
    size: number,
    btnClick: () => {},
  }

  action = () => {
    this.props.btnClick && this.props.btnClick()
  }

  render() {
    const text = this.props.text ? this.props.text : '默认按钮'
    const width = this.props.width ? { width: this.props.width } : { width: 70 }
    const radius = this.props.radius ? { borderRadius: this.props.radius } : { borderRadius: 20 }
    const size = this.props.size ? this.props.size : 17
    return (
      <TouchableOpacity accessibilityLabel={text} style={[styles.btn, this.props.style, width, radius]} onPress={this.action} underlayColor={Util.UNDERLAYCOLOR}>
        <Text style={[styles.btn_text, { fontSize: size }]}>{text}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 70,
    borderRadius: 20,
    backgroundColor: bgColor,
  },
  btn_text: {
    color: fontColor,
    fontSize: 17,
  },
})