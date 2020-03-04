import React from 'react'
import { screen } from '../../../../utils'
import {
  ConstToolType,
  TouchType,
  Const,
  ToolbarType,
} from '../../../../constants'
import TouchProgress from '../TouchProgress'
import NavigationService from '../../../../containers/NavigationService'
import * as ExtraDimensions from 'react-native-extra-dimensions-android'
import ToolbarModule from './modules/ToolbarModule'
import ToolbarHeight from './modules/ToolBarHeight'
import EditControlBar from './EditControlBar'
import {
  View,
  TouchableOpacity,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { SMap, SScene, Action, SCollector } from 'imobile_for_reactnative'
import ToolbarBtnType from './ToolbarBtnType'
import constants from '../../constants'
import styles from './styles'
import {
  ToolbarMenuDialog,
  ToolbarContentView,
  ToolbarBottomButtons,
} from './components'
import Utils from './utils'

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
    mapLegend?: Object, //图例参数对象
    layerList?: Array, //三维图层
    toolbarStatus: Object,

    confirm: () => {},
    showDialog: () => {},
    addGeometrySelectedListener: () => {},
    removeGeometrySelectedListener: () => {},
    setSaveViewVisible?: () => {},
    setSaveMapDialogVisible?: () => {},
    setContainerLoading?: () => {},
    showFullMap: () => {},
    dialog: () => {},
    setMapLegend?: () => {}, //设置图例显隐的redux状态
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
    changeLayerList?: () => {}, //切换场景改变三维图层
    showMenuDialog?: () => {}, //显示裁剪菜单
    getClipSetting?: () => {}, //获取三维裁剪最新的参数 每次设置裁剪图层时需要重新获取
    setClipSetting?: () => {}, //获取当前裁剪设置
    clearClip?: () => {}, //清除三维裁剪相关信息
    setMapIndoorNavigation: () => {},
    setMapNavigationShow: () => {},
    setMapNavigation: () => {},
    setMap2Dto3D: () => {},
    switchAr: () => {},
    setOpenOnlineMap: () => {},
    downloads: Array,
    downloadFile: () => {},
    deleteDownloadFile: () => {},
    //设置、获取室外导航数据
    setNavigationDatas: () => {},
    getNavigationDatas: () => {},
    //更改导航路径
    changeNavPathInfo: () => {},
    //获取FloorListView
    getFloorListView: () => {},
    //改变当前楼层ID
    changeFloorID: () => {},
    setToolbarStatus: () => {},
  }

  static defaultProps = {
    containerProps: {
      data: [],
      containerType: ToolbarType.table,
      themeType: '',
      isFullScreen: DEFAULT_FULL_SCREEN,
      column: DEFAULT_COLUMN, // 只有table可以设置
    },
  }

  constructor(props) {
    super(props)
    this.originType = props.type // 初次传入的类型
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
      showMenuDialog: false,
      isTouch: true,
      isTouchProgress: false,
      selectName: '',
      selectKey: '',
      hasSoftMenuBottom: false,
    }
    this.height = 0
    this.isShow = false
    this.column = -1
    this.isBoxShow = false
    this.lastState = {}

    this.setToolbarParams()
  }

  componentDidMount() {
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
    this.setToolbarParams()
    this.props.device.orientation !== prevProps.device.orientation &&
      this.changeHeight(this.props.device.orientation, this.state.type)
  }

  componentWillUnmount() {
    this.buttonView = null
    this.contentView = null
    ToolbarModule.setParams({})
  }

  setToolbarParams = () => {
    ToolbarModule.setParams({
      type: this.state.type,
      setToolbarVisible: this.setVisible,
      setLastState: this.setLastState,
      scrollListToLocation: this.scrollListToLocation,
      showMenuBox: this.showMenuBox,
      mapMoveToCurrent: this.mapMoveToCurrent,
      contentView: this.contentView, // ToolbarContentView ref
      buttonView: this.buttonView, // ToolbarBottomButtons ref
      mapLegend: this.props.mapLegend,
      ...this.props,
    })
  }

  changeHeight = async (orientation, type) => {
    if (this.height === 0) return
    if (!(this.isShow && this.isBoxShow)) {
      this.showToolbar()
      return
    }
    let data = ToolbarHeight.getToolbarHeight(type)
    this.height = data.height
    this.column = data.column
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

  switchAr = () => {
    this.props.switchAr && this.props.switchAr()
  }

  existFullMap = () => {
    this.props.existFullMap && this.props.existFullMap()
  }

  getBoxShow = () => this.isBoxShow

  setBoxShow = isBoxShow => {
    this.isBoxShow = isBoxShow
  }

  getData = async type => {
    let toolbarModule = await ToolbarModule.getTabBarData(type, {
      setToolbarVisible: this.setVisible,
      setLastState: this.setLastState,
      scrollListToLocation: this.scrollListToLocation,
      contentView: this.contentView, // ToolbarContentView ref
      buttonView: this.buttonView, // ToolbarBottomButtons ref
      ...this.props,
    })
    // let data = toolbarModule.data
    // let buttons = toolbarModule.buttons
    this.lastUdbList = toolbarModule.data //保存上次的数据源数据

    return toolbarModule
  }

  /** 记录Toolbar上一次的state **/
  setLastState = () => {
    Object.assign(this.lastState, this.state, { height: this.height })
  }

  /**
   * 设置遮罩层的显隐
   * @param visible
   */
  setOverlayViewVisible = visible => {
    GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(visible)
  }

  //更新遮盖层状态
  updateOverlayView = () => {
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
    if (isShow && GLOBAL.TouchType !== TouchType.ANIMATION_WAY) {
      GLOBAL.TouchType = TouchType.NULL
      GLOBAL.bubblePane && GLOBAL.bubblePane.reset() // 重置气泡提示
    } else if (!isShow) {
      GLOBAL.TouchType = TouchType.NORMAL
    }
    this.setOverlayViewVisible(isShow)

    // if (type === ConstToolType.MAP_STYLE) {
    //   if (this.props.currentLayer) {
    //     SCartography.getLayerStyle(this.props.currentLayer.name).then(value => {
    //       this.currentLayerStyle = value
    //     })
    //   }
    // }
    if (this.state.type === ConstToolType.MAP3D_CIRCLEFLY) {
      SScene.stopCircleFly()
      // SScene.clearCirclePoint()
    }
    if (
      this.isShow !== isShow ||
      this.state.type !== type ||
      params.isFullScreen !== this.state.isFullScreen ||
      params.height !== this.height ||
      // params.column !== this.state.column ||
      params.buttons !== this.state.buttons ||
      params.selectKey !== this.state.selectKey ||
      params.isTouchProgress !== this.state.isTouchProgress
      // params.listSelectable !== this.state.listSelectable
    ) {
      (async function() {
        let data = params.data
        let buttons = params.buttons
        let customView = params.customView
        if (data === undefined || buttons === undefined) {
          let _data = await this.getData(type)
          data = _data.data
          buttons = _data.buttons
          customView = _data.customView
        }
        this.originType = type
        let newHeight = this.height
        if (!isShow) {
          newHeight = 0
        } else if (params && typeof params.height === 'number') {
          newHeight = params.height
        }
        this.shareTo = params.shareTo || ''

        this.setState(
          {
            showMenuDialog: params.showMenuDialog || false,
            type: type,
            data: params.data || data,
            customView: customView,
            buttons: params.buttons || buttons,
            isTouchProgress: params.isTouchProgress || false,
            isFullScreen:
              params && params.isFullScreen !== undefined
                ? params.isFullScreen
                : DEFAULT_FULL_SCREEN,
            containerType:
              params && params.containerType
                ? params.containerType
                : type === ConstToolType.MAP_SYMBOL
                  ? ToolbarType.tabs
                  : ToolbarType.table,
            themeType:
              params && params.themeType
                ? params.themeType
                : isShow
                  ? this.state.themeType
                  : '',
            selectKey: params && params.selectKey ? params.selectKey : '',
            selectName: params && params.selectName ? params.selectName : '',
          },
          () => {
            // if (!showViewFirst) {
            if (!isNaN(newHeight)) this.height = newHeight
            if (!isNaN(params.column)) this.column = params.column
            this.showToolbarAndBox(isShow, type)
            !isShow && this.props.existFullMap && this.props.existFullMap()
            // }
            if (params.cb) {
              setTimeout(() => params.cb(), Const.ANIMATED_DURATION_2)
            }
            this.updateOverlayView()
          },
        )
      }.bind(this)())
    } else {
      this.showToolbarAndBox(isShow)
      if (params.cb) {
        setTimeout(() => params.cb(), Const.ANIMATED_DURATION_2)
      }
      !isShow && this.props.existFullMap && this.props.existFullMap()
      this.updateOverlayView()
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
    if (!this.contentView) return
    // Box内容框的显示和隐藏
    let bottom = parseFloat(JSON.stringify(this.state.bottom))
    if (
      type === ConstToolType.MAP_THEME_PARAM ||
      type === ConstToolType.MAP_THEME_PARAM_GRAPH
    ) {
      let animated = this.contentView.changeHeight({
        height: 0,
        column: this.column > -1 ? this.column : undefined,
        wait: true,
      })
      animated && animatedList.push(animated)
      this.isBoxShow = false
    } else {
      if (
        JSON.stringify(this.contentView.getContentHeight()) !==
        this.height.toString()
      ) {
        let boxAnimated = this.contentView.changeHeight({
          height: this.height,
          column: this.column > -1 ? this.column : undefined,
          wait: true,
        })
        if (boxAnimated) {
          JSON.stringify(this.contentView.getContentHeight()) === '0' &&
          bottom >= 0
            ? animatedList.unshift(boxAnimated)
            : animatedList.push(boxAnimated)
        }
      }
      this.isBoxShow = true
    }
    if (bottom < 0) {
      animatedList.forEach(animated => animated && animated.start())
    } else if (animatedList.length > 0) {
      Animated.sequence(animatedList).start()
    }
  }

  showToolbar = async (isShow, cb = () => {}) => {
    let animatedList = []
    // Toolbar的显示和隐藏
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      animatedList.push(
        Animated.timing(this.state.bottom, {
          toValue: isShow
            ? 0
            : -Math.max(this.props.device.height, this.props.device.width),
          duration: Const.ANIMATED_DURATION,
        }),
      )
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    let bottom = parseFloat(JSON.stringify(this.state.bottom))
    if (
      JSON.stringify(this.contentView.getContentHeight()) !==
      this.height.toString()
    ) {
      let boxAnimated = await this.contentView.changeHeight({
        height: this.height,
        column: this.column > -1 ? this.column : undefined,
        wait: true,
      })
      boxAnimated && this.height === 0 && bottom >= 0
        ? animatedList.unshift(boxAnimated)
        : animatedList.push(boxAnimated)
    }
    if (bottom < 0) {
      animatedList.forEach(animated => animated && animated.start())
    } else {
      Animated.sequence(animatedList).start()
    }
    if (cb) {
      setTimeout(() => cb(), Const.ANIMATED_DURATION_2)
    }
  }

  back = () => {
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.toolbarBack
    ) {
      ToolbarModule.getData().actions.toolbarBack()
      return
    }
  }

  close = (type = this.state.type, actionFirst = false) => {
    // TODO 待去掉，下列方法分别放到各个Module下面
    (async function() {
      let actionType = Action.PAN
      if (
        type === ConstToolType.MAP_TOOL_INCREMENT ||
        type === ConstToolType.MAP_TOOL_GPSINCREMENT
      ) {
        GLOBAL.FloorListView.setVisible(true)
        await SMap.removeNetworkDataset()
        SMap.setAction(Action.PAN)
        SMap.setIsMagnifierEnabled(false)
      }
      // 取消智能配图配图后 亮度/饱和度/对比度 的调整
      if (type === ConstToolType.STYLE_TRANSFER) {
        // ToolbarPicker.hide()
        await SMap.resetMapFixColorsModeValue(true)
      }

      if (type === ConstToolType.MAP3D_TOOL_FLY) {
        SScene.checkoutListener('startTouchAttribute')
        SScene.flyStop()
        SScene.setAction('PAN3D')
      }
      if (type === ConstToolType.MAP3D_TOOL_NEWFLY) {
        SScene.checkoutListener('startTouchAttribute')
        SScene.clearRoutStops()
        SScene.flyStop()
        SScene.setAction('PAN3D')
      }
      if (
        type === ConstToolType.PLOT_ANIMATION_PLAY ||
        type === ConstToolType.PLOT_ANIMATION_START
      ) {
        SMap.animationClose()
      }
      if (actionFirst) {
        await this.closeSubAction(type, actionType)
      }

      if (typeof type === 'string' && type.indexOf('MAP_TOOL_') >= 0) {
        if (
          ToolbarModule.getData().actions &&
          ToolbarModule.getData().actions.close
        ) {
          ToolbarModule.getData().actions.close(type)
        }
      }

      // if (typeof type === 'string' && type.indexOf('MAP_TOOL_MEASURE_') >= 0) {
      //   // 去掉量算监听
      //   SMap.removeMeasureListener()
      //   this.pointArr = []
      //   this.redoArr = []
      //   this.setState({
      //     canUndo: false,
      //     canRedo: false,
      //   })
      // }
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
      // {
      //   if (this.currentLayerStyle) {
      //     SCartography.setLayerStyle(
      //       this.props.currentLayer.name,
      //       this.currentLayerStyle,
      //     ).then(() => {
      //       this.currentLayerStyle = undefined
      //     })
      //   }
      // }
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
        SMap.cancel()
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
              this.updateOverlayView()
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

      this.updateOverlayView()
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
        type === ConstToolType.MAP3D_BOX_CLIPPING ||
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
        } else if (GLOBAL.Type !== constants.MAP_3D) {
          SMap.setAction(actionType)
        }
      }
    }
  }

  getToolbarModule = () => {
    return ToolbarModule
  }

  menu = () => {
    // TODO 此方法待改，分拆到各个module下
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.menu
    ) {
      ToolbarModule.getData().actions.menu(
        this.state.type,
        this.state.selectKey,
        {
          showBox: height => {
            if (height !== undefined) this.height = height
            this.contentView &&
              this.contentView.changeHeight(
                this.state.showMenuDialog ? this.height : 0,
              )
            // this.isBoxShow = this.state.showMenuDialog
            this.isBoxShow = false
          },
          setData: params => {
            // this.isBoxShow = !this.isBoxShow
            // this.isBoxShow = false
            this.setState(params, () => {
              this.updateOverlayView()
            })
          },
        },
      )
    }
  }

  menus = () => {
    if (this.state.showMenuDialog === false) {
      this.setState({ showMenuDialog: true }, () => {
        this.updateOverlayView()
      })
    } else {
      this.setState({ showMenuDialog: false }, () => {
        this.updateOverlayView()
      })
    }
    this.setState({ isTouchProgress: false }, () => {
      this.updateOverlayView()
    })
  }

  showMenuBox = () => {
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.showMenuBox
    ) {
      ToolbarModule.getData().actions.showMenuBox(
        this.state.type,
        this.state.selectKey,
        {
          showBox: (params = {}) => {
            this.isBoxShow = !this.isBoxShow

            let height = this.height
            if (params.height !== undefined) {
              height = params.height
              delete params.height
            }

            this.contentView &&
              this.contentView.changeHeight(this.isBoxShow ? height : 0)

            if (Object.keys(params).length > 0) {
              this.setState(params, () => {
                this.updateOverlayView()
              })
            } else {
              this.updateOverlayView()
            }
          },
          setData: (params = {}) => {
            if (Object.keys(params).length > 0) {
              this.setState(params, () => {
                this.updateOverlayView()
              })
            }
          },
        },
      )
      return
    }

    if (Utils.isTouchProgress(this.state.selectKey)) {
      // 显示指滑进度条
      this.setState(
        {
          isTouchProgress: !this.state.isTouchProgress,
          showMenuDialog: false,
          isFullScreen: !this.state.isTouchProgress,
        },
        () => {
          this.updateOverlayView()
        },
      )
      this.isBoxShow = false
    } else {
      this.isBoxShow = !this.isBoxShow

      this.contentView &&
        this.contentView.changeHeight(this.isBoxShow ? this.height : 0)

      this.setState(
        {
          showMenuDialog: false,
          isFullScreen: false,
        },
        () => {
          this.updateOverlayView()
        },
      )
    }
  }

  showBox = (autoFullScreen = false) => {
    if (autoFullScreen) {
      this.setState(
        {
          isFullScreen: !this.isBoxShow,
        },
        () => {
          this.contentView &&
            this.contentView.changeHeight(this.isBoxShow ? 0 : this.height)
          this.isBoxShow = !this.isBoxShow
          this.updateOverlayView()
        },
      )
    } else {
      this.contentView &&
        this.contentView.changeHeight(this.isBoxShow ? 0 : this.height)
      this.isBoxShow = !this.isBoxShow
      if (GLOBAL.Type === constants.MAP_EDIT) {
        if (
          GLOBAL.MapToolType.indexOf(ConstToolType.MAP_TOOL_TAGGING_EDIT) !==
            -1 ||
          GLOBAL.MapToolType.indexOf(ConstToolType.MAP_TOOL_TAGGING_STYLE) !==
            -1
        ) {
          return
        }
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

  mapMoveToCurrent = async () => {
    let moveToCurrentResult = await SMap.moveToCurrent()
    if (!moveToCurrentResult) {
      await SMap.moveToPoint({ x: 116.21, y: 39.42 })
    }
    await SMap.setScale(0.0000060635556556859582)
  }

  /** 编辑操作控制栏（撤销/重做/取消/提交） **/
  renderEditControlBar = () => {
    return <EditControlBar type={this.props.type} />
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
    } else if (
      typeof this.state.type === 'string' &&
      this.state.type.indexOf('MAP_THEME_PARAM') >= 0
    ) {
      this.contentView && this.contentView.changeHeight(0)
      this.isBoxShow = false
      this.setState(
        {
          isFullScreen: false,
        },
        () => {
          this.updateOverlayView()
        },
      )
    } else if (this.state.type === ConstToolType.MAP3D_WORKSPACE_LIST) {
      this.showToolbarAndBox(false)
      this.props.existFullMap && this.props.existFullMap()
      GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(false)
    } else if (
      this.state.type === ConstToolType.MAP_PLOTTING_ANIMATION ||
      this.state.type === ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST
    ) {
      let height = 0
      this.props.showFullMap && this.props.showFullMap(true)
      let type = ConstToolType.PLOT_ANIMATION_START
      this.setVisible(true, type, {
        isFullScreen: false,
        height,
        cb: () => SMap.setAction(Action.SELECT),
      })
    } else if (this.state.type === ConstToolType.PLOT_ANIMATION_NODE_CREATE) {
      this.contentView.savePlotAnimationNode()
    } else if (this.state.type === ConstToolType.MAP3D_TOOL_FLYLIST) {
      SScene.checkoutListener('startTouchAttribute')
      SScene.setAction('PAN3D')
      GLOBAL.action3d = 'PAN3D'
      this.setVisible(false)
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

  renderView = () => {
    return (
      <ToolbarContentView
        ref={ref => (this.contentView = ref)}
        {...this.props}
        type={this.state.type}
        containerType={this.state.containerType}
        data={this.state.data}
        existFullMap={this.existFullMap}
        setVisible={this.setVisible}
        showBox={this.showBox}
        customView={this.state.customView}
      />
    )
  }

  renderBottomBtns = () => {
    return (
      <ToolbarBottomButtons
        ref={ref => (this.buttonView = ref)}
        selection={this.props.selection}
        toolbarStatus={this.props.toolbarStatus}
        type={this.state.type}
        close={this.close}
        back={this.back}
        setVisible={this.setVisible}
        buttons={this.state.buttons}
        showBox={this.showBox}
        showMenuBox={this.showMenuBox}
        menu={this.menu}
      />
    )
  }

  renderMenuDialog = () => {
    return (
      <ToolbarMenuDialog
        {...this.props}
        type={this.state.type}
        themeType={this.state.themeType}
        selectKey={this.state.selectKey}
        mapLegend={this.props.mapLegend}
        mapMoveToCurrent={this.mapMoveToCurrent}
      />
    )
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
    let keyboardVerticalOffset
    if (Platform.OS === 'android') {
      keyboardVerticalOffset =
        this.props.device.orientation === 'LANDSCAPE' ? 0 : 200
    } else {
      keyboardVerticalOffset =
        this.props.device.orientation === 'LANDSCAPE' ? 250 : 500
    }
    return (
      <Animated.View
        style={[containerStyle, { bottom: this.state.bottom }, height]}
      >
        {this.state.isFullScreen &&
          this.state.type !== ConstToolType.STYLE_TRANSFER &&
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
            selectName={this.state.selectName}
            showMenu={() => {
              // 智能配图选择器，唤起选择器菜单
              if (this.state.type === ConstToolType.STYLE_TRANSFER_PICKER) {
                this.showPicker()
                return
              } else {
                this.menu()
              }
            }}
          />
        )}
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
