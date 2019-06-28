/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Animated, FlatList, Platform } from 'react-native'
import { MTBtn } from '../../../../components'
import {
  ConstToolType,
  Const,
  // ConstInfo,
  ConstPath,
  UserType,
} from '../../../../constants'
import { scaleSize, Toast, setSpText } from '../../../../utils'
import { FileTools } from '../../../../native'
import styles from './styles'
import { SScene, SMap, Action, ThemeType } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import constants from '../../constants'
import ToolbarBtnType from '../ToolBar/ToolbarBtnType'
import { Bar } from 'react-native-progress'

const COLLECTION = 'COLLECTION'
const NETWORK = 'NETWORK'
const EDIT = 'EDIT'
const MAP_3D = 'MAP_3D'
const MAP_EDIT = 'MAP_EDIT'
// const MAP_THEME = 'MAP_THEME'
/**
 * @deprecated 移除当前的类型，使用constants
 */
export { COLLECTION, NETWORK, EDIT }
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language/index'

const HeaderHeight = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)
const BottomHeight = scaleSize(100)

export default class FunctionToolbar extends React.Component {
  props: {
    language: string,
    style?: any,
    hide?: boolean,
    direction?: string,
    separator?: number,
    shareProgress?: number,
    online?: Object,
    device: Object,
    type: string,
    data?: Array,
    layers: PropTypes.object,
    getToolRef: () => {},
    getMenuAlertDialogRef: () => {},
    showFullMap: () => {},
    setMapType: () => {},

    save: () => {},
    saveAs: () => {},
    closeOneMap: () => {},
    addGeometrySelectedListener: () => {},
    removeGeometrySelectedListener: () => {},
    symbol: Object,
    device: Object,
    user: Object,
    map: Object,
  }

  static defaultProps = {
    type: constants.COLLECTION,
    hide: false,
    direction: 'column',
    separator: 20,
  }

