/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Animated, FlatList, Platform } from 'react-native'
import { MTBtn } from '../../../../components'
import { ConstToolType, Const } from '../../../../constants'
import { scaleSize, Toast, setSpText } from '../../../../utils'
import styles from './styles'
import { SMap } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import constants from '../../constants'
import { Bar } from 'react-native-progress'

const COLLECTION = 'COLLECTION'
const NETWORK = 'NETWORK'
const EDIT = 'EDIT'
// const MAP_THEME = 'MAP_THEME'
/**
 * @deprecated 移除当前的类型，使用constants
 */
export { COLLECTION, NETWORK, EDIT }
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language/index'
import { getThemeAssets } from '../../../../assets'
import {
  ToolbarModule,
  startModule,
  addModule,
  styleModule,
  toolModule,
  shareModule,
  themeModule,
  collectionModule,
  editModule,
  analysisModule,
  plotModule,
  fly3DModule,
  tool3DModule,
} from '../ToolBar/modules'

const HeaderHeight = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)
const BottomHeight = scaleSize(100)

export default class FunctionToolbar extends React.Component {
  props: {
    navigation: Object,
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
    currentLayer: PropTypes.object,
    getLayers?: () => {},
    getToolRef: () => {},
    getMenuAlertDialogRef: () => {},
    showFullMap: () => {},
    setMapType: () => {},
    navigation: Object,
    save: () => {},
    saveAs: () => {},
    closeOneMap: () => {},
    addGeometrySelectedListener: () => {},
    removeGeometrySelectedListener: () => {},
    symbol: Object,
    device: Object,
    user: Object,
    map: Object,
    //弹出模型、路网弹窗
    showModelList?: () => {},
    incrementRoad?: () => {},
    setMap2Dto3D: () => {},
    changeNavPathInfo?: () => {},
    openOnlineMap: boolean,
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

  isMapIndoorNavigation = () => {
    this.props.setMap2Dto3D(false)
    GLOBAL.toolBox.props.setOpenOnlineMap(false)
  }

  //AI助手
  aiAssistant = type => {
    const toolRef = this.props.getToolRef()
    let height =
      this.props.device.orientation === 'LANDSCAPE'
        ? ConstToolType.HEIGHT[0]
        : ConstToolType.HEIGHT[2]
    if (toolRef) {
      this.props.showFullMap && this.props.showFullMap(true)
      toolRef.setVisible(true, type, {
        containerType: 'table',
        column: this.props.device.orientation === 'LANDSCAPE' ? 5 : 4,
        height: height,
      })
    }
  }

  // showMenuAlertDialog = () => {
  //   if (
  //     !GLOBAL.currentLayer ||
  //     (GLOBAL.currentLayer.themeType <= 0 && !GLOBAL.currentLayer.isHeatmap)
  //   ) {
  //     Toast.show(
  //       getLanguage(this.props.language).Prompt.PLEASE_SELECT_THEMATIC_LAYER,
  //     )
  //     //'提示: 请先选择专题图层。')
  //     NavigationService.navigate('LayerManager')
  //     return
  //   }
  //   let type = ''
  //   if (GLOBAL.currentLayer.isHeatmap) {
  //     type = constants.THEME_HEATMAP
  //   } else {
  //     switch (GLOBAL.currentLayer.themeType) {
  //       case ThemeType.UNIQUE:
  //         type = constants.THEME_UNIQUE_STYLE
  //         break
  //       case ThemeType.RANGE:
  //         type = constants.THEME_RANGE_STYLE
  //         break
  //       case ThemeType.LABEL:
  //         type = constants.THEME_UNIFY_LABEL
  //         break
  //       case ThemeType.LABELUNIQUE:
  //         type = constants.THEME_UNIQUE_LABEL
  //         break
  //       case ThemeType.LABELRANGE:
  //         type = constants.THEME_RANGE_LABEL
  //         break
  //       case ThemeType.GRAPH:
  //         type = constants.THEME_GRAPH_STYLE
  //         break
  //       case ThemeType.DOTDENSITY:
  //         type = constants.THEME_DOT_DENSITY
  //         break
  //       case ThemeType.GRADUATEDSYMBOL:
  //         type = constants.THEME_GRADUATED_SYMBOL
  //         break
  //       case ThemeType.GRIDRANGE:
  //         type = constants.THEME_GRID_RANGE
  //         break
  //       case ThemeType.GRIDUNIQUE:
  //         type = constants.THEME_GRID_UNIQUE
  //         break
  //       case ThemeType.CUSTOM:
  //         Toast.show('提示: 暂不支持编辑的专题图层。')
  //         return
  //       default:
  //         Toast.show(
  //           getLanguage(this.props.language).Prompt
  //             .PLEASE_SELECT_THEMATIC_LAYER,
  //         )
  //         //''提示: 请先选择专题图层。')
  //         NavigationService.navigate('LayerManager')
  //         return
  //     }
  //   }
  //
  //   if (GLOBAL.toolBox) {
  //     GLOBAL.toolBox.setVisible(
  //       true,
  //       type === constants.THEME_GRAPH_STYLE
  //         ? ConstToolType.MAP_THEME_PARAM_GRAPH
  //         : ConstToolType.MAP_THEME_PARAM,
  //       {
  //         containerType: 'list',
  //         isFullScreen: true,
  //         isTouchProgress: false,
  //         themeType: type,
  //         showMenuDialog: true,
  //       },
  //     )
  //     GLOBAL.toolBox.showFullMap()
  //   }
  //
  //   // const menuRef = this.props.getMenuAlertDialogRef()
  //   // if (menuRef) {
  //   //   this.props.showFullMap && this.props.showFullMap(true)
  //   //   menuRef.setMenuType(type)
  //   //   menuRef.showMenuDialog()
  //   // }
  //   //
  //   // const toolRef = this.props.getToolRef()
  //   // if (toolRef) {
  //   //   toolRef.setVisible(true, ConstToolType.MAP_THEME_PARAM, {
  //   //     isFullScreen: false,
  //   //     containerType: 'list',
  //   //     height: ConstToolType.THEME_HEIGHT[1],
  //   //   })
  //   // }
  // }

  startNavigation = async () => {
    let rel = await SMap.hasNetworkDataset()
    if (rel) {
      let simpleList = GLOBAL.SimpleSelectList
      let isIndoorMap = await SMap.isIndoorMap()
      if (isIndoorMap) {
        //室内导航
        SMap.startIndoorNavigation()
        NavigationService.navigate('NavigationView', {
          changeNavPathInfo: this.props.changeNavPathInfo,
          showLocationView: false,
        })
      } else {
        //行业导航
        let { networkModel, networkDataset } = simpleList.state
        if (networkModel && networkDataset) {
          SMap.startNavigation(networkDataset.datasetName, networkModel.path)
          NavigationService.navigate('NavigationView', {
            changeNavPathInfo: this.props.changeNavPathInfo,
            showLocationView: true,
          })
        } else {
          this.props.showModelList()
        }
      }
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK_DATASETS)
    }
  }

