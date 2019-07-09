import * as React from 'react'
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { color } from '../../../../styles'
import { scaleSize, AnalystTools } from '../../../../utils'
import { Const, TouchType } from '../../../../constants'

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
    type: Number,
    back: () => {},
    analyst?: () => {},
    setAnalystParams?: () => {},
    language: string,
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
          async () => {
            if (this.props.analyst) {
              this.props.analyst()
            } else {
              let { edges } = await AnalystTools.analyst(this.props.type)
              if (edges && edges.length > 0) {
                GLOBAL.TouchType = TouchType.NULL // 关闭分析界面，触摸事件置空
                this.props.setAnalystParams(null)
                AnalystTools.showMsg(this.props.type, true, this.props.language)
              } else {
                AnalystTools.showMsg(
                  this.props.type,
                  false,
                  this.props.language,
                )
              }
            }
          },
        )}
      </View>
    )
  }
}
