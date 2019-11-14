/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import {
  InteractionManager,
  Platform,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native'
import { SMSceneView, Point3D, Camera, SScene } from 'imobile_for_reactnative'
import {
  Container,
  Dialog,
  InputDialog,
  Progress,
} from '../../../../components'
import {
  FunctionToolbar,
  MapToolbar,
  MapController,
  ToolBar,
  OverlayView,
} from '../../components'
import { Toast, scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
import constants from '../../constants'
import NavigationService from '../../../NavigationService'
import styles from './styles'
import { getLanguage } from '../../../../language'
import SurfaceView from '../../../../components/SurfaceView'
import { tool3DModule } from '../../components/ToolBar/modules'
const SAVE_TITLE = '是否保存当前场景'
export default class Map3D extends React.Component {
  props: {
    language: string,
    editLayer: Object,
    latestMap: Object,
    navigation: Object,
    online: Object,
    downloads: Array,
    setEditLayer: () => {},
    setLatestMap: () => {},
    setCurrentAttribute: () => {},
    setAttributes: () => {},
    exportmap3DWorkspace: () => {},
    refreshLayer3dList: () => {},
    user: Object,
    device: Object,
    setBackAction: () => {},
    removeBackAction: () => {},
  }

  constructor(props) {
    super(props)
    GLOBAL.sceneName = ''
    GLOBAL.openWorkspace = false
    GLOBAL.action3d = ''
    const params = this.props.navigation.state.params
    this.operationType = params.operationType || constants.MAP_3D
    this.isExample = params.isExample || false
    this.mapName = params.mapName || null
    this.state = {
      title: '',
      popShow: false,
      // inputText: '',
      showErrorInfo: false,
      measureShow: false,
      measureResult: '',
    }
    this.name = params.name || ''
    this.type = params.type || 'MAP_3D'
    this.mapLoaded = false // 判断地图是否加载完成
  }

  componentDidMount() {
    this.container.setLoading(
      true,
      getLanguage(this.props.language).Prompt.LOADING,
    )
    InteractionManager.runAfterInteractions(() => {
      if (Platform.OS === 'android') {
        this.props.setBackAction({
          action: this.back,
        })
      }
      GLOBAL.SaveMapView && GLOBAL.SaveMapView.setTitle(SAVE_TITLE)

      // 三维地图只允许单例
      // setTimeout(this._addScene, 2000)
      this._addScene()
      this.addAttributeListener()
      this.addCircleFlyListen()
      this.getLayers()
    })
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.downloads.length > 0 &&
      JSON.stringify(this.props.downloads) !==
        JSON.stringify(prevProps.downloads)
    ) {
      let data
      for (let i = 0; i < this.props.downloads.length; i++) {
        if (this.props.downloads[i].id === GLOBAL.Type) {
          data = this.props.downloads[i]
        }
      }
      if (data && this.mProgress) {
        this.mProgress.progress = data.progress / 100
      }
    }
  }

  componentWillUnmount() {
    // GLOBAL.SaveMapView&&GLOBAL.SaveMapView.setTitle(SAVE_TITLE)
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.navigation.state.routeName,
      })
    }
    this.attributeListener && this.attributeListener.remove()
    this.circleFlyListen && this.circleFlyListen.remove()
  }

  getLayers = async () => {
    let layerlist = await SScene.getLayerList()
    let terrainLayerList = await SScene.getTerrainLayerList()
    layerlist = JSON.parse(JSON.stringify(layerlist.concat(terrainLayerList)))
    this.setState({
      layerlist,
    })
  }
  initListener = async () => {
    SScene.setListener().then(() => {
      SScene.getAttribute()
      SScene.setCircleFly()
      SScene.setAction('PAN3D')
      GLOBAL.action3d = 'PAN3D'
    })
  }

  addAttributeListener = async () => {
    this.attributeListener = await SScene.addAttributeListener({
      callback: result => {
        GLOBAL.action3d === 'PAN3D' && this.showFullMap(!this.fullMap)

        let list = []
        let arr = []
        Object.keys(result).forEach(key => {
          let item = {
            fieldInfo: { caption: key },
            name: key,
            value: result[key],
          }
          if (key === 'id') {
            arr.unshift(item)
          } else {
            arr.push(item)
          }
        })
        list.push(arr)
        this.props.setAttributes(list)
      },
    })
  }

  addCircleFlyListen = async () => {
    this.circleFlyListen = await SScene.addCircleFlyListen({
      callback: () => {
        tool3DModule().actions.circleFly()
      },
    })
  }

  _addScene = async () => {
    if (!this.name) {
      setTimeout(() => {
        this.container.setLoading(false)
        Toast.show(getLanguage(this.props.language).Prompt.NO_SCENE)
        this.mapLoaded = true
        //'无场景显示')
      }, 1500)
      return
    }
    try {
      SScene.openScence(this.name).then(result => {
        if (!result) {
          this.container.setLoading(false)
          return
        }
        SScene.setNavigationControlVisible(false)
        this.initListener()
        GLOBAL.openWorkspace = true
        GLOBAL.sceneName = this.name
        setTimeout(() => {
          this.container.setLoading(false)
          // Toast.show('无场景显示')
        }, 1500)
        this.props.refreshLayer3dList && this.props.refreshLayer3dList()
        this.mapLoaded = true
      })
    } catch (e) {
      setTimeout(() => {
        this.container.setLoading(false)
        // Toast.show('无场景显示')
        this.mapLoaded = true
      }, 1500)
    }
    await SScene.changeBaseLayer(1)
    // await SScene.addLayer3D(
    //   'http://t0.tianditu.com/img_c/wmts',
    //   'l3dBingMaps',
    //   'bingmap',
    //   'JPG_PNG',
    //   96.0,
    //   true,
    //   'c768f9fd3e388eb0d155405f8d8c6999',
    // )
  }

  _onGetInstance = sceneControl => {
    GLOBAL.sceneControl = sceneControl
    // this._addScene()
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
    // GLOBAL.SaveMapView &&
    //   GLOBAL.openWorkspace &&
    //   GLOBAL.SaveMapView.setVisible(true, this.setLoading)
    // if (!GLOBAL.openWorkspace) {
    //   this.container && this.container.setLoading(false)
    //   NavigationService.goBack()
    // }
    // GLOBAL.sceneName = ''
    if (!this.mapLoaded) return
    try {
      if (GLOBAL.isCircleFlying) {
        await SScene.stopCircleFly()
        await SScene.clearCirclePoint()
      }
      if (Platform.OS === 'android') {
        if (this.toolBox && this.toolBox.getState().isShow) {
          this.toolBox.close()
          return true
        } else if (this.SaveDialog && this.SaveDialog.getState().visible) {
          this.SaveDialog.setDialogVisible(false)
          return true
        } else if (
          GLOBAL.removeObjectDialog &&
          GLOBAL.removeObjectDialog.getState().visible
        ) {
          GLOBAL.removeObjectDialog.setDialogVisible(false)
          return true
        }
      }

      this.container &&
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.CLOSING_3D,
          //'正在关闭'
        )
      if (GLOBAL.openWorkspace) {
        // this.SaveDialog && this.SaveDialog.setDialogVisible(true)
        // await SScene.saveWorkspace()
        await SScene.closeWorkspace()
        this.container && this.container.setLoading(false)
        NavigationService.goBack()
      } else {
        this.container && this.container.setLoading(false)
        NavigationService.goBack()
      }
    } catch (e) {
      this.container && this.container.setLoading(false)
      NavigationService.goBack()
    }
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  //遮盖层
  renderOverLayer = () => {
    return <OverlayView ref={ref => (GLOBAL.OverlayView = ref)} />
  }

  renderFunctionToolbar = () => {
    return (
      <FunctionToolbar
        language={this.props.language}
        style={styles.functionToolbar}
        ref={ref => (this.functionToolbar = ref)}
        getToolRef={() => {
          return this.toolBox
        }}
        type={this.type}
        showFullMap={this.showFullMap}
        device={this.props.device}
        online={this.props.online}
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
    // eslint-disable-next-line
    const content = /[@#\$%\^&\*]+/g
    // let result = content.test(this.state.inputText)
    let result = content.test(this.inputText)
    if (
      result ||
      this.inputText === '' ||
      this.inputText === null
      // this.state.inputText === '' ||
      // this.state.inputText === null
    ) {
      this.inputText = null
      this.setState({
        // inputText: null,
        showErrorInfo: true,
      })
      return
    }
    // let point = this.toolBox.getPoint()
    let point = this.toolBox.getToolbarModule().getData().point
    SScene.addGeoText(
      point.pointX,
      point.pointY,
      point.pointZ,
      this.inputText,
      // this.state.inputText,
    ).then(() => {
      this.inputText = ''
      // this.setState({
      //   inputText: '',
      // })
    })
    // this.toolBox.showToolbar()
    this.dialog.setDialogVisible(false)
  }

  cancel = async () => {
    this.setState({
      showErrorInfo: false,
    })
    // this.toolBox.showToolbar()
    this.dialog.setDialogVisible(false)
  }

  setInputDialogVisible = (visible, params = {}) => {
    this.InputDialog && this.InputDialog.setDialogVisible(visible, params)
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

  setLoading = async (value, content) => {
    this.container.setLoading(value, content)
  }

  renderTool = () => {
    return (
      <ToolBar
        ref={ref => (this.toolBox = ref)}
        user={this.props.user}
        existFullMap={() => this.showFullMap(false)}
        confirmDialog={this.confirm}
        dialog={() => this.dialog}
        showFullMap={this.showFullMap}
        setInputDialogVisible={this.setInputDialogVisible}
        {...this.props}
        setAttributes={this.props.setAttributes}
        measureShow={this.measureShow}
        setContainerLoading={this.setLoading}
        layerList={this.state.layerlist}
        changeLayerList={this.getLayers}
      />
    )
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        style={{
          height: scaleSize(220),
        }}
        opacityStyle={{
          height: scaleSize(220),
        }}
        type={'modal'}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
      >
        <View style={styles.item}>
          {/* <Text style={styles.title}>文本内容</Text> */}
          <TextInput
            underlineColorAndroid={'transparent'}
            accessible={true}
            accessibilityLabel={'文本内容'}
            onChangeText={text => {
              // this.setState({
              //   inputText: text,
              // })
              this.inputText = text
            }}
            // value={this.state.inputText}
            placeholder={
              getLanguage(this.props.language).Prompt.PLEASE_ENTER_TEXT
            }
            // {'请输入文本内容'}
            style={styles.textInputStyle}
          />
        </View>
        {this.state.showErrorInfo && (
          <Text style={styles.placeholder}>
            {getLanguage(this.props.language).Friends.INPUT_INVALID}
          </Text>
        )}
      </Dialog>
    )
  }

  renderInputDialog = () => {
    return <InputDialog ref={ref => (this.InputDialog = ref)} label="名称" />
  }

  measureShow = (value, result) => {
    this.setState({ measureShow: value, measureResult: result })
  }

  renderMeasureLabel = () => {
    return (
      <View style={styles.measureResultContainer}>
        <View style={styles.measureResultView}>
          <Text style={styles.measureResultText}>
            {this.state.measureResult}
          </Text>
        </View>
      </View>
    )
  }

  renderProgress = () => {
    let data
    if (this.props.downloads.length > 0) {
      for (let i = 0; i < this.props.downloads.length; i++) {
        if (this.props.downloads[i].id === GLOBAL.Type) {
          data = this.props.downloads[i]
          break
        }
      }
    }
    if (!data) return <View />
    return (
      <Progress
        ref={ref => (this.mProgress = ref)}
        style={styles.progressView}
        progressAniDuration={0}
        progressColor={color.item_selected_bg}
      />
    )
  }

  renderContainer = () => {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Map_Module.MAP_3D,
          //'三维场景',
          navigation: this.props.navigation,
          backAction: this.back,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          headerRight: (
            <TouchableOpacity
              onPress={() => {
                NavigationService.navigate('PointAnalyst', {
                  type: 'pointSearch',
                })
              }}
              style={styles.moreView}
            >
              <Image
                resizeMode={'contain'}
                source={require('../../../../assets/header/icon_search.png')}
                style={styles.search}
              />
            </TouchableOpacity>
          ),
          type: 'fix',
        }}
        bottomBar={this.renderToolBar()}
        bottomProps={{ type: 'fix' }}
      >
        <SMSceneView style={styles.map} onGetScene={this._onGetInstance} />
        <SurfaceView ref={ref => (GLOBAL.MapSurfaceView = ref)} />
        {this.renderMapController()}
        {this.renderFunctionToolbar()}
        {this.renderOverLayer()}
        {this.renderTool()}
        {this.renderDialog()}
        {this.renderInputDialog()}
        {this.state.measureShow && this.renderMeasureLabel()}
      </Container>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderContainer()}
        {this.renderProgress()}
      </View>
    )
  }
}
