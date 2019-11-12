import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { color, size } from '../../../styles'
import { scaleSize } from '../../../utils'
import { Const } from '../../../constants'
import { TextBtn } from '../../../components'

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    height: Const.BOTTOM_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.bgW,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: color.separateColorGray,
  },
  button: {
    // flex: 1,
    height: scaleSize(60),
    width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  img: {
    height: scaleSize(45),
    width: scaleSize(45),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: color.fontColorBlack,
    fontSize: size.fontSize.fontSizeXl,
  },
  btnTextDisable: {
    color: color.fontColorGray,
    fontSize: size.fontSize.fontSizeXl,
  },
})

export default class AnalystBar extends React.Component {
  props: {
    style?: Object,
    leftTitle: string,
    rightTitle: string,
    leftAction: () => {},
    rightAction: () => {},
    leftDisable: boolean,
    rightDisable: boolean,
  }

  static defaultProps = {
    leftDisable: false,
    rightDisable: false,
  }

  leftAction = () => {
    if (this.props.leftAction && typeof this.props.leftAction === 'function') {
      this.props.leftAction()
    }
  }

  rightAction = () => {
    if (
      this.props.rightAction &&
      typeof this.props.rightAction === 'function'
    ) {
      this.props.rightAction()
    }
  }

  renderBottomTextBtn = (text, action, disable = false) => {
    return (
      <TextBtn
        btnText={text}
        textStyle={disable ? styles.btnTextDisable : styles.btnText}
        btnClick={action}
      />
    )
  }

  render() {
    return (
      <View style={[styles.buttons, this.props.style]}>
        {this.props.leftTitle ? (
          this.renderBottomTextBtn(
            this.props.leftTitle,
            this.leftAction,
            this.props.leftDisable,
          )
        ) : (
          <View />
        )}
        {this.props.rightTitle ? (
          this.renderBottomTextBtn(
            this.props.rightTitle,
            this.rightAction,
            this.props.rightDisable,
          )
        ) : (
          <View />
        )}
      </View>
    )
  }
}
