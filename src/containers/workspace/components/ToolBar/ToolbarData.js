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
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language/index'

// let _params = {}

// 更新类中的数据
function setParams(params) {
  // _params = params
  CollectionData.setParams(params)
  StartData.setParams(params)
  ShareData.setParams(params)
  MoreData.setParams(params)
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
    tabBarData = getMap3DData(type, params)
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
  } else if (
    type === ConstToolType.MAP_THEME_PARAM ||
    type === ConstToolType.MAP_THEME_PARAM_GRAPH
  ) {
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

function getMap3DData(type, params) {
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
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
          //'开始飞行',
          action: () => {
            SScene.flyStart()
          },
          size: 'large',
          image: require('../../../../assets/mapEdit/icon_play.png'),
          selectedImage: require('../../../../assets/mapEdit/icon_play.png'),
        },
        {
          key: 'stop',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_PAUSE,
          //'暂停',
          action: () => {
            SScene.flyPause()
          },
          size: 'large',
          image: require('../../../../assets/mapEdit/icon_stop.png'),
          selectedImage: require('../../../../assets/mapEdit/icon_stop.png'),
          // selectMode:"flash"
        },
      ]
      buttons = [ToolbarBtnType.END_FLY]
      break
    case ConstToolType.MAP3D_TOOL_NEWFLY:
      data = [
        {
          key: 'startFly',
          title: getLanguage(global.language).Map_Main_Menu.FLY_ADD_STOPS,
          //'添加站点',
          action: () => {
            try {
              SScene.saveCurrentRoutStop().then(result => {
                if (result) {
                  Toast.show(getLanguage(global.language).Prompt.ADD_SUCCESS)
                  //'添加站点成功')
                }
              })
            } catch (error) {
              Toast.show(getLanguage(global.language).Prompt.ADD_FAILED)
              //Toast.show('添加站点失败')
            }
          },
          size: 'large',
          image: require('../../../../assets/map/Frenchgrey/scene_addstop_dark.png'),
          selectedImage: require('../../../../assets/map/Frenchgrey/scene_addstop_dark.png'),
        },
        {
          key: 'stop',
          title: getLanguage(global.language).Map_Main_Menu.FLY,
          //'飞行',
          action: () => {
            try {
              SScene.saveRoutStop()
            } catch (error) {
              Toast.show('请添加站点')
            }
          },
          size: 'large',
          image: require('../../../../assets/map/Frenchgrey/scene_play_dark.png'),
          selectedImage: require('../../../../assets/map/Frenchgrey/scene_play_dark.png'),
          // selectMode:"flash"
        },
        {
          key: 'pause',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_PAUSE,
          //'暂停',
          action: () => {
            try {
              SScene.pasueRoutStop()
            } catch (error) {
              Toast.show('暂停失败')
            }
          },
          size: 'large',
          image: require('../../../../assets/mapEdit/icon_stop.png'),
          selectedImage: require('../../../../assets/mapEdit/icon_stop.png'),
          // selectMode:"flash"
        },
        // {
        //   key: 'stop',
        //   title: '清除所有站点',
        //   action: () => {
        //     try {
        //       SScene.clearRoutStops()
        //     } catch (error) {
        //       console.warn(error)
        //     }
        //   },
        //   size: 'large',
        //   image: require('../../../../assets/mapEdit/icon_stop.png'),
        //   selectedImage: require('../../../../assets/mapEdit/icon_stop.png'),
        //   // selectMode:"flash"
        // },
      ]
      buttons = [ToolbarBtnType.END_ADD_FLY]
      break
    case ConstToolType.MAP3D_TOOL_LEVEL:
      buttons = [ToolbarBtnType.CANCEL]
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
      break
    case ConstToolType.MAP3D_SYMBOL_SELECT:
      data = [
        {
          key: 'cancel',
          title: getLanguage(global.language).Prompt.CANCEL,
          //'取消',
          action: () => {
            SScene.clearSelection()
            params.setAttributes && params.setAttributes({})
          },
          size: 'large',
          image: require('../../../../assets/mapTools/icon_cancel_1.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.CLEAR_ATTRIBUTE,
        ToolbarBtnType.SHOW_MAP3D_ATTRIBUTE,
      ]
      break
  }
  return { data, buttons }
}

export default {
  setParams,
  getTabBarData,
}
