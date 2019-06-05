/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import * as React from 'react'
import { View, Text } from 'react-native'
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
    this.initialWith = 80
    this.state = {
      width: 0,
      title: '',
      isAddedListener: false,
      isShow: false,
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
    if (!this.state.isShow) return <View />
    return (
      <View
        style={{
          position: 'absolute',
          right: scaleSize(50),
          bottom: scaleSize(120),
          width: scaleSize(this.initialWith),
          height: scaleSize(50),
        }}
      >
        <Text
          style={{
            fontSize: setSpText(12),
            height: '50%',
            textAlign: 'left',
            minWidth: scaleSize(60),
            width: `${~~this.state.width}%`,
          }}
        >
          {this.state.title}
        </Text>
        <View
          style={{
            height: scaleSize(10),
            borderWidth: scaleSize(2),
            width: `${~~this.state.width}%`,
            borderTopColor: 'transparent',
            borderTopWidth: 0,
            borderBottomColor: color.black,
            borderLeftColor: color.black,
            borderRightColor: color.black,
          }}
        />
      </View>
    )
  }
}
