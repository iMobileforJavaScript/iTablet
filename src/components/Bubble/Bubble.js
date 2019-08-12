import React from 'react'
import { StyleSheet, TouchableOpacity, Text, Animated } from 'react-native'
import { scaleSize } from '../../utils/index'
import { size, color } from '../../styles/index'

export default class Bubble extends React.PureComponent {
  props: {
    title: String,
    type: String, // info | error | warning | success
    style?: Object,
    onPress?: () => {},
  }

  static defaultProps = {
    title: '',
    type: 'info',
  }

  getStyle = () => {
    let bubbleStyle, titleStyle
    switch (this.props.type) {
      case 'success':
        bubbleStyle = [styles.bubble, styles.successBubble]
        titleStyle = [styles.text, styles.successText]
        break
      case 'warning':
        bubbleStyle = [styles.bubble, styles.warningBubble]
        titleStyle = [styles.text, styles.warningText]
        break
      case 'error':
        bubbleStyle = [styles.bubble, styles.errorBubble]
        titleStyle = [styles.text, styles.errorText]
        break
      default:
        bubbleStyle = styles.bubble
        titleStyle = styles.text
    }
    return {
      bubbleStyle,
      titleStyle,
    }
  }

  _onPress = () => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      this.props.onPress({ title: this.props.title, type: this.props.type })
    }
  }

  render() {
    const { bubbleStyle, titleStyle } = this.getStyle()
    return (
      <Animated.View style={[bubbleStyle, this.props.style]}>
        <TouchableOpacity onPress={this._onPress}>
          <Text style={titleStyle}>{this.props.title}</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  bubble: {
    flexDirection: 'row',
    backgroundColor: color.infoBg,
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: scaleSize(44),
    // maxWidth: scaleSize(120),
    borderRadius: scaleSize(4),
    paddingHorizontal: scaleSize(10),
  },
  successBubble: {
    backgroundColor: color.successBg,
  },
  warningBubble: {
    backgroundColor: color.warningBg,
  },
  errorBubble: {
    backgroundColor: color.errorBg,
  },
  text: {
    color: color.info,
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    textAlign: 'left',
    padding: 0,
  },
  successText: {
    color: color.success,
  },
  warningText: {
    color: color.warning,
  },
  errorText: {
    color: color.error,
  },
})
