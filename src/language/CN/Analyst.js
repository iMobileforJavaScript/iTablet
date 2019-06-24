const Analyst_Modules = {
  BUFFER_ANALYST: '缓冲分析',
  BUFFER_ANALYST_2: '缓冲区分析',
  OVERLAY_ANALYST: '叠加分析',
  ONLINE_ANALYST: '在线分析',
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
  CANCEL: '取消',
  NEXT: '下一步',
  PREVIOUS: '上一步',
  ADD: '添加',
  Edit: '修改',

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
}

const Analyst_Prompt = {
  PLEASE_CONNECT_TO_ISERVER: '请连接iServer服务器',
  PLEASE_CHOOSE_INPUT_METHOD: '请选择输入方式',
  PLEASE_CHOOSE_DATASET: '请选择数据集',
  LOGIN_ISERVER_FAILED: '连接iServer服务器失败，请检查ip地址和用户名密码',
  BEING_ANALYZED: '正在分析',
  ANALYZING_FAILED: '分析失败',
}

export {
  Analyst_Modules,
  Analyst_Methods,
  Analyst_Labels,
  Analyst_Params,
  Analyst_Prompt,
}
