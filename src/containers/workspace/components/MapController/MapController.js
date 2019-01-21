/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Animated } from 'react-native'
import { MTBtn } from '../../../../components'
import { Const, ConstInfo } from '../../../../constants'
import { scaleSize, Toast } from '../../../../utils'
import { SMap, SScene } from 'imobile_for_reactnative'
import styles from './styles'

export default class MapController extends React.Component {
  props: {
    style?: any,
    type?: any,
    compassStyle?: any,
    type: any,
  }

  constructor(props) {
    super(props)
    this.deg = 0
    this.state = {
      left: new Animated.Value(scaleSize(20)),
      compass: new Animated.Value(0),
    }
  }

  componentDidMount() {
    if (this.props.type === 'MAP_3D') {
      setInterval(async () => {
        let deg = await SScene.getcompass()
        this.setCompass(deg)
      }, 600)
    } else {
      return
    }
  }

  setVisible = visible => {
    if (visible) {
      Animated.timing(this.state.left, {
        toValue: scaleSize(20),
        duration: Const.ANIMATED_DURATION,
      }).start()
    } else {
      Animated.timing(this.state.left, {
        toValue: scaleSize(-200),
        duration: Const.ANIMATED_DURATION,
      }).start()
    }
  }

  setCompass = deg => {
    this.state.compass.setValue(this.deg)
    if (this.deg === deg) return
    deg &&
      Animated.timing(this.state.compass, {
        toValue: deg,
        duration: 1,
      }).start()
    this.deg = deg
  }

  plus = () => {
    if (this.props.type === 'MAP_3D') {
      return
    }
    SMap.zoom(2)
  }

  minus = () => {
    if (this.props.type === 'MAP_3D') {
      return
    }
    SMap.zoom(0.5)
  }

  map3Dplus = async () => {
    if (this.props.type !== 'MAP_3D') return
    clearInterval(this.timer)
    this.timer = setInterval(async () => {
      await SScene.zoom(0.025)
    }, 4)
  }

  map3Dminus = async () => {
    if (this.props.type !== 'MAP_3D') return
    clearInterval(this.timer)
    this.timer = setInterval(async () => {
      await SScene.zoom(-0.025)
    }, 4)
  }

  cloestimer = async () => {
    if (this.props.type !== 'MAP_3D') return
    clearInterval(this.timer)
  }

  location = () => {
    if (this.props.type === 'MAP_3D') {
      SScene.setHeading()
      this.setCompass(0)
      return
    }
    SMap.moveToCurrent().then(result => {
      !result && Toast.show(ConstInfo.OUT_OF_MAP_BOUNDS)
    })
  }

  renderCompass = () => {
    const spin = this.state.compass.interpolate({
      inputRange: [0, 360],
      outputRange: ['0deg', '360deg'],
    })
    if (this.props.type === 'MAP_3D') {
      return (
        <View style={[styles.compassView, this.props.compassStyle]}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MTBtn
              style={styles.compass}
              key={'controller_minus'}
              textColor={'black'}
              size={MTBtn.Size.NORMAL}
              image={require('../../../../assets/mapEdit/Frenchgrey/icon_compass.png')}
              onPress={this.location}
            />
          </Animated.View>
        </View>
      )
    } else {
      return <View />
    }
  }

  renderLocation = () => {
    if (this.props.type === 'MAP_3D') {
      return <View />
    } else {
      return (
        <MTBtn
          style={[styles.btn, styles.separator, styles.shadow]}
          key={'controller_location'}
          textColor={'black'}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/mapTool/icon_location.png')}
          onPress={this.location}
        />
      )
    }
  }

  render() {
    return (
      <Animated.View
        style={[styles.container, this.props.style, { left: this.state.left }]}
      >
        {this.renderCompass()}
        <View style={[styles.topView, styles.shadow]}>
          <MTBtn
            style={styles.btn}
            key={'controller_plus'}
            textColor={'black'}
            size={MTBtn.Size.NORMAL}
            image={require('../../../../assets/mapTool/icon_plus.png')}
            onPress={this.plus}
            onPressIn={this.map3Dplus}
            onPressOut={this.cloestimer}
          />
          <MTBtn
            style={styles.btn}
            key={'controller_minus'}
            textColor={'black'}
            size={MTBtn.Size.NORMAL}
            image={require('../../../../assets/mapTool/icon_minus.png')}
            onPress={this.minus}
            onPressIn={this.map3Dminus}
            onPressOut={this.cloestimer}
          />
        </View>
        {this.renderLocation()}
      </Animated.View>
    )
  }
}
