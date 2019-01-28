/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { Dimensions, PixelRatio, View } from 'react-native'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const USUAL_LINEWIDTH = 2 / PixelRatio.get()

const USUAL_SEPARATORCOLOR = 'rgba(59,55,56,0.3)'
const UNDERLAYCOLOR = 'rgba(255,255,255,0.1)'
const UNDERLAYCOLOR_TINT = '#D3D3D3' //浅色版按钮按下背景
const USUAL_GREEN = '#F5FCFF'
const USUAL_BLUE = '#2196f3'
const USUAL_PURPLE = '#871F78'

const HEADER_HEIGHT = 50
const HEADER_COLOR = USUAL_BLUE

const SEPARATOR = () => (
  <View
    style={{
      height: 2 / PixelRatio.get(),
      backgroundColor: '#bbbbbb',
      marginLeft: 7,
      marginRight: 7,
    }}
  />
)
export {
  WIDTH,
  HEIGHT,
  USUAL_LINEWIDTH,
  USUAL_SEPARATORCOLOR,
  UNDERLAYCOLOR,
  USUAL_GREEN,
  USUAL_BLUE,
  USUAL_PURPLE,
  HEADER_HEIGHT,
  HEADER_COLOR,
  SEPARATOR,
  UNDERLAYCOLOR_TINT,
}
