import { ConstToolType } from '../../../../../constants/index'
import ToolbarBtnType from '../ToolbarBtnType'
import { getLanguage } from '../../../../../language'
import SMap from 'imobile_for_reactnative/NativeModule/interfaces/mapping/SMap'
import { MoreData, MapData } from '../data'
import AiAssistant from '../AiAssistant'
import {
  startModule,
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
} from '../modules'

// 更新类中的数据
// function setParams(params) {
//   // _params = params
//   CollectionData.setParams(params)
//   PlotData.setParams(params)
//   StartData.setParams(params)
//   ShareData.setParams(params)
//   MoreData.setParams(params)
//   Map3DData.setParams(params)
// }

let _params = {} // 外部数据和方法 Toolbar props
let _data = {} // 临时数据

function setParams(params = {}) {
  _params = params
}

function addParams(params = {}) {
  Object.assign(_params, params)
}

function getParams() {
  return _params
}

function setData(data = {}) {
  _data = data
}

function addData(data = {}) {
  Object.assign(_data, data)
}

function getData() {
  return _data
}

/**
 * 获取Toolbar内容数据和底部对应按钮
 * @param type
 * @param params
 * @returns {Promise.<{data, buttons}>}
 */
async function getTabBarData(type, params = {}) {
  let tabBarData = {
    data: [],
    buttons: [],
  }

  if (
    type === ConstToolType.MAP_SYMBOL ||
    type === ConstToolType.MAP_COLLECTION_POINT ||
    type === ConstToolType.MAP_COLLECTION_LINE ||
    type === ConstToolType.MAP_COLLECTION_REGION
  ) {
    tabBarData = collectionModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('_START') > -1) {
    tabBarData = startModule().getData(type, params)
  } else if (
    type === ConstToolType.MAP_STYLE ||
    type === ConstToolType.LINECOLOR_SET ||
    type === ConstToolType.POINTCOLOR_SET ||
    type === ConstToolType.REGIONBEFORECOLOR_SET ||
    type === ConstToolType.REGIONBORDERCOLOR_SET ||
    type === ConstToolType.REGIONAFTERCOLOR_SET
  ) {
    tabBarData = styleModule().getData(type, params)
  } else if (
    typeof type === 'string' &&
    (type.indexOf(ConstToolType.MAP_TOOL) > -1 ||
      type === ConstToolType.STYLE_TRANSFER)
  ) {
    tabBarData = toolModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP_SHARE') > -1) {
    tabBarData = shareModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP_THEME') > -1) {
    tabBarData = themeModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP_EDIT_') > -1) {
    tabBarData = editModule().getData(type, params)
  } else if (type === ConstToolType.MAP_ANALYSIS) {
    tabBarData = analysisModule().getData(type, params)
  } else if (
    type === ConstToolType.PLOT_ANIMATION_START ||
    type === ConstToolType.PLOT_ANIMATION_NODE_CREATE ||
    type === ConstToolType.PLOT_ANIMATION_PLAY ||
    type === ConstToolType.PLOT_ANIMATION_GO_OBJECT_LIST ||
    type === ConstToolType.PLOT_ANIMATION_WAY
    // ||type === ConstToolType.PLOT_ANIMATION_XML_LIST
  ) {
    tabBarData = plotModule().getData(type, params)
  } else if (
    type === ConstToolType.MAP3D_TOOL_FLYLIST ||
    type === ConstToolType.MAP3D_TOOL_NEWFLY
  ) {
    tabBarData = await fly3DModule().getData(type, params)
  } else if (
    (typeof type === 'string' && type.indexOf('MAP3D_') > -1) ||
    type === ConstToolType.MAP3D_BOX_CLIPPING ||
    type === ConstToolType.MAP3D_BOX_CLIP
  ) {
    tabBarData = await tool3DModule().getData(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP_MORE') > -1) {
    tabBarData = MoreData.getMapMore(type, params)
  } else if (type === ConstToolType.MAP_PLOTTING_ANIMATION_ITEM) {
    tabBarData = getPlotAnimationData(type)
  } else if (type === ConstToolType.MAP_AR_AIASSISTANT) {
    tabBarData = AiAssistant.getAiAssistantData(type, params)
  } else {
    tabBarData = MapData.getMapData(type)
  }
  return tabBarData
}

/**
 * 获取菜单弹框数据
 * @param type
 * @param others {themeType}
 * @returns {Array}
 */
function getMenuDialogData(type, ...others) {
  let data = []
  switch (type) {
    case ConstToolType.STYLE_TRANSFER:
      data = toolModule().getMenuData(type)
      break
    case ConstToolType.MAP_STYLE:
    case ConstToolType.LINECOLOR_SET:
    case ConstToolType.POINTCOLOR_SET:
    case ConstToolType.REGIONBEFORECOLOR_SET:
    case ConstToolType.REGIONAFTERCOLOR_SET:
    case ConstToolType.REGIONBORDERCOLOR_SET:
      data = styleModule().getMenuData(type)
      break
    // case ConstToolType.MAP_THEME_PARAM:
    //   data = themeModule().getMenuData(type, ...others)
    //   break
  }
  if (data.length === 0 && type.indexOf('MAP_THEME_PARAM') >= 0) {
    data = themeModule().getMenuData(type, ...others)
  }
  return data
}

function getPlotAnimationData(type) {
  let data = [],
    buttons = []
  // if (type.indexOf('MAP3D_') === -1) return { data, buttons }
  switch (type) {
    case ConstToolType.MAP_PLOTTING_ANIMATION_ITEM:
      data = [
        {
          key: 'startFly',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
          //'开始飞行',
          action: () => {
            SMap.animationPlay()
          },
          size: 'large',
          image: require('../../../../../assets/mapEdit/icon_play.png'),
          selectedImage: require('../../../../../assets/mapEdit/icon_play.png'),
        },
        {
          key: 'stop',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_PAUSE,
          //'暂停',
          action: () => {
            SMap.animationPause()
          },
          size: 'large',
          image: require('../../../../../assets/mapEdit/icon_stop.png'),
          selectedImage: require('../../../../../assets/mapEdit/icon_stop.png'),
          // selectMode:"flash"
        },
      ]
      buttons = [ToolbarBtnType.END_ANIMATION]
      break
  }
  return { data, buttons }
}

export default {
  setParams,
  addParams,
  getParams,

  setData,
  addData,
  getData,

  getTabBarData,
  getMenuDialogData,
}
