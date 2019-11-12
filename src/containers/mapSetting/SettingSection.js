import React, { Component } from 'react'
import { Text, TouchableOpacity, Animated, Easing } from 'react-native'
import styles from './styles'
export default class SettingSection extends Component {
  props: {
    data: Array,
    onPress: () => {},
    mapSetting: any,
  }

  constructor(props) {
    super(props)
    this.state = {
      imgRotate: new Animated.Value(0),
    }
  }

  onPress = section => {
    Animated.timing(this.state.imgRotate, {
      toValue: !this.props.data.visible ? 0 : -0.5,
      duration: 200,
      easing: Easing.out(Easing.quad), // 一个用于定义曲线的渐变函数
      delay: 0, // 在一段时间之后开始动画（单位是毫秒），默认为0。
    }).start()
    this.props.onPress && this.props.onPress(section)
  }

  render() {
    const image = require('../../assets/mapEdit/icon_spread.png')
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.section}
        onPress={() => {
          this.onPress(this.props.data)
        }}
      >
        <Animated.Image
          source={image}
          style={[
            styles.selection,
            {
              transform: [
                // scale, scaleX, scaleY, translateX, translateY, rotate, rotateX, rotateY, rotateZ
                {
                  rotate: this.state.imgRotate.interpolate({
                    // 旋转，使用插值函数做值映射
                    inputRange: [-1, 1],
                    outputRange: ['-180deg', '180deg'],
                  }),
                },
              ],
            },
          ]}
        />
        <Text style={styles.sectionsTitle}>{this.props.data.title}</Text>
      </TouchableOpacity>
    )
  }
}
