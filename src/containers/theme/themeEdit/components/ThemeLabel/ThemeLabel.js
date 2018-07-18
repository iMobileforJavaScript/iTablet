/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { TextAlignment } from 'imobile_for_javascript'
import { BtnTwo, Button, Row, ListSeparator } from '../../../../../components'
import { constUtil, Toast } from '../../../../../utils'
import NavigationService from '../../../../NavigationService'

import styles from './styles'

// const FONT_ALIGN = {
//   LEFT_TOP: 'LEFT_TOP', CENTER_TOP: 'CENTER_TOP', RIGHT_TOP: 'RIGHT_TOP',
//   LEFT_CENTER: 'LEFT_CENTER', CENTER: 'CENTER', RIGHT_CENTER: 'RIGHT_CENTER',
//   LEFT_BOTTOM: 'LEFT_BOTTOM', CENTER_BOTTOM: 'CENTER_BOTTOM', RIGHT_BOTTOM: 'RIGHT_BOTTOM',
// }

const CHOOSE = '请选择'

export default class ThemeLabel extends React.Component {

  props: {
    title: string,
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
      data: {
        expression: '',
        fontName: '微软雅黑',
        align: TextAlignment.MIDDLECENTER,
        fontSize: 10,
        fontColor: 'blue',
      },
    }
  }

  rowAction = ({title}) => {

  }

  getExpression = value => {
    let data = this.state.data
    Object.assign(data, {expression: value})
    this.setState({
      data: data,
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

  getFontName = value => {
    let data = this.state.data
    Object.assign(data, {fontName: value})
    this.setState({
      data: data,
    })
  }

  getFontSize = value => {
    let data = this.state.data
    Object.assign(data, {fontSize: value})
    this.setState({
      data: data,
    })
  }

  getAlign = value => {
    let data = this.state.data
    Object.assign(data, {align: value})
    this.setState({
      data: data,
    })
  }

  confirm = () => {
    Toast.show(JSON.stringify(this.state.data))
    // NavigationService.goBack()
  }

  cancel = () => {
    NavigationService.goBack()
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
          getValue={value => this.getValue({expression: value === CHOOSE ? '' : value })}
        />

        <Row
          style={styles.rowMarginTop}
          key={'字体'}
          value={this.state.data.fontName}
          type={Row.Type.TEXT_BTN}
          title={'字体'}
          getValue={value => this.getValue({fontName: value === CHOOSE ? '' : value})}
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
          getValue={value => this.getValue({fontColor: value})}
        />

      </View>
    )
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
        <Button title={'确定'} onPress={this.confirm}/>
        <Button type={Button.Type.GRAY} title={'取消'} onPress={this.cancel}/>
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