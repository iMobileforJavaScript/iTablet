import React from 'react'
import { Toast, scaleSize, jsonUtil } from '../../../../utils'
import {
  MTBtn,
  TableList,
  ColorTableList,
  ColorBtn,
} from '../../../../components'
import {
  ConstToolType,
  ConstPath,
  ConstOnline,
  BotMap,
  line,
  point,
  region,
  grid,
  openData,
  lineColorSet,
  pointColorSet,
  regionBeforeColorSet,
  regionAfterColorSet,
  Map3DBaseMapList,
  ConstInfo,
  Const,
  uniqueMenuInfo,
  rangeMenuInfo,
  labelMenuInfo,
} from '../../../../constants'
import TouchProgress from '../TouchProgress'
import Map3DToolBar from '../Map3DToolBar'
import NavigationService from '../../../../containers/NavigationService'
import ToolbarData from './ToolbarData'
import ToolbarHeight from './ToolBarHeight'
import EditControlBar from './EditControlBar'
import { FileTools } from '../../../../native'
import { View, TouchableOpacity, Image, Animated } from 'react-native'
import {
  SMap,
  SScene,
  Action,
  SCollector,
  SThemeCartography,
  SOnlineService,
  SMCollectorType,
} from 'imobile_for_reactnative'
import SymbolTabs from '../SymbolTabs'
import SymbolList from '../SymbolList/SymbolList'
import ToolbarBtnType from './ToolbarBtnType'
import ThemeMenuData from './ThemeMenuData'
import ToolBarSectionList from './ToolBarSectionList'
import constants from '../../constants'
import ShareData from './ShareData'
import MenuDialog from './MenuDialog'
import styles from './styles'
import { color } from '../../../../styles'

/** 工具栏类型 **/
const list = 'list'
const table = 'table'
const tabs = 'tabs'
const symbol = 'symbol'
// 工具表格默认高度
const DEFAULT_COLUMN = 4
// 是否全屏显示，是否有Overlay
const DEFAULT_FULL_SCREEN = true

export const BUTTON_HEIGHT = scaleSize(95)
let isSharing = false

