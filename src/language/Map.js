//制图

const Map_Lable_Chinese = {
  //地图底部导航
  MAP: '地图',
  LAYER: '图层',
  ATTRIBUTE: '属性',
  SETTING: '设置',
  SCENE: '场景',
  NAME: '名称',
}
const Map_Lable_English = {
  MAP: 'Map',
  LAYER: 'Layer',
  ATTRIBUTE: 'Attribute',
  SETTING: 'Setting',
  SCENE: 'Scene',
  NAME: 'Name',
}

//地图、场景主菜单
const Map_Main_Menu_Chinese = {
  //地图制图及公共 开始
  START: '开始',
  START_OPEN_MAP: '打开地图',
  START_NEW_MAP: '新建地图',
  START_RECENT: '历史记录',
  START_SAVE_MAP: '保存地图',
  START_SAVE_AS_MAP: '另存地图',
  START_OPEN_SENCE: '打开场景',
  START_NEW_SENCE: '新建场景',
  START_SAVE_SENCE: '保存场景',
  START_SAVE_AS_SENCE: '另存场景',

  //地图制图及公共 添加
  OPEN: '添加',
  OPEN_DATASOURCE: '数据源',
  OPEN_MAP: '地图',
  OPEN_BACK: '上一步',

  //地图制图及公共 风格
  STYLE: '风格',
  STYLE_SYMBOL: '符号',
  STYLE_SYMBOL_SIZE: '符号大小',
  STYLE_COLOR: '颜色',
  STYLE_ROTATION: '旋转角度',
  STYLE_TRANSPARENCY: '透明度',
  STYLE_LINE_WIDTH: '线宽',
  STYLE_FOREGROUND: '前景色',
  STYLE_BACKFROUNG: '背景色',
  STYLE_GRADIENT_FILL: '渐变',
  STYLE_FRAME_COLOR: '边框颜色',
  STYLE_FRAME_SYMBOL: '边框符号',
  STYLE_FONT: '字体',
  STYLE_FONT_SIZE: '字号',
  STYLE_ALIGNMENT: '位置',
  STYLE_FONT_STYLE: '风格',
  STYLE_CONTRAST: '对比度',
  STYLE_BRIGHTNESS: '亮度',
  STYLE_BOLD: '加粗',
  STYLE_ITALIC: '倾斜',
  STYLE_UNDERLINE: '下划线',
  STYLE_STRIKEOUT: '删除线',
  STYLE_OUTLINE: '轮廓',
  STYLE_SHADOW: '阴影',

  ROTATE_LEFT: '左旋转90°',
  ROTATE_RIGHT: '右旋转90°',
  VERTICAL_FLIP: '上下旋转',
  HORIZONTAL_FLIP: '左右旋转',

  //地图制图及公共 工具
  TOOLS: '工具',
  TOOLS_DISTANCE_MEASUREMENT: '距离量算',
  TOOLS_AREA_MEASUREMENT: '面积量算',
  TOOLS_AZIMUTH_MEASUREMENT: '方位角量算',
  TOOLS_SELECT: '点选',
  TOOLS_RECTANGLE_SELECT: '框选',
  TOOLS_ROUND_SELECT: '圆选',
  FULL_SCREEN: '全幅',

  //标注
  PLOTS: '标注',
  DOT_LINE: '点绘线',
  FREE_LINE: '自由线',
  DOT_REGION: '点绘面',
  FREE_REGION: '自由面',
  TOOLS_3D_CREATE_POINT: '兴趣点',
  TOOLS_CREATE_POINT: '打点',
  TOOLS_CREATE_LINE: '画线',
  TOOLS_CREATE_REGION: '画面',
  TOOLS_CREATE_TRACK: '轨迹',
  TOOLS_CREATE_TEXT: '文字',
  TOOLS_NAME: '名字',
  TOOLS_REMARKS: '备注',
  TOOLS_HTTP: 'http地址',
  TOOLS_PICTURES: '图片',

  //裁剪
  TOOLS_RECTANGLE_CLIP: '矩形裁剪',
  TOOLS_CIRCLE_CLIP: '圆形裁剪',
  TOOLS_POLYGON_CLIP: '多边形裁剪',
  TOOLS_SELECT_OBJECT_AREA_CLIP: '选中对象裁剪',
  TOOLS_CLIP_INSIDE: '区域内裁剪',
  TOOLS_ERASE: '擦除',
  TOOLS_EXACT_CLIP: '精确裁剪',
  TOOLS_TARGET_DATASOURCE: '目标数据源',
  TOOLS_UNIFIED_SETTING: '统一设置',
  MAP_CLIP: '地图裁剪',
  CLIP: '裁剪',

  TOOLS_MAGNIFIER: '放大镜',
  TOOLS_SELECT_ALL: '全选',
  TOOLS_SELECT_REVERSE: '反选',

  //三维 工具
  TOOLS_SCENE_SELECT: '选择',
  TOOLS_PATH_ANALYSIS: '路径分析',
  TOOLS_VISIBILITY_ANALYSIS: '通视分析',
  TOOLS_CLEAN_PLOTTING: '清除标注',

  //三维 飞行
  FLY: '飞行',
  FLY_ROUTE: '飞行轨迹',
  FLY_ADD_STOPS: '添加站点',
  FLY_AROUND_POINT:'绕点飞行',


  //专题制图 专题图
  THEME: '专题图',
  THEME_UNIFORM_MAP: '统一风格',
  THEME_UNIQUE_VALUES_MAP: '单值风格',
  THEME_RANGES_MAP: '分段风格',
  THEME_UNIFORM_LABLE: '统一标签',
  THEME_UNIQUE_VALUE_LABLE_MAP: '单值标签',
  THEME_RANGES_LABLE_MAP: '分段标签',
  THEME_AREA: '面积图',
  THEME_STEP: '阶梯图',
  THEME_LINE: '折线图',
  THEME_POINT: '散点图',
  THEME_COLUMN: '柱状图',
  THEME_3D_COLUMN: '三维柱状图',
  THEME_PIE: '饼状图',
  THEME_3D_PIE: '三维饼状图',
  THEME_ROSE: '玫瑰图',
  THEME_3D_ROSE: '三维玫瑰图',
  THEME_STACKED_BAR: '堆叠图',
  THEME_3D_STACKED_BAR: '三维堆叠图',
  THEME_RING: '环状图',
  THEME_DOT_DENSITY_MAP: '点密度图',
  THEME_GRADUATED_SYMBOLS_MAP: '等级符号图',

  THEME_HIDE_SYSTEM_FIELDS: '隐藏系统字段',
  THEME_EXPRESSION: '表达式',
  THEME_COLOR_SCHEME: '颜色方案',
  THEME_FONT_SIZE: '字号',
  THEME_FONT: '字体',
  THEME_ROTATION: '旋转角度',
  THEME_COLOR: '颜色',

  THEME_METHOD: '分段方法',
  THEME_EQUAL_INTERVAL: '等距分段',
  THEME_SQURE_ROOT_INTERVAL: '平方根分段',
  THEME_STANDARD_DEVIATION_INTERVAL: '标准差分段',
  THEME_LOGARITHMIC_INTERVAL: '对数分段',
  THEME_QUANTILE_INTERVAL: '等级数分段',
  THEME_MANUAL: '自定义分段',

  THEME_BACK_SHAPE: '背景形状',
  THEME_DEFAULT: '默认',
  THEME_RECTANGLE: '矩形',
  THEME_ROUND_RECTANGLE: '圆角矩形',
  THEME_ELLIPSE: '椭圆',
  THEME_DIAMOND: '菱形',
  THEME_TRIANGLE: '三角形',
  THEME_MARKER_SYMBOL: '点符号',

  THEME_GRANDUATE_BY: '计算方法',
  THEME_CONSTANT: '常量',
  THEME_LOGARITHM: '对数',
  THEME_SQUARE_ROOT: '平方根',
  THEME_MAX_VISIBLE_SIZE: '最大显示值',
  THEME_MIN_VISIBLE_SIZE: '最小显示值',

  DOT_VALUE: '单点代表值',
  GRADUATE_BY: '分级方式',
  DATUM_VALUE: '基准值',
  RANGE_COUNT: '分段个数',

  //外业采集 采集
  CREATE_WITH_SYMBOLS: '普通创建',
  CREATE_WITH_TEMPLATE: '模板创建',

  COLLECTION: '采集',
  COLLECTION_RECENT: '最近',
  COLLECTION_SYMBOL: '符号',
  COLLECTION_GROUP: '分组',
  COLLECTION_UNDO: '撤销',
  COLLECTION_REDO: '重做',
  COLLECTION_CANCEL: '取消',
  COLLECTION_SUBMIT: '提交',
  COLLECTION_METHOD: '采集方式',
  COLLECTION_POINTS_BY_GPS: 'GPS打点式',
  COLLECTION_LINE_BY_GPS: 'GPS轨迹式',
  COLLECTION_POINT_DRAW: '点绘式',
  COLLECTION_FREE_DRAW: '自由式',
  COLLECTION_ADD_POINT: '打点',
  COLLECTION_START: '开始',
  COLLECTION_PAUSE: '暂停',
  COLLECTION_STOP: '停止',

  //外业采集 编辑
  EDIT: '编辑',
  EDIT_ADD_NODES: '添加节点',
  EDIT_NODES: '编辑节点',
  EDIT_DELETE: '删除',
  EDIT_DELETE_NODES: '删除节点',
  EDIT_DELETE_OBJECT: '删除对象',
  EDIT_ERASE: '擦除',
  EDIT_SPLIT: '切割',
  EDIT_UNION: '合并',
  EDIT_DRAW_HOLLOW: '手绘岛洞',
  EDIT_PATCH_HOLLOW: '补充岛洞',
  EDIT_FILL_HOLLOW: '填补岛洞',
  EDIT_CANCEL_SELECTION: '取消选择',
  MOVE: '平移',
  FREE_DRAW_ERASE: '手绘擦除',

  //分享
  SHARE: '分享',
  SHARE_WECHAT: '微信',
  SHARE_FRIENDS: '好友',
  SHARE_EXPLORE: '发现',
}

