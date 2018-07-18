/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com 
*/

import * as React from 'react'
import { View } from 'react-native'
import { Workspace, SMMapView, Utility, Action } from 'imobile_for_javascript'

import { PopMeasureBar, PopBtnSectionList, MTBtnList } from '../../components'

import styles from './styles'

export default class LocalMap extends React.Component {
  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.path = params.path
  }

  state = {
    popShow: false,
    popType: '',
    measureShow: false,
    measureResult: 0,
  }

  _onGetInstance = (mapView) => {
    this.mapView = mapView
    this._addMap()
  }

  _pop_list = (show, type) => {//底部BtnBar事件点击回掉，负责底部二级pop的弹出
    this.setState(previousState => {
      return { popShow: show, popType: type, }
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
  _pop_measure_click = (show) => {
    this.setState(previousState => {
      return { measureShow: show }
    })
    this._add_measure_listener()// to do list:优化，不需每次都添加listener
  }

  //二级pop按钮 缓冲区分析&&叠加分析 点击函数
  _pop_analyst_click = () => {
    NavigationService.navigate('AnalystParams')
  }

  //二级pop按钮 添加图层（点、线、面、文字） 点击函数
  _pop_addLayer_click = (type) => {
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

  _measure_callback = (e) => {
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
      <View style={styles.container}>
        <SMMapView style={styles.map} onGetInstance={this._onGetInstance} />
        {this.state.measureShow && <PopMeasureBar measureLine={this._measure_line} measureSquare={this._measure_square} measurePause={this._measure_pause} style={styles.measure} result={this.state.measureResult} />}
        {this.state.popShow && <PopBtnSectionList style={styles.pop} popType={this.state.popType} measure={this._pop_measure_click} analyst={this._pop_analyst_click} addlayer={this._pop_addLayer_click} />}
        <MTBtnList POP_List={this._pop_list} layerManager={this._layer_manager} dataCollection={this._data_collection} />
      </View>
    )
  }

  _addMap = () => {
    if (!this.path) return
    var workspaceModule = new Workspace()
    ;(async function () {
        this.workspace = await workspaceModule.createObj()
        this.mapControl = await this.mapView.getMapControl()
        this.map = await this.mapControl.getMap()
     
        var filePath = ''
        var filePath = await Utility.appendingHomeDirectory(this.path)

        var openWk = await this.workspace.open(filePath)
        await this.map.setWorkspace(this.workspace)
        var mapName = await this.workspace.getMapName(0)
        await this.map.open(mapName)
        // await this.map.setScale(0.00001)
        await this.map.refresh()
    }).bind(this)();
  }

}