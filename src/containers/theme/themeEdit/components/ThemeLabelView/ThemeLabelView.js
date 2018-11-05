/*
 Copyright © SuperMap. All rights reserved.
 Author: yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View } from 'react-native'
import {
  TextAlignment,
  ThemeLabel,
  Action,
  TextStyle,
} from 'imobile_for_reactnative'
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
    isThemeLayer: boolean,
    setLoading: () => {},
  }

  static defaultProps = {
    isThemeLayer: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
      data: {},
    }
    this.themeLabel = {}
  }

  componentDidMount() {
    this.getInitData()
  }

  getInitData = async () => {
    let data = {
      expression: 'SMUSERID',
      fontName: '微软雅黑',
      align: TextAlignment.MIDDLECENTER,
      fontSize: 10,
      fontColor: '#0000FF',
    }
    if (this.props.isThemeLayer) {
      let theme = await this.props.layer.getTheme()
      if (theme) {
        data.expression = await theme.getLabelExpression()
        let textStyle = await theme.getStyle()
        data.fontName = await textStyle.getFontName()
        data.fontSize = (await textStyle.getFontWidth()) || 10
        data.align = await textStyle.getAlignment()
        data.fontColor = dataUtil.colorHex(await textStyle.getForeColor())
        this.themeLabel = await new ThemeLabel().createObjClone(theme)
      }
    }
    this.setState({
      data: data,
    })
  }

  getExpression = () => {
    NavigationService.navigate('ChoosePage', {
      type: ChoosePage.Type.EXPRESSION,
      layer: this.props.layer,
      cb: ({ key }) => {
        this.getValue({ expression: key })
      },
    })
  }

  getFontColor = () => {
    NavigationService.navigate('ColorPickerPage', {
      defaultColor: this.state.data.fontColor,
      cb: color => {
        this.getValue({ fontColor: color })
      },
    })
  }

  getFont = () => {
    NavigationService.navigate('ChoosePage', {
      type: ChoosePage.Type.FONT,
      cb: ({ key }) => {
        this.getValue({ fontName: key })
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
    if (this.state.data.align === undefined || this.state.data.align < 0) {
      Toast.show('请选择对齐方式')
      return
    }
    (async function() {
      try {
        this.themeLabel =
          this.themeLabel._SMThemeId || (await new ThemeLabel().createObj())
        let textStyle = await new TextStyle().createObj()
        await this.themeLabel.setLabelExpression(this.state.data.expression)
        let rgba = dataUtil.colorRgba(this.state.data.fontColor)

        await textStyle.setForeColor(rgba.r, rgba.g, rgba.b, rgba.a)
        await textStyle.setFontName(this.state.data.fontName)
        await textStyle.setAlignment(this.state.data.align)
        await textStyle.setFontHeight(this.state.data.fontSize)
        await textStyle.setFontWidth(this.state.data.fontSize)

        await this.themeLabel.setUniformStyle(textStyle)
        let dataset = await this.props.layer.getDataset()
        if (this.props.isThemeLayer) {
          await this.props.map.removeLayer(this.props.layer.index)
          let newLayer = await this.props.map.addThemeLayer(
            dataset,
            this.themeLabel,
            true,
          )
          // await this.props.map.insert(this.props.layer.index, newLayer)
          await newLayer.setCaption(this.props.layer.caption)
          await this.props.map.moveTo(0, this.props.layer.index)
        } else {
          await this.props.map.addThemeLayer(dataset, this.themeLabel, true)
        }

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
      }
    }.bind(this)())
  }

  reset = () => {
    Toast.show('待做')
    // NavigationService.goBack()
  }

  renderContent = () => {
    return (
      <View style={styles.content}>
        {this.state.data.expression ? (
          <Row
            style={styles.rowMarginTop}
            key={'表达式'}
            value={this.state.data.expression || CHOOSE}
            type={Row.Type.TEXT_BTN}
            title={'表达式'}
            getValue={this.getExpression}
            // getValue={value => this.getValue({expression: value === CHOOSE ? '' : value })}
          />
        ) : (
          <View />
        )}
        {this.state.data.fontName ? (
          <Row
            style={styles.rowMarginTop}
            key={'字体'}
            value={this.state.data.fontName}
            type={Row.Type.TEXT_BTN}
            title={'字体'}
            getValue={this.getFont}
            // getValue={value => this.getValue({fontName: value === CHOOSE ? '' : value})}
          />
        ) : (
          <View />
        )}
        {this.state.data.align >= 0 ? (
          <Row
            style={styles.rowMarginTop}
            key={'对齐方式'}
            value={
              this.state.data.align >= 0
                ? this.state.data.align
                : TextAlignment.TOPLEFT
            }
            type={Row.Type.RADIO_GROUP}
            title={'对齐方式'}
            defaultValue={
              this.state.data.align >= 0
                ? this.state.data.align
                : TextAlignment.TOPLEFT
            }
            radioColumn={3}
            radioArr={[
              { title: '左上', value: TextAlignment.TOPLEFT },
              { title: '中上', value: TextAlignment.TOPCENTER },
              { title: '右上', value: TextAlignment.TOPRIGHT },
              { title: '左中', value: TextAlignment.MIDDLELEFT },
              { title: '中心', value: TextAlignment.MIDDLECENTER },
              { title: '右中', value: TextAlignment.MIDDLERIGHT },
              { title: '左下', value: TextAlignment.BOTTOMLEFT },
              { title: '中下', value: TextAlignment.BOTTOMCENTER },
              { title: '右下', value: TextAlignment.BOTTOMRIGHT },
            ]}
            getValue={data => this.getValue({ align: data.value })}
          />
        ) : (
          <View />
        )}
        {this.state.data.fontSize >= 0 ? (
          <Row
            style={styles.rowMarginTop}
            key={'字号'}
            defaultValue={10}
            value={this.state.data.fontSize || 10}
            type={Row.Type.CHOOSE_NUMBER}
            minValue={8}
            maxValue={150}
            title={'字号'}
            getValue={value => this.getValue({ fontSize: value })}
          />
        ) : (
          <View />
        )}
        {this.state.data.fontColor ? (
          <Row
            style={styles.rowMarginTop}
            key={'文本颜色'}
            value={this.state.data.fontColor}
            type={Row.Type.CHOOSE_COLOR}
            title={'文本颜色'}
            getValue={this.getFontColor}
          />
        ) : (
          <View />
        )}
      </View>
    )
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
        <Button title={'确定'} onPress={this.confirm} />
        <Button type={Button.Type.GRAY} title={'重置'} onPress={this.reset} />
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
