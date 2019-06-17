/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import * as React from 'react'
import { Animated, View, Text,Platform } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { SMap } from 'imobile_for_reactnative'
import { color } from '../../../../styles'

export default class ScaleView extends React.Component {
  props: {
    device: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    this.left = new Animated.Value(scaleSize(120))
    this.state = {
      width: 0,
      title: '',
      isAddedListener: false,
      isShow: false,
      visible: true,
    }
  }

  componentDidMount() {
    if (!this.state.isAddedListener) {
      SMap.addScaleChangeDelegate({
        scaleViewChange: this.scaleViewChange,
      })
      this.setState({
        isAddedListener: !this.state.isAddedListener,
      })
    }
  }

  showFullMap = visible => {
    if (this.state.visible === visible) return
    Animated.timing(this.left, {
      toValue: visible ? scaleSize(120) : scaleSize(30),
      duration: 300,
    }).start()
    this.setState({
      visible,
    })
  }

  getInitialData = async () => {
    let data = await SMap.getScaleData()
    await this.scaleViewChange(data)
    this.changeVisible(true)
  }

  changeVisible = value => {
    this.setState({
      isShow: value,
    })
  }
  scaleViewChange = data => {
    let width = ~~this.state.width
    let title = this.state.title
    if (width !== ~~data.width || title !== data.title) {
      this.setState({
        width: data.width,
        title: data.title,
      })
    }
  }
  render() {
    let textWidth =
      this.state.width > scaleSize(65) ? this.state.width : scaleSize(65)
    if (!this.state.isShow) return <View />

    let TextOffset = 0.5
    let textSpacing = 1
    if(Platform.OS === "android"){
      textSpacing = TextOffset = 0
    }
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: this.left,
          bottom: scaleSize(120),
          width: scaleSize(150),
          height: scaleSize(40),
        }}
      >
        <View
          style={{
            width: this.state.width,
          }}
        >
          <Text
            style={{
              width: textWidth,
              textAlign: 'left',
              position: 'absolute',
              left: 0,
              bottom: 0,
              fontSize: setSpText(12),
              color: color.white,
              fontWeight: '900',
            }}
          >
            {this.state.title}
          </Text>
          <Text
            style={{
              width: textWidth,
              textAlign: 'left',
              position: 'absolute',
              left: TextOffset,
              letterSpacing: scaleSize(textSpacing),
              bottom: TextOffset,
              fontSize: setSpText(12),
            }}
          >
            {this.state.title}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}
        >
          <View
            style={{
              width: 3,
              height: 8,
              backgroundColor: color.black,
              borderColor: color.white,
              borderWidth: 1,
              borderRightWidth: 0,
            }}
          />
          <View
            style={{
              height: 4,
              width: ~~this.state.width,
              backgroundColor: color.black,
              borderColor: color.white,
              borderTopWidth: 1,
              borderBottomWidth: 1,
            }}
          />
          <View
            style={{
              width: 3,
              height: 8,
              backgroundColor: color.black,
              borderColor: color.white,
              borderWidth: 1,
              borderLeftWidth: 0,
            }}
          />
        </View>
      </Animated.View>
    )
  }
}
