import { ConstToolType } from '../../../../../constants'
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
  }
  return { data, buttons }
}

export default {
  getMapData,
}
