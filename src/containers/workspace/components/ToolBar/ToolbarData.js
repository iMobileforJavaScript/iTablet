import { SScene } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../constants'
import ToolbarBtnType from './ToolbarBtnType'
import MapToolData from './MapToolData'
import MoreData from './MoreData'
import ShareData from './ShareData'
import StartData from './StartData'
import CollectionData from './CollectionData'
import EditData from './EditData'
import ThemeMenuData from './ThemeMenuData'

// let _params = {}

// 更新类中的数据
function setParams(params) {
  // _params = params
  CollectionData.setParams(params)
  StartData.setParams(params)
  ShareData.setParams(params)
}

function getTabBarData(type, params = {}) {
  let tabBarData = CollectionData.getCollectionData(type, params)

  if (
    type === ConstToolType.MAP_COLLECTION_POINT ||
    type === ConstToolType.MAP_COLLECTION_LINE ||
    type === ConstToolType.MAP_COLLECTION_REGION
  ) {
    tabBarData = CollectionData.getCollectionOperationData(type, params)
  } else if (typeof type === 'string' && type.indexOf('MAP_EDIT_') > -1) {
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
    tabBarData = ThemeMenuData.getThemeMapCreate(type, params)
  } else if (type === ConstToolType.MAP_THEME_PARAM) {
    tabBarData = ThemeMenuData.getThemeMapParam(type, params)
  } else if (type === ConstToolType.MAP_THEME_CREATE_BY_LAYER) {
    tabBarData = ThemeMenuData.getThemeMapCreateByLayer(type, params)
  } else if (type === ConstToolType.MAP_THEME_START_CREATE) {
    tabBarData = ThemeMenuData.getThemeMapStartCreate(type, params)
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

export default {
  setParams,
  getTabBarData,
}
