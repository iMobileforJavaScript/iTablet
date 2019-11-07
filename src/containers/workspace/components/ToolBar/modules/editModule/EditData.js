import { ConstToolType } from '../../../../../../constants'
import constants from '../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getLanguage } from '../../../../../../language'
import EditAction from './EditAction'

/**
 * 获取编辑操作
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getData(type) {
  let data = [],
    buttons = []
  if (typeof type === 'string' && type.indexOf('MAP_EDIT_') === -1)
    return { data, buttons }
  switch (type) {
    case ConstToolType.MAP_EDIT_POINT:
      data = [
        // { key: '选择', action: select },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          //constants.DELETE,
          action: EditAction.remove,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          //constants.UNDO,
          action: () => EditAction.undo(type),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: 'redo',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          //'重做',
          action: () => EditAction.redo(type),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
        // { key: constants.REDO, action: _redo },
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: EditAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
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
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: EditAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          //constants.DELETE,
          action: EditAction.remove,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          //constants.UNDO,
          action: EditAction.undo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          //cconstants.REDO,
          action: EditAction.redo,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
          selectMode: 'flash',
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          //constants.EDIT_NODE,
          action: EditAction.editNode,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_edit_node_black.png'),
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE_NODES,
          //constants.DELETE_NODE,
          action: EditAction.deleteNode,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_node_black.png'),
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ADD_NODES,
          //constants.ADD_NODE,
          action: EditAction.addNode,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_add_node_black.png'),
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
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          //constants.MOVE,
          action: EditAction.move,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_move_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          //constants.DELETE,
          size: 'large',
          action: EditAction.remove,
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          //constants.UNDO,
          size: 'large',
          action: EditAction.undo,
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          //constants.REDO,
          size: 'large',
          action: EditAction.redo,
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          //constants.EDIT_NODE,
          size: 'large',
          action: EditAction.editNode,
          image: require('../../../../../../assets/mapTools/icon_edit_node_black.png'),
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE_NODES,
          // constants.DELETE_NODE,
          size: 'large',
          action: EditAction.deleteNode,
          image: require('../../../../../../assets/mapTools/icon_delete_node_black.png'),
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ADD_NODES,
          //constants.ADD_NODE,
          size: 'large',
          action: EditAction.addNode,
          image: require('../../../../../../assets/mapTools/icon_add_node_black.png'),
        },
        {
          key: constants.ERASE_REGION,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ERASE,
          // constants.ERASE_REGION,
          size: 'large',
          action: EditAction.eraseRegion,
          image: require('../../../../../../assets/mapTools/icon_erasure_black.png'),
        },
        {
          key: constants.SPLIT_REGION,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_SPLIT,
          //constants.SPLIT_REGION,
          size: 'large',
          action: EditAction.splitRegion,
          image: require('../../../../../../assets/mapTools/icon_cut_black.png'),
        },
        {
          key: constants.MERGE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_UNION,
          // constants.MERGE,
          size: 'large',
          action: EditAction.merge,
          image: require('../../../../../../assets/mapTools/icon_merge_black.png'),
        },
        {
          key: constants.DRAWREGION_ERASE_REGION,
          title: getLanguage(global.language).Map_Main_Menu.FREE_DRAW_ERASE,
          //constants.DRAWREGION_ERASE_REGION,
          size: 'large',
          action: EditAction.drawRegionEraseRegion,
          image: require('../../../../../../assets/mapTools/icon_drawErasure_black.png'),
        },
        {
          key: constants.DRAWREGION_HOLLOW_REGION,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DRAW_HOLLOW,
          //constants.DRAWREGION_HOLLOW_REGION,
          size: 'large',
          action: EditAction.drawRegionHollowRegion,
          image: require('../../../../../../assets/mapTools/icon_drawingisland_black.png'),
        },
        {
          key: constants.FILL_HOLLOW_REGION,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_FILL_HOLLOW,
          //constants.FILL_HOLLOW_REGION,
          size: 'large',
          action: EditAction.fillHollowRegion,
          image: require('../../../../../../assets/mapTools/icon_fillingisland_black.png'),
        },
        {
          key: constants.PATCH_HOLLOW_REGION,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_PATCH_HOLLOW,
          //constants.PATCH_HOLLOW_REGION,
          size: 'large',
          action: EditAction.patchHollowRegion,
          image: require('../../../../../../assets/mapTools/icon_addisland_black.png'),
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
    case ConstToolType.MAP_EDIT_CAD:
      data = [
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          //constants.EDIT_NODE,
          size: 'large',
          action: EditAction.editNode,
          image: require('../../../../../../assets/mapTools/icon_edit_node_black.png'),
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          //constants.DELETE,
          action: EditAction.remove,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_delete_black.png'),
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          //constants.UNDO,
          size: 'large',
          action: EditAction.undo,
          image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          //constants.REDO,
          size: 'large',
          action: EditAction.redo,
          image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
        },
        // {
        //   key: constants.CANCEL_SELECT,
        //   title: getLanguage(global.language).Map_Main_Menu.COLLECTION_CANCEL,
        //   size: 'large',
        //   action: cancel,
        //   image: require('../../../../assets/mapTools/icon_close_black.png'),
        // },
      ]
      break
  }
  if (type === ConstToolType.MAP_EDIT_DEFAULT) {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else if (type === ConstToolType.MAP_EDIT_TAGGING) {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else if (type === ConstToolType.MAP_EDIT_TAGGING_SETTING) {
    buttons = [
      ToolbarBtnType.TAGGING_BACK,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.FLEX,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  }
  return { data, buttons }
}

export default {
  getData,
}
