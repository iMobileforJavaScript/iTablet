/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import {
  SMMapView,
  Action,
  DatasetType,
  SMap,
  SCollector,
  EngineType,
  SMediaCollector,
} from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import {
  FunctionToolbar,
  MapToolbar,
  MapController,
  ToolBar,
  MenuAlertDialog,
  AlertDialog,
  OverlayView,
  AnalystMapButtons,
  AnalystMapToolbar,
} from '../../components'
import {
  Container,
  MTBtn,
  Dialog,
  SaveMapNameDialog,
  SaveDialog,
  InputDialog,
  PopModal,
  SurfaceView,
  SearchBar,
} from '../../../../components'
import { Utils } from '../../util'
import { Toast, jsonUtil, scaleSize } from '../../../../utils'
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
import { Platform, View, Text, InteractionManager } from 'react-native'
import { getLanguage } from '../../../../language/index'
import styles from './styles'
import RNLegendView from '../../components/RNLegendView'
import ScaleView from '../../components/ScaleView/ScaleView'

const markerTag = 117868
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
    mapLegend: PropTypes.bool,

    bufferSetting: PropTypes.object,
    overlaySetting: PropTypes.object,
    symbol: PropTypes.object,
    layers: PropTypes.object,
    map: PropTypes.object,
    collection: PropTypes.object,
    device: PropTypes.object,
    online: PropTypes.object,
    analyst: PropTypes.object,

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
    clearAttributeHistory: PropTypes.func,
    setMapLegend: PropTypes.func,
    setBackAction: PropTypes.func,
    removeBackAction: PropTypes.func,
    setAnalystParams: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = (params && params.type) || GLOBAL.Type || 'LOCAL'
    this.mapType = (params && params.mapType) || 'DEFAULT'
    // this.operationType =
    //   (params && params.operationType) || constants.COLLECTION
    this.isExample = (params && params.isExample) || false
    this.wsData = params && params.wsData
    this.showMarker = params && params.showMarker
    this.mapName = ''
    if (params && params.mapName) {
      this.mapName = params.mapName
    } else if (GLOBAL.Type) {
      this.mapName = getHeaderTitle(GLOBAL.Type)
    }

    this.path = (params && params.path) || ''
    this.showDialogCaption =
      params && params.path ? !params.path.endsWith('.smwu') : true
    // this.savepath =
    //   params.type === 'ONLINE' || !params.path
    //     ? null
    //     : params.path.substring(0, params.path.lastIndexOf('/') + 1)
    // let wsName =
    //   params.type === 'ONLINE' || !params.path
    //     ? null
    //     : params.path.substring(params.path.lastIndexOf('/') + 1)
    // wsName =
    //   params.type === 'ONLINE' || !params.path
    //     ? null
    //     : wsName.lastIndexOf('.') > 0 &&
    //       wsName.substring(0, wsName.lastIndexOf('.'))
    this.backAction = (params && params.backAction) || null
    this.state = {
      showMap: false, // 控制地图初始化显示
      data: params ? params.data : [],
      popShow: false, //  一级popView显示控制
      popType: '',
      mapName: '',
      // wsName: wsName,
      measureShow: false,
      measureResult: 0,
      editLayer: {},
      showMapMenu: false,
      // changeLayerBtnBottom: scaleSize(200),
    }
    this.closeInfo = [
      {
        btntitle: '是',
        action: () => {
          this.saveMap(NavigationService.goBack(this.props.nav.routes[1].key))
          //this.saveMapAndClose()
          //this.mapType = 'DEFAULT'
          this.AlertDialog.setDialogVisible(false)
        },
      },
      {
        btntitle: '否',
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
        btntitle: '取消',
        action: () => {
          this.AlertDialog.setDialogVisible(false)
        },
      },
    ]

    this.fullMap = false
    this.analystRecommendVisible = false // 底部分析推荐列表 是否显示
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      GLOBAL.SaveMapView &&
        GLOBAL.SaveMapView.setTitle(
          getLanguage(this.props.language).Prompt.SAVE_TITLE,
          getLanguage(this.props.language).Prompt.SAVE_YES,
          getLanguage(this.props.language).Prompt.SAVE_NO,
          getLanguage(this.props.language).Prompt.CANCEL,
        )
      this.container &&
        this.container.setLoading(
          true,
          getLanguage(this.props.language).Prompt.LOADING,
          //'地图加载中'
        )

      this.setState({
        showMap: true,
      })

      this.props.setBackAction({
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
    })
  }

  componentDidUpdate(prevProps) {
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

    // 网络分析模式下
    if (this.props.analyst.params) {
      this.container && this.container.setHeaderVisible(false)
      this.container && this.container.setBottomVisible(false)
      // 网络分析模式下，设置返回按钮事件
      if (
        JSON.stringify(prevProps.analyst.params) !==
        JSON.stringify(this.props.analyst.params)
      ) {
        this.backAction =
          (this.props.navigation.state.params &&
            this.props.navigation.state.params.backAction) ||
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
      this.container && this.container.setHeaderVisible(true)
      this.container && this.container.setBottomVisible(true)
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
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.navigation.state.routeName,
      })
    }
    // this.props.setMapLegend(false)

    // 移除多媒体采集监听
    SMediaCollector.removeListener()

    // 移除多媒体采集Callout
    SMediaCollector.removeMedias()

    this.showMarker && SMap.deleteMarker(markerTag)

    if (GLOBAL.MapTabNavigator) {
      GLOBAL.MapTabNavigator = null
    }
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
                  name: this.mapName,
                  image: uri,
                  DSParams: this.DSParams,
                  labelDSParams: this.labelDSParams,
                  layerIndex: this.layerIndex,
                  mapName: this.mapName,
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

  geometrySelected = event => {
    this.props.setSelection &&
      this.props.setSelection([
        {
          layerInfo: event.layerInfo,
          ids: [event.id],
        },
      ])
    switch (GLOBAL.currentToolbarType) {
      // case ConstToolType.MAP_TOOL_RECTANGLE_CUT:
      // case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
      // case ConstToolType.MAP_TOOL_POINT_SELECT:
      //   break
      case ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT:
      case ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE:
        break
      case ConstToolType.MAP_EDIT_POINT:
      case ConstToolType.MAP_EDIT_LINE:
      case ConstToolType.MAP_EDIT_REGION:
      case ConstToolType.MAP_EDIT_DEFAULT: {
        if (GLOBAL.currentToolbarType === ConstToolType.MAP_EDIT_DEFAULT) {
          let column = 4,
            height = ConstToolType.HEIGHT[3],
            tableType = 'normal',
            type = ''
          switch (event.layerInfo.type) {
            case DatasetType.POINT:
              type = ConstToolType.MAP_EDIT_POINT
              height = ConstToolType.HEIGHT[0]
              column = 5
              break
            case DatasetType.LINE:
              type = ConstToolType.MAP_EDIT_LINE
              height = ConstToolType.HEIGHT[2]
              break
            case DatasetType.REGION:
              type = ConstToolType.MAP_EDIT_REGION
              height = ConstToolType.HEIGHT[2]
              tableType = 'scroll'
              break
            case DatasetType.CAD:
              type = ConstToolType.MAP_EDIT_CAD
              height = ConstToolType.HEIGHT[0]
              column = 5
              break
          }
          this.toolBox &&
            this.toolBox.setVisible(true, type, {
              isFullScreen: false,
              column,
              height,
              tableType,
              cb: () =>
                SMap.appointEditGeometry(event.id, event.layerInfo.path),
            })
        }
        break
      }
      default:
        // 除了编辑状态，其余点选对象所在图层全设置为选择状态
        if (event.layerInfo.editable) {
          SMap.setLayerEditable(event.layerInfo.path, false).then(() => {
            Utils.setSelectionStyle(event.layerInfo.path)
          })
        } else {
          Utils.setSelectionStyle(event.layerInfo.path)
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
      Utils.setSelectionStyle(event.geometries[i].layerInfo.path)
      data.push({
        layerInfo: event.geometries[i].layerInfo,
        ids: event.geometries[i].ids,
      })
    }
    this.props.setSelection && this.props.setSelection(data)

    switch (GLOBAL.currentToolbarType) {
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

  // 导出(保存)工作空间中地图到模块
  saveMapName = (
    mapName = '',
    nModule = '',
    addition = {},
    isNew = false,
    cb = () => {},
  ) => {
    try {
      this.setLoading(true, getLanguage(this.props.language).Prompt.SAVING)
      this.props.saveMap({ mapName, nModule, addition, isNew }).then(
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
      // SMap.saveMapName(mapName, nModule, addition, isNew).then(
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
  saveMapToXML = mapName => {
    this.setLoading(true, '正在保存')
    ;(async function() {
      try {
        const filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapName +
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
                if (config.data[0].maps[i].mapName === mapName + '.xml') {
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
  saveMapToXMLWithDialog = ({ mapName }) => {
    // this.setLoading(true, '正在保存')
    (async function() {
      try {
        const filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapName +
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

              jsonUtil.saveMapInfo(config, mapName, data)
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
              let mapName = await SMap.getMapName()
              await this.saveMapToXML(mapName)
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
        let mapName = await SMap.getMapName()
        const filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapName +
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

              jsonUtil.saveMapInfo(config, mapName, data)
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
        let mapName = await SMap.getMapName()
        const filePath =
          (await FileTools.appendingHomeDirectory(ConstPath.CustomerPath)) +
          mapName +
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
                if (config.data[0].maps[i].mapName === mapName + '.xml') {
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
    // 优先处理其他界面跳转到MapView传来的返回事件
    if (this.backAction && typeof this.backAction === 'function') {
      this.backAction()
      this.backAction = null
      this.mapController.reset()
      return
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
        this.setSaveViewVisible(true)
      } else {
        try {
          this.setLoading(
            true,
            getLanguage(this.props.language).Prompt.CLOSING,
            //'正在关闭地图'
          )
          await this.props.closeMap()
          GLOBAL.clearMapData()
          this.setLoading(false)
          NavigationService.goBack()
        } catch (e) {
          this.setLoading(false)
        }
      }
    })
    this.props.setCurrentAttribute({})
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
            }
            // else if (this.wsData.type === 'LastMap') {
            //   // 打开最近地图
            //   // this.toolBox && this.toolBox.changeMap(this.wsData.DSParams)
            //   await this._openLatestMap(this.wsData.DSParams)
            // }
          }
        }

        // GLOBAL.Type === constants.COLLECTION && this.initCollectorDatasource()
        // 获取图层列表
        this.props.getLayers(
          { type: -1, currentLayerIndex: 0 },
          async layers => {
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

        this._addGeometrySelectedListener()
        this.setLoading(false)

        setGestureDetectorListener({ ...this.props })
        GLOBAL.TouchType = TouchType.NORMAL

        SMap.openTaggingDataset(this.props.user.currentUser.userName)

        GLOBAL.TaggingDatasetName = await SMap.getDefaultTaggingDataset(
          this.props.user.currentUser.userName,
        )

        //地图打开后去获取比例尺、图例数据
        GLOBAL.scaleView.getInitialData()
        GLOBAL.legend && GLOBAL.legend.getLegendData()

        this.showMarker &&
          SMap.showMarker(
            this.showMarker.longitude,
            this.showMarker.latitude,
            markerTag,
          )
      } catch (e) {
        this.setLoading(false)
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
        if (mapInfo.Template && GLOBAL.Type === constants.COLLECTION) {
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
        } else if (GLOBAL.Type === constants.MAP_PLOTTING) {
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
          await this.props.getSymbolPlots({
            path: plotIconPath,
            name: data.name,
            isFirst: true,
          })

          // let plotLibPath = await FileTools.appendingHomeDirectory(
          //   ConstPath.PlotLibPath,
          // )
          // fs.readDir(plotLibPath).then(async data => {
          //   let plotLibPaths=[]
          //   for(let i=0;i<data.length;i++){
          //     plotLibPaths.push(data[i].path)
          //   }
          //   let plotLibIds = SMap.initPlotSymbolLibrary(plotLibPaths)
          //   let plotLibs=plotLibIds
          // })
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
        initIndex={0}
        type={this.type}
      />
    )
  }

  /** 地图分析模式左侧按钮 **/
  renderAnalystMapButtons = () => {
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
        back={() => {
          let action =
            (this.props.navigation.state.params &&
              this.props.navigation.state.params.backAction) ||
            null
          action && action()
        }}
        setAnalystParams={this.props.setAnalystParams}
        language={this.props.language}
      />
    )
  }

  /** 地图功能工具栏（右侧） **/
  renderFunctionToolbar = () => {
    return (
      <FunctionToolbar
        language={this.props.language}
        ref={ref => (this.functionToolbar = ref)}
        style={styles.functionToolbar}
        type={this.type}
        getToolRef={() => this.toolBox}
        getMenuAlertDialogRef={() => this.MenuAlertDialog}
        showFullMap={this.showFullMap}
        user={this.props.user}
        map={this.props.map}
        symbol={this.props.symbol}
        layers={this.props.currentLayer}
        addGeometrySelectedListener={this._addGeometrySelectedListener}
        removeGeometrySelectedListener={this._removeGeometrySelectedListener}
        device={this.props.device}
        setMapType={this.setMapType}
        online={this.props.online}
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

  //遮盖层
  renderOverLayer = () => {
    return <OverlayView ref={ref => (GLOBAL.OverlayView = ref)} />
  }

  /** 地图控制器，放大缩小等功能 **/
  renderMapController = () => {
    return (
      <MapController
        ref={ref => (this.mapController = ref)}
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
    GLOBAL.scaleView && GLOBAL.scaleView.showFullMap(full)
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
    this.popModal && this.popModal.setVisible(true)
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

  renderTool = () => {
    return (
      <ToolBar
        ref={ref => (GLOBAL.ToolBar = this.toolBox = ref)}
        language={this.props.language}
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
        info={getLanguage(this.props.language).Prompt.TURN_ON_AUTO_SPLIT_REGION}
        //{'是否开启动态投影？'}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.TURN_ON}
        //{'是'}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
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
          image={getThemeAssets().publicAssets.icon_undo}
          imageStyle={styles.headerBtn}
          onPress={() => SMap.undo()}
        />
        <MTBtn
          key={'redo'}
          title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_REDO}
          //{'恢复'}
          style={styles.button}
          image={getThemeAssets().publicAssets.icon_redo}
          imageStyle={styles.headerBtn}
          onPress={() => SMap.redo()}
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

  renderSearchBar = () => {
    if (!this.props.analyst.params) return null
    return (
      <SearchBar
        ref={ref => (this.searchBar = ref)}
        onSubmitEditing={searchKey => {
          this.setLoading(true, getLanguage(global.language).Prompt.SEARCHING)
          this.search(searchKey)
        }}
        placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
        //{'请输入搜索关键字'}
      />
    )
  }

  renderHeaderRight = () => {
    if (this.isExample) return null
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
    return [
      <MTBtn
        key={'undo'}
        image={getPublicAssets().common.icon_undo}
        imageStyle={[styles.headerBtn, { marginRight: scaleSize(15) }]}
        onPress={this.showUndoView}
      />,
    ]
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.mapName,
          navigation: this.props.navigation,
          // headerRight: this.renderHeaderBtns(),
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
        {this.props.mapLegend && GLOBAL.Type === constants.MAP_THEME && (
          <RNLegendView
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
        <SurfaceView ref={ref => (GLOBAL.MapSurfaceView = ref)} />
        {this.renderMapController()}
        {!this.isExample &&
          this.props.analyst.params &&
          this.renderAnalystMapButtons()}
        {/*{!this.isExample && this.props.analyst.params && this.renderAnalystMapRecommend()}*/}
        {!this.isExample &&
          this.props.analyst.params &&
          this.renderAnalystMapToolbar()}
        {!this.isExample &&
          !this.props.analyst.params &&
          this.renderFunctionToolbar()}
        {!this.isExample &&
          !this.props.analyst.params &&
          this.renderOverLayer()}
        {!this.isExample && !this.props.analyst.params && this.renderTool()}
        {!this.isExample &&
          !this.props.analyst.params &&
          this.renderMenuDialog()}
        {this.state.measureShow &&
          !this.props.analyst.params &&
          this.renderMeasureLabel()}
        <ScaleView
          device={this.props.device}
          language={this.props.language}
          ref={ref => (GLOBAL.scaleView = ref)}
        />
        <PopModal
          ref={ref => (this.popModal = ref)}
          modalVisible={this.state.editControllerVisible}
        >
          {this.renderEditControllerView()}
        </PopModal>
        {this.renderDialog()}
        <Dialog
          ref={ref => (GLOBAL.removeObjectDialog = ref)}
          type={Dialog.Type.MODAL}
          // title={'提示'}
          info={getLanguage(this.props.language).Prompt.DELETE_OBJECT}
          // {'是否要删除该对象吗？\n（删除后将不可恢复）'}
          confirmAction={this.removeObject}
          confirmBtnTitle={getLanguage(this.props.language).Prompt.DELETE}
          cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        />
        <SaveMapNameDialog
          ref={ref => (this.saveXMLDialog = ref)}
          confirmAction={this.saveMapToXMLWithDialog}
          showWsName={this.showDialogCaption}
          mapName={this.state.mapName}
        />
        <SaveMapNameDialog
          ref={ref => (this.saveMapDialog = ref)}
          confirmAction={this.saveMapToXMLAndClose}
          showWsName={this.showDialogCaption}
          mapName={this.state.mapName}
        />
        <AlertDialog
          ref={ref => (this.AlertDialog = ref)}
          childrens={this.closeInfo}
          Alerttitle={getLanguage(this.props.language).Prompt.SAVE_TITLE}
        />
        <SaveDialog
          ref={ref => (this.SaveDialog = ref)}
          confirmAction={data => this.saveAsMap(data.mapName)}
          type="normal"
        />
        <InputDialog ref={ref => (this.InputDialog = ref)} label="名称" />
      </Container>
    )
  }
}
