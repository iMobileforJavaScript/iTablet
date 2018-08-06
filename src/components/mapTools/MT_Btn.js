/*
  Copyright © SuperMap. All rights reserved.
  Author: Yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { StyleSheet, Image, TouchableOpacity, Text } from 'react-native'
import { constUtil, scaleSize } from '../../utils'
import { size } from '../../styles'

const ICON_HEIGHT =0.75* 0.1 * constUtil.WIDTH
const CONTAINER_HEIGHT = 1.4 * ICON_HEIGHT
const CONTAINER_WIDTH = CONTAINER_HEIGHT
const BTN_UNDERCOLOR = constUtil.UNDERLAYCOLOR

export default class MT_Btn extends React.Component {

  props: {
    BtnImageSrc: any,
    size: string,
    BtnText: string,
    BtnClick: () => {},
    textStyle: any,
    textColor: string,
    imageStyle: any,
    style: any,
  }
  
  static defaultProps = {
    size: 'large',
  }

  render() {
    let imageStyle = this.props.size === 'small' ? styles.smallImage : styles.largeImage
    let textStyle = this.props.size === 'small' ? styles.smallText : styles.largeText
    return (
      <TouchableOpacity accessible={true} accessibilityLabel={this.props.BtnText} style={[styles.container, this.props.style]} onPress={this.props.BtnClick} underlayColor={BTN_UNDERCOLOR}>
        {this.props.BtnImageSrc && <Image resizeMode={'contain'} style={[imageStyle, this.props.imageStyle]} source={this.props.BtnImageSrc} />}
        {this.props.BtnText && <Text style={[textStyle, this.props.textStyle, {color: this.props.textColor}]}>{this.props.BtnText}</Text>}
      </TouchableOpacity>
    )
  }
}

MT_Btn.Size = {
  LARGE: 'large',
  SMALL: 'small',
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
  largeImage: {
    height: scaleSize(50),
    width: scaleSize(50),
    alignSelf: 'center',
    borderRadius: 5,
  },
  smallImage: {
    height: scaleSize(30),
    width: scaleSize(30),
    alignSelf: 'center',
    borderRadius: 5,
  },
  largeText: {
    fontSize: size.fontSize.fontSizeXs,
    backgroundColor: 'transparent',
    width: scaleSize(100),
    textAlign: 'center',
  },
  smallText: {
    fontSize: size.fontSize.fontSizeXs,
    backgroundColor: 'transparent',
    width: scaleSize(100),
    textAlign: 'center',
  },
})