import { scaleSize } from '../utils'
export default {
  UNIQUE: '单值专题图',
  RANGE: '分段设色专题图',
  LABEL: '标签专题图',

  FONT: 'font',
  EXPRESSION: 'expression',
  COLOR: 'color',
  FONT_COLOR: 'fontColor',

  BUFFER: 'buffer',
  OVERLAY: 'overlay',
  ROUTE: 'route',
  TRACKING: 'tracking',
  FACILITY: 'facility',
  NETWORK: 'network',
  NETWORK_ROUTE: 'network_route',
  NETWORK_FACILITY: 'network_facility',
  NETWORK_TSP: 'network_tsp',
  NETWORK_TRACKING: 'network_tracking',

  START_POINT: 'start_point', // 起点
  MIDDLE_POINT: 'middle_point', // 中间点
  END_POINT: 'end_point', // 终点

  // 工作空间工具栏
  ADD_LAYER: 'add_layer',
  COLLECTION: 'collection',
  DATA_EDIT: 'data_edit',
  MAP_MANAGER: 'map_manager',
  DATA_MANAGER: 'data_manager',
  ANALYST: 'analyst',
  TOOLS: 'tools',

  // 地图类型
  TD: 'TD',
  Baidu: 'Baidu',
  Google: 'Google',
  OSM: 'OSM',
  ONLINE: 'ONLINE',
  LOCAL: 'LOCAL',
  MAP_3D: 'MAP_3D',

  //打开时地图状态
  DEFAULT: 'DEFAULT',
  CREATE: 'CREATE',
  LOAD: 'LOAD',

  CREATE_SYMBOL_COLLECTION: '普通创建',
  CREATE_MODULE: '模板创建',
  INFORMATION: '数据',
  HISTORY: '历史记录',

  PUBLIC_DATA_SOURCE: '公共数据源',
  DATA_SOURCE: '数据源',

  // 时间
  ANIMATED_DURATION: 300,
  ANIMATED_DURATION_2: 400,

  // 底部Bottom
  BOTTOM_HEIGHT: scaleSize(96),

  // Mine
  IMPORT: '导入',
  SEVER: '服务',
  MYLABEL: '标注',
  BASEMAP: '底图',
  POI: 'POI',
  NAViGATION: '导航',
  RIBBON: '色带',
  STENCIL: '模板',
  MAP: '地图',
  DATA: '数据',
  SCENE: '场景',
  SYMBOL: '符号',
  MINE_COLOR: '色带',
  TEMPLATE: '模板',
  ONLINE_DATA: '在线数据',
  ONLINE_MAP: '在线地图',

  PUBLICMAP: '公共地图',
  FRIENDMAP: '好友地图',
  FRIENDPOSITION: '好友位置',
  SHUTTLCOMMUTER: '班车通勤',
  SUPERMAP: '超图集团',
  FORUMOFSUPERMAP: '超图论坛',
  SUPERMAPKNOWN: '超图知道',
  MAPOFAPP: '地图APP',
}
