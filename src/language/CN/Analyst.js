const Analyst_Modules = {
  BUFFER_ANALYSIS: '缓冲分析',
  BUFFER_ANALYSIS_2: '缓冲区分析',
  BUFFER_ANALYST_SINGLE: '单缓冲区',
  BUFFER_ANALYST_MULTIPLE: '多重缓冲区',
  OVERLAY_ANALYSIS: '叠加分析',
  THIESSEN_POLYGON: '泰森多边形',
  MEASURE_DISTANCE: '距离计算',
  ONLINE_ANALYSIS: '在线分析',
  INTERPOLATION_ANALYSIS: '插值分析',

  OPTIMAL_PATH: '路径分析',
  CONNECTIVITY_ANALYSIS: '连通性分析',
  FIND_TSP_PATH: '商旅分析',
  TRACING_ANALYSIS: '追踪分析',
}

const Analyst_Methods = {
  CLIP: '裁剪',
  UNION: '合并',
  ERASE: '擦除',
  INTERSECT: '求交',
  IDENTITY: '同一',
  XOR: '对称差',
  UPDATE: '更新',

  DENSITY: '密度分析',
  AGGREGATE_POINTS_ANALYSIS: '点聚合分析',
}

const Analyst_Labels = {
  ANALYST: '分析',
  CONFIRM: '确定',
  RESET: '重置',
  CANCEL: '取消',
  NEXT: '下一步',
  PREVIOUS: '上一步',
  ADD: '添加',
  Edit: '修改',

  // local
  USE_AN_EXISTING_NETWORK_DATASET: '使用现有网络数据集',
  BUILD_A_NETWORK_DATASET: '新建二维网络数据集',
  CHOOSE_DATA: '选择数据',
  TOPOLOGY: '拓扑构网',
  ADD_DATASET: '添加数据集',
  DONE: '确定',
  RESULT_FIELDS: '字段设置',
  SPLIT_SETTINGS: '打断设置',
  SPLIT_LINE_BY_POINT: '点自动打断线',
  SPLIT_LINES_AT_INTERSECTION: '线线自动打断',

  SET_START_STATION: '设置起点',
  MIDDLE_STATIONS: '添加途经点',
  SET_END_STATION: '设置终点',
  LOCATION: '选中位置',
  SET_AS_START_STATION: '设置起点',
  SET_AS_END_STATION: '设置终点',
  ADD_STATIONS: '添加站点',
  ADD_BARRIER_NODES: '添加障碍点',
  ADD_NODES: '添加节点',
  UPSTREAM_TRACKING: '上游追踪',
  DOWNSTREAM_TRACKING: '下游追踪',
  CLEAR: '清除',
  START_STATION: '起点',
  MIDDLE_STATION: '途经点',
  END_STATION: '终点',
  BARRIER_NODE: '障碍点',
  NODE: '站点',

  BUFFER_ZONE: '缓冲区',
  MULTI_BUFFER_ZONE: '多重缓冲区',
  DATA_SOURCE: '数据源',
  DATA_SET: '数据集',
  SELECTED_OBJ_ONLY: '只针对被选对象进行缓冲操作',
  BUFFER_TYPE: '缓冲类型',
  BUFFER_ROUND: '圆头缓冲',
  BUFFER_FLAT: '平头缓冲',
  BUFFER_RADIUS: '缓冲半径',
  RESULT_SETTINGS: '结果设置',
  BUFFER_UNION: '合并缓冲区',
  KEEP_ATTRIBUTES: '保留原对象字段属性',
  DISPLAY_IN_MAP: '在地图中展示',
  DISPLAY_IN_SCENE: '在场景中展示',
  SEMICIRCLE_SEGMENTS: '半圆弧线段数',
  RING_BUFFER: '生成环状缓冲区',
  RESULT_DATA: '结果数据',
  BATCH_ADD: '批量添加',
  START_VALUE: '起始值',
  END_VALUE: '结束值',
  STEP: '步长',
  RANGE_COUNT: '段数',
  INSERT: '插入',
  DELETE: '删除',
  INDEX: '序号',
  RADIUS: '半径',
  RESULT_DATASET_NAME: '结果数据集名称',
  GO_TO_SET: '去设置',

  SOURCE_DATA: '源数据',
  OVERLAY_DATASET: '叠加数据',
  SET_FIELDS: '字段设置',
  FIELD_NAME: '字段名称',

  ISERVER_LOGIN: '登录iServer',
  ISERVER: 'iServer服务地址',
  SOURCE_DATASET: '源数据',

  ANALYSIS_PARAMS: '分析参数',
  ANALYSIS_METHOD: '分析方法',
  Mesh_Type: '网格面类型',
  WEIGHT_FIELD: '权重字段',
  ANALYSIS_BOUNDS: '分析范围',
  MESH_SIZE: '网格大小',
  SEARCH_RADIUS: '搜索半径',
  AREA_UNIT: '面积单位',
  STATISTIC_MODE: '统计模式',
  NUMERIC_PRECISION: '数字精度',
  AGGREGATE_TYPE: '聚合类型',

  THEMATIC_PARAMS: '专题图参数',
  INTERVAL_MODE: '分段模式',
  NUMBER_OF_SEGMENTS: '分段个数',
  COLOR_GRADIENT: '颜色渐变模式',

  Input_Type: '输入方式',
  Dataset: '数据集',

  NOT_SET: '未设置',
  ALREADY_SET: '已设置',

  ADD_WEIGHT_STATISTIC: '增加权重字段',

  // 方向
  LEFT: '左',
  DOWN: '下',
  RIGHT: '右',
  UP: '上',

  // 邻近分析
  DISPLAY_REGION_SETTINGS: '显示区域设置',
  CUSTOM_LOCALE: '自定义区域',
  SELECT_REGION: '选择面',
  DRAW_REGION: '绘制面',
  MEASURE_DISTANCE: '距离计算',
  REFERENCE_DATASET: '邻近数据',
  PARAMETER_SETTINGS: '参数设置',
  MEASURE_TYPE: '计算方式',
  MIN_DISTANCE_2: '最近距离',
  DISTANCE_IN_RANGE: '范围内距离',
  QUERY_RANGE: '查询范围',
  MIN_DISTANCE: '最小距离',
  MAX_DISTANCE: '最大距离',
  ASSOCIATE_BROWSING_RESULT: '关联浏览结果',

  // 插值分析
  INTERPOLATION_METHOD: '插值方法',
  INTERPOLATION_FIELD: '插值字段',
  SCALE_FACTOR: '缩放比例',
  RESOLUTION: '分辨率',
  PIXEL_FORMAT: '像素格式',
  INTERPOLATION_BOUNDS: '插值范围',
  SAMPLE_POINT_SETTINGS: '样本点查找设置',
  SEARCH_MODE: '查找方式',
  MAX_RADIUS: '最大半径',
  SEARCH_RADIUS_2: '查找半径',
  SEARCH_POINT_COUNT: '查找点数',
  MIX_COUNT: '最小点数',
  MOST_INVOLVED: '最多参与点数',
  MOST_IN_BLOCK: '块内最多点数',
  OTHER_PARAMETERS: '其他参数',
  POWER: '幂次',
  TENSION: '张力系数',
  SMOOTHNESS: '光滑系数',
  SEMIVARIOGRAM: '半变异函数',
  ROTATION: '旋转角度',
  SILL: '基台值',
  RANGE: '自相关阈值',
  NUGGET_EFFECT: '块金效应值',
  MEAN: '平均值',
  EXPONENT: '阶数',
  HISTOGRAM: '直方图',
  FUNCTION: '变换函数',
  SHOW_STATISTICS: '显示统计信息',
  EXPORT_TO_ALBUM: '保存到相册',
}

