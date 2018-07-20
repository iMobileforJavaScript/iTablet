/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { TextAlignment, ThemeLabel, ThemeLabelItem, TextStyle } from 'imobile_for_javascript'
import { BtnTwo, Button, Row, ListSeparator } from '../../../../../components'
import { dataUtil, Toast } from '../../../../../utils'
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
    map: Object,
    mapControl: Object,
    layer: Object,
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
        fontColor: '#0000FF',
      },
    }
  }

  rowAction = ({title}) => {

  }

  getExpression = value => {
    NavigationService.navigate('ChoosePage', {
      type: ChoosePage.Type.EXPRESSION,
      map: this.props.map,
      mapControl: this.props.mapControl,
      layer: this.props.layer,
      cb: value => {
        this.getValue({expression: value})
      },
    })
  }

  getFont = value => {
    NavigationService.navigate('ChoosePage', {type: ChoosePage.Type.FONT, cb: value => {
      this.getValue({fontName: value})
    }})
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
    Toast.show('待做')
    // Toast.show(JSON.stringify(this.state.data))
    ;(async function () {
      try {
        // let dataset = await this.state.layer.getDataset()
        // let datasetVector = await dataset.toDatasetVector()
        //
        // let themeLabel = await new ThemeLabel().createObj()
        // await themeLabel.setLabelExpression(this.state.data.expression)
        // await themeLabel.setRangeExpression(this.state.data.expression)
        //
        // let themeLabelItem = await new ThemeLabelItem().createObj()
        // await themeLabelItem.setVisible(true)
        // let style = await new TextStyle().createObj()
        // await style.setForeColor(dataUtil.colorRgba(this.state.data.fontColor))
        //
        
        // let themeLabel = new ThemeLabel().makeThemeLabel({
        //   datasetVector: datasetVector,
        //   rangeExpression: this.state.data.expression,
        //   rangeMode: this.state.data.expression,
        //   rangeParameter: this.state.data.expression,
        //   colorGradientType: this.state.data.expression,
        // })
  
        // ThemeLabel themeLabelMap = new ThemeLabel();
        // themeLabelMap.setLabelExpression("Country");
        // themeLabelMap.setRangeExpression("Pop_1994");
        //
        // ThemeLabelItem themeLabelItem1 = new ThemeLabelItem();
        // themeLabelItem1.setVisible(true);
        // TextStyle textStyle1 = new TextStyle();
        // textStyle1.setForeColor(new Color(255, 10, 10));
        // textStyle1.setFontName("111");
        // themeLabelItem1.setStyle(textStyle1);
        //
        // themeLabelMap.addToHead(themeLabelItem1);
        //
        // Dataset dataset = mWorkspace.getDatasources().get(0).getDatasets().get("Countries");
        // if (dataset != null) {
        //   mUnifiedLayer = mMapControl.getMap().getLayers().add(dataset,themeLabelMap, true);
        // }
        //
        // mMapControl.getMap().refresh();
        
        
      } catch (e) {
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
          getValue={value => this.getValue({fontColor: value})}
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