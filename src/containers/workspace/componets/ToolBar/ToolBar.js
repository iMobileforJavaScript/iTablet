import React from 'react'
import { scaleSize, screen, Toast } from '../../../../utils'
import { color, zIndexLevel } from '../../../../styles'
import { MTBtn, TableList } from '../../../../components'
import {
  ConstToolType,
  ConstPath,
  BotMap,
  line,
  point,
  region,
  layerAdd,
  openData,
  Map3DBaseMapList,
} from '../../../../constants'
import TouchProgress from '../TouchProgress'
import Map3DToolBar from '../Map3DToolBar'
import NavigationService from '../../../../containers/NavigationService'
import ToolbarData from './ToolbarData'
import EditControlBar from './EditControlBar'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  SectionList,
  Animated,
  FlatList,
} from 'react-native'
import {
  SMap,
  SScene,
  Action,
  DatasetType,
  SCollector,
  GeoStyle,
  SMCollectorType,
  Utility,
} from 'imobile_for_reactnative'
import SymbolTabs from '../SymbolTabs'
import SymbolList from '../SymbolList/SymbolList'
import ToolbarBtnType from './ToolbarBtnType'

import jsonUtil from '../../../../utils/jsonUtil'

/** 工具栏类型 **/
const list = 'list'
const table = 'table'
const tabs = 'tabs'
const symbol = 'symbol'
// 工具表格默认高度
const DEFAULT_COLUMN = 4
// 是否全屏显示，是否有Overlay
const DEFAULT_FULL_SCREEN = true
// 地图按钮栏默认高度
const BUTTON_HEIGHT = scaleSize(80)

