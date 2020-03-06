/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import {
  SMMapView,
  Action,
  SMap,
  SScene,
  SCollector,
  EngineType,
  SMediaCollector,
  SMAIDetectView,
  // SMMapSuspension,
  SAIDetectView,
  SSpeechRecognizer,
} from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import {
  FunctionToolbar,
  AIFunctionToolbar,
  MapToolbar,
  MapController,
  ToolBar,
  MenuAlertDialog,
  AlertDialog,
  OverlayView,
  AnalystMapButtons,
  AnalystMapToolbar,
  PoiInfoContainer,
  PoiTopSearchBar,
  // SimpleSelectList,
  RNLegendView,
  ScaleView,
  IncrementRoadView,
  MapSelectPoint,
  NavigationStartButton,
  NavigationStartHead,
  MapSelectPointButton,
  TrafficView,
  LocationView,
  NavigationPoiView,
  RNFloorListView,
  PreviewHeader,
  PreviewColorPicker,
} from '../../components'
import { ToolbarModule } from '../../components/ToolBar/modules'
import {
  Container,
  MTBtn,
  Dialog,
  SaveMapNameDialog,
  SaveDialog,
  InputDialog,
  PopView,
  SurfaceView,
  // SearchBar,
  Progress,
  BubblePane,
  AudioTopDialog,
} from '../../../../components'
import {
  Toast,
  jsonUtil,
  scaleSize,
  StyleUtils,
  setSpText,
  LayerUtils,
  FetchUtils,
} from '../../../../utils'
import { color } from '../../../../styles'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { FileTools } from '../../../../native'
import {
  ConstPath,
  ConstToolType,
  TouchType,
  ConstInfo,
  getHeaderTitle,
} from '../../../../constants'
import constants from '../../constants'
import NavigationService from '../../../NavigationService'
import { setGestureDetectorListener } from '../../../GestureDetectorListener'
import {
  Platform,
  View,
  Text,
  // InteractionManager,
  Image,
  TouchableOpacity,
} from 'react-native'
import { getLanguage } from '../../../../language/index'
import styles from './styles'
// import { Analyst_Types } from '../../../analystView/AnalystType'
import Orientation from 'react-native-orientation'

const markerTag = 118081
export const HEADER_HEIGHT = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)
export const FOOTER_HEIGHT = scaleSize(88)
export default class MapView extends React.Component {
  static propTypes = {
    language: PropTypes.string,
    nav: PropTypes.object,
    user: PropTypes.object,
    editLayer: PropTypes.object,
    analystLayer: PropTypes.object,
    selection: PropTypes.array,
    latestMap: PropTypes.object,
    navigation: PropTypes.object,
    currentLayer: PropTypes.object,
    template: PropTypes.object,
    mapLegend: PropTypes.object,
    mapNavigation: PropTypes.object,
    map2Dto3D: PropTypes.bool,
    mapScaleView: PropTypes.bool,
    mapIs3D: PropTypes.bool,
    navigationChangeAR: PropTypes.bool,
    navigationPoiView: PropTypes.bool,
    openOnlineMap: PropTypes.bool,
    navigationhistory: PropTypes.array,
    appConfig: PropTypes.object,

    bufferSetting: PropTypes.object,
    overlaySetting: PropTypes.object,
    symbol: PropTypes.object,
    layers: PropTypes.object,
    map: PropTypes.object,
    collection: PropTypes.object,
    device: PropTypes.object,
    online: PropTypes.object,
    analyst: PropTypes.object,
    downloads: PropTypes.array,
    mapSearchHistory: PropTypes.array,
    toolbarStatus: PropTypes.object,

    setEditLayer: PropTypes.func,
    setSelection: PropTypes.func,
    setLatestMap: PropTypes.func,
    setCurrentMap: PropTypes.func,
    setBufferSetting: PropTypes.func,
    setOverlaySetting: PropTypes.func,
    setAnalystLayer: PropTypes.func,
    getLayers: PropTypes.func,
    setCollectionInfo: PropTypes.func,
    setCurrentLayer: PropTypes.func,
    setCurrentAttribute: PropTypes.func,
    getAttributes: PropTypes.func,
    importTemplate: PropTypes.func,
    importWorkspace: PropTypes.func,
    setCurrentTemplateInfo: PropTypes.func,
    setCurrentPlotInfo: PropTypes.func,
    setTemplate: PropTypes.func,
    getMaps: PropTypes.func,
    exportWorkspace: PropTypes.func,
    openWorkspace: PropTypes.func,
    closeWorkspace: PropTypes.func,
    getSymbolTemplates: PropTypes.func,
    getSymbolPlots: PropTypes.func,
    openMap: PropTypes.func,
    closeMap: PropTypes.func,
    saveMap: PropTypes.func,
    getMapSetting: PropTypes.func,
    setSharing: PropTypes.func,
    setCurrentSymbols: PropTypes.func,
    setCurrentSymbol: PropTypes.func,
    clearAttributeHistory: PropTypes.func,
    setMapLegend: PropTypes.func,
    setMapNavigation: PropTypes.func,
    setMap2Dto3D: PropTypes.func,
    setMapIs3D: PropTypes.func,
    setNavigationChangeAR: PropTypes.func,
    setNavigationPoiView: PropTypes.func,
    setBackAction: PropTypes.func,
    removeBackAction: PropTypes.func,
    setAnalystParams: PropTypes.func,
    setMapSearchHistory: PropTypes.func,
    setNavigationHistory: PropTypes.func,
    setOpenOnlineMap: PropTypes.func,
    downloadFile: PropTypes.func,
    deleteDownloadFile: PropTypes.func,
    setToolbarStatus: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = (params && params.type) || GLOBAL.Type || 'LOCAL'
    this.mapType = (params && params.mapType) || 'DEFAULT'
    this.isExample = (params && params.isExample) || false
    this.noLegend = (params && params.noLegend) || false
    this.wsData = params && params.wsData
    this.operationType = params && params.operationType
    this.showMarker = params && params.showMarker
    this.mapTitle = ''
    if (params && params.mapTitle) {
      this.mapTitle = params.mapTitle
    } else if (GLOBAL.Type) {
      this.mapTitle = getHeaderTitle(GLOBAL.Type)
    }

    this.path = (params && params.path) || ''
    this.showDialogCaption =
      params && params.path ? !params.path.endsWith('.smwu') : true
    this.backAction = (params && params.backAction) || null
    this.state = {
      showMap: false, // 控制地图初始化显示
      data: params ? params.data : [],
      popShow: false, //  一级popView显示控制
      popType: '',
      mapTitle: this.mapTitle,
      // wsName: wsName,
      measureShow: false,
      measureResult: 0,
      editLayer: {},
      showMapMenu: false,
      // changeLayerBtnBottom: scaleSize(200),
      canBeUndo: false,
      canBeRedo: false,
      showAIDetect: GLOBAL.Type === constants.MAP_AR,
      showRoadView: true,
      showArModeIcon: true,
      showIncrement: false,
      speechContent: '',
      recording: false,
      isRight: true,
      currentFloorID: '', //导航模块当前楼层id
      showScaleView: false, //是否显示比例尺（地图加载完成后更改值）
      path: '',
      pathLength: '',
    }
    // this.currentFloorID = ''//有坑，id有可能就是‘’
    this.currentFloorID = undefined
    //导航  地图选点界面的搜索按钮被点击,当前设置按钮title
    this.searchClickedInfo = {
      isClicked: false,
      title: '',
    }
    this.closeInfo = [
      {
        btnTitle: '是',
        action: () => {
          this.saveMap(NavigationService.goBack(this.props.nav.routes[1].key))
          //this.saveMapAndClose()
          //this.mapType = 'DEFAULT'
          this.AlertDialog.setDialogVisible(false)
        },
      },
      {
        btnTitle: '否',
        action: () => {
          this.closeWorkspace(() =>
            NavigationService.goBack(this.props.nav.routes[1].key),
          )
          // SMap.closeMap()
          //this.mapType = 'DEFAULT'
          this.AlertDialog.setDialogVisible(false)
        },
      },
      {
        btnTitle: '取消',
        action: () => {
          this.AlertDialog.setDialogVisible(false)
        },
      },
    ]

    this.mapLoaded = false // 判断地图是否加载完成
    this.fullMap = false
    this.analystRecommendVisible = false // 底部分析推荐列表 是否显示
    GLOBAL.showAIDetect = GLOBAL.Type === constants.MAP_AR

    this.selectedDataset = {}
    this.floorHiddenListener = null
  }

  addFloorHiddenListener = () => {
    this.floorHiddenListener = SMap.addFloorHiddenListener(async result => {
      //在选点过程中/路径分析界面 不允许拖放改变FloorList、MapController的状态
      // 使用this.currentFloorID 使ID发生变化时只渲染一次
      if (
        result.currentFloorID !== this.currentFloorID /*&&*/
        // !(
        //   // (GLOBAL.MAPSELECTPOINTBUTTON &&
        //   //   GLOBAL.MAPSELECTPOINTBUTTON.state.show) ||
        //   (GLOBAL.NAVIGATIONSTARTHEAD &&
        //     GLOBAL.NAVIGATIONSTARTHEAD.state.show) ||
        //   GLOBAL.PoiTopSearchBar.state.visible
        // )
      ) {
        this.currentFloorID = result.currentFloorID
        let guideInfo = await SMap.isGuiding()
        if (!guideInfo.isOutdoorGuiding) {
          this.setState(
            {
              currentFloorID: result.currentFloorID,
            },
            () => {
              GLOBAL.ISOUTDOORMAP = !result.currentFloorID
            },
          )
        } else {
          this.currentFloorID = this.state.currentFloorID
        }
      }
    })
  }

