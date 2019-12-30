/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import React, { PureComponent } from 'react'
import { TouchableOpacity, View, Animated, StyleSheet } from 'react-native'
import { color } from '../../styles'
import { scaleSize, screen } from '../../utils'
import zIndexLevel from '../../styles/zIndexLevel'

export default class PopView extends PureComponent {
  props: {
    children: any,
    contentStyle?: Object,
    modalVisible?: boolean,
    overLayerStyle?: Object,
    showFullMap?: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: props.modalVisible || false,
    }
    this.opacity = new Animated.Value(0)
    this.height = new Animated.Value(0)
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.modalVisible &&
      nextProps.modalVisible !== this.state.modalVisible
    ) {
      this.setVisible(nextProps.modalVisible)
    }
  }

  setVisible = (visible, cb) => {
    if (visible === undefined) {
      visible = !this.state.modalVisible
    } else if (visible === this.state.modalVisible) {
      return
    }
    this.setState(
      {
        modalVisible: visible,
      },
      () => {
        this._changeValue(this.state.modalVisible)
        if (cb && typeof cb === 'function') {
          cb()
        }
      },
    )
  }

  _changeValue = visible => {
    let opacity = 1
    let height = screen.getScreenHeight()
    let time = 300
    let time2 = 50
    if (visible === false) {
      time = 50
      time2 = 20
      opacity = 0
      height = 0
    }
    Animated.parallel([
      Animated.timing(this.opacity, {
        toValue: opacity,
        duration: time,
      }),
      Animated.timing(this.height, {
        toValue: height,
        duration: time2,
      }),
    ]).start()
  }

  _renderContent = () => {
    return (
      <View style={[styles.infoContainer, this.props.contentStyle]}>
        {this.props.children}
      </View>
    )
  }

  render() {
    let overLayer = this.props.overLayerStyle || {}
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: this.opacity,
            height: this.height,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.themeoverlay, overLayer]}
          onPress={() => {
            this.setVisible(false, () => {
              this.props.showFullMap && this.props.showFullMap(false)
            })
          }}
        />
        {this._renderContent()}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  themeoverlay: {
    flex: 1,
    backgroundColor: color.modalBgColor,
  },
  infoContainer: {
    width: '100%',
    maxHeight: scaleSize(720),
    minHeight: scaleSize(80),
    backgroundColor: color.contentWhite,
  },
})
