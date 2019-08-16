/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import { Animated, View, Text, TouchableOpacity } from 'react-native'
import { SMap } from 'imobile_for_reactnative'
import styles from './style'
import { scaleSize } from '../../../../utils'

export default class PoiInfoContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      distance: 0,
      destination: '',
      position: {},
    }
    this.bottom = new Animated.Value(scaleSize(-240))
  }

  async componentDidUpdate() {
    let distance = await this.getDistance()
    this.setState(
      {
        distance,
      },
      () => {
        this.setVisible(true)
      },
    )
  }
  setVisible = visible => {
    if (visible === this.state.visible) {
      return
    }
    let value = visible ? 0 : scaleSize(-240)
    Animated.timing(this.bottom, {
      toValue: value,
      duration: 400,
    }).start()
  }

  getDistance = async () => {
    let endPoint = this.state.position
    let startPoint = await SMap.getCurrentPosition()
    if (Object.keys(endPoint).length !== 0) {
      //经纬度差值转距离 单位 米
      let R = 6371393
      let width = Math.abs(
        ((endPoint.x - startPoint.x) *
          Math.PI *
          R *
          Math.cos((((endPoint.y + startPoint.y) / 2) * Math.PI) / 180)) /
          180,
      )
      let length = Math.abs(((endPoint.y - startPoint.y) * Math.PI * R) / 180)

      let distance = Math.sqrt(width * width + length * length).toFixed(0)
      if (distance > 1000) distance = distance / 1000 + ' Km'
      else distance = distance + ' m'
      return distance
    }
    return 0
  }

  close = () => {
    SMap.removePOICallout()
    this.setVisible(false)
  }
  render() {
    return (
      <Animated.View
        style={{
          ...styles.container,
          bottom: this.bottom,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.close()
          }}
          style={styles.closeBox}
        >
          <Text style={styles.closeBtn}>x</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{this.state.destination}</Text>
        </View>
        <View>
          <Text style={styles.info}>距您 {this.state.distance}</Text>
        </View>
      </Animated.View>
    )
  }
}