  componentDidMount() {
    if (global.isLicenseValid) {
      if (GLOBAL.Type === constants.MAP_NAVIGATION) {
        this.addFloorHiddenListener()
        SMap.setIndustryNavigationListener({
          callback: async () => {
            if (
              GLOBAL.NAV_PARAMS &&
              GLOBAL.NAV_PARAMS.filter(item => !item.hasNaved).length > 0
            ) {
              GLOBAL.changeRouteDialog &&
                GLOBAL.changeRouteDialog.setDialogVisible(true)
            } else {
              this._changeRouteCancel()
            }
          },
        })
        SMap.setStopNavigationListener({
          callback: this._changeRouteCancel,
        })
      }
      this.container &&
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.LOADING,
          //'地图加载中'
        )
      // 动画导致有时不会进入InteractionManager
      // InteractionManager.runAfterInteractions(() => {
      GLOBAL.SaveMapView &&
        GLOBAL.SaveMapView.setTitle(
          getLanguage(this.props.language).Prompt.SAVE_TITLE,
          getLanguage(this.props.language).Prompt.SAVE_YES,
          getLanguage(this.props.language).Prompt.SAVE_NO,
          getLanguage(this.props.language).Prompt.CANCEL,
        )

      this.setState({
        showMap: true,
      })

      this.props.setBackAction({
        key: 'MapView',
        action: () => this.back(),
      })

      SMediaCollector.setCalloutTapListener(info => {
        NavigationService.navigate('MediaEdit', {
          info,
        })
      })

      this.clearData()
      if (this.toolBox) {
        GLOBAL.toolBox = this.toolBox
      }
      // })

      this.addSpeechRecognizeListener()
      if (GLOBAL.language === 'CN') {
        SSpeechRecognizer.setParameter('language', 'zh_cn')
      } else {
        SSpeechRecognizer.setParameter('language', 'en_us ')
      }
    } else {
      global.SimpleDialog.set({
        text: getLanguage(global.language).Prompt.APPLY_LICENSE_FIRST,
        confirmAction: () => NavigationService.goBack(),
        cancelAction: () => NavigationService.goBack(),
      })
      global.SimpleDialog.setVisible(true)
    }
  }

  componentDidUpdate(prevProps) {
    // if (
    //   prevProps.navigation !==
    //   this.props.navigation
    // ) {
    //     this.showFullMap(true)
    // }

    if (
      JSON.stringify(prevProps.mapNavigation) !==
      JSON.stringify(this.props.mapNavigation)
    ) {
      this.showFullMap(this.props.mapNavigation.isShow)
    }
    if (
      JSON.stringify(prevProps.editLayer) !==
        JSON.stringify(this.props.editLayer) &&
      this.props.nav.routes[this.props.nav.index] === 'MapView'
    ) {
      let name = this.props.editLayer ? this.props.editLayer.name : ''
      name && Toast.show('当前可编辑的图层为\n' + name)
    }
    if (
      JSON.stringify(prevProps.currentLayer) !==
      JSON.stringify(this.props.currentLayer)
    ) {
      GLOBAL.currentLayer = this.props.currentLayer
      // this.setState({
      //   currentLayer: this.props.currentLayer,
      // })
    }

    // 防止Toolbar被销毁后，再次添加Toolbar，修改其state失败
    if (this.toolBox) {
      GLOBAL.toolBox = this.toolBox
    }

    // 网络分析模式下
    if (this.props.analyst.params) {
      // 网络分析模式下，设置返回按钮事件
      if (
        JSON.stringify(prevProps.analyst.params) !==
        JSON.stringify(this.props.analyst.params)
      ) {
        this.toolBox &&
          this.toolBox.setVisible(false, null, {
            cb: () => {
              if (
                this.props.analyst.params.type ===
                  ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH ||
                this.props.analyst.params.type ===
                  ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS ||
                this.props.analyst.params.type ===
                  ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH
              ) {
                this.container && this.container.setHeaderVisible(false)
              } else {
                this.mapController && this.mapController.setVisible(false)
              }
              this.container && this.container.setBottomVisible(false)
              if (
                this.props.analyst.params.title &&
                this.props.analyst.params.title !== this.state.mapTitle
              ) {
                this.setState({ mapTitle: this.props.analyst.params.title })
              }
              GLOBAL.TouchType = TouchType.NULL //进入分析页面，触摸事件默认为空
            },
          })
        this.backAction =
          (this.props.analyst.params && this.props.analyst.params.backAction) ||
          null
      }

      // 网络分析模式下，地图控制器 横竖屏切换位置变化
      if (this.props.device.orientation !== prevProps.device.orientation) {
        if (this.analystRecommendVisible) {
          if (this.props.device.orientation === 'LANDSCAPE') {
            this.mapController.reset()
          } else {
            this.mapController.move({ bottom: 200 })
          }
        }
      }
    } else if (prevProps.analyst.params && !this.props.analyst.params) {
      this.backAction = null
      this.container && this.container.setHeaderVisible(true)
      this.container && this.container.setBottomVisible(true)
      if (this.state.mapTitle !== this.mapTitle) {
        this.setState({ mapTitle: this.mapTitle })
      }
    }

    if (
      this.props.device.orientation !== prevProps.device.orientation &&
      this.props.analyst.params
    ) {
      if (this.analystRecommendVisible) {
        if (this.props.device.orientation === 'LANDSCAPE') {
          this.mapController.reset()
        } else {
          this.mapController.move({ bottom: 200 })
        }
      }
    }

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
        if (this.props.downloads[i].id === 'mobilenet_quant_224') {
          data = this.props.downloads[i]
        }
      }
      if (data && this.mProgress) {
        this.mProgress.progress = data.progress / 100
      }
    }

    if (GLOBAL.Type === constants.MAP_NAVIGATION) {
      (async function() {
        let currentFloorID = await SMap.getCurrentFloorID()
        this.changeFloorID(currentFloorID, () => {
          let { params } = this.props.navigation.state
          let preParams = prevProps.navigation.state.params
          if (params.hideMapController && !preParams.hideMapController) {
            this.mapController && this.mapController.setVisible(false)
          }
        })
      }.bind(this)())
      // setTimeout(async () => {
      //   let currentFloorID = await SMap.getCurrentFloorID()
      //   this.changeFloorID(currentFloorID)
      // }, 1000)
    }
    // 显示切换图层按钮
    // if (this.props.editLayer.name && this.popList) {
    //   let bottom = this.popList.state.subPopShow
    //     ? scaleSize(400)
    //     : scaleSize(200)
    //   bottom !== this.state.changeLayerBtnBottom &&
    //     this.setState({
    //       changeLayerBtnBottom: bottom,
    //     })
    // }

    // if (
    //   JSON.stringify(this.props.nav) !== JSON.stringify(prevProps.nav) &&
    //   (
    //     prevProps.nav.routes &&
    //     this.props.nav.routes.length < prevProps.nav.routes.length &&
    //     prevProps.nav.routes[prevProps.nav.routes.length - 1].routeName === 'LayerSelectionAttribute'
    //   ) &&
    //   this.checkMapViewIsUnique()
    // ) {
    //   this.resetMapView()
    // }
  }

  componentWillUnmount() {
    if (GLOBAL.Type === constants.MAP_AR) {
      global.isPad && Orientation.unlockAllOrientations()
    }
    if (GLOBAL.Type === constants.MAP_NAVIGATION) {
      (async function() {
        await SMap.destroySpeakPlugin()
      })()
    }
    if (this.floorHiddenListener) {
      this.floorHiddenListener.remove()
    }
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.navigation.state.routeName,
      })
    }
    // this.props.setMapLegend(false)

    // 移除多媒体采集监听
    SMediaCollector.removeListener()

    // 移除多媒体采集Callout
    GLOBAL.mapView && SMediaCollector.removeMedias()

    this.showMarker && SMap.deleteMarker(markerTag)

    if (GLOBAL.MapTabNavigator) {
      GLOBAL.MapTabNavigator = null
    }

    //移除手势监听
    GLOBAL.mapView && SMap.deleteGestureDetector()
  }

  addSpeechRecognizeListener = () => {
    SSpeechRecognizer.addListenser({
      onBeginOfSpeech: () => {
        this.setState({ speechContent: '', recording: true })
      },
      onEndOfSpeech: () => {
        this.setState({ recording: false })
      },
      onError: e => {
        let error = getLanguage(global.language).Prompt.SPEECH_ERROR
        if (e.indexOf('没有说话') !== -1) {
          error = getLanguage(global.language).Prompt.SPEECH_NONE
        }
        this.setState({ speechContent: error })
      },
      onResult: ({ info }) => {
        this.setState({ speechContent: info }, () => {
          setTimeout(() => {
            try {
              info = info.toLowerCase()
              if (info.indexOf('关闭') !== -1 || info.indexOf('close') !== -1) {
                this.back()
              } else if (
                info.indexOf('定位') !== -1 ||
                info.indexOf('locate') !== -1 ||
                info.indexOf('location') !== -1
              ) {
                (async function() {
                  if (GLOBAL.Type === constants.MAP_3D) {
                    await SScene.setHeading()
                    await SScene.resetCamera()
                    this.mapController.setCompass(0)
                  } else {
                    SMap.moveToCurrent().then(result => {
                      !result &&
                        Toast.show(
                          getLanguage(global.language).Prompt.OUT_OF_MAP_BOUNDS,
                        )
                    })
                  }
                }.bind(this)())
              } else if (
                info.indexOf('放大') !== -1 ||
                info.indexOf('zoom in') !== -1
              ) {
                SMap.zoom(2)
              } else if (
                info.indexOf('缩小') !== -1 ||
                info.indexOf('zoom out') !== -1
              ) {
                SMap.zoom(0.5)
              }
            } catch (e) {
              return
            }
          }, 1000)
        })
      },
    })
  }

  _changeNavRoute = async () => {
    GLOBAL.changeRouteDialog.setDialogVisible(false)
    this.setLoading(true, getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING)
    let curNavInfos = GLOBAL.NAV_PARAMS.filter(item => !item.hasNaved)
    let guideLines = GLOBAL.NAV_PARAMS.filter(item => item.hasNaved)
    await SMap.clearPath()
    let params = JSON.parse(JSON.stringify(curNavInfos[0]))
    params.hasNaved = true
    let { startX, startY, endX, endY, startFloor, endFloor } = params
    try {
      if (params.isIndoor) {
        await SMap.getStartPoint(startX, startY, true, startFloor)
        await SMap.getEndPoint(endX, endY, true, endFloor)
        await SMap.startIndoorNavigation()
        let rel = await SMap.beginIndoorNavigation()
        if (!rel) {
          Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
          this.changeNavPathInfo({ path: '', pathLength: '' })
          this.setLoading(false)
          this._changeRouteCancel()
          return
        }
        for (let item of guideLines) {
          await SMap.addLineOnTrackingLayer(
            { x: item.startX, y: item.startY },
            { x: item.endX, y: item.endY },
          )
        }
        SMap.indoorNavigation(1)
        GLOBAL.CURRENT_NAV_MODE = 'INDOOR'
      } else {
        await SMap.startNavigation(params)
        let result = await SMap.beginNavigation(startX, startY, endX, endY)
        if (result) {
          for (let item of guideLines) {
            await SMap.addLineOnTrackingLayer(
              { x: item.startX, y: item.startY },
              { x: item.endX, y: item.endY },
            )
          }
          SMap.outdoorNavigation(1)
          GLOBAL.CURRENT_NAV_MODE = 'OUTDOOR'
        } else {
          Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
          this.changeNavPathInfo({ path: '', pathLength: '' })
          this.setLoading(false)
          this._changeRouteCancel()
          return
        }
      }
    } catch (e) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
      this.changeNavPathInfo({ path: '', pathLength: '' })
      this.setLoading(false)
      this._changeRouteCancel()
      return
    }
    curNavInfos[0] = params
    GLOBAL.NAV_PARAMS = guideLines.concat(curNavInfos)
    this.changeNavPathInfo({ path: '', pathLength: '' })
    this.setLoading(false)
  }
  //取消切换 清除所有导航信息
  _changeRouteCancel = () => {
    SMap.clearPoint()
    this.showFullMap(false)
    this.props.setMapNavigation({ isShow: false, name: '' })
    GLOBAL.STARTX = undefined
    GLOBAL.STARTY = undefined
    GLOBAL.ENDX = undefined
    GLOBAL.ENDY = undefined
    GLOBAL.TouchType = TouchType.NORMAL
    GLOBAL.CURRENT_NAV_MODE = ''
    GLOBAL.ROUTEANALYST = undefined
    GLOBAL.NAV_PARAMS = []
    GLOBAL.STARTNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_START_POINT
    GLOBAL.ENDNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_DESTINATION
    GLOBAL.mapController && GLOBAL.mapController.changeBottom(false)
  }

  /** 检测MapView在router中是否唯一 **/
  checkMapViewIsUnique = () => {
    let mapViewNums = 0
    if (this.props.nav.routes) {
      for (let i = 0; i < this.props.nav.routes.length; i++) {
        if (
          this.props.nav.routes[i].routeName === 'MapView' ||
          this.props.nav.routes[i].routeName === 'MapTabs'
        ) {
          mapViewNums++
        }
      }
    } else {
      mapViewNums++
    }

    let current = this.props.nav.routes[this.props.nav.routes.length - 1]

    return (
      mapViewNums === 1 &&
      (current.routeName === 'MapView' || current.routeName === 'MapTabs')
    )
  }

  resetMapView = () => {
    this.setState(
      {
        showMap: false,
      },
      () => {
        this.setState({
          showMap: true,
        })
      },
    )
  }

  clearData = () => {
    this.props.setEditLayer(null)
    // this.props.setSelection(null)
    this.props.setBufferSetting(null)
    this.props.setOverlaySetting(null)
    this.props.setAnalystLayer(null)
    this.props.setCollectionInfo() // 置空Redux中Collection中的数据
    this.props.setCurrentTemplateInfo() // 清空当前模板
    this.props.setCurrentPlotInfo() //清空当前模板
    this.props.setTemplate() // 清空模板
  }

  closeWorkspace = (cb = () => {}) => {
    if (!this.map || !this.mapControl || !this.workspace) return
    this.saveLatest(
      async function() {
        this.setLoading(true, '正在关闭', { bgColor: 'white' })
        this.clearData()
        this._removeGeometrySelectedListener()
        this.setLoading(false)
        cb && cb()
      }.bind(this),
    )
  }

  saveLatest = (cb = () => {}) => {
    if (this.isExample) {
      cb()
      return
    }
    try {
      this.mapControl &&
        this.mapControl
          .outputMap({ mapView: this.mapView })
          .then(({ result, uri }) => {
            if (result) {
              this.props.setLatestMap(
                {
                  path: (this.DSParams && this.DSParams.server) || this.path,
                  type: this.type,
                  name: this.mapTitle,
                  image: uri,
                  DSParams: this.DSParams,
                  labelDSParams: this.labelDSParams,
                  layerIndex: this.layerIndex,
                  mapTitle: this.mapTitle,
                },
                cb,
              )
            }
          })
    } catch (e) {
      Toast.show('保存失败')
    }
  }

  _onGetInstance = async mapView => {
    this.mapView = mapView
    this._addMap()
  }

  geometrySelected = async event => {
    this.props.setSelection &&
      this.props.setSelection([
        {
          layerInfo: event.layerInfo,
          ids: [event.id],
        },
      ])
    let currentToolbarType = ToolbarModule.getData().type
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.geometrySelected
    ) {
      ToolbarModule.getData().actions.geometrySelected(event)
      return
    }
    switch (currentToolbarType) {
      case ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT:
      case ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE:
        break
      default:
        // 除了编辑状态，其余点选对象所在图层全设置为选择状态
        if (event.layerInfo.editable) {
          SMap.setLayerEditable(event.layerInfo.path, false).then(() => {
            StyleUtils.setSelectionStyle(event.layerInfo.path)
          })
        } else {
          StyleUtils.setSelectionStyle(event.layerInfo.path)
        }
        break
    }
  }

  geometryMultiSelected = event => {
    let data = []
    for (let i = 0; i < event.geometries.length; i++) {
      if (event.geometries[i].layerInfo.editable) {
        SMap.setLayerEditable(event.geometries[i].layerInfo.path, false)
      }
      StyleUtils.setSelectionStyle(event.geometries[i].layerInfo.path)
      data.push({
        layerInfo: event.geometries[i].layerInfo,
        ids: event.geometries[i].ids,
      })
    }
    this.props.setSelection && this.props.setSelection(data)

    let currentToolbarType = ToolbarModule.getData().type
    switch (currentToolbarType) {
      case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
        SMap.setAction(Action.PAN)
        break
    }
  }

  /** 触摸事件监听 **/
  _addGeometrySelectedListener = async () => {
    await SMap.addGeometrySelectedListener({
      geometrySelected: this.geometrySelected,
      geometryMultiSelected: this.geometryMultiSelected,
    })
  }

  _removeGeometrySelectedListener = async () => {
    await SMap.removeGeometrySelectedListener()
  }

  _removeNavigationListeners = async () => {
    let listeners = []
    if (this.TrafficView && this.TrafficView.listener) {
      listeners.push(this.TrafficView.listener)
    }
    if (this.FloorListView && this.FloorListView.listener) {
      listeners.push(this.FloorListView.listener)
    }
    await SMap.removeFloorHiddenListener(listeners)
  }

  // 导出(保存)工作空间中地图到模块
  saveMapName = (
    mapTitle = '',
    nModule = '',
    addition = {},
    isNew = false,
    cb = () => {},
  ) => {
    try {
      this.setLoading(true, getLanguage(this.props.language).Prompt.SAVING)
      this.props.saveMap({ mapTitle, nModule, addition, isNew }).then(
        result => {
          this.setLoading(false)
          Toast.show(
            result
              ? getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY
              : ConstInfo.MAP_EXIST,
          )
          cb && cb()
        },
        () => {
          this.setLoading(false)
        },
      )
      // SMap.saveMapName(mapTitle, nModule, addition, isNew).then(
      //   result => {
      //     this.setLoading(false)
      //     Toast.show(
      //       result ? ConstInfo.SAVE_MAP_SUCCESS : ConstInfo.MAP_EXIST,
      //     )
      //     cb && cb()
      //   },
      //   () => {
      //     this.setLoading(false)
      //   },
      // )
    } catch (e) {
      this.setLoading(false)
    }
  }

  // 地图保存
  saveMap = (name = '', cb = () => {}) => {
    try {
      this.setLoading(true, getLanguage(this.props.language).Prompt.SAVING)
      //'正在保存地图')
      SMap.saveMap(name).then(result => {
        this.setLoading(false)
        Toast.show(
          result
            ? getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY
            : ConstInfo.MAP_EXIST,
        )
        cb && cb()
      })
    } catch (e) {
      this.setLoading(false)
    }
  }

  // 地图另存为
  saveAsMap = (name = '') => {
    try {
      let addition = {}
      if (this.props.map.currentMap.Template) {
        addition.Template = this.props.map.currentMap.Template
      }
      this.saveMapName(name, '', addition, true)
    } catch (e) {
      this.setLoading(false)
    }
  }

  // 地图保存为xml(fileName, cb)
  saveMapToXML = mapTitle => {
    this.setLoading(true, '正在保存')
    ;(async function() {
      try {
        const filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapTitle +
          '.xml'
        let config = await jsonUtil.readConfig()
        SMap.saveMapToXML(filePath).then(result => {
          if (!result) {
            Toast.show('保存失败')
            this.setLoading(false)
          } else {
            Toast.show('保存成功')
            this.setLoading(false)
            //获取数据源
            //修改数据
            SMap.getMapDatasourcesAlias().then(dataSourceAlias => {
              let data = []
              for (let i = 0; i < dataSourceAlias.length; i++) {
                data[i] = dataSourceAlias[i].title
              }

              for (let i = 0; i < config.data[0].maps.length; i++) {
                if (config.data[0].maps[i].mapTitle === mapTitle + '.xml') {
                  config.data[0].maps[i].UDBName = data
                  break
                }
              }
              (async function() {
                await jsonUtil.updateMapInfo(config)
              }.bind(this)())
            })
          }
        })
      } catch (e) {
        Toast.show('保存失败')
        this.saveXMLDialog.setDialogVisible(false)
        this.setLoading(false)
      }
    }.bind(this)())
  }

  // 地图保存为xml(fileName, cb)
  saveMapToXMLWithDialog = ({ mapTitle }) => {
    // this.setLoading(true, '正在保存')
    (async function() {
      try {
        const filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapTitle +
          '.xml'
        let config = await jsonUtil.readConfig()
        SMap.saveMapToXML(filePath).then(result => {
          if (!result) {
            Toast.show('保存失败')
            this.saveXMLDialog.setDialogVisible(false)
            // this.setLoading(false)
          } else {
            Toast.show('保存成功')
            this.saveXMLDialog.setDialogVisible(false)
            // this.setLoading(false)
            this.mapType = 'LOAD'
            //获取数据源
            SMap.getMapDatasourcesAlias().then(dataSourceAlias => {
              let data = []
              for (let i = 0; i < dataSourceAlias.length; i++) {
                data[i] = dataSourceAlias[i].title
              }

              jsonUtil.saveMapInfo(config, mapTitle, data)
            })
          }
        })
      } catch (e) {
        Toast.show('保存失败')
        this.saveXMLDialog.setDialogVisible(false)
        // this.setLoading(false)
      }
    }.bind(this)())
  }

  // 地图保存
  saveMapWithNoWorkspace = async () => {
    SMap.isModified().then(result => {
      if (result) {
        //有修改
        if (this.mapType === 'DEFAULT' || this.mapType === 'CREATE') {
          //默认地图和创建地图
          //输入地图名字，弹出保存框
          this.saveXMLDialog.setDialogVisible(true)
        } else {
          try {
            (async function() {
              let mapTitle = await SMap.getMapName()
              await this.saveMapToXML(mapTitle)
            }.bind(this)())
          } catch (e) {
            Toast.show('保存失败')
          }
        }
      }
    })
  }

  // 地图保存为xml 同时 关闭地图
  saveMapToXMLAndClose = () => {
    // this.setLoading(true, '正在保存')
    (async function() {
      try {
        let mapTitle = await SMap.getMapName()
        const filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapTitle +
          '.xml'
        let config = await jsonUtil.readConfig()

        SMap.saveMapToXML(filePath).then(result => {
          if (!result) {
            Toast.show('保存失败')
            this.saveMapDialog.setDialogVisible(false)
            this.setLoading(false)
          } else {
            Toast.show('保存成功')
            this.setLoading(false)
            this.saveMapDialog.setDialogVisible(false)
            //获取数据源
            //修改数据
            SMap.getMapDatasourcesAlias().then(dataSourceAlias => {
              let data = []
              for (let i = 0; i < dataSourceAlias.length; i++) {
                data[i] = dataSourceAlias[i].title
              }

              jsonUtil.saveMapInfo(config, mapTitle, data)
            })
          }
        })
      } catch (e) {
        Toast.show('保存失败')
        this.saveMapDialog.setDialogVisible(false)
        this.setLoading(false)
      }
    }.bind(this)())
  }

  // 地图保存 同时 关闭地图
  saveMapAndClose = () => {
    this.container.setLoading(
      true,
      getLanguage(this.props.language).Prompt.SAVING,
    )
    ;(async function() {
      try {
        let mapTitle = await SMap.getMapName()
        const filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapTitle +
          '.xml'
        let config = await jsonUtil.readConfig()

        SMap.saveMapToXML(filePath).then(result => {
          if (!result) {
            Toast.show('保存失败')
            this.AlertDialog.setDialogVisible(false)
            this.setLoading(false)
          } else {
            Toast.show(
              getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY,
            )
            this.container.setLoading(false)
            this.AlertDialog.setDialogVisible(false)
            //获取数据源
            //修改数据
            SMap.getMapDatasourcesAlias().then(dataSourceAlias => {
              let data = []
              for (let i = 0; i < dataSourceAlias.length; i++) {
                data[i] = dataSourceAlias[i].title
              }

              for (let i = 0; i < config.data[0].maps.length; i++) {
                if (config.data[0].maps[i].mapTitle === mapTitle + '.xml') {
                  config.data[0].maps[i].UDBName = data
                  break
                }
              }
              SMap.closeMap()
              ;(async function() {
                await jsonUtil.updateMapInfo(config)
              }.bind(this)())
            })
          }
        })
      } catch (e) {
        Toast.show('保存失败')
        this.AlertDialog.setDialogVisible(false)
        this.setLoading(false)
      }
    }.bind(this)())
  }

  // 删除图层中指定对象
  removeObject = () => {
    (async function() {
      try {
        if (!this.props.selection || !this.props.selection.length === 0) return

        let result = true
        this.props.selection.forEach(async item => {
          if (item.ids.length > 0) {
            result =
              result &&
              (await SCollector.removeByIds(item.ids, item.layerInfo.path))
          }
        })

        if (result) {
          Toast.show(getLanguage(this.props.language).Prompt.DELETED_SUCCESS)
          this.props.setSelection && this.props.setSelection()
          SMap.setAction(Action.SELECT)
          // 删除对象后，编辑设为为选择状态
          this.toolBox.setVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
            isFullScreen: false,
            height: 0,
          })
        } else {
          Toast.show('删除失败')
        }
        GLOBAL.removeObjectDialog &&
          GLOBAL.removeObjectDialog.setDialogVisible(false)
      } catch (e) {
        Toast.show('删除失败')
      }
    }.bind(this)())
  }

  renderHeaderBtns = () => {
    if (this.isExample) return null
    let arr = []
    let headerBtnData = [
      {
        key: 'search',
        image: require('../../../../assets/header/Frenchgrey/icon_search.png'),
        action: () => {
          this.toolBox.setVisible(true, 'list')
        },
      },
      {
        key: 'audio',
        image: require('../../../../assets/header/Frenchgrey/icon_audio.png'),
        action: () => {
          this.toolBox.setVisible(true, 'table')
        },
      },
    ]
    headerBtnData.forEach(({ key, image, action }) => {
      arr.push(
        <MTBtn
          key={key}
          textColor={'white'}
          size={MTBtn.Size.SMALL}
          image={image}
          onPress={action}
        />,
      )
    })
    return arr
  }

  back = () => {
    if (!this.mapLoaded) return
    // 优先处理其他界面跳转到MapView传来的返回事件
    if (this.backAction && typeof this.backAction === 'function') {
      this.backAction()
      this.backAction = null
      this.mapController && this.mapController.reset()
      return
    }

    this.props.setMap2Dto3D(false)

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

    if (global.coworkMode) {
      // NavigationService.navigate('CoworkChat')
      NavigationService.navigate('Chat')
      return true
    }

    // this.backAction = async () => {
    //   try {
    //     this.setLoading(
    //       true,
    //       getLanguage(this.props.language).Prompt.CLOSING,
    //       //'正在关闭地图'
    //     )
    //     await this.props.closeMap()
    //     GLOBAL.clearMapData()
    //     this.setLoading(false)
    //     NavigationService.goBack()
    //   } catch (e) {
    //     this.setLoading(false)
    //   }
    // }
    SMap.mapIsModified().then(async result => {
      if (result && !this.isExample) {
        this.setSaveViewVisible(true, null, async () => {
          this._removeGeometrySelectedListener()
          if (GLOBAL.Type === constants.MAP_NAVIGATION) {
            await this._removeNavigationListeners()
          }
        })
      } else {
        try {
          this.setLoading(
            true,
            getLanguage(this.props.language).Prompt.CLOSING,
            //'正在关闭地图'
          )
          if (GLOBAL.Type === constants.MAP_NAVIGATION) {
            await this._removeNavigationListeners()
            await SMap.clearPoint()
            await SMap.stopGuide()
            this.props.setMap2Dto3D(false)
          }
          await this.props.closeMap()
          await this._removeGeometrySelectedListener()
          GLOBAL.Type = null
          GLOBAL.clearMapData()
          this.setLoading(false)
          NavigationService.goBack()
        } catch (e) {
          this.setLoading(false)
        }
      }
    })
    this.props.setCurrentAttribute({})
    this.setState({ showScaleView: false })
    // this.props.getAttributes({})
    return true
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  _addMap = () => {
    (async function() {
      try {
        // if (this.wsData === null || this.wsData === undefined) {
        //   this.setLoading(false)
        //   return
        // }

        let hasMap = false // 判断是否打开了地图，若打开了地图，加载完成后先保存在MapControl中
        if (this.wsData) {
          if (this.wsData instanceof Array) {
            for (let i = 0; i < this.wsData.length; i++) {
              let item = this.wsData[i]
              if (item === null) continue
              if (item.type === 'Workspace') {
                await this._openWorkspace(
                  this.wsData[i],
                  this.wsData[i].layerIndex,
                )
              } else if (item.type === 'Datasource') {
                await this._openDatasource(
                  this.wsData[i],
                  this.wsData[i].layerIndex,
                )
              } else if (item.type === 'Map') {
                await this._openMap(this.wsData[i])
                hasMap = true
              }
              // else if (item.type === 'LastMap') {
              //   // 打开最近地图
              //   // this.toolBox && this.toolBox.changeMap(this.wsData.DSParams)
              //   await this._openLatestMap(this.wsData[i].DSParams)
              // }
            }
          } else {
            if (this.wsData.type === 'Workspace') {
              await this._openWorkspace(this.wsData, this.wsData.layerIndex)
            } else if (this.wsData.type === 'Datasource') {
              await this._openDatasource(this.wsData, this.wsData.layerIndex)
            } else if (this.wsData.type === 'Map') {
              await this._openMap(this.wsData)
              hasMap = true
            }
            // else if (this.wsData.type === 'LastMap') {
            //   // 打开最近地图
            //   // this.toolBox && this.toolBox.changeMap(this.wsData.DSParams)
            //   await this._openLatestMap(this.wsData.DSParams)
            // }
          }
        } else {
          // 若无参数，打开默认工作空间。分析模块使用
          let homePath = await FileTools.appendingHomeDirectory()
          let userPath = ConstPath.CustomerPath
          if (
            this.props.user.currentUser &&
            this.props.user.currentUser.userName
          ) {
            userPath =
              ConstPath.UserPath + this.props.user.currentUser.userName + '/'
          }
          let wsPath =
            homePath +
            userPath +
            ConstPath.RelativeFilePath.Workspace[
              global.language === 'CN' ? 'CN' : 'EN'
            ]
          await this._openWorkspace({
            DSParams: { server: wsPath },
          })
        }

        if (GLOBAL.Type === constants.MAP_PLOTTING) {
          this.setLoading(
            true,
            //ConstInfo.TEMPLATE_READING
            getLanguage(this.props.language).Prompt.READING_TEMPLATE,
          )
          let plotIconPath = await FileTools.appendingHomeDirectory(
            ConstPath.UserPath +
              this.props.user.currentUser.userName +
              '/' +
              ConstPath.RelativePath.Plotting +
              'PlotLibData',
          )
          this.props.getSymbolPlots(
            {
              path: plotIconPath,
              isFirst: true,
            },
            () => {
              GLOBAL.isInitSymbolPlotsEnd = true
              this.props.getLayers()
            },
          )
          GLOBAL.newPlotMapName = ''
        }

        // GLOBAL.Type === constants.MAP_COLLECTION && this.initCollectorDatasource()
        // 获取图层列表
        this.props.getLayers(
          { type: -1, currentLayerIndex: 0 },
          async layers => {
            if (!this.wsData) return
            // 若数据源已经打开，图层未加载，则去默认加载一个图层
            if (layers.length === 0) {
              let result = false
              if (this.wsData instanceof Array) {
                for (let i = 0; i < this.wsData.length; i++) {
                  let item = this.wsData[i]
                  if (item === null) continue
                  if (item.type === 'Datasource') {
                    result = await SMap.addLayer(item.DSParams.alias, 0)
                  }
                }
              } else if (this.wsData.type === 'Datasource') {
                result = await SMap.addLayer(this.wsData.DSParams.alias, 0)
              }
              result && this.props.getLayers()
            }
            if (layers.length === 0 && this.wsData.DSParams) {
              SMap.addLayer(this.wsData.DSParams.alias, 0).then(result => {
                result && this.props.getLayers()
              })
            }
          },
        )

        // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
        SMap.getTaggingLayers(this.props.user.currentUser.userName).then(
          dataList => {
            dataList.forEach(item => {
              if (item.isVisible) {
                SMediaCollector.showMedia(item.name)
              }
            })
          },
        )

        this.mapLoaded = true
        this._addGeometrySelectedListener()

        setGestureDetectorListener({
          getNavigationDatas: this.getNavigationDatas,
          ...this.props,
        })
        GLOBAL.TouchType = TouchType.NORMAL

        await SMap.openTaggingDataset(this.props.user.currentUser.userName)

        GLOBAL.TaggingDatasetName = await SMap.getDefaultTaggingDataset(
          this.props.user.currentUser.userName,
        )

        //地图打开后显示比例尺，获取图例数据
        this.setState({ showScaleView: true })
        GLOBAL.legend && GLOBAL.legend.getLegendData()

        this.showMarker &&
          SMap.showMarker(
            this.showMarker.longitude,
            this.showMarker.latitude,
            markerTag,
          )
        if (
          GLOBAL.Type === constants.MAP_COLLECTION ||
          GLOBAL.Type === constants.MAP_PLOTTING
        ) {
          SMap.setIsMagnifierEnabled(true)
        } else {
          SMap.setIsMagnifierEnabled(false)
        }
        SMap.setPOIOptimized(true)
        if (GLOBAL.Type === constants.MAP_NAVIGATION) {
          this.props.setMap2Dto3D(true)
          this.props.setMapNavigation({ isShow: false, name: '' })
          let currentFloorID = await SMap.getCurrentFloorID()
          this.changeFloorID(currentFloorID)
          await SMap.initSpeakPlugin()
          GLOBAL.STARTNAME = getLanguage(
            GLOBAL.language,
          ).Map_Main_Menu.SELECT_START_POINT
          GLOBAL.ENDNAME = getLanguage(
            GLOBAL.language,
          ).Map_Main_Menu.SELECT_DESTINATION
        }

        if (hasMap) await SMap.saveMap('', false, false)
        this.setLoading(false)
      } catch (e) {
        this.setLoading(false)
        this.mapLoaded = true
      }
    }.bind(this)())
  }

  _openWorkspace = async (wsData, index = -1) => {
    if (!wsData.DSParams || !wsData.DSParams.server) {
      this.setLoading(false)
      Toast.show('没有找到地图')
      return
    }
    try {
      // let result = await SMap.openWorkspace(wsData.DSParams)
      let result = await this.props.openWorkspace(wsData.DSParams)
      result && this.props.openMap(index)
    } catch (e) {
      this.setLoading(false)
    }
  }

  _openDatasource = async (wsData, index = -1) => {
    if (!wsData.DSParams || !wsData.DSParams.server) {
      this.setLoading(false)
      Toast.show('没有找到地图')
      return
    }
    try {
      await SMap.openDatasource(wsData.DSParams, index)
    } catch (e) {
      this.setLoading(false)
    }
  }

  _openMap = async data => {
    try {
      let mapInfo = await this.props.openMap({
        path: data.path,
        name: data.name,
      })
      if (mapInfo) {
        // 如果是模板地图，则加载模板
        if (mapInfo.Template && GLOBAL.Type === constants.MAP_COLLECTION) {
          this.setLoading(
            true,
            //ConstInfo.TEMPLATE_READING
            getLanguage(this.props.language).Prompt.READING_TEMPLATE,
          )
          let templatePath = await FileTools.appendingHomeDirectory(
            ConstPath.UserPath + mapInfo.Template,
          )
          await this.props.getSymbolTemplates({
            path: templatePath,
            name: data.name,
          })
        } else {
          await this.props.setTemplate()
        }
        // // 加载图层
        // await this.props.getLayers(-1, layers => {
        //   this.props.setCurrentLayer(layers.length > 0 && layers[0])
        // })
        this.setVisible(false)
      }
    } catch (e) {
      this.setLoading(false)
    }
  }

  /**
   * 初始化采集数据集
   * @returns {Promise.<void>}
   */
  initCollectorDatasource = async () => {
    let collectorDSPath = ''
    let collectorDSName = 'Collection-' + new Date().getTime()
    let initResult = false
    if (this.props.user.currentUser.userName) {
      collectorDSPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
          this.props.user.currentUser.userName +
          '/' +
          ConstPath.RelativePath.Datasource,
      )
    } else {
      collectorDSPath = await FileTools.appendingHomeDirectory(
        ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
      )
    }
    while (!initResult) {
      initResult = await SMap.createDatasource({
        alias: collectorDSName,
        engineType: EngineType.UDB,
        server: collectorDSPath + collectorDSName + '.udb',
      })
      if (!initResult) collectorDSName = 'Collection-' + new Date().getTime()
    }
    this.props.setCollectionInfo({
      datasourceName: collectorDSName,
      datasourceParentPath: collectorDSPath,
      datasourceServer: collectorDSPath + collectorDSName + '.udb',
      datasourceType: EngineType.UDB,
    })
  }

  /**
   * 下方的保存地图提示组建
   * @param visible
   */
  setSaveViewVisible = (visible, setLoading, cb = () => {}) => {
    // this.SaveMapView && this.SaveMapView.setVisible(visible)
    let loadingAction = this.setLoading
    if (setLoading && typeof setLoading === 'function') {
      loadingAction = setLoading
    }
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, loadingAction, cb)
  }

  /**
   * 中间弹出的保存地图组建
   * @param visible
   */
  setSaveMapDialogVisible = visible => {
    this.SaveDialog && this.SaveDialog.setDialogVisible(visible)
  }

  /**
   * 中间弹出的命名框
   * @param visible
   */
  setInputDialogVisible = (visible, params = {}) => {
    this.InputDialog && this.InputDialog.setDialogVisible(visible, params)
  }

  /**
   * 底部工具栏
   * @returns {XML}
   */
  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        appConfig={this.props.appConfig}
        initIndex={0}
        type={this.type}
      />
    )
  }

  /** 地图分析模式左侧按钮 **/
  renderAnalystMapButtons = () => {
    if (
      this.props.analyst.params.type !==
        ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH &&
      this.props.analyst.params.type !==
        ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS &&
      this.props.analyst.params.type !==
        ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH
    )
      return null
    return (
      <AnalystMapButtons
        language={this.props.language}
        type={this.props.analyst.params.type}
      />
    )
  }

  /** 地图分析模式底部推荐地点滑动列表 **/
  // renderAnalystMapRecommend = () => {
  //   return (
  //     <AnalystMapRecommend
  //       ref={ref => this.analystRecommend = ref}
  //       orientation={this.props.device.orientation}
  //       data={[
  //         {
  //           title: '1111',
  //           subTitle: '11111111',
  //         },
  //         {
  //           title: '2222',
  //           subTitle: '2222222',
  //         },
  //         {
  //           title: '3333',
  //           subTitle: '33333333',
  //         },
  //       ]}
  //       language={this.props.language}
  //     />
  //   )
  // }

  /** 地图分析模式底部工具栏 **/
  renderAnalystMapToolbar = () => {
    return (
      <AnalystMapToolbar
        type={this.props.analyst.params.type}
        actionType={this.props.analyst.params.actionType}
        back={() => {
          let action =
            (this.props.analyst.params &&
              this.props.analyst.params.backAction) ||
            null
          action && action()
          if (this.state.mapTitle !== this.mapTitle) {
            this.setState({ mapTitle: this.mapTitle })
          }
          // TODO 不同类型高度修改
          this.toolBox.setVisible(true, ConstToolType.MAP_ANALYSIS, {
            isFullScreen: true,
            height:
              this.props.device.orientation === 'LANDSCAPE'
                ? ConstToolType.TOOLBAR_HEIGHT[2]
                : ConstToolType.TOOLBAR_HEIGHT[3],
            column: this.props.device.orientation === 'LANDSCAPE' ? 5 : 4,
          })
        }}
        setAnalystParams={this.props.setAnalystParams}
        language={this.props.language}
      />
    )
  }

  /** 仅限视频地图工具栏（右侧） **/
  renderAIFunctionToolbar = () => {
    return (
      <AIFunctionToolbar
        ref={ref => (GLOBAL.AIFUNCTIONTOOLBAR = ref)}
        language={this.props.language}
        device={this.props.device}
        user={this.props.user}
        type={this.type}
        getToolRef={() => this.toolBox}
        style={styles.functionToolbar}
        showFullMap={this.showFullMap}
      />
    )
  }

  /** 地图功能工具栏（右侧） **/
  renderFunctionToolbar = () => {
    return (
      <FunctionToolbar
        language={this.props.language}
        ref={ref => (GLOBAL.FUNCTIONTOOLBAR = this.functionToolbar = ref)}
        style={styles.functionToolbar}
        type={this.type}
        getToolRef={() => this.toolBox}
        getMenuAlertDialogRef={() => this.MenuAlertDialog}
        showFullMap={this.showFullMap}
        user={this.props.user}
        map={this.props.map}
        symbol={this.props.symbol}
        getLayers={this.props.getLayers}
        currentLayer={this.props.currentLayer}
        addGeometrySelectedListener={this._addGeometrySelectedListener}
        removeGeometrySelectedListener={this._removeGeometrySelectedListener}
        device={this.props.device}
        setMapType={this.setMapType}
        online={this.props.online}
        setMap2Dto3D={this.props.setMap2Dto3D}
        openOnlineMap={this.props.openOnlineMap}
        mapModules={this.props.appConfig.mapModules}
        save={() => {
          //this.saveMapWithNoWorkspace()
        }}
        saveAs={() => {
          //弹出保存框
          //this.saveXMLDialog.setDialogVisible(true)
        }}
        closeOneMap={() => {
          //弹出关闭选项
          //SMap.isModified().then(result =>{
          //  if(result){
          //    if(this.mapType === 'LOAD')
          //      this.AlertDialog.setDialogVisible(true)
          //    else
          //      this.saveMapDialog.setDialogVisible(true)
          //  }
          //})
        }}
      />
    )
  }

  renderPreviewHeader = () => {
    return (
      <PreviewHeader
        ref={ref => (GLOBAL.PreviewHeader = ref)}
        navigation={this.props.navigation}
        language={this.props.language}
      />
    )
  }
  renderPreviewColorPicker = () => {
    return (
      <PreviewColorPicker
        ref={ref => (GLOBAL.PreviewColorPicker = ref)}
        navigation={this.props.navigation}
        device={this.props.device}
        language={this.props.language}
      />
    )
  }
  //遮盖层
  renderOverLayer = () => {
    return <OverlayView ref={ref => (GLOBAL.OverlayView = ref)} />
  }

  /** 地图控制器，放大缩小等功能 **/
  renderMapController = () => {
    if (this.state.currentFloorID) return null
    return (
      <MapController
        ref={ref => (GLOBAL.mapController = this.mapController = ref)}
        type={GLOBAL.Type}
      />
    )
  }

  /** 显示全屏 **/
  showFullMap = isFull => {
    if (isFull === this.fullMap) return
    let full = isFull === undefined ? !this.fullMap : !isFull
    this.container && this.container.setHeaderVisible(full)
    this.container && this.container.setBottomVisible(full)
    this.functionToolbar && this.functionToolbar.setVisible(full)
    this.mapController && this.mapController.setVisible(full)
    this.TrafficView && this.TrafficView.setVisible(full)
    if (
      !(
        !full &&
        GLOBAL.Type === constants.MAP_NAVIGATION &&
        this.FloorListView.state.currentFloorID
      )
    ) {
      GLOBAL.scaleView && GLOBAL.scaleView.showFullMap(full)
    }
    this.setState({ showArModeIcon: full })
    this.fullMap = !full
  }

  /** 显示量算结果 **/
  showMeasureResult = (isShow, result = '') => {
    if (
      isShow !== this.state.measureShow ||
      isShow !== this.state.measureResult
    ) {
      this.setState({
        measureShow: isShow,
        measureResult: isShow ? result : '',
      })
    } else {
      this.setState({
        measureResult: '',
      })
    }
  }

  /** 展示撤销Modal **/
  showUndoView = () => {
    (async function() {
      this.popModal && this.popModal.setVisible(true)
      let historyCount = await SMap.getMapHistoryCount()
      let currentHistoryCount = await SMap.getMapHistoryCurrentIndex()
      this.setState({
        canBeUndo: currentHistoryCount >= 0,
        canBeRedo: currentHistoryCount < historyCount - 1,
      })
    }.bind(this)())
  }

  //多媒体采集
  captureImage = params => {
    //保存数据->跳转
    (async function() {
      let currentLayer = this.props.currentLayer
      // let reg = /^Label_(.*)#$/
      let isTaggingLayer = false
      if (currentLayer) {
        let layerType = LayerUtils.getLayerType(currentLayer)
        isTaggingLayer = layerType === 'TAGGINGLAYER'
        // isTaggingLayer = currentLayer.type === DatasetType.CAD
        // && currentLayer.datasourceAlias.match(reg)
      }
      if (isTaggingLayer) {
        const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
        const datasetName = currentLayer.datasetName // 标注图层名称
        let targetPath = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativeFilePath.Media,
        )
        SMediaCollector.initMediaCollector(targetPath)

        let result = await SMediaCollector.addArMedia({
          datasourceName: datasourceAlias,
          datasetName: datasetName,
          mediaName: params.mediaName,
        })
        if (result) {
          this.switchAr()
          Toast.show(
            params.mediaName +
              ':' +
              getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY,
          )
        }
      } else {
        Toast.show(
          getLanguage(this.props.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
        )
        this.props.navigation.navigate('LayerManager')
        await SAIDetectView.clearClickAIRecognition()
      }
    }.bind(this)())
  }

  _onArObjectClick = data => {
    if (GLOBAL.Type === constants.MAP_AR) {
      let params = {
        ID: data.id,
        mediaName: data.name,
        Info: data.info,
      }
      // Toast.show(data.name + ', ' + data.info + ', ' + data.id)
      this.showFullMap(false)
      GLOBAL.toolBox.setVisible(false)
      GLOBAL.AIDETECTCHANGE.setVisible(false)
      this.captureImage(params)
    }
  }

  renderMenuDialog = () => {
    return (
      <MenuAlertDialog
        ref={ref => (this.MenuAlertDialog = ref)}
        backHide="true"
        existFullMap={() => this.showFullMap(false)}
        showFullMap={this.showFullMap}
        getToolBarRef={() => this.toolBox}
      />
    )
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

  /** 改变地图存储类型 是否有本地XML文件 **/
  setMapType = mapType => {
    this.mapType = mapType
  }

  //设置室外导航数据集和模型文件
  setNavigationDatas = params => {
    this.selectedDataset = params
  }

  getNavigationDatas = () => {
    return this.selectedDataset
  }

  //楼层控件
  _getFloorListView = () => {
    return this.FloorListView || null
  }

  renderTool = () => {
    return (
      <ToolBar
        ref={ref => (GLOBAL.ToolBar = this.toolBox = ref)}
        getFloorListView={this._getFloorListView}
        language={this.props.language}
        changeNavPathInfo={this.changeNavPathInfo}
        changeFloorID={this.changeFloorID}
        setNavigationDatas={this.setNavigationDatas}
        getNavigationDatas={this.getNavigationDatas}
        existFullMap={() => this.showFullMap(false)}
        getMenuAlertDialogRef={() => this.MenuAlertDialog}
        addGeometrySelectedListener={this._addGeometrySelectedListener}
        removeGeometrySelectedListener={this._removeGeometrySelectedListener}
        showFullMap={this.showFullMap}
        setSaveViewVisible={this.setSaveViewVisible}
        setSaveMapDialogVisible={this.setSaveMapDialogVisible}
        setContainerLoading={this.setLoading}
        setInputDialogVisible={this.setInputDialogVisible}
        showMeasureResult={this.showMeasureResult}
        switchAr={this.switchAr}
        {...this.props}
      />
    )
  }

  cancel = () => {
    GLOBAL.dialog.setDialogVisible(false)
  }

  confirm = () => {
    (async function() {
      let result = await SMap.setDynamicProjection()
      if (result) {
        GLOBAL.dialog.setDialogVisible(false)
      }
    }.bind(this)())
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (GLOBAL.dialog = ref)}
        confirmAction={this.confirm}
        cancelAction={this.cancel}
        //title={'提示'}
        style={styles.dialogStyle}
        opacityStyle={styles.dialogStyle}
        info={getLanguage(this.props.language).Prompt.ENABLE_DYNAMIC_PROJECTION}
        //{'是否开启动态投影？'}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.TURN_ON}
        //{'是'}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.NO}
        //{'否'}
      />
    )
  }

  renderEditControllerView = () => {
    return (
      <View style={[styles.editControllerView, { width: '100%' }]}>
        <MTBtn
          key={'undo'}
          title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_UNDO}
          //{'撤销'}
          style={styles.button}
          textColor={!this.state.canBeUndo && color.contentColorGray}
          image={
            this.state.canBeUndo
              ? getThemeAssets().publicAssets.icon_undo
              : getPublicAssets().attribute.icon_undo_disable
          }
          imageStyle={styles.headerBtn}
          onPress={() => {
            if (!this.state.canBeUndo) return
            ;(async function() {
              await SMap.undo()
              let historyCount = await SMap.getMapHistoryCount()
              let currentHistoryCount = await SMap.getMapHistoryCurrentIndex()
              this.setState({
                canBeUndo: currentHistoryCount >= 0,
                canBeRedo: currentHistoryCount < historyCount - 1,
              })
            }.bind(this)())
          }}
        />
        <MTBtn
          key={'redo'}
          title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_REDO}
          //{'恢复'}
          style={styles.button}
          textColor={!this.state.canBeRedo && color.contentColorGray}
          image={
            this.state.canBeRedo
              ? getThemeAssets().publicAssets.icon_redo
              : getPublicAssets().attribute.icon_redo_disable
          }
          imageStyle={styles.headerBtn}
          onPress={() => {
            if (!this.state.canBeRedo) return
            ;(async function() {
              await SMap.redo()
              let historyCount = await SMap.getMapHistoryCount()
              let currentHistoryCount = await SMap.getMapHistoryCurrentIndex()
              this.setState({
                canBeUndo: currentHistoryCount >= 0,
                canBeRedo: currentHistoryCount < historyCount - 1,
              })
            }.bind(this)())
          }}
        />
        {/*<MTBtn*/}
        {/*key={'revert'}*/}
        {/*title={'还原'}*/}
        {/*style={styles.button}*/}
        {/*image={getThemeAssets().publicAssets.icon_revert}*/}
        {/*imageStyle={styles.headerBtn}*/}
        {/*onPress={() => SMap.addMapHistory()}*/}
        {/*/>*/}
        <View style={styles.button} />
        <View style={styles.button} />
      </View>
    )
  }

  // //网络数据集和模型文件选择
  // showModelList = async () => {
  //   // let hasNetworkDataset = await SMap.hasNetworkDataset()
  //   // if (!hasNetworkDataset) {
  //   //   Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK_DATASETS)
  //   //   return
  //   // }
  //   // let popView = this.selectList
  //   // let simpleList = GLOBAL.SimpleSelectList
  //   // if (simpleList.renderType !== 'navigation') {
  //   //   if (simpleList.state.navigationData.length === 0) {
  //   //     let path =
  //   //       (await FileTools.appendingHomeDirectory(
  //   //         this.props.user && this.props.user.currentUser.userName
  //   //           ? ConstPath.UserPath + this.props.user.currentUser.userName + '/'
  //   //           : ConstPath.CustomerPath,
  //   //       )) + ConstPath.RelativePath.Datasource
  //   //     let datasources = await SMap.getNetworkDatasource()
  //   //     let models = await FileTools.getNetModel(path)
  //   //     models = models.map(item => {
  //   //       item.checked = false
  //   //       return item
  //   //     })
  //   //     let navigationData = [
  //   //       {
  //   //         title: getLanguage(this.props.language).Map_Settings.DATASOURCES,
  //   //         visible: true,
  //   //         image: require('../../../../assets/mapToolbar/list_type_udb_black.png'),
  //   //         data: datasources || [],
  //   //       },
  //   //       {
  //   //         title: getLanguage(this.props.language).Map_Main_Menu
  //   //           .NETWORK_MODEL_FILE,
  //   //         visible: true,
  //   //         image: getThemeAssets().functionBar.rightbar_network_model,
  //   //         data: models || [],
  //   //       },
  //   //     ]
  //   //     simpleList.setState({
  //   //       navigationData,
  //   //       renderType: 'navigation',
  //   //     })
  //   //   } else {
  //   //     simpleList.setState({
  //   //       renderType: 'navigation',
  //   //     })
  //   //   }
  //   // }
  //   //
  //   // this.showFullMap(true)
  //   // popView.setVisible(true)
  // }

  //导航地图 模型、路网弹窗 数据在点击模型按钮时获取一次 切换地图时清空
  // renderNetworkSelectList = () => {
  //   return (
  //     <SimpleSelectList
  //       ref={ref => (GLOBAL.SimpleSelectList = this.SimpleSelectList = ref)}
  //       showFullMap={this.showFullMap}
  //       language={this.props.language}
  //       confirmAction={() => {
  //         this.selectList.setVisible(false)
  //         this.showFullMap(false)
  //         let selectList = GLOBAL.SimpleSelectList
  //         let { networkModel, networkDataset } = selectList.state
  //         if (networkModel && networkDataset) {
  //           SMap.startNavigation(networkDataset.datasetName, networkModel.path)
  //           NavigationService.navigate('NavigationView', {
  //             changeNavPathInfo: this.changeNavPathInfo,
  //             showLocationView: true,
  //           })
  //         }
  //       }}
  //     />
  //   )
  // }

  renderSearchBar = () => {
    return null
    // if (!this.props.analyst.params) return null
    // return (
    //   <SearchBar
    //     ref={ref => (this.searchBar = ref)}
    //     onSubmitEditing={searchKey => {
    //       this.setLoading(true, getLanguage(global.language).Prompt.SEARCHING)
    //       this.search(searchKey)
    //     }}
    //     placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
    //     //{'请输入搜索关键字'}
    //   />
    // )
  }

  renderHeaderRight = () => {
    if (this.isExample || this.props.analyst.params) return null
    // if (this.props.analyst.params) {
    //   return [
    //     <TextBtn
    //       key={'analyst'}
    //       btnText={getLanguage(this.props.language).Analyst_Labels.ANALYST}
    //       textStyle={styles.headerBtnTitle}
    //       btnClick={() => {
    //         if (this.props.analyst.params) {
    //           // this.analystRecommendVisible = !this.analystRecommendVisible
    //           // this.analystRecommend.setVisible(this.analystRecommendVisible)
    //           // if (this.props.device.orientation !== 'LANDSCAPE') {
    //           //   if (this.analystRecommendVisible) {
    //           //     this.mapController.move({ bottom: 200 })
    //           //   } else {
    //           //     this.mapController.reset()
    //           //   }
    //           // }
    //           // return
    //         }
    //       }}
    //     />,
    //   ]
    // }
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {this.state.showAIDetect ? (
          <View />
        ) : (
          <TouchableOpacity
            key={'audio'}
            onPress={() => {
              SSpeechRecognizer.start()
              this.AudioDialog.setVisible(true)
            }}
          >
            <Image
              resizeMode={'contain'}
              source={require('../../../../assets/header/icon_audio.png')}
              style={[
                { width: scaleSize(50), height: scaleSize(50) },
                { marginRight: scaleSize(15) },
              ]}
            />
          </TouchableOpacity>
        )}
        <MTBtn
          key={'undo'}
          image={getPublicAssets().common.icon_undo}
          imageStyle={[styles.headerBtn, { marginRight: scaleSize(15) }]}
          onPress={this.showUndoView}
        />
        <TouchableOpacity
          key={'search'}
          onPress={async () => {
            if (GLOBAL.Type === constants.MAP_NAVIGATION) {
              let layers =
                this.props.getLayers && (await this.props.getLayers())
              let baseMap = layers.filter(layer =>
                LayerUtils.isBaseLayer(layer.name),
              )[0]
              if (baseMap && baseMap.name !== 'baseMap' && baseMap.isVisible) {
                NavigationService.navigate('PointAnalyst', {
                  type: 'pointSearch',
                })
                this.changeFloorID('')
              } else {
                Toast.show(
                  getLanguage(this.props.language).Prompt
                    .PLEASE_SET_BASEMAP_VISIBLE,
                )
              }
            } else {
              NavigationService.navigate('PointAnalyst', {
                type: 'pointSearch',
              })
            }
          }}
        >
          <Image
            resizeMode={'contain'}
            source={require('../../../../assets/header/icon_search.png')}
            style={styles.search}
          />
        </TouchableOpacity>
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
        if (this.props.downloads[i].id === 'mobilenet_quant_224') {
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

  /** 切换ar和地图浏览 **/
  switchAr = () => {
    if (this.state.showAIDetect) {
      // SMapSuspension.closeMap()
      // GLOBAL.SMMapSuspension && GLOBAL.SMMapSuspension.setVisible(false)
      this.setState({
        showAIDetect: false,
      })
      GLOBAL.showAIDetect = false
    } else {
      this.setState({
        showAIDetect: true,
      })
      GLOBAL.showAIDetect = true
    }
  }

  _renderArModeIcon = () => {
    return (
      <View style={styles.btnView} ref={ref => (GLOBAL.ArModeIcon = ref)}>
        <MTBtn
          style={styles.iconAr}
          size={MTBtn.Size.NORMAL}
          image={getThemeAssets().ar.switch_ar_light}
          onPress={this.switchAr}
          activeOpacity={0.5}
          // separator={scaleSize(2)}
        />
      </View>
    )
  }

  _renderLocationIcon = () => {
    return (
      <LocationView
        getNavigationDatas={this.getNavigationDatas}
        ref={ref => (GLOBAL.LocationView = ref)}
      />
    )
  }

  _renderNavigationIcon = () => {
    let title = getLanguage(this.props.language).Map_Main_Menu.DRAW
    return (
      <View style={styles.navigation}>
        <MTBtn
          style={styles.iconNav}
          size={MTBtn.Size.NORMAL}
          title={title}
          textColor={'black'}
          textStyle={{ fontSize: setSpText(12) }}
          image={require('../../../../assets/Navigation/navi_icon.png')}
          onPress={async () => {
            this._incrementRoad()
          }}
          activeOpacity={0.5}
        />
      </View>
    )
  }

  _incrementRoad = async () => {
    if (!this.state.isRight) {
      let position = await SMap.getCurrentPosition()
      let isIndoor = await SMap.isIndoorPoint(position.x, position.y)
      if (!isIndoor) {
        Toast.show(
          getLanguage(this.props.language).Prompt
            .CANT_USE_TRACK_TO_INCREMENT_ROAD,
        )
        return
      }
    }
    if (this.state.showIncrement) {
      this.setState({ showIncrement: false })
    }
    //清空Toolbar数据
    ToolbarModule.setData({})
    let rel = await SMap.addNetWorkDataset()
    if (rel) {
      this.FloorListView.setVisible(false)
      if (!this.state.isRight) {
        this.toolBox.setVisible(true, ConstToolType.MAP_TOOL_GPSINCREMENT, {
          containerType: 'table',
          column: 4,
          isFullScreen: false,
          height: ConstToolType.HEIGHT[0],
        })
      } else {
        await SMap.setLabelColor()
        await SMap.setAction(Action.DRAWLINE)
        await SMap.setIsMagnifierEnabled(true)
        this.toolBox.setVisible(true, ConstToolType.MAP_TOOL_INCREMENT, {
          containerType: 'table',
          column: 4,
          isFullScreen: false,
          height: ConstToolType.HEIGHT[0],
        })
      }
    } else {
      GLOBAL.TouchType = TouchType.NORMAL
      this.showFullMap(false)
      Toast.show(getLanguage(this.props.language).Prompt.ILLEGAL_DATA)
    }
  }

  // _renderNavigationView = () => {
  //   return (
  //     <View
  //       style={{
  //         position: 'absolute',
  //         top: 0,
  //         width: '100%',
  //       }}
  //     >
  //       <NavigationView />
  //     </View>
  //   )
  // }
  changeFloorID = (currentFloorID, cb) => {
    if (currentFloorID !== this.state.currentFloorID) {
      this.setState(
        {
          currentFloorID,
        },
        () => {
          GLOBAL.ISOUTDOORMAP = !currentFloorID
          cb && cb()
        },
      )
    }
  }
  _renderFloorListView = () => {
    return (
      <RNFloorListView
        changeFloorID={this.changeFloorID}
        currentFloorID={this.state.currentFloorID}
        device={this.props.device}
        mapLoaded={this.mapLoaded}
        ref={ref => (GLOBAL.FloorListView = this.FloorListView = ref)}
      />
    )
  }

  _renderTrafficView = () => {
    return (
      <TrafficView
        ref={ref => (GLOBAL.TrafficView = this.TrafficView = ref)}
        currentFloorID={this.state.currentFloorID}
        getLayers={this.props.getLayers}
        device={this.props.device}
        incrementRoad={() => {
          GLOBAL.TouchType = TouchType.NULL //进入路网，触摸事件设置为空
          this.showFullMap(true)
          this.setState({ showIncrement: true })
        }}
        mapLoaded={this.mapLoaded}
        language={this.props.language}
        // showModelList={this.showModelList}
      />
    )
  }

  _renderIncrementRoad = () => {
    if (this.state.showIncrement) {
      return (
        <View
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
          }}
        >
          <IncrementRoadView
            isRight={this.state.isRight}
            onClick={isRight =>
              this.setState({
                isRight,
              })
            }
            headerProps={{
              title: getLanguage(this.props.language).Map_Main_Menu
                .INCREMENT_ROAD,
              navigation: this.props.navigation,
              type: 'fix',
              backAction: () => {
                this.setState({ showIncrement: false })
                this.showFullMap(false)
                GLOBAL.TouchType = TouchType.NORMAL //退出路网，触摸事件设置为normal
              },
            }}
          />
        </View>
      )
    } else {
      return <View />
    }
  }

  _renderAIDetectChange = () => {
    return (
      <MapSelectPoint
        ref={ref => (GLOBAL.AIDETECTCHANGE = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
          navigation: this.props.navigation,
          type: 'fix',
          backAction: async () => {
            // await SAIDetectView.setProjectionModeEnable(false)
            GLOBAL.AIDETECTCHANGE.setVisible(false)
            this.showFullMap(false)
            GLOBAL.toolBox.setVisible(false)
            const type = 'aiDetect'
            this.props.navigation.navigate('ChooseTaggingLayer', { type })
            this.switchAr()
          },
        }}
      />
    )
  }

  _renderCheckAIDetec = () => {
    return (
      <MapSelectPoint
        ref={ref => (GLOBAL.CHECKAIDETEC = ref)}
        headerProps={{
          title: '查看',
          navigation: this.props.navigation,
          type: 'fix',
          backAction: async () => {
            GLOBAL.CHECKAIDETEC.setVisible(false)
            this.showFullMap(false)
          },
        }}
      />
    )
  }
  getSearchClickedInfo = () => {
    return this.searchClickedInfo
  }
  _renderMapSelectPointHeaderRight = () => {
    if (!this.state.currentFloorID) {
      return (
        <TouchableOpacity
          key={'search'}
          onPress={async () => {
            let layers = this.props.getLayers && (await this.props.getLayers())
            let baseMap = layers.filter(layer =>
              LayerUtils.isBaseLayer(layer.name),
            )[0]
            if (baseMap && baseMap.name !== 'baseMap' && baseMap.isVisible) {
              this.searchClickedInfo = {
                isClicked: true,
                title: GLOBAL.MAPSELECTPOINTBUTTON.state.button,
              }
              NavigationService.navigate('PointAnalyst', {
                type: 'pointSearch',
                searchClickedInfo: this.searchClickedInfo,
                changeNavPathInfo: this.changeNavPathInfo,
              })
            } else {
              Toast.show(
                getLanguage(this.props.language).Prompt
                  .PLEASE_SET_BASEMAP_VISIBLE,
              )
            }
          }}
        >
          <Image
            resizeMode={'contain'}
            source={require('../../../../assets/header/icon_search.png')}
            style={styles.search}
          />
        </TouchableOpacity>
      )
    } else {
      return null
    }
  }

  _renderMapSelectPoint = () => {
    return (
      <MapSelectPoint
        ref={ref => (GLOBAL.MAPSELECTPOINT = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Map_Main_Menu.SELECT_POINTS,
          subTitle: getLanguage(this.props.language).Map_Main_Menu
            .LONG_PRESS_SELECT_POINTS,
          navigation: this.props.navigation,
          type: 'fix',
          headerRight: this._renderMapSelectPointHeaderRight(),
          backAction: () => {
            GLOBAL.MAPSELECTPOINT.setVisible(false)
            GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
            NavigationService.navigate('NavigationView', {
              changeNavPathInfo: this.changeNavPathInfo,
              getNavigationDatas: this.getNavigationDatas,
            })
          },
        }}
      />
    )
  }

  _onlineRouteAnylystConfirm = async () => {
    GLOBAL.NavDialog.setDialogVisible(false)
    this.setLoading(true, getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING)
    let result, path, pathLength
    result = await FetchUtils.routeAnalyst(
      GLOBAL.STARTX,
      GLOBAL.STARTY,
      GLOBAL.ENDX,
      GLOBAL.ENDY,
    )
    if (result && result[0] && result[0].pathInfos) {
      await SMap.drawOnlinePath(result[0].pathPoints)
    } else {
      this.setLoading(false)
      Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
      return
    }
    pathLength = { length: result[0].pathLength }
    path = result[0].pathInfos

    this.setLoading(false)
    GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true, true)
    GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
    GLOBAL.MAPSELECTPOINT.setVisible(false)
    GLOBAL.STARTPOINTFLOOR = await SMap.getCurrentFloorID()

    if (path && pathLength) {
      GLOBAL.TouchType = TouchType.NORMAL
      this.changeNavPathInfo({ path, pathLength })

      let history = this.props.navigationhistory
      history.push({
        sx: GLOBAL.STARTX,
        sy: GLOBAL.STARTY,
        ex: GLOBAL.ENDX,
        ey: GLOBAL.ENDY,
        sFloor: GLOBAL.STARTPOINTFLOOR,
        eFloor: GLOBAL.ENDPOINTFLOOR,
        address: GLOBAL.STARTNAME + '---' + GLOBAL.ENDNAME,
        start: GLOBAL.STARTNAME,
        end: GLOBAL.ENDNAME,
        isOutDoor: true,
      })
      this.props.setNavigationHistory(history)
    }
  }

  changeNavPathInfo = ({ path, pathLength }) => {
    this.setState({
      path,
      pathLength,
    })
  }

  _renderNavigationStartButton = () => {
    return (
      <NavigationStartButton
        getNavigationDatas={this.getNavigationDatas}
        path={this.state.path}
        pathLength={this.state.pathLength}
        ref={ref => (GLOBAL.NAVIGATIONSTARTBUTTON = ref)}
      />
    )
  }

  _renderNavigationStartHead = () => {
    return (
      <NavigationStartHead
        ref={ref => (GLOBAL.NAVIGATIONSTARTHEAD = ref)}
        setMapNavigation={this.props.setMapNavigation}
      />
    )
  }

  _renderMapSelectPointButton = () => {
    return (
      <MapSelectPointButton
        setLoading={this.setLoading}
        getNavigationDatas={this.getNavigationDatas}
        navigationhistory={this.props.navigationhistory}
        setNavigationHistory={this.props.setNavigationHistory}
        changeNavPathInfo={this.changeNavPathInfo}
        ref={ref => (GLOBAL.MAPSELECTPOINTBUTTON = ref)}
      />
    )
  }

  _renderNavigationPoiView = () => {
    return (
      <NavigationPoiView
        setNavigationChangeAR={this.props.setNavigationChangeAR}
      />
    )
  }

  renderContainer = () => {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.mapTitle,
          navigation: this.props.navigation,
          // headerRight: this.renderHeaderBtns(),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          backAction: this.back,
          type: 'fix',
          headerCenter: this.renderSearchBar(),
          headerRight: this.renderHeaderRight(),
        }}
        bottomBar={
          !this.isExample && !this.props.analyst.params && this.renderToolBar()
        }
        bottomProps={{ type: 'fix' }}
      >
        {GLOBAL.Type &&
          this.props.mapLegend[GLOBAL.Type] &&
          this.props.mapLegend[GLOBAL.Type].isShow &&
          !this.noLegend && (
          <RNLegendView
            setMapLegend={this.props.setMapLegend}
            legendSettings={this.props.mapLegend}
            device={this.props.device}
            language={this.props.language}
            ref={ref => (GLOBAL.legend = ref)}
          />
        )}
        {this.state.showMap && (
          <SMMapView
            ref={ref => (GLOBAL.mapView = ref)}
            style={styles.map}
            onGetInstance={this._onGetInstance}
          />
        )}
        {GLOBAL.Type === constants.MAP_NAVIGATION &&
          this._renderFloorListView()}
        {/*{this.props.map2Dto3D && (*/}
        {/*<Map2Dto3D*/}
        {/*mapIs3D={this.props.mapIs3D}*/}
        {/*openMap={this.props.openMap}*/}
        {/*openWorkspace={this.props.openWorkspace}*/}
        {/*/>*/}
        {/*)}*/}
        {GLOBAL.Type === constants.MAP_NAVIGATION && this._renderTrafficView()}
        {global.isLicenseValid && this.state.showAIDetect && (
          <SMAIDetectView
            ref={ref => (GLOBAL.SMAIDetectView = ref)}
            onArObjectClick={this._onArObjectClick}
            language={this.props.language}
          />
        )}
        {this._renderAIDetectChange()}
        {/*{this._renderCheckAIDetec()}*/}
        {/*{this.state.showAIDetect && (<AIMapSuspensionDialog ref={ref => (GLOBAL.AIMapSuspensionDialog = ref)}/>)}*/}
        {/*{this.state.showAIDetect && (<View style={{height: '100%', width: '100%'}}><SMMapSuspension*/}
        {/*ref={ref => (GLOBAL.SMMapSuspension = ref)}/></View>)}*/}
        {/*{!this.isExample &&*/}
        {/*!this.props.analyst.params &&*/}
        {/*this.state.showAIDetect &&*/}
        {/*this.renderAIFunctionToolbar()}*/}
        <SurfaceView ref={ref => (GLOBAL.MapSurfaceView = ref)} />
        {!this.state.showAIDetect && this.renderMapController()}
        {/*{!this.isExample &&*/}
        {/*GLOBAL.Type === constants.MAP_NAVIGATION &&*/}
        {/*this.props.mapNavigation.isPointShow &&*/}
        {/*this._renderNavigationView()}*/}
        {this._renderIncrementRoad()}
        {this._renderMapSelectPoint()}
        {this._renderNavigationStartButton()}
        {this._renderNavigationStartHead()}
        {this._renderMapSelectPointButton()}
        {!this.isExample &&
          GLOBAL.Type === constants.MAP_NAVIGATION &&
          this._renderNavigationPoiView()}
        {!this.isExample &&
          GLOBAL.Type === constants.MAP_NAVIGATION &&
          !this.props.mapNavigation.isShow &&
          this.state.showIncrement &&
          this._renderNavigationIcon()}
        {/*{GLOBAL.Type === constants.MAP_NAVIGATION && this._renderLocationIcon()}*/}
        {!this.isExample &&
          this.props.analyst.params &&
          this.renderAnalystMapButtons()}
        {/*{!this.isExample && this.props.analyst.params && this.renderAnalystMapRecommend()}*/}
        {!this.isExample &&
          !this.props.analyst.params &&
          this.renderFunctionToolbar()}
        {!this.isExample &&
          !this.props.analyst.params &&
          this.renderOverLayer()}
        {!this.isExample && this.renderTool()}
        {!this.isExample &&
          this.props.analyst.params &&
          this.renderAnalystMapToolbar()}
        {!this.isExample &&
          !this.props.analyst.params &&
          this.renderMenuDialog()}
        {this.state.measureShow &&
          !this.props.analyst.params &&
          this.renderMeasureLabel()}
        {!this.isExample &&
          GLOBAL.Type === constants.MAP_AR &&
          this.state.showArModeIcon &&
          this._renderArModeIcon()}
        {!this.state.showAIDetect && this.state.showScaleView && (
          <ScaleView
            mapNavigation={this.props.mapNavigation}
            device={this.props.device}
            language={this.props.language}
            isShow={this.props.mapScaleView}
            ref={ref => (GLOBAL.scaleView = ref)}
          />
        )}
        <BubblePane ref={ref => (GLOBAL.bubblePane = ref)} maxSize={1} />
        <PopView ref={ref => (this.popModal = ref)}>
          {this.renderEditControllerView()}
        </PopView>
        {this.renderDialog()}
        <Dialog
          ref={ref => (GLOBAL.removeObjectDialog = ref)}
          type={Dialog.Type.MODAL}
          // title={'提示'}
          info={getLanguage(this.props.language).Prompt.DELETE_OBJECT}
          // {'是否要删除该对象吗？\n（删除后将不可恢复）'}
          confirmAction={this.removeObject}
          // style={styles.dialogStyle}
          opacityStyle={styles.dialogStyle}
          confirmBtnTitle={getLanguage(this.props.language).Prompt.DELETE}
          cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        />
        <SaveMapNameDialog
          ref={ref => (this.saveXMLDialog = ref)}
          confirmAction={this.saveMapToXMLWithDialog}
          showWsName={this.showDialogCaption}
          mapTitle={this.state.mapTitle}
        />
        <SaveMapNameDialog
          ref={ref => (this.saveMapDialog = ref)}
          confirmAction={this.saveMapToXMLAndClose}
          showWsName={this.showDialogCaption}
          mapTitle={this.state.mapTitle}
        />
        <AlertDialog
          ref={ref => (this.AlertDialog = ref)}
          childrens={this.closeInfo}
          Alerttitle={getLanguage(this.props.language).Prompt.SAVE_TITLE}
        />
        <SaveDialog
          ref={ref => (this.SaveDialog = ref)}
          confirmAction={data => this.saveAsMap(data.mapTitle)}
          type="normal"
        />
        <InputDialog ref={ref => (this.InputDialog = ref)} label="名称" />
        <PoiTopSearchBar
          ref={ref => (GLOBAL.PoiTopSearchBar = ref)}
          setMapNavigation={this.props.setMapNavigation}
        />
        <PoiInfoContainer
          setLoading={this.setLoading}
          getSearchClickedInfo={this.getSearchClickedInfo}
          getNavigationDatas={this.getNavigationDatas}
          changeNavPathInfo={this.changeNavPathInfo}
          ref={ref => (GLOBAL.PoiInfoContainer = ref)}
          mapSearchHistory={this.props.mapSearchHistory}
          setMapSearchHistory={this.props.setMapSearchHistory}
          device={this.props.device}
          setMapNavigation={this.props.setMapNavigation}
          setNavigationPoiView={this.props.setNavigationPoiView}
          setNavigationChangeAR={this.props.setNavigationChangeAR}
        />
        {GLOBAL.Type === constants.MAP_THEME && this.renderPreviewHeader()}
        {GLOBAL.Type === constants.MAP_THEME && this.renderPreviewColorPicker()}
        {/*{GLOBAL.Type === constants.MAP_NAVIGATION && (*/}
        {/*  <PopView*/}
        {/*    showFullMap={this.showFullMap}*/}
        {/*    ref={ref => (this.selectList = ref)}*/}
        {/*  >*/}
        {/*    {this.renderNetworkSelectList()}*/}
        {/*  </PopView>*/}
        {/*)}*/}
        <AudioTopDialog
          ref={ref => (this.AudioDialog = ref)}
          startRecording={() => SSpeechRecognizer.start()}
          content={this.state.speechContent}
          recording={this.state.recording}
          defaultText={getLanguage(global.language).Prompt.SPEECH_TIP}
        />
        {GLOBAL.Type === constants.MAP_NAVIGATION && (
          <Dialog
            ref={ref => (GLOBAL.NavDialog = ref)}
            confirmAction={this._onlineRouteAnylystConfirm}
            opacity={1}
            opacityStyle={styles.dialogBackground}
            style={styles.dialogBackground}
            confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.YES}
            cancelBtnTitle={getLanguage(GLOBAL.language).Prompt.NO}
          >
            <View style={styles.dialogHeaderView}>
              <Image
                source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
                style={styles.dialogHeaderImg}
              />
              <Text style={styles.promptTitle}>
                {getLanguage(GLOBAL.language).Prompt.USE_ONLINE_ROUTE_ANALYST}
              </Text>
            </View>
          </Dialog>
        )}
        {GLOBAL.Type === constants.MAP_NAVIGATION && (
          <Dialog
            ref={ref => (GLOBAL.changeRouteDialog = ref)}
            confirmAction={this._changeNavRoute}
            cancelAction={this._changeRouteCancel}
            opacity={1}
            opacityStyle={styles.dialogOneLine}
            style={styles.dialogOneLine}
            confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.YES}
            cancelBtnTitle={getLanguage(GLOBAL.language).Prompt.NO}
          >
            <View style={styles.dialogHeaderView}>
              <Image
                source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
                style={styles.dialogHeaderImg}
              />
              <Text style={styles.promptTitle}>
                {GLOBAL.CURRENT_NAV_MODE === 'INDOOR'
                  ? getLanguage(GLOBAL.language).Prompt.CHANGE_TO_OUTDOOR
                  : getLanguage(GLOBAL.language).Prompt.CHANGE_TO_INDOOR}
              </Text>
            </View>
          </Dialog>
        )}
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
