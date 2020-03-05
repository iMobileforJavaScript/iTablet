import { ConstToolType } from '../../../../../constants'
import { SMCollectorType } from 'imobile_for_reactnative'
import ToolbarModule from './ToolbarModule'

// TODO 分拆到各个模块下
function getToolbarHeight(type, currentHeight) {
  const params = ToolbarModule.getParams()
  const orientation = params.device.orientation
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
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 4
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[2]
        column = 8
      }
      break
    case ConstToolType.MAP_EDIT_START:
    case ConstToolType.MAP_THEME_START:
    case ConstToolType.MAP_COLLECTION_START:
    case ConstToolType.MAP_PLOTTING_START:
    case ConstToolType.MAP_NAVIGATION_START:
    case ConstToolType.MAP_ANALYST_START:
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
    case ConstToolType.PLOTTING:
    case ConstToolType.MAP_SYMBOL:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
        column = 8
      }
      break
    case ConstToolType.PLOT_ANIMATION_XML_LIST:
    case ConstToolType.MAP_PLOTTING_ANIMATION:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
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
    case ConstToolType.MAP_THEME_CREATE_BY_LAYER:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[10]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
        column = 8
      }
      break
    case ConstToolType.MAP_TOOL:
    case ConstToolType.MAP_TOOLS:
      height = ConstToolType.TOOLBAR_HEIGHT[6]
      if (orientation === 'PORTRAIT') {
        column = 4
      } else {
        column = 5
      }
      break
    case ConstToolType.MAP_ADD:
    case ConstToolType.MAP_THEME_ADD_DATASET:
    case ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS:
    case ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME:
    case ConstToolType.MAP_NAVIGATION_MODULE:
    case ConstToolType.MAP_NAVIGATION_ADD_UDB:
    case ConstToolType.MAP_NAVIGATION_SELECT_MODEL:
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
    case ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION:
    case ConstToolType.MAP_THEME_PARAM_RANGELABEL_EXPRESSION:
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
    case ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_COLOR:
    case ConstToolType.MAP_THEME_PARAM_RANGELABEL_COLOR:
    case ConstToolType.MAP_THEME_PARAM_GRID_RANGE_COLOR:
    case ConstToolType.MAP_THEME_PARAM_GRID_UNIQUE_COLOR:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[7]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_RANGE_MODE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[0]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[0]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE:
    case ConstToolType.MAP_THEME_PARAM:
    case ConstToolType.MAP_THEME_PARAM_RANGE_PARAM:
    case ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_VALUE:
    case ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_SIZE:
    case ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_SIZE:
      height = 0
      break
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 4
      } else {
        height = ConstToolType.THEME_HEIGHT[0]
        column = 8
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR:
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.THEME_HEIGHT[7]
        column = 12
      }
      break
    case ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_ROTATION:
      height = ConstToolType.THEME_HEIGHT[0]
      column = 4
      break
    case ConstToolType.MAP3D_SYMBOL_SELECT:
    case ConstToolType.MAP3D_TOOL_NEWFLY:
      height = ConstToolType.HEIGHT[0]
      column = 3
      break
    case ConstToolType.MAP3D_CIRCLEFLY:
      height = ConstToolType.HEIGHT[0]
      column = 1
      break
    case ConstToolType.MAP_STYLE:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 4
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 8
      }
      break
    case ConstToolType.LEGEND:
    case ConstToolType.LEGEND_NOT_VISIBLE:
    case ConstToolType.MAP_COLOR_MODE:
    case ConstToolType.MAP_BACKGROUND_COLOR:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 16
      }
      if (currentHeight === 0) {
        height = 0
      }
      break
    case ConstToolType.LEGEND_POSITION:
      height = ConstToolType.TOOLBAR_HEIGHT[1]
      break
    case ConstToolType.LINECOLOR_SET:
    case ConstToolType.POINTCOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.HEIGHT[2]
        column = 12
      }
      break
    case ConstToolType.REGIONBEFORECOLOR_SET:
    case ConstToolType.REGIONBORDERCOLOR_SET:
    case ConstToolType.REGIONAFTERCOLOR_SET:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT_2[3]
        column = 12
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
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
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
      column = orientation === 'PORTRAIT' ? 4 : 5
      break
    case ConstToolType.MAP_EDIT_CAD:
      height = ConstToolType.HEIGHT[0]
      column = 5
      break
    case ConstToolType.MAP_EDIT_LINE:
    case ConstToolType.MAP_EDIT_REGION:
      height = ConstToolType.HEIGHT[2]
      column = orientation === 'PORTRAIT' ? 4 : 5
      break
    case ConstToolType.MAP3D_TOOL_FLYLIST:
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.HEIGHT[3]
      } else {
        height = ConstToolType.THEME_HEIGHT[4]
      }
      column = orientation === 'PORTRAIT' ? 4 : 5
      break
    case ConstToolType.MAP_SHARE:
    case ConstToolType.MAP_SHARE_MAP3D:
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
    // case ConstToolType.MAP3D_CLIP_SHOW:
    //   height = ConstToolType.TOOLBAR_HEIGHT[5]
    //   break
    // case ConstToolType.MAP3D_CLIP_HIDDEN:
    //   height = ConstToolType.HEIGHT[5]
    //   break
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
    case ConstToolType.MAP_ANALYSIS:
      if (orientation === 'PORTRAIT') {
        column = 4
        height = ConstToolType.TOOLBAR_HEIGHT[3]
      } else {
        column = 5
        height = ConstToolType.TOOLBAR_HEIGHT[2]
      }
      break
    case ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH:
    case ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS:
    case ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH:
      height = ConstToolType.HEIGHT[0]
      column = 5
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
      // if (orientation === 'PORTRAIT') {
      // height = ConstToolType.HEIGHT[2]
      column = 4
      // } else {
      height = ConstToolType.HEIGHT[0]
      //   column = 6
      // }
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
    case ConstToolType.MAP_TOOL_TAGGING_SETTING:
      if (orientation === 'LANDSCAPE') {
        height = ConstToolType.TOOLBAR_HEIGHT[3]
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT[3]
      }
      break
    case ConstToolType.PLOT_ANIMATION_PLAY:
      height = ConstToolType.HEIGHT[4]
      column = 4
      break
    case ConstToolType.PLOT_ANIMATION_START:
      height = ConstToolType.HEIGHT[4]
      break
    // case ConstToolType.ConstToolType.PLOT_ANIMATION_START:
    //   height = ConstToolType.HEIGHT[2]
    //   break
    case ConstToolType.PLOT_ANIMATION_NODE_CREATE:
      if (orientation === 'LANDSCAPE') {
        height = ConstToolType.TOOLBAR_HEIGHT[3]
      } else {
        height = ConstToolType.TOOLBAR_HEIGHT[5]
      }
      break
    case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
      height = ConstToolType.HEIGHT[0]
      break
    case ConstToolType.STYLE_TRANSFER_PICKER:
      height = ConstToolType.TOOLBAR_HEIGHT_2[3]
      break
    case ConstToolType.MAP_THEME_PARAM_GRAPH_TYPE:
      height = ConstToolType.THEME_HEIGHT[8]
      column = 4
      break
    case ConstToolType.MAP_THEME_PARAM_GRAPH_GRADUATEDMODE:
    case ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE:
      height = ConstToolType.HEIGHT[0]
      column = 3
      break
    case ConstToolType.MAP_AR_AIASSISTANT:
      height = ConstToolType.HEIGHT[2]
      column = 4
      break
    default:
      height = 0
  }
  return { height, column }
}

export default {
  getToolbarHeight,
}
