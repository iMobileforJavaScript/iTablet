/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { ScrollView, View } from 'react-native'
import {
  RangeMode,
  ColorGradientType,
  ThemeRange,
  Action,
} from 'imobile_for_reactnative'
import { Button, Row } from '../../../../../components'
import { Toast, dataUtil } from '../../../../../utils'
import NavigationService from '../../../../NavigationService'
import ThemeTable from '../ThemeTable'
import ChoosePage from '../../../choosePage'
import styles from './styles'

const CHOOSE = '请选择'

export default class ThemeRangeView extends React.Component {
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
      themeRangeList: [],
      data: {
        expression: 'SMUSERID',
        rangeMode: RangeMode.EQUALINTERVAL,
        rangeCount: 2,
        precision: 1,
        colorMethod: {
          key: 'YELLOWRED',
          value: ColorGradientType.CYANGREEN,
        },
      },
    }
    this.themeRange = {}
  }

  componentDidMount() {
    this.getInitData()
  }

  getInitData = async () => {
    let data = {
      expression: 'SMUSERID',
      rangeMode: RangeMode.EQUALINTERVAL,
      rangeCount: 5,
      precision: 1,
      colorMethod: {
        key: 'YELLOWRED',
        value: ColorGradientType.CYANGREEN,
      },
    }
    if (this.props.isThemeLayer) {
      let theme = await this.props.layer.getTheme()
      data.expression = await theme.getRangeExpression()
      data.rangeMode = await theme.getRangeMode()
      data.rangeCount = await theme.getCount()
      data.precision = await theme.getPrecision()
      // TODO 获取颜色方案
      this.themeRange = await new ThemeRange().createObjClone(theme)
      // this.themeRange = theme
    }
    this.setState(
      {
        data: data,
      },
      () => {
        this.getData(
          this.state.data.expression,
          this.state.data.rangeMode,
          this.state.data.rangeCount,
          this.state.data.colorMethod,
          this.state.data.precision,
        )
      },
    )
  }

  goToChoosePage = type => {
    let cb = () => {}
    switch (type) {
      case ChoosePage.Type.EXPRESSION:
        cb = this.getExpression
        break
      case ChoosePage.Type.COLOR:
        cb = this.getColorMethod
        break
    }

    NavigationService.navigate('ChoosePage', {
      type: type,
      layer: type === ChoosePage.Type.EXPRESSION && this.props.layer,
      cb: value => cb(value),
    })
  }

  getExpression = ({ key }) => {
    if (this.state.data.colorMethod.value === '') return
    this.getData(
      key,
      this.state.data.rangeMode,
      this.state.data.rangeCount,
      this.state.data.colorMethod,
      this.state.data.precision,
    )
  }

  /**
   * 获取颜色方案
   */
  getColorMethod = ({ key, value }) => {
    let datalist = this.state.data
    if (this.state.data.expression === '') {
      Object.assign(datalist, { colorMethod: { key, value } })
      this.setState({
        data: datalist,
      })
      return
    }
    this.getData(
      this.state.data.expression,
      this.state.data.rangeMode,
      this.state.data.rangeCount,
      { key, value },
      this.state.data.precision,
    )
  }

  getData = (expression, rangeMode, rangeCount, colorMethod, precision) => {
    this.props.setLoading && this.props.setLoading(true)
    ;(async function() {
      try {
        // 获取表达式对应的所有Item
        let dataset = await this.props.layer.getDataset()
        let datasetVector = await dataset.toDatasetVector()

        if (
          this.state.data.expression !== expression ||
          this.state.data.colorMethod.value !== colorMethod.value ||
          this.state.data.rangeMode !== rangeMode ||
          this.state.data.rangeCount !== rangeCount ||
          !this.themeRange._SMThemeRangeId
        ) {
          this.themeRange = await new ThemeRange().makeDefault(
            datasetVector,
            expression,
            rangeMode,
            rangeCount,
            colorMethod.value,
          )
        }
        // else if(this.themeRange._SMThemeRangeId && this.state.data.expression !== expression) {
        //   await this.themeRange.setRangeExpression(expression)
        // }

        if (this.state.data.precision !== precision) {
          await this.themeRange.setPrecision(precision)
        }

        let customInterval = 0
        if (rangeMode === RangeMode.CUSTOMINTERVAL) {
          customInterval = await this.themeRange.getCustomInterval()
        }
        let count = await this.themeRange.getCount()
        let themeRangeList = []

        if (count > 3000) {
          this.props.setLoading && this.props.setLoading(false)
          this.setState(
            {
              data: {
                expression: expression,
                rangeMode: rangeMode,
                rangeCount:
                  rangeMode === RangeMode.CUSTOMINTERVAL
                    ? customInterval
                    : count,
                precision: precision,
                colorMethod: colorMethod,
              },
              themeItemList: [],
            },
            () => Toast.show('字段单值项炒超过3000，专题图制作失败'),
          )
          return
        }

        for (let i = 0; i < count; i++) {
          let item = await this.themeRange.getItem(i)
          let rangeValue = await item.getEnd()
          let style = await item.getStyle()
          let color = await style.getFillForeColor()
          let visible = await item.isVisible()
          let caption = await item.getCaption()
          let data = {
            visible: visible,
            color: dataUtil.colorHex(color),
            value: rangeValue,
            caption,
            data: item,
          }
          themeRangeList.push(data)
        }
        let datalist = this.state.data
        Object.assign(datalist, {
          expression: expression,
          rangeMode: rangeMode,
          rangeCount:
            rangeMode === RangeMode.CUSTOMINTERVAL ? customInterval : count,
          precision: precision,
          colorMethod: colorMethod,
        })
        this.setState(
          {
            themeRangeList: themeRangeList,
            data: datalist,
          },
          () => this.props.setLoading && this.props.setLoading(false),
        )
      } catch (e) {
        this.props.setLoading && this.props.setLoading(false)
      }
    }.bind(this)())
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

  changeStyle = data => {
    NavigationService.navigate('ThemeStyle', {
      layer: this.props.layer,
      map: this.props.map,
      mapControl: this.props.mapControl,
      item: data,
      cb: () => {
        this.getData(
          this.state.data.expression,
          this.state.data.rangeMode,
          this.state.data.rangeCount,
          this.state.data.colorMethod,
          this.state.data.precision,
        )
      },
    })
  }

  confirm = () => {
    (async function() {
      let dataset = await this.props.layer.getDataset()
      if (this.props.isThemeLayer) {
        await this.props.map.removeLayer(this.props.layer.index)
        let newLayer = await this.props.map.addThemeLayer(
          dataset,
          this.themeRange,
          true,
        )
        newLayer && (await newLayer.setCaption(this.props.layer.caption))
        newLayer && (await this.props.map.moveTo(0, this.props.layer.index))
      } else {
        await this.props.map.addThemeLayer(dataset, this.themeRange, true)
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
    }.bind(this)())
  }

  reset = () => {
    // TODO reset
  }

  renderContent = () => {
    return (
      <View style={styles.content}>
        <Row
          style={styles.row}
          key={'表达式'}
          value={this.state.data.expression || CHOOSE}
          type={Row.Type.TEXT_BTN}
          title={'表达式'}
          getValue={() => this.goToChoosePage(ChoosePage.Type.EXPRESSION)}
        />

        <Row
          style={styles.row}
          key={'分段方法'}
          value={this.state.data.rangeMode}
          type={Row.Type.RADIO_GROUP}
          title={'分段方法'}
          defaultValue={this.state.data.rangeMode}
          radioColumn={2}
          radioArr={[
            { title: '等距分段', value: RangeMode.EQUALINTERVAL },
            { title: '平方根分段', value: RangeMode.SQUAREROOT },
            { title: '标准差分段', value: RangeMode.STDDEVIATION },
            { title: '对数分段', value: RangeMode.LOGARITHM },
            { title: '等计数分段', value: RangeMode.QUANTILE },
            { title: '自定义分段', value: RangeMode.CUSTOMINTERVAL },
          ]}
          getValue={data => {
            // this.getValue({rangeMode: value})
            this.getData(
              this.state.data.expression,
              data.value,
              this.state.data.rangeCount,
              this.state.data.colorMethod,
              this.state.data.precision,
            )
          }}
        />

        {this.state.data.rangeMode !== RangeMode.STDDEVIATION && (
          <Row
            style={styles.row}
            key={
              this.state.data.rangeMode === RangeMode.CUSTOMINTERVAL
                ? '单段长度'
                : '段数'
            }
            defaultValue={this.state.data.rangeCount}
            value={this.state.data.rangeCount}
            type={Row.Type.CHOOSE_NUMBER}
            minValue={
              this.state.data.rangeMode === RangeMode.CUSTOMINTERVAL ? '' : 2
            }
            maxValue={
              this.state.data.rangeMode === RangeMode.CUSTOMINTERVAL ? '' : 32
            }
            title={
              this.state.data.rangeMode === RangeMode.CUSTOMINTERVAL
                ? '单段长度'
                : '段数'
            }
            getValue={value => {
              // this.getValue({rangeCount: value})
              this.getData(
                this.state.data.expression,
                this.state.data.rangeMode,
                value,
                this.state.data.colorMethod,
                this.state.data.precision,
              )
            }}
          />
        )}

        <Row
          style={styles.row}
          key={'分段舍入精度'}
          defaultValue={1}
          value={this.state.data.precision}
          type={Row.Type.CHOOSE_NUMBER}
          minValue={0.00000001}
          maxValue={10000000}
          times={10}
          title={'分段舍入精度'}
          getValue={value => {
            // this.getValue({precision: value})
            this.getData(
              this.state.data.expression,
              this.state.data.rangeMode,
              this.state.data.rangeCount,
              this.state.data.colorMethod,
              value,
            )
          }}
        />

        {/*<Row*/}
        {/*style={styles.row}*/}
        {/*key={'颜色方案'}*/}
        {/*value={this.state.data.colorMethod}*/}
        {/*type={Row.Type.CHOOSE_COLOR}*/}
        {/*title={'颜色方案'}*/}
        {/*getValue={value => this.getValue({colorMethod: value})}*/}
        {/*/>*/}

        <Row
          style={styles.row}
          key={'颜色方案'}
          value={this.state.data.colorMethod.key || CHOOSE}
          type={Row.Type.TEXT_BTN}
          title={'颜色方案'}
          getValue={() => this.goToChoosePage(ChoosePage.Type.COLOR)}
        />

        <ThemeTable
          ref={ref => (this.table = ref)}
          data={this.state.themeRangeList}
          tableHead={['可见', '风格', '段值', '标题']}
          flexArr={[1, 2, 1, 2]}
          changeStyle={this.changeStyle}
        />
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
      <ScrollView style={styles.container}>
        {this.renderContent()}
        {this.renderBtns()}
      </ScrollView>
    )
  }
}
