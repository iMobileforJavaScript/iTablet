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
} from '../../components'
import { Toast } from '../../../../utils'
import constants from '../../constants'
import NavigationService from '../../../NavigationService'
import styles from './styles'

export default class Map3D extends React.Component {
  props: {
    editLayer: Object,
    latestMap: Object,
    navigation: Object,
    setEditLayer: () => {},
    setLatestMap: () => {},
    setCurrentAttribute: () => {},
    setAttributes: () => {},
    exportmap3DWorkspace: () => {},
    user: Object,
    device: Object,
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
    this.path = params.path || ''
    this.type = params.type || 'MAP_3D'
  }

  componentDidMount() {
    Platform.OS === 'android' &&
      BackHandler.addEventListener('hardwareBackPress', this.back)
    // 三维地图只允许单例
    this._addScene()
    this.addAttributeListener()
    this.addCircleFlyListen()
  }

  componentWillUnmount() {
    Platform.OS === 'android' &&
      BackHandler.removeEventListener('hardwareBackPress', this.back)
    this.attributeListener && this.attributeListener.remove()
    this.circleFlyListen && this.circleFlyListen.remove()
  }

  initListener = async () => {
    SScene.setListener().then(() => {
      SScene.getAttribute()
      SScene.setCircleFly()
    })
  }

  addAttributeListener = async () => {
    this.attributeListener = await SScene.addAttributeListener({
      callback: result => {
        this.toolBox.showMap3DAttribute(result)
      },
    })
  }

  addCircleFlyListen = async () => {
    this.circleFlyListen = await SScene.addCircleFlyListen({
      callback: () => {
        this.toolBox.showMap3DTool('MAP3D_CIRCLEFLY')
      },
    })
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
      result &&
        SScene.openMap(mapList[0].name).then(() => {
          this.initListener()
          GLOBAL.openWorkspace = true
        })
      this.container.setLoading(false)
    } catch (e) {
      this.container.setLoading(false)
    }
  }

  _onGetInstance = sceneControl => {
    GLOBAL.sceneControl = sceneControl
    this._addScene()
  }

  _pop_list = (show, type) => {
    //底部BtnBar事件点击回掉，负责底部二级pop的弹出
    this.setState(() => {
      return { popShow: show, popType: type }
    })
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
      layer3D.setObjectsColor(1, 255, 0, 0, 0.8)
      await this.scene.refresh()
    }.bind(this)())
  }

  back = async () => {
    GLOBAL.SaveMapView &&
      GLOBAL.openWorkspace &&
      GLOBAL.SaveMapView.setVisible(true, this.setLoading)
    if (!GLOBAL.openWorkspace) {
      this.container && this.container.setLoading(false)
      NavigationService.goBack()
    }
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
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
        device={this.props.device}
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
    if (
      this.state.inputText.indexOf(' ') > -1 ||
      this.state.inputText === '' ||
      this.state.inputText == null
    ) {
      this.setState({
        placeholder: true,
      })
      return
    }
    let point = this.toolBox.getPoint()
    SScene.addGeoText(
      point.pointX,
      point.pointY,
      point.pointZ,
      this.state.inputText,
    ).then(() => {
      this.setState({
        inputText: '',
      })
    })
    this.toolBox.showToolbar()
    this.dialog.setDialogVisible(false)
  }

  cancel = async () => {
    this.setState({
      placeholder: false,
    })
    this.toolBox.showToolbar()
    this.dialog.setDialogVisible(false)
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
        user={this.props.user}
        existFullMap={() => this.showFullMap(false)}
        confirmDialog={this.confirm}
        dialog={() => this.dialog}
        {...this.props}
        setAttributes={this.props.setAttributes}
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
          title: '三维场景',
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
