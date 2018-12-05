import {
  SMap,
  Action,
  SCollector,
  SMCollectorType,
  SScene,
  SThemeCartography,
} from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../constants'
import { Toast } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import constants from '../../constants'
import ToolbarBtnType from './ToolbarBtnType'
import MapToolData from './MapToolData'
import MoreData from './MoreData'
import ShareData from './ShareData'

let _params = {}

function getTabBarData(type, params = {}) {
  _params = params
  let tabBarData = { data: [], buttons: [] }
  let isCollection = false
  Object.keys(SMCollectorType).forEach(key => {
    if (SMCollectorType[key] === type) {
      isCollection = true
    }
  })
  if (isCollection) {
    tabBarData = getCollectionData(type)
  } else if (type.indexOf('MAP_EDIT_') > -1) {
    tabBarData = getEditData(type)
  } else if (type.indexOf('MAP3D_') > -1) {
    tabBarData = getMap3DData(type)
  } else if (type.indexOf('MAP_MORE') > -1) {
    tabBarData = MoreData.getMapMore(type, params)
  } else if (type === ConstToolType.MAP_START) {
    tabBarData = getStart(type)
  } else if (type.indexOf(ConstToolType.MAP_TOOL) > -1) {
    tabBarData = MapToolData.getMapTool(type, params)
  } else if (type === ConstToolType.MAP_SHARE) {
    tabBarData = ShareData.getShareData(type, params)
  } else if (type === ConstToolType.MAP_THEME_START) {
    tabBarData = getThemeStart(type)
  } else if (type === ConstToolType.MAP_THEME_CREATE) {
    tabBarData = getThemeMapCreate(type)
  }
  return {
    data: tabBarData.data,
    buttons: tabBarData.buttons,
  }
}

