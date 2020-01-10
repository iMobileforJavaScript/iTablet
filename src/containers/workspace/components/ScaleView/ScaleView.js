/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import * as React from 'react'
import { Animated, View, Text, Platform } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { SMap } from 'imobile_for_reactnative'
import { color } from '../../../../styles'

export default class ScaleView extends React.Component {
  props: {
    device: Object,
    language: String,
    isShow: boolean,
    mapNavigation: Object,
  }

  constructor(props) {
    super(props)
    this.left = new Animated.Value(scaleSize(120))
    this.bottom = new Animated.Value(scaleSize(120))
    this.state = {
      width: scaleSize(65),
      title: '',
      isAddedListener: false,
      visible: true,
    }
    this.startTime = 0
    this.endTime = 0
    this.INTERVAL = 300
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
    //获取比例尺、图例数据
    this.getInitialData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.isShow && !prevProps.isShow) {
      SMap.getScaleData().then(data => {
        this.scaleViewChange(data)
      })
    }
  }

  componentWillUnmount() {
    if (this.state.isAddedListener) {
      SMap.addScaleChangeDelegate({
        scaleViewChange: () => {},
      })
    }
  }

  showFullMap = (visible, immediately = false) => {
    if (this.state.visible === visible) return
    Animated.parallel([
      Animated.timing(this.left, {
        toValue: visible ? scaleSize(120) : scaleSize(30),
        duration: immediately ? 0 : 300,
      }),
      Animated.timing(this.bottom, {
        toValue: visible ? scaleSize(120) : scaleSize(30),
        duration: immediately ? 0 : 300,
      }),
    ]).start()
    this.setState({
      visible,
    })
  }

  getInitialData = async () => {
    let data = await SMap.getScaleData()
    await this.scaleViewChange(data)
  }

  scaleViewChange = data => {
    this.endTime = +new Date()
    if (
      data &&
      data.title &&
      data.width &&
      this.endTime - this.startTime > this.INTERVAL
    ) {
      let width = ~~this.state.width
      let title = this.state.title
      if (width !== ~~data.width || title !== data.title) {
        this.setState(
          {
            width: data.width,
            title: data.title,
          },
          () => {
            this.startTime = this.endTime
          },
        )
      }
    }
  }

  render() {
    if (this.props.mapNavigation.isShow) return null
    let textWidth =
      this.state.width > scaleSize(65) ? this.state.width : scaleSize(65)
    if (!this.props.isShow) return <View />

    let TextOffset = 0.5
    let textSpacing = 1
    if (Platform.OS === 'android') {
      textSpacing = TextOffset = 0
    }
    return (
      <Animated.View
        style={{
          position: 'absolute',
          left: this.left,
          bottom: this.bottom,
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