const Map_Main_Menu_English = {
  START: 'Start',
  START_OPEN_MAP: 'Open Map',
  START_NEW_MAP: 'New Map',
  START_RECENT: 'Recent',
  START_SAVE_MAP: 'Save Map',
  START_SAVE_AS_MAP: 'Save As ',
  START_OPEN_SENCE: 'Open Scene',
  START_NEW_SENCE: 'New Scene',
  START_SAVE_SENCE: 'Save Scene',
  START_SAVE_AS_SENCE: 'Save As ',

  OPEN: 'Add',
  OPEN_DATASOURCE: 'Datasource',
  OPEN_MAP: 'Map',
  OPEN_BACK: 'Back',

  STYLE: 'Styles',
  STYLE_SYMBOL: 'Symbol',
  STYLE_SYMBOL_SIZE: 'Symbol Size',
  STYLE_COLOR: 'Color',
  STYLE_ROTATION: 'Rotation',
  STYLE_TRANSPARENCY: 'Transparency',
  STYLE_LINE_WIDTH: 'Line Width',
  STYLE_FOREGROUND: 'Foreground',
  STYLE_BACKFROUNG: 'Background',
  STYLE_GRADIENT_FILL: 'Gradient fill',
  STYLE_FRAME_COLOR: 'Frame Color',
  STYLE_FRAME_SYMBOL: 'Frame Symbol',
  STYLE_FONT: 'Font',
  STYLE_FONT_SIZE: 'Font Size',
  STYLE_ALIGNMENT: 'Alignment',
  STYLE_FONT_STYLE: 'Font style',
  STYLE_CONTRAST: 'Contrast',
  STYLE_BRIGHTNESS: 'Brightness',
  STYLE_BOLD: 'Bold',
  STYLE_ITALIC: 'Italic',
  STYLE_UNDERLINE: 'Underline',
  STYLE_STRIKEOUT: 'Strikeout',
  STYLE_OUTLINE: 'Outline',
  STYLE_SHADOW: 'Shadow',
  ROTATE_LEFT: 'Rotate Left',
  ROTATE_RIGHT: 'Rotate Right',
  VERTICAL_FLIP: 'Vertical Flip',
  HORIZONTAL_FLIP: 'Horizontal Flip',

  TOOLS: 'Tools',
  TOOLS_DISTANCE_MEASUREMENT: 'Distance Measurement',
  TOOLS_AREA_MEASUREMENT: 'Area Measurement',
  TOOLS_AZIMUTH_MEASUREMENT: 'Azimuth Measurement',
  TOOLS_SELECT: 'Select',
  TOOLS_RECTANGLE_SELECT: 'Rectangle select',
  TOOLS_ROUND_SELECT: 'Round select',
  FULL_SCREEN: 'Full-Screen',

  PLOTS: 'Mark',
  DOT_LINE: 'Dot Line',
  FREE_LINE: 'Free Line',
  DOT_REGION: 'Dot Region',
  FREE_REGION: 'Free Region',
  TOOLS_3D_CREATE_POINT: 'Create Point',
  TOOLS_CREATE_POINT: 'Create Point',
  TOOLS_CREATE_LINE: 'Create Line',
  TOOLS_CREATE_REGION: 'Create Region',
  TOOLS_CREATE_TRACK: 'Create Track',
  TOOLS_CREATE_TEXT: 'Create Text',
  TOOLS_NAME: 'Name',
  TOOLS_REMARKS: 'Remarks',
  TOOLS_HTTP: 'http Address',
  TOOLS_PICTURES: 'Pictures',

  TOOLS_RECTANGLE_CLIP: 'Rectangle Clip',
  TOOLS_CIRCLE_CLIP: 'Circle Clip',
  TOOLS_POLYGON_CLIP: 'Polygon Clip',
  TOOLS_SELECT_OBJECT_AREA_CLIP: 'Select Cbject Area Clip',
  TOOLS_CLIP_INSIDE: 'Clip Inside',
  TOOLS_ERASE: 'Erase',
  TOOLS_EXACT_CLIP: 'Exact Clip',
  TOOLS_TARGET_DATASOURCE: 'Target Datasource',
  TOOLS_UNIFIED_SETTING: 'Unified setting',
  TOOLS_MAGNIFIER: 'Magnifier',
  TOOLS_SELECT_ALL: 'Select All',
  TOOLS_SELECT_REVERSE: 'Select Reverse',
  MAP_CLIP: 'Map Clip',
  CLIP: 'Clip',

  TOOLS_SCENE_SELECT: 'Select',
  TOOLS_PATH_ANALYSIS: 'Path Analysis',
  TOOLS_VISIBILITY_ANALYSIS: 'Visibility Analysis',
  TOOLS_CLEAN_PLOTTING: 'Clean Plotting',

  FLY: 'Fly',
  FLY_ROUTE: 'Flying Route',
  FLY_ADD_STOPS: 'Add Stops',
  FLY_AROUND_POINT:' Fly around point',

  THEME: 'Create',
  THEME_UNIFORM_MAP: 'Uniform Map',
  THEME_UNIQUE_VALUES_MAP: 'Unique Values Map',
  THEME_RANGES_MAP: 'Ranges Map',
  THEME_UNIFORM_LABLE: 'Uniform Label',
  THEME_UNIQUE_VALUE_LABLE_MAP: 'Unique Value Label Map',
  THEME_RANGES_LABLE_MAP: 'Ranges Label Map',
  THEME_AREA: 'Area',
  THEME_STEP: 'Step',
  THEME_LINE: 'Line',
  THEME_POINT: 'Point',
  THEME_COLUMN: 'Column',
  THEME_3D_COLUMN: '3D Column',
  THEME_PIE: 'Pie',
  THEME_3D_PIE: '3D Pie',
  THEME_ROSE: 'Rose',
  THEME_3D_ROSE: '3D Rose',
  THEME_STACKED_BAR: 'Stacked Bar',
  THEME_3D_STACKED_BAR: '3D stacked Bar',
  THEME_RING: 'Ring',
  THEME_DOT_DENSITY_MAP: 'Dot Density Map',
  THEME_GRADUATED_SYMBOLS_MAP: 'Graduated Symbols Map',

  THEME_HIDE_SYSTEM_FIELDS: 'Hide system fields',
  THEME_EXPRESSION: 'Expression',
  THEME_COLOR_SCHEME: 'Color Scheme',
  THEME_FONT_SIZE: 'Font Size',
  THEME_FONT: 'Font',
  THEME_ROTATION: 'Rotation',
  THEME_COLOR: 'Color',

  THEME_METHOD: 'Method',
  THEME_EQUAL_INTERVAL: 'Equal Interval',
  THEME_SQURE_ROOT_INTERVAL: 'Squre Root Interval',
  THEME_STANDARD_DEVIATION_INTERVAL: 'Standard Deviation Interval',
  THEME_LOGARITHMIC_INTERVAL: 'Logarithmic Interval',
  THEME_QUANTILE_INTERVAL: 'Quantile Interval',
  THEME_MANUAL: 'Manual',

  THEME_BACK_SHAPE: 'Back Shape',
  THEME_DEFAULT: 'Default',
  THEME_RECTANGLE: 'Rectangle',
  THEME_ROUND_RECTANGLE: 'Round Rectangle',
  THEME_ELLIPSE: 'Ellipse',
  THEME_DIAMOND: 'Diamond',
  THEME_TRIANGLE: 'Triangle',
  THEME_MARKER_SYMBOL: 'Marker Symbol',

  THEME_GRANDUATE_BY: 'Granduate by',
  THEME_CONSTANT: 'Constant',
  THEME_LOGARITHM: 'Logarithm',
  THEME_SQUARE_ROOT: 'Square Root',
  THEME_MAX_VISIBLE_SIZE: 'Max Visible Size',
  THEME_MIN_VISIBLE_SIZE: 'Min Visible Size',

  DOT_VALUE: 'Dot Value',
  GRADUATE_BY: 'Graduate by',
  DATUM_VALUE: 'Datum Value',
  RANGE_COUNT: 'Range Count',

  CREATE_WITH_SYMBOLS: 'Create with Symbols',
  CREATE_WITH_TEMPLATE: 'Create with Template',
  COLLECTION: 'Collect',
  COLLECTION_RECENT: 'Recent',
  COLLECTION_SYMBOL: 'Symbol',
  COLLECTION_GROUP: 'Group',
  COLLECTION_UNDO: 'Undo',
  COLLECTION_REDO: 'Redo',
  COLLECTION_CANCEL: 'Cancel',
  COLLECTION_SUBMIT: 'Submit',
  COLLECTION_METHOD: 'Collection Method',
  COLLECTION_POINTS_BY_GPS: 'Collect points by GPS',
  COLLECTION_LINE_BY_GPS: 'Collect line by GPS',
  COLLECTION_POINT_DRAW: 'Point Draw',
  COLLECTION_FREE_DRAW: 'Free Draw',
  COLLECTION_ADD_POINT: 'Add Points',
  COLLECTION_START: 'Start',
  COLLECTION_PAUSE: 'Pause',
  COLLECTION_STOP: 'Stop',

  EDIT: 'Edit',
  EDIT_ADD_NODES: 'Add Nodes',
  EDIT_NODES: 'Edit Nodes',
  EDIT_DELETE: 'Delete',
  EDIT_DELETE_NODES: 'Delete Nodes',
  EDIT_DELETE_OBJECT: 'Delete Object',
  EDIT_ERASE: 'Erase',
  EDIT_SPLIT: 'Split',
  EDIT_UNION: 'Union',
  EDIT_DRAW_HOLLOW: 'Draw Hollow',
  EDIT_PATCH_HOLLOW: 'Patch Hollow',
  EDIT_FILL_HOLLOW: 'Fill Hollow',
  EDIT_CANCEL_SELECTION: 'Cancel Selection',
  MOVE: 'Move',
  FREE_DRAW_ERASE: 'Free-draw Erase',

  SHARE: 'Share',
  SHARE_WECHAT: 'Wechat',
  SHARE_FRIENDS: 'Friends',
  SHARE_EXPLORE: 'Explore',
}

