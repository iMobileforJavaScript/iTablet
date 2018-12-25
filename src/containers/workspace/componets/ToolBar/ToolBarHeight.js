import { ConstToolType } from '../../../../constants'

function getToorbarHeight(orientation, type) {
  let height
  switch (type) {
    case ConstToolType.MAP3D_SYMBOL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
      } else {
        height = ConstToolType.HEIGHT[0]
      }
      break
    case ConstToolType.MAP3D_TOOL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[1]
      } else {
        height = ConstToolType.HEIGHT[0]
      }
      break
    case ConstToolType.MAP_COLLECTION_START:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
      } else {
        height = ConstToolType.HEIGHT[0]
      }
      break
    case ConstToolType.MAP_3D_START:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[1]
      } else {
        height = ConstToolType.HEIGHT[0]
      }
      break
    case ConstToolType.MAP_SYMBOL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
      }
      break
    case ConstToolType.MAP_TOOL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.THEME_HEIGHT[2]
      }
      break
    case ConstToolType.MAP_EDIT_TAGGING:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.THEME_HEIGHT[2]
      }
      break
    case ConstToolType.MAP_THEME_START:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[0]
      } else {
        height = ConstToolType.HEIGHT[0]
      }
      break
    case ConstToolType.MAP_THEME_CREATE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
      } else {
        height = ConstToolType.HEIGHT[0]
      }
      break
    case ConstToolType.MAP3D_CIRCLEFLY:
      height = ConstToolType.HEIGHT[0]
      break
    case ConstToolType.MAP_EDIT_START:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
      } else {
        height = ConstToolType.HEIGHT[0]
      }
      break
    case ConstToolType.MAP_STYLE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
      } else {
        height = ConstToolType.HEIGHT[1]
      }
      break
    case ConstToolType.LINECOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
      } else {
        height = ConstToolType.HEIGHT[1]
      }
      break
    case ConstToolType.POINTCOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
      } else {
        height = ConstToolType.HEIGHT[1]
      }
      break
    case ConstToolType.REGIONBEFORECOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
      } else {
        height = ConstToolType.HEIGHT[1]
      }
      break
    case ConstToolType.REGIONAFTERCOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
      } else {
        height = ConstToolType.HEIGHT[1]
      }
      break
    case ConstToolType.GRID_STYLE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[4]
      } else {
        height = ConstToolType.HEIGHT[4]
      }
      break
  }
  return height
}

export default {
  getToorbarHeight,
}
