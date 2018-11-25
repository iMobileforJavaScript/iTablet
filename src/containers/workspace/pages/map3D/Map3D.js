/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { BackHandler, Platform, View, Text, TextInput } from 'react-native'
import { SMSceneView, Point3D, Camera, SScene } from 'imobile_for_reactnative'
import { Container, Dialog } from '../../../../components'
import {
  FunctionToolbar,
  MapToolbar,
  MapController,
  ToolBar,
} from '../../componets'
import { Toast } from '../../../../utils'
import constants from '../../constants'
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
      inputText: '',
      placeholder: false,
    }
    this.path = params.path
    this.type = params.type || 'MAP_3D'
    // this._addScene2(params.path)
    // this.listenevent=this.addListen()
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
    this.listenevent && this.listenevent.remove()
  }

  _addScene = async () => {
    if (!this.path) {
      this.container.setLoading(false)
      Toast.show('无场景显示')
      return
    }
    try {
      let data = { server: this.path }
      let result = await SScene.openWorkspace(data)
      let mapList = await SScene.getMapList()
      result && (await SScene.openMap(mapList[0].name))
      this.container.setLoading(false)
    } catch (e) {
      this.container.setLoading(false)
    }
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
    SScene.getAttribute()
    // this.container.setLoading(false)
  }

  _pop_list = (show, type) => {
    //底部BtnBar事件点击回掉，负责底部二级pop的弹出
    this.setState(() => {
      return { popShow: show, popType: type }
    })
  }

  //一级pop按钮 图层管理 点击函数
  // _layer_manager = () => {
  //   NavigationService.navigate('Map3DLayerManager', { type: 'MAP_3D' })
  //   // Toast.show("待做")
  // }

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
    return (
      <FunctionToolbar
        style={styles.functionToolbar}
        ref={ref => (this.functionToolbar = ref)}
        getToolRef={() => {
          return this.toolBox
        }}
        type={this.type}
        showFullMap={this.showFullMap}
      />
    )
  }
  renderMapController = () => {
    return (
      <MapController ref={ref => (this.mapController = ref)} type={'MAP_3D'} />
    )
  }

  showFullMap = isFull => {
    if (isFull === this.fullMap) return
    let full = isFull === undefined ? !this.fullMap : !isFull
    this.container && this.container.setHeaderVisible(full)
    this.container && this.container.setBottomVisible(full)
    this.functionToolbar && this.functionToolbar.setVisible(full)
    this.mapController && this.mapController.setVisible(full)
    this.fullMap = isFull
  }

  confirm = async () => {
    // console.log(this)
    if (
      this.state.inputText.indexOf('') > -1 ||
      this.state.inputText === '' ||
      this.state.inputText == null
    ) {
      // Toast.show('请输入文本内容')
      this.setState({
        placeholder: true,
      })
      return
    }
    let point = this.toolBox.getPoint()
    SScene.addGeoText(point.pointX, point.pointY, this.state.inputText)
    // this.toolBox.showToolbar(!this.toolBox.isShow)
    this.toolBox.showToolbar()
    this.dialog.setDialogVisible(false)
  }

  cancel = async () => {
    // console.log(this)
    // this.toolBox.showToolbar(!this.toolBox.isShow)
    this.setState({
      placeholder: false,
    })
    this.toolBox.showToolbar()
    this.dialog.setDialogVisible(false)
  }

  showDialog = value => {
    this.dialog.setDialogVisible(value)
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        initIndex={0}
        type={this.operationType}
        layerManager={this._layer_manager}
      />
    )
  }

  renderTool = () => {
    return (
      <ToolBar
        ref={ref => (this.toolBox = ref)}
        existFullMap={() => this.showFullMap(false)}
        confirmDialog={this.confirm}
        showDialog={this.showDialog}
      />
    )
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        style={{ marginVertical: 15 }}
        type={'modal'}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
      >
        <View style={styles.item}>
          <Text style={styles.title}>文本内容</Text>
          <TextInput
            underlineColorAndroid={'transparent'}
            accessible={true}
            accessibilityLabel={'文本内容'}
            onChangeText={text => {
              this.setState({
                inputText: text,
              })
            }}
            value={this.state.inputText}
            placeholder={'请输入文本内容'}
            style={styles.textInputStyle}
          />
        </View>
        {this.state.placeholder && (
          <Text style={styles.placeholder}>文本内容不能为空</Text>
        )}
      </Dialog>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.isExample ? '三维场景' : this.state.title,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomBar={this.renderToolBar()}
        bottomProps={{ type: 'fix' }}
      >
        <SMSceneView style={styles.map} onGetScene={this._onGetInstance} />
        {this.renderMapController()}
        {this.renderFunctionToolbar()}
        {this.renderTool()}
        {this.renderDialog()}
      </Container>
    )
  }
}