//图层
const Map_Layer_Chinese = {
  PLOTS: '我的标注',
  PLOTS_IMPORT: '导入标注',
  PLOTS_DELETE: '删除标注',
  PLOTS_SET_AS_CURRENT: '设置为当前标注',

  LAYERS: '我的图层',
  LAYERS_MOVE_UP: '上移',
  LAYERS_MOVE_DOWN: '下移',
  LAYERS_TOP: '置顶',
  LAYERS_BOTTOM: '置底',
  LAYERS_LONG_PRESS: '长按拖动排序',
  LAYERS_SET_AS_CURRENT_LAYER: '设置为当前图层',
  LAYERS_LAYER_STYLE: '图层风格',
  LAYERS_FULL_EXTENT: '全幅显示本图层',
  LAYERS_SET_VISIBLE_SCALE: '可见比例尺范围',
  LAYERS_RENAME: '重命名',
  LAYERS_COPY: '复制',
  LAYERS_PASTE: '插入复制的图层',
  LAYERS_LAYER_PROPERTIES: '图层属性',
  LAYERS_REMOVE: '移除',
  LAYERS_MAXIMUM: '最大可见比例尺',
  LAYERS_MINIMUM: '最小可见比例尺',
  LAYERS_UER_DEFINE: '自定义',
  LAYERS_SET_AS_CURRENT_SCALE: '设置为当前比例尺',
  LAYERS_CLEAR: '清除',
  LAYERS_LAYER_NAME: '图层标题',
  LAYERS_COMPLETE_LINE: '显示完整线型',
  LAYERS_OPTIMIZE_CROSS: '十字路口优化',
  LAYERS_ANTIALIASING: '反走样显示',
  LAYERS_SHOW_OVERLAYS: '显示压盖对象',
  LAYERS_SCALE_SYMBOL: '符号随图缩放',
  LAYERS_SCALE: '缩放基准比例尺',
  LAYERS_MIN_OBJECT_SIZE: '对象最小尺寸',
  LAYERS_FILTER_OVERLAPPING_SMALL_OBJECTS: '抽稀显示',

  //专题图图层
  LAYERS_CREAT_THEMATIC_MAP: '制作专题图',
  LAYERS_MODIFY_THEMATIC_MAP: '修改专题图',

  BASEMAP: '我的底图',
  BASEMAP_SWITH: '切换底图',
  MY_TERRAIN: '我的地形',

  //3D图层
  OPTIONAL: '设置图层可选',
  NOT_OPTIONAL: '设置图层不可选',
}

