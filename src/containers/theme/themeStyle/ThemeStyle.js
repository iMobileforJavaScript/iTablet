/*
 Copyright © SuperMap. All rights reserved.
 Author: yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { Container, Button, Row } from '../../../components'
import { Toast, dataUtil } from '../../../utils'
import { DatasetType, GeoStyle, Size2D } from 'imobile_for_reactnative'
import NavigationService from '../../NavigationService'

import styles from './styles'

const UNIQUE = '单值专题图'
const RANGE = '分段设色专题图'
const LABEL = '标签专题图'

const POINT_STYLE = '点风格'
const LINE_STYLE = '线风格'
const REGION_STYLE = '填充风格'

export default class ThemeStyle extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
  }

  state = {
    data: [{ title: UNIQUE }, { title: RANGE }, { title: LABEL }],
  }

  constructor(props) {
    super(props)
    let { params } = props.navigation.state
    this.layer = params && params.layer
    this.map = params && params.map
    this.mapControl = params && params.mapControl
    this.originType = (params && params.type) || ''
    this.settingType = ''
    // 设置图层风格
    this.layerSetting = {}
    // 设置主题中子项的风格
    this.item = params && params.item // themeUniqueItem || themeRangeItem || themeLabelItem
    this.cb = params && params.cb // themeUniqueItem || themeRangeItem || themeLabelItem 回调函数
    this.state = {
      title: '',
      type: (params && params.type) || '',
      data: {
        color: '#ffffff',
        lineColor: '#ffffff',
        pointColor: '',
        size: 0,
        pointSize: 0,
      },
      showView: false,
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    (async function() {
      this.container.setLoading(true)
      try {
        let dataset = await this.layer.getDataset()
        let settingStyle
        let type = await dataset.getType()
        if (this.item) {
          settingStyle = await this.item.getStyle()
          this.getStyle(settingStyle, type)
        } else {
          this.layerSetting = await this.layer.getAdditionalSetting()
          this.settingType = await this.layerSetting.getType()
          switch (this.settingType) {
            case 'VECTOR':
              settingStyle = await this.layerSetting.getStyle()
              this.getStyle(settingStyle, type)
              break
            case 'RASTER':
              break
            case 'GRID':
              break
            default:
              throw new Error('Unknown LayerSetting Type')
          }
        }
        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
        Toast.show('加载失败')
      }
    }.bind(this)())
  }

  getStyle = (settingStyle, type) => {
    (async function() {
      let baseSetting = {},
        title = '',
        data = this.state.data,
        size2D
      switch (type) {
        case DatasetType.POINT:
          size2D = await settingStyle.getMarkerSize()
          baseSetting.pointSize = await size2D.getWidth()
          baseSetting.lineColor = dataUtil.colorHex(
            await settingStyle.getLineColor(),
          )
          title = '点符号库'
          break
        case DatasetType.LINE:
          baseSetting.lineColor = dataUtil.colorHex(
            await settingStyle.getLineColor(),
          )
          baseSetting.size = await settingStyle.getLineWidth()
          title = '线符号库'
          break
        case DatasetType.REGION:
          baseSetting.color = dataUtil.colorHex(
            await settingStyle.getFillForeColor(),
          )
          baseSetting.lineColor = dataUtil.colorHex(
            await settingStyle.getLineColor(),
          )
          baseSetting.size = await settingStyle.getLineWidth()
          title = '面符号库'
          break
      }
      Object.assign(data, baseSetting)
      this.setState({
        showView: true,
        title,
        data,
        type,
      })
    }.bind(this)())
  }

  getColor = (type, defaultColor) => {
    NavigationService.navigate('ColorPickerPage', {
      defaultColor: defaultColor,
      cb: color => {
        this.getValue({ [type]: color })
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
    (async function() {
      try {
        if (this.settingType === 'VECTOR' || this.item) {
          let geoStyle = await new GeoStyle().createObj()
          if (this.state.data.color) {
            let colorRgb = dataUtil.colorRgba(this.state.data.color)
            await geoStyle.setFillForeColor(
              colorRgb.r,
              colorRgb.g,
              colorRgb.b,
              colorRgb.a,
            )
          }
          if (this.state.data.lineColor) {
            let lineColorRgb = dataUtil.colorRgba(this.state.data.lineColor)
            await geoStyle.setLineColor(
              lineColorRgb.r,
              lineColorRgb.g,
              lineColorRgb.b,
              lineColorRgb.a,
            )
          }
          if (this.state.data.pointColor) {
            let pointColorRgb = dataUtil.colorRgba(this.state.data.pointColor)
            await geoStyle.setPointColor(
              pointColorRgb.r,
              pointColorRgb.g,
              pointColorRgb.b,
              pointColorRgb.a,
            )
          }
          if (this.state.data.size > 0) {
            await geoStyle.setLineWidth(this.state.data.size)
          }
          if (this.state.data.pointSize > 0) {
            let size2D = await new Size2D().createObj(
              this.state.data.pointSize,
              this.state.data.pointSize,
            )
            await geoStyle.setMarkerSize(size2D)
          }
          if (this.item) {
            await this.item.setStyle(geoStyle)
            this.cb && this.cb()
          } else {
            await this.layerSetting.setStyle(geoStyle)
          }
          await this.map.refresh()
          // let routes = this.props.nav.routes
          // let key = ''
          // for (let i = 0; i < routes.length - 1; i++) {
          //   if (routes[i].routeName === 'MapView') {
          //     key = routes[i + 1].key
          //   }
          // }
          // NavigationService.goBack(key)
          NavigationService.goBack()
          Toast.show('设置成功')
        }
      } catch (e) {
        Toast.show('设置失败')
      }
    }.bind(this)())
  }

  reset = () => {}

  renderCAD = () => {
    return (
      <View>
        {this.renderCADItem(POINT_STYLE)}
        {this.renderCADItem(LINE_STYLE)}
        {this.renderCADItem(REGION_STYLE)}
      </View>
    )
  }

  renderCADItem = title => {
    return (
      <TouchableOpacity
        key={title}
        activeOpacity={0.8}
        style={styles.row}
        onPress={() => this.rowAction(title)}
      >
        <Text style={styles.rowTitle}>{title}</Text>
      </TouchableOpacity>
    )
  }

  rowAction = title => {
    let type = ''
    switch (title) {
      case POINT_STYLE:
        type = DatasetType.POINT
        break
      case LINE_STYLE:
        type = DatasetType.LINE
        break
      case REGION_STYLE:
        type = DatasetType.REGION
        break
    }
    this.setState({
      showView: true,
      type,
    })
  }

  /**
   * 点图层基本设置
   * @returns {XML}
   */
  renderPointSetting = () => {
    return (
      <View>
        <Row
          style={styles.row}
          key={'颜色'}
          value={this.state.data.lineColor}
          type={Row.Type.CHOOSE_COLOR}
          title={'颜色'}
          getValue={() => this.getColor('lineColor', this.state.data.lineColor)}
        />
        <Row
          style={styles.row}
          key={'符号大小'}
          defaultValue={this.state.data.pointSize}
          value={this.state.data.pointSize}
          type={Row.Type.CHOOSE_NUMBER}
          minValue={1}
          // maxValue={12}
          title={'符号大小'}
          unit={'mm'}
          getValue={value => this.getValue({ pointSize: value })}
        />
      </View>
    )
  }

  renderLineSetting = () => {
    return (
      <View>
        <Row
          style={styles.row}
          key={'颜色'}
          value={this.state.data.lineColor}
          type={Row.Type.CHOOSE_COLOR}
          title={'颜色'}
          getValue={() => this.getColor('lineColor', this.state.data.lineColor)}
        />
        <Row
          style={styles.row}
          key={'线宽'}
          defaultValue={this.state.data.size}
          value={this.state.data.size}
          type={Row.Type.CHOOSE_NUMBER}
          minValue={0.1}
          // maxValue={12}
          unit={'mm'}
          title={'线宽'}
          getValue={value => this.getValue({ size: value })}
          commonDifference={0.1}
        />
      </View>
    )
  }

  renderRegionSetting = () => {
    return (
      <View>
        <Row
          style={styles.row}
          key={'填充颜色'}
          value={this.state.data.color}
          type={Row.Type.CHOOSE_COLOR}
          title={'填充颜色'}
          getValue={() => this.getColor('color', this.state.data.color)}
        />
        <Row
          style={styles.row}
          key={'线宽'}
          defaultValue={this.state.data.size}
          value={this.state.data.size}
          type={Row.Type.CHOOSE_NUMBER}
          minValue={0.1}
          // maxValue={12}
          title={'线宽'}
          unit={'mm'}
          getValue={value => this.getValue({ size: value })}
          commonDifference={0.1}
        />
        <Row
          style={styles.row}
          key={'边框颜色'}
          value={this.state.data.lineColor}
          type={Row.Type.CHOOSE_COLOR}
          title={'边框颜色'}
          getValue={() => this.getColor('lineColor', this.state.data.lineColor)}
        />
      </View>
    )
  }

  renderResource = () => {
    return (
      <View style={styles.subContent}>
        <View style={styles.titleView}>
          <Text style={styles.title}>{this.state.title}</Text>
        </View>
        <View />
      </View>
    )
  }

  renderSetting = () => {
    let setting
    switch (this.state.type) {
      case DatasetType.CAD:
        setting = this.renderCAD()
        break
      case DatasetType.POINT:
        setting = this.renderPointSetting()
        break
      case DatasetType.LINE:
        setting = this.renderLineSetting()
        break
      case DatasetType.REGION:
        setting = this.renderRegionSetting()
        break
      default:
        setting = <View />
        break
    }
    return (
      <View>
        {this.state.type !== DatasetType.CAD && (
          <View style={styles.titleView}>
            <Text style={styles.title}>基本设置</Text>
          </View>
        )}
        {setting}
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

  back = () => {
    if (this.originType === DatasetType.CAD) {
      this.setState({
        type: DatasetType.CAD,
      })
    } else {
      NavigationService.goBack()
    }
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '图层风格',
          navigation: this.props.navigation,
          backAction: this.back,
        }}
      >
        <ScrollView style={styles.content}>
          {/*{this.state.showView && this.renderResource()}*/}
          {this.state.showView && this.renderSetting()}
        </ScrollView>
        {this.state.type !== DatasetType.CAD && this.renderBtns()}
      </Container>
    )
  }
}
