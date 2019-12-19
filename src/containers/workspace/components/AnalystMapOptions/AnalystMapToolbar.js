import * as React from 'react'
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize, AnalystTools } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { Const, TouchType, ConstToolType } from '../../../../constants'
import { TextBtn } from '../../../../components'
// import { Analyst_Types } from '../../../analystView/AnalystType'
import { SMap, Action } from 'imobile_for_reactnative'

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
  btnText: {
    color: 'white',
    fontSize: size.fontSize.fontSizeXl,
  },
})

export default class AnalystMapToolbar extends React.Component {
  props: {
    type: Number, // 界面样式
    actionType: Number, // 按钮事件  select | draw
    back: () => {},
    analyst?: () => {},
    setAnalystParams?: () => {},
    language: string,
  }

  reset = () => {
    switch (this.props.actionType) {
      case 'select':
        SMap.setAction(Action.SELECT)
        break
      case 'draw':
        SMap.setAction(Action.CREATEPOLYGON)
        break
    }
  }

  renderBottomBtn = (img, action) => {
    return (
      <TouchableOpacity onPress={() => action()} style={styles.button}>
        <Image style={styles.img} resizeMode={'contain'} source={img} />
      </TouchableOpacity>
    )
  }

  renderBottomTextBtn = (text, action) => {
    return (
      <TextBtn btnText={text} textStyle={styles.btnText} btnClick={action} />
    )
  }

  renderToolbarWithBack = () => {
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
              AnalystTools.analyst(this.props.type)
                .then(({ edges }) => {
                  if (edges && edges.length > 0) {
                    GLOBAL.TouchType = TouchType.NORMAL // 关闭分析界面，触摸事件设置为normal
                    this.props.setAnalystParams(null)
                    AnalystTools.showMsg(
                      this.props.type,
                      true,
                      this.props.language,
                    )
                  } else {
                    AnalystTools.showMsg(
                      this.props.type,
                      false,
                      this.props.language,
                    )
                  }
                })
                .catch(() => {
                  AnalystTools.showMsg(
                    this.props.type,
                    false,
                    this.props.language,
                  )
                })
            }
          },
        )}
      </View>
    )
  }

  renderToolbarWithReset = () => {
    return (
      <View style={styles.buttons}>
        {this.renderBottomTextBtn(
          getLanguage(this.props.language).Analyst_Labels.RESET,
          this.reset,
        )}
        {this.renderBottomTextBtn(
          getLanguage(this.props.language).Analyst_Labels.CONFIRM,
          () => {
            this.props.back && this.props.back()
          },
        )}
      </View>
    )
  }

  render() {
    switch (this.props.type) {
      case ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH:
      case ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS:
      case ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH:
        return this.renderToolbarWithBack()
      case ConstToolType.MAP_ANALYSIS_THIESSEN_POLYGON:
        return this.renderToolbarWithReset()
    }
  }
}
