import { SMap, Action } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../constants'
import constants from '../../constants'
import ToolbarBtnType from './ToolbarBtnType'
import NavigationService from '../../../NavigationService'

/**
 * 获取编辑操作
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getEditData(type) {
  let data = [],
    buttons = []
  if (typeof type === 'string' && type.indexOf('MAP_EDIT_') === -1)
    return { data, buttons }
  switch (type) {
    case ConstToolType.MAP_EDIT_TAGGING_SETTING:
      data = [
        {
          title: '属性记录',
          data: [
            { title: '名称', action: name },
            { title: '备注', action: remark },
            // { title: '风格', action: remark },
            { title: 'http地址', action: address },
            // { title: '图片', action: address },
          ],
        },
      ]
      break
    case ConstToolType.MAP_EDIT_TAGGING:
      data = [
        {
          key: constants.POINT,
          title: constants.POINT,
          action: point,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_point_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_black.png'),
        },
        {
          key: constants.WORDS,
          title: constants.WORDS,
          size: 'large',
          action: words,
          image: require('../../../../assets/mapTools/icon_words_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_words_black.png'),
        },
        {
          key: constants.POINTLINE,
          title: constants.POINTLINE,
          size: 'large',
          action: pointline,
          image: require('../../../../assets/mapTools/icon_point_line_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_line_black.png'),
        },
        {
          key: constants.FREELINE,
          title: constants.FREELINE,
          size: 'large',
          action: freeline,
          image: require('../../../../assets/mapTools/icon_free_line_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_line_black.png'),
        },
        {
          key: constants.POINTCOVER,
          title: constants.POINTCOVER,
          size: 'large',
          action: pointcover,
          image: require('../../../../assets/mapTools/icon_point_cover_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_cover_black.png'),
        },
        {
          key: constants.FREECOVER,
          title: constants.FREECOVER,
          size: 'large',
          action: freecover,
          image: require('../../../../assets/mapTools/icon_free_cover_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_cover_black.png'),
        },
        // {
        //   key: constants.COMMONTRACK,
        //   title: constants.COMMONTRACK,
        //   size: 'large',
        //   action: addNode,
        //   image: require('../../../../assets/mapTools/icon_common_track.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_common_track.png'),
        // },
        // {
        //   key: constants.ROADTRACK,
        //   title: constants.ROADTRACK,
        //   size: 'large',
        //   action: eraseRegion,
        //   image: require('../../../../assets/mapTools/icon_road_track.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_road_track.png'),
        // },
        // {
        //   key: constants.EQUALTRACK,
        //   title: constants.EQUALTRACK,
        //   size: 'large',
        //   action: splitRegion,
        //   image: require('../../../../assets/mapTools/icon_equal_track.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_equal_track.png'),
        // },
        // {
        //   key: constants.TIMETRACK,
        //   title: constants.TIMETRACK,
        //   size: 'large',
        //   action: merge,
        //   image: require('../../../../assets/mapTools/icon_time_track.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_time_track.png'),
        // },
        // {
        //   key: constants.INTELLIGENCETRACK,
        //   title: constants.INTELLIGENCETRACK,
        //   size: 'large',
        //   action: drawRegionEraseRegion,
        //   image: require('../../../../assets/mapTools/icon_intelligence_track.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_intelligence_track.png'),
        // },
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
          image: require('../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: constants.UNDO,
          action: () => undo(type),
          size: 'large',
          image: require('../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: 'redo',
          title: '重做',
          action: () => redo(type),
          size: 'large',
          image: require('../../../../assets/mapTools/icon_recover_black.png'),
        },
        // { key: constants.REDO, action: _redo },
        {
          key: constants.MOVE,
          title: constants.MOVE,
          action: move,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_move_black.png'),
        },
        // {
        //   key: constants.SUBMIT,
        //   title: constants.SUBMIT,
        //   action: mapSubmit,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_submit.png'),
        // },
      ]
      break
    case ConstToolType.MAP_EDIT_LINE:
      data = [
        {
          key: constants.MOVE,
          title: constants.MOVE,
          action: move,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: constants.DELETE,
          action: remove,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_delete_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: constants.UNDO,
          action: undo,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_undo_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.REDO,
          title: constants.REDO,
          action: redo,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_recover_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.EDIT_NODE,
          title: constants.EDIT_NODE,
          action: editNode,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_edit_node_black.png'),
        },
        {
          key: constants.DELETE_NODE,
          title: constants.DELETE_NODE,
          action: deleteNode,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_delete_node_black.png'),
        },
        {
          key: constants.ADD_NODE,
          title: constants.ADD_NODE,
          action: addNode,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_add_node_black.png'),
        },
        // {
        //   key: constants.SUBMIT,
        //   title: constants.SUBMIT,
        //   action: mapSubmit,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_submit.png'),
        // },
      ]
      break
    case ConstToolType.MAP_EDIT_REGION:
      data = [
        {
          key: constants.MOVE,
          title: constants.MOVE,
          action: move,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: constants.DELETE,
          size: 'large',
          action: remove,
          image: require('../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: constants.UNDO,
          size: 'large',
          action: undo,
          image: require('../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: constants.REDO,
          title: constants.REDO,
          size: 'large',
          action: redo,
          image: require('../../../../assets/mapTools/icon_recover_black.png'),
        },
        {
          key: constants.EDIT_NODE,
          title: constants.EDIT_NODE,
          size: 'large',
          action: editNode,
          image: require('../../../../assets/mapTools/icon_edit_node_black.png'),
        },
        {
          key: constants.DELETE_NODE,
          title: constants.DELETE_NODE,
          size: 'large',
          action: deleteNode,
          image: require('../../../../assets/mapTools/icon_delete_node_black.png'),
        },
        {
          key: constants.ADD_NODE,
          title: constants.ADD_NODE,
          size: 'large',
          action: addNode,
          image: require('../../../../assets/mapTools/icon_add_node_black.png'),
        },
        {
          key: constants.ERASE_REGION,
          title: constants.ERASE_REGION,
          size: 'large',
          action: eraseRegion,
          image: require('../../../../assets/mapTools/icon_erasure_black.png'),
        },
        {
          key: constants.SPLIT_REGION,
          title: constants.SPLIT_REGION,
          size: 'large',
          action: splitRegion,
          image: require('../../../../assets/mapTools/icon_cut_black.png'),
        },
        {
          key: constants.MERGE,
          title: constants.MERGE,
          size: 'large',
          action: merge,
          image: require('../../../../assets/mapTools/icon_merge_black.png'),
        },
        {
          key: constants.DRAWREGION_ERASE_REGION,
          title: constants.DRAWREGION_ERASE_REGION,
          size: 'large',
          action: drawRegionEraseRegion,
          image: require('../../../../assets/mapTools/icon_drawErasure_black.png'),
        },
        {
          key: constants.DRAWREGION_HOLLOW_REGION,
          title: constants.DRAWREGION_HOLLOW_REGION,
          size: 'large',
          action: drawRegionHollowRegion,
          image: require('../../../../assets/mapTools/icon_drawingisland_black.png'),
        },
        {
          key: constants.FILL_HOLLOW_REGION,
          title: constants.FILL_HOLLOW_REGION,
          size: 'large',
          action: fillHollowRegion,
          image: require('../../../../assets/mapTools/icon_fillingisland_black.png'),
        },
        {
          key: constants.PATCH_HOLLOW_REGION,
          title: constants.PATCH_HOLLOW_REGION,
          size: 'large',
          action: patchHollowRegion,
          image: require('../../../../assets/mapTools/icon_addisland_black.png'),
        },
        // {
        //   key: constants.SUBMIT,
        //   title: constants.SUBMIT,
        //   size: 'large',
        //   action: mapSubmit,
        //   image: require('../../../../assets/mapTools/icon_submit.png'),
        // },
      ]
      break
  }
  if (type === ConstToolType.MAP_EDIT_DEFAULT) {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.COMMIT,
    ]
  } else if (type === ConstToolType.MAP_EDIT_TAGGING) {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.COMMIT,
    ]
  } else if (type === ConstToolType.MAP_EDIT_TAGGING_SETTING) {
    buttons = [
      ToolbarBtnType.TAGGING_BACK,
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

/*******************************************操作分割线*********************************************/

