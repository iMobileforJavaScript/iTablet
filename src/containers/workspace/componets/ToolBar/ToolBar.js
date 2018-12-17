import React from 'react'
import { screen, Toast } from '../../../../utils'
import { MTBtn, TableList } from '../../../../components'
import {
  ConstToolType,
  ConstPath,
  ConstOnline,
  BotMap,
  line,
  point,
  region,
  grid,
  layerAdd,
  openData,
  lineColorSet,
  pointColorSet,
  regionBeforeColorSet,
  regionAfterColorSet,
  Map3DBaseMapList,
  ConstInfo,
} from '../../../../constants'
import TouchProgress from '../TouchProgress'
import Map3DToolBar from '../Map3DToolBar'
import NavigationService from '../../../../containers/NavigationService'
import ToolbarData from './ToolbarData'
import EditControlBar from './EditControlBar'
import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Text,
  Animated,
  FlatList,
} from 'react-native'
import {
  SMap,
  SScene,
  Action,
  SCollector,
  EngineType,
  SThemeCartography,
  SOnlineService,
  Utility,
} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import SymbolTabs from '../SymbolTabs'
import SymbolList from '../SymbolList/SymbolList'
import ToolbarBtnType from './ToolbarBtnType'
import ThemeMenuData from './ThemeMenuData'
import ToolBarSectionList from './ToolBarSectionList'
import constants from '../../constants'

import jsonUtil from '../../../../utils/jsonUtil'
import ColorTableList from '../../../../components/ColorTableList'
import { ColorBtn } from '../../../../components/mapTools'
import { FileTools } from '../../../../native'

import styles from './styles'

/** 工具栏类型 **/
const list = 'list'
const table = 'table'
const tabs = 'tabs'
const symbol = 'symbol'
// 工具表格默认高度
const DEFAULT_COLUMN = 4
// 是否全屏显示，是否有Overlay
const DEFAULT_FULL_SCREEN = true

let isSharing = false

