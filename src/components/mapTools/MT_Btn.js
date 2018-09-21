/*
  Copyright © SuperMap. All rights reserved.
  Author: Yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { StyleSheet, Image, TouchableOpacity, Text, View } from 'react-native'
import { constUtil, scaleSize } from '../../utils'
import { size } from '../../styles'

// const ICON_HEIGHT =0.75* 0.1 * constUtil.WIDTH
// const CONTAINER_HEIGHT = 1.4 * ICON_HEIGHT
// const CONTAINER_WIDTH = CONTAINER_HEIGHT
const BTN_UNDERCOLOR = constUtil.UNDERLAYCOLOR

export default class MT_Btn extends React.Component {

  props: {
    image: any,
    selectedImage?: any,
    size: string,
    BtnText: string,
    BtnClick: () => {},
    textStyle: any,
    textColor: string,
    imageStyle: any,
    style: any,
    customStyle?: any,
    selected?: boolean,
    selectMode?: string,
    activeOpacity?: number,
  }

  static defaultProps = {
    activeOpacity: 1,
    size: 'normal',
    selected: false,
    selectMode: 'normal', // normal: 选择 | 非选择状态     ---    flash：按下和松开
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected,
    }
  }

  action = () => {
    if (this.props.selectMode === 'flash') return
    this.props.BtnClick && this.props.BtnClick()
  }

  _onPressOut = () => {
    if (this.props.selectMode === 'normal') return
    this.setState({
      selected: false,
    }, () => {
      this.props.BtnClick && this.props.BtnClick()
    })
  }

  _onPressIn = () => {
    if (this.props.selectMode === 'normal') return
    this.setState({
      selected: true,
    })
  }

  render() {
    let imageStyle, textStyle

    switch (this.props.size) {
      case 'small':
        imageStyle = styles.smallImage
        textStyle = styles.smallText
        break
      case 'large':
        imageStyle = styles.largeImage
        textStyle = styles.largeText
        break
      default:
        imageStyle = styles.normalImage
        textStyle = styles.normalText
        break
    }

    let image
    if (this.props.selectMode === 'flash' && this.props.selectedImage) {
      image = this.state.selected ? this.props.selectedImage : this.props.image
    } else if (this.props.selectedImage) {
      image = this.props.selected ? this.props.selectedImage : this.props.image
    } else {
      image = this.props.image
    }

    return (
      <TouchableOpacity
        accessible={true}
        activeOpacity={this.props.activeOpacity}
        accessibilityLabel={this.props.BtnText}
        style={this.props.customStyle ? this.props.customStyle : [styles.container, this.props.style]}
        onPress={this.action}
        underlayColor={BTN_UNDERCOLOR}
        onPressOut={() => this._onPressOut()}
        onPressIn={() => this._onPressIn()}
      >
        <View>
          {
            image &&
            <Image
              resizeMode={'contain'}
              style={[imageStyle, this.props.imageStyle]}
              source={image}
            />
          }
          {
            this.props.BtnText &&
            <Text
              style={[textStyle, this.props.textStyle, {color: this.props.textColor}]}
            >
              {this.props.BtnText}
            </Text>
          }
        </View>
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
    height: scaleSize(70),
    width: scaleSize(70),
    alignSelf: 'center',
    // borderRadius: 5,
  },
  normalImage: {
    height: scaleSize(50),
    width: scaleSize(50),
    alignSelf: 'center',
    // borderRadius: 5,
  },
  smallImage: {
    height: scaleSize(30),
    width: scaleSize(30),
    alignSelf: 'center',
    // borderRadius: 5,
  },
  largeText: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    width: scaleSize(100),
    textAlign: 'center',
  },
  normalText: {
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