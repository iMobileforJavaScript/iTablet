/**
 * 地图功能列表/工具栏 对应的标识符
 */
import { scaleSize } from '../utils'
export default {
  //点击监听类型
  NORMAL: 'NORMAL',
  NULL: 'NULL',
  // Map
  MAP_BASE: 'MAP_BASE',
  MAP_ADD_LAYER: 'MAP_ADD_LAYER',
  MAP_ADD_DATASET: 'MAP_ADD_DATASET',
  MAP_SYMBOL: 'MAP_SYMBOL',
  MAP_COLLECTION: 'MAP_COLLECTION',
  MAP_PLOTTING: 'MAP_PLOTTING',

  MAP_OPEN: 'MAP_OPEN',

  MAP_COLLECTION_POINT: 'MAP_COLLECTION_POINT',
  MAP_COLLECTION_LINE: 'MAP_COLLECTION_LINE',
  MAP_COLLECTION_REGION: 'MAP_COLLECTION_REGION',

  MAP_COLLECTION_CONTROL_POINT: 'MAP_COLLECTION_CONTROL_POINT',
  MAP_COLLECTION_CONTROL_LINE: 'MAP_COLLECTION_CONTROL_LINE',
  MAP_COLLECTION_CONTROL_REGION: 'MAP_COLLECTION_CONTROL_REGION',

  MAP_MORE: 'MAP_MORE',

  LEGEND: 'LEGEND',
  LEGEND_NOT_VISIBLE: 'LEGEND_NOT_VISIBLE',

  MAP_BACKGROUND_COLOR: 'MAP_BACKGROUND_COLOR',
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
  MAP_EDIT_TAGGING_SETTING: 'MAP_EDIT_TAGGING_SETTING',

  MAP_THEME: 'MAP_THEME',
  MAP_THEME_START: 'MAP_THEME_START',
  MAP_THEME_CREATE: 'MAP_THEME_CREATE',
  MAP_THEME_START_CREATE: 'MAP_THEME_START_CREATE', //开始->新建
  MAP_THEME_CREATE_BY_LAYER: 'MAP_THEME_CREATE_BY_LAYER',
  MAP_THEME_PARAM: 'MAP_THEME_PARAM',
  MAP_THEME_PARAM_GRAPH: 'MAP_THEME_PARAM_GRAPH',
  MAP_THEME_PARAM_UNIQUE_EXPRESSION: 'MAP_THEME_PARAM_UNIQUE_EXPRESSION',
  MAP_THEME_PARAM_UNIQUE_COLOR: 'MAP_THEME_PARAM_UNIQUE_COLOR',
  MAP_THEME_PARAM_RANGE_EXPRESSION: 'MAP_THEME_PARAM_RANGE_EXPRESSION',
  MAP_THEME_PARAM_RANGE_MODE: 'MAP_THEME_PARAM_RANGE_MODE',
  MAP_THEME_PARAM_RANGE_PARAM: 'MAP_THEME_PARAM_RANGE_PARAM',
  MAP_THEME_PARAM_RANGE_COLOR: 'MAP_THEME_PARAM_RANGE_COLOR',
  MAP_THEME_PARAM_CREATE_DATASETS: 'MAP_THEME_PARAM_CREATE_DATASETS',
  MAP_THEME_PARAM_CREATE_EXPRESSION: 'MAP_THEME_PARAM_CREATE_EXPRESSION',
  MAP_THEME_PARAM_GRAPH_EXPRESSION: 'MAP_THEME_PARAM_GRAPH_EXPRESSION',
  MAP_THEME_PARAM_GRAPH_GRADUATEDMODE: 'MAP_THEME_PARAM_GRAPH_GRADUATEDMODE',
  MAP_THEME_PARAM_GRAPH_COLOR: 'MAP_THEME_PARAM_GRAPH_COLOR',
  MAP_THEME_PARAM_GRAPH_MAXVALUE: 'MAP_THEME_PARAM_GRAPH_MAXVALUE',
  MAP_THEME_PARAM_GRAPH_TYPE: 'MAP_THEME_PARAM_GRAPH_TYPE',
  MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION:
    'MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION',
  MAP_THEME_PARAM_DOT_DENSITY_VALUE: 'MAP_THEME_PARAM_DOT_DENSITY_VALUE',
  MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS: 'MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS',
  MAP_THEME_PARAM_DOT_DENSITY_SIZE: 'MAP_THEME_PARAM_DOT_DENSITY_SIZE',
  MAP_THEME_PARAM_DOT_DENSITY_COLOR: 'MAP_THEME_PARAM_DOT_DENSITY_COLOR',
  MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION:
    'MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION',
  MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE:
    'MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE',
  MAP_THEME_PARAM_GRADUATED_SYMBOL_VALUE:
    'MAP_THEME_PARAM_GRADUATED_SYMBOL_VALUE',
  MAP_THEME_PARAM_GRADUATED_SYMBOLS: 'MAP_THEME_PARAM_GRADUATED_SYMBOLS',
  MAP_THEME_PARAM_GRADUATED_SYMBOL_SIZE:
    'MAP_THEME_PARAM_GRADUATED_SYMBOL_SIZE',
  MAP_THEME_PARAM_GRADUATED_SYMBOL_COLOR:
    'MAP_THEME_PARAM_GRADUATED_SYMBOL_COLOR',
  //栅格专题图
  MAP_THEME_PARAM_GRID_UNIQUE_COLOR: 'MAP_THEME_PARAM_GRID_UNIQUE_COLOR',
  MAP_THEME_PARAM_GRID_UNIQUE_DEFAULT_COLOR:
    'MAP_THEME_PARAM_GRID_UNIQUE_DEFAULT_COLOR',
  MAP_THEME_PARAM_GRID_RANGE_RANGEMODE: 'MAP_THEME_PARAM_GRID_RANGE_RANGEMODE',
  MAP_THEME_PARAM_GRID_RANGE_RANGECOUNT:
    'MAP_THEME_PARAM_GRID_RANGE_RANGECOUNT',
  MAP_THEME_PARAM_GRID_RANGE_COLOR: 'MAP_THEME_PARAM_GRID_RANGE_COLOR',
  MAP_THEME_ADD_UDB: 'MAP_THEME_ADD_UDB',
  MAP_THEME_ADD_DATASET: 'MAP_THEME_ADD_DATASET',
  MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME:
    'MAP_THEME_PARAM_CREATE_EXPRESSION_BY_LAYERNAME',
  MAP_THEME_START_OPENDS: 'MAP_THEME_START_OPENDS', //开始->新建->打开数据源

  MAP_IMPORT_TEMPLATE: 'MAP_IMPORT_TEMPLATE',
  MAP_HISTORY: 'MAP_HISTORY',

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
  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR:
    'MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR',

  MAP_SHARE: 'MAP_SHARE',
  MAP_SHARE_MAP3D: 'MAP_SHARE_MAP3D',
  MAP_TOOL: 'MAP_TOOL',
  MAP_TOOLS: 'MAP_TOOLS',
  MAP_TOOL_TAGGING_SETTING: 'MAP_TOOL_TAGGING_SETTING',
  MAP_TOOL_TAGGING: 'MAP_TOOL_TAGGING',
  MAP_TOOL_POINT_SELECT: 'MAP_TOOL_POINT_SELECT',
  MAP_TOOL_SELECT_BY_RECTANGLE: 'MAP_TOOL_SELECT_BY_RECTANGLE',
  MAP_TOOL_MEASURE_LENGTH: 'MAP_TOOL_MEASURE_LENGTH',
  MAP_TOOL_MEASURE_AREA: 'MAP_TOOL_MEASURE_AREA',
  MAP_TOOL_MEASURE_ANGLE: 'MAP_TOOL_MEASURE_ANGLE',
  MAP_TOOL_RECTANGLE_CUT: 'MAP_TOOL_RECTANGLE_CUT',
  MAP_TOOL_TAGGING_POINT_SELECT: 'MAP_TOOL_TAGGING_POINT_SELECT',
  MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE: 'MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE',

  MAP_STYLE: 'MAP_STYLE',
  MAP_EDIT_STYLE: 'MAP_EDIT_STYLE',
  //地图底图切换常量
  MAP_EDIT_MORE_STYLE: 'MAP_EDIT_MORE_STYLE',
  MAP_SCALE: 'MAP_SCALE',
  MAP_MAX_SCALE: 'MAP_MAX_SCALE',
  MAP_MIN_SCALE: 'MAP_MIN_SCALE',
  COLLECTION: 'COLLECTION',
  MAP_NULL: 'MAP_NULL',
  GRID_STYLE: 'GRID_STYLE',
  MAP_COLLECTION_START: 'MAP_COLLECTION_START',
  MAP_EDIT_START: 'MAP_START',
  MAP_3D_START: 'MAP_3D_START',
  MAP_CHANGE: 'MAP_CHANGE',
  MAP_TEMPLATE: 'MAP_TEMPLATE',
  MAP_SELECT: 'MAP_SELECT',
  LINECOLOR_SET: 'LINECOLOR_SET',
  POINTCOLOR_SET: 'POINTCOLOR_SET',
  REGIONBEFORECOLOR_SET: 'REGIONBEFORECOLOR_SET',
  REGIONAFTERCOLOR_SET: 'REGIONAFTERCOLOR_SET',
  MAP_THEME_STYLE: 'MAP_THEME_STYLE',
  MAP_THEME_STYLES: 'MAP_THEME_STYLES',

  ATTRIBUTE_RELATE: 'ATTRIBUTE_RELATE',
  ATTRIBUTE_SELECTION_RELATE: 'ATTRIBUTE_SELECTION_RELATE',

  //Map3D
  MAP_3D: 'MAP_3D',
  MAP3D_BASE: 'MAP3D_BASE',
  MAP3D_LAYER3D_BASE: 'MAP3D_LAYER3D_BASE',
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
  MAP3D_TOOL_NEWFLY: 'MAP3D_TOOL_NEWFLY',
  MAP3D_TOOL_LEVEL: 'MAP3D_TOOL_LEVEL',
  MAP3D_TOOL_FLYLIST: 'MAP3D_TOOL_FLYLIST',
  MAP3D_ATTRIBUTE: 'MAP3D_ATTRIBUTE',
  MAP3D_CIRCLEFLY: 'MAP3D_CIRCLEFLY',
  MAP3D_WORKSPACE_LIST: 'MAP3D_WORKSPACE_LIST',
  MAP_MORE_MAP3D: 'MAP_MORE_MAP3D',
  MAP3D_SHARE: 'MAP3D_SHARE',
  MAP3D_IMPORTWORKSPACE: 'MAP3D_IMPORTWORKSPACE',
  MAP3D_LAYER3D_DEFAULT: 'MAP3D_LAYER3D_DEFAULT', //3d默认图层
  MAP3D_LAYER3D_DEFAULT_SELECTED: 'MAP3D_LAYER3D_DEFAULT_SELECTED', //3d默认图层
  MAP3D_LAYER3D_IMAGE: 'MAP3D_LAYER3D_IMAGE', //3d影像图层
  MAP3D_LAYER3D_TERRAIN: 'MAP3D_LAYER3D_TERRAIN', //3d地形图层
  MAP3D_SYMBOL_SELECT: 'MAP3D_SYMBOL_SELECT',

  MAP_MORE_THEME: 'MAP_MORE_THEME',
  // 工具视图高度级别
  HEIGHT: [
    scaleSize(100),
    scaleSize(150),
    scaleSize(250),
    scaleSize(720),
    scaleSize(0),
  ],
  NEWTHEME_HEIGHT: [
    scaleSize(100),
    scaleSize(200),
    scaleSize(300),
    scaleSize(400),
    scaleSize(500),
  ],
  THEME_HEIGHT: [
    scaleSize(100),
    scaleSize(150),
    scaleSize(250),
    scaleSize(400),
    scaleSize(500),
    scaleSize(600),
    scaleSize(700),
    scaleSize(300),
    scaleSize(120),
    scaleSize(750),
    scaleSize(800),
  ],
  TOOLBAR_HEIGHT: [
    scaleSize(86),
    scaleSize(172),
    scaleSize(344),
    scaleSize(430),
    scaleSize(516),
    scaleSize(602),
    scaleSize(688),
  ],
  TOOLBAR_BASEMAP_HEIGHT: [],
}