const Map_Layer_English = {
  PLOTS: 'My Plots',
  PLOTS_IMPORT: 'Import Marks',
  PLOTS_DELETE: 'Delete Marks',
  PLOTS_SET_AS_CURRENT: 'Set As Current Marks',

  LAYERS: 'My Layers',
  LAYERS_MOVE_UP: 'Move up',
  LAYERS_MOVE_DOWN: 'Move down',
  LAYERS_TOP: 'Top',
  LAYERS_BOTTOM: 'Bottom',
  LAYERS_LONG_PRESS: 'Long Press and Drag to Sort',
  LAYERS_SET_AS_CURRENT_LAYER: 'Set As Current Layer',
  LAYERS_LAYER_STYLE: 'Layer Style',
  LAYERS_FULL_EXTENT: 'Full Extent',
  LAYERS_SET_VISIBLE_SCALE: 'Set Visible Scale',
  LAYERS_RENAME: 'Rename',
  LAYERS_COPY: 'Copy',
  LAYERS_PASTE: 'Paste',
  LAYERS_LAYER_PROPERTIES: 'Layer Properties',
  LAYERS_REMOVE: 'Remove',
  LAYERS_MAXIMUM: 'Maximum Visible Scale',
  LAYERS_MINIMUM: 'Minimum Visible Scale',
  LAYERS_UER_DEFINE: 'User Define',
  LAYERS_SET_AS_CURRENT_SCALE: 'Set as Current Scale',
  LAYERS_CLEAR: 'Clear',
  LAYERS_LAYER_NAME: 'Layer Name',
  LAYERS_COMPLETE_LINE: 'Complete Line',
  LAYERS_OPTIMIZE_CROSS: 'Optimize Cross',
  LAYERS_ANTIALIASING: 'Antialiasing',
  LAYERS_SHOW_OVERLAYS: 'Show Overlays',
  LAYERS_SCALE_SYMBOL: 'Scale Symbol',
  LAYERS_SCALE: 'Scale',
  LAYERS_MIN_OBJECT_SIZE: 'Min Object Size',
  LAYERS_FILTER_OVERLAPPING_SMALL_OBJECTS: 'Filter Overlapping Small Objects',

  LAYERS_CREAT_THEMATIC_MAP: 'Creat Thematic Map',
  LAYERS_MODIFY_THEMATIC_MAP: 'Modify Thematic Map',

  BASEMAP: 'My Basemap',
  BASEMAP_SWITH: 'Switch Basemap',
  MY_TERRAIN: 'My Terrain',

  OPTIONAL: 'Optional',
  NOT_OPTIONAL: 'Not Optional',
}