export default class ToolBar extends React.Component {
  props: {
    children: any,
    type?: string,
    containerProps?: Object,
    data: Array,
    existFullMap: () => {},
    symbol?: Object,
    user?: Object,
    confirm: () => {},
    showDialog: () => {},
    addGeometrySelectedListener: () => {},
    removeGeometrySelectedListener: () => {},
    setSaveViewVisible?: () => {},
    setSaveMapDialogVisible?: () => {},
    setContainerLoading?: () => {},
    showFullMap: () => {},
    dialog: Object,
    tableType?: string, // 用于设置表格类型 normal | scroll
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
    this.lastType = ''
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
      bottom: new Animated.Value(-screen.deviceHeight),
      boxHeight: new Animated.Value(this.height),
      isSelectlist: false,
      isTouch: true,
      isTouchProgress: false,
      tableType: 'normal',
      layerData: Object,
      selectName: '',
    }
    this.isShow = false
    this.isBoxShow = true
  }

  // /**建筑单体触控监听 */
  // attributeListen() {
  //   this.listenevent = SScene.addListener({
  //     callback: result => {
  //       //  console.log(result)
  //       this.showMap3DAttribute(result)
  //     },
  //   })
  // }

  getOriginType = () => {
    return this.originType
  }

  getType = () => {
    return this.type
  }

  showFullMap = () => {
    this.props.showFullMap && this.props.showFullMap(true)
  }

  getData = type => {
    let data, buttons, toolbarData
    // toolbarData = this.getCollectionData(type)
    toolbarData = ToolbarData.getTabBarData(type, {
      user: this.props.user,
      setToolbarVisible: this.setVisible,
      showFullMap: this.props.showFullMap,
      addGeometrySelectedListener: this.props.addGeometrySelectedListener,
      setSaveViewVisible: this.props.setSaveViewVisible,
      setSaveMapDialogVisible: this.props.setSaveMapDialogVisible,
      setContainerLoading: this.props.setContainerLoading,
    })
    data = toolbarData.data
    buttons = toolbarData.buttons
    if (data.length > 0) return { data, buttons }

    switch (type) {
      case ConstToolType.MAP_BASE:
        data = BotMap
        buttons = [ToolbarBtnType.CANCEL]
        break
      case ConstToolType.MAP3D_BASE:
        data = Map3DBaseMapList.baseListData
        buttons = [ToolbarBtnType.CANCEL]
        break
      case ConstToolType.MAP3D_ADD_LAYER:
        data = Map3DBaseMapList.layerListdata
        buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.COMMIT]
        break
      case ConstToolType.MAP_ADD_LAYER:
        data = layerAdd
        buttons = [ToolbarBtnType.CANCEL]
        break
      case ConstToolType.MAP_OPEN:
        //读取目录下UDB文件名和MAP文件名
        //
        // (async function() {
        //   //获取目录下的xml文件
        //   let absolutePath = await Utility.appendingHomeDirectory(ConstPath.LocalDataPath)
        //   let fileList = await Utility.getPathListByFilter(absolutePath, {
        //     type: 'xml',
        //   })
        //   this.setState({
        //     data: fileList,
        //     showData: true,
        //   })
        // }.bind(this))
        data = openData
        buttons = [ToolbarBtnType.CANCEL]
        break
      case ConstToolType.MAP_SYMBOL:
        // buttons = [ToolbarBtnType.CANCEL]
        break
      // 第一级采集选项
      case ConstToolType.MAP_COLLECTION_POINT:
      case ConstToolType.MAP_COLLECTION_LINE:
      case ConstToolType.MAP_COLLECTION_REGION: {
        let gpsPointType =
          type === ConstToolType.MAP_COLLECTION_POINT
            ? SMCollectorType.POINT_GPS
            : type === ConstToolType.MAP_COLLECTION_LINE
              ? SMCollectorType.LINE_GPS_POINT
              : SMCollectorType.REGION_GPS_POINT
        data.push({
          key: 'gpsPoint',
          title: 'GPS打点',
          action: () => this.showCollection(gpsPointType),
          size: 'large',
          image: require('../../../../assets/function/icon_function_base_map.png'),
        })
        if (type !== ConstToolType.MAP_COLLECTION_POINT) {
          let gpsPathType =
            type === ConstToolType.MAP_COLLECTION_LINE
              ? SMCollectorType.LINE_GPS_PATH
              : SMCollectorType.REGION_GPS_PATH
          data.push({
            key: 'gpsPath',
            title: 'GPS轨迹',
            action: () => this.showCollection(gpsPathType),
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          })
        }
        let pointDrawType =
          type === ConstToolType.MAP_COLLECTION_POINT
            ? SMCollectorType.POINT_HAND
            : type === ConstToolType.MAP_COLLECTION_LINE
              ? SMCollectorType.LINE_HAND_POINT
              : SMCollectorType.REGION_HAND_POINT
        data.push({
          key: 'pointDraw',
          title: '点绘式',
          action: () => this.showCollection(pointDrawType),
          size: 'large',
          image: require('../../../../assets/function/icon_function_base_map.png'),
        })
        if (type !== ConstToolType.MAP_COLLECTION_POINT) {
          let freeDrawType =
            type === ConstToolType.MAP_COLLECTION_LINE
              ? SMCollectorType.LINE_HAND_PATH
              : SMCollectorType.REGION_HAND_PATH
          data.push({
            key: 'freeDraw',
            title: '自由式',
            action: () => this.showCollection(freeDrawType),
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          })
        } else {
          data.push({
            key: 'takePhoto',
            title: '拍照',
            action: () => this.showCollection(type),
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          })
        }
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.FLEX,
          ToolbarBtnType.PLACEHOLDER,
        ]
        break
      }
      case ConstToolType.MAP_EDIT_REGION:
        data = [
          {
            key: 'addPoint',
            title: '添加节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'editPoint',
            title: '编辑节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
        break
      case ConstToolType.MAP_EDIT_LINE:
        data = [
          {
            key: 'addPoint',
            title: '添加节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'editPoint',
            title: '编辑节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        break
      case ConstToolType.MAP_EDIT_POINT:
        data = [
          {
            key: 'addPoint',
            title: '添加节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'editPoint',
            title: '编辑节点',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'pointDraw',
            title: '点绘式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'freeDraw',
            title: '自由式',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            key: 'takePhoto',
            title: '拍照',
            action: this.changeLayer,
            size: 'large',
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
        ]
        break
      case ConstToolType.MAP_STYLE:
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ]
        break
      case ConstToolType.MAP3D_SYMBOL:
        data = [
          {
            key: 'map3DPoint',
            title: '兴趣点',
            action: () => {
              try {
                SScene.startDrawFavorite({
                  callback: () => {
                    this.showToolbar()
                  },
                })
                this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINT)
              } catch (error) {
                Toast.show('兴趣点失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/function/icon_favorite.png'),
          },
          {
            key: 'map3DText',
            title: '文字',
            action: () => {
              try {
                SScene.startDrawText({
                  callback: result => {
                    this.showToolbar()
                    this.props.dialog.setDialogVisible(true)
                    this.point = result
                  },
                })
                this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_TEXT)
              } catch (error) {
                Toast.show('添加文字失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/function/icon_text.png'),
          },
          {
            key: 'map3DPiontLine',
            title: '点绘线',
            action: () => {
              try {
                SScene.startDrawLine()
                this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINTLINE)
              } catch (error) {
                Toast.show('点绘线失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/function/icon_pointLine.png'),
          },
          {
            key: 'map3DPointSurface',
            title: '点绘面',
            action: () => {
              try {
                SScene.startDrawArea()
                this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINTSURFACE)
              } catch (error) {
                Toast.show('点绘面失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/function/icon_pointSuerface.png'),
          },
        ]
        buttons = [ToolbarBtnType.CLOSE_SYMBOL, ToolbarBtnType.FLEX]
        break
      case ConstToolType.MAP3D_TOOL:
        data = [
          {
            key: 'distanceMeasure',
            title: '距离量算',
            action: () => {
              SScene.setMeasureLineAnalyst({
                callback: result => {
                  this.Map3DToolBar &&
                    this.Map3DToolBar.setAnalystResult(result)
                },
              })
              this.showAnalystResult(ConstToolType.MAP3D_TOOL_DISTANCEMEASURE)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_analystLien.png'),
          },
          {
            key: 'suerfaceMeasure',
            title: '面积量算',
            action: () => {
              SScene.setMeasureSquareAnalyst({
                callback: result => {
                  this.Map3DToolBar &&
                    this.Map3DToolBar.setAnalystResult(result)
                },
              })
              this.showAnalystResult(ConstToolType.MAP3D_TOOL_SUERFACEMEASURE)
            },
            size: 'large',
            image: require('../../../../assets/function/icon_analystSuerface.png'),
          },
          {
            key: 'fly',
            title: '飞行轨迹',
            action: () => {
              // this.isShow=!this.isShow
              // this.setVisible(true, ConstToolType.MAP3D_TOOL_FLYLIST, {
              //   containerType: 'list',
              //   isFullScreen:true,
              this.showMap3DTool(ConstToolType.MAP3D_TOOL_FLYLIST)
              // })
              // this.getflylist()
            },
            size: 'large',
            image: require('../../../../assets/function/icon_symbolFly.png'),
          },
        ]
        buttons = [ToolbarBtnType.CLOSE_TOOL, ToolbarBtnType.FLEX]
        break
    }
    return { data, buttons }
  }

  getflylist = async () => {
    try {
      let flydata = await SScene.getFlyRouteNames()
      let data = [{ title: '飞行轨迹列表', data: flydata }]
      let buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      return { data, buttons }
    } catch (error) {
      Toast.show('当前场景无飞行轨迹')
    }
    this.isShow = false
    this.isBoxShow = true
  }

  /** 创建采集 **/
  createCollector = async type => {
    // 风格
    let geoStyle = new GeoStyle()
    // geoStyle.setPointColor(0, 255, 0)
    // //线颜色
    // geoStyle.setLineColor(0, 110, 220)
    // //面颜色
    // geoStyle.setFillForeColor(255, 0, 0)
    //
    // let style = await SCollector.getStyle()
    let mType
    switch (type) {
      case SMCollectorType.POINT_GPS:
      case SMCollectorType.POINT_HAND: {
        if (this.props.symbol.currentSymbol.type === 'marker') {
          geoStyle.setMarkerStyle(this.props.symbol.currentSymbol.id)
        }
        mType = DatasetType.POINT
        break
      }
      case SMCollectorType.LINE_GPS_POINT:
      case SMCollectorType.LINE_GPS_PATH:
      case SMCollectorType.LINE_HAND_POINT:
      case SMCollectorType.LINE_HAND_PATH: {
        if (this.props.symbol.currentSymbol.type === 'line') {
          geoStyle.setLineStyle(this.props.symbol.currentSymbol.id)
        }
        mType = DatasetType.LINE
        break
      }
      case SMCollectorType.REGION_GPS_POINT:
      case SMCollectorType.REGION_GPS_PATH:
      case SMCollectorType.REGION_HAND_POINT:
      case SMCollectorType.REGION_HAND_PATH: {
        if (this.props.symbol.currentSymbol.type === 'fill') {
          geoStyle.setFillStyle(this.props.symbol.currentSymbol.id)
        }
        mType = DatasetType.REGION
        break
      }
    }
    //设置绘制风格
    SCollector.setStyle(geoStyle)

    let datasetName = this.props.symbol.currentSymbol.type
      ? this.props.symbol.currentSymbol.type +
        '_' +
        this.props.symbol.currentSymbol.id
      : ''
    let datasourcePath =
      this.props.user &&
      this.props.user.currentUser &&
      this.props.user.currentUser.name
        ? ConstPath.UserPath +
          this.props.user.currentUser.name +
          ConstPath.RelativePath.Datasource
        : ConstPath.CustomerPath + ConstPath.RelativePath.Datasource
    let datasourceName = 'Collection'
    SCollector.setDataset({
      datasourcePath: (await Utility.appendingHomeDirectory()) + datasourcePath,
      datasourceName,
      datasetName,
      datasetType: mType,
      style: geoStyle,
    }).then(result => {
      result && SCollector.startCollect(type)
    })
  }

  /** 采集分类点击事件 **/
  showCollection = type => {
    let { data, buttons } = this.getData(type)
    this.lastType = this.state.type
    this.setState(
      {
        type: type,
        data: data,
        buttons: buttons,
        // height: ConstToolType.HEIGHT[0],
        column: data.length,
      },
      () => {
        this.height = ConstToolType.HEIGHT[0]
        this.createCollector(type)
        this.showToolbar()
      },
    )
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
          } else {
            this.height = ConstToolType.HEIGHT[1]
          }
          this.showToolbar()
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
        buttons: [
          ToolbarBtnType.CLOSE_ANALYST,
          ToolbarBtnType.CLEAR,
          ToolbarBtnType.FLEX,
        ],
        // height: ConstToolType.HEIGHT[0],
        // column: data.length,
        containerType: 'list',
      },
      () => {
        // this.createCollector(type)
        this.height = ConstToolType.HEIGHT[0]
        this.showToolbar()
      },
    )
  }

  /** 三维分类点击事件*/
  showMap3DTool = async type => {
    if (type === ConstToolType.MAP3D_TOOL_FLYLIST) {
      let { data, buttons } = await this.getflylist()
      this.setState(
        {
          type: type,
          data: data,
          buttons: buttons,
          containerType: 'list',
        },
        () => {
          this.height = ConstToolType.HEIGHT[1]
          this.showToolbar()
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
              break
            case ConstToolType.MAP3D_CIRCLEFLY:
              this.height = ConstToolType.HEIGHT[0]
              this.showToolbar()
              break
            default:
              this.height = 0
              this.showToolbar()
              break
          }
        },
      )
    }
  }

  /** 拍照 **/
  takePhoto = () => {}

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
    if (this.state.type === ConstToolType.MAP3D_CIRCLEFLY) {
      SScene.stopCircleFly()
      // SScene.clearCirclePoint()
    }
    if (!params.layerData) params.layerData = []
    if (this.isShow === isShow && type === this.state.type) return
    if (
      this.state.type !== type ||
      params.isFullScreen !== this.state.isFullScreen ||
      params.height !== this.height ||
      params.column !== this.state.column ||
      params.layerData !== this.state.layerData
    ) {
      let { data, buttons } = this.getData(type)
      this.originType = type
      this.height =
        params && typeof params.height === 'number'
          ? params.height
          : ConstToolType.HEIGHT[1]
      data = params.data || data
      this.setState(
        {
          isSelectlist: false,
          type: type,
          tableType: params.tableType || 'normal',
          data: data,
          layerData: params.layerData,
          buttons: buttons,
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
        },
        () => {
          this.showToolbar(isShow)
          !isShow && this.props.existFullMap && this.props.existFullMap()
        },
      )
    } else {
      this.showToolbar(isShow)
      !isShow && this.props.existFullMap && this.props.existFullMap()
    }
    this.isBoxShow = true
  }

  showToolbar = isShow => {
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      Animated.timing(this.state.bottom, {
        toValue: isShow ? 0 : -screen.deviceHeight,
        duration: 300,
      }).start()
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
      Animated.timing(this.state.boxHeight, {
        toValue: this.height,
        duration: 300,
      }).start()
    }
  }

  close = (type = this.state.type) => {
    GLOBAL.currentToolbarType = ''
    // 关闭采集, type 为number时为采集类型，若有冲突再更改
    if (
      typeof type === 'number' ||
      (typeof type === 'string' && type.indexOf('MAP_COLLECTION_') >= 0)
    ) {
      SCollector.stopCollect()
    }
    if (
      typeof type === 'string' &&
      type.indexOf('MAP_EDIT_') >= 0 &&
      type !== ConstToolType.MAP_EDIT_DEFAULT
    ) {
      GLOBAL.currentToolbarType = ConstToolType.MAP_EDIT_DEFAULT
      // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
      this.setVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
        isFullScreen: false,
        height: 0,
      })
      SMap.setAction(Action.SELECT)
    } else if (
      typeof type === 'number' ||
      (typeof type === 'string' && type.indexOf('MAP_') >= -1)
    ) {
      // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
      SMap.setAction(Action.PAN)
    }
    this.showToolbar(false)
    this.setState({ isTouchProgress: false, isSelectlist: false })
    this.props.existFullMap && this.props.existFullMap()
  }

  clearCurrentLabel = () => {
    SScene.clearcurrentLabel()
  }

  closeSymbol = () => {
    SScene.clearAllLabel()
    SScene.checkoutListener('startTouchAttribute')
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  closeTool = () => {
    SScene.checkoutListener('startTouchAttribute')
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  symbolSave = () => {
    try {
      SScene.save()
      Toast.show('保存成功')
    } catch (error) {
      Toast.show('保存失败')
    }
  }

  symbolBack = () => {
    SScene.symbolback()
  }

  getPoint = () => {
    return this.point
  }

  getType = () => {
    return this.type
  }

  getOldLayerList = data => {
    this.oldLayerList = data
  }

  menu = () => {
    Animated.timing(this.state.boxHeight, {
      toValue: this.isBoxShow ? 0 : this.height,
      duration: 300,
    }).start()
    this.isBoxShow = !this.isBoxShow

    if (this.state.isSelectlist === false) {
      this.setState({ isFullScreen: true, isSelectlist: true })
    } else {
      this.setState({ isFullScreen: false, isSelectlist: false })
    }
    this.setState({ isTouchProgress: false })
  }

  menus = () => {
    if (this.state.isSelectlist === false) {
      this.setState({ isSelectlist: true })
    } else {
      this.setState({ isSelectlist: false })
    }
  }

  commit = (type = this.originType) => {
    this.showToolbar(false)
    if (type.indexOf('MAP_EDIT_TAGGING') >= 0) {
      SMap.submit()
      SMap.setAction(Action.PAN)
    }
    this.props.existFullMap && this.props.existFullMap()
  }

  showBox = () => {
    Animated.timing(this.state.boxHeight, {
      toValue: this.isBoxShow ? 0 : this.height,
      duration: 300,
    }).start()
    this.isBoxShow = !this.isBoxShow
  }

  showSymbol = () => {
    this.props.showFullMap && this.props.showFullMap(true)
    this.setVisible(true, ConstToolType.MAP_SYMBOL, {
      isFullScreen: true,
      height: ConstToolType.HEIGHT[3],
    })
  }

  clearAttribute = () => {
    SScene.clearSelection()
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  closeCircle = () => {
    SScene.stopCircleFly()
    SScene.clearCirclePoint()
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  closeAnalyst = () => {
    SScene.closeAnalysis()
    SScene.checkoutListener('startTouchAttribute')
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  clear = () => {
    switch (this.state.type) {
      case ConstToolType.MAP3D_TOOL_SUERFACEMEASURE:
        SScene.clearSquareAnalyst()
        this.Map3DToolBar.setAnalystResult(0)
        break
      case ConstToolType.MAP3D_TOOL_DISTANCEMEASURE:
        SScene.clearLineAnalyst()
        this.Map3DToolBar.setAnalystResult(0)
        break
      default:
        SScene.clear()
        break
    }
  }

  endFly = () => {
    for (let index = 0; index < this.oldLayerList.length; index++) {
      SScene.setSelectable(
        this.oldLayerList[index].name,
        this.oldLayerList[index].selectable,
      )
    }
    SScene.flyStop()
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  setfly = index => {
    SScene.setPosition(index)
    this.showMap3DTool(ConstToolType.MAP3D_TOOL_FLY)
  }

  renderListItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.listAction({ item, index })
        }}
      >
        <Text style={styles.item}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  renderListSectionHeader = ({ section }) => {
    return <Text style={styles.sectionHeader}>{section.title}</Text>
  }

  listAction = ({ item, index }) => {
    if (this.state.type === 'MAP3D_BASE') return
    if (item.action) {
      item.action && item.action()
    } else if (this.state.type === ConstToolType.MAP_ADD_LAYER) {
      NavigationService.navigate('WorkspaceFlieList', {
        cb: async path => {
          this.path = path
          let list = await SMap.getUDBName(path)
          let datalist = [
            {
              title: '数据集',
              data: list,
            },
          ]
          this.setState({ data: datalist, type: ConstToolType.MAP_ADD_DATASET })
        },
      })
    } else if (this.state.type === ConstToolType.MAP_ADD_DATASET) {
      (async function() {
        let udbpath = {
          server: this.path,
          alias: item.title,
          engineType: 219,
        }
        await SMap.openDatasource(udbpath, index)
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

            await SMap.closeMap()
            await SMap.openMapFromXML(path)
          }
        },
      })
    } else if (this.state.type === ConstToolType.MAP_CHANGE) {
      // 打开地图
      SMap.openMap(item.title)
    }
  }

  renderList = () => {
    if (this.state.data.length === 0) return
    return (
      <SectionList
        sections={this.state.data}
        renderItem={this.renderListItem}
        renderSectionHeader={this.renderListSectionHeader}
        keyExtractor={(item, index) => index}
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
      />
    )
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
        item.action()
        break
    }
  }

  /** 编辑操作控制栏（撤销/重做/取消/提交） **/
  renderEditControlBar = () => {
    return <EditControlBar type={this.props.type} />
  }

  renderTabs = () => {
    return <SymbolTabs style={styles.tabsView} showToolbar={this.setVisible} />
  }

  renderSymbol = () => {
    return <SymbolList layerData={this.state.layerData} />
  }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    return (
      <MTBtn
        style={[styles.cell, { width: screen.deviceWidth / this.state.column }]}
        key={rowIndex + '-' + cellIndex}
        title={item.title}
        textColor={'white'}
        size={MTBtn.Size.NORMAL}
        image={item.image}
        onPress={() => {
          this.itemaction(item)
        }}
      />
    )
  }

  renderMap3DList = () => {
    return (
      <Map3DToolBar
        ref={ref => (this.Map3DToolBar = ref)}
        data={this.state.data}
        type={this.state.type}
        setfly={this.setfly}
      />
    )
  }

  renderSelectList = () => {
    let list
    switch (this.state.layerData.type) {
      case 1:
        list = point
        break
      case 3:
        list = line
        break
      case 5:
        list = region
        break
    }
    return (
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => item.action(item)}>
            <Text style={styles.item}>{item.key}</Text>
          </TouchableOpacity>
        )}
      />
    )
  }

  renderView = () => {
    let box
    switch (this.state.containerType) {
      case list:
        switch (this.state.type) {
          case 'MAP3D_BASE':
            box = this.renderMap3DList()
            break
          case 'MAP3D_TOOL_FLYLIST':
            box = this.renderMap3DList()
            break
          case 'MAP3D_ATTRIBUTE':
            box = this.renderMap3DList()
            break
          case 'MAP3D_TOOL_SUERFACEMEASURE':
            box = this.renderMap3DList()
            break
          case 'MAP3D_TOOL_DISTANCEMEASURE':
            box = this.renderMap3DList()
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
      case table:
      default:
        box = this.renderTable()
    }
    return (
      <Animated.View style={{ height: this.state.boxHeight }}>
        {box}
      </Animated.View>
    )
  }

  renderBottomBtn = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
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
      let image,
        action = () => {}
      switch (type) {
        case ToolbarBtnType.CANCEL:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.close
          break
        case ToolbarBtnType.FLEX:
          image = require('../../../../assets/mapEdit/flex.png')
          action = this.showBox
          break
        case ToolbarBtnType.STYLE:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.showBox
          break
        case ToolbarBtnType.COMMIT:
          image = require('../../../../assets/mapEdit/commit.png')
          action = this.commit
          break
        case ToolbarBtnType.MENU:
          image = require('../../../../assets/mapEdit/menu.png')
          action = this.menu
          break
        case ToolbarBtnType.MENUS:
          image = require('../../../../assets/mapEdit/menu.png')
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
          image = require('../../../../assets/mapEdit/icon-theme-white.png')
          action = this.showSymbol
          break
        case ToolbarBtnType.CHANGE_COLLECTION:
          image = require('../../../../assets/mapEdit/icon-rename-white.png')
          action = () => {
            SCollector.stopCollect()
            this.setVisible(true, this.lastType, {
              isFullScreen: false,
              height: ConstToolType.HEIGHT[0],
            })
          }
          break
        case ToolbarBtnType.SHOW_ATTRIBUTE:
          image = require('../../../../assets/mapEdit/icon-rename-white.png')
          action = () => {
            NavigationService.navigate('layerSelectionAttribute', {
              type: 'singleAttribute',
            })
          }
          break
        case ToolbarBtnType.CLOSE_CIRCLE:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.closeCircle
          break
      }

      if (type === ToolbarBtnType.PLACEHOLDER) {
        btns.push(<View style={styles.button} key={type + '-' + index} />)
      } else if (image) {
        btns.push(
          this.renderBottomBtn(
            {
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

  render() {
    let containerStyle = this.state.isFullScreen
      ? styles.fullContainer
      : styles.wrapContainer
    return (
      <Animated.View style={[containerStyle, { bottom: this.state.bottom }]}>
        {this.state.isFullScreen &&
          !this.state.isTouchProgress && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setVisible(false)}
            style={styles.overlay}
          />
        )}
        {this.state.isTouchProgress &&
          this.state.isFullScreen && (
          <TouchProgress
            layerData={this.state.layerData}
            selectName={this.state.selectName}
          />
        )}
        {this.state.isSelectlist && (
          <View style={{ position: 'absolute', top: '30%', left: '45%' }}>
            {this.renderSelectList()}
          </View>
        )}
        <View style={styles.containers}>
          {this.renderView()}
          {this.renderBottomBtns()}
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  fullContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    height: screen.deviceHeight,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  wrapContainer: {
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    zIndex: zIndexLevel.FOUR,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#rgba(0, 0, 0, 0)',
    // zIndex: zIndexLevel.FOUR,
  },
  containers: {
    flexDirection: 'column',
    width: '100%',
    maxHeight: ConstToolType.HEIGHT[3] + BUTTON_HEIGHT,
    minHeight: BUTTON_HEIGHT,
    backgroundColor: color.theme,
    // zIndex: zIndexLevel.FOUR,
  },
  buttonz: {
    flexDirection: 'row',
    height: BUTTON_HEIGHT,
    paddingHorizontal: scaleSize(20),
    backgroundColor: color.theme,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    // flex: 1,
    height: scaleSize(60),
    width: scaleSize(60),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.theme,
  },
  img: {
    height: scaleSize(40),
    width: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    fontSize: 23,
    fontWeight: 'bold',
    backgroundColor: color.theme,
    color: 'white',
  },
  item: {
    padding: 10,
    fontSize: 18,
    paddingLeft: 20,
    height: 44,
    backgroundColor: color.theme,
    color: 'white',
  },
  cell: {
    // flex: 1,
  },
  tabsView: {
    height: ConstToolType.HEIGHT[3] - BUTTON_HEIGHT,
  },
  table: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
    alignItems: 'center',
    backgroundColor: color.blackBg,
  },
})
