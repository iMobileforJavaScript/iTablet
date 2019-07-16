import React from 'react'
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native'

const ANDROID_VERSION_LOLLIPOP = 21

export default class TouchableItem extends React.Component {
  props: {
    style: any,
    children: any,
    pressColor: any,
    borderless: any,
  }

  static defaultProps = {
    borderless: false,
    pressColor: 'rgba(0, 0, 0, .32)',
  }

  render() {
    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchables on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (
      Platform.OS === 'android' &&
      Platform.Version >= ANDROID_VERSION_LOLLIPOP
    ) {
      const { style, ...rest } = this.props
      return (
        <TouchableNativeFeedback
          {...rest}
          style={null}
          background={TouchableNativeFeedback.Ripple(
            this.props.pressColor,
            this.props.borderless,
          )}
        >
          <View style={style}>{React.Children.only(this.props.children)}</View>
        </TouchableNativeFeedback>
      )
    }

    return (
      <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>
    )
  }
}