const Analyst_Params = {
  // 缓冲区分析
  BUFFER_LEFT_AND_RIGHT: '双侧缓冲',
  BUFFER_LEFT: '左缓冲',
  BUFFER_RIGHT: '右缓冲',

  // 分析方法
  SIMPLE_DENSITY_ANALYSIS: '简单点密度分析',
  KERNEL_DENSITY_ANALYSIS: '核密度分析',

  // 网格面类型
  QUADRILATERAL_MESH: '四边形网格',
  HEXAGONAL_MESH: '六边形网格',

  // 分段模式
  EQUIDISTANT_INTERVAL: '等距离分段',
  LOGARITHMIC_INTERVAL: '对数分段',
  QUANTILE_INTERVAL: '等计数分段',
  SQUARE_ROOT_INTERVAL: '平方根分段',
  STANDARD_DEVIATION_INTERVAL: '标准差分段',

  // 长度单位
  METER: '米',
  KILOMETER: '千米',
  YARD: '码',
  FOOT: '英尺',
  MILE: '英里',

  // 面积单位
  SQUARE_MILE: '平方英里',
  SQUARE_METER: '平方米',
  SQUARE_KILOMETER: '平方千里',
  HECTARE: '公顷',
  ARE: '公亩',
  ACRE: '英亩',
  SQUARE_FOOT: '平方英尺',
  SQUARE_YARD: '平方码',

  // 颜色渐变模式
  GREEN_ORANGE_PURPLE_GRADIENT: '绿橙紫渐变色',
  GREEN_ORANGE_RED_GRADIENT: '绿橙红渐变',
  RAINBOW_COLOR: '彩虹色',
  SPECTRAL_GRADIENT: '光谱渐变',
  TERRAIN_GRADIENT: '地形渐变',

  // 统计模式
  MAX: '最大值',
  MIN: '最小值',
  AVERAGE: '平均值',
  SUM: '求和',
  VARIANCE: '方差',
  STANDARD_DEVIATION: '标准差',

  // 聚合类型
  AGGREGATE_WITH_GRID: '网格面聚合',
  AGGREGATE_WITH_REGION: '多边形聚合',

  // 插值方法
  IDW: '距离反比权重',
  SPLINE: '样条',
  ORDINARY_KRIGING: '普通克吕金',
  SIMPLE_KRIGING: '简单克吕金',
  UNIVERSAL_KRIGING: '泛克吕金',

  // 像素格式
  UBIT1: '1位无符号',
  UBIT16: '16位',
  UBIT32: '32位',
  SINGLE: '单精度浮点型',
  DOUBLE: '双精度浮点型',

  // 查找方法
  SEARCH_VARIABLE_LENGTH: '变长查找',
  SEARCH_FIXED_LENGTH: '定长查找',
  SEARCH_BLOCK: '块查找',

  // 半变异函数
  SPHERICAL: '球函数	',
  EXPONENTIAL: '指数函数',
  GAUSSIAN: '高斯函数',
}

