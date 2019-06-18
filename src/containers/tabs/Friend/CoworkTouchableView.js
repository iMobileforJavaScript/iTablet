import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, Animated } from 'react-native'
import { scaleSize } from '../../../utils/screen'
import { zIndexLevel } from '../../../styles'
import { Const } from '../../../constants'
const AnimatedView = Animated.View

export default class CoworkTouchableView extends Component {
  props: {
    screen: string,
    disableTouch: Boolean,
    onPress: () => {},
  }
  constructor(props) {
    super(props)

    this.state = {
      top: new Animated.Value(scaleSize(88)),
    }
  }

  setVisible = visible => {
    Animated.timing(this.state.top, {
      toValue: visible ? scaleSize(88) : scaleSize(-200),
      duration: Const.ANIMATED_DURATION,
    }).start()
  }

  render() {
    let text = ''
    if (this.props.screen === 'Chat') {
      text = '协作地图'
    }
    return (
      <AnimatedView
        style={[
          style.generalStyle,
          this.props.screen === 'MapView'
            ? [style.mapViewStyle, { top: this.state.top }]
            : null,
        ]}
      >
        <TouchableOpacity onPress={this.props.onPress}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: scaleSize(24),
              color: 'white',
            }}
          >
            {text}
          </Text>
        </TouchableOpacity>
      </AnimatedView>
    )
  }
}

const style = StyleSheet.create({
  generalStyle: {
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: '#505050',
    padding: scaleSize(10),
    height: scaleSize(85),
    width: scaleSize(85),
    borderRadius: scaleSize(50),
    top: scaleSize(100),
    right: scaleSize(40),
    zIndex: zIndexLevel.THREE,
  },
  mapViewStyle: {
    position: 'absolute',
    zIndex: zIndexLevel.THREE,
  },
})
