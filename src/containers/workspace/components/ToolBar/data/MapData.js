import { ConstToolType, legendColor } from '../../../../../constants'
import ToolbarBtnType from '../ToolbarBtnType'

function getMapData(type) {
  let data = [],
    buttons = []

  switch (type) {
    case ConstToolType.ATTRIBUTE_RELATE:
    case ConstToolType.ATTRIBUTE_SELECTION_RELATE:
      buttons = [ToolbarBtnType.CANCEL_2]
      break
    case ConstToolType.MAP_BASE:
      // data = BotMap
      break
    case ConstToolType.MAP_ADD_LAYER:
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.FLEX,
      ]
      break
    case ConstToolType.MAP_OPEN:
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.MAP_SYMBOL:
      break
    case ConstToolType.LEGEND_NOT_VISIBLE:
      data = legendColor
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.VISIBLE,
        ToolbarBtnType.MENU,
        // ToolbarBtnType.FLEX,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
    case ConstToolType.LEGEND:
      data = legendColor
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.NOT_VISIBLE,
        ToolbarBtnType.MENU,
        // ToolbarBtnType.FLEX,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
  }
  return { data, buttons }
}

export default {
  getMapData,
}