export default class ToolBar extends React.Component {
  props: {
    children: any,
    type?: string,
    containerProps?: Object,
    data: Array,
    existFullMap: () => {},
    symbol?: Object,
    user?: Object,
    map?: Object,
    layers?: Object,
    collection?: Object,
    layerData: Object,
    confirm: () => {},
    showDialog: () => {},
    addGeometrySelectedListener: () => {},
    removeGeometrySelectedListener: () => {},
    setSaveViewVisible?: () => {},
    setSaveMapDialogVisible?: () => {},
    setContainerLoading?: () => {},
    showFullMap: () => {},
    dialog: () => {},
    tableType?: string, // 用于设置表格类型 normal | scroll
    getMenuAlertDialogRef: () => {},
    getLayers?: () => {}, // 更新数据（包括其他界面）
    setCurrentMap?: () => {}, // 设置当前地图
    setCollectionInfo?: () => {}, // 设置当前采集数据源信息
    setCurrentLayer?: () => {}, // 设置当前图层
    importTemplate?: () => {}, // 导入模板
    openTemplate?: () => {}, // 打开模板
    setAttributes?: () => {},
    getMaps?: () => {},
    exportWorkspace?: () => {},
    getSymbolTemplates?: () => {},
    openWorkspace?: () => {},
    closeWorkspace?: () => {},
    openMap?: () => {},
    closeMap?: () => {},
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
      bottom: new Animated.Value(-screen.deviceHeight),
      boxHeight: new Animated.Value(this.height),
      isSelectlist: false,
      listSelectable: false, // 列表是否可以选择（例如地图）
      isTouch: true,
      isTouchProgress: false,
      tableType: 'normal',
      themeUdbPath: '',
      themeDatasourceAlias: '',
      themeDatasetName: '',
      themeExpress: 'SMID',
      themeColor: 'TERRAIN',
      selectName: '',
    }
    this.isShow = false
    this.isBoxShow = true
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
      // 实时更新params
      ToolbarData.setParams({
        setToolbarVisible: this.setVisible,
        setLastState: this.setLastState,
        ...this.props,
      })
    }
  }

  componentDidMount() {
    Orientation.addOrientationListener(orientation => {
      if (orientation === this.state.orientation) return
      if (!this.isShow) return
      switch (this.state.type) {
        case ConstToolType.MAP3D_SYMBOL:
          if (orientation === 'PORTRAIT') {
            this.height = ConstToolType.HEIGHT[2]
            this.setState({ column: 4 })
            this.showToolbar()
          } else {
            this.height = ConstToolType.HEIGHT[0]
            this.setState({ column: 8 })
            this.showToolbar()
          }
          break
        case ConstToolType.MAP3D_TOOL:
          if (orientation === 'PORTRAIT') {
            this.height = ConstToolType.HEIGHT[1]
            this.setState({ column: 4 })
            this.showToolbar()
          } else {
            this.height = ConstToolType.HEIGHT[0]
            this.setState({ column: 8 })
            this.showToolbar()
          }
          break
        case ConstToolType.MAP_COLLECTION_START:
          if (orientation === 'PORTRAIT') {
            this.height = ConstToolType.HEIGHT[2]
            this.setState({ column: 4 })
            this.showToolbar()
          } else {
            this.height = ConstToolType.HEIGHT[0]
            this.setState({ column: 8 })
            this.showToolbar()
          }
          break
        case ConstToolType.MAP_3D_START:
          if (orientation === 'PORTRAIT') {
            this.height = ConstToolType.HEIGHT[1]
            this.setState({ column: 4 })
            this.showToolbar()
          } else {
            this.height = ConstToolType.HEIGHT[0]
            this.setState({ column: 8 })
            this.showToolbar()
          }
          break
        case ConstToolType.MAP_SYMBOL:
          if (orientation === 'PORTRAIT') {
            this.height = ConstToolType.HEIGHT[3]
            this.showToolbar()
          } else {
            this.height = ConstToolType.THEME_HEIGHT[4]
            this.showToolbar()
          }
          break
      }
    })
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
      setToolbarVisible: this.setVisible,
      setLastState: this.setLastState,
      ...this.props,
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
        // if (this.props.map.template && this.props.map.template.path) {
        //   buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX_FULL, ToolbarBtnType.COMMIT]
        // }
        // buttons = [ToolbarBtnType.CANCEL]
        break
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
          ToolbarBtnType.PLACEHOLDER,
        ]
        break
      case ConstToolType.LINECOLOR_SET:
        data = lineColorSet
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ]
        break
      case ConstToolType.POINTCOLOR_SET:
        data = pointColorSet
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ]
        break
      case ConstToolType.REGIONBEFORECOLOR_SET:
        data = regionBeforeColorSet
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ]
        break
      case ConstToolType.REGIONAFTERCOLOR_SET:
        data = regionAfterColorSet
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
          {
            key: 'closeAllLable',
            title: '清除标注',
            action: () => {
              try {
                SScene.closeAllLabel()
                // this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINTSURFACE)
              } catch (error) {
                Toast.show('清除失败')
              }
            },
            size: 'large',
            image: require('../../../../assets/mapEdit/icon_clear.png'),
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

  getThemeExpress = async type => {
    Animated.timing(this.state.boxHeight, {
      toValue: ConstToolType.THEME_HEIGHT[4],
      duration: 300,
    }).start()
    this.isBoxShow = true

    let list = await SThemeCartography.getThemeExpressByUdb(
      this.state.themeUdbPath,
      this.state.themeDatasetName,
    )
    let datalist = [
      {
        title: '数据集字段',
        data: list,
      },
    ]
    this.setState(
      {
        isFullScreen: false,
        isTouchProgress: false,
        isSelectlist: false,
        containerType: 'list',
        data: datalist,
        type: type,
        buttons: ThemeMenuData.getThemeFourMenu(),
      },
      () => {
        this.height = ConstToolType.THEME_HEIGHT[4]
      },
    )
  }

  getColorGradientType = async type => {
    Animated.timing(this.state.boxHeight, {
      toValue: ConstToolType.THEME_HEIGHT[4],
      duration: 300,
    }).start()
    this.isBoxShow = true

    let list = await ThemeMenuData.getColorGradientType()
    let datalist = [
      {
        title: '颜色方案',
        data: list,
      },
    ]
    this.setState(
      {
        isFullScreen: false,
        isTouchProgress: false,
        isSelectlist: false,
        containerType: 'list',
        data: datalist,
        type: type,
        buttons: ThemeMenuData.getThemeFourMenu(),
      },
      () => {
        this.height = ConstToolType.THEME_HEIGHT[4]
      },
    )
  }

  getRangeMode = async type => {
    Animated.timing(this.state.boxHeight, {
      toValue: ConstToolType.THEME_HEIGHT[2],
      duration: 300,
    }).start()
    this.isBoxShow = true

    let date = await ThemeMenuData.getRangeMode()
    this.setState(
      {
        isFullScreen: false,
        isTouchProgress: false,
        isSelectlist: false,
        containerType: 'table',
        column: 4,
        tableType: 'normal',
        data: date,
        type: type,
        buttons: ThemeMenuData.getThemeFourMenu(),
      },
      () => {
        this.height = ConstToolType.THEME_HEIGHT[2]
      },
    )
  }

  getLabelBackShape = async type => {
    Animated.timing(this.state.boxHeight, {
      toValue: ConstToolType.THEME_HEIGHT[2],
      duration: 300,
    }).start()
    this.isBoxShow = true

    let date = await ThemeMenuData.getLabelBackShape()
    this.setState(
      {
        isFullScreen: false,
        isTouchProgress: false,
        isSelectlist: false,
        containerType: 'table',
        column: 4,
        tableType: 'normal',
        data: date,
        type: type,
        buttons: ThemeMenuData.getThemeFourMenu(),
      },
      () => {
        this.height = ConstToolType.THEME_HEIGHT[2]
      },
    )
  }

  getLabelFontName = async type => {
    Animated.timing(this.state.boxHeight, {
      toValue: ConstToolType.THEME_HEIGHT[3],
      duration: 300,
    }).start()
    this.isBoxShow = true

    let date = await ThemeMenuData.getLabelFontName()
    this.setState(
      {
        isFullScreen: false,
        isTouchProgress: false,
        isSelectlist: false,
        containerType: 'table',
        column: 4,
        tableType: 'normal',
        data: date,
        type: type,
        buttons: ThemeMenuData.getThemeFourMenu(),
      },
      () => {
        this.height = ConstToolType.THEME_HEIGHT[3]
      },
    )
  }

  getLabelFontRotation = async type => {
    Animated.timing(this.state.boxHeight, {
      toValue: ConstToolType.THEME_HEIGHT[0],
      duration: 300,
    }).start()
    this.isBoxShow = true

    let date = await ThemeMenuData.getLabelFontRotation()
    this.setState(
      {
        isFullScreen: false,
        isTouchProgress: false,
        isSelectlist: false,
        containerType: 'table',
        column: 4,
        tableType: 'normal',
        data: date,
        type: type,
        buttons: ThemeMenuData.getThemeFourMenu(),
      },
      () => {
        this.height = ConstToolType.THEME_HEIGHT[0]
      },
    )
  }

  getLabelFontSize = async type => {
    Animated.timing(this.state.boxHeight, {
      toValue: 0,
      duration: 300,
    }).start()
    this.isBoxShow = false

    this.setState(
      {
        isFullScreen: true,
        selectName: 'fontsize',
        isTouchProgress: true,
        isSelectlist: false,
        type: type,
        buttons: ThemeMenuData.getThemeThreeMenu(),
      },
      () => {
        this.height = 0
      },
    )
  }

  getLabelFontColor = async type => {
    Animated.timing(this.state.boxHeight, {
      toValue: ConstToolType.THEME_HEIGHT[3],
      duration: 300,
    }).start()
    this.isBoxShow = true

    let date = await ThemeMenuData.getLabelFontColor()
    this.setState(
      {
        isFullScreen: false,
        isTouchProgress: false,
        isSelectlist: false,
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        data: date,
        type: type,
        buttons: ThemeMenuData.getThemeFourMenu(),
      },
      () => {
        this.height = ConstToolType.THEME_HEIGHT[3]
      },
    )
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
    if (this.isShow === isShow && type === this.state.type) return
    if (
      this.state.type !== type ||
      params.isFullScreen !== this.state.isFullScreen ||
      params.height !== this.height ||
      params.column !== this.state.column
    ) {
      let { data, buttons } = this.getData(type)
      this.originType = type
      this.height =
        params && typeof params.height === 'number'
          ? params.height
          : ConstToolType.HEIGHT[1]
      this.shareTo = params.shareTo || ''
      this.setState(
        {
          isSelectlist: false,
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
        },
        () => {
          this.showToolbarAndBox(isShow)
          params.cb && params.cb()
          !isShow && this.props.existFullMap && this.props.existFullMap()
        },
      )
    } else {
      this.showToolbarAndBox(isShow)
      params.cb && params.cb()
      !isShow && this.props.existFullMap && this.props.existFullMap()
    }
  }

  showToolbarAndBox = isShow => {
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
    if (this.state.type === ConstToolType.MAP_THEME_PARAM) {
      Animated.timing(this.state.boxHeight, {
        toValue: 0,
        duration: 300,
      }).start()
      this.isBoxShow = false
    } else {
      if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
        Animated.timing(this.state.boxHeight, {
          toValue: this.height,
          duration: 300,
        }).start()
      }
      this.isBoxShow = true
    }
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

  showAlertDialog = () => {
    Animated.timing(this.state.boxHeight, {
      toValue: 0,
      duration: 200,
    }).start()
    this.isBoxShow = false

    const menutoolRef = this.props.getMenuAlertDialogRef()
    if (menutoolRef) {
      menutoolRef.setDialogVisible(true)
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
    if (type === ConstToolType.MAP_EDIT_TAGGING) {
      SMap.setAction(Action.PAN)
    } else if (
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
    if (
      this.state.isTouchProgress === true ||
      this.state.isSelectlist === true
    ) {
      this.setState({ isTouchProgress: false, isSelectlist: false })
    }
    this.props.existFullMap && this.props.existFullMap()
  }

  clearCurrentLabel = () => {
    SScene.clearcurrentLabel()
  }

  closeSymbol = () => {
    SScene.clearAllLabel()
    SScene.checkoutListener('startTouchAttribute')
    GLOBAL.Map3DSymbol = false
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  closeTool = () => {
    SScene.checkoutListener('startTouchAttribute')
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
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
    this.props.setAttributes && this.props.setAttributes(list)
  }

  symbolSave = () => {
    try {
      SScene.save()
      this.getMap3DAttribute()
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
    this.setState({ isTouchProgress: false })
  }

  commit = (type = this.originType) => {
    this.showToolbar(false)
    if (typeof type === 'string' && type.indexOf('MAP_EDIT_') >= 0) {
      SMap.submit()
      SMap.setAction(Action.PAN)
    }
    this.props.existFullMap && this.props.existFullMap()
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
            duration: 300,
          }).start()
          this.isBoxShow = !this.isBoxShow
        },
      )
    } else {
      Animated.timing(this.state.boxHeight, {
        toValue: this.isBoxShow ? 0 : this.height,
        duration: 300,
      }).start()
      this.isBoxShow = !this.isBoxShow
    }
  }

  showSymbol = () => {
    SCollector.stopCollect()
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
    SScene.flyStop()
    this.showToolbar(!this.isShow)
    this.props.existFullMap && this.props.existFullMap()
  }

  setfly = index => {
    SScene.setPosition(index)
    this.showMap3DTool(ConstToolType.MAP3D_TOOL_FLY)
  }

  listThemeAction = ({ item }) => {
    if (this.state.type === ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION) {
      //单值专题图表达式
      this.setState({
        themeExpress: item.title,
      })
      ;(async function() {
        let Params = {
          DatasourceAlias: this.state.themeDatasourceAlias,
          DatasetName: this.state.themeDatasetName,
          UniqueExpression: item.title,
          ColorGradientType: this.state.themeColor,
          // LayerName: 'Countries@Countries#1',
          LayerIndex: '0',
        }
        // await SThemeCartography.setUniqueExpression(Params)
        await SThemeCartography.createAndRemoveThemeUniqueMap(Params)
      }.bind(this)())
    } else if (this.state.type === ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR) {
      //单值专题图颜色表
      this.setState({
        themeColor: item.key,
      })
      ;(async function() {
        let Params = {
          DatasourceAlias: this.state.themeDatasourceAlias,
          DatasetName: this.state.themeDatasetName,
          UniqueExpression: this.state.themeExpress,
          ColorGradientType: item.key,
          // LayerName: 'Countries@Countries#1',
          LayerIndex: '0',
        }
        await SThemeCartography.createAndRemoveThemeUniqueMap(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION
    ) {
      //分段专题图表达式
      this.setState({
        themeExpress: item.title,
      })
      ;(async function() {
        let Params = {
          // DatasourceAlias: this.state.themeDatasourceAlias,
          // DatasetName: this.state.themeDatasetName,
          RangeExpression: item.title,
          // ColorGradientType: this.state.themeColor,
          // LayerName: 'Countries@Countries#1',
          LayerIndex: '0',
        }
        await SThemeCartography.setRangeExpression(Params)
      }.bind(this)())
    } else if (this.state.type === ConstToolType.MAP_THEME_PARAM_RANGE_COLOR) {
      //分段专题图颜色表
      this.setState({
        themeColor: item.key,
      })
      ;(async function() {
        let Params = {
          DatasourceAlias: this.state.themeDatasourceAlias,
          DatasetName: this.state.themeDatasetName,
          RangeExpression: this.state.themeExpress,
          ColorGradientType: item.key,
          // LayerName: 'Countries@Countries#1',
          LayerIndex: '0',
          RangeMode: 'EQUALINTERVAL',
          RangeParameter: '32.0',
        }
        await SThemeCartography.createAndRemoveThemeRangeMap(Params)
      }.bind(this)())
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION
    ) {
      //统一标签表达式
      this.setState({
        themeExpress: item.title,
      })
      ;(async function() {
        let Params = {
          LabelExpression: item.title,
          // LayerName: 'Countries@Countries#1',
          LayerIndex: '0',
        }
        await SThemeCartography.setUniformLabelExpression(Params)
      }.bind(this)())
    }
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
          this.setState({
            data: datalist,
            type: ConstToolType.MAP_ADD_DATASET,
            themeUdbPath: path,
          })
        },
      })
    } else if (this.state.type === ConstToolType.MAP_ADD_DATASET) {
      (async function() {
        this.setState({
          themeDatasourceAlias: item.title,
          themeDatasetName: item.title,
        })
        ToolbarData.setUniqueThemeParams({
          DatasourceAlias: item.title,
          DatasetName: item.title,
          UniqueExpression: this.state.themeExpress,
          ColorGradientType: 'TERRAIN',
        })
        ToolbarData.setRangeThemeParams({
          DatasourceAlias: item.title,
          DatasetName: item.title,
          RangeExpression: this.state.themeExpress,
          RangeMode: 'EQUALINTERVAL',
          RangeParameter: '32.0',
          ColorGradientType: 'TERRAIN',
        })
        ToolbarData.setUniformLabelParams({
          DatasourceAlias: item.title,
          DatasetName: item.title,
          LabelExpression: '国家',
          LabelBackShape: 'NONE',
          FontName: '宋体',
          // FontSize: '15.0',
          ForeColor: '#40E0D0',
        })
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
      if (item.path) {
        // 打开模板工作空间
        this.openTemplate(item)
      } else {
        // 切换地图
        this.changeMap(item)
      }
    }
  }

  /** 打开模板工作空间 **/
  openTemplate = async item => {
    try {
      this.props.setContainerLoading &&
        this.props.setContainerLoading(true, '正在打开模板')
      // 打开模板工作空间
      this.props.openTemplate(item, ({ copyResult, openResult, msg }) => {
        if (msg) {
          this.props.setContainerLoading &&
            this.props.setContainerLoading(false)
          Toast.show(msg)
        } else if (openResult) {
          // 重新加载图层
          this.props.getLayers({
            type: -1,
            isResetCurrentLayer: true,
          })
          this.props.setContainerLoading(true, '正在读取模板')
          this.props.getSymbolTemplates(null, () => {
            this.setVisible(false)
            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            Toast.show('已为您切换模板')
          })
        } else if (!copyResult) {
          this.props.setContainerLoading &&
            this.props.setContainerLoading(false)
          Toast.show('拷贝模板失败')
        } else {
          Toast.show('切换模板失败')
        }
      })
    } catch (error) {
      Toast.show('切换模板失败')
      this.props.setContainerLoading && this.props.setContainerLoading(false)
    }
  }

  /** 切换地图 **/
  changeMap = async item => {
    try {
      // 获取地图信息
      // let mapInfo = await SMap.getMapInfo()
      // 打开地图
      let datasourceName = item.title.substr(
        item.title.lastIndexOf('@') + 1,
        item.title.length - 1,
      )
      let server =
        this.props.collection.datasourceParentPath + datasourceName + '.udb'
      let DSParams = {
        server: server,
        engineType: EngineType.UDB,
        alias: datasourceName,
      }
      SMap.openDatasource(DSParams).then(result => {
        result &&
          SMap.openMap(item.title).then(isOpen => {
            if (isOpen) {
              Toast.show('已为您切换到' + item.title)
              this.props.setCurrentMap(item)
              this.props.getLayers(-1, layers => {
                this.props.setCurrentLayer(layers.length > 0 && layers[0])
              })
              this.props.setCollectionInfo({
                datasourceName: datasourceName,
                datasourceParentPath: this.props.collection
                  .datasourceParentPath,
                datasourceServer: server,
                datasourceType: EngineType.UDB,
              })
              this.setVisible(false)
            } else {
              Toast.show('该地图为当前地图')
            }
          })
      })
    } catch (e) {
      Toast.show('切换地图失败')
    }
  }

  renderList = () => {
    if (this.state.data.length === 0) return
    return (
      <ToolBarSectionList
        ref={ref => (this.toolBarSectionList = ref)}
        listSelectable={this.state.listSelectable}
        sections={this.state.data}
        itemAction={({ item, index }) => {
          if (this.state.type.indexOf('MAP_THEME_PARAM_') >= 0) {
            this.listThemeAction({ item, index })
          } else {
            this.listAction({ item, index })
          }
        }}
        headerAction={({ section }) => {
          (async function() {
            if (section.title === '打开默认工作空间') {
              let defaultWorkspacePath = await Utility.appendingHomeDirectory(
                (this.props.user.userName
                  ? ConstPath.UserPath + this.props.user.userName
                  : ConstPath.CustomerPath) +
                  ConstPath.RelativeFilePath.Workspace,
              )

              if (this.props.map.workspace.server === defaultWorkspacePath) {
                Toast.show(ConstInfo.WORKSPACE_ALREADY_OPENED)
                return
              }
              this.props.closeWorkspace().then(async () => {
                try {
                  this.props.setContainerLoading &&
                    this.props.setContainerLoading(
                      true,
                      ConstInfo.WORKSPACE_OPENING,
                    )

                  let data = { server: defaultWorkspacePath }
                  let result = await this.props.openWorkspace(data)

                  await SMap.openDatasource(
                    ConstOnline['Google'].DSParams,
                    ConstOnline['Google'].layerIndex,
                  )
                  await this.props.getLayers()

                  Toast.show(
                    result
                      ? ConstInfo.WORKSPACE_DEFAULT_OPEN_SUCCESS
                      : ConstInfo.WORKSPACE_DEFAULT_OPEN_FAILED,
                  )
                  this.setVisible(false)
                  this.props.setContainerLoading &&
                    this.props.setContainerLoading(false)
                } catch (error) {
                  Toast.show(ConstInfo.WORKSPACE_DEFAULT_OPEN_FAILED)
                  this.props.setContainerLoading &&
                    this.props.setContainerLoading(false)
                }
              })
            }
          }.bind(this)())
        }}
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

  renderColorTable = () => {
    return (
      <ColorTableList
        data={this.state.data}
        type={this.state.tableType}
        numColumns={this.state.column}
        renderCell={this._renderColorItem}
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
          }
          let menutoolRef =
            this.props.getMenuAlertDialogRef &&
            this.props.getMenuAlertDialogRef()
          if (menutoolRef && type !== '') {
            menutoolRef.setMenuType(type)
          }

          if (this.state.type === ConstToolType.MAP_THEME_PARAM_RANGE_MODE) {
            let Params = {
              DatasourceAlias: this.state.themeDatasourceAlias,
              DatasetName: this.state.themeDatasetName,
              RangeExpression: this.state.themeExpress,
              ColorGradientType: this.state.themeColor,
              // LayerName: 'Countries@Countries#1',
              LayerIndex: '0',
              RangeMode: item.key,
              RangeParameter: '32.0',
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE
          ) {
            let Params = {
              LayerIndex: '0',
              LabelBackShape: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME
          ) {
            let Params = {
              LayerIndex: '0',
              FontName: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_ROTATION
          ) {
            let Params = {
              LayerIndex: '0',
              Rotaion: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR
          ) {
            let Params = {
              LayerIndex: '0',
              Color: item.key,
            }
            ThemeMenuData.setThemeParams(Params)
          }
        }
        item.action()
        break
    }
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
    return <SymbolList layerData={this.props.layerData} />
  }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    let width
    if (screen.deviceWidth < screen.deviceHeight) {
      width = screen.deviceWidth
    } else {
      width = screen.deviceHeight
    }
    return (
      <MTBtn
        style={[styles.cell, { width: width / this.state.column }]}
        key={rowIndex + '-' + cellIndex}
        title={item.title}
        textColor={'white'}
        size={MTBtn.Size.NORMAL}
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
    switch (this.props.layerData.type) {
      case 1:
        list = point
        break
      case 3:
        list = line
        break
      case 5:
        list = region
        break
      case 83:
        list = grid
        break
    }
    return (
      <FlatList
        data={list}
        renderItem={({ item }) => (
          <TouchableHighlight
            activeOpacity={0.9}
            underlayColor="#4680DF"
            style={styles.btn}
            onPress={() => item.action(item)}
          >
            <Text style={styles.text}>{item.key}</Text>
          </TouchableHighlight>
        )}
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
          case ConstToolType.MAP3D_TOOL_SUERFACEMEASURE:
          case ConstToolType.MAP3D_TOOL_DISTANCEMEASURE:
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
      case 'colortable':
        box = this.renderColorTable()
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
          image = require('../../../../assets/mapEdit/icon_function_theme_param_close.png')
          action = this.close
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
            this.setVisible(true, this.lastState.type, {
              isFullScreen: this.lastState.isFullScreen,
              height: this.lastState.height,
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
        case ToolbarBtnType.SHARE:
          image = require('../../../../assets/mapEdit/icon-rename-white.png')
          action = () => {
            if (!this.props.user.currentUser.userName) {
              Toast.show('请登陆后再分享')
              return
            }
            if (isSharing) {
              Toast.show('分享中，请稍后')
              return
            }
            if (this.shareTo === constants.SUPERMAP_ONLINE) {
              let list =
                (this.toolBarSectionList &&
                  this.toolBarSectionList.getSelectList()) ||
                []
              this.props.exportWorkspace(
                {
                  maps: list,
                },
                (result, path) => {
                  Toast.show(
                    result
                      ? ConstInfo.EXPORT_WORKSPACE_SUCCESS
                      : ConstInfo.EXPORT_WORKSPACE_FAILED,
                  )
                  // 分享
                  let fileName = path.substr(path.lastIndexOf('/') + 1)
                  let dataName = fileName.substr(0, fileName.lastIndexOf('.'))

                  SOnlineService.deleteData(dataName).then(async () => {
                    await SOnlineService.uploadFile(path, dataName, {
                      // onProgress: progress => {
                      //   console.warn(progress)
                      // },
                      onResult: async () => {
                        let result = await SOnlineService.publishService(
                          dataName,
                        )
                        Toast.show(
                          result
                            ? ConstInfo.SHARE_SUCCESS
                            : ConstInfo.SHARE_FAILED,
                        )
                        FileTools.deleteFile(path)
                        isSharing = false
                      },
                    })
                  })
                },
              )
            }
            // this.close()
          }
          break
        case ToolbarBtnType.CLOSE_CIRCLE:
          image = require('../../../../assets/mapEdit/cancel.png')
          action = this.closeCircle
          break
        case ToolbarBtnType.THEME_CANCEL:
          //专题图-取消
          image = require('../../../../assets/mapEdit/icon_function_theme_param_close.png')
          action = this.close
          break
        case ToolbarBtnType.THEME_MENU:
          //专题图-菜单
          image = require('../../../../assets/mapEdit/icon_function_theme_param_menu.png')
          action = this.showAlertDialog
          break
        case ToolbarBtnType.THEME_FLEX:
          //专题图-显示与隐藏
          image = require('../../../../assets/mapEdit/icon_function_theme_param_style.png')
          action = this.showBox
          break
        case ToolbarBtnType.THEME_COMMIT:
          //专题图-提交
          image = require('../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = this.close
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
        {this.state.isFullScreen && !this.state.isTouchProgress && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => this.setVisible(false)}
            style={styles.overlay}
          />
        )}
        {this.state.isTouchProgress && this.state.isFullScreen && (
          <TouchProgress selectName={this.state.selectName} />
        )}
        {this.state.isSelectlist && (
          <View style={styles.list}>{this.renderSelectList()}</View>
        )}
        <View style={styles.containers}>
          {this.renderView()}
          {this.renderBottomBtns()}
        </View>
      </Animated.View>
    )
  }
}
