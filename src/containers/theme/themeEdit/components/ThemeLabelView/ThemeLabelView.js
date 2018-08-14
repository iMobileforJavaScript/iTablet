/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { View } from 'react-native'
import { TextAlignment, ThemeLabel, Action, TextStyle } from 'imobile_for_javascript'
import { Button, Row } from '../../../../../components'
import { Toast, dataUtil } from '../../../../../utils'
import NavigationService from '../../../../NavigationService'
import ChoosePage from '../../../choosePage'

import styles from './styles'

// const FONT_ALIGN = {
//   LEFT_TOP: 'LEFT_TOP', CENTER_TOP: 'CENTER_TOP', RIGHT_TOP: 'RIGHT_TOP',
//   LEFT_CENTER: 'LEFT_CENTER', CENTER: 'CENTER', RIGHT_CENTER: 'RIGHT_CENTER',
//   LEFT_BOTTOM: 'LEFT_BOTTOM', CENTER_BOTTOM: 'CENTER_BOTTOM', RIGHT_BOTTOM: 'RIGHT_BOTTOM',
// }

const CHOOSE = '请选择'

export default class ThemeLabelView extends React.Component {

  props: {
    title: string,
    nav: Object,
    map: Object,
    mapControl: Object,
    layer: Object,
    setLoading: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
      data: {
        expression: 'SmID',
        fontName: '微软雅黑',
        align: TextAlignment.MIDDLECENTER,
        fontSize: 10,
        fontColor: '#0000FF',
      },
    }
  }

  getExpression = () => {
    NavigationService.navigate('ChoosePage', {
      type: ChoosePage.Type.EXPRESSION,
      cb: ({key}) => {
        this.getValue({expression: key})
      },
    })
  }

  getFontColor = () => {
    NavigationService.navigate('ChoosePage', {
      type: ChoosePage.Type.FONT_COLOR,
      cb: ({key}) => {
        this.getValue({fontColor: key})
      },
    })
  }

  getFont = () => {
    NavigationService.navigate('ChoosePage', {
      type: ChoosePage.Type.FONT,
      cb: ({key}) => {
        this.getValue({fontName: key})
      },
    })
  }

  getValue = obj => {
    let data = this.state.data
    let key = Object.keys(obj)[0]
    if (data[key] === obj[key]) return
    Object.assign(data, obj)
    this.setState({
      data: data,
    })
  }

  confirm = () => {
    if (!this.state.data.expression) {
      Toast.show('请选择表达式')
      return
    }
    if (!this.state.data.fontColor) {
      Toast.show('请选择文本颜色')
      return
    }
    if (!this.state.data.fontName) {
      Toast.show('请选择字体')
      return
    }
    if (!this.state.data.align) {
      Toast.show('请选择对齐方式')
      return
    }
    (async function () {
      try {
        let themeLabel = await new ThemeLabel().createObj()
        let textStyle = await new TextStyle().createObj()
        await themeLabel.setLabelExpression(this.state.expression)
        let rgba = dataUtil.colorRgba(this.state.data.fontColor)

        await textStyle.setForeColor(rgba.r, rgba.g, rgba.b, rgba.a)
        await textStyle.setFontName(this.state.data.fontName)
        await textStyle.setAlignment(this.state.data.align)

        await themeLabel.setUniformStyle(textStyle)

        let dataset = await this.props.layer.getDataset()
        await this.props.map.addThemeLayer(dataset, themeLabel, true)
        await this.props.map.refresh()
        await this.props.mapControl.setAction(Action.PAN)
        let routes = this.props.nav.routes
        let key = ''
        for (let i = 0; i < routes.length - 1; i++) {
          if (routes[i].routeName === 'MapView') {
            key = routes[i + 1].key
          }
        }
        NavigationService.goBack(key)
        Toast.show('设置成功')
      } catch (e) {
        Toast.show('设置失败')
        console.warn(e)
      }
    }).bind(this)()
  }

  reset = () => {
    Toast.show('待做')
    // NavigationService.goBack()
  }

  renderContent = () => {
    return (
      <View style={styles.content}>
        <Row
          style={styles.rowMarginTop}
          key={'表达式'}
          value={this.state.data.expression || CHOOSE}
          type={Row.Type.TEXT_BTN}
          title={'表达式'}
          getValue={this.getExpression}
          // getValue={value => this.getValue({expression: value === CHOOSE ? '' : value })}
        />

        <Row
          style={styles.rowMarginTop}
          key={'字体'}
          value={this.state.data.fontName}
          type={Row.Type.TEXT_BTN}
          title={'字体'}
          getValue={this.getFont}
          // getValue={value => this.getValue({fontName: value === CHOOSE ? '' : value})}
        />

        <Row
          style={styles.rowMarginTop}
          key={'对齐方式'}
          value={this.state.data.align}
          type={Row.Type.RADIO_GROUP}
          title={'对齐方式'}
          defaultValue={this.state.data.align}
          radioColumn={3}
          radioArr={[
            {title: '左上', value: TextAlignment.LEFTTOP},
            {title: '中上', value: TextAlignment.TOPCENTER},
            {title: '右上', value: TextAlignment.TOPRIGHT},
            {title: '左中', value: TextAlignment.MIDDLELEFT},
            {title: '中心', value: TextAlignment.MIDDLECENTER},
            {title: '右中', value: TextAlignment.MIDDLERIGHT},
            {title: '左下', value: TextAlignment.BOTTOMLEFT},
            {title: '中下', value: TextAlignment.BOTTOMCENTER},
            {title: '右下', value: TextAlignment.BOTTOMRIGHT},
          ]}
          getValue={value => this.getValue({align: value})}
        />

        <Row
          style={styles.rowMarginTop}
          key={'字号'}
          defaultValue={10}
          value={this.state.data.fontSize || 10}
          type={Row.Type.CHOOSE_NUMBER}
          minValue={8}
          maxValue={12}
          title={'字号'}
          getValue={value => this.getValue({fontSize: value})}
        />

        <Row
          style={styles.rowMarginTop}
          key={'文本颜色'}
          value={this.state.data.fontColor}
          type={Row.Type.CHOOSE_COLOR}
          title={'文本颜色'}
          getValue={this.getFontColor}
        />

      </View>
    )
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
        <Button title={'确定'} onPress={this.confirm}/>
        <Button type={Button.Type.GRAY} title={'重置'} onPress={this.reset}/>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
        {this.renderBtns()}
      </View>
    )
  }
}