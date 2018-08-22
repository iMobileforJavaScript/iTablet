/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import { scaleSize } from '../../utils/index'

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  imageSm: {
    height: scaleSize(60),
    width: scaleSize(60),
    alignSelf: 'center',
  },
  imageLg: {
    height: scaleSize(80),
    width: scaleSize(80),
    alignSelf: 'center',
  },
  text: {
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})

export default class BtnOne extends React.Component {

  props: {
    style: any,
    BtnClick: () => {},
    image: any,
    BtnText: string,
    imageStyle: any,
    titleStyle: any,
    size: string,
    disable: boolean,
  }

  static defaultProps = {
    size: 'large',
    disable: false,
  }


  action = () => {
    if (this.props.disable) return
    this.props.BtnClick && this.props.BtnClick()
  }

  render() {
    let imgStyle = this.props.size ==='small'
      ? styles.imageSm : styles.imageLg
    return (
      <TouchableOpacity activeOpacity={this.props.disable ? 1 : 0.8} disable={this.props.disable} accessible={true} accessibilityLabel={this.props.BtnText} style={[styles.container, this.props.style]} onPress={this.action}>
        {this.props.image && <Image resizeMode={'contain'} style={[imgStyle, this.props.imageStyle]} source={this.props.image} />}
        {this.props.BtnText && <Text style={[styles.text, this.props.titleStyle]}>{this.props.BtnText}</Text>}
      </TouchableOpacity>
    )
  }
}

BtnOne.SIZE = {
  SMALL: 'small',
  LARGE: 'large',
}