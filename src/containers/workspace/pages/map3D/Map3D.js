/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { BackHandler, Platform, View } from 'react-native'
import { SMSceneView, Point3D, Camera, SScene } from 'imobile_for_reactnative'
import { Container } from '../../../../components'
import {
  DrawerView,
  FunctionToolbar,
  MapToolbar,
  MapController,
} from '../../componets'
import { Toast, scaleSize } from '../../../../utils'
import constants from '../../constants'
import { Const } from '../../../../constants'
import NavigationService from '../../../NavigationService'
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
    this.operationType = params.operationType || constants.MAP_3D
    this.isExample = params.isExample || false
    this.mapName = params.mapName || null
    this.state = {
      path: params.path,
      title: '',
      popShow: false,
    }
    this.path = params.path
    this.type = params.type || 'MAP_3D'
    // this._addScene2(params.path)
  }

  componentDidMount() {
    this.container && this.container.setLoading(true, '地图加载中')
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', this.back)
    // 三维地图只允许单例
    this._addScene()
  }

  componentWillUnmount() {
    Platform.OS === 'android' &&
      BackHandler.removeEventListener('hardwareBackPress', this.back)

    // (async function(){
    //   this.scene && await this.scene.close()
    //   this.workspace && await this.workspace.closeWorkspace()
    // }).bind(this)()
  }

  _addScene = () => {
    if (!this.path) {
      this.container.setLoading(false)
      Toast.show('无场景显示')
      return
    }
    (async function() {
      try {
        let data = { server: this.path }
        SScene.openWorkspace(data).then(result => {
          result && SScene.openMap(this.mapName)
          this.container.setLoading(false)
        })
      } catch (e) {
        this.container.setLoading(false)
      }
    }.bind(this))
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

  // saveLatest = () => {
  //   if (this.isExample) return
  //   this.props.setLatestMap({
  //     path: this.path,
  //     type: this.type,
  //     name: this.mapName,
  //     // image: uri,
  //   })
  // }

  _onGetInstance = sceneControl => {
    GLOBAL.sceneControl = sceneControl
    // GLOBAL.sceneControlId = sceneControlId
    this._addScene()
    // this.container.setLoading(false)
  }

  _pop_list = (show, type) => {
    //底部BtnBar事件点击回掉，负责底部二级pop的弹出
    this.setState(() => {
      return { popShow: show, popType: type }
    })
  }

  //一级pop按钮 图层管理 点击函数
  _layer_manager = () => {
    NavigationService.navigate('Map3DLayerManager', { type: 'MAP_3D' })
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
    }.bind(this)())
  }

  _flyToCamera = () => {
    (async function() {
      // lon, lat, alt, heading, tilt
      let camera = await new Camera().createObj(
        116.467575,
        39.91542777777778,
        1000,
        300,
        30,
      )
      this.scene.flyToCamera(camera, 300, true)
    }.bind(this)())
  }

  _changeLayerColor = () => {
    (async function() {
      let layers3ds = await this.scene.getLayer3Ds()
      let layer3D = await layers3ds.get(4)
      // let name = await layer3D.getName()
      layer3D.setObjectsColor(1, 255, 0, 0, 0.8)
      await this.scene.refresh()
    }.bind(this)())
  }

  _getObjectsColorCount = () => {
    (async function() {
      // let layers3ds = await this.scene.getLayer3Ds()
      // let layer3D = await layers3ds.get(4)
      // let name = await layer3D.getName()
      // let count = await layer3D.getObjectsColorCount()
    }.bind(this)())
  }

  back = () => {
    try {
      this.container && this.container.setLoading(true, '正在关闭')
      ;(async function() {
        await SScene.closeWorkspace()
        this.container && this.container.setLoading(false)
        NavigationService.goBack()
      }.bind(this)())
    } catch (e) {
      this.container && this.container.setLoading(false)
    }
    return true
  }

  renderFunctionToolbar = () => {
    return <FunctionToolbar style={styles.functionToolbar} type={this.type} />
  }
  renderMapController = () => {
    return <MapController style={styles.mapController} />
  }
  renderToolBar = () => {
    if (this.state.popShow) {
      if (
        this.state.popType === Const.ANALYST ||
        this.state.popType === Const.TOOLS
      ) {
        return <View style={styles.popView}>{this.renderPopList()}</View>
      }
      return (
        <DrawerView
          thresholds={this.state.toolbarThreshold}
          heightChangeListener={({ childrenHeight, drawerHeight }) => {
            this.changeLayerBtn &&
              this.changeLayerBtn.setNativeProps({
                style: [
                  styles.changeLayerBtn, //// eslint-disable-next-line
                  { bottom: drawerHeight + scaleSize(20) },
                ],
              })
            this.popList &&
              this.popList.setGridListProps({
                style: {
                  height: childrenHeight,
                },
              })
          }}
        >
          {this.renderPopList()}
        </DrawerView>
      )
    } else {
      return (
        <MapToolbar
          hidden={this.isExample}
          type={'MAP_3D'}
          POP_List={this._pop_list}
          layerManager={this._layer_manager}
          dataCollection={this._data_collection}
          dataManager={this._data_manager}
          addLayer={this._addLayer}
          chooseLayer={this._chooseLayer}
          editLayer={this.props.editLayer}
          setEditLayer={this.props.setEditLayer}
          mapControl={this.mapControl}
        />
      )
    }
  }
  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.isExample ? '三维场景' : this.state.title,
          navigation: this.props.navigation,
          headerRight: [],
          backAction: this.back,
        }}
      >
        <SMSceneView style={styles.map} onGetScene={this._onGetInstance} />
        {this.renderMapController()}
        {this.renderFunctionToolbar()}
        {this.renderToolBar()}
      </Container>
    )
  }
}