/**
 * 获取编辑操作
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getEditData(type) {
  let data = [],
    buttons = []
  if (type.indexOf('MAP_EDIT_') === -1) return { data, buttons }
  switch (type) {
    case ConstToolType.MAP_EDIT_TAGGING:
      data = [
        {
          key: constants.POINT,
          title: constants.POINT,
          action: point,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_point.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point.png'),
        },
        {
          key: constants.WORDS,
          title: constants.WORDS,
          size: 'large',
          action: words,
          image: require('../../../../assets/mapTools/icon_words.png'),
          selectedImage: require('../../../../assets/mapTools/icon_words.png'),
        },
        {
          key: constants.POINTLINE,
          title: constants.POINTLINE,
          size: 'large',
          action: pointline,
          image: require('../../../../assets/mapTools/icon_point_line.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_line.png'),
        },
        {
          key: constants.FREELINE,
          title: constants.FREELINE,
          size: 'large',
          action: freeline,
          image: require('../../../../assets/mapTools/icon_free_line.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
        },
        {
          key: constants.POINTCOVER,
          title: constants.POINTCOVER,
          size: 'large',
          action: pointcover,
          image: require('../../../../assets/mapTools/icon_point_cover.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_cover.png'),
        },
        {
          key: constants.FREECOVER,
          title: constants.FREECOVER,
          size: 'large',
          action: freecover,
          image: require('../../../../assets/mapTools/icon_free_cover.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_cover.png'),
        },
        {
          key: constants.COMMONTRACK,
          title: constants.COMMONTRACK,
          size: 'large',
          action: addNode,
          image: require('../../../../assets/mapTools/icon_common_track.png'),
          selectedImage: require('../../../../assets/mapTools/icon_common_track.png'),
        },
        {
          key: constants.ROADTRACK,
          title: constants.ROADTRACK,
          size: 'large',
          action: eraseRegion,
          image: require('../../../../assets/mapTools/icon_road_track.png'),
          selectedImage: require('../../../../assets/mapTools/icon_road_track.png'),
        },
        {
          key: constants.EQUALTRACK,
          title: constants.EQUALTRACK,
          size: 'large',
          action: splitRegion,
          image: require('../../../../assets/mapTools/icon_equal_track.png'),
          selectedImage: require('../../../../assets/mapTools/icon_equal_track.png'),
        },
        {
          key: constants.TIMETRACK,
          title: constants.TIMETRACK,
          size: 'large',
          action: merge,
          image: require('../../../../assets/mapTools/icon_time_track.png'),
          selectedImage: require('../../../../assets/mapTools/icon_time_track.png'),
        },
        {
          key: constants.INTELLIGENCETRACK,
          title: constants.INTELLIGENCETRACK,
          size: 'large',
          action: drawRegionEraseRegion,
          image: require('../../../../assets/mapTools/icon_intelligence_track.png'),
          selectedImage: require('../../../../assets/mapTools/icon_intelligence_track.png'),
        },
      ]
      break
    case ConstToolType.MAP_EDIT_POINT:
      data = [
        // { key: '选择', action: select },
        {
          key: constants.DELETE,
          title: constants.DELETE,
          action: remove,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_delete.png'),
          selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'),
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: constants.UNDO,
          action: () => undo(type),
          size: 'large',
          image: require('../../../../assets/mapTools/icon_undo.png'),
          selectedImage: require('../../../../assets/mapTools/icon_undo_selected.png'),
          selectMode: 'flash',
        },
        {
          key: 'redo',
          title: '重做',
          action: () => redo(type),
          size: 'large',
          image: require('../../../../assets/function/icon_function_base_map.png'),
        },
        // { key: constants.REDO, action: _redo },
        {
          key: constants.MOVE,
          title: constants.MOVE,
          action: move,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_move.png'),
          selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
        },
        {
          key: constants.SUBMIT,
          title: constants.SUBMIT,
          action: mapSubmit,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_submit.png'),
          selectedImage: require('../../../../assets/mapTools/icon_submit_select.png'),
          selectMode: 'flash',
        },
      ]
      break
    case ConstToolType.MAP_EDIT_LINE:
      data = [
        {
          key: constants.MOVE,
          title: constants.MOVE,
          action: move,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_move.png'),
          selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
        },
        {
          key: constants.DELETE,
          title: constants.DELETE,
          action: remove,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_delete.png'),
          selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'),
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: constants.UNDO,
          action: undo,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_undo.png'),
          selectedImage: require('../../../../assets/mapTools/icon_undo_selected.png'),
          selectMode: 'flash',
        },
        {
          key: constants.REDO,
          title: constants.REDO,
          action: redo,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_redo.png'),
          selectedImage: require('../../../../assets/mapTools/icon_redo_selected.png'),
          selectMode: 'flash',
        },
        {
          key: constants.EDIT_NODE,
          title: constants.EDIT_NODE,
          action: editNode,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_edit_node.png'),
          selectedImage: require('../../../../assets/mapTools/icon_edit_node_selected.png'),
        },
        {
          key: constants.DELETE_NODE,
          title: constants.DELETE_NODE,
          action: deleteNode,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_delete_node.png'),
          selectedImage: require('../../../../assets/mapTools/icon_delete_node_selected.png'),
        },
        {
          key: constants.ADD_NODE,
          title: constants.ADD_NODE,
          action: addNode,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_add_node.png'),
          selectedImage: require('../../../../assets/mapTools/icon_add_node_seleted.png'),
        },
        {
          key: constants.SUBMIT,
          title: constants.SUBMIT,
          action: mapSubmit,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_submit.png'),
          selectedImage: require('../../../../assets/mapTools/icon_submit_select.png'),
          selectMode: 'flash',
        },
      ]
      break
    case ConstToolType.MAP_EDIT_REGION:
      data = [
        {
          key: constants.MOVE,
          title: constants.MOVE,
          action: move,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_move.png'),
          selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
        },
        {
          key: constants.DELETE,
          title: constants.DELETE,
          size: 'large',
          action: remove,
          image: require('../../../../assets/mapTools/icon_delete.png'),
          selectedImage: require('../../../../assets/mapTools/icon_delete_selected.png'),
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: constants.UNDO,
          size: 'large',
          action: undo,
          image: require('../../../../assets/mapTools/icon_undo.png'),
          selectedImage: require('../../../../assets/mapTools/icon_undo_selected.png'),
          selectMode: 'flash',
        },
        {
          key: constants.REDO,
          title: constants.REDO,
          size: 'large',
          action: redo,
          image: require('../../../../assets/mapTools/icon_redo.png'),
          selectedImage: require('../../../../assets/mapTools/icon_redo_selected.png'),
          selectMode: 'flash',
        },
        {
          key: constants.EDIT_NODE,
          title: constants.EDIT_NODE,
          size: 'large',
          action: editNode,
          image: require('../../../../assets/mapTools/icon_edit_node.png'),
          selectedImage: require('../../../../assets/mapTools/icon_edit_node_selected.png'),
        },
        {
          key: constants.DELETE_NODE,
          title: constants.DELETE_NODE,
          size: 'large',
          action: deleteNode,
          image: require('../../../../assets/mapTools/icon_delete_node.png'),
          selectedImage: require('../../../../assets/mapTools/icon_delete_node_selected.png'),
        },
        {
          key: constants.ADD_NODE,
          title: constants.ADD_NODE,
          size: 'large',
          action: addNode,
          image: require('../../../../assets/mapTools/icon_add_node.png'),
          selectedImage: require('../../../../assets/mapTools/icon_add_node_seleted.png'),
        },
        {
          key: constants.ERASE_REGION,
          title: constants.ERASE_REGION,
          size: 'large',
          action: eraseRegion,
          image: require('../../../../assets/mapTools/icon_submit.png'),
          selectedImage: require('../../../../assets/mapTools/icon_submit_select.png'),
        },
        {
          key: constants.SPLIT_REGION,
          title: constants.SPLIT_REGION,
          size: 'large',
          action: splitRegion,
          image: require('../../../../assets/mapTools/icon_cut.png'),
          selectedImage: require('../../../../assets/mapTools/icon_cut_selected.png'),
        },
        {
          key: constants.MERGE,
          title: constants.MERGE,
          size: 'large',
          action: merge,
          image: require('../../../../assets/mapTools/icon_merge.png'),
          selectedImage: require('../../../../assets/mapTools/icon_merge_selected.png'),
        },
        {
          key: constants.DRAWREGION_ERASE_REGION,
          title: constants.DRAWREGION_ERASE_REGION,
          size: 'large',
          action: drawRegionEraseRegion,
          image: require('../../../../assets/mapTools/icon_erasure.png'),
          selectedImage: require('../../../../assets/mapTools/icon_erasure_selected.png'),
        },
        {
          key: constants.DRAWREGION_HOLLOW_REGION,
          title: constants.DRAWREGION_HOLLOW_REGION,
          size: 'large',
          action: drawRegionHollowRegion,
          image: require('../../../../assets/mapTools/icon_drawingisland.png'),
          selectedImage: require('../../../../assets/mapTools/icon_drawingisland_selected.png'),
        },
        {
          key: constants.FILL_HOLLOW_REGION,
          title: constants.FILL_HOLLOW_REGION,
          size: 'large',
          action: fillHollowRegion,
          image: require('../../../../assets/mapTools/icon_fillingisland.png'),
          selectedImage: require('../../../../assets/mapTools/icon_fillingisland_selected.png'),
        },
        {
          key: constants.PATCH_HOLLOW_REGION,
          title: constants.PATCH_HOLLOW_REGION,
          size: 'large',
          action: patchHollowRegion,
          image: require('../../../../assets/mapTools/icon_addisland.png'),
          selectedImage: require('../../../../assets/mapTools/icon_addisland_selected.png'),
        },
        {
          key: constants.SUBMIT,
          title: constants.SUBMIT,
          size: 'large',
          action: mapSubmit,
          image: require('../../../../assets/mapTools/icon_submit.png'),
          selectedImage: require('../../../../assets/mapTools/icon_submit_select.png'),
          selectMode: 'flash',
        },
      ]
      break
  }
  if (type === ConstToolType.MAP_EDIT_DEFAULT) {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.COMMIT,
    ]
  } else {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.FLEX,
      ToolbarBtnType.COMMIT,
    ]
  }
  return { data, buttons }
}

/**
 * 获取采集操作
 * @param type
 * @returns {*}
 */
