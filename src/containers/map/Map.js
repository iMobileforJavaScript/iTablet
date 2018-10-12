/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { View } from 'react-native'
import { Workspace, SMMapView, Point2D, Action } from 'imobile_for_reactnative'

import { PopMeasureBar, PopBtnSectionList, MTBtnList, Container } from '../../components'
import NavigationService from '../NavigationService'

import styles from './styles'

export default class Map extends React.Component {

  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    switch (params.type) {  //state.params.type最好进行判定
      case 'TD':
        this.DSParams = { server: 'http://t0.tianditu.com/vec_w/wmts', engineType: 23, driver: 'WMTS', alias: 'baseMap' }
        this.labelDSParams = { server: 'http://t0.tianditu.com/cva_w/wmts', engineType: 23, driver: 'WMTS', alias: 'label' }
        this.layerIndex = 0
        break
      case 'Baidu':
        this.DSParams = { server: 'http://www.baidu.com', engineType: 227 }
        this.labelDSParams = false
        this.layerIndex = 0
        break
      case 'Google':
        this.DSParams = { server: 'http://www.google.cn/maps', engineType: 223 }
        this.labelDSParams = false
        this.layerIndex = 'roadmap'
        break
      case 'OSM':
        this.DSParams = { server: 'http://openstreetmap.org', engineType: 228 }
        this.labelDSParams = false
        this.layerIndex = 0
        break
      case 'ONLINE':
        this.DSParams = { server: params.path || 'http://openstreetmap.org', engineType: 228 }
        this.labelDSParams = false
        this.layerIndex = 0
        break
      default:
        this.DSParams = { server: 'http://openstreetmap.org', engineType: 228 }
        this.labelDSParams = false
        this.layerIndex = 0
    }
  }

  state = {
    popShow: false,
    popType: '',
    measureShow: false,
    measureResult: 0,
  }

  componentWillUnmount(){
    (async function(){
      await this.map.close()
      await this.workspace.closeWorkspace()
    }).bind(this)()
  }

  _onGetInstance = mapView => {
    this.mapView = mapView
    this._addMap()
  }

  _toolsClickTest = () => {
  }

  _pop_list = (show, type) => {//底部BtnBar事件点击回掉，负责底部二级pop的弹出
    this.setState({
      popShow: show,
      popType: type,
    })
  }

  //一级pop按钮 图层管理 点击函数
  _layer_manager = () => {
    let ws = this.workspace
    let map = this.map
    NavigationService.navigate('LayerManager',{ workspace: ws, map: map })
  }

  //一级pop按钮 数据采集 点击函数
  _data_collection = () => {
    NavigationService.navigate('DataCollection')
  }

  //二级pop按钮 量算 点击函数
  _pop_measure_click = show => {
    this.setState({ measureShow: show })
    this._add_measure_listener()// to do list:优化，不需每次都添加listener
  }

  //二级pop按钮 缓冲区分析&&叠加分析 点击函数
  _pop_analyst_click = () => {
    NavigationService.navigate('AnalystParams')
  }

  //二级pop按钮 添加图层（点、线、面、文字） 点击函数
  _pop_addLayer_click = type => {
    let ws = this.workspace
    let map = this.map
    NavigationService.navigate('AddLayer', { type: type, workspace: ws, map: map })
  }

  /*测量功能模块*/

  _add_measure_listener = async () => {
    await this.mapControl.addMeasureListener({
      lengthMeasured: this._measure_callback,
      areaMeasured: this._measure_callback,
    })
  }

  _measure_callback = e => {
    let result = e.curResult
    this.setState({
      measureResult: result,
    })
  }

  _remove_measure_listener = async () => {
    await this.mapControl.removeMeasureListener()
  }

  _measure_line = async () => {
    await this.mapControl.setAction(Action.MEASURELENGTH)
  }

  _measure_square = async () => {
    await this.mapControl.setAction(Action.MEASUREAREA)
  }

  _measure_pause = async () => {
    await this.mapControl.setAction(Action.PAN)
    this.setState({
      measureResult: 0,
    })
  }

  _closeMeasureMode = async () => {
    await this.mapControl.setAction(Action.PAN)
    this._remove_measure_listener()
  }

  render() {
    return (
      <Container
        headerProps={{
          title: '地图',
          navigation: this.props.navigation,
          headerRight: [

          ],
        }}>
        <SMMapView style={styles.map} onGetInstance={this._onGetInstance} />
        {this.state.measureShow && <PopMeasureBar measureLine={this._measure_line} measureSquare={this._measure_square} measurePause={this._measure_pause} style={styles.measure} result={this.state.measureResult} />}
        {this.state.popShow && <PopBtnSectionList style={styles.pop} popType={this.state.popType} measure={this._pop_measure_click} analyst={this._pop_analyst_click} addlayer={this._pop_addLayer_click} />}
        <MTBtnList POP_List={this._pop_list} layerManager={this._layer_manager} dataCollection={this._data_collection} />
      </Container>
    )
  }

  _addMap = () => {
    const workspaceModule = new Workspace()
    const point2dModule = new Point2D()
    ;(async function () {
      this.workspace = await workspaceModule.createObj()
      this.mapControl = await this.mapView.getMapControl()
      this.map = await this.mapControl.getMap()
      await this.map.setWorkspace(this.workspace)

      await this.map.setScale(0.0001)
      navigator.geolocation.getCurrentPosition(
        position => {
          let lat = position.coords.latitude
          let lon = position.coords.longitude
          ;(async () => {
            let centerPoint = await point2dModule.createObj(lon, lat)
            await this.map.setCenter(centerPoint)
            await this.map.refresh()
          }).bind(this)()
        }
      )

      let dsBaseMap = await this.workspace.openDatasource(this.DSParams)
      await this.map.addLayer(await dsBaseMap.getDataset(this.layerIndex), true)
      if (this.labelDSParams) {
        let dsLabel = await this.workspace.openDatasource(this.labelDSParams)
        await this.map.addLayer(await dsLabel.getDataset(this.layerIndex), true)
      }
    }).bind(this)()
  }

}