//属性
const Map_Attribute_Chinese = {
  ATTRIBUTE_SORT: '排序',
  ATTRIBUTE_LOCATION: '定位',
  ATTRIBUTE_CANCEL: '取消',
  ATTRIBUTE_EDIT: '编辑',
  ATTRIBUTE_STATISTIC: '统计',
  ATTRIBUTE_ASSOCIATION: '关联',
  ATTRIBUTE_NO: '序号',
  ATTRIBUTE_CURRENT: '当前位置',
  ATTRIBUTE_FIRST_RECORD: '定位到首行',
  ATTRIBUTE_LAST_RECORD: '定位到末行',
  ATTRIBUTE_RELATIVE: '相对位置',
  ATTRIBUTE_ABSOLUTE: '绝对位置',
  ATTRIBUTE_UNDO: '撤销',
  ATTRIBUTE_REDO: '恢复',
  ATTRIBUTE_REVERT: '还原',
}

const Map_Attribute_English = {
  ATTRIBUTE_SORT: 'Sort',
  ATTRIBUTE_LOCATION: 'Location',
  ATTRIBUTE_EDIT: 'Edit',
  ATTRIBUTE_STATISTIC: 'Statistic',
  ATTRIBUTE_ASSOCIATION: 'Association',
  ATTRIBUTE_NO: 'NO.',
  ATTRIBUTE_CURRENT: 'Current',
  ATTRIBUTE_FIRST_RECORD: 'First record',
  ATTRIBUTE_LAST_RECORD: 'Last record',
  ATTRIBUTE_RELATIVE: 'Relative',
  ATTRIBUTE_ABSOLUTE: 'Absolute',
  ATTRIBUTE_UNDO: 'Undo',
  ATTRIBUTE_REDO: 'Redo',
  ATTRIBUTE_REVERT: 'Revert',
}