export default class ToolBar extends React.PureComponent {
  props: {
    children: any,
    type: string,
    containerProps?: Object,
    data: Array,
    existFullMap: () => {},
    symbol: Object,
    user: Object,
    map: Object,
    layers: Object,
    collection: Object,
    template: Object,
    currentLayer: Object,
    selection: Object,
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
    openWorkspace: () => {},
    closeWorkspace: () => {},
    openMap: () => {},
    closeMap: () => {},
    setCurrentTemplateInfo: () => {},
    setTemplate: () => {},
    setInputDialogVisible: () => {},
    exportmap3DWorkspace: () => {},
    importSceneWorkspace: () => {},
    getMapSetting: () => {},
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
        scrollListToLocation: this.scrollListToLocation,
        ...this.props,
      })
    }
    if (this.props.device.orientation !== prevProps.device.orientation) {
      if (!this.isShow) return
      this.state.type &&
        this.changeHeight(this.props.device.orientation, this.state.type)
    }
  }

  changeHeight = async (orientation, type) => {
    let data = ToolbarHeight.getToorbarHeight(orientation, type)
    this.height = data.height
    this.setState({
      column: data.column,
    })
    this.showToolbar()
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
      case ConstToolType.MAP_BASE:
        data = BotMap
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
        // data = layerAdd
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
        data = openData
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
        ]
        break
      case ConstToolType.GRID_STYLE:
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
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
        ]
        break
      case ConstToolType.POINTCOLOR_SET:
        data = pointColorSet
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
        ]
        break
      case ConstToolType.REGIONBEFORECOLOR_SET:
        data = regionBeforeColorSet
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
        ]
        break
      case ConstToolType.REGIONAFTERCOLOR_SET:
        data = regionAfterColorSet
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          // ToolbarBtnType.FLEX,
          ToolbarBtnType.MENU_FLEX,
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
        ]
        buttons = [ToolbarBtnType.CLOSE_TOOL, ToolbarBtnType.FLEX]
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

  /**刷新字段表达式列表 */
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
        data: allExpressions,
      },
    ]
    this.setState({
      data: datalist,
    })
  }

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
      this.expressionData = await SThemeCartography.getThemeExpressionByLayerName(
        GLOBAL.currentLayer.name,
      )
      let selectedExpression
      let param = {
        LayerName: GLOBAL.currentLayer.name,
      }
      if (type === ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION) {
        selectedExpression = await SThemeCartography.getUniqueExpression(param)
      } else if (type === ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION) {
        selectedExpression = await SThemeCartography.getRangeExpression(param)
      } else if (
        type === ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION
      ) {
        selectedExpression = await SThemeCartography.getUniformLabelExpression(
          param,
        )
      }
      let dataset = this.expressionData.dataset
      let allExpressions = this.expressionData.list
      if (selectedExpression) {
        for (let i = 0; i < allExpressions.length; i++) {
          if (allExpressions[i].expression === selectedExpression) {
            allExpressions[i].isSelected = true
          } else {
            allExpressions[i].isSelected = false
          }
        }
      }
      allExpressions.forEach(item => {
        item.info = {
          infoType: 'fieldType',
          fieldType: item.fieldType,
        }
      })
      let datalist = [
        {
          title: dataset.datasetName,
          datasetType: dataset.datasetType,
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
      let list = await ThemeMenuData.getUniqueColorScheme()
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
      let list = await ThemeMenuData.getRangeColorScheme()
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
          buttons: ThemeMenuData.getThemeThreeMenu(),
          selectKey: key,
          data: [],
        },
        () => {
          this.height = 0
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

  getLabelBackColor = async (type, key = '', name = '') => {
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
      let date = await ThemeMenuData.getLabelColor()
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
          buttons: ThemeMenuData.getThemeThreeMenu(),
          selectName: name || 'fontsize',
          selectKey: key,
          data: [],
        },
        () => {
          this.height = 0
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

  getLabelFontColor = async (type, key = '', name = '') => {
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
      let date = await ThemeMenuData.getLabelColor()
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
      let data = [{ title: '飞行轨迹列表', data: flydata }]
      let buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      return { data, buttons }
    } catch (error) {
      let buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      let data = []
      Toast.show('当前场景无飞行轨迹')
      return { data, buttons }
    }
  }

  getWorkspaceList = async () => {
    try {
      let buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      let data = []
      let userName = this.props.user.currentUser.userName || 'Customer'
      let path = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath + userName + '/' + ConstPath.RelativeFilePath.Scene,
      )
      let result = await FileTools.fileIsExist(path)
      if (result) {
        let fileList = await FileTools.getPathListByFilter(path, {
          extension: 'pxp',
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
        isFullScreen: false,
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
          isFullScreen: false,
        },
        () => {
          this.height = ConstToolType.HEIGHT[2]
          this.showToolbar()
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
          isFullScreen: false,
        },
        () => {
          this.height =
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.HEIGHT[2]
              : ConstToolType.HEIGHT[3]
          this.showToolbar()
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
    if (type === ConstToolType.MAP3D_WORKSPACE_LIST) {
      this.showMap3DTool(type)
      return
    }
    if (type === ConstToolType.MAP3D_IMPORTWORKSPACE) {
      this.showMap3DTool(type)
      return
    }
    if (this.isShow === isShow && type === this.state.type) return
    if (
      this.state.type !== type ||
      params.isFullScreen !== this.state.isFullScreen ||
      params.height !== this.height ||
      params.column !== this.state.column
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
        },
      )
    } else {
      this.showToolbarAndBox(isShow)
      if (params.cb) {
        setTimeout(() => params.cb(), Const.ANIMATED_DURATION_2)
      }
      !isShow && this.props.existFullMap && this.props.existFullMap()
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
    if (type === ConstToolType.MAP_THEME_PARAM) {
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
    this.setState({
      isFullScreen: false,
    })

    const menutoolRef = this.props.getMenuAlertDialogRef()
    if (menutoolRef) {
      menutoolRef.setDialogVisible(true)
    }
  }

  close = (type = this.state.type) => {
    (async function() {
      if (GLOBAL.Type === constants.MAP_EDIT) {
        GLOBAL.showMenu = true
        GLOBAL.showFlex = true
        this.setState({ selectKey: '' })
      }
      GLOBAL.currentToolbarType = ''
      let actionType = Action.PAN
      if (type === ConstToolType.MAP_ADD_DATASET) {
        this.props.getLayers(-1, layers => {
          this.props.setCurrentLayer(layers.length > 0 && layers[0])
        })
      }
      // if (type === ConstToolType.MAP_EDIT_TAGGING) {
      //   SMap.setAction(Action.PAN)
      // } else if (
      //   typeof type === 'number' ||
      //   (typeof type === 'string' && type.indexOf('MAP_') >= -1)
      // ) {
      //   // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
      //   SMap.setAction(Action.PAN)
      // }
      if (
        typeof type === 'string' &&
        type.indexOf('MAP_EDIT_') >= 0 &&
        type !== ConstToolType.MAP_EDIT_DEFAULT &&
        type !== ConstToolType.MAP_EDIT_TAGGING
      ) {
        actionType = Action.SELECT
        GLOBAL.currentToolbarType = ConstToolType.MAP_EDIT_DEFAULT
        // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
        this.setVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
          isFullScreen: false,
          height: 0,
        })
      } else {
        this.showToolbar(false)
        if (
          this.state.isTouchProgress === true ||
          this.state.showMenuDialog === true
        ) {
          this.setState({ isTouchProgress: false, showMenuDialog: false })
        }
        this.props.existFullMap && this.props.existFullMap()
        // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
        this.setState({
          data: [],
          // buttons: [],
        })
        this.height = 0
      }
      setTimeout(() => {
        // 关闭采集, type 为number时为采集类型，若有冲突再更改
        if (
          typeof type === 'number' ||
          (typeof type === 'string' && type.indexOf('MAP_COLLECTION_') >= 0)
        ) {
          SCollector.stopCollect()
        } else {
          SMap.setAction(actionType)
        }
      }, Const.ANIMATED_DURATION_2)
    }.bind(this)())
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

  changeCollection = () => {
    SCollector.stopCollect()
    let toolbarType
    switch (this.lastState.type) {
      case SMCollectorType.REGION_HAND_POINT:
        toolbarType = ConstToolType.MAP_COLLECTION_REGION
        break
      case SMCollectorType.LINE_HAND_POINT:
        toolbarType = ConstToolType.MAP_COLLECTION_LINE
        break
      case SMCollectorType.POINT_HAND:
        toolbarType = ConstToolType.MAP_COLLECTION_POINT
        break
      case SMCollectorType.REGION_HAND_PATH:
        toolbarType = ConstToolType.MAP_COLLECTION_REGION
        break
      case SMCollectorType.LINE_HAND_PATH:
        toolbarType = ConstToolType.MAP_COLLECTION_LINE
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

  menu = () => {
    let showBox = function() {
      if (
        this.state.type.indexOf('MAP_THEME_PARAM') < 0 ||
        (this.state.type.indexOf('MAP_THEME_PARAM') >= 0 && this.isBoxShow)
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
        this.state.type.indexOf('MAP_THEME_PARAM') >= 0
      ) {
        if (GLOBAL.showFlex) {
          GLOBAL.showFlex = false
          this.setState({
            isFullScreen: !this.state.showMenuDialog,
            showMenuDialog: !this.state.showMenuDialog,
            isTouchProgress: false,
            buttons: [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.MENU,
              // this.state.type.indexOf('MAP_THEME_PARAM') >= 0 ? ToolbarBtnType.MENU_FLEX : ToolbarBtnType.FLEX,
              ToolbarBtnType.MENU_FLEX,
              ToolbarBtnType.MENU_COMMIT,
            ],
          })
        } else {
          GLOBAL.showFlex = true
          this.setState({
            isFullScreen: !this.state.showMenuDialog,
            showMenuDialog: !this.state.showMenuDialog,
            isTouchProgress: false,
            buttons: [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.MENU,
              // this.state.type.indexOf('MAP_THEME_PARAM') >= 0 ? ToolbarBtnType.MENU_FLEX : ToolbarBtnType.FLEX,
              ToolbarBtnType.MENU_FLEX,
              ToolbarBtnType.MENU_COMMIT,
            ],
          })
        }
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

  menus = () => {
    if (this.state.showMenuDialog === false) {
      this.setState({ showMenuDialog: true })
    } else {
      this.setState({ showMenuDialog: false })
    }
    this.setState({ isTouchProgress: false })
  }

  menuCommit = () => {
    this.menuDialog && this.menuDialog.callCurrentAction()
  }

  commit = (type = this.originType) => {
    // this.showToolbar(false)
    if (typeof type === 'string' && type.indexOf('MAP_EDIT_') >= 0) {
      if (
        type !== ConstToolType.MAP_EDIT_DEFAULT &&
        type !== ConstToolType.MAP_EDIT_TAGGING
      ) {
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
      } else {
        SMap.setAction(Action.PAN)
      }
    }
    // this.props.existFullMap && this.props.existFullMap()
  }

  showMenuBox = (autoFullScreen = false) => {
    if (autoFullScreen) {
      this.setState(
        {
          showMenuDialog: false,
          isFullScreen: !this.isBoxShow,
        },
        () => {
          Animated.timing(this.state.boxHeight, {
            toValue: this.isBoxShow ? 0 : this.height,
            duration: Const.ANIMATED_DURATION,
          }).start()
          this.isBoxShow = !this.isBoxShow
        },
      )
    } else {
      if (this.isBoxShow) {
        Animated.timing(this.state.boxHeight, {
          toValue: 0,
          duration: Const.ANIMATED_DURATION,
        }).start()
        this.setState({
          showMenuDialog: false,
          isFullScreen: false,
        })
      } else if (this.state.data && this.state.data.length > 0) {
        Animated.timing(this.state.boxHeight, {
          toValue: this.height,
          duration: Const.ANIMATED_DURATION,
        }).start()
        this.setState({
          showMenuDialog: false,
          isFullScreen: false,
        })
      }
      this.isBoxShow = !this.isBoxShow
    }
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
      height: ConstToolType.HEIGHT[3],
      cb: () => SCollector.stopCollect(),
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
      this.state.type === ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS
    ) {
      //跳转到专题图字段选择列表
      (async function() {
        let data = await SThemeCartography.getThemeExpressionByDatasetName(
          item.datasourceName,
          item.datasetName,
        )
        let dataset = data.dataset
        data.list.forEach(item => {
          item.info = {
            infoType: 'fieldType',
            fieldType: item.fieldType,
          }
        })
        let datalist = [
          {
            title: dataset.datasetName,
            datasetType: dataset.datasetType,
            data: data.list,
          },
        ]
        this.setState(
          {
            themeDatasourceAlias: item.datasourceName,
            themeDatasetName: item.datasetName,
            isFullScreen: true,
            isTouchProgress: false,
            showMenuDialog: false,
            containerType: 'list',
            data: datalist,
            buttons: [ToolbarBtnType.THEME_CANCEL],
            type: ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION,
          },
          () => {
            this.height =
              this.props.device.orientation === 'LANDSCAPE'
                ? ConstToolType.THEME_HEIGHT[3]
                : ConstToolType.THEME_HEIGHT[5]
          },
        )
      }.bind(this)())
      this.scrollListToLocation()
    } else if (
      this.state.type === ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION
    ) {
      //点击字段名创建专题图
      (async function() {
        let params = {}
        let isSuccess = false
        switch (this.state.themeCreateType) {
          case constants.THEME_UNIQUE_STYLE:
            //单值风格
            params = {
              DatasourceAlias: this.state.themeDatasourceAlias,
              DatasetName: this.state.themeDatasetName,
              UniqueExpression: item.title,
              // ColorGradientType: 'CYANWHITE',
              ColorScheme: 'BB_Green', //有ColorScheme，则ColorGradientType无效（ColorGradientType的颜色方案会被覆盖）
            }
            isSuccess = await SThemeCartography.createThemeUniqueMap(params)
            break
          case constants.THEME_RANGE_STYLE:
            //分段风格
            params = {
              DatasourceAlias: this.state.themeDatasourceAlias,
              DatasetName: this.state.themeDatasetName,
              RangeExpression: item.title,
              RangeMode: 'EQUALINTERVAL',
              RangeParameter: '6.0',
              // ColorGradientType: 'CYANWHITE',
              ColorScheme: 'CD_Cyans',
            }
            isSuccess = await SThemeCartography.createThemeRangeMap(params)
            break
          case constants.THEME_UNIFY_LABEL:
            //统一标签
            params = {
              DatasourceAlias: this.state.themeDatasourceAlias,
              DatasetName: this.state.themeDatasetName,
              LabelExpression: item.title,
              LabelBackShape: 'NONE',
              FontName: '宋体',
              // FontSize: '15.0',
              ForeColor: '#000000',
            }
            isSuccess = await SThemeCartography.createUniformThemeLabelMap(
              params,
            )
            break
        }
        if (isSuccess) {
          Toast.show('创建专题图成功')
          //设置当前图层
          this.props.getLayers(-1, layers => {
            this.props.setCurrentLayer(layers.length > 0 && layers[0])
          })
        } else {
          Toast.show('创建专题图失败')
        }
        this.setVisible(false)
      }.bind(this)())
    } else if (
      this.state.type ===
      ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME
    ) {
      //点击字段名创建专题图
      (async function() {
        let params = {}
        let isSuccess = false
        switch (this.state.themeCreateType) {
          case constants.THEME_UNIQUE_STYLE:
            //单值风格
            params = {
              DatasourceAlias: item.datasourceName,
              DatasetName: item.datasetName,
              UniqueExpression: item.expression,
              // ColorGradientType: 'CYANWHITE',
              ColorScheme: 'BB_Green', //有ColorScheme，则ColorGradientType无效（ColorGradientType的颜色方案会被覆盖）
            }
            isSuccess = await SThemeCartography.createThemeUniqueMap(params)
            break
          case constants.THEME_RANGE_STYLE:
            //分段风格
            params = {
              DatasourceAlias: item.datasourceName,
              DatasetName: item.datasetName,
              RangeExpression: item.expression,
              RangeMode: 'EQUALINTERVAL',
              RangeParameter: '6.0',
              // ColorGradientType: 'CYANWHITE',
              ColorScheme: 'CD_Cyans',
            }
            isSuccess = await SThemeCartography.createThemeRangeMap(params)
            break
          case constants.THEME_UNIFY_LABEL:
            //统一标签
            params = {
              DatasourceAlias: item.datasourceName,
              DatasetName: item.datasetName,
              LabelExpression: item.expression,
              LabelBackShape: 'NONE',
              FontName: '宋体',
              // FontSize: '15.0',
              ForeColor: '#000000',
            }
            isSuccess = await SThemeCartography.createUniformThemeLabelMap(
              params,
            )
            break
        }
        if (isSuccess) {
          Toast.show('创建专题图成功')
          //设置当前图层
          this.props.getLayers(-1, layers => {
            this.props.setCurrentLayer(layers.length > 0 && layers[0])
          })
        } else {
          Toast.show('创建专题图失败')
        }
        this.setVisible(false)
      }.bind(this)())
    }
  }

  listAction = ({ item, index }) => {
    if (this.state.type === 'MAP3D_BASE') return
    if (item.action) {
      item.action && item.action()
    } else if (this.state.type === ConstToolType.MAP_ADD_LAYER) {
      (async function() {
        this.path = await FileTools.appendingHomeDirectory(item.path)
        SMap.getUDBName(this.path).then(list => {
          let dataList = [
            {
              title: '数据集',
              data: list,
            },
          ]
          this.setState({
            data: dataList,
            type: ConstToolType.MAP_ADD_DATASET,
          })
          // this.setLastState()
        })
        this.scrollListToLocation()
      }.bind(this)())
      // NavigationService.navigate('WorkspaceFlieList', {
      //   cb: async path => {
      //     this.path = path
      //     let list = await SMap.getUDBName(path)
      //     let datalist = [
      //       {
      //         title: '数据集',
      //         data: list,
      //       },
      //     ]
      //     this.setState({
      //       data: datalist,
      //       type: ConstToolType.MAP_ADD_DATASET,
      //     })
      //   },
      // })
    } else if (this.state.type === ConstToolType.MAP_THEME_ADD_DATASET) {
      (async function() {
        let path = await FileTools.appendingHomeDirectory(item.path)
        let udbName = this.basename(path)
        let udbpath = {
          server: path,
          alias: udbName,
          engineType: 219,
        }
        //只添加数据源
        await SMap.openDatasource(udbpath, '')
        let alldata = []
        let getdata = await SThemeCartography.getAllDatasetNames()
        getdata.reverse() //反序
        alldata[0] = {
          title: '选择数据源',
          data: [
            {
              title: '选择目录',
              theme_add_udb: true,
            },
          ],
        }
        for (let i = 0; i < getdata.length; i++) {
          let datalist = getdata[i]
          datalist.list.forEach(item => {
            if (item.geoCoordSysType && item.prjCoordSysType) {
              item.info = {
                infoType: 'dataset',
                geoCoordSysType: item.geoCoordSysType,
                prjCoordSysType: item.prjCoordSysType,
              }
            }
          })
          alldata[i + 1] = {
            title: datalist.datasource.alias,
            image: require('../../../../assets/mapToolbar/list_type_udb.png'),
            data: datalist.list,
          }
        }
        this.setVisible(true, ConstToolType.MAP_THEME_ADD_UDB, {
          containerType: 'list',
          isFullScreen: true,
          isTouchProgress: false,
          showMenuDialog: false,
          listSelectable: false, //单选框
          height:
            this.props.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[3]
              : ConstToolType.THEME_HEIGHT[5],
          column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
          data: alldata,
          buttons: [ToolbarBtnType.THEME_CANCEL],
        })
        this.scrollListToLocation()
      }.bind(this)())
      // NavigationService.navigate('WorkspaceFlieList', {
      //   cb: async path => {
      //     this.path = path
      //     let list = await SMap.getUDBName(path)
      //     let datalist = [
      //       {
      //         title: '数据集',
      //         data: list,
      //       },
      //     ]
      //     this.setState({
      //       data: datalist,
      //       type: ConstToolType.MAP_ADD_DATASET,
      //     })
      //   },
      // })
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
          result === true ? ConstInfo.ADD_SUCCESS : ConstInfo.ADD_FAILED,
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
    } else if (this.state.type === ConstToolType.MAP_THEME_ADD_UDB) {
      //专题图添加数据源
      if (item.theme_add_udb) {
        (async function() {
          let data = []
          let customerUDBPath = await FileTools.appendingHomeDirectory(
            ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
          )
          let customerUDBs = await FileTools.getPathListByFilter(
            customerUDBPath,
            {
              extension: 'udb',
              type: 'file',
            },
          )
          customerUDBs.forEach(item => {
            item.image = require('../../../../assets/mapToolbar/list_type_udb.png')
            item.info = {
              infoType: 'mtime',
              lastModifiedDate: item.mtime,
            }
          })

          let userUDBPath, userUDBs
          if (this.props.user && this.props.user.currentUser.userName) {
            userUDBPath =
              (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
              this.props.user.currentUser.userName +
              '/' +
              ConstPath.RelativePath.Datasource
            userUDBs = await FileTools.getPathListByFilter(userUDBPath, {
              extension: 'udb',
              type: 'file',
            })
            userUDBs.forEach(item => {
              item.image = require('../../../../assets/mapToolbar/list_type_udb.png')
              item.info = {
                infoType: 'mtime',
                lastModifiedDate: item.mtime,
              }
            })

            data = [
              {
                title: Const.PUBLIC_DATA_SOURCE,
                data: customerUDBs,
              },
              {
                title: Const.DATA_SOURCE,
                image: require('../../../../assets/mapToolbar/list_type_udbs.png'),
                data: userUDBs,
              },
            ]
          } else {
            data = [
              {
                title: Const.DATA_SOURCE,
                image: require('../../../../assets/mapToolbar/list_type_udbs.png'),
                data: customerUDBs,
              },
            ]
          }

          this.setVisible(true, ConstToolType.MAP_THEME_ADD_DATASET, {
            containerType: 'list',
            isFullScreen: true,
            height:
              this.props.device.orientation === 'LANDSCAPE'
                ? ConstToolType.THEME_HEIGHT[3]
                : ConstToolType.THEME_HEIGHT[5],
            data,
            buttons: [ToolbarBtnType.THEME_CANCEL],
          })
        }.bind(this)())
        // NavigationService.navigate('WorkspaceFlieList', {
        //   cb: async path => {
        //     let udbName = this.basename(path)
        //     let udbpath = {
        //       server: path,
        //       alias: udbName,
        //       engineType: 219,
        //     }
        //     //只添加数据源
        //     await SMap.openDatasource(udbpath, '')
        //     let alldata = []
        //     let getdata = await SThemeCartography.getAllDatasetNames()
        //     getdata.reverse() //反序
        //     alldata[0] = {
        //       title: '选择数据源',
        //       data: [
        //         {
        //           title: '选择目录',
        //           theme_add_udb: true,
        //         },
        //       ],
        //     }
        //     for (let i = 0; i < getdata.length; i++) {
        //       let datalist = getdata[i]
        //       alldata[i + 1] = {
        //         title: '数据源: ' + datalist.datasource.alias,
        //         data: datalist.list,
        //       }
        //     }
        //     this.setState({
        //       data: alldata,
        //     })
        //     this.scrollListToLocation()
        //   },
        // })
      } else if (item.datasetName) {
        let params = {
          DatasourceName: item.datasourceName,
          DatasetName: item.datasetName,
        }
        // 添加数据集
        let result = SMap.addDatasetToMap(params)
        Toast.show(
          result === true ? ConstInfo.ADD_SUCCESS : ConstInfo.ADD_FAILED,
        )
        // 重新加载图层
        this.props.getLayers({
          type: -1,
          currentLayerIndex: 0,
        })
      }
    } else if (this.state.type === ConstToolType.MAP_IMPORT_TEMPLATE) {
      //地图制图，专题制图：导入数据
      this.importData(item)
    } else if (this.state.type === ConstToolType.MAP_THEME_START_OPENDS) {
      //专题制图：开始->新建地图->数据源列表(->数据集列表)
      (async function() {
        this.path = await FileTools.appendingHomeDirectory(item.path)
        let arr = item.name.split('.')
        let alias = arr[0]
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
          let dataList = [
            {
              title: alias,
              image: require('../../../../assets/mapToolbar/list_type_udb.png'),
              data: list,
            },
          ]
          this.setState({
            data: dataList,
            type: ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS,
          })
        })
        // let getdata = await SThemeCartography.getDatasetsByDatasource({Alias: alias})
        // let dataList = [{
        //   title: '数据源：' + alias,
        //   data: getdata[0].list,
        // }]
        // this.setVisible(true, ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS, {
        //   containerType: 'list',
        //   isFullScreen: true,
        //   isTouchProgress: false,
        //   showMenuDialog: false,
        //   listSelectable: false, //单选框
        //   height: this.props.device.orientation === 'LANDSCAPE' ?
        //     ConstToolType.THEME_HEIGHT[3] :
        //     ConstToolType.THEME_HEIGHT[5],
        //   column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
        //   data: dataList,
        //   buttons: [ToolbarBtnType.THEME_CANCEL],
        // })
        this.scrollListToLocation()
      }.bind(this)())
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

  headerAction = ({ section }) => {
    (async function() {
      if (section.title === Const.CREATE_SYMBOL_COLLECTION) {
        // let defaultWorkspacePath = await Utility.appendingHomeDirectory(
        //   (this.props.user.currentUser.userName
        //     ? ConstPath.UserPath + this.props.user.currentUser.userName
        //     : ConstPath.CustomerPath) + ConstPath.RelativeFilePath.Workspace,
        // )

        // if (this.props.map.workspace.server === defaultWorkspacePath) {
        //   Toast.show(ConstInfo.WORKSPACE_ALREADY_OPENED)
        //   return
        // }

        this.props.setContainerLoading &&
          this.props.setContainerLoading(
            true,
            ConstInfo.MAP_SYMBOL_COLLECTION_CREATING,
          )
        await this.props.closeMap()
        this.props.setCollectionInfo() // 清空当前模板
        this.props.setCurrentTemplateInfo() // 清空当前模板
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
          ConstOnline['Google'].layerIndex,
        )
        await this.props.getLayers()
        this.props.setContainerLoading && this.props.setContainerLoading(false)
        Toast.show(ConstInfo.MAP_SYMBOL_COLLECTION_CREATED)

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
    try {
      this.props.setContainerLoading &&
        this.props.setContainerLoading(true, '正在打开模板')
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
                this.props.setContainerLoading(true, ConstInfo.TEMPLATE_READING)
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

              await this.props.getLayers(-1, layers => {
                this.props.setCurrentLayer(layers.length > 0 && layers[0])
              })
              this.props.setContainerLoading(false)
              this.setVisible(false)
            } else {
              this.props.getLayers(-1, layers => {
                this.props.setCurrentLayer(layers.length > 0 && layers[0])
              })
              Toast.show(ConstInfo.MAP_ALREADY_OPENED)
              this.props.setContainerLoading(false)
            }
            // 重新加载图层
            this.props.getLayers({
              type: -1,
              currentLayerIndex: 0,
            })
            this.props.setContainerLoading(true, ConstInfo.TEMPLATE_READING)
            this.props.getSymbolTemplates(null, () => {
              this.setVisible(false)
              this.props.setContainerLoading &&
                this.props.setContainerLoading(false)
              Toast.show(ConstInfo.TEMPLATE_CHANGE_SUCCESS)
            })
          } else {
            this.props.setContainerLoading &&
              this.props.setContainerLoading(false)
            Toast.show(ConstInfo.TEMPLATE_CHANGE_FAILED)
          }
        })
    } catch (error) {
      Toast.show(ConstInfo.TEMPLATE_CHANGE_FAILED)
      this.props.setContainerLoading && this.props.setContainerLoading(false)
    }
  }

  /** 切换地图 **/
  changeMap = async item => {
    try {
      if (
        this.props.map.currentMap &&
        this.props.map.currentMap.path === item.path
      ) {
        Toast.show(ConstInfo.MAP_ALREADY_OPENED)
        return
      }
      this.props.setContainerLoading(true, ConstInfo.MAP_CHANGING)
      if (this.props.map.currentMap.name) {
        await this.props.closeMap()
      }
      let mapInfo = await this.props.openMap({ ...item })
      if (mapInfo) {
        Toast.show(ConstInfo.CHANGE_MAP_TO + mapInfo.name)
        if (mapInfo.Template) {
          this.props.setContainerLoading(true, ConstInfo.TEMPLATE_READING)
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

        await this.props.getLayers(-1, layers => {
          this.props.setCurrentLayer(layers.length > 0 && layers[0])
        })
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
        headerAction={this.headerAction}
        underlayColor={color.gray}
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
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              Color: item.key,
              ColorType: 'FORECOLOR',
            }
            ThemeMenuData.setThemeParams(Params)
          } else if (
            this.state.type ===
            ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR
          ) {
            let Params = {
              LayerName: GLOBAL.currentLayer.name,
              Color: item.key,
              ColorType: 'BACKSHAPE_COLOR',
            }
            ThemeMenuData.setThemeParams(Params)
          }
        }
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
    return <SymbolList layerData={this.props.currentLayer} />
  }

  _renderItem = ({ item, rowIndex, cellIndex }) => {
    let column = this.state.column
    if (this.state.type === ConstToolType.MAP3D_CIRCLEFLY) {
      column = 1
    }
    return (
      <MTBtn
        style={[styles.cell, { width: this.props.device.width / column }]}
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
        showToolbar={this.showToolbar}
        existFullMap={this.props.existFullMap}
        importSceneWorkspace={this.props.importSceneWorkspace}
      />
    )
  }

  renderMenuDialog = () => {
    let list
    if (this.state.type.indexOf('MAP_THEME_PARAM') >= 0) {
      if (this.state.themeType === constants.THEME_UNIQUE_STYLE) {
        list = uniqueMenuInfo
      } else if (this.state.themeType === constants.THEME_RANGE_STYLE) {
        list = rangeMenuInfo
      } else if (this.state.themeType === constants.THEME_UNIFY_LABEL) {
        list = labelMenuInfo
      }
    }
    if (!list) {
      switch (this.props.currentLayer.type) {
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
    }
    return (
      <MenuDialog
        ref={ref => (this.menuDialog = ref)}
        data={list}
        selectKey={this.state.selectKey}
        autoSelect={true}
        onSelect={item => {
          this.setState({
            selectKey: item.selectKey,
            selectName: item.name,
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
        case ToolbarBtnType.CANCEL:
          image = require('../../../../assets/mapEdit/icon_function_cancel.png')
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
          action = this.changeCollection
          break
        case ToolbarBtnType.SHOW_ATTRIBUTE:
          image = require('../../../../assets/mapTools/icon_attribute_white.png')
          action = () => {
            if (
              !this.props.selection.layerInfo ||
              !this.props.selection.layerInfo.path
            ) {
              Toast.show(ConstInfo.NON_SELECTED_OBJ)
              return
            }
            NavigationService.navigate('layerSelectionAttribute', {
              type: 'singleAttribute',
            })
          }
          break
        case ToolbarBtnType.SHARE:
          image = require('../../../../assets/mapTools/icon_share.png')
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
              this.props.setInputDialogVisible(true, {
                placeholder: '请输入分享数据名称',
                confirmAction: value => {
                  ShareData.shareToSuperMapOnline(list, value)
                  this.props.setInputDialogVisible(false)
                },
              })
            }
            // this.close()
          }
          break
        case ToolbarBtnType.MAP3DSHARE:
          image = require('../../../../assets/mapTools/icon_share.png')
          action = () => {
            try {
              let isSharing = false
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
                if (list.length > 0) {
                  isSharing = true
                  for (let index = 0; index < list.length; index++) {
                    this.props.exportmap3DWorkspace(
                      { name: list[index] },
                      async (result, zipPath) => {
                        if (result) {
                          await SOnlineService.uploadFile(
                            zipPath,
                            list[index],
                            {
                              onResult: async result => {
                                Toast.show(
                                  result
                                    ? ConstInfo.SHARE_SUCCESS
                                    : ConstInfo.SHARE_FAILED,
                                )
                                FileTools.deleteFile(zipPath)
                                isSharing = false
                              },
                            },
                          )
                        } else {
                          Toast.show('上传失败')
                        }
                      },
                    )
                  }
                }
              }
            } catch (error) {
              Toast.show('分享失败')
            }
            // this.close()
          }
          break
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
          action = this.close
          break
        case ToolbarBtnType.MENU_FLEX:
          //菜单框-显示与隐藏
          image = require('../../../../assets/mapEdit/icon_function_theme_param_style.png')
          action = this.showMenuBox
          break
        case ToolbarBtnType.MENU_COMMIT:
          //菜单框-提交
          image = require('../../../../assets/mapEdit/icon_function_theme_param_commit.png')
          action = this.menuCommit
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
      this.setState({
        isFullScreen: false,
      })
    } else {
      this.setVisible(false)
    }
    if (this.state.type === ConstToolType.MAP_BASE) {
      this.props.getLayers()
    }
    if (GLOBAL.Type === constants.MAP_EDIT) {
      GLOBAL.showMenu = true
      GLOBAL.showFlex = true
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
    return (
      <Animated.View
        style={[containerStyle, { bottom: this.state.bottom }, height]}
      >
        {this.state.isFullScreen &&
          !this.state.isTouchProgress &&
          !this.state.showMenuDialog && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={this.overlayOnPress}
            style={styles.themeoverlay}
          />
        )}
        {this.state.isTouchProgress && this.state.isFullScreen && (
          <TouchProgress selectName={this.state.selectName} />
        )}
        {/*{this.state.showMenuDialog && (*/}
        {/*<View style={styles.list}>{this.renderMenuDialog()}</View>*/}
        {/*)}*/}
        {this.state.showMenuDialog && this.renderMenuDialog()}
        <View style={styles.containers}>
          {this.renderView()}
          {this.renderBottomBtns()}
        </View>
      </Animated.View>
    )
  }
}