  constructor(props) {
    super(props)
    let data = props.data || this.getData(props.type)
    this.state = {
      type: props.type,
      data: data,
      right: new Animated.Value(scaleSize(31)),
    }
    this.visible = true
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.props.online.share) !==
        JSON.stringify(nextProps.online.share) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device)
    ) {
      return true
    }
    return false
  }

  setVisible = (visible, immediately = false) => {
    if (this.visible === visible) return
    Animated.timing(this.state.right, {
      toValue: visible ? scaleSize(31) : scaleSize(-200),
      duration: immediately ? 0 : Const.ANIMATED_DURATION,
    }).start()
    this.visible = visible
  }

  start = type => {
    const toolRef = this.props.getToolRef()
    let height
    if (
      ConstToolType.MAP_EDIT_START === type ||
      ConstToolType.MAP_COLLECTION_START === type
    ) {
      height =
        this.props.device.orientation === 'LANDSCAPE'
          ? ConstToolType.HEIGHT[0]
          : ConstToolType.HEIGHT[2]
    } else {
      height = ConstToolType.HEIGHT[2]
    }
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, type, {
        containerType: 'table',
        column: this.props.device.orientation === 'LANDSCAPE' ? 5 : 4,
        height: height,
      })
    }
  }

  showMenuAlertDialog = () => {
    if (
      !GLOBAL.currentLayer ||
      (GLOBAL.currentLayer.themeType <= 0 && !GLOBAL.currentLayer.isHeatmap)
    ) {
      Toast.show(
        getLanguage(this.props.language).Prompt.PLEASE_SELECT_THEMATIC_LAYER,
      )
      //'提示: 请先选择专题图层。')
      NavigationService.navigate('LayerManager')
      return
    }
    let type = ''
    if (GLOBAL.currentLayer.isHeatmap) {
      type = constants.THEME_HEATMAP
    } else {
      switch (GLOBAL.currentLayer.themeType) {
        case ThemeType.UNIQUE:
          type = constants.THEME_UNIQUE_STYLE
          break
        case ThemeType.RANGE:
          type = constants.THEME_RANGE_STYLE
          break
        case ThemeType.LABEL:
          type = constants.THEME_UNIFY_LABEL
          break
        case ThemeType.LABELUNIQUE:
          type = constants.THEME_UNIQUE_LABEL
          break
        case ThemeType.LABELRANGE:
          type = constants.THEME_RANGE_LABEL
          break
        case ThemeType.GRAPH:
          type = constants.THEME_GRAPH_STYLE
          break
        case ThemeType.DOTDENSITY:
          type = constants.THEME_DOT_DENSITY
          break
        case ThemeType.GRADUATEDSYMBOL:
          type = constants.THEME_GRADUATED_SYMBOL
          break
        case ThemeType.GRIDRANGE:
          type = constants.THEME_GRID_RANGE
          break
        case ThemeType.GRIDUNIQUE:
          type = constants.THEME_GRID_UNIQUE
          break
        case ThemeType.CUSTOM:
          Toast.show('提示: 暂不支持编辑的专题图层。')
          return
        default:
          Toast.show(
            getLanguage(this.props.language).Prompt
              .PLEASE_SELECT_THEMATIC_LAYER,
          )
          //''提示: 请先选择专题图层。')
          NavigationService.navigate('LayerManager')
          return
      }
    }

    if (GLOBAL.toolBox) {
      GLOBAL.toolBox.setVisible(
        true,
        type === constants.THEME_GRAPH_STYLE
          ? ConstToolType.MAP_THEME_PARAM_GRAPH
          : ConstToolType.MAP_THEME_PARAM,
        {
          containerType: 'list',
          isFullScreen: true,
          isTouchProgress: false,
          themeType: type,
          showMenuDialog: true,
        },
      )
      GLOBAL.toolBox.showFullMap()
    }

    // const menuRef = this.props.getMenuAlertDialogRef()
    // if (menuRef) {
    //   this.props.showFullMap && this.props.showFullMap(true)
    //   menuRef.setMenuType(type)
    //   menuRef.showMenuDialog()
    // }
    //
    // const toolRef = this.props.getToolRef()
    // if (toolRef) {
    //   toolRef.setVisible(true, ConstToolType.MAP_THEME_PARAM, {
    //     isFullScreen: false,
    //     containerType: 'list',
    //     height: ConstToolType.THEME_HEIGHT[1],
    //   })
    // }
  }

  map3Dstart = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_3D_START, {
        containerType: 'table',
        height:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.HEIGHT[0]
            : ConstToolType.HEIGHT[1],
        column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
      })
    }
  }

  hideThemeMenuDialog = () => {
    if (this.props.getMenuAlertDialogRef) {
      const menutoolRef = this.props.getMenuAlertDialogRef()
      if (menutoolRef) {
        menutoolRef.setDialogVisible(false)
      }
    }
  }

  startTheme = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_THEME_START, {
        containerType: 'table',
        isFullScreen: true,
        height:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.HEIGHT[0]
            : ConstToolType.HEIGHT[2],
        column: this.props.device.orientation === 'LANDSCAPE' ? 5 : 4,
      })
    }
  }

  changeBaseLayer = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      switch (this.props.type) {
        case 'MAP_3D':
          toolRef.setVisible(true, ConstToolType.MAP3D_BASE, {
            containerType: 'list',
          })
          break
        default:
          toolRef.setVisible(true, ConstToolType.MAP_BASE, {
            containerType: 'list',
            height: ConstToolType.HEIGHT[3],
          })
          break
      }
    }
  }

  showDataLists = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_OPEN, {
        containerType: 'list',
      })
    }
  }
  showAddLayer = async () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      switch (this.props.type) {
        case 'MAP_3D':
          toolRef.setVisible(true, ConstToolType.MAP3D_ADD_LAYER, {
            containerType: 'list',
            isFullScreen: true,
            height: ConstToolType.HEIGHT[3],
          })
          break
        default:
          toolRef.setVisible(true, ConstToolType.MAP_BASE, {
            containerType: 'list',
            isFullScreen: true,
            height: ConstToolType.HEIGHT[3],
          })
          break
      }
    }
  }
  showSymbol = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_SYMBOL, {
        isFullScreen: true,
        height:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[4]
            : ConstToolType.HEIGHT[3],
        column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
      })
    }
  }

  showMap3DSymbol = async () => {
    if (!GLOBAL.openWorkspace) {
      Toast.show(
        getLanguage(this.props.language).Map_Main_Menu.TOOLS_AREA_MEASUREMENT,
      )
      //'请打开场景')
      return
    }
    SScene.checkoutListener('startLabelOperate')
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      // TODO 根据符号类型改变ToolBox内容
      toolRef.setVisible(true, ConstToolType.MAP3D_SYMBOL, {
        containerType: 'table',
        isFullScreen: true,
        height:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.HEIGHT[0]
            : ConstToolType.HEIGHT[2],
        column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
      })
    }
  }

  showMap3DTool = async () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      // TODO 根据符号类型改变ToolBox内容
      toolRef.setVisible(true, ConstToolType.MAP3D_TOOL, {
        containerType: 'table',
        isFullScreen: true,
        height:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.HEIGHT[2]
            : scaleSize(350),
        column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
      })
    }
  }

  showMap3DFly = async () => {
    SScene.checkoutListener('startMeasure')
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      toolRef.showMap3DTool(ConstToolType.MAP3D_TOOL_FLYLIST)
    }
  }

  showCollection = () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      let type = ''
      switch (this.props.symbol.currentSymbol.type) {
        case 'marker':
          type = ConstToolType.MAP_COLLECTION_POINT
          break
        case 'line':
          type = ConstToolType.MAP_COLLECTION_LINE
          break
        case 'fill':
          type = ConstToolType.MAP_COLLECTION_REGION
          break
      }
      // 选中符号后打开对应的采集界面
      // 没有选择符号则打开符号选择界面
      if (type) {
        toolRef.setVisible(true, type, {
          isFullScreen: false,
        })
      } else {
        this.showSymbol()
      }
    }
  }

  showEdit = async () => {
    const toolRef = this.props.getToolRef()
    let height = ConstToolType.HEIGHT[3]
    let column = 4
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      let type = '',
        tableType = 'normal'
      switch (this.props.symbol.currentSymbol.type) {
        // case 'marker':
        //   type = ConstToolType.MAP_EDIT_POINT
        //   height = ConstToolType.HEIGHT[0]
        //   column = 5
        //   break
        // case 'line':
        //   type = ConstToolType.MAP_EDIT_LINE
        //   height = ConstToolType.HEIGHT[2]
        //   break
        // case 'fill':
        //   type = ConstToolType.MAP_EDIT_REGION
        //   height = ConstToolType.HEIGHT[2]
        //   tableType = 'scroll'
        //   break
        default:
          type = ConstToolType.MAP_EDIT_DEFAULT
          height = 0
      }
      GLOBAL.currentToolbarType = type
      toolRef.setVisible(true, type, {
        isFullScreen: false,
        column,
        height,
        tableType,
        cb: () => SMap.setAction(Action.SELECT),
      })
      Toast.show(
        getLanguage(this.props.language).Prompt.PLEASE_SELECT_OBJECT,
        //ConstInfo.CHOOSE_EDIT_OBJ
      )
    }
  }

  showMore = async type => {
    this.hideThemeMenuDialog()
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, type, {
        containerType: 'table',
        isFullScreen: true,
        column: 4,
        height: ConstToolType.HEIGHT[0],
      })
    }
  }

  showMap3Dshare = async () => {
    this.hideThemeMenuDialog()
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_SHARE_MAP3D, {
        containerType: 'table',
        isFullScreen: true,
        column: 4,
        height: ConstToolType.HEIGHT[0],
      })
    }
  }

  showThemeCreate = async () => {
    // let isAnyOpenedDS = true //是否有打开的数据源
    // isAnyOpenedDS = await SThemeCartography.isAnyOpenedDS()
    // if (!isAnyOpenedDS) {
    //   Toast.show('请先添加数据源')
    //   return
    // }
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      // TODO 根据符号类型改变ToolBox 编辑内容
      toolRef.setVisible(true, ConstToolType.MAP_THEME_CREATE, {
        isFullScreen: true,
        column: this.props.device.orientation === 'LANDSCAPE' ? 8 : 4,
        height:
          this.props.device.orientation === 'LANDSCAPE'
            ? ConstToolType.THEME_HEIGHT[4]
            : ConstToolType.THEME_HEIGHT[10],
      })
    }
  }

  showTool = async () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_TOOL, {
        isFullScreen: true,
        height: ConstToolType.NEWTHEME_HEIGHT[4],
        // this.props.device.orientation === 'LANDSCAPE'
        //   ? ConstToolType.HEIGHT[0]
        //   : ConstToolType.HEIGHT[2],
        column: this.props.device.orientation === 'LANDSCAPE' ? 5 : 4,
        // this.props.device.orientation === 'LANDSCAPE'
        //   ? ConstToolType.HEIGHT[2]
        //   : ConstToolType.HEIGHT[3],
      })
    }
  }

  showTools = async () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      await SMap.setLabelColor()
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_TOOLS, {
        isFullScreen: true,
        height: ConstToolType.NEWTHEME_HEIGHT[4],
        // this.props.device.orientation === 'LANDSCAPE'
        //   ? ConstToolType.HEIGHT[0]
        //   : ConstToolType.HEIGHT[2],
        column: this.props.device.orientation === 'LANDSCAPE' ? 5 : 4,
        // this.props.device.orientation === 'LANDSCAPE'
        //   ? ConstToolType.HEIGHT[2]
        //   : ConstToolType.HEIGHT[3],
      })
    }
  }

  mapStyle = () => {
    const toolRef = this.props.getToolRef()
    if (this.props.layers.themeType <= 0) {
      if (
        this.props.layers.type === 1 ||
        this.props.layers.type === 3 ||
        this.props.layers.type === 5 ||
        this.props.layers.type === 83
      ) {
        if (toolRef) {
          if (this.props.layers.type === 83) {
            this.props.showFullMap && this.props.showFullMap(true)
            toolRef.setVisible(true, ConstToolType.MAP_NULL, {
              containerType: 'symbol',
              isFullScreen: false,
              column: 4,
              height: ConstToolType.HEIGHT[4],
            })
          } else {
            this.props.showFullMap && this.props.showFullMap(true)
            toolRef.setVisible(true, ConstToolType.MAP_STYLE, {
              containerType: 'symbol',
              isFullScreen: false,
              column: 4,
              height: ConstToolType.THEME_HEIGHT[3],
            })
          }
        }
      } else {
        NavigationService.navigate('LayerManager')
        Toast.show(
          getLanguage(this.props.language).Prompt
            .THE_CURRENT_LAYER_CANNOT_BE_STYLED,
        )
        //'当前图层无法设置风格,请重新选择图层')
      }
    } else {
      NavigationService.navigate('LayerManager')
      Toast.show(
        getLanguage(this.props.language).Prompt
          .THE_CURRENT_LAYER_CANNOT_BE_STYLED,
      )
      //'当前图层无法设置风格,请重新选择图层')
    }
  }

  remove = () => {}

  /** 添加 **/
  add = async () => {
    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      switch (this.props.type) {
        case 'MAP_3D':
          toolRef.setVisible(true, ConstToolType.MAP3D_ADD_LAYER, {
            containerType: 'list',
            isFullScreen: true,
            height: ConstToolType.HEIGHT[3],
          })
          break
        default:
          {
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
              item.image = require('../../../../assets/mapToolbar/list_type_udb_black.png')
              item.info = {
                infoType: 'mtime',
                lastModifiedDate: item.mtime,
              }
            })

            let userUDBPath, userUDBs
            if (
              this.props.user &&
              this.props.user.currentUser.userName &&
              this.props.user.currentUser.userType !== UserType.PROBATION_USER
            ) {
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
                item.image = require('../../../../assets/mapToolbar/list_type_udb_black.png')
                item.info = {
                  infoType: 'mtime',
                  lastModifiedDate: item.mtime,
                }
              })

              data = [
                {
                  title: Const.PUBLIC_DATA_SOURCE,
                  image: require('../../../../assets/mapToolbar/list_type_udbs.png'),
                  data: customerUDBs,
                },
                {
                  title: getLanguage(this.props.language).Map_Main_Menu
                    .OPEN_DATASOURCE,
                  //Const.DATA_SOURCE,
                  image: require('../../../../assets/mapToolbar/list_type_udbs.png'),
                  data: userUDBs,
                },
              ]
            } else {
              data = [
                {
                  title: getLanguage(this.props.language).Map_Main_Menu
                    .OPEN_DATASOURCE,
                  //Const.DATA_SOURCE,
                  image: require('../../../../assets/mapToolbar/list_type_udbs.png'),
                  data: customerUDBs,
                },
              ]
            }

            toolRef.setVisible(true, ConstToolType.MAP_ADD_LAYER, {
              containerType: 'list',
              isFullScreen: false,
              height: ConstToolType.THEME_HEIGHT[3],
              data,
            })
          }
          break
      }
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

  /**专题图-添加 */
  getThemeMapAdd = async () => {
    let data = [],
      buttons = []
    buttons = [
      ToolbarBtnType.THEME_CANCEL,
      // ToolbarBtnType.THEME_COMMIT,
    ]
    // let customerUDBPath = await FileTools.appendingHomeDirectory(
    //   ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
    // )
    // let customerUDBs = await FileTools.getPathListByFilter(customerUDBPath, {
    //   extension: 'udb',
    //   type: 'file',
    // })
    // customerUDBs.forEach(item => {
    //   item.image = require('../../../../assets/mapToolbar/list_type_udb_black.png')
    //   item.info = {
    //     infoType: 'mtime',
    //     lastModifiedDate: item.mtime,
    //   }
    //   item.name = this.basename(item.path)
    // })

    let userUDBPath, userUDBs
    if (
      this.props.user &&
      this.props.user.currentUser.userName &&
      this.props.user.currentUser.userType !== UserType.PROBATION_USER
    ) {
      let userPath =
        (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
        this.props.user.currentUser.userName +
        '/'
      userUDBPath = userPath + ConstPath.RelativePath.Datasource
      userUDBs = await FileTools.getPathListByFilter(userUDBPath, {
        extension: 'udb',
        type: 'file',
      })
      userUDBs.forEach(item => {
        item.image = require('../../../../assets/mapToolbar/list_type_udb_black.png')
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
        }
        item.name = this.basename(item.path)
      })

      let mapData = await FileTools.getPathListByFilter(
        userPath + ConstPath.RelativePath.Map,
        {
          extension: 'xml',
          type: 'file',
        },
      )
      mapData.forEach(item => {
        item.image = require('../../../../assets/mapToolbar/list_type_map_black.png')
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
        }
        item.name = this.basename(item.path)
      })

      data = [
        // {
        //   title: Const.PUBLIC_DATA_SOURCE,
        //   data: customerUDBs,
        // },
        {
          title: getLanguage(this.props.language).Map_Main_Menu.OPEN_DATASOURCE,
          //Const.DATA_SOURCE,
          image: require('../../../../assets/mapToolbar/list_type_udbs.png'),
          data: userUDBs,
        },
        {
          title: getLanguage(this.props.language).Map_Main_Menu.OPEN_MAP,
          //Const.MAP,
          image: require('../../../../assets/mapToolbar/list_type_map.png'),
          data: mapData,
        },
      ]
    } else {
      let customerUDBPath = await FileTools.appendingHomeDirectory(
        ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
      )
      let customerUDBs = await FileTools.getPathListByFilter(customerUDBPath, {
        extension: 'udb',
        type: 'file',
      })
      customerUDBs.forEach(item => {
        item.image = require('../../../../assets/mapToolbar/list_type_udb_black.png')
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
        }
        item.name = this.basename(item.path)
      })
      let customerPath = await FileTools.appendingHomeDirectory(
        ConstPath.CustomerPath,
      )
      let mapData = await FileTools.getPathListByFilter(
        customerPath + ConstPath.RelativePath.Map,
        {
          extension: 'xml',
          type: 'file',
        },
      )
      mapData.forEach(item => {
        item.image = require('../../../../assets/mapToolbar/list_type_map_black.png')
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
        }
        item.name = this.basename(item.path)
      })
      data = [
        {
          title: getLanguage(this.props.language).Map_Main_Menu.OPEN_DATASOURCE,
          //Const.DATA_SOURCE,
          image: require('../../../../assets/mapToolbar/list_type_udbs.png'),
          data: customerUDBs,
        },
        {
          title: getLanguage(this.props.language).Map_Main_Menu.OPEN_MAP,
          //Const.MAP,
          image: require('../../../../assets/mapToolbar/list_type_map.png'),
          data: mapData,
        },
      ]
    }

    const toolRef = this.props.getToolRef()
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, ConstToolType.MAP_THEME_ADD_UDB, {
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
        data,
        buttons: buttons,
      })
      toolRef.scrollListToLocation()
    }
  }

  /** 二级事件 **/
  openOneMap = async e => {
    this.showDataLists()

    this.moreToolbar.showMore(false, e)
    this.props.setMapType('LOAD')
  }

  closeOneMap = async e => {
    this.props.closeOneMap()
    this.moreToolbar.showMore(false, e)
  }

  save = async e => {
    this.props.save()
    this.moreToolbar.showMore(false, e)
  }

  saveAs = async e => {
    this.props.saveAs()
    this.moreToolbar.showMore(false, e)
  }

  recent = () => {}

  share = () => {}

  /** 获取一级数据 **/
  getData = type => {
    let data
    switch (type) {
      case constants.MAP_EDIT:
        data = [
          // {
          //   key: '底图',
          //   title: '底图',
          //   action: this.changeBaseLayer,
          //   size: 'large',
          //   image: require('../../../../assets/function/icon_function_base_map.png'),
          // },
          {
            key: '开始',
            title: getLanguage(this.props.language).Map_Main_Menu.START,
            // title: '开始',
            action: () => this.start(ConstToolType.MAP_EDIT_START),
            size: 'large',
            image: require('../../../../assets/function/icon_function_start.png'),
          },
          {
            key: constants.ADD,
            title: getLanguage(this.props.language).Map_Main_Menu.OPEN,
            //constants.ADD,
            size: 'large',
            action: this.getThemeMapAdd,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            key: '风格',
            title: getLanguage(this.props.language).Map_Main_Menu.STYLE,
            //'风格',
            action: this.mapStyle,
            size: 'large',
            image: require('../../../../assets/function/icon_function_style.png'),
            selectMode: 'flash',
          },
          {
            title: getLanguage(this.props.language).Map_Main_Menu.TOOLS,
            //'工具',
            action: this.showTools,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
          {
            title: getLanguage(this.props.language).Map_Main_Menu.SHARE,
            //'分享',
            action: () => {
              this.showMore(ConstToolType.MAP_SHARE)
            },
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break
      case constants.MAP_3D:
        data = [
          {
            key: '开始',
            title: getLanguage(this.props.language).Map_Main_Menu.START,
            // title: '开始',
            action: this.map3Dstart,
            size: 'large',
            image: require('../../../../assets/function/icon_function_start.png'),
          },
          // {
          //   title: '标注',
          //   action: this.showMap3DSymbol,
          //   image: require('../../../../assets/function/icon_function_Tagging.png'),
          // },
          // {
          //   key: constants.ADD,
          //   title: constants.ADD,
          //   size: 'large',
          //   action: () => {},
          //   image: require('../../../../assets/function/icon_function_add.png'),
          // },
          {
            // key: 'fly',
            title: getLanguage(this.props.language).Map_Main_Menu.FLY,
            //'飞行',
            action: () => {
              // this.isShow=!this.isShow
              // this.setVisible(true, ConstToolType.MAP3D_TOOL_FLYLIST, {
              //   containerType: 'list',
              //   isFullScreen:true,
              this.showMap3DFly(ConstToolType.MAP3D_TOOL_FLYLIST)
              // })
              // this.getflylist()
            },
            image: require('../../../../assets/function/Frenchgrey/icon_symbolFly.png'),
          },
          {
            title: getLanguage(this.props.language).Map_Main_Menu.TOOLS,
            //'工具',
            action: this.showMap3DTool,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },

          {
            title: getLanguage(this.props.language).Map_Main_Menu.SHARE,
            //'分享',
            action: async () => {
              this.showMap3Dshare()
            },
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break
      case constants.MAP_THEME:
        data = [
          {
            key: '开始',
            title: getLanguage(this.props.language).Map_Main_Menu.START,
            // title: '开始',
            action: this.startTheme,
            size: 'large',
            selectMode: 'flash',
            image: require('../../../../assets/function/icon_function_start.png'),
          },
          // {
          //   key: '添加',
          //   title: '添加',
          //   size: 'large',
          //   action: this.getThemeMapAdd,
          //   image: require('../../../../assets/function/icon_function_add.png'),
          // },
          {
            key: '专题图',
            title: getLanguage(this.props.language).Map_Main_Menu.THEME,
            //'专题图',
            action: this.showThemeCreate,
            size: 'large',
            selectMode: 'flash',
            image: require('../../../../assets/function/icon_function_theme_create.png'),
          },
          {
            key: '风格',
            title: getLanguage(this.props.language).Map_Main_Menu.STYLE,
            //'风格',
            size: 'large',
            selectMode: 'flash',
            action: this.showMenuAlertDialog,
            image: require('../../../../assets/function/icon_function_style.png'),
          },
          {
            title: getLanguage(this.props.language).Map_Main_Menu.TOOLS,
            //'工具',
            action: this.showTools,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
          {
            key: '分享',
            title: getLanguage(this.props.language).Map_Main_Menu.SHARE,
            //'分享',
            size: 'large',
            selectMode: 'flash',
            action: () => {
              this.showMore(ConstToolType.MAP_SHARE)
            },
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break
      case constants.MAP_ANALYST:
        data = [
          {
            key: constants.START,
            title: constants.START,
            action: () => this.start(ConstToolType.MAP_COLLECTION_START),
            image: require('../../../../assets/function/icon_function_start.png'),
          },
          {
            key: constants.ADD,
            title: constants.ADD,
            size: 'large',
            action: this.getThemeMapAdd,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            key: constants.EDIT,
            title: constants.EDIT,
            action: this.showEdit,
            image: require('../../../../assets/function/icon_edit.png'),
          },
          {
            key: constants.TOOL,
            title: constants.TOOL,
            action: this.showTool,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
          {
            key: constants.SHARE,
            title: constants.SHARE,
            action: () => {
              this.showMore(ConstToolType.MAP_SHARE)
            },
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break
      case constants.MAP_PLOTTING:
        data = [
          {
            key: '开始',
            title: '开始',
            action: () => this.start(ConstToolType.MAP_COLLECTION_START),
            image: require('../../../../assets/function/icon_function_start.png'),
          },
          {
            title: '标绘',
            action: this.showSymbol,
            image: require('../../../../assets/function/icon_function_symbol.png'),
          },
          {
            title: '编辑',
            action: this.showEdit,
            image: require('../../../../assets/function/icon_edit.png'),
          },
          {
            title: '工具',
            action: this.showTool,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
          {
            title: '分享',
            action: () => {
              this.showMore(ConstToolType.MAP_SHARE)
            },
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break

      case constants.COLLECTION:
      default:
        data = [
          {
            key: '开始',
            title: getLanguage(this.props.language).Map_Main_Menu.START,
            // title: '开始',
            action: () => this.start(ConstToolType.MAP_COLLECTION_START),
            image: require('../../../../assets/function/icon_function_start.png'),
          },
          {
            title: getLanguage(this.props.language).Map_Main_Menu.COLLECTION,
            //'采集',
            action: this.showSymbol,
            image: require('../../../../assets/function/icon_function_symbol.png'),
          },
          {
            title: getLanguage(this.props.language).Map_Main_Menu.EDIT,
            //'编辑',
            action: this.showEdit,
            image: require('../../../../assets/function/icon_edit.png'),
          },
          {
            title: getLanguage(this.props.language).Map_Main_Menu.TOOLS,
            //'工具',
            action: this.showTool,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
          {
            title: getLanguage(this.props.language).Map_Main_Menu.SHARE,
            //'分享',
            action: () => {
              this.showMore(ConstToolType.MAP_SHARE)
            },
            image: require('../../../../assets/function/icon_function_share.png'),
          },
        ]
        break
    }
    return data
  }

  /** 获取 更多 数据 **/
  getMoreData = type => {
    let data
    switch (type) {
      case MAP_EDIT:
        data = [
          {
            title: '打开',
            action: this.openOneMap,
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            title: '关闭',
            action: this.closeOneMap,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '保存',
            action: this.save,
            image: require('../../../../assets/function/icon_function_hand_draw.png'),
          },
          {
            title: '另存',
            action: this.saveAs,
            image: require('../../../../assets/function/icon_function_edit.png'),
          },
          {
            title: '历史',
            action: this.recent,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '分享',
            action: this.showTool,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
        ]
        break
      case MAP_3D:
        data = [
          {
            title: '打开',
            action: this.open3DMap,
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            title: '保存',
            action: this.save,
            image: require('../../../../assets/function/icon_function_hand_draw.png'),
          },
          {
            title: '另存',
            action: this.saveAs,
            image: require('../../../../assets/function/icon_function_edit.png'),
          },
          {
            title: '历史',
            action: this.recent,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '分享',
            action: this.showTool,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
        ]
        break
      case COLLECTION:
      default:
        data = [
          {
            title: '打开',
            action: this.openOneMap,
            image: require('../../../../assets/function/icon_function_base_map.png'),
          },
          {
            title: '关闭',
            action: this.closeOneMap,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '保存',
            action: this.save,
            image: require('../../../../assets/function/icon_function_hand_draw.png'),
          },
          {
            title: '另存',
            action: this.saveAs,
            image: require('../../../../assets/function/icon_function_edit.png'),
          },
          {
            title: '历史',
            action: this.recent,
            image: require('../../../../assets/function/icon_function_add.png'),
          },
          {
            title: '分享',
            action: this.showTool,
            image: require('../../../../assets/function/icon_function_tool.png'),
          },
        ]
    }
    return data
  }

  /** 设置监听 **/
  /** 选择事件监听 **/
  _addGeometrySelectedListener = async () => {
    await SMap.addGeometrySelectedListener({
      geometrySelected: this.geometrySelected,
      geometryMultiSelected: this.geometryMultiSelected,
    })
  }

  _removeGeometrySelectedListener = async () => {
    await SMap.removeGeometrySelectedListener()
  }

  geometrySelected = event => {
    SMap.appointEditGeometry(event.id, event.layerInfo.name)
  }

  geometryMultiSelected = () => {
    // TODO 处理多选
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.btnView} key={this._keyExtractor(item, index)}>
        <MTBtn
          style={styles.btn}
          key={index}
          title={item.title}
          textColor={'black'}
          textStyle={{ fontSize: setSpText(20) }}
          size={MTBtn.Size.NORMAL}
          image={item.image}
          onPress={item.action}
          activeOpacity={0.5}
          // separator={scaleSize(2)}
        />
        {item.title === '分享' &&
          this.props.online.share[0] &&
          GLOBAL.Type === this.props.online.share[0].module &&
          this.props.online.share[0].progress !== undefined && (
          <Bar
            style={styles.progress}
            // indeterminate={true}
            progress={
              this.props.online.share[this.props.online.share.length - 1]
                .progress
            }
            width={scaleSize(60)}
          />
        )}
        {/*{item.title === '分享' &&*/}
        {/*this.props.online.share[this.props.online.share.length - 1] &&*/}
        {/*GLOBAL.Type === this.props.online.share[this.props.online.share.length - 1].module &&*/}
        {/*this.props.online.share[this.props.online.share.length - 1].progress !== undefined && (*/}
        {/*<Text>{this.props.online.share[this.props.online.share.length - 1].progress}</Text>*/}
        {/*)}*/}

        {/*<PieProgress*/}
        {/*ref={ref => (this.shareProgress = ref)}*/}
        {/*size={scaleSize(18)}*/}
        {/*style={styles.progress}*/}
        {/*progress={this.props.online.share[0].progress}*/}
        {/*indeterminate={false}*/}
        {/*/>*/}
      </View>
    )
  }

  _renderItemSeparatorComponent = () => {
    return <View style={styles.separator} />
  }

  _keyExtractor = (item, index) => index + '-' + item.title

  renderList = () => {
    // let arr = []
    // if (!this.state.data || this.state.data.length === 0) return null
    // this.state.data.forEach((item, index) => {
    //   arr.push(this._renderItem({ item, index }))
    // })
    // return <View style={{ flexDirection: 'column' }}>{arr}</View>

    return (
      <FlatList
        style={{
          maxHeight:
            this.props.device.height -
            HeaderHeight -
            BottomHeight -
            scaleSize(100),
        }}
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    )
  }

  render() {
    if (this.props.hide) {
      return null
    }
    return (
      <Animated.View
        style={[
          styles.container,
          this.props.style,
          { right: this.state.right },
        ]}
      >
        {this.renderList()}
        {/*<MoreToolbar*/}
        {/*ref={ref => (this.moreToolbar = ref)}*/}
        {/*data={this.getMoreData(this.props.type)}*/}
        {/*/>*/}
      </Animated.View>
    )
  }
}
