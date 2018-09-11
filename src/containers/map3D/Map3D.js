/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { Workspace, SMSceneView, Utility, Point3D, Camera } from 'imobile_for_javascript'
import { MTBtnList, Container } from '../../components'
import { Toast } from '../../utils'
import NavigationService from '../NavigationService'

import styles from './styles'

export default class Map3D extends React.Component {

  props: {
    editLayer: Object,
    latestMap: Array,
    navigation: Object,
    setEditLayer: () => {},
    setLatestMap: () => {},
  }

  constructor(props) {
    super(props)
    const params = this.props.navigation.state.params
    this.isExample = params.isExample || false
    this.state = {
      path: params.path,
      title: '',
    }
    this.path = params.path
    this.type = params.type || 'MAP_3D'
    // this._addScene2(params.path)
  }

  componentDidMount() {
    // Toast.show("地图编辑待做")
    // 三维地图只允许单例
    if (GLOBAL.sceneControl) {
      this._addScene()
    }
  }

  componentWillUnmount() {
    (async function(){
      this.scene && await this.scene.close()
      this.workspace && await this.workspace.closeWorkspace()
    }).bind(this)()
  }

  saveLatest = () => {
    if (this.isExample) return
    this.props.setLatestMap({
      path: this.path,
      type: this.type,
      name: this.mapName,
      // image: uri,
    })
  }

  _onGetInstance = sceneControl => {
    // GLOBAL.sceneControl = sceneControl
    GLOBAL.sceneControl = sceneControl
    this._addScene()
  }

  _pop_list = (show, type) => {//底部BtnBar事件点击回掉，负责底部二级pop的弹出
    this.setState(() => {
      return { popShow: show, popType: type }
    })
  }

  //一级pop按钮 图层管理 点击函数
  _layer_manager = () => {
    let ws = this.workspace
    let scene = this.scene
    NavigationService.navigate('Map3DLayerManager',{ workspace: ws, scene: scene })
    // Toast.show("待做")
  }

  //一级pop按钮 数据采集 点击函数
  _data_collection = () => {
    NavigationService.navigate('DataCollection')
  }

  _flyToPoint = () => {
    (async function() {
      let point = await new Point3D().createObj(116.5, 39.9, 500)
      this.scene.flyToPoint(point)
    }).bind(this)()
  }

  _flyToCamera = () => {
    (async function() {
      // lon, lat, alt, heading, tilt
      let camera = await new Camera().createObj(
        116.467575, 39.91542777777778, 1000, 300, 30)
      this.scene.flyToCamera(camera, 300, true)
    }).bind(this)()
  }

  _changeLayerColor = () => {
    (async function () {
      let layers3ds = await this.scene.getLayer3Ds()
      let layer3D = await layers3ds.get(4)
      // let name = await layer3D.getName()
      layer3D.setObjectsColor(1, 255, 0, 0, 0.8)
      await this.scene.refresh()
    }).bind(this)()
  }

  _getObjectsColorCount = () => {
    (async function () {
      // let layers3ds = await this.scene.getLayer3Ds()
      // let layer3D = await layers3ds.get(4)
      // let name = await layer3D.getName()
      // let count = await layer3D.getObjectsColorCount()
    }).bind(this)()
  }

  render() {
    return (
      <Container
        headerProps={{
          title: this.isExample ? '示例地图' : this.state.title,
          navigation: this.props.navigation,
          headerRight: [

          ],
        }}>
        <SMSceneView style={styles.map} onGetScene={this._onGetInstance} />
        <MTBtnList hidden={this.isExample} type={'MAP_3D'} POP_List={this._pop_list} layerManager={this._layer_manager} dataCollection={this._data_collection} />
      </Container>
    )
  }

  _addScene = () => {
    let workspaceModule = new Workspace()
    ;(async function () {
      this.workspace = await workspaceModule.createObj()   //创建workspace实例
      this.scene = await GLOBAL.sceneControl.getScene()      //获取场景对象
      await this.scene.setWorkspace(this.workspace)        //设置工作空间
      // let filePath = await Utility.appendingHomeDirectory(this.state.path)
      let openWk = await this.workspace.open(this.state.path)     //打开工作空间
      if (!openWk) {
        Toast.show(" 打开工作空间失败")
        return
      }
      this.mapName = await this.workspace.getSceneName(0) //获取场景名称
      this.setState({
        title: this.mapName,
      })
      await this.scene.open(this.mapName)                     //根据名称打开指定场景
      await this.scene.refresh()                           //刷新场景

      this.saveLatest()
    }).bind(this)()
  }

  // _addScene2 = (path = '') => {
  //   let workspaceModule = new Workspace()
  //   console.log(0)
  //   ;(async function () {
  //     this.workspace = await workspaceModule.createObj()   //创建workspace实例
  //
  //     console.log(1)
  //     if (!GLOBAL.sceneControl) {
  //       console.log(2)
  //       this.scene = await GLOBAL.sceneControl.getScene()      //获取场景对象
  //     }
  //     console.log(3)
  //     await this.scene.setWorkspace(this.workspace)        //设置工作空间
  //     let filePath = await Utility.appendingHomeDirectory(path)
  //     let openWk = await this.workspace.open(filePath)     //打开工作空间
  //
  //     console.log(4)
  //     if (!openWk) {
  //       Toast.show(" 打开工作空间失败")
  //       return
  //     }
  //     this.mapName = await this.workspace.getSceneName(0) //获取场景名称
  //     await this.scene.open(this.mapName)                     //根据名称打开指定场景
  //     await this.scene.refresh()                           //刷新场景
  //
  //     this.saveLatest()
  //   }).bind(this)()
  // }

}
