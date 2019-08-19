import React from 'react'
import {
  Toast,
  scaleSize,
  jsonUtil,
  setSpText,
  screen,
} from '../../../../utils'
import {
  Row,
  MTBtn,
  TableList,
  ColorTableList,
  ColorBtn,
  HorizontalTableList,
} from '../../../../components'
import {
  ConstToolType,
  ConstPath,
  ConstOnline,
  TouchType,
  // BotMap,
  line,
  point,
  region,
  grid,
  // openData,
  lineColorSet,
  pointColorSet,
  legendColor,
  regionBeforeColorSet,
  regionAfterColorSet,
  Map3DBaseMapList,
  ConstInfo,
  Const,
  uniqueMenuInfo,
  rangeMenuInfo,
  labelMenuInfo,
  uniqueLabelMenuInfo,
  rangeLabelMenuInfo,
  graphMenuInfo,
  dotDensityMenuInfo,
  graduatedSymbolMenuInfo,
  gridUniqueMenuInfo,
  gridRangeMenuInfo,
  heatmapMenuInfo,
  UserType,
  legendMenuInfo,
  legendMenuInfoNotVisible,
} from '../../../../constants'
import TouchProgress from '../TouchProgress'
import Map3DToolBar from '../Map3DToolBar'
import NavigationService from '../../../../containers/NavigationService'
import * as LayerUtils from '../../../../containers/mtLayerManager/LayerUtils'
import * as ExtraDimensions from 'react-native-extra-dimensions-android'
import ToolbarData from './ToolbarData'
import ToolbarHeight from './ToolBarHeight'
import EditControlBar from './EditControlBar'
import ToolbarButtonAction from './ToolbarButtonAction'
import { FileTools } from '../../../../native'
import {
  View,
  TouchableOpacity,
  Image,
  Animated,
  Text,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import {
  SMap,
  SScene,
  Action,
  SCollector,
  SThemeCartography,
  // SOnlineService,
  SMCollectorType,
  SCartography,
  SMediaCollector,
  DatasetType,
} from 'imobile_for_reactnative'
import SymbolTabs from '../SymbolTabs'
import SymbolList from '../SymbolList/SymbolList'
import PlotAnimationView from '../PlotAnimationView'
import ToolbarBtnType from './ToolbarBtnType'
import ThemeMenuData from './ThemeMenuData'
import ToolBarSectionList from './ToolBarSectionList'
import constants from '../../constants'
// import ShareData from './ShareData'
import MapToolData from './MapToolData'
import MenuDialog from './MenuDialog'
import styles from './styles'
import { color } from '../../../../styles'
import { getThemeAssets, getPublicAssets } from '../../../../assets'
import { getLanguage } from '../../../../language/index'
import MenuList from '../MenuList'
import { BoxClipData, PlaneClipData, CrossClipData } from './Map3DClipMenuData'

/** 工具栏类型 **/
const list = 'list'
const table = 'table'
const tabs = 'tabs'
const symbol = 'symbol'
const colortable = 'colortable'
const horizontalTable = 'horizontalTable'
const createPlotAnimation = 'createPlotAnimation'
// 工具表格默认高度
const DEFAULT_COLUMN = 4
// 是否全屏显示，是否有Overlay
const DEFAULT_FULL_SCREEN = true

// let isSharing = false

export default class ToolBar extends React.PureComponent {
  props: {
    language: string,
    children: any,
    type: string,
    containerProps?: Object,
    navigation: Object,
    data: Array,
    existFullMap: () => {},
    symbol: Object,
    user: Object,
    map: Object,
    layers: Object,
    online: Object,
    collection: Object,
    template: Object,
    currentLayer: Object,
    selection: Array,
    device: Object,
    confirm: () => {},
    showDialog: () => {},
    addGeometrySelectedListener: () => {},
    removeGeometrySelectedListener: () => {},
    setSaveViewVisible?: () => {},
    setSaveMapDialogVisible?: () => {},
    setContainerLoading?: () => {},
    showFullMap: () => {},
    dialog: () => {},
    mapLegend?: Object, //图例参数对象
    setMapLegend?: () => {}, //设置图例显隐的redux状态
    tableType?: string, // 用于设置表格类型 normal | scroll
    getMenuAlertDialogRef: () => {},
    getLayers: () => {}, // 更新数据（包括其他界面）
    setCurrentMap: () => {}, // 设置当前地图
    setCollectionInfo: () => {}, // 设置当前采集数据源信息
    setCurrentLayer: () => {}, // 设置当前图层
    importTemplate: () => {}, // 导入模板
    importWorkspace: () => {}, // 打开模板
    setAttributes: () => {},
    getMaps: () => {},
    exportWorkspace: () => {},
    getSymbolTemplates: () => {},
    getSymbolPlots: () => {},
    openWorkspace: () => {},
    closeWorkspace: () => {},
    openMap: () => {},
    closeMap: () => {},
    setCurrentTemplateInfo: () => {},
    setCurrentPlotInfo: () => {},
    setTemplate: () => {},
    setInputDialogVisible: () => {},
    exportmap3DWorkspace: () => {},
    importSceneWorkspace: () => {},
    getMapSetting: () => {},
    showMeasureResult: () => {},
    refreshLayer3dList: () => {},
    setCurrentSymbols: () => {},
    saveMap: () => {},
    measureShow: () => {},
    clearAttributeHistory: () => {},
    layerList?: Array, //三维图层
    changeLayerList?: () => {}, //切换场景改变三维图层
  }

  static defaultProps = {
    containerProps: {
      data: [],
      containerType: table,
      tableType: 'normal',
      // height: HEIGHT[1],
      isFullScreen: DEFAULT_FULL_SCREEN,
      column: DEFAULT_COLUMN, // 只有table可以设置
    },
  }

  constructor(props) {
    super(props)
    this.height =
      props.containerProps.height >= 0
        ? props.containerProps.height
        : props.containerProps.containerType === list
          ? ConstToolType.HEIGHT[3]
          : ConstToolType.HEIGHT[1]
    this.originType = props.type // 初次传入的类型
    this.lastState = {}
    this.shareTo = ''
    this.state = {
      // isShow: false,
      type: props.type, // 当前传入的类型
      containerType: props.containerProps.containerType,
      isFullScreen: props.containerProps.isFullScreen,
      // height: props.containerProps.height,
      column: props.containerProps.column,
      // data: this.getData(props.type),
      data: [],
      buttons: [],
      bottom: new Animated.Value(-props.device.height),
      boxHeight: new Animated.Value(this.height),
      showMenuDialog: false,
      listSelectable: false, // 列表是否可以选择（例如地图）
      isTouch: true,
      isTouchProgress: false,
      tableType: 'normal',
      themeDatasourceAlias: '',
      themeDatasetName: '',
      themeColor: '',
      themeCreateType: '',
      selectName: '',
      selectKey: '',
      listExpressions: {},
      themeSymbolType: '',
      hasSoftMenuBottom: false,
    }
    this.isShow = false
    this.isBoxShow = true
  }

  componentDidMount() {
    ToolbarData.setParams({
      setToolbarVisible: this.setVisible,
      setLastState: this.setLastState,
      scrollListToLocation: this.scrollListToLocation,
      ...this.props,
    })
    ExtraDimensions.addSoftMenuBarWidthChangeListener({
      softBarPositionChange: val => {
        this.setState({ hasSoftMenuBottom: val })
      },
    })
  }

  componentDidUpdate(prevProps) {
    let tempPrev = Object.assign({}, prevProps)
    let tempthis = Object.assign({}, this.props)
    tempPrev.nav && delete tempPrev.nav
    tempthis.nav && delete tempthis.nav
    if (JSON.stringify(tempPrev) !== JSON.stringify(tempthis)) {
      // 实时更新params
      ToolbarData.setParams({
        setToolbarVisible: this.setVisible,
        setLastState: this.setLastState,
        scrollListToLocation: this.scrollListToLocation,
        ...this.props,
      })
    }
    if (this.props.device.orientation !== prevProps.device.orientation) {
      if (!(this.isShow && this.isBoxShow) || this.state.isTouchProgress) {
        return
      }
      // 点采集，GPS打点类型为0
      (this.state.type || this.state.type === 0) &&
        this.changeHeight(this.props.device.orientation, this.state.type)
    }
  }

  changeHeight = async (orientation, type) => {
    if (!(this.isShow && this.isBoxShow)) {
      this.showToolbar()
      return
    }
    let data = ToolbarHeight.getToorbarHeight(orientation, type)
    this.height = data.height
    this.setState({
      column: data.column,
    })
    this.showToolbar()
    // if (this.state.type.indexOf('MAP_THEME_PARAM') >= 0) {
    //   this.isBoxShow && this.showToolbar()
    // } else {
    //   this.isShow && this.showToolbar()
    // }
  }

  getOriginType = () => {
    return this.originType
  }

  getType = () => {
    return this.type
  }

  showFullMap = () => {
    this.props.showFullMap && this.props.showFullMap(true)
  }

  existFullMap = () => {
    this.props.existFullMap && this.props.existFullMap()
  }

  getData = type => {
    let data, buttons, toolbarData
    // toolbarData = this.getCollectionData(type)
    toolbarData = ToolbarData.getTabBarData(type, {
      setToolbarVisible: this.setVisible,
      setLastState: this.setLastState,
      scrollListToLocation: this.scrollListToLocation,
      ...this.props,
    })
    data = toolbarData.data
    buttons = toolbarData.buttons
    if (data.length > 0) return { data, buttons }

    switch (type) {
      case ConstToolType.ATTRIBUTE_RELATE:
      case ConstToolType.ATTRIBUTE_SELECTION_RELATE:
        buttons = [ToolbarBtnType.CANCEL_2]
        break
      case ConstToolType.MAP_BASE:
        // data = BotMap
        break
      case ConstToolType.MAP3D_BASE:
        data = Map3DBaseMapList.baseListData
        // buttons = [ToolbarBtnType.CANCEL]
        buttons = []
        break
      case ConstToolType.MAP3D_ADD_LAYER:
        data = Map3DBaseMapList.layerListdata
        buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.COMMIT]
        break
      case ConstToolType.MAP_ADD_LAYER:
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.PLACEHOLDER,
          ToolbarBtnType.FLEX,
        ]
        break
      case ConstToolType.MAP_OPEN:
        //读取目录下UDB文件名和MAP文件名
        //
        // (async function() {
        //   //获取目录下的xml文件
        //   let absolutePath = await Utility.appendingHomeDirectory(ConstPath.LocalDataPath)
        //   let fileList = await Utility.getPathListByFilter(absolutePath, {
        //     extension: 'xml',
        //   })
        //   this.setState({
        //     data: fileList,
        //     showData: true,
        //   })
        // }.bind(this))
        // data = openData
        buttons = [ToolbarBtnType.CANCEL]
        break
      case ConstToolType.MAP_SYMBOL:
        // if (this.props.map.template && this.props.map.template.path) {
        //   buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX_FULL, ToolbarBtnType.COMMIT]
        // }
        // buttons = [ToolbarBtnType.CANCEL]
        break
      case ConstToolType.MAP_STYLE:
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.MENU_COMMIT,
        ]
        break
      case ConstToolType.GRID_STYLE:
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.MENU_COMMIT,
        ]
        break
      case ConstToolType.LINECOLOR_SET:
        data = lineColorSet
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.MENU_COMMIT,
        ]
        break
      case ConstToolType.POINTCOLOR_SET:
        data = pointColorSet
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.MENU_COMMIT,
        ]
        break
      case ConstToolType.LEGEND_NOT_VISIBLE:
        data = legendColor
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.VISIBLE,
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.MENU_COMMIT,
        ]
        break
      case ConstToolType.LEGEND:
        data = legendColor
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.NOT_VISIBLE,
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.MENU_COMMIT,
        ]
        break
      case ConstToolType.REGIONBEFORECOLOR_SET:
        data = regionBeforeColorSet
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.MENU_COMMIT,
        ]
        break
      case ConstToolType.REGIONAFTERCOLOR_SET:
        data = regionAfterColorSet
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.MENU_COMMIT,
        ]
        break
      case ConstToolType.MAP3D_SYMBOL:
        data = []
        buttons = [ToolbarBtnType.CLOSE_SYMBOL, ToolbarBtnType.FLEX]
        break
      case ConstToolType.MAP3D_BOX_CLIP:
      case ConstToolType.MAP3D_PLANE_CLIP:
      case ConstToolType.MAP3D_CROSS_CLIP:
        data = this.getClipData(type)
        buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.CLEAR]
        break
      case ConstToolType.MAP3D_TOOL:
        data = [
          {
            key: 'distanceMeasure',
            title: getLanguage(this.props.language).Map_Main_Menu
              .TOOLS_DISTANCE_MEASUREMENT,
            //'距离量算',
            action: () => {
              if (!GLOBAL.openWorkspace) {
                Toast.show(
                  getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE,
                )
                //'请打开场景')
                return
              }
              SScene.checkoutListener('startMeasure')
              SScene.setMeasureLineAnalyst({
                callback: result => {
                  this.Map3DToolBar &&
                    this.Map3DToolBar.setAnalystResult(result)
                  this.props.measureShow &&
                    this.props.measureShow(true, result + 'm')
                },
              })
              this.showAnalystResult(ConstToolType.MAP3D_TOOL_DISTANCEMEASURE)
            },
            size: 'large',
            image: require('../../../../assets/function/Frenchgrey/icon_analystLien.png'),
          },
          {
            key: 'suerfaceMeasure',
            title: getLanguage(this.props.language).Map_Main_Menu
              .TOOLS_AREA_MEASUREMENT,
            //''面积量算',
            action: () => {
              if (!GLOBAL.openWorkspace) {
                Toast.show(
                  getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE,
                )
                //'请打开场景')
                return
              }
              SScene.checkoutListener('startMeasure')
              SScene.setMeasureSquareAnalyst({
                callback: result => {
                  this.props.measureShow &&
                    this.props.measureShow(true, result + '㎡')
                },
              })
              this.showAnalystResult(ConstToolType.MAP3D_TOOL_SUERFACEMEASURE)
            },
            size: 'large',
            image: require('../../../../assets/function/Frenchgrey/icon_analystSuerface.png'),
          },
          {
            key: 'map3DPoint',
            title: getLanguage(this.props.language).Map_Main_Menu
              .TOOLS_3D_CREATE_POINT,
            //'兴趣点',
            action: () => {
              try {
                if (!GLOBAL.openWorkspace) {
                  Toast.show(
                    getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE,
                  )
                  //'请打开场景')
                  return
                }
                SScene.checkoutListener('startLabelOperate')
                GLOBAL.Map3DSymbol = true
                SScene.startDrawFavorite(
                  getLanguage(this.props.language).Prompt.POI,
                  {
                    callback: () => {
                      this.showToolbar()
                    },
                  },
                )
                this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINT)
              } catch (error) {
                Toast.show('兴趣点失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/function/Frenchgrey/icon_favorite.png'),
          },
          {
            key: 'map3DText',
            title: getLanguage(this.props.language).Map_Main_Menu
              .TOOLS_CREATE_TEXT,
            //''文字',
            action: () => {
              try {
                if (!GLOBAL.openWorkspace) {
                  Toast.show(
                    getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE,
                  )
                  //'请打开场景')
                  return
                }
                SScene.checkoutListener('startLabelOperate')
                GLOBAL.Map3DSymbol = true
                SScene.startDrawText({
                  callback: result => {
                    this.showToolbar()
                    let dialog = this.props.dialog()
                    dialog.setDialogVisible(true)
                    this.point = result
                  },
                })
                this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_TEXT)
              } catch (error) {
                Toast.show('添加文字失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/function/Frenchgrey/icon_text.png'),
          },
          {
            key: 'map3DPiontLine',
            title: getLanguage(this.props.language).Map_Main_Menu
              .TOOLS_CREATE_LINE,
            //''点绘线',
            action: () => {
              if (!GLOBAL.openWorkspace) {
                Toast.show(
                  getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE,
                )
                //'请打开场景')
                return
              }
              SScene.checkoutListener('startLabelOperate')
              GLOBAL.Map3DSymbol = true
              try {
                SScene.startDrawLine()
                this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINTLINE)
              } catch (error) {
                Toast.show('点绘线失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/function/Frenchgrey/icon_pointLine.png'),
          },
          {
            key: 'map3DPointSurface',
            title: getLanguage(this.props.language).Map_Main_Menu
              .TOOLS_CREATE_REGION,
            //''点绘面',
            action: () => {
              try {
                if (!GLOBAL.openWorkspace) {
                  Toast.show(
                    getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE,
                  )
                  //'请打开场景')
                  return
                }
                SScene.checkoutListener('startLabelOperate')
                GLOBAL.Map3DSymbol = true
                SScene.startDrawArea()
                this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINTSURFACE)
              } catch (error) {
                Toast.show('点绘面失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/function/Frenchgrey/icon_pointSuerface.png'),
          },
          {
            key: 'closeAllLable',
            title: getLanguage(this.props.language).Map_Main_Menu
              .TOOLS_CLEAN_PLOTTING,
            //''清除标注',
            action: () => {
              try {
                if (!GLOBAL.openWorkspace) {
                  Toast.show(
                    getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE,
                  )
                  //'请打开场景')
                  return
                }
                SScene.checkoutListener('startLabelOperate')
                GLOBAL.Map3DSymbol = true
                SScene.closeAllLabel()
                this.showToolbar(!this.isShow)
                this.props.existFullMap && this.props.existFullMap()
                GLOBAL.OverlayView.setVisible(false)
                // this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINTSURFACE)
              } catch (error) {
                Toast.show('清除失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/mapEdit/Frenchgrey/icon_clear.png'),
          },
          {
            key: 'action3d',
            title: getLanguage(this.props.language).Map_Main_Menu.TOOLS_SELECT,
            //''点选',
            action: () => {
              // try {
              //   if (GLOBAL.action3d === 'PAN3D') {
              //     SScene.setAction('PANSELECT3D')
              //     GLOBAL.action3d = 'PANSELECT3D'
              //     Toast.show('当前场景操作状态为可选')
              //   } else {
              //     SScene.clearSelection()
              //     SScene.setAction('PAN3D')
              //     GLOBAL.action3d = 'PAN3D'
              //     Toast.show('当前场景操作状态为不可选')
              //   }
              //   this.showToolbar(!this.isShow)
              //   this.props.existFullMap && this.props.existFullMap()
              //   GLOBAL.OverlayView.setVisible(false)
              // } catch (error) {
              //   Toast.show('操作失败')
              // }

              try {
                SScene.setAction('PANSELECT3D')
                GLOBAL.action3d = 'PANSELECT3D'
                GLOBAL.Map3DSymbol = true
                this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_SELECT)
              } catch (e) {
                Toast.show('操作失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/mapEdit/Frenchgrey/icon_action3d.png'),
          },
          {
            key: 'pointAnalyst',
            title: getLanguage(this.props.language).Map_Main_Menu
              .TOOLS_PATH_ANALYSIS,
            //''路径分析',
            action: () => {
              try {
                NavigationService.navigate('PointAnalyst', {
                  container: this.props.setContainerLoading
                    ? this.props.setContainerLoading
                    : {},
                  type: 'pointAnalyst',
                })
                this.showToolbar(!this.isShow)
                this.props.existFullMap && this.props.existFullMap()
                GLOBAL.OverlayView.setVisible(false)
              } catch (error) {
                Toast.show('操作失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/mapToolbar/icon_scene_pointAnalyst.png'),
          },
          {
            key: 'boxClip',
            title: getLanguage(this.props.language).Map_Main_Menu
              .TOOLS_BOX_CLIP,
            //'box裁剪',
            action: () => {
              if (!GLOBAL.openWorkspace) {
                Toast.show(
                  getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE,
                )
                //'请打开场景')
                return
              }
              try {
                // SScene.startDrawLine()
                GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(true)
                GLOBAL.currentToolbarType = ConstToolType.MAP_BOX_CLIP
                this.showMap3DTool(ConstToolType.MAP_BOX_CLIP)
              } catch (error) {
                Toast.show('点绘线失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/mapToolbar/icon_sence_box_clip.png'),
          },
          // {
          //   key: 'planeClip',
          //   title: getLanguage(this.props.language).Map_Main_Menu
          //     .TOOLS_PLANE_CLIP,
          //   //'平面裁剪',
          //   action: () => {
          //     if (!GLOBAL.openWorkspace) {
          //       Toast.show(
          //         getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE,
          //       )
          //       //'请打开场景')
          //       return
          //     }
          //     try {
          //       // SScene.startDrawLine()
          //       this.showMap3DTool(ConstToolType.MAP3D_PLANE_CLIP)
          //     } catch (error) {
          //       Toast.show('点绘线失败')
          //     }
          //   },
          //   size: 'large',
          //   image: require('../../../../assets/mapToolbar/icon_sence_plane_clip.png'),
          // },
          // {
          //   key: 'crossClip',
          //   title: getLanguage(this.props.language).Map_Main_Menu
          //     .TOOLS_CROSS_CLIP,
          //   //'cross裁剪',
          //   action: () => {
          //     if (!GLOBAL.openWorkspace) {
          //       Toast.show(
          //         getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE,
          //       )
          //       //'请打开场景')
          //       return
          //     }
          //     try {
          //       // SScene.startDrawLine()
          //       this.showMap3DTool(ConstToolType.MAP3D_CROSS_CLIP)
          //     } catch (error) {
          //       Toast.show('点绘线失败')
          //     }
          //   },
          //   size: 'large',
          //   image: require('../../../../assets/mapToolbar/icon_sence_cross_clip.png'),
          // },
        ]
        buttons = []
        break
    }
    return { data, buttons }
  }

  //滚动到顶部
  scrollListToLocation = () => {
    this.toolBarSectionList &&
      this.toolBarSectionList.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        viewOffset: scaleSize(80),
        viewPosition: 0,
      })
  }
  //滚动到指定位置
  scrollListTo = (sectionIndex, itemIndex) => {
    this.toolBarSectionList &&
      this.toolBarSectionList.scrollToLocation({
        sectionIndex: sectionIndex,
        itemIndex: itemIndex,
        viewOffset: scaleSize(80),
      })
  }

  /**点击item切换专题字段，刷新字段表达式列表 */
  refreshThemeExpression = async selectedExpression => {
    let dataset = this.expressionData.dataset
    let allExpressions = this.expressionData.list
    for (let index = 0; index < allExpressions.length; index++) {
      const element = allExpressions[index]
      if (element.expression === selectedExpression) {
        element.isSelected = true
      } else {
        element.isSelected = false
      }
    }
    let datalist = [
      {
        title: dataset.datasetName,
        datasetType: dataset.datasetType,
        expressionType: true,
        data: allExpressions,
      },
    ]
    this.setState({
      data: datalist,
    })
  }

  //专题图字段表达式列表
  getThemeExpress = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[3]
            : ConstToolType.THEME_HEIGHT[5],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      try {
        this.props.setContainerLoading &&
          this.props.setContainerLoading(
            true,
            getLanguage(this.props.language).Prompt.READING_DATA,
          )
        this.expressionData = await SThemeCartography.getThemeExpressionByLayerName(
          global.language,
          GLOBAL.currentLayer.name,
        )
        let selectedExpression
        let param = {
          LayerName: GLOBAL.currentLayer.name,
        }
        if (type === ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION) {
          selectedExpression = await SThemeCartography.getUniqueExpression(
            param,
          )
        } else if (type === ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION) {
          selectedExpression = await SThemeCartography.getRangeExpression(param)
        } else if (
          type === ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION
        ) {
          selectedExpression = await SThemeCartography.getUniformLabelExpression(
            param,
          )
        } else if (
          type === ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION
        ) {
          selectedExpression = await SThemeCartography.getUniqueLabelExpression(
            param,
          )
        } else if (
          type === ConstToolType.MAP_THEME_PARAM_RANGELABEL_EXPRESSION
        ) {
          selectedExpression = await SThemeCartography.getRangeLabelExpression(
            param,
          )
        } else if (
          type === ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION
        ) {
          selectedExpression = await SThemeCartography.getDotDensityExpression(
            param,
          )
        } else if (
          type === ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION
        ) {
          selectedExpression = await SThemeCartography.getGraduatedSymbolExpress(
            param,
          )
        }
        let dataset = this.expressionData.dataset
        let allExpressions = []
        // if (selectedExpression) {
        for (let i = 0; i < this.expressionData.list.length; i++) {
          let item = this.expressionData.list[i]
          if (ThemeMenuData.isThemeFieldTypeAvailable(item.fieldTypeStr)) {
            item.info = {
              infoType: 'fieldType',
              fieldType: item.fieldType,
            }
            item.isSelected = item.expression === selectedExpression
            allExpressions.push(item)
          }
        }
        this.expressionData.list = allExpressions //add xiezhy 过滤结果就应该保存
        // }
        // allExpressions.forEach(item => {
        //   item.info = {
        //     infoType: 'fieldType',
        //     fieldType: item.fieldType,
        //   }
        // })
        let datalist = [
          {
            title: dataset.datasetName,
            datasetType: dataset.datasetType,
            expressionType: true,
            data: allExpressions,
          },
        ]
        this.setState(
          {
            isFullScreen: false,
            isTouchProgress: false,
            showMenuDialog: false,
            containerType: 'list',
            data: datalist,
            type: type,
            buttons: ThemeMenuData.getThemeFourMenu(),
            selectName: name,
            selectKey: key,
          },
          () => {
            this.height =
              this.props.device.orientation === 'LANDSCAPE'
                ? ConstToolType.THEME_HEIGHT[3]
                : ConstToolType.THEME_HEIGHT[5]
            this.scrollListToLocation()
            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            this.updateOverlayerView()
          },
        )
      } catch (e) {
        this.props.setContainerLoading && this.props.setContainerLoading(false)
      }
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //统计专题图字段表达式列表（多选）
  getGraphThemeExpressions = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[3]
            : ConstToolType.THEME_HEIGHT[5],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      try {
        this.props.setContainerLoading &&
          this.props.setContainerLoading(
            true,
            getLanguage(this.props.language).Prompt.READING_DATA,
          )
        this.expressionData = await SThemeCartography.getThemeExpressionByLayerName(
          global.language,
          GLOBAL.currentLayer.name,
        )
        let dataset = this.expressionData.dataset
        let allExpressions = []
        let param = {
          LayerName: GLOBAL.currentLayer.name,
        }
        let expressions = await SThemeCartography.getGraphExpressions(param)
        let selectedExpressions = expressions.list //已选择的字段列表
        let listExpressionsArr = []

        for (let i = 0; i < this.expressionData.list.length; i++) {
          let item = this.expressionData.list[i]
          if (ThemeMenuData.isThemeFieldTypeAvailable(item.fieldTypeStr)) {
            if (selectedExpressions) {
              for (let index = 0; index < selectedExpressions.length; index++) {
                let temp = {}
                temp[selectedExpressions[index]] = false
                item.isSelected = item.expression === selectedExpressions[index]
                if (item.isSelected === true) {
                  //add xiezhy
                  listExpressionsArr.push(temp)
                  break
                }
              }
            } else {
              item.isSelected = false
            }
            item.info = {
              infoType: 'fieldType',
              fieldType: item.fieldType,
            }

            allExpressions.push(item)
          }
        }

        // allExpressions.forEach(item => {
        //   item.info = {
        //     infoType: 'fieldType',
        //     fieldType: item.fieldType,
        //   }
        // })
        let datalist = [
          {
            title: dataset.datasetName,
            datasetType: dataset.datasetType,
            expressionType: true,
            data: allExpressions,
          },
        ]
        let listExpressionsObj = {}
        listExpressionsObj[dataset.datasetName] = listExpressionsArr
        // listExpressionsObj[.push(]tt,selectedExpressions)
        this.setState(
          {
            isFullScreen: false,
            isTouchProgress: false,
            showMenuDialog: false,
            listSelectable: true, //单选框
            containerType: 'list',
            data: datalist,
            type: type,
            buttons: ThemeMenuData.getThemeGraphMenu(),
            selectName: name,
            selectKey: key,
            listExpressions: listExpressionsObj,
          },
          () => {
            this.height =
              this.props.device.orientation === 'LANDSCAPE'
                ? ConstToolType.THEME_HEIGHT[3]
                : ConstToolType.THEME_HEIGHT[5]
            this.scrollListToLocation()
            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            this.updateOverlayerView()
          },
        )
      } catch (e) {
        this.props.setContainerLoading && this.props.setContainerLoading(false)
      }
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //统计专题图统计值计算方法
  getGraphThemeGradutedMode = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[8]
            : ConstToolType.THEME_HEIGHT[8],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      let date = await ThemeMenuData.getGraphThemeGradutedMode()
      this.setState(
        {
          isFullScreen: false,
          isTouchProgress: false,
          showMenuDialog: false,
          containerType: 'table',
          listSelectable: false, //单选框
          column: 3,
          tableType: 'normal',
          data: date,
          type: type,
          buttons: ThemeMenuData.getThemeGraphMenu(),
          selectName: name,
          selectKey: key,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[0]
              : ConstToolType.THEME_HEIGHT[2]
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //等级符号专题图分级方式
  getGraduatedSymbolGradutedMode = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[8]
            : ConstToolType.THEME_HEIGHT[8],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      let date = await ThemeMenuData.getGraduatedSymbolGradutedMode()
      this.setState(
        {
          isFullScreen: false,
          isTouchProgress: false,
          showMenuDialog: false,
          containerType: 'table',
          listSelectable: false, //单选框
          column: 3,
          tableType: 'normal',
          data: date,
          type: type,
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectName: name,
          selectKey: key,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[0]
              : ConstToolType.THEME_HEIGHT[2]
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //统计专题图颜色方案列表
  getGraphThemeColorScheme = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[3]
            : ConstToolType.THEME_HEIGHT[5],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      try {
        this.props.setContainerLoading &&
          this.props.setContainerLoading(
            true,
            getLanguage(this.props.language).Prompt.READING_DATA,
          )
        let list = await ThemeMenuData.getThemeGraphColorScheme()
        let datalist = [
          {
            title: getLanguage(this.props.language).Map_Main_Menu
              .THEME_COLOR_SCHEME,
            //'颜色方案',
            data: list,
          },
        ]
        this.setState(
          {
            isFullScreen: false,
            isTouchProgress: false,
            showMenuDialog: false,
            containerType: 'list',
            listSelectable: false, //单选框
            data: datalist,
            type: type,
            buttons: ThemeMenuData.getThemeGraphMenu(),
            selectName: name,
            selectKey: key,
          },
          () => {
            this.height =
              this.props.device.orientation === 'LANDSCAPE'
                ? ConstToolType.THEME_HEIGHT[3]
                : ConstToolType.THEME_HEIGHT[5]
            this.scrollListToLocation()

            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            this.updateOverlayerView()
          },
        )
      } catch (e) {
        this.props.setContainerLoading && this.props.setContainerLoading(false)
      }
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //修改统计专题图类型
  changeGraphType = async (type = ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE) => {
    this.isBoxShow = !this.isBoxShow
    if (this.state.type !== ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE) {
      this.isBoxShow = true
    }
    this.height =
      this.props.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[8]
        : ConstToolType.THEME_HEIGHT[8]
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue: this.isBoxShow ? this.height : 0,
        duration: Const.ANIMATED_DURATION,
      }).start()
    }.bind(this)

    let setData = async function() {
      let date = await ThemeMenuData.getThemeGraphType()
      this.setState(
        {
          isFullScreen: false,
          isTouchProgress: false,
          showMenuDialog: false,
          containerType: 'horizontalTable',
          listSelectable: false, //单选框
          column: 4,
          data: date,
          type: type,
          buttons: ThemeMenuData.getThemeGraphMenu(),
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[0]
              : ConstToolType.THEME_HEIGHT[2]
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //单值专题图颜色方案列表
  getUniqueColorScheme = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[3]
            : ConstToolType.THEME_HEIGHT[5],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      try {
        this.props.setContainerLoading &&
          this.props.setContainerLoading(
            true,
            getLanguage(this.props.language).Prompt.READING_DATA,
          )
        let list = await ThemeMenuData.getUniqueColorScheme()
        let datalist = [
          {
            title: getLanguage(this.props.language).Map_Main_Menu
              .THEME_COLOR_SCHEME,
            //'颜色方案',
            data: list,
          },
        ]
        this.setState(
          {
            isFullScreen: false,
            isTouchProgress: false,
            showMenuDialog: false,
            containerType: 'list',
            data: datalist,
            type: type,
            buttons: ThemeMenuData.getThemeFourMenu(),
            selectName: name,
            selectKey: key,
          },
          () => {
            this.height =
              this.props.device.orientation === 'LANDSCAPE'
                ? ConstToolType.THEME_HEIGHT[3]
                : ConstToolType.THEME_HEIGHT[5]
            this.scrollListToLocation()

            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            this.updateOverlayerView()
          },
        )
      } catch (e) {
        this.props.setContainerLoading && this.props.setContainerLoading(false)
      }
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //分段专题图颜色方案列表
  getRangeColorScheme = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[3]
            : ConstToolType.THEME_HEIGHT[5],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      try {
        this.props.setContainerLoading &&
          this.props.setContainerLoading(
            true,
            getLanguage(this.props.language).Prompt.READING_DATA,
          )
        let list = await ThemeMenuData.getRangeColorScheme()
        let datalist = [
          {
            title: getLanguage(this.props.language).Map_Main_Menu
              .THEME_COLOR_SCHEME,
            //'颜色方案',
            data: list,
          },
        ]
        this.setState(
          {
            isFullScreen: false,
            isTouchProgress: false,
            showMenuDialog: false,
            containerType: 'list',
            data: datalist,
            type: type,
            buttons: ThemeMenuData.getThemeFourMenu(),
            selectName: name,
            selectKey: key,
          },
          () => {
            this.height =
              this.props.device.orientation === 'LANDSCAPE'
                ? ConstToolType.THEME_HEIGHT[3]
                : ConstToolType.THEME_HEIGHT[5]
            this.scrollListToLocation()

            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            this.updateOverlayerView()
          },
        )
      } catch (e) {
        this.props.setContainerLoading && this.props.setContainerLoading(false)
      }
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //热力图颜色方案列表
  getAggregationColorScheme = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[3]
            : ConstToolType.THEME_HEIGHT[5],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      try {
        this.props.setContainerLoading &&
          this.props.setContainerLoading(
            true,
            getLanguage(this.props.language).Prompt.READING_DATA,
          )
        let list = await ThemeMenuData.getAggregationColorScheme()
        let datalist = [
          {
            title: getLanguage(this.props.language).Map_Main_Menu
              .THEME_HEATMAP_COLOR,
            //'颜色方案',
            data: list,
          },
        ]
        this.setState(
          {
            isFullScreen: false,
            isTouchProgress: false,
            showMenuDialog: false,
            containerType: 'list',
            data: datalist,
            type: type,
            buttons: ThemeMenuData.getThemeFourMenu(),
            selectName: name,
            selectKey: key,
          },
          () => {
            this.height =
              this.props.device.orientation === 'LANDSCAPE'
                ? ConstToolType.THEME_HEIGHT[3]
                : ConstToolType.THEME_HEIGHT[5]
            this.scrollListToLocation()

            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            this.updateOverlayerView()
          },
        )
      } catch (e) {
        this.props.setContainerLoading && this.props.setContainerLoading(false)
      }
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  getColorGradientType = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[3]
            : ConstToolType.THEME_HEIGHT[5],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      try {
        this.props.setContainerLoading &&
          this.props.setContainerLoading(
            true,
            getLanguage(this.props.language).Prompt.READING_DATA,
          )
        let list = await ThemeMenuData.getColorGradientType()
        let datalist = [
          {
            title: getLanguage(this.props.language).Map_Main_Menu
              .THEME_COLOR_SCHEME,
            //'颜色方案',
            data: list,
          },
        ]
        this.setState(
          {
            isFullScreen: false,
            isTouchProgress: false,
            showMenuDialog: false,
            containerType: 'list',
            data: datalist,
            type: type,
            buttons: ThemeMenuData.getThemeFourMenu(),
            selectName: name,
            selectKey: key,
          },
          () => {
            this.height =
              this.props.device.orientation === 'LANDSCAPE'
                ? ConstToolType.THEME_HEIGHT[3]
                : ConstToolType.THEME_HEIGHT[5]
            this.scrollListToLocation()

            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            this.updateOverlayerView()
          },
        )
      } catch (e) {
        this.props.setContainerLoading && this.props.setContainerLoading(false)
      }
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  getRangeMode = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[0]
            : ConstToolType.THEME_HEIGHT[2],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      let date = await ThemeMenuData.getRangeMode()
      this.setState(
        {
          isFullScreen: false,
          isTouchProgress: false,
          showMenuDialog: false,
          containerType: 'table',
          column: 4,
          tableType: 'normal',
          data: date,
          type: type,
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectName: name,
          selectKey: key,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[0]
              : ConstToolType.THEME_HEIGHT[2]
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  getGridRangeMode = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[0]
            : ConstToolType.THEME_HEIGHT[0],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      let date = await ThemeMenuData.getGridRangeMode()
      this.setState(
        {
          isFullScreen: false,
          isTouchProgress: false,
          showMenuDialog: false,
          containerType: 'table',
          column: 3,
          tableType: 'normal',
          data: date,
          type: type,
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectName: name,
          selectKey: key,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[0]
              : ConstToolType.THEME_HEIGHT[2]
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  getRangeParameter = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = false
    }.bind(this)

    let setData = async function() {
      this.setState(
        {
          isFullScreen: true,
          selectName: name || 'range_parameter',
          isTouchProgress: true,
          showMenuDialog: false,
          type: type,
          // buttons: ThemeMenuData.getThemeThreeMenu(),
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectKey: key,
          data: [],
        },
        () => {
          this.height = 0
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //专题图中统计符号显示的最大值(倍数)
  getGraphMaxValue = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = false
    }.bind(this)

    let setData = async function() {
      this.setState(
        {
          isFullScreen: true,
          selectName: name,
          isTouchProgress: true,
          showMenuDialog: false,
          type: type,
          buttons: ThemeMenuData.getThemeGraphMenu(),
          selectKey: key,
          data: [],
        },
        () => {
          this.height = 0
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //点密度基础值，点大小
  getDotDensityValueAndDotsize = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = false
    }.bind(this)

    let setData = async function() {
      this.setState(
        {
          isFullScreen: true,
          selectName: name, //'单点代表值' ，'符号大小'
          isTouchProgress: true,
          showMenuDialog: false,
          type: type,
          // buttons: ThemeMenuData.getThemeThreeMenu(),
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectKey: key,
          data: [],
        },
        () => {
          this.height = 0
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //热力图参数
  getHeatmapParams = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = false
    }.bind(this)

    let setData = async function() {
      this.setState(
        {
          isFullScreen: true,
          selectName: name, //'核半径' ，'颜色渐变模糊度', '最大颜色权重'
          isTouchProgress: true,
          showMenuDialog: false,
          type: type,
          // buttons: ThemeMenuData.getThemeThreeMenu(),
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectKey: key,
          data: [],
        },
        () => {
          this.height = 0
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //等级符号基准值,点符号大小
  getGraduatedSymbolBaseValueAndSymbolSize = async (
    type,
    key = '',
    name = '',
  ) => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = false
    }.bind(this)

    let setData = async function() {
      this.setState(
        {
          isFullScreen: true,
          selectName: name, //基准值，符号大小
          isTouchProgress: true,
          showMenuDialog: false,
          type: type,
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectKey: key,
          data: [],
        },
        () => {
          this.height = 0
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  getLabelBackShape = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[0]
            : ConstToolType.THEME_HEIGHT[2],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      let date = await ThemeMenuData.getLabelBackShape()
      this.setState(
        {
          isFullScreen: false,
          isTouchProgress: false,
          showMenuDialog: false,
          containerType: 'table',
          column: 4,
          tableType: 'normal',
          data: date,
          type: type,
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectName: name,
          selectKey: key,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[0]
              : ConstToolType.THEME_HEIGHT[2]
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  //各种专题图的颜色值选择
  getColorTable = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[7]
            : ConstToolType.THEME_HEIGHT[3],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      let date = await ThemeMenuData.getColorTable()
      this.setState(
        {
          isFullScreen: false,
          isTouchProgress: false,
          showMenuDialog: false,
          containerType: 'colortable',
          column: 8,
          tableType: 'scroll',
          data: date,
          type: type,
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectName: name,
          selectKey: key,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[7]
              : ConstToolType.THEME_HEIGHT[3]
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  /** 态势推演动画列表*/
  showAnimation = async type => {
    let { data, buttons } = await this.getAnimationlist()
    this.props.showFullMap && this.props.showFullMap(true)
    this.setState(
      {
        type: type,
        data: data,
        buttons: buttons,
        containerType: 'list',
        isFullScreen: true,
      },
      () => {
        this.height =
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.HEIGHT[2]
            : ConstToolType.HEIGHT[3]
        this.showToolbar()
        this.updateOverlayerView()
      },
    )
  }

  getAnimationlist = async () => {
    try {
      // let data = []
      let mapName = await SMap.getMapName()
      // path =
      //   (await FileTools.appendingHomeDirectory(
      //     _params.user && _params.user.currentUser.userName
      //       ? ConstPath.UserPath + _params.user.currentUser.userName + '/'
      //       : ConstPath.CustomerPath,
      //   // )) + ConstPath.RelativeFilePath.Animation+mapName
      //   )) + ConstPath.RelativeFilePath.Animation+'plot'

      let userName = this.props.user.currentUser.userName || 'Customer'
      let path = await FileTools.appendingHomeDirectory(
        // ConstPath.UserPath + userName + '/' + ConstPath.RelativeFilePath.Animation+'plot',
        ConstPath.UserPath +
          userName +
          '/' +
          ConstPath.RelativeFilePath.Animation +
          mapName +
          '/',
      )
      let animationXmlList = []
      let arrDirContent = await FileTools.getDirectoryContent(path)
      if (arrDirContent.length > 0) {
        let i = 0
        for (let key in arrDirContent) {
          if (arrDirContent[key].type === 'file') {
            // let dirPath = path + arrDirContent[key].name
            let item = {}
            item.title = arrDirContent[key].name.split('.')[0]
            item.index = i
            item.path = path + arrDirContent[key].name
            animationXmlList.push(item)
            i++
          }
        }
      }

      if (animationXmlList.length == 0) {
        Toast.show(
          getLanguage(this.props.language).Prompt.NO_PLOTTING_DEDUCTION,
          //'当前场景无态势推演'
        )
      } else {
        SMap.initAnimation()
      }

      // let flydata = await SScene.getFlyRouteNames()
      let data = [
        {
          title: getLanguage(this.props.language).Map_Main_Menu
            .PLOTTING_ANIMATION_DEDUCTION,
          // '态势推演列表',
          data: animationXmlList,
        },
      ]
      let buttons = []
      return { data, buttons }
    } catch (error) {
      let buttons = []
      let data = [
        {
          title: getLanguage(this.props.language).Map_Main_Menu
            .PLOTTING_ANIMATION_DEDUCTION,
          // '态势推演列表',
          data: [],
        },
      ]
      Toast.show(
        getLanguage(this.props.language).Prompt.NO_PLOTTING_DEDUCTION,
        //'当前场景无态势推演'
      )
      return { data, buttons }
    }
  }
  getLabelFontName = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[2]
            : ConstToolType.THEME_HEIGHT[3],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      let date = await ThemeMenuData.getLabelFontName()
      this.setState(
        {
          isFullScreen: false,
          isTouchProgress: false,
          showMenuDialog: false,
          containerType: 'table',
          column: 4,
          tableType: 'normal',
          data: date,
          type: type,
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectName: name,
          selectKey: key,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[2]
              : ConstToolType.THEME_HEIGHT[3]
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  getLabelFontRotation = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue: ConstToolType.THEME_HEIGHT[0],
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = true
    }.bind(this)

    let setData = async function() {
      let date = await ThemeMenuData.getLabelFontRotation()
      this.setState(
        {
          isFullScreen: false,
          isTouchProgress: false,
          showMenuDialog: false,
          containerType: 'table',
          column: 4,
          tableType: 'normal',
          data: date,
          type: type,
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectName: name,
          selectKey: key,
        },
        () => {
          this.height = ConstToolType.THEME_HEIGHT[0]
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  getLabelFontSize = async (type, key = '', name = '') => {
    let showBox = function() {
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = false
    }.bind(this)

    let setData = function() {
      this.setState(
        {
          isFullScreen: true,
          isTouchProgress: true,
          showMenuDialog: false,
          type: type,
          // buttons: ThemeMenuData.getThemeThreeMenu(),
          buttons: ThemeMenuData.getThemeFourMenu(),
          selectName: name || 'fontsize',
          selectKey: key,
          data: [],
        },
        () => {
          this.height = 0
          this.updateOverlayerView()
        },
      )
    }.bind(this)

    if (!this.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }

  getflylist = async () => {
    try {
      let flydata = await SScene.getFlyRouteNames()
      let data = [
        {
          title: getLanguage(this.props.language).Map_Main_Menu.FLY_ROUTE,
          // '飞行轨迹列表',
          data: flydata,
        },
      ]
      // let buttons = [ToolbarBtnType.END_FLY, ToolbarBtnType.FLEX]
      let buttons = []
      return { data, buttons }
    } catch (error) {
      let buttons = []
      let data = [
        {
          title: getLanguage(this.props.language).Map_Main_Menu.FLY_ROUTE,
          // '飞行轨迹列表',
          data: [],
        },
      ]
      Toast.show(
        getLanguage(this.props.language).Prompt.NO_FLY,
        //'当前场景无飞行轨迹'
      )
      return { data, buttons }
    }
  }

  getWorkspaceList = async () => {
    try {
      // let buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      let buttons = []
      let data = []
      let userName = this.props.user.currentUser.userName || 'Customer'
      let path = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath + userName + '/' + ConstPath.RelativeFilePath.Scene,
      )
      let result = await FileTools.fileIsExist(path)
      if (result) {
        let fileList = await FileTools.getPathListByFilter(path, {
          extension: 'pxp',
          type: 'file',
        })
        for (let index = 0; index < fileList.length; index++) {
          let element = fileList[index]
          if (element.name.indexOf('.pxp') > -1) {
            fileList[index].name = element.name.substr(
              0,
              element.name.lastIndexOf('.'),
            )
            data.push(element)
          }
        }
      }
      return { data, buttons }
    } catch (error) {
      Toast.show('无场景列表')
    }
  }

  showMap3DSymbol = async () => {
    if (!GLOBAL.openWorkspace) {
      Toast.show(getLanguage(this.props.language).Prompt.PLEASE_OPEN_SCENE)
      //'请打开场景')
      return
    }
    SScene.checkoutListener('startLabelOperate')
    GLOBAL.Map3DSymbol = true
    // TODO 根据符号类型改变ToolBox内容
    this.setVisible(true, ConstToolType.MAP3D_SYMBOL, {
      containerType: 'table',
      isFullScreen: true,
      height:
        this.props.device.orientation === 'LANDSCAPE'
          ? ConstToolType.HEIGHT[0]
          : ConstToolType.HEIGHT[2],
      column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
    })
  }

  importMap3Dworkspace = async () => {
    // let buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
    // let userName = this.props.user.currentUser.userName || 'Customer'
    // let path = await FileTools.appendingHomeDirectory(
    //   ConstPath.UserPath + userName + '/' + ConstPath.RelativePath.ExternalData,
    // )
    // let result = await FileTools.getFilterFiles(path)
    // let data=[]
    // let data = await NativeMethod.getTemplates(
    //   this.props.user.currentUser.userName
    //     ? this.props.user.currentUser.userName
    //     : 'Customer',
    // )
    // return { data, buttons }
  }

  /** 记录Toolbar上一次的state **/
  setLastState = () => {
    Object.assign(this.lastState, this.state, { height: this.height })
  }

  /** 三维单体触控属性事件 */

  showMap3DAttribute = async data => {
    let list = []
    Object.keys(data).forEach(key => {
      list.push({
        name: key,
        value: data[key],
      })
    })
    JSON.stringify(data) !== '{}' &&
      this.setState(
        {
          type: ConstToolType.MAP3D_ATTRIBUTE,
          data: list,
          buttons: [ToolbarBtnType.CLEAR_ATTRIBUTE],
          // height: ConstToolType.HEIGHT[0],
          // column: data.length,
          isFullScreen: false,
          containerType: 'list',
        },
        () => {
          if (list.length > 2) {
            this.height = ConstToolType.HEIGHT[2]
          } else if (list.length === 1) {
            this.height = scaleSize(61)
          } else {
            this.height = scaleSize(122)
          }
          this.showToolbar()
          this.updateOverlayerView()
        },
      )
    JSON.stringify(data) === '{}' &&
      this.showToolbar(false) &&
      this.props.existFullMap &&
      this.props.existFullMap()
  }

  /** 三维分析结果显示 */
  showAnalystResult = type => {
    this.setState(
      {
        type: type,
        data: [],
        buttons: [ToolbarBtnType.CLOSE_ANALYST, ToolbarBtnType.CLEAR],
        isFullScreen: false,
        // height: ConstToolType.HEIGHT[0],
        // column: data.length,
        containerType: 'list',
      },
      () => {
        // this.createCollector(type)
        this.height = 0
        this.showToolbar()
        this.updateOverlayerView()
      },
    )
  }

  /** 三维分类点击事件*/
  showMap3DTool = async type => {
    if (type === ConstToolType.MAP3D_TOOL_FLYLIST) {
      let { data, buttons } = await this.getflylist()
      this.props.showFullMap && this.props.showFullMap(true)
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          containerType: 'list',
          isFullScreen: true,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.HEIGHT[2]
              : ConstToolType.HEIGHT[3]
          this.showToolbar()
          this.updateOverlayerView()
        },
      )
    } else if (type === ConstToolType.MAP3D_WORKSPACE_LIST) {
      let { data, buttons } = await this.getWorkspaceList()
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          containerType: 'list',
          isFullScreen: true,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.HEIGHT[2]
              : ConstToolType.HEIGHT[3]
          this.showToolbar()
          this.updateOverlayerView()
        },
      )
    } else if (type === ConstToolType.MAP3D_IMPORTWORKSPACE) {
      let { data, buttons } = await this.importMap3Dworkspace()
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          containerType: 'list',
          isFullScreen: false,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.HEIGHT[2]
              : ConstToolType.HEIGHT[3]
          this.showToolbar()
          this.updateOverlayerView()
        },
      )
    } else if (type === ConstToolType.MAP3D_SYMBOL_SELECT) {
      let { data, buttons } = this.getData(type)
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          containerType: 'table',
          isFullScreen: false,
          column: 3,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.HEIGHT[0]
              : ConstToolType.HEIGHT[0]
          this.showToolbar()
          this.updateOverlayerView()
        },
      )
    } else if (type === ConstToolType.MAP3D_CIRCLEFLY) {
      this.props.showFullMap && this.props.showFullMap(true)
      let { data, buttons } = this.getData(type)
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          containerType: 'table',
          isFullScreen: false,
          column: 1,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.HEIGHT[0]
              : ConstToolType.HEIGHT[0]
          this.showToolbar()
          this.updateOverlayerView()
        },
      )
    } else if (
      type === ConstToolType.MAP3D_BOX_CLIP ||
      type === ConstToolType.MAP3D_PLANE_CLIP ||
      type === ConstToolType.MAP3D_CROSS_CLIP
    ) {
      let { data, buttons } = this.getData(type)
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          containerType: 'list',
          isFullScreen: false,
          column: 1,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.TOOLBAR_HEIGHT[5]
              : ConstToolType.TOOLBAR_HEIGHT[5]
          this.showToolbar()
          this.updateOverlayerView()
        },
      )
    } else {
      let { data, buttons } = this.getData(type)
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          column: data.length,
          containerType: 'table',
          isFullScreen: false,
        },
        () => {
          switch (type) {
            case ConstToolType.MAP3D_TOOL_FLY:
              this.height = ConstToolType.HEIGHT[0]
              this.showToolbar()
              // this.updateOverlayerView()
              break

            case ConstToolType.MAP3D_TOOL_NEWFLY:
              this.height = ConstToolType.HEIGHT[0]
              this.showToolbar()
              // this.updateOverlayerView()
              break
            default:
              this.height = 0
              this.showToolbar()
              break
          }
          this.updateOverlayerView()
        },
      )
    }
  }

  /** 推演动画播放事件*/
  showPlotAnimationTool = async type => {
    if (type === ConstToolType.MAP_PLOTTING_ANIMATION_ITEM) {
      let { data, buttons } = this.getData(type)
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          column: data.length,
          containerType: 'table',
          isFullScreen: false,
        },
        () => {
          this.height = ConstToolType.HEIGHT[0]
          this.showToolbar()
          this.updateOverlayerView()
        },
      )

      // this.props.showFullMap && this.props.showFullMap(true)
      // this.setState(
      //   {
      //     type: type,
      //     data: data,
      //     buttons: buttons,
      //     containerType: 'list',
      //     isFullScreen: true,
      //   },
      //   () => {
      //     this.height =
      //       this.props.device.orientation === 'LANDSCAPE'
      //         ? ConstToolType.HEIGHT[2]
      //         : ConstToolType.HEIGHT[3]
      //     this.showToolbar()
      //     this.updateOverlayerView()
      //   },
      // )
    }
  }

  /** 拍照 **/
  takePhoto = () => {}

  /**
   * 设置遮罩层的显隐
   * @param visible
   */
  setOverlayViewVisible = visible => {
    GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(visible)
  }

  //更新遮盖层状态
  updateOverlayerView = () => {
    if (this.isShow) {
      if (this.state.isTouchProgress || this.state.showMenuDialog) {
        this.setOverlayViewVisible(false)
      } else {
        this.setOverlayViewVisible(this.state.isFullScreen)
      }
    } else {
      this.setOverlayViewVisible(false)
    }
  }

  /**
   * 设置是否显示
   * isShow: 是否显示
   * type:   显示数据类型
   * params: {
   *   isFullScreen:    是否全屏，
   *   height:          工具栏高度
   *   column:          表格列数（仅table可用）
   *   containerType:   容器的类型, list | table
   * }
   **/
  setVisible = (isShow, type = this.state.type, params = {}) => {
    if (isShow && GLOBAL.TouchType != TouchType.ANIMATION_WAY) {
      GLOBAL.TouchType = TouchType.NULL
      GLOBAL.bubblePane && GLOBAL.bubblePane.reset() // 重置气泡提示
    }
    this.setOverlayViewVisible(isShow)

    if (type === ConstToolType.MAP_STYLE) {
      if (this.props.currentLayer && !this.currentLayerStyle) {
        SCartography.getLayerStyle(this.props.currentLayer.name).then(value => {
          this.currentLayerStyle = value
        })
      }
    }
    if (this.state.type === ConstToolType.MAP3D_CIRCLEFLY) {
      SScene.stopCircleFly()
      // SScene.clearCirclePoint()
    }
    if (type === ConstToolType.MAP3D_WORKSPACE_LIST) {
      this.showMap3DTool(type)
      return
    }
    if (type === ConstToolType.MAP3D_IMPORTWORKSPACE) {
      this.showMap3DTool(type)
      return
    }
    if (type === ConstToolType.MAP_PLOTTING_ANIMATION && isShow) {
      this.showAnimation(type)
      // return
    }
    if (type === ConstToolType.PLOT_ANIMATION_XML_LIST && isShow) {
      this.showAnimation(type)
      // return
    }
    if (
      this.isShow !== isShow ||
      this.state.type !== type ||
      params.isFullScreen !== this.state.isFullScreen ||
      params.height !== this.height ||
      params.column !== this.state.column ||
      params.buttons !== this.state.buttons ||
      params.selectKey !== this.state.selectKey
    ) {
      let { data, buttons } = this.getData(type)
      params.createThemeByLayer &&
        ThemeMenuData.setLayerNameCreateTheme(params.createThemeByLayer)
      this.originType = type
      let newHeight =
        params && typeof params.height === 'number'
          ? params.height
          : ConstToolType.HEIGHT[1]
      this.shareTo = params.shareTo || ''

      this.setState(
        {
          showMenuDialog: params.showMenuDialog || false,
          type: type,
          tableType: params.tableType || 'normal',
          data: params.data || data,
          buttons: params.buttons || buttons,
          listSelectable: params.listSelectable || false,
          isFullScreen:
            params && params.isFullScreen !== undefined
              ? params.isFullScreen
              : DEFAULT_FULL_SCREEN,
          column:
            params && typeof params.column === 'number'
              ? params.column
              : DEFAULT_COLUMN,
          containerType:
            params && params.containerType
              ? params.containerType
              : type === ConstToolType.MAP_SYMBOL
                ? tabs
                : table,
          themeType: params && params.themeType ? params.themeType : '',
          selectKey: params && params.selectKey ? params.selectKey : '',
          selectName: params && params.selectName ? params.selectName : '',
          themeSymbolType:
            params && params.themeSymbolType ? params.themeSymbolType : '',
        },
        () => {
          // if (!showViewFirst) {
          this.height = newHeight
          this.showToolbarAndBox(isShow, type)
          !isShow && this.props.existFullMap && this.props.existFullMap()
          // }
          if (params.cb) {
            setTimeout(() => params.cb(), Const.ANIMATED_DURATION_2)
          }
          this.updateOverlayerView()
        },
      )
    } else {
      this.showToolbarAndBox(isShow)
      if (params.cb) {
        setTimeout(() => params.cb(), Const.ANIMATED_DURATION_2)
      }
      !isShow && this.props.existFullMap && this.props.existFullMap()
      this.updateOverlayerView()
    }
  }

  getState = () => {
    return {
      type: this.state.type, // 当前传入的类型
      containerType: this.state.containerType,
      isFullScreen: this.state.isFullScreen,
      isShow: this.isShow,
    }
  }

  showToolbarAndBox = (isShow, type = this.state.type) => {
    let animatedList = []
    //let keyboardHeight = this.keyboardHeight ? 344 : 0
    //标注 如果横屏高度不够键盘弹起，则部分弹起，除掉底部功能栏
    // if (
    //   this.props.device.height - ConstToolType.NEWTHEME_HEIGHT[2] <
    //   keyboardHeight
    // ) {
    //   keyboardHeight -= Const.BOTTOM_HEIGHT
    // }
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      animatedList.push(
        Animated.timing(this.state.bottom, {
          toValue: isShow
            ? 0
            : -(this.props.device.height >= this.props.device.width
              ? this.props.device.height
              : this.props.device.width),
          duration: Const.ANIMATED_DURATION,
        }),
      )
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    let bottom = parseFloat(JSON.stringify(this.state.bottom))
    if (
      type === ConstToolType.MAP_THEME_PARAM ||
      type === ConstToolType.MAP_THEME_PARAM_GRAPH
    ) {
      animatedList.push(
        Animated.timing(this.state.boxHeight, {
          toValue: 0,
          duration: Const.ANIMATED_DURATION,
        }),
      )
      this.isBoxShow = false
    } else {
      if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
        let boxAnimated = Animated.timing(this.state.boxHeight, {
          toValue: this.height,
          duration: Const.ANIMATED_DURATION,
        })
        this.state.boxHeight === 0 && bottom >= 0
          ? animatedList.unshift(boxAnimated)
          : animatedList.push(boxAnimated)
      }
      this.isBoxShow = true
    }
    if (bottom < 0) {
      animatedList.forEach(animated => animated.start())
    } else {
      Animated.sequence(animatedList).start()
    }
  }

  showToolbar = (isShow, cb = () => {}) => {
    let animatedList = []
    // Toolbar的显示和隐藏
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      animatedList.push(
        Animated.timing(this.state.bottom, {
          toValue: isShow ? 0 : -this.props.device.height,
          duration: Const.ANIMATED_DURATION,
        }),
      )
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    let bottom = parseFloat(JSON.stringify(this.state.bottom))
    if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
      let boxAnimated = Animated.timing(this.state.boxHeight, {
        toValue: this.height,
        duration: Const.ANIMATED_DURATION,
      })
      this.height === 0 && bottom >= 0
        ? animatedList.unshift(boxAnimated)
        : animatedList.push(boxAnimated)
    }
    if (bottom < 0) {
      animatedList.forEach(animated => animated.start())
    } else {
      Animated.sequence(animatedList).start()
    }
    if (cb) {
      setTimeout(() => cb(), Const.ANIMATED_DURATION_2)
    }
  }

  showAlertDialog = () => {
    Animated.timing(this.state.boxHeight, {
      toValue: 0,
      duration: 200,
    }).start()
    this.isBoxShow = false
    this.setState(
      {
        isFullScreen: false,
      },
      () => {
        this.updateOverlayerView()
      },
    )

    const menutoolRef = this.props.getMenuAlertDialogRef()
    if (menutoolRef) {
      menutoolRef.setDialogVisible(true)
    }
  }

  themeCommit = () => {
    (async function() {
      if (this.state.type === ConstToolType.MAP_THEME_ADD_DATASET) {
        let resultArr = []
        let datasetNames =
          (this.toolBarSectionList &&
            this.toolBarSectionList.getSelectList()) ||
          []
        if (datasetNames.length === 0) {
          Toast.show('请先选择要添加的数据集')
          return
        }
        resultArr = await SMap.addLayers(
          datasetNames,
          this.state.themeDatasourceAlias,
        )

        // 找出有默认样式的数据集，并给对应图层设置
        for (let i = 0; i < resultArr.length; i++) {
          let description =
            resultArr[i].description &&
            resultArr[i].description !== 'NULL' &&
            JSON.parse(resultArr[i].description)
          if (description && description.geoStyle) {
            await SMap.setLayerStyle(
              resultArr[i].layerName,
              JSON.stringify(description.geoStyle),
            )
          }
        }

        if (resultArr && resultArr.length > 0) {
          this.props.getLayers(-1, layers => {
            this.props.setCurrentLayer(layers.length > 0 && layers[0])
          })

          this.setVisible(false)
          GLOBAL.dialog.setDialogVisible(true)
          Toast.show(getLanguage(this.props.language).Prompt.ADD_SUCCESS)
        } else {
          Toast.show('添加失败')
        }
      } else if (
        this.state.type === ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION
      ) {
        // case constants.THEME_GRAPH_AREA:
        // case constants.THEME_GRAPH_STEP:
        // case constants.THEME_GRAPH_LINE:
        // case constants.THEME_GRAPH_POINT:
        // case constants.THEME_GRAPH_BAR:
        // case constants.THEME_GRAPH_BAR3D:
        // case constants.THEME_GRAPH_PIE:
        // case constants.THEME_GRAPH_PIE3D:
        // case constants.THEME_GRAPH_ROSE:
        // case constants.THEME_GRAPH_ROSE3D:
        // case constants.THEME_GRAPH_STACK_BAR:
        // case constants.THEME_GRAPH_STACK_BAR3D:
        // case constants.THEME_GRAPH_RING:
        //   //统计专题图
        //   params = {
        //     DatasourceAlias: this.state.themeDatasourceAlias,
        //     DatasetName: this.state.themeDatasetName,
        //     GraphExpressions: new Array(item.expression),
        //     ThemeGraphType: this.state.themeCreateType,
        //   }
        //   isSuccess = await SThemeCartography.createThemeGraphMap(params)
        //   break
        let result = true
        let expressions =
          (this.toolBarSectionList &&
            this.toolBarSectionList.getSelectList()) ||
          []
        if (expressions.length === 0) {
          Toast.show('请至少选择一个字段表达式')
          return
        }
        //数据集->创建统计专题图
        let params = {
          DatasourceAlias: this.state.themeDatasourceAlias,
          DatasetName: this.state.themeDatasetName,
          GraphExpressions: expressions,
          ThemeGraphType: this.state.themeCreateType,
        }
        result = await SThemeCartography.createThemeGraphMap(params)
        result &&
          this.props.getLayers(-1, layers => {
            this.props.setCurrentLayer(layers.length > 0 && layers[0])
          })
        if (result) {
          this.setVisible(false)
          GLOBAL.dialog.setDialogVisible(true)
          Toast.show(
            getLanguage(this.props.language).Prompt.CREATE_SUCCESSFULLY,
          )
        } else {
          Toast.show('创建专题图失败')
        }
      } else if (
        this.state.type ===
        ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME
      ) {
        let result = true
        let expressions =
          (this.toolBarSectionList &&
            this.toolBarSectionList.getSelectList()) ||
          []
        if (expressions.length === 0) {
          Toast.show('请至少选择一个字段表达式')
          return
        }
        //图层->创建统计专题图
        let params = {
          LayerName: ThemeMenuData.getLayerNameCreateTheme(), //图层名称
          GraphExpressions: expressions,
          ThemeGraphType: this.state.themeCreateType,
        }
        result = await SThemeCartography.createThemeGraphMapByLayer(params)
        result &&
          this.props.getLayers(-1, layers => {
            this.props.setCurrentLayer(layers.length > 0 && layers[0])
          })
        if (result) {
          this.setVisible(false)
          GLOBAL.dialog.setDialogVisible(true)
          Toast.show(
            getLanguage(this.props.language).Prompt.CREATE_SUCCESSFULLY,
          )
        } else {
          Toast.show('创建专题图失败')
        }
      } else {
        this.close()
      }
    }.bind(this)())
  }

  back = (type = this.state.type) => {
    if (type === ConstToolType.MAP_THEME_ADD_DATASET) {
      let data = this.lastUdbList,
        buttons = []
      buttons = [ToolbarBtnType.THEME_CANCEL]
      this.setState(
        {
          isFullScreen: true,
          isTouchProgress: false,
          showMenuDialog: false,
          listSelectable: false, //单选框
          data: data,
          buttons: buttons,
          type: ConstToolType.MAP_THEME_ADD_UDB,
        },
        () => {
          this.updateOverlayerView()
        },
      )
    } else if (type === ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION) {
      let data = this.lastDatasetsList
      this.setState(
        {
          isFullScreen: true,
          isTouchProgress: false,
          showMenuDialog: false,
          listSelectable: false, //单选框
          height:
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[3]
              : ConstToolType.THEME_HEIGHT[5],
          data,
          buttons: [ToolbarBtnType.THEME_CANCEL],
          type: ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS,
        },
        () => {
          this.updateOverlayerView()
        },
      )
    }
  }

  close = (type = this.state.type, actionFirst = false) => {
    (async function() {
      let actionType = Action.PAN

      if (actionFirst) {
        await this.closeSubAction(type, actionType)
      }

      if (typeof type === 'string' && type.indexOf('MAP_TOOL_MEASURE_') >= 0) {
        // 去掉量算监听
        SMap.removeMeasureListener()
      }
      if (GLOBAL.Type !== constants.MAP_3D) {
        this.props.showMeasureResult(false)
      }
      if (GLOBAL.Type === constants.MAP_EDIT) {
        GLOBAL.showMenu = true
        // GLOBAL.showFlex = true
        this.setState({ selectKey: '' })
      }
      if (
        type === ConstToolType.MAP_ADD_DATASET ||
        type === ConstToolType.MAP_THEME_ADD_DATASET
      ) {
        this.props.getLayers(-1, layers => {
          this.props.setCurrentLayer(layers.length > 0 && layers[0])
        })
      }
      if (type === ConstToolType.MAP_TOOL_TAGGING_SETTING) {
        await SMap.undo()
      }
      // if (type===ConstToolType.MAP_STYLE)
      {
        if (this.currentLayerStyle) {
          SCartography.setLayerStyle(
            this.props.currentLayer.name,
            this.currentLayerStyle,
          ).then(() => {
            this.currentLayerStyle = undefined
          })
        }
      }
      // 当前为采集状态
      if (typeof type === 'number') {
        await SCollector.stopCollect()
      }

      if (
        typeof type === 'string' &&
        type.indexOf('MAP_EDIT_') >= 0 &&
        type !== ConstToolType.MAP_EDIT_DEFAULT &&
        type !== ConstToolType.MAP_TOOL_TAGGING &&
        type !== ConstToolType.MAP_TOOL_TAGGING_SETTING
      ) {
        actionType = Action.SELECT
        GLOBAL.currentToolbarType = ConstToolType.MAP_EDIT_DEFAULT
        // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
        this.setVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
          isFullScreen: false,
          height: 0,
        })
      } else {
        // 当GLOBAL.currentToolbarType为选择对象关联时，不重置GLOBAL.currentToolbarType
        if (type !== ConstToolType.ATTRIBUTE_SELECTION_RELATE) {
          GLOBAL.currentToolbarType = ''
        }

        this.showToolbar(false)
        if (
          this.state.isTouchProgress === true ||
          this.state.showMenuDialog === true
        ) {
          this.setState(
            { isTouchProgress: false, showMenuDialog: false },
            () => {
              this.updateOverlayerView()
            },
          )
        }
        this.props.existFullMap && this.props.existFullMap()
        // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
        this.setState({
          data: [],
          // buttons: [],
        })
        this.height = 0
      }
      if (!actionFirst) {
        setTimeout(async () => {
          // 关闭采集, type 为number时为采集类型，若有冲突再更改
          await this.closeSubAction(type, actionType)
        }, Const.ANIMATED_DURATION_2)
      }

      this.updateOverlayerView()
      GLOBAL.TouchType = TouchType.NORMAL
    }.bind(this)())
  }

  closeSubAction = async (type, actionType) => {
    if (
      typeof type === 'number' ||
      (typeof type === 'string' && type.indexOf('MAP_COLLECTION_') >= 0)
    ) {
      SCollector.stopCollect()
    } else {
      if (type === ConstToolType.MAP_TOOL_POINT_SELECT) {
        // 如果是点选，且有对象被选中，首先要取消选中状态，在设置PAN ?
        // SMap.setAction(Action.SELECT)
        SMap.setAction(Action.PAN)
      } else if (type === ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE) {
        SMap.setAction(Action.PAN)
        SMap.clearSelection()
      } else if (type === ConstToolType.MAP_TOOL_RECTANGLE_CUT) {
        GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(false)
      } else if (
        type === ConstToolType.MAP_BOX_CLIP ||
        type === ConstToolType.MAP3D_BOX_CLIP ||
        type === ConstToolType.MAP3D_CROSS_CLIP ||
        type === ConstToolType.MAP3D_PLANE_CLIP
      ) {
        await SScene.clipSenceClear()
        GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(false)
      } else {
        if (type === ConstToolType.ATTRIBUTE_RELATE) {
          // 返回图层属性界面，并清除属性关联选中的对象
          this.props.navigation &&
            this.props.navigation.navigate('LayerAttribute')
          await SMap.clearTrackingLayer()
          this.props.currentLayer &&
            SMap.selectObj(this.props.currentLayer.path)
        } else if (type === ConstToolType.ATTRIBUTE_SELECTION_RELATE) {
          // 返回框选/点选属性界面，并清除属性关联选中的对象
          NavigationService.navigate('LayerSelectionAttribute', {
            selectionAttribute: GLOBAL.SelectedSelectionAttribute,
            preAction: async () => {
              let selection = []
              for (let i = 0; i < this.props.selection.length; i++) {
                selection.push({
                  layerPath: this.props.selection[i].layerInfo.path,
                  ids: this.props.selection[i].ids,
                })
              }
              await SMap.clearTrackingLayer()
              await SMap.selectObjs(selection)
            },
          })
          // NavigationService.goBack()
        } else {
          SMap.setAction(actionType)
        }
      }
    }
  }

  clearCurrentLabel = () => {
    SScene.clearcurrentLabel()
  }

  closeSymbol = () => {
    SScene.clearAllLabel()
    SScene.checkoutListener('startTouchAttribute')
    GLOBAL.action3d && SScene.setAction(GLOBAL.action3d)
    GLOBAL.Map3DSymbol = false
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  closeTool = () => {
    GLOBAL.OverlayView.setVisible(false)
    SScene.checkoutListener('startTouchAttribute')
    GLOBAL.action3d && SScene.setAction(GLOBAL.action3d)
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  changeCollection = () => {
    SCollector.stopCollect()
    let toolbarType
    switch (this.lastState.type) {
      case SMCollectorType.REGION_GPS_PATH:
      case SMCollectorType.REGION_GPS_POINT:
      case SMCollectorType.REGION_HAND_PATH:
      case SMCollectorType.REGION_HAND_POINT:
        toolbarType = ConstToolType.MAP_COLLECTION_REGION
        break
      case SMCollectorType.LINE_GPS_PATH:
      case SMCollectorType.LINE_GPS_POINT:
      case SMCollectorType.LINE_HAND_POINT:
      case SMCollectorType.LINE_HAND_PATH:
        toolbarType = ConstToolType.MAP_COLLECTION_LINE
        break
      case SMCollectorType.POINT_GPS:
      case SMCollectorType.POINT_HAND:
        toolbarType = ConstToolType.MAP_COLLECTION_POINT
        break
    }

    this.setVisible(true, toolbarType, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[0],
      cb: () => {
        this.setLastState()
      },
    })
  }

  getMap3DAttribute = async () => {
    let data = await SScene.getLableAttributeList()
    let list = []
    for (let index = 0; index < data.length; index++) {
      let item = [
        {
          fieldInfo: { caption: 'id' },
          name: 'id',
          value: data[index].id,
        },
        {
          fieldInfo: { caption: 'name' },
          name: 'name',
          value: data[index].name,
        },
        {
          fieldInfo: { caption: 'description' },
          name: 'description',
          value: data[index].description,
        },
      ]
      list.push(item)
    }
    // this.props.setAttributes && this.props.setAttributes(list)
  }

  symbolSave = () => {
    try {
      SScene.save()
      this.getMap3DAttribute()
      Toast.show(getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY)
      //'保存成功')
    } catch (error) {
      Toast.show('保存失败')
    }
  }

  symbolBack = () => {
    SScene.symbolback()
  }

  taggingback = () => {
    this.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height:
        this.props.device.orientation === 'LANDSCAPE'
          ? ConstToolType.HEIGHT[4]
          : ConstToolType.HEIGHT[4],
      column: this.props.device.orientation === 'LANDSCAPE' ? 5 : 4,
    })
  }

  getPoint = () => {
    return this.point
  }

  menu = () => {
    let isFullScreen, showMenuDialog, isTouchProgress
    let showBox = function() {
      if (
        GLOBAL.Type === constants.MAP_EDIT ||
        this.state.type === ConstToolType.GRID_STYLE ||
        this.state.type === ConstToolType.MAP_STYLE ||
        this.state.type === ConstToolType.MAP_EDIT_STYLE ||
        this.state.type === ConstToolType.MAP_EDIT_MORE_STYLE ||
        this.state.type === ConstToolType.LINECOLOR_SET ||
        this.state.type === ConstToolType.POINTCOLOR_SET ||
        this.state.type === ConstToolType.REGIONBEFORECOLOR_SET ||
        this.state.type === ConstToolType.REGIONAFTERCOLOR_SET ||
        (this.state.type.indexOf('MAP_THEME_PARAM') >= 0 && this.isBoxShow) ||
        this.state.type === ConstToolType.LEGEND ||
        this.state.type === ConstToolType.LEGEND_NOT_VISIBLE
      ) {
        Animated.timing(this.state.boxHeight, {
          toValue: this.state.showMenuDialog ? this.height : 0,
          duration: Const.ANIMATED_DURATION,
        }).start()
        // this.isBoxShow = !this.isBoxShow
        this.isBoxShow = this.state.showMenuDialog
      }
    }.bind(this)

    let setData = function() {
      if (
        GLOBAL.Type === constants.MAP_EDIT ||
        this.state.type === ConstToolType.GRID_STYLE ||
        this.state.type === ConstToolType.MAP_STYLE ||
        this.state.type === ConstToolType.MAP_EDIT_STYLE ||
        this.state.type === ConstToolType.MAP_EDIT_MORE_STYLE ||
        this.state.type === ConstToolType.LINECOLOR_SET ||
        this.state.type === ConstToolType.POINTCOLOR_SET ||
        this.state.type === ConstToolType.REGIONBEFORECOLOR_SET ||
        this.state.type === ConstToolType.REGIONAFTERCOLOR_SET ||
        this.state.type.indexOf('MAP_THEME_PARAM') >= 0 ||
        this.state.type === ConstToolType.LEGEND ||
        this.state.type === ConstToolType.LEGEND_NOT_VISIBLE
      ) {
        // GLOBAL.showFlex =  !GLOBAL.showFlex
        this.isBoxShow = !this.isBoxShow
        let buttons
        if (this.state.type.indexOf('MAP_THEME_PARAM_GRAPH') >= 0) {
          buttons = [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.THEME_GRAPH_TYPE,
            ToolbarBtnType.MENU_COMMIT,
          ]
        } else if (this.state.type.indexOf('LEGEND') >= 0) {
          if (this.props.mapLegend.isShow) {
            buttons = [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.NOT_VISIBLE,
              ToolbarBtnType.MENU,
              ToolbarBtnType.MENU_FLEX,
              ToolbarBtnType.MENU_COMMIT,
            ]
          } else {
            buttons = [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.VISIBLE,
              ToolbarBtnType.MENU,
              ToolbarBtnType.MENU_FLEX,
              ToolbarBtnType.MENU_COMMIT,
            ]
          }
        } else {
          buttons = [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ]
        }
        this.setState(
          {
            isFullScreen,
            showMenuDialog,
            isTouchProgress,
            buttons: buttons,
          },
          () => {
            this.updateOverlayerView()
          },
        )
      }
    }.bind(this)

    if (
      this.state.selectKey === '线宽' ||
      this.state.selectKey === '大小' ||
      this.state.selectKey === '旋转角度' ||
      this.state.selectKey === '透明度' ||
      this.state.selectKey === '对比度' ||
      this.state.selectKey === '亮度' ||
      this.state.selectKey === '分段个数' ||
      this.state.selectKey === '旋转角度' ||
      this.state.selectKey === '字号' ||
      this.state.selectKey === '单点代表值' ||
      this.state.selectKey === '符号大小' ||
      this.state.selectKey === '基准值' ||
      this.state.selectKey === '最大显示值' ||
      this.state.selectKey === '列数' ||
      this.state.selectKey === '宽度' ||
      this.state.selectKey === '高度'
    ) {
      isFullScreen = true
      showMenuDialog = !this.state.showMenuDialog
      isTouchProgress = this.state.showMenuDialog
      setData()
    } else {
      (isFullScreen = !this.state.showMenuDialog),
      (showMenuDialog = !this.state.showMenuDialog),
      (isTouchProgress = false)
      if (!this.state.showMenuDialog) {
        // 先滑出box，再显示Menu
        showBox()
        setTimeout(setData, Const.ANIMATED_DURATION_2)
      } else {
        // 先隐藏Menu，再滑进box
        setData()
        showBox()
      }
    }
  }

  menus = () => {
    if (this.state.showMenuDialog === false) {
      this.setState({ showMenuDialog: true }, () => {
        this.updateOverlayerView()
      })
    } else {
      this.setState({ showMenuDialog: false }, () => {
        this.updateOverlayerView()
      })
    }
    this.setState({ isTouchProgress: false }, () => {
      this.updateOverlayerView()
    })
  }

  showAnimationXmlList = async () => {
    let height = ConstToolType.HEIGHT[2]
    this.props.showFullMap && this.props.showFullMap(true)
    // let type = ConstToolType.PLOT_ANIMATION_XML_LIST
    let type = ConstToolType.MAP_PLOTTING_ANIMATION
    GLOBAL.currentToolbarType = type
    this.setVisible(true, type, {
      isFullScreen: false,
      height,
      containerType: 'list',
      // cb: () => SMap.setAction(Action.SELECT),
    })
  }

  animationPlay = async () => {
    // await SMap.initAnimation()
    // await SMap.animationPlay()
    let height = ConstToolType.HEIGHT[0]
    this.props.showFullMap && this.props.showFullMap(true)
    let type = ConstToolType.PLOT_ANIMATION_PALY
    GLOBAL.currentToolbarType = type
    this.setVisible(true, type, {
      isFullScreen: false,
      height,
      // cb: () => SMap.setAction(Action.SELECT),
    })
  }

  animationSave = async () => {
    let mapName = await SMap.getMapName()
    let userName = this.props.user.currentUser.userName || 'Customer'
    let savePath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        userName +
        '/' +
        ConstPath.RelativeFilePath.Animation +
        '/' +
        mapName,
    )
    await SMap.animationSave(savePath)
  }
  // menuCommit = () => {
  //   this.menuDialog && this.menuDialog.callCurrentAction()
  // }
  menuCommit = (type = this.state.type, actionFirst = false) => {
    (async function() {
      let actionType = Action.PAN

      if (actionFirst) {
        await this.closeSubAction(type, actionType)
      }

      if (typeof type === 'string' && type.indexOf('MAP_TOOL_MEASURE_') >= 0) {
        // 去掉量算监听
        SMap.removeMeasureListener()
      }
      if (GLOBAL.Type !== constants.MAP_3D) {
        this.props.showMeasureResult(false)
      }
      if (GLOBAL.Type === constants.MAP_EDIT) {
        GLOBAL.showMenu = true
        // GLOBAL.showFlex = true
        this.setState({ selectKey: '' })
      }
      if (
        type === ConstToolType.MAP_ADD_DATASET ||
        type === ConstToolType.MAP_THEME_ADD_DATASET
      ) {
        this.props.getLayers(-1, layers => {
          this.props.setCurrentLayer(layers.length > 0 && layers[0])
        })
      }

      if (this.currentLayerStyle) {
        this.currentLayerStyle = undefined
      }
      // 当前为采集状态
      if (typeof type === 'number') {
        await SCollector.stopCollect()
      }

      if (
        typeof type === 'string' &&
        type.indexOf('MAP_EDIT_') >= 0 &&
        type !== ConstToolType.MAP_EDIT_DEFAULT &&
        type !== ConstToolType.MAP_TOOL_TAGGING &&
        type !== ConstToolType.MAP_TOOL_TAGGING_SETTING
      ) {
        actionType = Action.SELECT
        GLOBAL.currentToolbarType = ConstToolType.MAP_EDIT_DEFAULT
        // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
        this.setVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
          isFullScreen: false,
          height: 0,
        })
      } else {
        // 当GLOBAL.currentToolbarType为选择对象关联时，不重置GLOBAL.currentToolbarType
        if (type !== ConstToolType.ATTRIBUTE_SELECTION_RELATE) {
          GLOBAL.currentToolbarType = ''
        }

        this.showToolbar(false)
        if (
          this.state.isTouchProgress === true ||
          this.state.showMenuDialog === true
        ) {
          this.setState(
            { isTouchProgress: false, showMenuDialog: false },
            () => {
              this.updateOverlayerView()
            },
          )
        }
        this.props.existFullMap && this.props.existFullMap()
        // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
        this.setState({
          data: [],
          // buttons: [],
        })
        this.height = 0
      }
      if (!actionFirst) {
        setTimeout(async () => {
          // 关闭采集, type 为number时为采集类型，若有冲突再更改
          await this.closeSubAction(type, actionType)
        }, Const.ANIMATED_DURATION_2)
      }

      this.updateOverlayerView()
      GLOBAL.TouchType = TouchType.NORMAL
    }.bind(this)())
  }

  commit = (type = this.originType) => {
    // this.showToolbar(false)
    if (typeof type === 'string' && type.indexOf('MAP_EDIT_') >= 0) {
      if (type === ConstToolType.MAP_EDIT_DEFAULT) {
        // 编辑完成关闭Toolbar
        this.setVisible(false, '', {
          cb: () => {
            SMap.setAction(Action.PAN)
          },
        })
      } else if (
        type !== ConstToolType.MAP_TOOL_TAGGING &&
        type !== ConstToolType.MAP_TOOL_TAGGING_SETTING
      ) {
        // 编辑完成关闭Toolbar
        GLOBAL.currentToolbarType = ConstToolType.MAP_EDIT_DEFAULT
        // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
        this.setVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
          isFullScreen: false,
          height: 0,
          cb: () => {
            SMap.submit()
            SMap.setAction(Action.SELECT)
          },
        })
      }
    } else if (type === ConstToolType.MAP_TOOL_TAGGING) {
      (async function() {
        let currentLayer = this.props.currentLayer
        let reg = /^Label_(.*)#$/
        let isTaggingLayer = false,
          isPointLayer = false,
          isLineLayer = false,
          isRegionLayer = false,
          isTextLayer = false
        if (currentLayer) {
          isTaggingLayer =
            currentLayer.type === DatasetType.CAD &&
            currentLayer.datasourceAlias.match(reg)
          isPointLayer = currentLayer.type === DatasetType.POINT
          isLineLayer = currentLayer.type === DatasetType.LINE
          isRegionLayer = currentLayer.type === DatasetType.REGION
          isTextLayer = currentLayer.type === DatasetType.TEXT
        }
        if (
          isTaggingLayer ||
          isPointLayer ||
          isLineLayer ||
          isRegionLayer ||
          isTextLayer
        ) {
          isTaggingLayer &&
            SMap.setTaggingGrid(
              currentLayer.datasetName,
              this.props.user.currentUser.userName,
            )
          SMap.submit()
          SMap.refreshMap()
          SMap.setAction(Action.PAN)
          if (type === ConstToolType.MAP_TOOL_TAGGING) {
            this.setVisible(true, ConstToolType.MAP_TOOL_TAGGING_SETTING, {
              isFullScreen: false,
              containerType: 'list',
              height:
                this.props.device.orientation === 'LANDSCAPE'
                  ? ConstToolType.NEWTHEME_HEIGHT[2]
                  : ConstToolType.NEWTHEME_HEIGHT[3],
              column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
            })
          }
        } else {
          Toast.show(
            getLanguage(this.props.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
          )
        }
      }.bind(this)())
    }
    if (type === ConstToolType.MAP_TOOL_TAGGING_SETTING) {
      let datasourceName = GLOBAL.currentLayer.datasourceAlias
      let datasetName = GLOBAL.currentLayer.datasetName
      let name = this.tools_name || ''
      let remark = this.tools_remarks || ''
      let address = this.tools_http || ''
      ;(async function() {
        name !== '' &&
          (await SMap.addRecordset(
            datasourceName,
            datasetName,
            'name',
            name,
            this.props.user.currentUser.userName,
          ))
        remark !== '' &&
          (await SMap.addRecordset(
            datasourceName,
            datasetName,
            'remark',
            remark,
            this.props.user.currentUser.userName,
          ))
        address !== '' &&
          (await SMap.addRecordset(
            datasourceName,
            datasetName,
            'address',
            address,
            this.props.user.currentUser.userName,
          ))
      }.bind(this)())
      // this.taggingback()
      this.setVisible(false, this.state.type, {
        height: 0,
      })
    }
    // this.props.existFullMap && this.props.existFullMap()
  }

  showMenuBox = () => {
    if (
      GLOBAL.Type === constants.MAP_EDIT ||
      this.state.type === ConstToolType.GRID_STYLE ||
      this.state.type === ConstToolType.MAP_STYLE ||
      this.state.type === ConstToolType.MAP_EDIT_STYLE ||
      this.state.type === ConstToolType.MAP_EDIT_MORE_STYLE ||
      this.state.type === ConstToolType.LINECOLOR_SET ||
      this.state.type === ConstToolType.POINTCOLOR_SET ||
      this.state.type === ConstToolType.REGIONBEFORECOLOR_SET ||
      this.state.type === ConstToolType.REGIONAFTERCOLOR_SET ||
      this.state.type === ConstToolType.LEGEND ||
      this.state.type === ConstToolType.LEGEND_NOT_VISIBLE ||
      this.state.type.indexOf('MAP_THEME_PARAM') >= 0
    ) {
      // GLOBAL.showFlex = !GLOBAL.showFlex
      if (
        this.state.selectKey === '线宽' ||
        this.state.selectKey === '大小' ||
        this.state.selectKey === '旋转角度' ||
        this.state.selectKey === '透明度' ||
        this.state.selectKey === '对比度' ||
        this.state.selectKey === '亮度' ||
        this.state.selectKey === '分段个数' ||
        this.state.selectKey === '旋转角度' ||
        this.state.selectKey === '字号' ||
        this.state.selectKey === '单点代表值' ||
        this.state.selectKey === '符号大小' ||
        this.state.selectKey === '基准值' ||
        this.state.selectKey === '最大显示值' ||
        this.state.selectKey === '列数' ||
        this.state.selectKey === '高度' ||
        this.state.selectKey === '宽度'
      ) {
        // 显示指滑进度条
        this.setState(
          {
            isTouchProgress: !this.state.isTouchProgress,
            showMenuDialog: false,
            isFullScreen: !this.state.isTouchProgress,
          },
          () => {
            this.updateOverlayerView()
          },
        )
        this.isBoxShow = false
      } else {
        if (this.state.type === ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE) {
          switch (this.state.selectKey) {
            case '表达式':
              this.getGraphThemeExpressions(
                ConstToolType.MAP_THEME_PARAM_GRAPH_EXPRESSION,
                '表达式',
              )
              break
            case '计算方法':
              this.getGraphThemeGradutedMode(
                ConstToolType.MAP_THEME_PARAM_GRAPH_GRADUATEDMODE,
                '计算方法',
              )
              break
            case '颜色方案':
              this.getGraphThemeColorScheme(
                ConstToolType.MAP_THEME_PARAM_GRAPH_COLOR,
                '颜色方案',
              )
              break
          }
        } else {
          this.isBoxShow = !this.isBoxShow
          Animated.timing(this.state.boxHeight, {
            toValue: this.isBoxShow ? this.height : 0,
            duration: Const.ANIMATED_DURATION,
          }).start()

          this.setState(
            {
              showMenuDialog: false,
              isFullScreen: false,
            },
            () => {
              this.updateOverlayerView()
            },
          )
        }
      }
    }
  }

  //改变图例组件的显隐
  changeLegendVisible = () => {
    let legendData = this.props.mapLegend
    let type = legendData.isShow
      ? ConstToolType.LEGEND_NOT_VISIBLE
      : ConstToolType.LEGEND
    let { data, buttons } = this.getData(type)
    this.setState({
      type: type,
      data: data,
      buttons: buttons,
    })
    legendData.isShow = type === ConstToolType.LEGEND
    this.props.setMapLegend && this.props.setMapLegend(legendData)
  }

  showBox = (autoFullScreen = false) => {
    if (autoFullScreen) {
      this.setState(
        {
          isFullScreen: !this.isBoxShow,
        },
        () => {
          Animated.timing(this.state.boxHeight, {
            toValue: this.isBoxShow ? 0 : this.height,
            duration: Const.ANIMATED_DURATION,
          }).start()
          this.isBoxShow = !this.isBoxShow
          this.updateOverlayerView()
        },
      )
    } else {
      Animated.timing(this.state.boxHeight, {
        toValue: this.isBoxShow ? 0 : this.height,
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = !this.isBoxShow
      if (GLOBAL.Type === constants.MAP_EDIT) {
        if (GLOBAL.showMenu) {
          GLOBAL.showMenu = false
          this.setState({
            buttons: [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.PLACEHOLDER,
              ToolbarBtnType.FLEX,
            ],
          })
        } else {
          GLOBAL.showMenu = true
          this.setState({
            buttons: [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.MENU,
              ToolbarBtnType.FLEX,
            ],
          })
        }
      }
    }
  }

  showSymbol = () => {
    this.props.showFullMap && this.props.showFullMap(true)
    this.setVisible(true, ConstToolType.MAP_SYMBOL, {
      isFullScreen: true,
      height:
        this.props.device.orientation === 'PORTRAIT'
          ? ConstToolType.HEIGHT[3]
          : ConstToolType.THEME_HEIGHT[4],
      cb: () => SCollector.stopCollect(),
    })
  }

  clearAttribute = async () => {
    await SScene.clearSelection()
    await SScene.setAction('PAN3D')
    GLOBAL.action3d = 'PAN3D'
    this.props.setAttributes({})
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  closeCircle = () => {
    SScene.stopCircleFly()
    SScene.clearCirclePoint()
    GLOBAL.action3d && SScene.setAction(GLOBAL.action3d)
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  closeAnalyst = () => {
    SScene.closeAnalysis()
    this.props.measureShow(false, '')
    SScene.checkoutListener('startTouchAttribute')
    GLOBAL.action3d && SScene.setAction(GLOBAL.action3d)
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  clear = () => {
    switch (this.state.type) {
      case ConstToolType.MAP3D_TOOL_SUERFACEMEASURE:
        SScene.clearSquareAnalyst()
        this.props.measureShow(true, '0㎡')
        break
      case ConstToolType.MAP3D_TOOL_DISTANCEMEASURE:
        SScene.clearLineAnalyst()
        this.props.measureShow(true, '0m')
        break
      case ConstToolType.MAP3D_BOX_CLIP:
      case ConstToolType.MAP3D_CROSS_CLIP:
      case ConstOnline.MAP3D_PLANE_CLIP:
        //清除裁剪面 返回上个界面
        SScene.clipSenceClear()
        GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show()
        this.showMap3DTool(ConstToolType.MAP_BOX_CLIP)
        break
      default:
        SScene.clear()
        break
    }
  }

  endAnimation = () => {
    SMap.animationClose()
    SMap.setAction(Action.PAN)
    SMap.endAnimationWayPoint(false)
    GLOBAL.animationWayData && (GLOBAL.animationWayData = null)
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
    GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(false)
  }

  endFly = () => {
    SScene.checkoutListener('startTouchAttribute')
    SScene.flyStop()
    GLOBAL.action3d && SScene.setAction(GLOBAL.action3d)
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  endAddFly = () => {
    SScene.checkoutListener('startTouchAttribute')
    SScene.clearRoutStops()
    SScene.flyStop()
    GLOBAL.action3d && SScene.setAction(GLOBAL.action3d)
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  saveFly = () => {}

  setfly = index => {
    SScene.setPosition(index)
    this.showMap3DTool(ConstToolType.MAP3D_TOOL_FLY)
  }

  newFly = () => {
    this.showMap3DTool(ConstToolType.MAP3D_TOOL_NEWFLY)
  }

  setAnimation = path => {
    SMap.readAnimationXmlFile(path)
    // this.showPlotAnimationTool(ConstToolType.MAP_PLOTTING_ANIMATION_ITEM)

    this.animationPlay()
  }

  listThemeAction = ({ item }) => {
    if (this.state.type === ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION) {
      //单值专题图表达式
      (async function() {
        let Params = {
          UniqueExpression: item.expression,
          LayerName: GLOBAL.currentLayer.name,
        }
        // await SThemeCartography.setUniqueExpression(Params)
        await this.refreshThemeExpression(item.expression)
        await SThemeCartography.modifyThemeUniqueMap(Params)
      }.bind(this)())
    } else if (this.state.type === ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR) {
      //单值专题图颜色表
      this.setState({
        themeColor: item.key,
      })
      ;(async function() {
        let Params = {
          ColorScheme: item.key,
          LayerName: GLOBAL.currentLayer.name,
        }
        await SThemeCartography.setUniqueColorScheme(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_GRID_UNIQUE_COLOR
    ) {
      //栅格单值专题图颜色表
      this.setState({
        themeColor: item.key,
      })
      ;(async function() {
        let Params = {
          GridUniqueColorScheme: item.key,
          LayerName: GLOBAL.currentLayer.name,
        }
        await SThemeCartography.modifyThemeGridUniqueMap(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION
    ) {
      //分段专题图表达式
      (async function() {
        let Params = {
          RangeExpression: item.expression,
          LayerName: GLOBAL.currentLayer.name,
        }
        await this.refreshThemeExpression(item.expression)
        await SThemeCartography.setRangeExpression(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION
    ) {
      //点密度专题图表达式
      (async function() {
        let Params = {
          DotExpression: item.expression,
          LayerName: GLOBAL.currentLayer.name,
        }
        await this.refreshThemeExpression(item.expression)
        await SThemeCartography.modifyDotDensityThemeMap(Params)
      }.bind(this)())
    } else if (
      this.state.type ===
      ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION
    ) {
      //等级符号专题图表达式
      (async function() {
        let Params = {
          GraSymbolExpression: item.expression,
          LayerName: GLOBAL.currentLayer.name,
        }
        await this.refreshThemeExpression(item.expression)
        await SThemeCartography.modifyGraduatedSymbolThemeMap(Params)
      }.bind(this)())
    } else if (this.state.type === ConstToolType.MAP_THEME_PARAM_RANGE_COLOR) {
      //分段专题图颜色表
      this.setState({
        themeColor: item.key,
      })
      ;(async function() {
        let Params = {
          ColorScheme: item.key,
          LayerName: GLOBAL.currentLayer.name,
        }
        await SThemeCartography.setRangeColorScheme(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_GRID_RANGE_COLOR
    ) {
      //栅格分段专题图颜色表
      this.setState({
        themeColor: item.key,
      })
      ;(async function() {
        let Params = {
          GridRangeColorScheme: item.key,
          LayerName: GLOBAL.currentLayer.name,
        }
        await SThemeCartography.modifyThemeGridRangeMap(Params)
      }.bind(this)())
    } else if (this.state.type === ConstToolType.MAP_THEME_PARAM_GRAPH_COLOR) {
      //统计专题图颜色表
      this.setState({
        themeColor: item.key,
      })
      ;(async function() {
        let Params = {
          GraphColorType: item.key,
          LayerName: GLOBAL.currentLayer.name,
        }
        await SThemeCartography.setThemeGraphColorScheme(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_HEAT_AGGREGATION_COLOR
    ) {
      //热力图颜色表
      this.setState({
        themeColor: item.key,
      })
      ;(async function() {
        let Params = {
          HeatmapColorScheme: item.key,
          LayerName: GLOBAL.currentLayer.name,
        }
        await SThemeCartography.setHeatMapColorScheme(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION
    ) {
      //统一标签表达式
      (async function() {
        let Params = {
          LabelExpression: item.expression,
          LayerName: GLOBAL.currentLayer.name,
        }
        await this.refreshThemeExpression(item.expression)
        await SThemeCartography.setUniformLabelExpression(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION
    ) {
      //单值标签表达式
      (async function() {
        let Params = {
          UniqueExpression: item.expression,
          LayerName: GLOBAL.currentLayer.name,
        }
        await this.refreshThemeExpression(item.expression)
        await SThemeCartography.setUniqueLabelExpression(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_COLOR
    ) {
      //单值标签专题图颜色表
      this.setState({
        themeColor: item.key,
      })
      ;(async function() {
        let Params = {
          ColorScheme: item.key,
          LayerName: GLOBAL.currentLayer.name,
        }
        await SThemeCartography.setUniqueLabelColorScheme(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_RANGELABEL_EXPRESSION
    ) {
      //分段标签表达式
      (async function() {
        let Params = {
          RangeExpression: item.expression,
          LayerName: GLOBAL.currentLayer.name,
        }
        await this.refreshThemeExpression(item.expression)
        await SThemeCartography.setRangeLabelExpression(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_RANGELABEL_COLOR
    ) {
      //单值标签专题图颜色表
      this.setState({
        themeColor: item.key,
      })
      ;(async function() {
        let Params = {
          ColorScheme: item.key,
          LayerName: GLOBAL.currentLayer.name,
        }
        await SThemeCartography.setRangeLabelColorScheme(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS
    ) {
      //数据集选择列表(跳转到专题图字段选择列表)
      (async function() {
        try {
          //栅格专题图直接由数据集创建，无需选择字段
          if (this.state.themeCreateType === constants.THEME_GRID_UNIQUE) {
            let params = {
              themeDatasourceAlias: item.datasourceName,
              themeDatasetName: item.datasetName,
            }
            ThemeMenuData.createThemeGridUniqueMap(params)
            return
          } else if (
            this.state.themeCreateType === constants.THEME_GRID_RANGE
          ) {
            let params = {
              themeDatasourceAlias: item.datasourceName,
              themeDatasetName: item.datasetName,
            }
            ThemeMenuData.createThemeGridRangeMap(params)
            return
          } else if (this.state.themeCreateType === constants.THEME_HEATMAP) {
            //创建热力图
            let params = {
              themeDatasourceAlias: item.datasourceName,
              themeDatasetName: item.datasetName,
            }
            ThemeMenuData.createHeatMap(params)
            return
          }
          //其他专题图需要选择字段
          this.props.setContainerLoading &&
            this.props.setContainerLoading(
              true,
              getLanguage(this.props.language).Prompt.READING_DATA,
            )
          let data = await SThemeCartography.getThemeExpressionByDatasetName(
            global.language,
            item.datasourceName,
            item.datasetName,
          )
          let dataset = data.dataset
          let _list = []
          data.list.forEach(item => {
            if (ThemeMenuData.isThemeFieldTypeAvailable(item.fieldTypeStr)) {
              item.info = {
                infoType: 'fieldType',
                fieldType: item.fieldType,
              }
              _list.push(item)
            }
          })
          data.list = _list
          let datalist = [
            {
              title: dataset.datasetName,
              datasetType: dataset.datasetType,
              expressionType: true,
              data: data.list,
            },
          ]
          this.lastDatasetsList = this.state.data //保存上次的数据集数据
          //统计专题图字段表达式可以多选
          let listSelectable = false
          switch (this.state.themeCreateType) {
            case constants.THEME_UNIQUE_STYLE:
            case constants.THEME_RANGE_STYLE:
            case constants.THEME_UNIFY_LABEL:
            case constants.THEME_UNIQUE_LABEL:
            case constants.THEME_RANGE_LABEL:
            case constants.THEME_DOT_DENSITY:
            case constants.THEME_GRADUATED_SYMBOL:
              listSelectable = false
              break
            case constants.THEME_GRAPH_AREA:
            case constants.THEME_GRAPH_STEP:
            case constants.THEME_GRAPH_LINE:
            case constants.THEME_GRAPH_POINT:
            case constants.THEME_GRAPH_BAR:
            case constants.THEME_GRAPH_BAR3D:
            case constants.THEME_GRAPH_PIE:
            case constants.THEME_GRAPH_PIE3D:
            case constants.THEME_GRAPH_ROSE:
            case constants.THEME_GRAPH_ROSE3D:
            case constants.THEME_GRAPH_STACK_BAR:
            case constants.THEME_GRAPH_STACK_BAR3D:
            case constants.THEME_GRAPH_RING:
              //统计专题图
              listSelectable = true
              break
          }
          this.setState(
            {
              themeDatasourceAlias: item.datasourceName,
              themeDatasetName: item.datasetName,
              isFullScreen: true,
              isTouchProgress: false,
              showMenuDialog: false,
              listSelectable: listSelectable, //单选框
              containerType: 'list',
              data: datalist,
              buttons: listSelectable
                ? [
                  //ToolbarBtnType.THEME_CANCEL,
                  ToolbarBtnType.THEME_ADD_BACK,
                  ToolbarBtnType.THEME_COMMIT,
                ]
                : [ToolbarBtnType.THEME_CANCEL],
              type: ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION,
            },
            () => {
              this.scrollListToLocation()
              this.height =
                this.props.device.orientation === 'LANDSCAPE'
                  ? ConstToolType.THEME_HEIGHT[3]
                  : ConstToolType.THEME_HEIGHT[5]

              this.props.setContainerLoading &&
                this.props.setContainerLoading(false)
              this.updateOverlayerView()
            },
          )
        } catch (e) {
          this.props.setContainerLoading &&
            this.props.setContainerLoading(false)
        }
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION
    ) {
      //点击字段名创建专题图(数据集创建)
      (async function() {
        await ThemeMenuData.createThemeByDataset(item, {
          setToolbarVisible: this.setVisible,
          ...this.props,
          themeDatasourceAlias: this.state.themeDatasourceAlias,
          themeDatasetName: this.state.themeDatasetName,
          themeCreateType: this.state.themeCreateType,
        })
      }.bind(this)())
    } else if (
      this.state.type ===
      ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME
    ) {
      //点击字段名创建专题图(图层创建)
      (async function() {
        await ThemeMenuData.createThemeByLayer(item, {
          setToolbarVisible: this.setVisible,
          ...this.props,
          themeCreateType: this.state.themeCreateType,
        })
      }.bind(this)())
    }
  }

  /**
   * 统计专题图多选字段列表，修改所需字段，实时更新地图
   */
  listSelectableAction = async ({ selectList }) => {
    let list = []

    for (let key in selectList) {
      let arr = selectList[key]
      for (let i = 0, l = arr.length; i < l; i++) {
        for (let expression in arr[i]) {
          if (arr[i][expression] === false) list.push(expression)
        }
      }
    }

    // for (let i = 0, l = selectList.length; i < l; i++) {
    //   for (let key in selectList[i]) {
    //     list.push(key)
    //   }
    // }
    let Params = {
      LayerName: GLOBAL.currentLayer.name,
      GraphExpressions: list,
      //GraphExpressions: selectList,
    }
    await SThemeCartography.setThemeGraphExpressions(Params)
  }

  listAction = ({ item, index, section }) => {
    if (this.state.type === 'MAP3D_BASE') return
    if (item.action) {
      item.action && item.action()
    } else if (this.state.type === ConstToolType.MAP_ADD_LAYER) {
      (async function() {
        this.props.setContainerLoading &&
          this.props.setContainerLoading(
            true,
            getLanguage(this.props.language).Prompt.READING_DATA,
          )
        this.path = await FileTools.appendingHomeDirectory(item.path)
        SMap.getUDBName(this.path).then(list => {
          let dataList = [
            {
              title: '数据集',
              data: list,
            },
          ]
          this.setState(
            {
              data: dataList,
              type: ConstToolType.MAP_ADD_DATASET,
            },
            () => {
              this.scrollListToLocation()
              this.props.setContainerLoading &&
                this.props.setContainerLoading(false)
            },
            () => {
              this.props.setContainerLoading &&
                this.props.setContainerLoading(false)
            },
          )
          // this.setLastState()
        })
      }.bind(this)())
    } else if (this.state.type === ConstToolType.MAP_THEME_ADD_UDB) {
      (async function() {
        if (
          section.title ===
          getLanguage(this.props.language).Map_Main_Menu.OPEN_DATASOURCE
        ) {
          // 添加数据集
          this.lastUdbList = this.state.data //保存上次的数据源数据
          this.props.setContainerLoading &&
            this.props.setContainerLoading(
              true,
              getLanguage(this.props.language).Prompt.READING_DATA,
            )
          this.path = await FileTools.appendingHomeDirectory(item.path)
          SThemeCartography.getUDBName(this.path).then(list => {
            list.forEach(item => {
              if (item.geoCoordSysType && item.prjCoordSysType) {
                item.info = {
                  infoType: 'dataset',
                  geoCoordSysType: item.geoCoordSysType,
                  prjCoordSysType: item.prjCoordSysType,
                }
              }
            })
            let arr = item.name.split('.')
            let alias = arr[0]
            let dataList = [
              {
                title: alias,
                image: require('../../../../assets/mapToolbar/list_type_udb.png'),
                data: list,
                allSelectType: true,
              },
            ]
            this.setState(
              {
                themeDatasourceAlias: alias,
                listSelectable: true, //单选框
                buttons: [
                  //ToolbarBtnType.THEME_CANCEL,
                  ToolbarBtnType.THEME_ADD_BACK,
                  ToolbarBtnType.THEME_COMMIT,
                ],
                data: dataList,
                type: ConstToolType.MAP_THEME_ADD_DATASET,
              },
              () => {
                let les = this.state.listExpressions
                let data = this.state.data[0].data
                if (les && alias in les && data) {
                  let names = les[alias]
                  for (let j = 0, dataLen = data.length; j < dataLen; j++) {
                    let curDataSetName = data[j].datasetName
                    for (let i = 0, l = names.length; i < l; i++) {
                      if (curDataSetName in names[i]) {
                        data[j].isSelected = !names[i][curDataSetName]
                      }
                    }
                  }
                }
                this.scrollListToLocation()
                this.props.setContainerLoading &&
                  this.props.setContainerLoading(false)
              },
              () => {
                this.props.setContainerLoading &&
                  this.props.setContainerLoading(false)
              },
            )
            // this.setLastState()
          })
        } else if (
          section.title ===
          getLanguage(this.props.language).Map_Main_Menu.OPEN_MAP
        ) {
          // 添加地图
          this.props.setContainerLoading &&
            this.props.setContainerLoading(
              true,
              getLanguage(this.props.language).Prompt.LOADING,
            )
          SMap.addMap(item.name || item.title).then(async result => {
            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            Toast.show(
              result
                ? getLanguage(this.props.language).Prompt.ADD_SUCCESS
                : getLanguage(this.props.language).Prompt.ADD_FAILED,
            )
            if (result) {
              await this.props.getLayers(-1, layers => {
                this.props.setCurrentLayer(layers.length > 0 && layers[0])
              })
            }
            this.setVisible(false)
          })
        }
      }.bind(this)())
    } else if (this.state.type === ConstToolType.MAP_ADD_DATASET) {
      (async function() {
        let udbName = this.basename(this.path)
        let udbpath = {
          server: this.path,
          alias: udbName,
          engineType: 219,
        }
        let result = await SMap.openDatasource(udbpath, index)
        Toast.show(
          result === true
            ? getLanguage(this.props.language).Prompt.ADD_SUCCESS
            : ConstInfo.ADD_FAILED,
        )
      }.bind(this)())
    } else if (this.state.type === ConstToolType.MAP_OPEN) {
      NavigationService.navigate('WorkspaceFlieList', {
        cb: async path => {
          //提示是否保存

          this.path = path
          let filename = this.path
            .substr(this.path.lastIndexOf('.'))
            .toLowerCase()

          if (filename === '.xml') {
            //获取数据源
            let udbfile = this.path.substr(this.path.lastIndexOf('/') + 1)

            let udbfilepath = this.path
              .substr(0, this.path.lastIndexOf('/') + 1)
              .toLowerCase()

            let udbdata = {}
            let data = await jsonUtil.getMapDatasource(udbfile)
            for (let i = 0; i < data.length; i++) {
              if (data[i].mapName === udbfile) {
                udbdata = data[i].UDBName
              }
            }
            for (let j = 0; j < udbdata.length; j++) {
              let udbpath = {
                server: udbfilepath + udbdata[j],
                alias: udbdata[j].substr(0, udbdata[j].lastIndexOf('.')),
                engineType: 219,
              }
              await SMap.openDatasource(udbpath, -1)
            }

            await this.props.closeMap()
            await SMap.openMapFromXML(path)
          }
        },
      })
    } else if (this.state.type === ConstToolType.MAP_TEMPLATE) {
      // 打开模板工作空间
      this.openTemplate(item)
    } else if (this.state.type === ConstToolType.MAP_CHANGE) {
      // 切换地图
      this.changeMap(item)
      this.props.getMapSetting()
    } else if (this.state.type === ConstToolType.PLOT_LIB_CHANGE) {
      // 切换标绘库
      this.changePlotLib(item)
    } else if (this.state.type === ConstToolType.MAP_PLOTTING_ANIMATION) {
      // 显示态势推演动画列表
      this.getAnimationList(item)
    } else if (this.state.type === ConstToolType.MAP_PLOTTING_ANIMATION_ITEM) {
      // 选择某一个推演动画xml加载
      // this.getAnimationList(item)
    } else if (this.state.type === ConstToolType.MAP_THEME_ADD_DATASET) {
      //专题图添加数据集
      // if (item.datasetName) {
      //   let params = {
      //     DatasourceName: item.datasourceName,
      //     DatasetName: item.datasetName,
      //   }
      //   let result = SMap.addDatasetToMap(params)
      //   Toast.show(
      //     result === true ? ConstInfo.ADD_SUCCESS : ConstInfo.ADD_FAILED,
      //   )
      //   // 重新加载图层
      //   this.props.getLayers({
      //     type: -1,
      //     currentLayerIndex: 0,
      //   })
      // }
    }
  }

  /** 导入工作空间 **/
  importData = async item => {
    try {
      this.props.setContainerLoading &&
        this.props.setContainerLoading(true, '正在打开数据')
      // 打开模板工作空间
      let moduleName = ''
      if (this.props.map.currentMap.name) {
        await this.props.closeMap()
      }
      this.props
        .importWorkspace({ ...item, module: moduleName })
        .then(async ({ mapsInfo, msg }) => {
          if (msg) {
            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            Toast.show(msg)
          } else if (mapsInfo && mapsInfo.length > 0) {
            // 关闭地图
            if (this.props.map.currentMap.name) {
              await this.props.closeMap()
            }
            // 移除地图上所有callout
            SMediaCollector.removeMedias()
            // 打开地图
            let mapPath =
              (this.props.user && this.props.user.currentUser.userName
                ? ConstPath.UserPath +
                  this.props.user.currentUser.userName +
                  '/'
                : ConstPath.CustomerPath) + ConstPath.RelativeFilePath.Map
            let mapInfo = await this.props.openMap({
              path: mapPath + mapsInfo[0] + '.xml',
              name: mapsInfo[0],
            })
            if (mapInfo) {
              await this.props.getLayers(-1, layers => {
                this.props.setCurrentLayer(layers.length > 0 && layers[0])
              })
              this.props.setContainerLoading(false)
              this.setVisible(false)
            } else {
              this.props.getLayers(-1, layers => {
                this.props.setCurrentLayer(layers.length > 0 && layers[0])
              })
              Toast.show('该地图已打开')
              this.props.setContainerLoading(false)
            }
            await SMap.openTaggingDataset(this.props.user.currentUser.userName)
            // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
            await SMap.getTaggingLayers(
              this.props.user.currentUser.userName,
            ).then(dataList => {
              dataList.forEach(item => {
                if (item.isVisible) {
                  SMediaCollector.showMedia(item.name)
                }
              })
            })
            // 重新加载图层
            this.props.getLayers({
              type: -1,
              currentLayerIndex: 0,
            })
            this.props.setContainerLoading(false)
          } else {
            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            Toast.show('导入失败')
          }
        })
    } catch (error) {
      Toast.show('导入失败')
      this.props.setContainerLoading && this.props.setContainerLoading(false)
    }
  }

  basename(str) {
    var idx = str.lastIndexOf('/')
    idx = idx > -1 ? idx : str.lastIndexOf('\\')
    if (idx < 0) {
      return str
    }
    let file = str.substring(idx + 1)
    let arr = file.split('.')
    return arr[0]
  }

  mapMoveToCurrent = async () => {
    let moveToCurrentResult = await SMap.moveToCurrent()
    if (!moveToCurrentResult) {
      await SMap.moveToPoint({ x: 116.21, y: 39.42 })
    }
    await SMap.setScale(0.0000060635556556859582)
  }

  headerAction = ({ section }) => {
    (async function() {
      if (
        section.title ===
        getLanguage(this.props.language).Map_Main_Menu.CREATE_WITH_SYMBOLS
      ) {
        // let defaultWorkspacePath = await Utility.appendingHomeDirectory(
        //   (this.props.user.currentUser.userName
        //     ? ConstPath.UserPath + this.props.user.currentUser.userName
        //     : ConstPath.CustomerPath) + ConstPath.RelativeFilePath.Workspace,
        // )

        // if (this.props.map.workspace.server === defaultWorkspacePath) {
        //   Toast.show(ConstInfo.WORKSPACE_ALREADY_OPENED)
        //   return
        // }

        let userPath =
          this.props.user.currentUser.userName &&
          this.props.user.currentUser.userType !== UserType.PROBATION_USER
            ? ConstPath.UserPath + this.props.user.currentUser.userName + '/'
            : ConstPath.CustomerPath
        let mapPath = await FileTools.appendingHomeDirectory(
          userPath + ConstPath.RelativePath.Map,
        )
        let newName = await FileTools.getAvailableMapName(mapPath, 'DefaultMap')
        NavigationService.navigate('InputPage', {
          headerTitle: getLanguage(this.props.language).Map_Main_Menu
            .START_NEW_MAP,
          //'新建地图',
          value: newName,
          placeholder: getLanguage(this.props.language).Prompt.ENTER_MAP_NAME,
          cb: async value => {
            GLOBAL.Loading &&
              GLOBAL.Loading.setLoading(
                true,
                getLanguage(this.props.language).Prompt.CREATING,
                //ConstInfo.MAP_SYMBOL_COLLECTION_CREATING,
              )
            // 移除地图上所有callout
            SMediaCollector.removeMedias()
            await this.props.closeMap()
            this.props.setCollectionInfo() // 清空当前模板
            this.props.setCurrentTemplateInfo() // 清空当前模板
            this.props.setCurrentPlotInfo() //清空模板
            this.props.setTemplate() // 清空模板

            // 重新打开工作空间，防止Resource被删除或破坏
            const customerPath =
              ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace
            let wsPath
            if (this.props.user.currentUser.userName) {
              const userWSPath =
                ConstPath.UserPath +
                this.props.user.currentUser.userName +
                '/' +
                ConstPath.RelativeFilePath.Workspace
              wsPath = await FileTools.appendingHomeDirectory(userWSPath)
            } else {
              wsPath = await FileTools.appendingHomeDirectory(customerPath)
            }
            await this.props.openWorkspace({ server: wsPath })
            await SMap.openDatasource(
              ConstOnline['Google'].DSParams,
              // ConstOnline['Google'].layerIndex,
              1,
            )

            let layers = await this.props.getLayers()
            await SMap.openTaggingDataset(this.props.user.currentUser.userName)
            // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
            await SMap.getTaggingLayers(
              this.props.user.currentUser.userName,
            ).then(dataList => {
              dataList.forEach(item => {
                if (item.isVisible) {
                  SMediaCollector.showMedia(item.name)
                }
              })
            })
            // 隐藏底图
            await SMap.setLayerVisible(layers[layers.length - 1].path, true)

            this.mapMoveToCurrent()

            this.props.saveMap &&
              (await this.props.saveMap({
                mapName: value,
                nModule: GLOBAL.Type,
                notSaveToXML: true,
              }))

            GLOBAL.Loading && GLOBAL.Loading.setLoading(false)
            NavigationService.goBack()
            setTimeout(() => {
              this.setVisible(false)
              Toast.show(
                getLanguage(this.props.language).Prompt.CREATE_SUCCESSFULLY,
              )
            }, 1000)
          },
        })

        // this.props.closeWorkspace().then(async () => {
        //   try {
        //     this.props.setContainerLoading &&
        //       this.props.setContainerLoading(true, ConstInfo.WORKSPACE_OPENING)
        //
        //     let data = { server: defaultWorkspacePath }
        //     let result = await this.props.openWorkspace(data)
        //
        //     await SMap.openDatasource(
        //       ConstOnline['Google'].DSParams,
        //       ConstOnline['Google'].layerIndex,
        //     )
        //     await this.props.getLayers()
        //
        //     Toast.show(
        //       result
        //         ? ConstInfo.WORKSPACE_DEFAULT_OPEN_SUCCESS
        //         : ConstInfo.WORKSPACE_DEFAULT_OPEN_FAILED,
        //     )
        //     this.setVisible(false)
        //     this.props.setContainerLoading &&
        //       this.props.setContainerLoading(false)
        //   } catch (error) {
        //     Toast.show(ConstInfo.WORKSPACE_DEFAULT_OPEN_FAILED)
        //     this.props.setContainerLoading &&
        //       this.props.setContainerLoading(false)
        //   }
        // })
      }
    }.bind(this)())
  }

  /** 打开模板工作空间 **/
  openTemplate = async item => {
    let userPath =
      this.props.user.currentUser.userName &&
      this.props.user.currentUser.userType !== UserType.PROBATION_USER
        ? ConstPath.UserPath + this.props.user.currentUser.userName + '/'
        : ConstPath.CustomerPath
    let mapPath = await FileTools.appendingHomeDirectory(
      userPath + ConstPath.RelativePath.Map,
    )
    let newName = await FileTools.getAvailableMapName(
      mapPath,
      item.name || 'DefaultName',
    )
    NavigationService.navigate('InputPage', {
      value: newName,
      headerTitle: getLanguage(this.props.language).Map_Main_Menu.START_NEW_MAP,
      //'新建地图',
      placeholder: getLanguage(this.props.language).Prompt.ENTER_MAP_NAME,
      cb: async (value = '') => {
        try {
          this.props.setContainerLoading &&
            this.props.setContainerLoading(
              true,
              //ConstInfo.MAP_CREATING
              getLanguage(this.props.language).Prompt.CREATING,
            )
          // 打开模板工作空间
          let moduleName = ''
          if (this.props.map.currentMap.name) {
            await this.props.closeMap()
          }
          // 移除地图上所有callout
          SMediaCollector.removeMedias()
          await this.props.setCurrentSymbols()
          this.props
            .importWorkspace({
              ...item,
              module: moduleName,
              mapName: value.toString().trim(),
            })
            .then(async ({ mapsInfo, msg }) => {
              if (msg) {
                this.props.setContainerLoading &&
                  this.props.setContainerLoading(false)
                Toast.show(msg)
              } else if (mapsInfo && mapsInfo.length > 0) {
                // 清除属性历史记录
                await this.props.clearAttributeHistory()
                // 关闭地图
                if (this.props.map.currentMap.name) {
                  await this.props.closeMap()
                }
                // 打开地图
                let mapPath =
                  (this.props.user && this.props.user.currentUser.userName
                    ? ConstPath.UserPath +
                      this.props.user.currentUser.userName +
                      '/'
                    : ConstPath.CustomerPath) + ConstPath.RelativeFilePath.Map
                let mapInfo = await this.props.openMap({
                  path: mapPath + mapsInfo[0] + '.xml',
                  name: mapsInfo[0],
                })
                if (mapInfo) {
                  if (mapInfo.Template) {
                    this.props.setContainerLoading(
                      true,
                      getLanguage(this.props.language).Prompt.READING_TEMPLATE,
                      //ConstInfo.TEMPLATE_READING,
                    )
                    let templatePath = await FileTools.appendingHomeDirectory(
                      ConstPath.UserPath + mapInfo.Template,
                    )
                    await this.props.getSymbolTemplates({
                      path: templatePath,
                      name: item.name,
                    })
                  } else {
                    await this.props.setTemplate()
                  }
                  this.setVisible(false)
                } else {
                  // this.props.getLayers(-1, layers => {
                  //   this.props.setCurrentLayer(layers.length > 0 && layers[0])
                  // })
                  Toast.show(
                    getLanguage(this.props.language).Prompt.THE_MAP_IS_OPENED,
                  )
                  //ConstInfo.MAP_ALREADY_OPENED)
                  // this.props.setContainerLoading(false)
                }

                await this.props.getLayers(-1, async layers => {
                  this.props.setCurrentLayer(layers.length > 0 && layers[0])

                  if (
                    !LayerUtils.isBaseLayer(layers[layers.length - 1].caption)
                  ) {
                    await LayerUtils.addBaseMap(
                      layers,
                      ConstOnline['Google'],
                      GLOBAL.Type === constants.COLLECTION
                        ? 1
                        : ConstOnline['Google'].layerIndex,
                      false,
                    )
                  }

                  // // 若没有底图，默认添加地图
                  // if (LayerUtils.getBaseLayers(layers).length > 0) {
                  //   await SMap.openDatasource(
                  //     ConstOnline['Google'].DSParams, GLOBAL.Type === constants.COLLECTION
                  //       ? 1 : ConstOnline['Google'].layerIndex, false)
                  // }
                })
                // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
                await SMap.getTaggingLayers(
                  this.props.user.currentUser.userName,
                ).then(dataList => {
                  dataList.forEach(item => {
                    if (item.isVisible) {
                      SMediaCollector.showMedia(item.name)
                    }
                  })
                })
                this.props.setContainerLoading(false)
                // // 重新加载图层
                // this.props.getLayers({
                //   type: -1,
                //   currentLayerIndex: 0,
                // })
                this.mapMoveToCurrent()
                this.props.setContainerLoading(
                  true,
                  //ConstInfo.TEMPLATE_READING
                  getLanguage(this.props.language).Prompt.READING_TEMPLATE,
                )
                this.props.getSymbolTemplates(null, () => {
                  this.setVisible(false)
                  this.props.setContainerLoading &&
                    this.props.setContainerLoading(false)
                  Toast.show(
                    getLanguage(this.props.language).Prompt.SWITCHED_TEMPLATE,
                  )
                  //ConstInfo.TEMPLATE_CHANGE_SUCCESS
                })
              } else {
                this.props.setContainerLoading &&
                  this.props.setContainerLoading(false)
                Toast.show(ConstInfo.TEMPLATE_CHANGE_FAILED)
              }
            })
        } catch (error) {
          Toast.show(ConstInfo.TEMPLATE_CHANGE_FAILED)
          this.props.setContainerLoading &&
            this.props.setContainerLoading(false)
        }
        NavigationService.goBack()
        setTimeout(() => {
          this.setVisible(false)
          Toast.show(
            getLanguage(this.props.language).Prompt.CREATE_SUCCESSFULLY,
          )
          //ConstInfo.MAP_SYMBOL_COLLECTION_CREATED)
        }, 1000)
      },
    })
  }

  /** 切换标绘库 **/
  changePlotLib = async item => {
    try {
      this.props.setContainerLoading(
        true,
        getLanguage(this.props.language).Prompt.SWITCHING_PLOT_LIB,
        //ConstInfo.MAP_CHANGING
      )
      let libIds = this.props.template.plotLibIds
      if (libIds != undefined) {
        let result = await SMap.removePlotSymbolLibraryArr(libIds)
        if (result) {
          let plotPath = await FileTools.appendingHomeDirectory(
            // ConstPath.UserPath + ConstPath.RelativeFilePath.Plotting,
            item.path,
          )
          this.props.getSymbolPlots({ path: plotPath, isFirst: false })
        }
      }
      Toast.show(
        getLanguage(this.props.language).Prompt.SWITCHING_SUCCESS,
        //ConstInfo.CHANGE_MAP_TO + mapInfo.name
      )
      this.props.setContainerLoading(false)
      this.setVisible(false)
    } catch (e) {
      Toast.show(ConstInfo.CHANGE_PLOT_LIB_FAILED)
      this.props.setContainerLoading(false)
    }
  }
  /** 切换地图 **/
  changeMap = async item => {
    try {
      if (
        this.props.map.currentMap &&
        this.props.map.currentMap.path === item.path
      ) {
        Toast.show(getLanguage(this.props.language).Prompt.THE_MAP_IS_OPENED)
        //ConstInfo.MAP_ALREADY_OPENED)
        return
      }
      this.props.setContainerLoading(
        true,
        getLanguage(this.props.language).Prompt.SWITCHING,
        //ConstInfo.MAP_CHANGING
      )
      if (this.props.map.currentMap.name) {
        await SMap.removeLegendListener()
        await this.props.closeMap()
      }
      // 移除地图上所有callout
      SMediaCollector.removeMedias()
      // 清除属性历史记录
      await this.props.clearAttributeHistory()
      await this.props.setCurrentSymbols()
      let mapInfo = await this.props.openMap({ ...item })
      if (mapInfo) {
        Toast.show(
          getLanguage(this.props.language).Prompt.SWITCHING_SUCCESS,
          //ConstInfo.CHANGE_MAP_TO + mapInfo.name
        )
        //切换地图后重新添加图例事件
        if (GLOBAL.legend && GLOBAL.Type === constants.MAP_THEME) {
          await SMap.addLegendListener({
            legendContentChange: GLOBAL.legend._contentChange,
          })
        }
        if (mapInfo.Template) {
          this.props.setContainerLoading(
            true,
            //ConstInfo.TEMPLATE_READING
            getLanguage(this.props.language).Prompt.READING_TEMPLATE,
          )
          let templatePath = await FileTools.appendingHomeDirectory(
            ConstPath.UserPath + mapInfo.Template,
          )
          await this.props.getSymbolTemplates({
            path: templatePath,
            name: item.name,
          })
        } else {
          await this.props.setTemplate()
        }
        await SMap.openTaggingDataset(this.props.user.currentUser.userName)
        await this.props.getLayers(-1, async layers => {
          this.props.setCurrentLayer(layers.length > 0 && layers[0])
          // 若没有底图，默认添加地图
          // if (LayerUtils.getBaseLayers(layers).length > 0) {
          //   await SMap.openDatasource(
          //     ConstOnline['Google'].DSParams, GLOBAL.Type === constants.COLLECTION
          //       ? 1 : ConstOnline['Google'].layerIndex, false)
          // }
          // if (!LayerUtils.isBaseLayer(layers[layers.length - 1].caption)) {
          //   await LayerUtils.addBaseMap(
          //     layers,
          //     ConstOnline['Google'],
          //     GLOBAL.Type === constants.COLLECTION
          //       ? 1
          //       : ConstOnline['Google'].layerIndex,
          //     false,
          //   )
          //   await this.props.getLayers(-1)
          // }
        })

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
        //如果是标绘模块则加载标绘数据
        if (GLOBAL.Type === constants.MAP_PLOTTING) {
          let plotIconPath = await FileTools.appendingHomeDirectory(
            ConstPath.UserPath +
              this.props.user.currentUser.userName +
              '/' +
              ConstPath.RelativePath.Plotting +
              'PlotLibData',
          )
          await this.props.getSymbolPlots({
            path: plotIconPath,
            isFirst: true,
          })
        }

        this.props.setContainerLoading(false)
        this.setVisible(false)
      } else {
        this.props.getLayers(-1, layers => {
          this.props.setCurrentLayer(layers.length > 0 && layers[0])
        })
        Toast.show(ConstInfo.CHANGE_MAP_FAILED)
        this.props.setContainerLoading(false)
      }
      // })
    } catch (e) {
      Toast.show(ConstInfo.CHANGE_MAP_FAILED)
      this.props.setContainerLoading(false)
    }
  }

  /** 切换到裁剪界面 **/
  goToCut = () => {
    NavigationService.navigate('MapCut', {
      points: GLOBAL.MapSurfaceView.getResult(),
    })
  }

  //三维裁剪参数获取
  map3dCut = async () => {
    let data = GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.getResult()
    if (data[0].x !== data[0].y) {
      let clipSetting = {
        startX: ~~data[0].x,
        startY: ~~data[0].y,
        endX: ~~data[2].x,
        endY: ~~data[2].y,
        clipInner: true,
        layers: [],
        isCliped: false,
      }
      let rel = await this.cut3d(clipSetting)
      rel.isCliped = true
      let num
      Object.keys(rel).map(key => {
        switch (key) {
          case 'X':
          case 'Y':
            num = 6
            break
          case 'Z':
            num = 1
            break
          case 'zRot':
            num = 0
            break
          case 'length':
            num = 0
            break
          case 'width':
            num = 0
            break
          case 'height':
            num = 0
            break
          case 'clipInner':
            break
        }
        if (rel[key] * 1 === rel[key])
          rel[key] = parseFloat(rel[key].toFixed(num))
      })
      this.setState({
        clipSetting: rel,
      })
      GLOBAL.MapSurfaceView.show(false)
      this.showMap3DTool(ConstToolType.MAP3D_BOX_CLIP)
    } else {
      Toast.show(getLanguage(GLOBAL.language).Map_Main_Menu.CUT_FIRST)
    }
  }

  //三维裁剪
  cut3d = async data => {
    //todo 三维裁剪 分this.state.type
    let rel = await SScene.clipByBox(data)
    let num
    Object.keys(rel).map(key => {
      switch (key) {
        case 'X':
        case 'Y':
          num = 6
          break
        case 'Z':
          num = 1
          break
        case 'zRot':
          num = 0
          break
        case 'length':
          num = 0
          break
        case 'width':
          num = 0
          break
        case 'height':
          num = 0
          break
        case 'clipInner':
          break
      }
      if (rel[key] * 1 === rel[key])
        rel[key] = parseFloat(rel[key].toFixed(num))
    })
    return rel
  }
  renderList = () => {
    if (this.state.data.length === 0) return
    return (
      <ToolBarSectionList
        ref={ref => (this.toolBarSectionList = ref)}
        listSelectable={this.state.listSelectable}
        sections={this.state.data}
        itemAction={({ item, index, section }) => {
          if (this.state.type.indexOf('MAP_THEME_PARAM_') >= 0) {
            this.listThemeAction({ item, index, section })
          } else {
            this.listAction({ item, index, section })
          }
        }}
        selectList={this.state.listExpressions}
        listSelectableAction={({ selectList }) => {
          if (
            this.state.type === ConstToolType.MAP_THEME_PARAM_GRAPH_EXPRESSION
          ) {
            this.listSelectableAction({ selectList })
          }
          this.setState({
            listExpressions: selectList,
          })
        }}
        headerAction={this.headerAction}
        underlayColor={color.item_separate_white}
        keyExtractor={(item, index) => index}
        device={this.props.device}
      />
    )
  }

  renderTable = () => {
    return (
      <TableList
        data={this.state.data}
        type={this.state.tableType}
        numColumns={this.state.column}
        renderCell={this._renderItem}
        device={this.props.device}
      />
    )
  }

  renderCreatePlotAnimation = () => {
    return (
      <PlotAnimationView
        ref={ref => (this.plotAnimationView = ref)}
        data={this.state.data}
        saveAndContinue={this.saveAnimationAndContinue}
        layerName={
          this.props.selection[0] && this.props.selection[0].layerInfo.name
        }
        geoId={this.props.selection[0] && this.props.selection[0].ids[0]}
        Heighttype={this.state.type}
        device={this.props.device}
        showToolbar={this.setVisible}
      />
    )
  }

  renderHorizontalTable = () => {
    return (
      <HorizontalTableList
        data={this.state.data}
        numColumns={this.state.column}
        renderCell={this._renderItem}
        Heighttype={this.state.type}
        device={this.props.device}
      />
    )
  }

  renderColorTable = () => {
    return (
      <ColorTableList
        data={this.state.data}
        type={this.state.tableType}
        numColumns={this.state.column}
        renderCell={this._renderColorItem}
        device={this.props.device}
      />
    )
  }

  saveAnimationAndContinue = () => {
    let createInfo =
      this.plotAnimationView && this.plotAnimationView.getCreateInfo()
    if (this.props.selection.length > 0 && this.props.selection[0].ids > 0) {
      createInfo.geoId = this.props.selection[0].ids[0]
      createInfo.layerName = this.props.selection[0].layerInfo.name
    }
    SMap.createAnimationGo(createInfo, GLOBAL.newPlotMapName)
  }

  itemaction = async item => {
    switch (item.key) {
      case 'psDistance':
        item.action({
          callback: (result, listener) => {
            Toast.show(result + '米')
            this.MeasureListener = listener
          },
        })
        break
      case 'spaceSuerface':
        item.action({
          callback: (result, listener) => {
            Toast.show(result + '平方米')
            this.MeasureListener = listener
          },
        })
        break
      default:
        {
          let type = ''
          switch (item.key) {
            case constants.THEME_UNIQUE_STYLE:
              type = constants.THEME_UNIQUE_STYLE
              break
            case constants.THEME_RANGE_STYLE:
              type = constants.THEME_RANGE_STYLE
              break
            case constants.THEME_UNIFY_LABEL:
              type = constants.THEME_UNIFY_LABEL
              break
            case constants.THEME_UNIQUE_LABEL:
              type = constants.THEME_UNIQUE_LABEL
              break
            case constants.THEME_RANGE_LABEL:
              type = constants.THEME_RANGE_LABEL
              break
            case constants.THEME_GRAPH_AREA:
              type = constants.THEME_GRAPH_AREA
              break
            case constants.THEME_GRAPH_STEP:
              type = constants.THEME_GRAPH_STEP
              break
            case constants.THEME_GRAPH_LINE:
              type = constants.THEME_GRAPH_LINE
              break
            case constants.THEME_GRAPH_POINT:
              type = constants.THEME_GRAPH_POINT
              break
            case constants.THEME_GRAPH_BAR:
              type = constants.THEME_GRAPH_BAR
              break
            case constants.THEME_GRAPH_BAR3D:
              type = constants.THEME_GRAPH_BAR3D
              break
            case constants.THEME_GRAPH_PIE:
              type = constants.THEME_GRAPH_PIE
              break
            case constants.THEME_GRAPH_PIE3D:
              type = constants.THEME_GRAPH_PIE3D
              break
            case constants.THEME_GRAPH_ROSE:
              type = constants.THEME_GRAPH_ROSE
              break
            case constants.THEME_GRAPH_ROSE3D:
              type = constants.THEME_GRAPH_ROSE3D
              break
            case constants.THEME_GRAPH_STACK_BAR:
              type = constants.THEME_GRAPH_STACK_BAR
              break
            case constants.THEME_GRAPH_STACK_BAR3D:
              type = constants.THEME_GRAPH_STACK_BAR3D
              break
            case constants.THEME_GRAPH_RING:
              type = constants.THEME_GRAPH_RING
              break
            case constants.THEME_DOT_DENSITY:
              type = constants.THEME_DOT_DENSITY
              break
            case constants.THEME_GRADUATED_SYMBOL:
              type = constants.THEME_GRADUATED_SYMBOL
              break
            case constants.THEME_GRID_UNIQUE:
              type = constants.THEME_GRID_UNIQUE
              break
            case constants.THEME_GRID_RANGE:
              type = constants.THEME_GRID_RANGE
              break
            case constants.THEME_HEATMAP:
              type = constants.THEME_HEATMAP
              break
          }
          let menutoolRef =
            this.props.getMenuAlertDialogRef &&
            this.props.getMenuAlertDialogRef()
          if (menutoolRef && type !== '') {
            //创建的专题图类型
            this.setState({
              themeCreateType: type,
            })
            menutoolRef.setMenuType(type)
          }

          if (this.state.type === ConstToolType.MAP_THEME_PARAM_RANGE_MODE) {
            //分段专题图：分段方法
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              RangeMode: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_GRID_RANGE_RANGEMODE
          ) {
            //分段栅格专题图：分段方法
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              RangeMode: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE
          ) {
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              LabelBackShape: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME
          ) {
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              FontName: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_ROTATION
          ) {
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              Rotaion: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR
          ) {
            //统一标签前景色
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              Color: item.key,
              ColorType: 'UNIFORMLABEL_FORE_COLOR',
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR
          ) {
            //统一标签背景色
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              Color: item.key,
              ColorType: 'UNIFORMLABEL_BACKSHAPE_COLOR',
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type === ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE
          ) {
            //统计专题图类型
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              ThemeGraphType: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_GRAPH_GRADUATEDMODE
          ) {
            //统计专题图统计值计算方法
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              GraduatedMode: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE
          ) {
            //等级符号专题图分级方式
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              GraduatedMode: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type === ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_COLOR
          ) {
            //点密度专题图：点颜色
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              LineColor: item.key,
              ColorType: 'DOT_DENSITY_COLOR',
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_COLOR
          ) {
            //等级符号专题图：点颜色
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              LineColor: item.key,
              ColorType: 'GRADUATED_SYMBOL_COLOR',
            }
            ThemeMenuData.setThemeParams(Params)
          }
        }
        //init add xiezhy
        this.setState({ listExpressions: {} })
        item.action()
        break
    }
  }

  showMenuAlertDialog = type => {
    // let menutoolRef =
    //   this.props.getMenuAlertDialogRef && this.props.getMenuAlertDialogRef()
    // if (menutoolRef && type !== '') {
    //   menutoolRef.setMenuType(type)
    // }
    this.props.showFullMap && this.props.showFullMap(true)
    // menutoolRef && menutoolRef.showMenuDialog()

    this.setVisible(true, ConstToolType.MAP_THEME_PARAM, {
      isFullScreen: false,
      height: ConstToolType.THEME_HEIGHT[1],
      themeType: type,
    })
  }

  /** 编辑操作控制栏（撤销/重做/取消/提交） **/
  renderEditControlBar = () => {
    return <EditControlBar type={this.props.type} />
  }

  renderTabs = () => {
    return (
      <SymbolTabs
        style={styles.tabsView}
        showToolbar={this.setVisible}
        showBox={this.showBox}
      />
    )
  }

  renderSymbol = () => {
    return (
      <SymbolList
        device={this.props.device}
        layerData={this.props.currentLayer}
        themeSymbolType={this.state.themeSymbolType}
      />
    )
  }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    let column = this.state.column
    return (
      <MTBtn
        style={[styles.cell, { width: this.props.device.width / column }]}
        key={rowIndex + '-' + cellIndex}
        title={item.title}
        textColor={color.font_color_white}
        textStyle={{ fontSize: setSpText(20) }}
        // size={MTBtn.Size.NORMAL}
        image={item.image}
        background={item.background}
        onPress={() => {
          this.itemaction(item)
        }}
      />
    )
  }

  _renderColorItem = ({ item, rowIndex, cellIndex }) => {
    return (
      <ColorBtn
        key={rowIndex + '-' + cellIndex}
        background={item.background}
        onPress={() => {
          this.itemaction(item)
        }}
        device={this.props.device}
        numColumns={this.state.column}
      />
    )
  }
  getClipData = type => {
    let clipData
    let layerList = JSON.parse(JSON.stringify(this.props.layerList))
    switch (type) {
      case ConstToolType.MAP3D_BOX_CLIP:
        clipData = BoxClipData()
        break
      case ConstToolType.MAP3D_PLANE_CLIP:
        clipData = PlaneClipData()
        break
      case ConstToolType.MAP3D_CROSS_CLIP:
        clipData = CrossClipData()
        break
    }
    layerList.map(item => {
      let obj = item
      obj.title = item.name
      obj.iconType = 'Select'
      obj.isChecked = true
      clipData[0].data.push(obj)
    })
    return clipData
  }
  renderMap3DClip = () => {
    return (
      <MenuList
        ref={ref => (this.menuList = ref)}
        data={this.state.data}
        device={this.props.device}
        clipSetting={this.state.clipSetting}
        dataChangeCall={this.cut3d}
        changeHeight={this.changeHeight}
      />
    )
  }

  //标注 RecordSet数据改变
  _onValueChange = ({ title, text }) => {
    switch (title) {
      case getLanguage(global.language).Map_Main_Menu.TOOLS_NAME:
        this.tools_name = text
        break
      case getLanguage(global.language).Map_Main_Menu.TOOLS_REMARKS:
        this.tools_remarks = text
        break
      case getLanguage(global.language).Map_Main_Menu.TOOLS_HTTP:
        this.tools_http = text
        break
    }
  }
  renderInputView = () => {
    let data = this.state.data[0]
    let renderList = ({ item }) => {
      return (
        <Row
          style={styles.row}
          customRightStyle={styles.customInput}
          title={item.title}
          getValue={this._onValueChange}
          defaultValue={item.value}
        />
      )
    }
    if (data) {
      return (
        <View>
          <View style={styles.textHeader}>
            <Text style={styles.textFont}>{data.title}</Text>
          </View>
          <FlatList
            renderItem={renderList}
            data={data.data}
            keyExtractor={(item, index) => item.value + index}
          />
        </View>
      )
    }
    return null
  }
  renderMap3DList = () => {
    return (
      <Map3DToolBar
        ref={ref => (this.Map3DToolBar = ref)}
        data={this.state.data}
        type={this.state.type}
        setfly={this.setfly}
        setAnimation={this.setAnimation}
        showToolbar={this.showToolbar}
        existFullMap={this.props.existFullMap}
        importSceneWorkspace={this.props.importSceneWorkspace}
        refreshLayer3dList={this.props.refreshLayer3dList}
        device={this.props.device}
        newFly={this.newFly}
        changeLayerList={this.props.changeLayerList}
      />
    )
  }

  renderMenuDialog = () => {
    let list
    if (this.state.type.indexOf('MAP_THEME_PARAM') >= 0) {
      if (this.state.themeType === constants.THEME_UNIQUE_STYLE) {
        list = uniqueMenuInfo(this.props.language)
      } else if (this.state.themeType === constants.THEME_RANGE_STYLE) {
        list = rangeMenuInfo(this.props.language)
      } else if (this.state.themeType === constants.THEME_UNIFY_LABEL) {
        list = labelMenuInfo(this.props.language)
      } else if (this.state.themeType === constants.THEME_UNIQUE_LABEL) {
        list = uniqueLabelMenuInfo(this.props.language)
      } else if (this.state.themeType === constants.THEME_RANGE_LABEL) {
        list = rangeLabelMenuInfo(this.props.language)
      } else if (this.state.themeType === constants.THEME_GRAPH_STYLE) {
        list = graphMenuInfo(this.props.language)
      } else if (this.state.themeType === constants.THEME_DOT_DENSITY) {
        list = dotDensityMenuInfo(this.props.language)
      } else if (this.state.themeType === constants.THEME_GRADUATED_SYMBOL) {
        list = graduatedSymbolMenuInfo(this.props.language)
      } else if (this.state.themeType === constants.THEME_GRID_UNIQUE) {
        list = gridUniqueMenuInfo(this.props.language)
      } else if (this.state.themeType === constants.THEME_GRID_RANGE) {
        list = gridRangeMenuInfo(this.props.language)
      } else if (this.state.themeType === constants.THEME_HEATMAP) {
        list = heatmapMenuInfo(this.props.language)
      }
    } else if (this.state.type.indexOf('LEGEND') >= 0) {
      if (this.props.mapLegend.isShow) {
        list = legendMenuInfoNotVisible(this.props.language)
      } else {
        list = legendMenuInfo(this.props.language)
      }
    }
    if (!list) {
      switch (this.props.currentLayer.type) {
        case 1:
          list = point(this.props.language)
          break
        case 3:
          list = line(this.props.language)
          break
        case 5:
          list = region(this.props.language)
          break
        case 83:
          list = grid(this.props.language)
          break
      }
    }

    return (
      <MenuDialog
        ref={ref => (this.menuDialog = ref)}
        data={list}
        selectKey={this.state.selectKey}
        autoSelect={true}
        device={this.props.device}
        onSelect={item => {
          this.setState({
            selectKey: item.selectKey,
            selectName: item.selectName || item.key,
          })
        }}
      />
    )
  }

  renderView = () => {
    let box
    switch (this.state.containerType) {
      case list:
        switch (this.state.type) {
          case ConstToolType.MAP3D_BASE:
          case ConstToolType.MAP3D_TOOL_FLYLIST:
          case ConstToolType.MAP3D_ATTRIBUTE:
          case ConstToolType.MAP3D_WORKSPACE_LIST:
          case ConstToolType.MAP_PLOTTING_ANIMATION:
            box = this.renderMap3DList()
            break
          case ConstToolType.MAP3D_IMPORTWORKSPACE:
            box = this.renderMap3DList()
            break
          case ConstToolType.MAP3D_TOOL_DISTANCEMEASURE:
            box = this.renderMap3DList()
            break
          case ConstToolType.MAP3D_TOOL_SUERFACEMEASURE:
            box = this.renderMap3DList()
            break
          case ConstToolType.MAP3D_BOX_CLIP:
          case ConstToolType.MAP3D_PLANE_CLIP:
          case ConstToolType.MAP3D_CROSS_CLIP:
            box = this.renderMap3DClip()
            break
          case ConstToolType.MAP_TOOL_TAGGING_SETTING:
            box = this.renderInputView()
            break
          default:
            box = this.renderList()
            break
        }
        break
      case tabs:
        box = this.renderTabs()
        break
      case symbol:
        box = this.renderSymbol()
        break
      case colortable:
        box = this.renderColorTable()
        break
      case horizontalTable:
        box = this.renderHorizontalTable()
        break
      case createPlotAnimation:
        box = this.renderCreatePlotAnimation()
        break
      case table:
      default:
        box = this.renderTable()
    }
    return (
      <Animated.View
        style={{
          height: this.state.boxHeight,
          backgroundColor: color.content_white,
        }}
      >
        {box}
      </Animated.View>
    )
  }

  renderBottomBtn = (item, index) => {
    return (
      <TouchableOpacity
        key={item.type + '-' + index}
        onPress={() => item.action(item)}
        style={styles.button}
      >
        <Image style={styles.img} resizeMode={'contain'} source={item.image} />
      </TouchableOpacity>
    )
  }

  renderBottomBtns = () => {
    let btns = []
    if (this.state.buttons.length === 0) return null
    this.state.buttons.forEach((type, index) => {
      if (!type) return
      let image,
        action = () => {}
      switch (type) {
        case ToolbarBtnType.COMPLETE:
          image = require('../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = this.close
          break
        case ToolbarBtnType.CANCEL:
          image = require('../../../../assets/mapEdit/icon_function_cancel.png')
          action = this.close
          break
        case ToolbarBtnType.CANCEL_2:
          image = require('../../../../assets/mapEdit/icon_function_cancel.png')
          action = () => this.close(this.state.type, true)
          break
        case ToolbarBtnType.FLEX:
          image = require('../../../../assets/mapEdit/icon_function_theme_param_style.png')
          action = this.showBox
          break
        case ToolbarBtnType.FLEX_FULL:
          image = require('../../../../assets/mapEdit/flex.png')
          action = () => this.showBox(true)
          break
        case ToolbarBtnType.STYLE:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.showBox
          break
        case ToolbarBtnType.COMMIT:
          image = require('../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = this.commit
          break
        case ToolbarBtnType.COMMIT_CUT:
          image = require('../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = this.goToCut
          break
        case ToolbarBtnType.COMMIT_3D_CUT:
          image = require('../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = this.map3dCut
          break
        case ToolbarBtnType.MENU:
          image = require('../../../../assets/mapEdit/icon_function_theme_param_menu.png')
          action = this.menu
          break
        case ToolbarBtnType.MENUS:
          image = require('../../../../assets/mapEdit/icon_function_theme_param_menu.png')
          action = this.menus
          break
        case ToolbarBtnType.CLOSE_ANALYST:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.closeAnalyst
          break
        case ToolbarBtnType.CLEAR:
          image = require('../../../../assets/mapEdit/icon_clear.png')
          action = this.clear
          break
        case ToolbarBtnType.END_FLY:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.endFly
          break
        case ToolbarBtnType.END_ADD_FLY:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.endAddFly
          break
        case ToolbarBtnType.SAVE_FLY:
          image = require('../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = this.saveFly
          break
        case ToolbarBtnType.END_ANIMATION:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.endAnimation
          break
        case ToolbarBtnType.TAGGING_BACK:
          //返回上一级
          image = require('../../../../assets/public/Frenchgrey/icon-back-white.png')
          action = this.taggingback
          break
        case ToolbarBtnType.BACK:
          image = require('../../../../assets/mapEdit/icon_back.png')
          action = this.symbolBack
          break
        case ToolbarBtnType.SAVE:
          image = require('../../../../assets/mapEdit/commit.png')
          action = this.symbolSave
          break
        case ToolbarBtnType.CLOSE_SYMBOL:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.closeSymbol
          break
        case ToolbarBtnType.CLOSE_TOOL:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.closeTool
          break
        case ToolbarBtnType.CLEAR_ATTRIBUTE:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.clearAttribute
          break
        case ToolbarBtnType.CLEAR_CURRENT_LABEL:
          image = require('../../../../assets/mapEdit/icon_clear.png')
          action = this.clearCurrentLabel
          break
        case ToolbarBtnType.MAP_SYMBOL:
          image = require('../../../../assets/mapEdit/icon_function_symbol.png')
          action = this.showSymbol
          break
        case ToolbarBtnType.CHANGE_COLLECTION:
          image = getThemeAssets().collection.icon_collection_change
          action = this.changeCollection
          break
        case ToolbarBtnType.SHOW_ATTRIBUTE:
          image = require('../../../../assets/mapTools/icon_attribute_white.png')
          action = () => ToolbarButtonAction.showAttribute(this.props.selection)
          break
        case ToolbarBtnType.SHOW_MAP3D_ATTRIBUTE:
          image = require('../../../../assets/mapTools/icon_attribute_white.png')
          action = () => {
            NavigationService.navigate('LayerAttribute3D', { type: 'MAP_3D' })
          }
          break
        // case ToolbarBtnType.SHARE:
        //   image = require('../../../../assets/mapTools/icon_share.png')
        //   action = () => {
        //     if (!this.props.user.currentUser.userName) {
        //       Toast.show('请登陆后再分享')
        //       return
        //     }
        //     if (isSharing) {
        //       Toast.show('分享中，请稍后')
        //       return
        //     }
        //     if (this.shareTo === constants.SUPERMAP_ONLINE) {
        //       let list =
        //         (this.toolBarSectionList &&
        //           this.toolBarSectionList.getSelectList()) ||
        //         []
        //       this.props.setInputDialogVisible(true, {
        //         placeholder: '请输入分享数据名称',
        //         confirmAction: value => {
        //           ShareData.shareToSuperMapOnline(list, value)
        //           this.props.setInputDialogVisible(false)
        //         },
        //       })
        //     }
        //     // this.close()
        //   }
        //   break
        // case ToolbarBtnType.MAP3DSHARE:
        //   image = require('../../../../assets/mapTools/icon_share.png')
        //   action = () => {
        //     try {
        //       let isSharing = false
        //       if (!this.props.user.currentUser.userName) {
        //         Toast.show('请登陆后再分享')
        //         return
        //       }
        //       if (isSharing) {
        //         Toast.show('分享中，请稍后')
        //         return
        //       }
        //       if (this.shareTo === constants.SUPERMAP_ONLINE) {
        //         let list =
        //           (this.toolBarSectionList &&
        //             this.toolBarSectionList.getSelectList()) ||
        //           []
        //         if (list.length > 0) {
        //           isSharing = true
        //           for (let index = 0; index < list.length; index++) {
        //             this.props.exportmap3DWorkspace(
        //               { name: list[index] },
        //               async (result, zipPath) => {
        //                 if (result) {
        //                   await SOnlineService.uploadFile(
        //                     zipPath,
        //                     list[index],
        //                     {
        //                       onResult: async result => {
        //                         Toast.show(
        //                           result
        //                             ? ConstInfo.SHARE_SUCCESS
        //                             : ConstInfo.SHARE_FAILED,
        //                         )
        //                         FileTools.deleteFile(zipPath)
        //                         isSharing = false
        //                       },
        //                     },
        //                   )
        //                 } else {
        //                   Toast.show('上传失败')
        //                 }
        //               },
        //             )
        //           }
        //         }
        //       }
        //     } catch (error) {
        //       Toast.show('分享失败')
        //     }
        //     // this.close()
        //   }
        //   break
        case ToolbarBtnType.CLOSE_CIRCLE:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.closeCircle
          break
        case ToolbarBtnType.THEME_CANCEL:
          //专题图-退出
          image = require('../../../../assets/mapEdit/icon_function_cancel.png')
          action = this.close
          break
        case ToolbarBtnType.THEME_MENU:
          //专题图-菜单
          image = require('../../../../assets/mapEdit/icon_function_theme_param_menu.png')
          // action = this.showAlertDialog
          action = this.menu
          break
        // case ToolbarBtnType.THEME_FLEX:
        //   //专题图-显示与隐藏
        //   image = require('../../../../assets/mapEdit/icon_function_theme_param_style.png')
        //   action = this.showMenuBox
        //   break
        case ToolbarBtnType.THEME_COMMIT:
          //专题图-提交
          image = require('../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = this.themeCommit
          break
        case ToolbarBtnType.MENU_FLEX:
          //菜单框-显示与隐藏
          image = require('../../../../assets/mapEdit/icon_function_theme_param_style.png')
          action = this.showMenuBox
          break
        case ToolbarBtnType.VISIBLE:
          // 图例的显示与隐藏
          image = getPublicAssets().mapTools.tools_legend_on
          action = this.changeLegendVisible
          break
        case ToolbarBtnType.NOT_VISIBLE:
          // 图例的显示与隐藏
          image = getPublicAssets().mapTools.tools_legend_off
          action = this.changeLegendVisible
          break
        case ToolbarBtnType.MENU_COMMIT:
          //菜单框-提交
          image = require('../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = this.menuCommit
          // action = this.close
          break
        case ToolbarBtnType.THEME_ADD_BACK:
          //返回上一级
          image = require('../../../../assets/public/Frenchgrey/icon-back-white.png')
          action = this.back
          break
        case ToolbarBtnType.MEASURE_CLEAR:
          //量算-清除
          image = require('../../../../assets/mapEdit/icon_clear.png')
          action = () => MapToolData.clearMeasure(this.state.type)
          break
        case ToolbarBtnType.THEME_GRAPH_TYPE:
          //统计专题图类型
          image = getThemeAssets().themeType.theme_graphmap_selected
          action = this.changeGraphType
          break
        case ToolbarBtnType.PLOT_ANIMATION_XML_LIST:
          //推演动画xml列表
          image = getPublicAssets().plot.plot_animation_list
          action = this.showAnimationXmlList
          break
        case ToolbarBtnType.PLOT_ANIMATION_PLAY:
          //播放推演动画
          // image = require('../../../../assets/mapEdit/icon_packUP.png')
          image = getPublicAssets().plot.plot_play
          action = this.animationPlay
          break
        case ToolbarBtnType.PLOT_ANIMATIONGO_OBJECT_LIST:
          //显示动画节点对象列表
          image = require('../../../../assets/mapEdit/icon_function_theme_param_menu.png')

          break
        case ToolbarBtnType.PLOT_ANIMATION_SAVE:
          //保存推演动画节点mapTools/icon_save_black
          image = require('../../../../assets/mapTools/icon_save.png')
          action = this.animationSave
          break
      }

      if (type === ToolbarBtnType.PLACEHOLDER) {
        btns.push(<View style={styles.button} key={type + '-' + index} />)
      } else if (image) {
        btns.push(
          this.renderBottomBtn(
            {
              key: type,
              image: image,
              action: () => action(),
            },
            index,
          ),
        )
      }
    })
    return <View style={styles.buttonz}>{btns}</View>
  }

  overlayOnPress = () => {
    GLOBAL.TouchType = TouchType.NORMAL
    if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS ||
      this.state.type === ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION ||
      this.state.type ===
        ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME
    ) {
      this.setVisible(false)
    } else if (this.state.type.indexOf('MAP_THEME_PARAM') >= 0) {
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: Const.ANIMATED_DURATION,
      }).start()
      this.isBoxShow = false
      this.setState(
        {
          isFullScreen: false,
        },
        () => {
          this.updateOverlayerView()
        },
      )
    } else if (this.state.type === ConstToolType.MAP3D_WORKSPACE_LIST) {
      this.showToolbarAndBox(false)
      this.props.existFullMap && this.props.existFullMap()
      GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(false)
    } else if (this.state.type === ConstToolType.PLOT_ANIMATION_NODE_CREATE) {
      let createInfo =
        this.plotAnimationView && this.plotAnimationView.getCreateInfo()
      if (this.props.selection.length > 0 && this.props.selection[0].ids > 0) {
        createInfo.geoId = this.props.selection[0].ids[0]
        createInfo.layerName = this.props.selection[0].layerInfo.name
      }
      SMap.createAnimationGo(createInfo, GLOBAL.newPlotMapName)
      GLOBAL.animationWayData && (GLOBAL.animationWayData = null)
      // let length=createInfo.length
      // // this.showToolbarAndBox(false)
      // this.isBoxShow = true
      // GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(false)

      let height = 0
      this.props.showFullMap && this.props.showFullMap(true)
      let type = ConstToolType.PLOT_ANIMATION_START
      GLOBAL.currentToolbarType = type
      this.setVisible(true, type, {
        isFullScreen: false,
        height,
        cb: () => SMap.setAction(Action.SELECT),
      })
    } else {
      this.setVisible(false)
    }
    if (this.state.type === ConstToolType.MAP_BASE) {
      this.props.getLayers()
    }
    if (GLOBAL.Type === constants.MAP_EDIT) {
      GLOBAL.showMenu = true
      // GLOBAL.showFlex = true
      this.setState({ selectKey: '' })
    }
  }

  render() {
    let containerStyle = this.state.isFullScreen
      ? styles.fullContainer
      : styles.wrapContainer
    let height = this.state.isFullScreen
      ? { height: this.props.device.height }
      : {}
    if (this.state.isFullScreen && this.state.isTouchProgress) {
      let softBarHeight = this.state.hasSoftMenuBottom
        ? ExtraDimensions.getSoftMenuBarHeight()
        : 0
      height = { height: screen.getScreenSafeHeight() - softBarHeight }
    }
    // if (this.state.isFullScreen) {
    //   if (this.props.device.orientation === 'LANDSCAPE') {
    //     height =
    //       screen.deviceHeight < screen.deviceWidth
    //         ? { height: screen.deviceHeight }
    //         : { height: screen.deviceWidth }
    //   } else {
    //     height =
    //       screen.deviceHeight > screen.deviceWidth
    //         ? { height: screen.deviceHeight }
    //         : { height: screen.deviceWidth }
    //   }
    // }
    let keyboardVerticalOffset
    if (Platform.OS === 'android') {
      keyboardVerticalOffset =
        this.props.device.orientation === 'LANDSCAPE' ? 20 : 150
    } else {
      keyboardVerticalOffset =
        this.props.device.orientation === 'LANDSCAPE' ? 300 : 400
    }
    return (
      <Animated.View
        style={[containerStyle, { bottom: this.state.bottom }, height]}
      >
        {this.state.isFullScreen &&
          !this.state.isTouchProgress &&
          !this.state.showMenuDialog && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.overlayOnPress()
            }}
            style={styles.themeoverlay}
          />
        )}
        {this.state.isTouchProgress && this.state.isFullScreen && (
          <TouchProgress
            //language={this.props.language}
            selectName={this.state.selectName}
            showMenu={this.menu}
          />
        )}
        {/*{this.state.showMenuDialog && (*/}
        {/*<View style={styles.list}>{this.renderMenuDialog()}</View>*/}
        {/*)}*/}
        {this.state.showMenuDialog && this.renderMenuDialog()}
        {this.state.type === ConstToolType.MAP_TOOL_TAGGING_SETTING ? (
          <KeyboardAvoidingView
            keyboardVerticalOffset={keyboardVerticalOffset}
            behavior={'position'}
          >
            <View
              style={[
                styles.containers,
                !(
                  this.state.isFullScreen &&
                  !this.state.isTouchProgress &&
                  !this.state.showMenuDialog
                ) && styles.containers_border,
              ]}
            >
              {this.renderView()}
              {this.renderBottomBtns()}
            </View>
          </KeyboardAvoidingView>
        ) : (
          <View
            style={[
              styles.containers,
              !(
                this.state.isFullScreen &&
                !this.state.isTouchProgress &&
                !this.state.showMenuDialog
              ) && styles.containers_border,
            ]}
          >
            {this.renderView()}
            {this.renderBottomBtns()}
          </View>
        )}
      </Animated.View>
    )
  }
}
