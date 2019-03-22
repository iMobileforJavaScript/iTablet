import { ConstToolType } from '../../../../constants'
import { SMCollectorType } from 'imobile_for_reactnative'

function getToorbarHeight(orientation, type) {
  let height, column
  switch (type) {
    case ConstToolType.MAP3D_SYMBOL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[0]
        column = 8
      }
      break
    case ConstToolType.MAP3D_TOOL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[1]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[0]
        column = 8
      }
      break
    case ConstToolType.MAP_EDIT_START:
    case ConstToolType.MAP_THEME_START:
    case ConstToolType.MAP_COLLECTION_START:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[0]
        column = 5
      }
      break
    case ConstToolType.MAP_3D_START:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[1]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[0]
        column = 8
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
      height = ConstToolType.HEIGHT[2]
      if (orientation === 'PORTRAIT') {
        // height = ConstToolType.HEIGHT[2]
        column = 4
      } else {
        // height = ConstToolType.THEME_HEIGHT[0]
        column = 5
      }
      break
    case ConstToolType.MAP_EDIT_TAGGING:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_CREATE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.NEWTHEME_HEIGHT[1]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[0]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_ADD_UDB:
    case ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS:
    case ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[5]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_GRAPH_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[5]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR:
    case ConstToolType.MAP_THEME_PARAM_RANGE_COLOR:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[5]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_RANGE_MODE:
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[0]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM:
    case ConstToolType.MAP_THEME_PARAM_RANGE_PARAM:
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE:
    case ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_VALUE:
    case ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_SIZE:
      height = 0
      break
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR:
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME:
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[7]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_ROTATION:
      height = ConstToolType.THEME_HEIGHT[0]
      break
    case ConstToolType.MAP3D_CIRCLEFLY:
      height = ConstToolType.HEIGHT[0]
      break
    case ConstToolType.MAP_STYLE:
      // if (orientation === 'PORTRAIT') {
      //   height = ConstToolType.THEME_HEIGHT[3]
      //   column = 4
      // } else {
      //   height = ConstToolType.HEIGHT[1]
      //   column = 8
      // }
      height = ConstToolType.THEME_HEIGHT[3]
      column = 4
      break
    case ConstToolType.LINECOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.HEIGHT[2]
        column = 4
      }
      break
    case ConstToolType.POINTCOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.HEIGHT[2]
        column = 4
      }
      break
    case ConstToolType.REGIONBEFORECOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.HEIGHT[2]
        column = 4
      }
      break
    case ConstToolType.REGIONAFTERCOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.HEIGHT[1]
        column = 4
      }
      break
    case ConstToolType.GRID_STYLE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[4]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[4]
        column = 8
      }
      break
    case ConstToolType.MAP3D_WORKSPACE_LIST:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[2]
        column = 8
      }
      break
    case ConstToolType.MAP_ADD_LAYER:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[2]
        column = 8
      }
      break
    case ConstToolType.MAP_CHANGE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
      }
      break
    case ConstToolType.MAP_EDIT_DEFAULT:
      height = 0
      break
    case ConstToolType.MAP_EDIT_POINT:
      height = ConstToolType.HEIGHT[0]
      break
    case ConstToolType.MAP_EDIT_LINE:
    case ConstToolType.MAP3D_TOOL_FLYLIST:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.HEIGHT[2]
      }
      break
    case ConstToolType.MAP_EDIT_REGION:
      height = ConstToolType.HEIGHT[2]
      break
    case ConstToolType.MAP_SHARE:
    case ConstToolType.MAP_MORE:
      height = ConstToolType.HEIGHT[0]
      column = 4
      break
    case ConstToolType.MAP3D_IMPORTWORKSPACE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
      } else {
        height = ConstToolType.HEIGHT[1]
      }
      break
    case ConstToolType.MAP_COLLECTION_REGION:
    case ConstToolType.MAP_COLLECTION_LINE:
    case ConstToolType.MAP_COLLECTION_POINT:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[0]
      } else {
        height = ConstToolType.HEIGHT[0]
      }
      column = 4
      break
    case SMCollectorType.REGION_GPS_POINT:
    case SMCollectorType.LINE_GPS_POINT:
    case SMCollectorType.POINT_GPS:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[0]
        column = 5
      }
      break
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.REGION_GPS_PATH:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.HEIGHT[0]
        column = 6
      }
      break
    case SMCollectorType.LINE_HAND_PATH:
    case SMCollectorType.LINE_HAND_POINT:
    case SMCollectorType.REGION_HAND_POINT:
    case SMCollectorType.REGION_HAND_PATH:
    case SMCollectorType.POINT_HAND:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[0]
      } else {
        height = ConstToolType.HEIGHT[0]
      }
      column = 4
      break
    default:
      height = 0
  }
  return { height, column }
}

export default {
  getToorbarHeight,
}
