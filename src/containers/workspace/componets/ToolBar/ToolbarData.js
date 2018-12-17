import { SScene, SThemeCartography } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../constants'
import constants from '../../constants'
import ToolbarBtnType from './ToolbarBtnType'
import MapToolData from './MapToolData'
import MoreData from './MoreData'
import ShareData from './ShareData'
import StartData from './StartData'
import CollectionData from './CollectionData'
import EditData from './EditData'
import { Alert } from 'react-native'

// let _params = {}

function setParams(params) {
  // _params = params
  CollectionData.setParams(params)
}

function getTabBarData(type, params = {}) {
  let tabBarData = CollectionData.getCollectionData(type, params)

  if (typeof type === 'string' && type.indexOf('MAP_EDIT_') > -1) {
    tabBarData = EditData.getEditData(type)
  } else if (typeof type === 'string' && type.indexOf('MAP3D_') > -1) {
    tabBarData = getMap3DData(type)
  } else if (typeof type === 'string' && type.indexOf('MAP_MORE') > -1) {
    tabBarData = MoreData.getMapMore(type, params)
  } else if (
    type === ConstToolType.MAP_THEME_START ||
    type === ConstToolType.MAP_COLLECTION_START ||
    type === ConstToolType.MAP_EDIT_START ||
    type === ConstToolType.MAP_3D_START
  ) {
    tabBarData = StartData.getStart(type, params)
  } else if (
    typeof type === 'string' &&
    type.indexOf(ConstToolType.MAP_TOOL) > -1
  ) {
    tabBarData = MapToolData.getMapTool(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP_SHARE') > -1) {
    tabBarData = ShareData.getShareData(type, params)
  } else if (type === ConstToolType.MAP_THEME_CREATE) {
    tabBarData = getThemeMapCreate(type)
  } else if (type === ConstToolType.MAP_THEME_PARAM) {
    tabBarData = getThemeMapParam(type)
  }
  return {
    data: tabBarData.data,
    buttons: tabBarData.buttons,
  }
}

function getMap3DData(type) {
  let data = [],
    buttons = []
  if (type.indexOf('MAP3D_') === -1) return { data, buttons }
  switch (type) {
    case ConstToolType.MAP3D_TOOL_DISTANCEMEASURE:
      // data = [
      // {
      //   key: 'spaceDistance',
      //   title: '空间距离',
      //   action: move,
      //   size: 'large',
      //   image: require('../../../../assets/mapTools/icon_move.png'),
      //   selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
      // },
      // {
      //   key: 'psDistance',
      //   title: '水平距离',
      //   action: handlers => {
      //     SAnalyst.setMeasureLineAnalyst(handlers)
      //   },
      //   size: 'large',
      //   image: require('../../../../assets/mapTools/icon_move.png'),
      //   selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
      // },
      // {
      //   key: 'groundDistance',
      //   title: '依地距离',
      //   action: move,
      //   size: 'large',
      //   image: require('../../../../assets/mapTools/icon_move.png'),
      //   selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
      // },
      // ]
      buttons = [ToolbarBtnType.CLOSE_ANALYST, ToolbarBtnType.CLEAR]
      break
    case ConstToolType.MAP3D_TOOL_SUERFACEMEASURE:
      // data = [
      //   {
      //     key: 'spaceSuerface',
      //     title: '空间面积',
      //     action: handlers => {
      //       SAnalyst.setMeasureSquareAnalyst(handlers)
      //     },
      //     size: 'large',
      //     image: require('../../../../assets/mapTools/icon_move.png'),
      //     selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
      //   },
      //   {
      //     key: 'groundSuerface',
      //     title: '依地面积',
      //     action: move,
      //     size: 'large',
      //     image: require('../../../../assets/mapTools/icon_move.png'),
      //     selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
      //   },
      // ]
      buttons = [ToolbarBtnType.CLOSE_ANALYST, ToolbarBtnType.CLEAR]
      break
    case ConstToolType.MAP3D_TOOL_HEIGHTMEASURE:
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      break
    case ConstToolType.MAP3D_TOOL_SELECTION:
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      break
    case ConstToolType.MAP3D_TOOL_BOXTAILOR:
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      break
    case ConstToolType.MAP3D_TOOL_PSTAILOR:
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      break
    case ConstToolType.MAP3D_TOOL_CROSSTAILOR:
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      break
    case ConstToolType.MAP3D_TOOL_FLY:
      data = [
        {
          key: 'startFly',
          title: '开始轨迹',
          action: () => {
            SScene.flyStart()
          },
          size: 'large',
          image: require('../../../../assets/mapEdit/icon_play.png'),
          selectedImage: require('../../../../assets/mapEdit/icon_play.png'),
        },
        {
          key: 'stop',
          title: '暂停',
          action: () => {
            SScene.flyPause()
          },
          size: 'large',
          image: require('../../../../assets/mapEdit/icon_stop.png'),
          selectedImage: require('../../../../assets/mapEdit/icon_stop.png'),
          // selectMode:"flash"
        },
        // {
        //   key: ToolbarBtnType.END_FLY,
        //   title: '结束飞行',
        //   action: ()=>{
        //     SScene.flyStop()
        //   },
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_move.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
        // },
        // {
        //   key: 'addstation',
        //   title: '添加站点',
        //   action: move,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_move.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
        // },
        // {
        //   key: 'stationmanager',
        //   title: '站点管理',
        //   action: move,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_move.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
        // },
      ]
      buttons = [ToolbarBtnType.END_FLY, ToolbarBtnType.FLEX]
      break
    case ConstToolType.MAP3D_TOOL_LEVEL:
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      break
    case ConstToolType.MAP3D_SYMBOL_POINT:
      buttons = [
        ToolbarBtnType.CLOSE_SYMBOL,
        ToolbarBtnType.BACK,
        ToolbarBtnType.SAVE,
      ]
      break
    case ConstToolType.MAP3D_SYMBOL_POINTLINE:
      buttons = [
        ToolbarBtnType.CLOSE_SYMBOL,
        ToolbarBtnType.BACK,
        ToolbarBtnType.CLEAR_CURRENT_LABEL,
        ToolbarBtnType.SAVE,
      ]
      break
    case ConstToolType.MAP3D_SYMBOL_POINTSURFACE:
      buttons = [
        ToolbarBtnType.CLOSE_SYMBOL,
        ToolbarBtnType.BACK,
        ToolbarBtnType.CLEAR_CURRENT_LABEL,
        ToolbarBtnType.SAVE,
      ]
      break
    case ConstToolType.MAP3D_SYMBOL_TEXT:
      buttons = [
        ToolbarBtnType.CLOSE_SYMBOL,
        ToolbarBtnType.BACK,
        ToolbarBtnType.CLEAR_CURRENT_LABEL,
        ToolbarBtnType.SAVE,
      ]
      break
    case ConstToolType.MAP3D_CIRCLEFLY:
      data = [
        {
          key: 'startFly',
          title: '绕点飞行',
          action: () => {
            SScene.startCircleFly()
          },
          size: 'large',
          image: require('../../../../assets/mapEdit/icon_play.png'),
          selectedImage: require('../../../../assets/mapEdit/icon_play.png'),
        },
      ]
      buttons = ['closeCircle', 'flex']
  }
  return { data, buttons }
}

/**
 * 专题图参数设置
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getThemeMapParam(type) {
  let data = [],
    buttons = []
  if (type !== ConstToolType.MAP_THEME_PARAM) return { data, buttons }
  buttons = [
    ToolbarBtnType.THEME_CANCEL,
    ToolbarBtnType.THEME_MENU,
    ToolbarBtnType.THEME_FLEX,
    ToolbarBtnType.THEME_COMMIT,
  ]
  return { data, buttons }
}

function showTips() {
  Alert.alert('功能暂未开放。')
}

//单值专题图参数
let _paramsUniqueTheme = {}

function setUniqueThemeParams(params) {
  _paramsUniqueTheme = params
}

/** 新建单值风格专题图 **/
function createThemeUniqueMap() {
  return SThemeCartography.createThemeUniqueMap(_paramsUniqueTheme)
}

//分段专题图参数
let _paramsRangeTheme = {}

function setRangeThemeParams(params) {
  _paramsRangeTheme = params
}

/** 新建分段风格专题图 **/
function createThemeRangeMap() {
  return SThemeCartography.createThemeRangeMap(_paramsRangeTheme)
}

//统一标签专题图参数
let _paramsUniformLabel = {}

function setUniformLabelParams(params) {
  _paramsUniformLabel = params
}

/** 新建统一标签专题图 **/
function createUniformLabelMap() {
  return SThemeCartography.createUniformThemeLabelMap(_paramsUniformLabel)
}

/**
 * 获取创建专题图菜单
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getThemeMapCreate(type) {
  let data = [],
    buttons = []
  if (type !== ConstToolType.MAP_THEME_CREATE) return { data, buttons }
  data = [
    {
      //统一风格
      key: constants.THEME_UNIFY_STYLE,
      title: constants.THEME_UNIFY_STYLE,
      action: showTips,
      size: 'large',
      image: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
    },
    {
      //单值风格
      key: constants.THEME_UNIQUE_STYLE,
      title: constants.THEME_UNIQUE_STYLE,
      size: 'large',
      action: createThemeUniqueMap,
      image: require('../../../../assets/mapTools/icon_function_theme_create_unique_style.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unique_style.png'),
    },
    {
      //分段风格
      key: constants.THEME_RANGE_STYLE,
      title: constants.THEME_RANGE_STYLE,
      size: 'large',
      action: createThemeRangeMap,
      image: require('../../../../assets/mapTools/icon_function_theme_create_range_style.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_range_style.png'),
    },
    {
      //自定义风格
      key: constants.THEME_CUSTOME_STYLE,
      title: constants.THEME_CUSTOME_STYLE,
      size: 'large',
      action: showTips,
      image: require('../../../../assets/mapTools/icon_function_theme_create_custom_style.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_custom_style.png'),
    },
    {
      //自定义标签
      key: constants.THEME_CUSTOME_LABEL,
      title: constants.THEME_CUSTOME_LABEL,
      size: 'large',
      action: showTips,
      image: require('../../../../assets/mapTools/icon_function_theme_create_custom_label.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_custom_label.png'),
    },
    {
      //统一标签
      key: constants.THEME_UNIFY_LABEL,
      title: constants.THEME_UNIFY_LABEL,
      size: 'large',
      action: createUniformLabelMap,
      image: require('../../../../assets/mapTools/icon_function_theme_create_unify_label.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_label.png'),
    },
    {
      //单值标签
      key: constants.THEME_UNIQUE_LABEL,
      title: constants.THEME_UNIQUE_LABEL,
      size: 'large',
      action: showTips,
      image: require('../../../../assets/mapTools/icon_function_theme_create_unique_label.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unique_label.png'),
    },
    {
      //分段标签
      key: constants.THEME_RANGE_LABEL,
      title: constants.THEME_RANGE_LABEL,
      size: 'large',
      action: showTips,
      image: require('../../../../assets/mapTools/icon_function_theme_create_range_label.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_range_label.png'),
    },
  ]
  return { data, buttons }
}

export default {
  setParams,
  getTabBarData,
  setUniqueThemeParams,
  setRangeThemeParams,
  setUniformLabelParams,
}