function getCollectionData(type) {
  let data = [],
    buttons = []
  let isCollection = false
  Object.keys(SMCollectorType).forEach(key => {
    if (SMCollectorType[key] === type) {
      isCollection = true
    }
  })

  // 判断是否是采集功能
  if (!isCollection) return { collectionData: data, collectionButtons: buttons }

  if (
    type === SMCollectorType.POINT_GPS ||
    type === SMCollectorType.LINE_GPS_POINT ||
    type === SMCollectorType.REGION_GPS_POINT
  ) {
    data.push({
      key: 'addGPSPoint',
      title: '打点',
      action: () => SCollector.addGPSPoint(type),
      size: 'large',
      image: require('../../../../assets/function/icon_function_base_map.png'),
    })
  }
  if (
    type === SMCollectorType.LINE_GPS_PATH ||
    type === SMCollectorType.REGION_GPS_PATH
  ) {
    data.push({
      key: 'start',
      title: '开始',
      action: () => SCollector.startCollect(type),
      size: 'large',
      image: require('../../../../assets/mapTools/icon_play.png'),
    })
    data.push({
      key: 'stop',
      title: '停止',
      action: () => {},
      size: 'large',
      image: require('../../../../assets/mapTools/icon_pause.png'),
      selectedImage: require('../../../../assets/mapTools/icon_pause_selected.png'),
    })
  }
  data.push({
    key: constants.UNDO,
    title: constants.UNDO,
    action: () => undo(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_undo.png'),
    selectedImage: require('../../../../assets/mapTools/icon_undo_selected.png'),
  })
  data.push({
    key: constants.REDO,
    title: constants.REDO,
    action: () => redo(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_redo.png'),
    selectedImage: require('../../../../assets/mapTools/icon_redo_selected.png'),
  })
  data.push({
    key: constants.CANCEL,
    title: constants.CANCEL,
    action: () => cancel(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_cancel.png'),
    selectedImage: require('../../../../assets/mapTools/icon_cancel_selected.png'),
  })
  data.push({
    key: constants.SUBMIT,
    title: constants.SUBMIT,
    action: () => collectionSubmit(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_submit.png'),
    selectedImage: require('../../../../assets/mapTools/icon_submit_select.png'),
  })
  buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.CHANGE_COLLECTION,
    ToolbarBtnType.MAP_SYMBOL,
  ]

  return { data, buttons }
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
 * 创建专题图
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
      // action: openMap,
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
      // action: showHistory,
      image: require('../../../../assets/mapTools/icon_function_theme_create_range_style.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_range_style.png'),
    },
    {
      //自定义风格
      key: constants.THEME_CUSTOME_STYLE,
      title: constants.THEME_CUSTOME_STYLE,
      size: 'large',
      // action: changeBaseLayer,
      image: require('../../../../assets/mapTools/icon_function_theme_create_custom_style.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_custom_style.png'),
    },
    {
      //自定义标签
      key: constants.THEME_CUSTOME_LABEL,
      title: constants.THEME_CUSTOME_LABEL,
      size: 'large',
      // action: changeBaseLayer,
      image: require('../../../../assets/mapTools/icon_function_theme_create_custom_label.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_custom_label.png'),
    },
    {
      //统一标签
      key: constants.THEME_UNIFY_LABEL,
      title: constants.THEME_UNIFY_LABEL,
      size: 'large',
      // action: changeBaseLayer,
      image: require('../../../../assets/mapTools/icon_function_theme_create_unify_label.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_label.png'),
    },
    {
      //单值标签
      key: constants.THEME_UNIQUE_LABEL,
      title: constants.THEME_UNIQUE_LABEL,
      size: 'large',
      // action: changeBaseLayer,
      image: require('../../../../assets/mapTools/icon_function_theme_create_unique_label.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unique_label.png'),
    },
    {
      //分段标签
      key: constants.THEME_RANGE_LABEL,
      title: constants.THEME_RANGE_LABEL,
      size: 'large',
      // action: changeBaseLayer,
      image: require('../../../../assets/mapTools/icon_function_theme_create_range_label.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_range_label.png'),
    },
  ]
  return { data, buttons }
}

/**
 * 专题图开始操作
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getThemeStart(type) {
  let data = [],
    buttons = []
  if (type !== ConstToolType.MAP_THEME_START) return { data, buttons }
  data = [
    {
      key: constants.OPEN,
      title: constants.OPEN,
      action: add,
      size: 'large',
      image: require('../../../../assets/mapTools/icon_point.png'),
      selectedImage: require('../../../../assets/mapTools/icon_point.png'),
    },
    {
      key: constants.CREATE,
      title: constants.CREATE,
      size: 'large',
      action: createMap,
      image: require('../../../../assets/mapTools/icon_words.png'),
      selectedImage: require('../../../../assets/mapTools/icon_words.png'),
    },
    {
      key: constants.HISTORY,
      title: constants.HISTORY,
      size: 'large',
      action: showHistory,
      image: require('../../../../assets/mapTools/icon_point_line.png'),
      selectedImage: require('../../../../assets/mapTools/icon_point_line.png'),
    },
    {
      key: constants.BASE_MAP,
      title: constants.BASE_MAP,
      size: 'large',
      action: changeBaseLayer,
      image: require('../../../../assets/mapTools/icon_free_line.png'),
      selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
    },
  ]
  return { data, buttons }
}

/**
 * 获取开始操作
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getStart(type) {
  let data = [],
    buttons = []
  if (type !== ConstToolType.MAP_START) return { data, buttons }
  data = [
    {
      key: constants.WORKSPACE,
      title: constants.WORKSPACE,
      action: openWorkspace,
      size: 'large',
      image: require('../../../../assets/mapTools/icon_point.png'),
      selectedImage: require('../../../../assets/mapTools/icon_point.png'),
    },
    {
      key: constants.OPEN,
      title: constants.OPEN,
      action: openMap,
      size: 'large',
      image: require('../../../../assets/mapTools/icon_point.png'),
      selectedImage: require('../../../../assets/mapTools/icon_point.png'),
    },
    {
      key: constants.CREATE,
      title: constants.CREATE,
      size: 'large',
      action: createMap,
      image: require('../../../../assets/mapTools/icon_words.png'),
      selectedImage: require('../../../../assets/mapTools/icon_words.png'),
    },
    {
      key: constants.HISTORY,
      title: constants.HISTORY,
      size: 'large',
      action: showHistory,
      image: require('../../../../assets/mapTools/icon_point_line.png'),
      selectedImage: require('../../../../assets/mapTools/icon_point_line.png'),
    },
    {
      key: constants.BASE_MAP,
      title: constants.BASE_MAP,
      size: 'large',
      action: changeBaseLayer,
      image: require('../../../../assets/mapTools/icon_free_line.png'),
      selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
    },
    {
      key: constants.ADD,
      title: constants.ADD,
      size: 'large',
      action: add,
      image: require('../../../../assets/mapTools/icon_free_line.png'),
      selectedImage: require('../../../../assets/mapTools/icon_free_line.png'),
    },
  ]
  return { data, buttons }
}

/*******************************************操作分割线*********************************************/

function mapSubmit() {
  let result = SMap.submit()
  SMap.setAction(Action.SELECT)
  return result
}

function collectionSubmit(type) {
  return SCollector.submit(type)
}

function point() {
  return SMap.setAction(Action.CREATEPOINT)
}

function words() {
  return SMap.setAction(Action.CREATEPLOT)
}

function pointline() {
  return SMap.setAction(Action.CREATEPOLYLINE)
}

function freeline() {
  return SMap.setAction(Action.DRAWLINE)
}

function pointcover() {
  return SMap.setAction(Action.CREATEPOLYGON)
}

function freecover() {
  return SMap.setAction(Action.DRAWPLOYGON)
}

function move() {
  return SMap.setAction(Action.MOVE_GEOMETRY)
}

function cancel(type) {
  return SCollector.cancel(type)
}

function undo(type) {
  return SCollector.undo(type)
}

function redo(type) {
  return SCollector.redo(type)
}

function remove() {
  // TODO remove
  GLOBAL.removeObjectDialog && GLOBAL.removeObjectDialog.setDialogVisible(true)
}

function addNode() {
  return SMap.setAction(Action.VERTEXADD)
}

function editNode() {
  return SMap.setAction(Action.VERTEXEDIT)
}

function deleteNode() {
  return SMap.setAction(Action.VERTEXDELETE)
}

/** 切割面 **/
function splitRegion() {
  return SMap.setAction(Action.SPLIT_BY_LINE)
}

/** 合并面 **/
function merge() {
  return SMap.setAction(Action.UNION_REGION)
}

/** 擦除面 **/
function eraseRegion() {
  return SMap.setAction(Action.ERASE_REGION)
}

/** 手绘擦除面 **/
function drawRegionEraseRegion() {
  return SMap.setAction(Action.DRAWREGION_ERASE_REGION)
}

/** 生成岛洞 **/
// function drawHollowRegion() {
//   return SMap.setAction(Action.DRAW_HOLLOW_REGION)
// }

/** 手绘岛洞 **/
function drawRegionHollowRegion() {
  return SMap.setAction(Action.DRAWREGION_HOLLOW_REGION)
}

/** 填充岛洞 **/
function fillHollowRegion() {
  return SMap.setAction(Action.FILL_HOLLOW_REGION)
}

/** 补充岛洞 **/
function patchHollowRegion() {
  return SMap.setAction(Action.PATCH_HOLLOW_REGION)
}

/** 切换工作空间 **/
function openWorkspace() {
  // return SMap.setAction(Action.PATCH_HOLLOW_REGION)
  NavigationService.navigate('WorkspaceFlieList', {
    type: 'WORKSPACE',
    title: '选择工作空间',
    cb: path => {
      SMap.closeWorkspace().then(async () => {
        try {
          _params.setContainerLoading &&
            _params.setContainerLoading(true, '正在打开地图')
          let data = { server: path }
          let result = await SMap.openWorkspace(data)
          Toast.show(result ? '已为您切换工作空间' : '切换工作空间失败')
          NavigationService.goBack()
          _params.setContainerLoading && _params.setContainerLoading(false)
        } catch (error) {
          Toast.show('打开失败')
          _params.setContainerLoading && _params.setContainerLoading(false)
        }
      })
    },
  })
}

/** 打开地图 **/
function openMap() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  SMap.getMaps().then(list => {
    _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
      containerType: 'list',
      height: ConstToolType.HEIGHT[3],
      data: [
        {
          title: '地图',
          data: list,
        },
      ],
    })
  })
}

