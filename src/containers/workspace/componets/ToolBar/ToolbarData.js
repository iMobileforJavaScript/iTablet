import {
  SMap,
  Action,
  SCollector,
  SMCollectorType,
  SScene,
} from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../constants'
import constants from '../../constants'

function getTabBarData(type) {
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
  }
  return {
    data: tabBarData.data,
    buttons: tabBarData.buttons,
  }
}

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
  buttons = ['cancel', 'flex', 'commit']
  return { data, buttons }
}

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
      image: require('../../../../assets/function/icon_function_base_map.png'),
    })
    data.push({
      key: 'stop',
      title: '停止',
      action: () => {},
      size: 'large',
      image: require('../../../../assets/function/icon_function_base_map.png'),
    })
  }
  data.push({
    key: 'undo',
    title: '撤销',
    action: () => undo(type),
    size: 'large',
    image: require('../../../../assets/function/icon_function_base_map.png'),
  })
  data.push({
    key: 'redo',
    title: '重做',
    action: () => redo(type),
    size: 'large',
    image: require('../../../../assets/function/icon_function_base_map.png'),
  })
  data.push({
    key: 'cancel',
    title: '取消',
    action: () => cancel(type),
    size: 'large',
    image: require('../../../../assets/function/icon_function_base_map.png'),
  })
  data.push({
    key: 'submit',
    title: '提交',
    action: () => collectionSubmit(type),
    size: 'large',
    image: require('../../../../assets/function/icon_function_base_map.png'),
  })
  buttons = ['cancel', 'flex', 'placeholder']

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
      buttons = ['closeAnalyst', 'clear']
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
      buttons = ['closeAnalyst', 'clear']
      break
    case ConstToolType.MAP3D_TOOL_HEIGHTMEASURE:
      buttons = ['cancel', 'flex']
      break
    case ConstToolType.MAP3D_TOOL_SELECTION:
      buttons = ['cancel', 'flex']
      break
    case ConstToolType.MAP3D_TOOL_BOXTAILOR:
      buttons = ['cancel', 'flex']
      break
    case ConstToolType.MAP3D_TOOL_PSTAILOR:
      buttons = ['cancel', 'flex']
      break
    case ConstToolType.MAP3D_TOOL_CROSSTAILOR:
      buttons = ['cancel', 'flex']
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
          image: require('../../../../assets/mapTools/icon_move.png'),
          selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
        },
        {
          key: 'stopOrstart',
          title: '播放/暂停',
          action: () => {
            SScene.flyPauseOrStart()
          },
          size: 'large',
          image: require('../../../../assets/mapTools/icon_move.png'),
          selectedImage: require('../../../../assets/mapTools/icon_move_selected.png'),
        },
        // {
        //   key: 'endfly',
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
      buttons = ['endfly', 'flex']
      break
    case ConstToolType.MAP3D_TOOL_LEVEL:
      buttons = ['cancel', 'flex']
      break
    case ConstToolType.MAP3D_SYMBOL_POINT:
      buttons = ['closesymbol', 'back', 'save']
      break
    case ConstToolType.MAP3D_SYMBOL_POINTLINE:
      buttons = ['closesymbol', 'back', 'save']
      break
    case ConstToolType.MAP3D_SYMBOL_POINTSURFACE:
      buttons = ['closesymbol', 'back', 'save']
      break
    case ConstToolType.MAP3D_SYMBOL_TEXT:
      buttons = ['closesymbol', 'back', 'save']
      break
  }
  return { data, buttons }
}

async function mapSubmit() {
  let result = SMap.submit()
  await SMap.setAction(Action.SELECT)
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
  // return SCollector.redo(type)
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

export default {
  getTabBarData,
}