const Analyst_Prompt = {
  ANALYSING: '分析中',
  ANALYSIS_START: '开始分析',
  ANALYSIS_SUCCESS: '分析成功',
  ANALYSIS_FAIL: '分析失败',
  PLEASE_CONNECT_TO_ISERVER: '请连接iServer服务器',
  PLEASE_CHOOSE_INPUT_METHOD: '请选择输入方式',
  PLEASE_CHOOSE_DATASET: '请选择数据集',
  LOGIN_ISERVER_FAILED: '连接iServer服务器失败，请检查ip地址和用户名密码',
  BEING_ANALYZED: '正在分析',
  ANALYZING_FAILED: '分析失败',
  LOADING_MODULE: '正在加载模块',
  LOADING_MODULE_FAILED: '加载模块失败，请检查数据集',
  TWO_NODES_ARE_CONNECTED: '两点连通',
  TWO_NODES_ARE_NOT_CONNECTED: '两点不连通',
  NOT_FIND_SUITABLE_PATH: '没有查找到合适的路径',
  SELECT_DATA_SOURCE_FIRST: '请先选择数据源',
  SELECT_DATA_SET_FIRST: '请先选择数据数据集',
  PLEASE_SELECT_A_REGION: '请选择一个面',
}

export {
  Analyst_Modules,
  Analyst_Methods,
  Analyst_Labels,
  Analyst_Params,
  Analyst_Prompt,
}