// function mapSubmit() {
//   let result = SMap.submit()
//   SMap.setAction(Action.SELECT)
//   return result
// }

function name() {
  return NavigationService.navigate('InputPage', {
    headerTitle: '名称',
    cb: async value => {
      if (value !== '') {
        (async function() {
          await SMap.addRecordset(GLOBAL.value, 'name', value)
        }.bind(this)())
      }
      NavigationService.goBack()
    },
  })
}

function remark() {
  return NavigationService.navigate('InputPage', {
    headerTitle: '名称',
    cb: async value => {
      if (value !== '') {
        (async function() {
          await SMap.addRecordset(GLOBAL.value, 'remark', value)
        }.bind(this)())
      }
      NavigationService.goBack()
    },
  })
}

function address() {
  return NavigationService.navigate('InputPage', {
    headerTitle: '名称',
    cb: async value => {
      if (value !== '') {
        (async function() {
          await SMap.addRecordset(GLOBAL.value, 'address', value)
        }.bind(this)())
      }
      NavigationService.goBack()
    },
  })
}

function point() {
  return SMap.setAction(Action.CREATEPOINT)
}

function words() {
  (async function() {
    let x = await SMap.getGestureDetector()
    if (x !== null) {
      NavigationService.navigate('InputPage', {
        headerTitle: '标注名称',
        cb: async value => {
          if (value !== '') {
            await SMap.addTextRecordset(GLOBAL.value, value, x.x, x.y)
          }
          NavigationService.goBack()
        },
      })
    }
  }.bind(this)())
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

function undo(type) {
  // return SCollector.undo(type)
  return SMap.undo(type)
}

function redo(type) {
  // return SCollector.redo(type)
  return SMap.redo(type)
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

export default {
  getEditData,
}
