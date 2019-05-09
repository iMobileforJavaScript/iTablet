//制图

const Map_Label = {
  //地图底部导航
  MAP: '地图',
  LAYER: '图层',
  ATTRIBUTE: '属性',
  SETTING: '设置',
  SCENE: '场景',
  NAME: '名称',
}

//地图、场景主菜单
const Map_Main_Menu = {
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

  //图例设置
  LEGEND_COLUMN: '列数',
  LEGEND_WIDTH: '宽度',
  LEGEND_HEIGHT: '高度',
  LEGEND_COLOR: '填充色',

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
  CAMERA: '多媒体采集',

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
  FLY_AROUND_POINT: '绕点飞行',

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

//图层
const Map_Layer = {
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

  VISIBLE: '设置图层可见',
  NOT_VISIBLE: '设置图层不可见',
  OPTIONAL: '设置图层可选',
  NOT_OPTIONAL: '设置图层不可选',
  EDITABLE: '设置图层可编辑',
  NOT_EDITABLE: '设置图层不可编辑',
  SNAPABLE: '设置图层可捕获',
  NOT_SNAPABLE: '设置图层不可捕获',
  //专题图图层
  LAYERS_CREAT_THEMATIC_MAP: '制作专题图',
  LAYERS_MODIFY_THEMATIC_MAP: '修改专题图',

  BASEMAP: '我的底图',
  BASEMAP_SWITH: '切换底图',
  MY_TERRAIN: '我的地形',
}

//属性
const Map_Attribute = {
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

//地图设置
const Map_Setting = {
  BASIC_SETTING: '基本设置',
  ROTATION_GESTURE: '手势旋转',
  PITCH_GESTURE: '手势俯仰',
  THEME_LEGEND: '专题图图例',

  //效果设置
  EFFECT_SETTINGS: '效果设置',
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

export { Map_Main_Menu, Map_Label, Map_Layer, Map_Attribute, Map_Setting }