  incrementRoad = async () => {
    let rel = await SMap.hasLineDataset()
    if (rel) {
      this.props.incrementRoad()
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.NO_LINE_DATASETS)
    }
  }

  remove = () => {}

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

  //判断当前模块是否有效
  getLicenseValid = index => {
    return GLOBAL.modulesNumber
      ? (GLOBAL.modulesNumber << (index - 1)) % 2 === 1
      : true
  }

  /** 获取一级数据 **/
  getData = type => {
    // TODO 带添加读取配置文件，添加指定模块功能
    let isLicenseNotValid = false
    let data
    switch (type) {
      case constants.MAP_EDIT:
        data = [
          startModule(
            ConstToolType.MAP_EDIT_START,
            getLanguage(this.props.language).Map_Main_Menu.START,
          ),
          addModule(
            ConstToolType.MAP_THEME_ADD_UDB,
            getLanguage(this.props.language).Map_Main_Menu.OPEN,
          ),
          styleModule(
            ConstToolType.MAP_STYLE,
            getLanguage(this.props.language).Map_Main_Menu.STYLE,
          ),
          toolModule(
            ConstToolType.MAP_TOOLS,
            getLanguage(this.props.language).Map_Main_Menu.TOOLS,
          ),
          shareModule(
            ConstToolType.MAP_SHARE,
            getLanguage(this.props.language).Map_Main_Menu.SHARE,
          ),
        ]
        break
      case constants.MAP_3D:
        //三维模块是第6个模块
        isLicenseNotValid = !this.getLicenseValid(6)
        data = [
          startModule(
            ConstToolType.MAP_3D_START,
            getLanguage(this.props.language).Map_Main_Menu.START,
          ),
          fly3DModule(
            ConstToolType.MAP3D_TOOL_FLYLIST,
            getLanguage(this.props.language).Map_Main_Menu.FLY,
          ),
          tool3DModule(
            ConstToolType.MAP3D_TOOL,
            getLanguage(this.props.language).Map_Main_Menu.TOOLS,
          ),
          shareModule(
            ConstToolType.MAP_SHARE_MAP3D,
            getLanguage(this.props.language).Map_Main_Menu.SHARE,
          ),
        ]
        break
      case constants.MAP_THEME: {
        // TODO 模块化待优化
        let styleAction = () => {
          ToolbarModule.getParams()
          let currentLayer = this.props.currentLayer
          if (currentLayer.themeType <= 0 && !currentLayer.isHeatmap) {
            styleModule().action(ConstToolType.MAP_STYLE)
          } else if (GLOBAL.Type === constants.MAP_THEME) {
            themeModule().actions.layerListAction(this.props.currentLayer)
          } else {
            Toast.show(
              getLanguage(this.props.language).Prompt
                .THE_CURRENT_LAYER_CANNOT_BE_STYLED,
            )
          }
        }
        data = [
          startModule(
            ConstToolType.MAP_THEME_START,
            getLanguage(this.props.language).Map_Main_Menu.START,
          ),
          themeModule(
            ConstToolType.MAP_THEME,
            getLanguage(this.props.language).Map_Main_Menu.THEME,
          ),
          styleModule(
            ConstToolType.MAP_STYLE,
            getLanguage(this.props.language).Map_Main_Menu.STYLE,
            styleAction,
          ),
          toolModule(
            ConstToolType.MAP_TOOLS,
            getLanguage(this.props.language).Map_Main_Menu.TOOLS,
          ),
          shareModule(
            ConstToolType.MAP_SHARE,
            getLanguage(this.props.language).Map_Main_Menu.SHARE,
          ),
        ]
        break
      }
      case constants.MAP_ANALYST:
        data = [
          startModule(
            ConstToolType.MAP_ANALYST_START,
            getLanguage(this.props.language).Map_Main_Menu.START,
          ),
          addModule(
            ConstToolType.MAP_THEME_ADD_UDB,
            getLanguage(this.props.language).Map_Main_Menu.OPEN,
          ),
          analysisModule(
            ConstToolType.MAP_ANALYSIS,
            getLanguage(this.props.language).Map_Main_Menu.ANALYSIS,
          ),
          styleModule(
            ConstToolType.MAP_STYLE,
            getLanguage(this.props.language).Map_Main_Menu.STYLE,
          ),
          toolModule(
            ConstToolType.MAP_TOOLS,
            getLanguage(this.props.language).Map_Main_Menu.TOOLS,
          ),
          shareModule(
            ConstToolType.MAP_SHARE,
            getLanguage(this.props.language).Map_Main_Menu.SHARE,
          ),
        ]
        break
      case constants.MAP_PLOTTING:
        isLicenseNotValid = !this.getLicenseValid(8)
        data = [
          startModule(
            ConstToolType.MAP_PLOTTING_START,
            getLanguage(this.props.language).Map_Main_Menu.START,
          ),
          addModule(
            ConstToolType.MAP_THEME_ADD_UDB,
            getLanguage(this.props.language).Map_Main_Menu.OPEN,
          ),
          plotModule(
            ConstToolType.PLOTTING,
            getLanguage(this.props.language).Map_Main_Menu.PLOT,
          ),
          editModule(
            ConstToolType.MAP_EDIT,
            getLanguage(this.props.language).Map_Main_Menu.EDIT,
          ),
          plotModule(
            ConstToolType.PLOTTING_ANIMATION,
            getLanguage(this.props.language).Map_Main_Menu.PLOTTING_ANIMATION,
          ),
          toolModule(
            ConstToolType.MAP_TOOLS,
            getLanguage(this.props.language).Map_Main_Menu.TOOLS,
          ),
          shareModule(
            ConstToolType.MAP_SHARE,
            getLanguage(this.props.language).Map_Main_Menu.SHARE,
          ),
        ]
        break
      case constants.MAP_AR:
        data = [
          startModule(
            ConstToolType.MAP_COLLECTION_START,
            getLanguage(this.props.language).Map_Main_Menu.START,
          ),
          addModule(
            ConstToolType.MAP_THEME_ADD_UDB,
            getLanguage(this.props.language).Map_Main_Menu.OPEN,
          ),
          styleModule(
            ConstToolType.MAP_STYLE,
            getLanguage(this.props.language).Map_Main_Menu.STYLE,
          ),
          {
            key: 'AI助手',
            title: getLanguage(this.props.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT,
            //'风格',
            action: () => this.aiAssistant(ConstToolType.MAP_AR_AIASSISTANT),
            size: 'large',
            image: getThemeAssets().ar.icon_ai_assistant,
            selectMode: 'flash',
          },
        ]
        break
      case constants.MAP_NAVIGATION:
        isLicenseNotValid = !this.getLicenseValid(10)
        data = [
          startModule(
            ConstToolType.MAP_NAVIGATION_START,
            getLanguage(this.props.language).Map_Main_Menu.START,
          ),
          addModule(
            ConstToolType.MAP_THEME_ADD_UDB,
            getLanguage(this.props.language).Map_Main_Menu.OPEN,
          ),
          {
            key: '导航',
            title: getLanguage(this.props.language).Map_Main_Menu
              .NAVIGATION_START,
            //constants.ADD,
            size: 'large',
            action: isLicenseNotValid ? null : this.startNavigation,
            image: require('../../../../assets/Navigation/navi_icon.png'),
          },
          {
            key: '路网',
            title: getLanguage(this.props.language).Map_Main_Menu
              .MAO_ROAD_DISTRIBUTION,
            //'风格',
            action: isLicenseNotValid ? null : this.incrementRoad,
            size: 'large',
            image: getThemeAssets().ar.icon_ai_assistant,
            selectMode: 'flash',
          },
          toolModule(
            ConstToolType.MAP_TOOLS,
            getLanguage(this.props.language).Map_Main_Menu.TOOLS,
          ),
          shareModule(
            ConstToolType.MAP_SHARE,
            getLanguage(this.props.language).Map_Main_Menu.SHARE,
          ),
        ]
        break
      case constants.COLLECTION:
      default:
        data = [
          startModule(
            ConstToolType.MAP_COLLECTION_START,
            getLanguage(this.props.language).Map_Main_Menu.START,
          ),
          addModule(
            ConstToolType.MAP_THEME_ADD_UDB,
            getLanguage(this.props.language).Map_Main_Menu.OPEN,
          ),
          collectionModule(
            ConstToolType.MAP_SYMBOL,
            getLanguage(this.props.language).Map_Main_Menu.COLLECTION,
          ),
          editModule(
            ConstToolType.MAP_EDIT,
            getLanguage(this.props.language).Map_Main_Menu.EDIT,
          ),
          toolModule(
            ConstToolType.MAP_TOOLS,
            getLanguage(this.props.language).Map_Main_Menu.TOOLS,
          ),
          shareModule(
            ConstToolType.MAP_SHARE,
            getLanguage(this.props.language).Map_Main_Menu.SHARE,
          ),
        ]
        break
    }
    if (isLicenseNotValid) {
      GLOBAL.licenseModuleNotContainDialog &&
        GLOBAL.licenseModuleNotContainDialog.setDialogVisible(true)
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
    SMap.appointEditGeometry(event.id, event.layerInfo.path)
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
      </Animated.View>
    )
  }
}
