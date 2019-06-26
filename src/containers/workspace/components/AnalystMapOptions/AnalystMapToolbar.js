import * as React from 'react'
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { Const } from '../../../../constants'

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    // flex: 1,
    height: scaleSize(60),
    width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.theme,
  },
  img: {
    height: scaleSize(45),
    width: scaleSize(45),
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default class AnalystMapToolbar extends React.Component {
  props: {
    back: () => {},
    analyst: () => {},
  }

  renderBottomBtn = (img, action) => {
    return (
      <TouchableOpacity onPress={() => action()} style={styles.button}>
        <Image style={styles.img} resizeMode={'contain'} source={img} />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.buttons}>
        {this.renderBottomBtn(
          require('../../../../assets/mapEdit/icon_function_cancel.png'),
          () => {
            this.props.back && this.props.back()
          },
        )}
        {this.renderBottomBtn(
          require('../../../../assets/mapEdit/icon_function_theme_param_commit.png'),
          () => {
            this.props.analyst && this.props.analyst()
          },
        )}
      </View>
    )
  }
}