/** 新建地图 **/
function createMap() {
  // return SMap.setAction(Action.PATCH_HOLLOW_REGION)
}

/** 历史 **/
function showHistory() {
  // return SMap.setAction(Action.PATCH_HOLLOW_REGION)
}

/** 切换底图 **/
function changeBaseLayer() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  switch (_params.type) {
    case 'MAP_3D':
      _params.setToolbarVisible(true, ConstToolType.MAP3D_BASE, {
        containerType: 'list',
      })
      break

    default:
      _params.setToolbarVisible(true, ConstToolType.MAP_BASE, {
        containerType: 'list',
        height: ConstToolType.HEIGHT[3],
      })
      break
  }
}

/** 添加 **/
function add() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  switch (_params.type) {
    case 'MAP_3D':
      _params.setToolbarVisible(true, ConstToolType.MAP3D_ADD_LAYER, {
        containerType: 'list',
        isFullScreen: true,
        height: ConstToolType.HEIGHT[3],
      })
      break

    default:
      _params.setToolbarVisible(true, ConstToolType.MAP_ADD_LAYER, {
        containerType: 'list',
        isFullScreen: true,
        height: ConstToolType.HEIGHT[2],
      })
      break
  }
}

/** 新建单值风格专题图 **/
function createThemeUniqueMap() {
  let Params = {
    DatasourceAlias: 'Countries',
    DatasetName: 'Countries',
    UniqueExpression: 'Country',
    ColorGradientType: 'GREEANWHITE',
  }
  return SThemeCartography.createThemeUniqueMap(Params)
}

export default {
  getTabBarData,
}
