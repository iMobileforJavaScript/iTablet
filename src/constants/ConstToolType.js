/**
 * 地图功能列表/工具栏 对应的标识符
 */
import { scaleSize } from '../utils'
export default {
  // Map
  MAP_BASE: 'MAP_BASE',
  MAP_ADD_LAYER: 'MAP_ADD_LAYER',
  MAP_ADD_DATASET: 'MAP_ADD_DATASET',
  MAP_SYMBOL: 'MAP_SYMBOL',
  MAP_COLLECTION: 'MAP_COLLECTION',

  MAP_OPEN: 'MAP_OPEN',

  MAP_COLLECTION_POINT: 'MAP_COLLECTION_POINT',
  MAP_COLLECTION_LINE: 'MAP_COLLECTION_LINE',
  MAP_COLLECTION_REGION: 'MAP_COLLECTION_REGION',

  MAP_MORE: 'MAP_MORE',

  // MAP_COLLECTION_POINT_POINT: 'MAP_COLLECTION_POINT_POINT',
  // MAP_COLLECTION_POINT_GPS: 'MAP_COLLECTION_POINT_GPS',
  // MAP_COLLECTION_LINE_POINT: 'MAP_COLLECTION_LINE_POINT',
  // MAP_COLLECTION_LINE_GPS_POINT: 'MAP_COLLECTION_LINE_GPS_POINT',
  // MAP_COLLECTION_LINE_GPS_PATH: 'MAP_COLLECTION_LINE_GPS_PATH',
  // MAP_COLLECTION_LINE_FREE_DRAW: 'MAP_COLLECTION_LINE_FREE_DRAW',
  // MAP_COLLECTION_REGION_POINT: 'MAP_COLLECTION_REGION_POINT',
  // MAP_COLLECTION_REGION_GPS_POINT: 'MAP_COLLECTION_REGION_GPS_POINT',
  // MAP_COLLECTION_REGION_GPS_PATH: 'MAP_COLLECTION_REGION_GPS_PATH',
  // MAP_COLLECTION_REGION_FREE_DRAW: 'MAP_COLLECTION_REGION_FREE_DRAW',
  MAP_EDIT_POINT: 'MAP_EDIT_POINT',
  MAP_EDIT_LINE: 'MAP_EDIT_LINE',
  MAP_EDIT_REGION: 'MAP_EDIT_REGION',
  MAP_EDIT_TAGGING: 'MAP_EDIT_TAGGING',
  MAP_EDIT_DEFAULT: 'MAP_EDIT_DEFAULT',

  MAP_THEME: 'MAP_THEME',
  MAP_THEME_START: 'MAP_THEME_START',
  MAP_THEME_CREATE: 'MAP_THEME_CREATE',
  MAP_THEME_PARAM: 'MAP_THEME_PARAM',
  MAP_THEME_PARAM_UNIQUE_EXPRESSION: 'MAP_THEME_PARAM_UNIQUE_EXPRESSION',
  MAP_THEME_PARAM_UNIQUE_COLOR: 'MAP_THEME_PARAM_UNIQUE_COLOR',
  MAP_THEME_PARAM_RANGE_EXPRESSION: 'MAP_THEME_PARAM_RANGE_EXPRESSION',
  MAP_THEME_PARAM_RANGE_MODE: 'MAP_THEME_PARAM_RANGE_MODE',
  MAP_THEME_PARAM_RANGE_COLOR: 'MAP_THEME_PARAM_RANGE_COLOR',

  MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION:
    'MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION',
  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE:
    'MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE',
  MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME:
    'MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME',
  MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE:
    'MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE',
  MAP_THEME_PARAM_UNIFORMLABEL_ROTATION:
    'MAP_THEME_PARAM_UNIFORMLABEL_ROTATION',
  MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR:
    'MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR',

  MAP_SHARE: 'MAP_SHARE',
  MAP_SHARE_MAP3D: 'MAP_SHARE_MAP3D',
  MAP_TOOL: 'MAP_TOOL',
  MAP_TOOL_POINT_SELECT: 'MAP_TOOL_POINT_SELECT',

  MAP_STYLE: 'MAP_STYLE',
  MAP_START: 'MAP_START',
  MAP3D_START: 'MAP3D_START',
  MAP_CHANGE: 'MAP_CHANGE',
  LINECOLOR_SET: 'LINECOLOR_SET',
  POINTCOLOR_SET: 'POINTCOLOR_SET',
  REGIONBEFORECOLOR_SET: 'REGIONBEFORECOLOR_SET',
  REGIONAFTERCOLOR_SET: 'REGIONAFTERCOLOR_SET',

  //Map3D
  MAP3D_BASE: 'MAP3D_BASE',
  MAP3D_ADD_LAYER: 'MAP3D_ADD_LAYER',
  MAP3D_SYMBOL: 'MAP3D_SYMBOL',
  MAP3D_SYMBOL_POINT: 'MAP3D_SYMBOL_POINT',
  MAP3D_SYMBOL_TEXT: 'MAP3D_SYMBOL_TEXT',
  MAP3D_SYMBOL_POINTLINE: 'MAP3D_SYMBOL_POINTLINE',
  MAP3D_SYMBOL_POINTSURFACE: 'MAP3D_SYMBOL_POINTSURFACE',
  MAP3D_TOOL: 'MAP3D_TOOL',
  MAP3D_TOOL_DISTANCEMEASURE: 'MAP3D_TOOL_DISTANCEMEASURE',
  MAP3D_TOOL_SUERFACEMEASURE: 'MAP3D_TOOL_SUERFACEMEASURE',
  MAP3D_TOOL_HEIGHTMEASURE: 'MAP3D_TOOL_HEIGHTMEASURE',
  MAP3D_TOOL_SELECTION: 'MAP3D_TOOL_SELECTION',
  MAP3D_TOOL_BOXTAILOR: 'MAP3D_TOOL_BOXTAILOR',
  MAP3D_TOOL_PSTAILOR: 'MAP3D_TOOL_PSTAILOR',
  MAP3D_TOOL_CROSSTAILOR: 'MAP3D_TOOL_CROSSTAILOR',
  MAP3D_TOOL_FLY: 'MAP3D_TOOL_FLY',
  MAP3D_TOOL_LEVEL: 'MAP3D_TOOL_LEVEL',
  MAP3D_TOOL_FLYLIST: 'MAP3D_TOOL_FLYLIST',
  MAP3D_ATTRIBUTE: 'MAP3D_ATTRIBUTE',
  MAP3D_CIRCLEFLY: 'MAP3D_CIRCLEFLY',
  MAP_MORE_MAP3D: 'MAP_MORE_MAP3D',
  // 工具视图高度级别
  HEIGHT: [
    scaleSize(100),
    scaleSize(150),
    scaleSize(250),
    scaleSize(720),
    scaleSize(0),
  ],
  THEME_HEIGHT: [
    scaleSize(100),
    scaleSize(150),
    scaleSize(250),
    scaleSize(400),
    scaleSize(500),
    scaleSize(600),
    scaleSize(700),
  ],
}
