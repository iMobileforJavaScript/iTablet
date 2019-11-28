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
} from 'react-native'

import { constUtil, scaleSize, LayerUtils, Toast } from '../../../../utils'
import { color } from '../../../../styles'
import { Const, ConstOnline } from '../../../../constants'
import { SMap } from 'imobile_for_reactnative'
import { getPublicAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'

export default class TrafficView extends React.Component {
  props: {
    device: Object,
    language: String,
    getLayers: () => {},
    incrementRoad: () => {},
    mapLoaded: boolean,
  }

  constructor(props) {
    super(props)
    this.state = {
      left: new Animated.Value(scaleSize(20)),
      hasAdded: false,
      showIcon: true,
    }
    this.lastID = '' //上次传回的楼层id
    this.listener = null
  }

  async componentDidUpdate(prevProps) {
    if (this.props.mapLoaded && this.props.mapLoaded !== prevProps.mapLoaded) {
      let datas = await SMap.getFloorData()
      if (datas.data && datas.data.length > 0) {
        let { currentFloorID } = datas
        this.setState({
          currentFloorID,
        })
      }

      if (!this.listener) {
        this.listener = SMap.addFloorHiddenListener(async result => {
          let { currentFloorID } = result
          if (currentFloorID !== this.lastID) {
            this.lastID = currentFloorID
            if (!currentFloorID) {
              let layers =
                this.props.getLayers && (await this.props.getLayers())
              let baseMap = layers.filter(layer =>
                LayerUtils.isBaseLayer(layer.name),
              )[0]
              if (baseMap && baseMap.name !== 'baseMap' && baseMap.isVisible) {
                this.setState({
                  currentFloorID,
                })
              }
            } else {
              this.setState({
                currentFloorID,
              })
            }
          }
        })
      }
    }
  }

  incrementRoad = async () => {
    let rel = await SMap.hasLineDataset()
    if (rel) {
      this.props.incrementRoad()
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.NO_LINE_DATASETS)
    }
  }

  setVisible = (visible, immediately = false) => {
    if (visible) {
      Animated.timing(this.state.left, {
        toValue: scaleSize(20),
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
    if (!this.props.mapLoaded) return null
    let trafficImg = this.state.hasAdded
      ? getPublicAssets().navigation.icon_traffic_on
      : getPublicAssets().navigation.icon_traffic_off
    let networkImg = require('../../../../assets/Navigation/network.png')
    return (
      <Animated.View style={[styles.container, { left: this.state.left }]}>
        {!this.state.currentFloorID ? (
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
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            underlayColor={constUtil.UNDERLAYCOLOR_TINT}
            style={{
              flex: 1,
            }}
            onPress={this.incrementRoad}
          >
            <Image source={networkImg} style={styles.icon} />
          </TouchableOpacity>
        )}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: scaleSize(60),
    height: scaleSize(60),
    top: scaleSize(143) + (Platform.OS === 'ios' ? 20 : 0),
    backgroundColor: color.content_white,
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
    width: scaleSize(50),
    height: scaleSize(50),
  },
  text: {
    fontSize: scaleSize(20),
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})
