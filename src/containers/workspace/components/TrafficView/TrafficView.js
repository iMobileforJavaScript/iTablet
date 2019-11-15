/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import * as React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  Text,
} from 'react-native'

import { constUtil, scaleSize, LayerUtils } from '../../../../utils'
import { color } from '../../../../styles'
import { Const, ConstOnline } from '../../../../constants'
import { SMap } from 'imobile_for_reactnative'
import { getPublicAssets, getThemeAssets } from '../../../../assets'

export default class TrafficView extends React.Component {
  props: {
    device: Object,
    getLayers: () => {},
    showModelList: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      left: new Animated.Value(scaleSize(25)),
      hasAdded: false,
      showIcon: false,
    }
    this.isIndoor = undefined
  }

  componentDidMount() {
    SMap.addIndoorChangeListener(async result => {
      if (result.isIndoor !== this.isIndoor) {
        this.isIndoor = result.isIndoor
        if (!this.isIndoor) {
          let layers = this.props.getLayers && (await this.props.getLayers())
          let baseMap = layers.filter(layer =>
            LayerUtils.isBaseLayer(layer.name),
          )[0]
          if (baseMap && baseMap.name !== 'baseMap' && baseMap.isVisible) {
            this.setState({
              showIcon: true,
            })
          }
        } else {
          this.setState({
            showIcon: false,
          })
        }
      }
    })
  }

  setVisible = (visible, immediately = false) => {
    if (visible) {
      Animated.timing(this.state.left, {
        toValue: scaleSize(25),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
      }).start()
    } else {
      Animated.timing(this.state.left, {
        toValue: scaleSize(-200),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
      }).start()
    }
  }

  render() {
    if (!this.state.showIcon) return null
    let trafficImg = this.state.hasAdded
      ? getPublicAssets().navigation.icon_traffic_on
      : getPublicAssets().navigation.icon_traffic_off
    let modelImg = getThemeAssets().functionBar.rightbar_network_model
    return (
      <Animated.View style={[styles.container, { left: this.state.left }]}>
        <TouchableOpacity
          underlayColor={constUtil.UNDERLAYCOLOR_TINT}
          style={{
            flex: 1,
          }}
          onPress={async () => {
            if (this.state.hasAdded) {
              await SMap.removeTrafficMap('tencent@TrafficMap')
            } else {
              await SMap.openTrafficMap(ConstOnline.TrafficMap.DSParams)
            }
            let hasAdded = !this.state.hasAdded
            this.setState({
              hasAdded,
            })
          }}
        >
          <Image source={trafficImg} style={styles.icon} />
          <Text style={styles.text}>路况</Text>
        </TouchableOpacity>
        <TouchableOpacity
          underlayColor={constUtil.UNDERLAYCOLOR_TINT}
          style={{
            flex: 1,
          }}
          onPress={this.props.showModelList}
        >
          <Image source={modelImg} style={styles.icon} />
          <Text style={styles.text}>模型</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: scaleSize(143) + (Platform.OS === 'ios' ? 20 : 0),
    backgroundColor: color.content_white,
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    paddingBottom: scaleSize(5),
    paddingHorizontal: scaleSize(5),
  },
  icon: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  text: {
    fontSize: scaleSize(20),
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})
