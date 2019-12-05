/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import * as React from 'react'
import { StyleSheet, TouchableOpacity, Image, Animated } from 'react-native'

import { constUtil, scaleSize, Toast } from '../../../../utils'
import { color } from '../../../../styles'
import { Const } from '../../../../constants'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'

export default class LocationView extends React.Component {
  props: {
    getNavigationDatas: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      left: new Animated.Value(scaleSize(25)),
      visible: false,
    }
    this.isStart = true
  }
  _location = async () => {
    let point = await SMap.getCurrentMapPosition()
    let navigationDatas = this.props.getNavigationDatas()
    let isInBounds = await SMap.isInBounds(
      point,
      navigationDatas.selectedDataset,
    )
    if (isInBounds) {
      if (this.isStart) {
        GLOBAL.STARTX = point.x
        GLOBAL.STARTY = point.y
        await SMap.getStartPoint(GLOBAL.STARTX, GLOBAL.STARTY, false)
        await SMap.getPointName(GLOBAL.STARTX, GLOBAL.STARTY, true)
      } else {
        GLOBAL.ENDX = point.x
        GLOBAL.ENDY = point.y
        await SMap.getEndPoint(GLOBAL.ENDX, GLOBAL.ENDY, false)
        await SMap.getPointName(GLOBAL.STARTX, GLOBAL.STARTY, false)
      }
      SMap.moveToPoint(point)
    } else {
      Toast.show(
        getLanguage(GLOBAL.language).Prompt.CURRENT_POSITION_OUT_OF_RANGE,
      )
    }
  }

  setVisible = (visible, isStart) => {
    if (visible === this.state.visible) return
    if (visible) {
      Animated.timing(this.state.left, {
        toValue: scaleSize(25),
        duration: Const.ANIMATED_DURATION,
      }).start()
    } else {
      Animated.timing(this.state.left, {
        toValue: scaleSize(-200),
        duration: Const.ANIMATED_DURATION,
      }).start()
    }
    if (isStart !== undefined) {
      this.isStart = isStart
    }
    this.setState({
      visible,
    })
  }

  render() {
    if (!this.state.visible) return null
    let locationImg = require('../../../../assets/mapTool/Frenchgrey/icon_location.png')
    return (
      <Animated.View style={[styles.container, { left: this.state.left }]}>
        <TouchableOpacity
          underlayColor={constUtil.UNDERLAYCOLOR_TINT}
          style={{
            flex: 1,
          }}
          onPress={() => {
            this._location()
          }}
        >
          <Image source={locationImg} style={styles.icon} />
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: scaleSize(100),
    backgroundColor: color.content_white,
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  icon: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
})
