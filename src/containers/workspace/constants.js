export default {
  SUBMIT: '执行',
  UNDO: '撤销',
  ADD_NODE: '添加节点',
  EDIT_NODE: '编辑节点',
  DELETE_NODE: '删除节点',
  REDO: '重做',
  CANCEL: '取消',
  CANCEL_SELECT: '取消选中',
  CREATE_POLYLINE: '绘制直线',
  CREATE_POLYGON: '绘制多边形',
  DELETE: '删除',
  BREAK: '打断',
  SPLIT_REGION: '切割',
  MERGE: '合并',
  ERASE_REGION: '擦除',
  DRAWREGION_ERASE_REGION: '手绘擦除',
  DRAW_HOLLOW_REGION: '生成岛洞',
  DRAWREGION_HOLLOW_REGION: '手绘岛洞',
  FILL_HOLLOW_REGION: '填充岛洞',
  PATCH_HOLLOW_REGION: '补充岛洞',
  ATTRIBUTE: '属性',
  MOVE: '平移',
  MODIFIED: '修改',
  SETTING: '设置',
  ANALYSIS: '分析',
  ROUTANALYSIS: '路径分析',
  CONNETCTED: '连通分析',
  TRAVEL: '商旅分析',
  TRACK: '追踪分析',
  DISTANCECALCULATE: '距离量算',
  ACREAGECALCULATE: '面积量算',
  POINT: '打点',
  WORDS: '文字',
  POINTLINE: '点绘线',
  FREELINE: '自由线',
  POINTCOVER: '点绘面',
  FREECOVER: '自由面',
  COMMONTRACK: '普通模式轨迹',
  ROADTRACK: '抓路模式轨迹',
  EQUALTRACK: '等距模式轨迹',
  TIMETRACK: '等时模式轨迹',
  INTELLIGENCETRACK: '智能模式轨迹',
  SELECT_ALL: '全选',
  SELECT_INVERSE: '反选',

  CLOSE: '关闭地图',
  SAVE: '保存地图',
  SAVE_AS: '另存地图',
  SHARE: '分享地图',
  EXPORT_MAP: '导出地图',
  START: '开始',
  OPEN: '打开地图',
  WORKSPACE: '工作空间',
  CREATE: '新建地图',
  TEMPLATE: '模板',
  HISTORY: '历史记录',
  BASE_MAP: '切换底图',
  ADD: '添加',
  MAP3DSHARE: '分享场景',

  THEME_CLOSE: '关闭地图',
  THEME_SAVE: '保存地图',
  THEME_SAVE_AS: '另存地图',
  THEME_SHARE: '分享地图',
  THEME_WORKSPACE: '导入数据',
  THEME_OPEN: '打开地图',
  THEME_CREATE: '新建地图',
  THEME_BASE_MAP: '底图切换',

  THEME_UNIFY_STYLE: '统一风格',
  THEME_UNIQUE_STYLE: '单值风格',
  THEME_RANGE_STYLE: '分段风格',
  THEME_CUSTOME_STYLE: '自定义风格',
  THEME_CUSTOME_LABEL: '自定义标签',
  THEME_UNIFY_LABEL: '统一标签',
  THEME_UNIQUE_LABEL: '单值标签',
  THEME_RANGE_LABEL: '分段标签',
  THEME_GRAPH_STYLE: '统计专题图',

  //统计专题图
  THEME_GRAPH_AREA: '面积图',
  THEME_GRAPH_STEP: '阶梯图',
  THEME_GRAPH_LINE: '折线图',
  THEME_GRAPH_POINT: '点状图',
  THEME_GRAPH_BAR: '柱状图',
  THEME_GRAPH_BAR3D: '三维柱状图',
  THEME_GRAPH_PIE: '饼图',
  THEME_GRAPH_PIE3D: '三维饼图',
  THEME_GRAPH_ROSE: '玫瑰图',
  THEME_GRAPH_ROSE3D: '三维玫瑰图',
  THEME_GRAPH_STACK_BAR: '堆叠柱状图',
  THEME_GRAPH_STACK_BAR3D: '三维堆叠柱状图',
  THEME_GRAPH_RING: '环状图',
  //统计值计算方法
  THEME_GRAPH_GRADUATEDMODE_CONS: '常量',
  THEME_GRAPH_GRADUATEDMODE_CONS_KEY: 'CONSTANT',
  THEME_GRAPH_GRADUATEDMODE_LOG: '对数',
  THEME_GRAPH_GRADUATEDMODE_LOG_KEY: 'LOGARITHM',
  THEME_GRAPH_GRADUATEDMODE_SQUARE: '平方根',
  THEME_GRAPH_GRADUATEDMODE_SQUARE_KEY: 'SQUAREROOT',

  MAP_THEME_PARAM_RANGE_MODE_NONE: 'NONE', //'空分段'
  MAP_THEME_PARAM_RANGE_MODE_EQUALINTERVAL: 'EQUALINTERVAL', //'等距分段'
  MAP_THEME_PARAM_RANGE_MODE_SQUAREROOT: 'SQUAREROOT', //'平方根分段'
  MAP_THEME_PARAM_RANGE_MODE_STDDEVIATION: 'STDDEVIATION', //'标准差分段'
  MAP_THEME_PARAM_RANGE_MODE_LOGARITHM: 'LOGARITHM', //'对数分段'
  MAP_THEME_PARAM_RANGE_MODE_QUANTILE: 'QUANTILE', //'等计数分段'
  MAP_THEME_PARAM_RANGE_MODE_CUSTOMINTERVAL: 'CUSTOMINTERVAL', //'自定义分段'

  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_NONE: 'NONE', //'空背景'
  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_DIAMOND: 'DIAMOND', //'菱形背景'
  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_ROUNDRECT: 'ROUNDRECT', //'圆角矩形背景'
  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_RECT: 'RECT', //'矩形背景'
  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_ELLIPSE: 'ELLIPSE', //'椭圆形背景'
  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_TRIANGLE: 'TRIANGLE', //'三角形背景'
  MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_MARKER: 'MARKER', //'符号背景'

  // =====================================

  POINT_GPS: 'point_gps',
  POINT_HAND: 'point_hand',

  LINE_GPS_POINT: 'line_gps_point',
  LINE_GPS_PATH: 'line_gps_path',
  LINE_HAND_POINT: 'line_hand_point',
  LINE_HAND_PATH: 'line_hand_path',

  REGION_GPS_POINT: 'region_gps_point',
  REGION_GPS_PATH: 'region_gps_path',
  REGION_HAND_POINT: 'region_hand_point',
  REGION_HAND_PATH: 'region_hand_path',

  CAD_POINT: 'cad_point',
  CAD_LINE: 'cad_line',
  CAD_REGION: 'cad_region',

  // =====================================

  COLLECTION: 'COLLECTION',
  MAP_EDIT: 'MAP_EDIT',
  MAP_3D: 'MAP_3D',
  MAP_THEME: 'MAP_THEME',
  MAP_PLOTTING: 'MAP_PLOTTING',

  // ==================分享===================
  QQ: 'QQ',
  WECHAT: '微信',
  WEIBO: '微博',
  SUPERMAP_ONLINE: 'SuperMap Online',
  FRIEND: '好友',
  DISCOVERY: '发现',
  SAVE_AS_IMAGE: '保存为图片',
}