//地图设置
const Map_Setting_Chinese = {
  BASIC_SETTING: '基本设置',
  ROTATION_GRSTURE: '手势旋转',
  PITCH_GESTURE: '手势俯仰',

  //效果设置
  EFFRCT_SETTINFS: '效果设置',
  ANTI_ALIASING_MAP: '反走样地图',
  SHOW_OVERLAYS: '显示压盖对象',

  //范围设置
  BOUNDS_SETTING: '范围设置',
  FIX_SCALE: '固定比例尺',

  //三维场景设置
  SCENE_NAME: '场景名称',
  FOV: '相机角度',
  SCENE_OPERATION_STATUS: '场景操作状态',
  VIEW_MODE: '视图模式',
  TERRAIN_SCALE: '地形缩放比例',
  SPHERICAL: '球面',
}

const Map_Setting_English = {
  BASIC_SETTING: 'Basic settings',
  ROTATION_GRSTURE: 'Rotation Gesture',
  PITCH_GESTURE: 'Pitch Gesture',

  //效果设置
  EFFRCT_SETTINFS: 'Effect Settings',
  ANTI_ALIASING_MAP: 'Anti-aliasing Map',
  SHOW_OVERLAYS: 'Show Overlays',

  //范围设置
  BOUNDS_SETTING: 'Bounds settings',
  FIX_SCALE: 'Fixed Scale',

  //三维场景设置
  SCENE_NAME: 'Scene Name',
  FOV: 'FOV',
  SCENE_OPERATION_STATUS: 'Scene Operation Status',
  VIEW_MODE: 'View Mode',
  TERRAIN_SCALE: 'Terrain Scale',
  SPHERICAL: 'Spherical',
}

export {
  Map_Main_Menu_Chinese,
  Map_Main_Menu_English,
  Map_Lable_Chinese,
  Map_Lable_English,
  Map_Layer_Chinese,
  Map_Layer_English,
  Map_Attribute_Chinese,
  Map_Attribute_English,
  Map_Setting_Chinese,
  Map_Setting_English,
}
