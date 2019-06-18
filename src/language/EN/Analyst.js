const Analyst_Modules = {
  BUFFER_ANALYST: 'Buffer Analyst',
  BUFFER_ANALYST_2: 'Buffer Analyst',
  OVERLAY_ANALYST: 'Overlay Analyst',
  ONLINE_ANALYST: 'Online Analyst',
}

const Analyst_Methods = {
  CLIP: 'Clip',
  UNION: 'Union',
  ERASE: 'Erase',
  INTERSECT: 'Intersect',
  IDENTITY: 'Identity',
  XOR: 'XOR',
  UPDATE: 'Update',

  DENSITY: 'Density Analysis',
  AGGREGATE_POINTS_ANALYSIS: 'Aggregate Points Analysis',
}

const Analyst_Labels = {
  ANALYST: 'Analyst',
  CONFIRM: 'Confirm',
  CANCEL: 'Cancel',
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  ADD: 'Add',
  Edit: 'Edit',

  BUFFER_ZONE: 'Buffer',
  MULTI_BUFFER_ZONE: 'Multi-buffer',
  DATA_SOURCE: 'Datasource',
  DATA_SET: 'Dataset',
  SELECTED_OBJ_ONLY: 'Selected Objects Only',
  BUFFER_TYPE: 'Buffer Type',
  BUFFER_ROUND: 'Round',
  BUFFER_FLAT: 'Flat',
  BUFFER_RADIUS: 'Radius',
  RESULT_SETTINGS: 'Result Settings',
  BUFFER_UNION: 'Union Buffer',
  KEEP_ATTRIBUTES: 'Keep Attributes',
  DISPLAY_IN_MAP: 'Display in Map',
  DISPLAY_IN_SCENE: 'Display in Scene',
  SEMICIRCLE_SEGMENTS: 'Semicircle Segments',
  RING_BUFFER: 'Ring Buffer',
  RESULT_DATA: 'Result Data',
  BATCH_ADD: 'Batch Add',
  START_VALUE: 'Start Value',
  END_VALUE: 'End Value',
  STEP: 'Step',
  RANGE_COUNT: 'Range Count',
  INSERT: 'Insert',
  DELETE: 'Delete',
  INDEX: 'Index',
  RADIUS: 'Radius',
  RESULT_DATASET_NAME: 'Name of Result Dataset',
  GO_TO_SET: 'Go to set',

  SOURCE_DATA: 'Source Data',
  OVERLAY_DATASET: 'Overlay Dataset',
  SET_FIELDS: 'Set Fields',
  FIELD_NAME: 'Field Name',

  ISERVER_LOGIN: 'Login iServer',
  ISERVER: 'iServer URL',
  SOURCE_DATASET: 'Source Dataset',

  ANALYSIS_PARAMS: 'Analysis Parameters',
  ANALYSIS_METHOD: 'Analysis Method',
  Mesh_Type: 'Mesh Type',
  WEIGHT_FIELD: 'Weight Field',
  ANALYSIS_BOUNDS: 'Analysis Bounds',
  MESH_SIZE: 'Mesh Size',
  SEARCH_RADIUS: 'Radius',
  AREA_UNIT: 'Area Units',
  STATISTIC_MODE: 'Statistic Mode',
  NUMERIC_PRECISION: 'Numeric Precision',
  AGGREGATE_TYPE: 'Aggregate Type',

  THEMATIC_PARAMS: 'Thematic Parameters',
  INTERVAL_MODE: 'Interval Mode',
  NUMBER_OF_SEGMENTS: 'Number of Segments',
  COLOR_GRADIENT: 'Color Gradient Mode',

  Input_Type: 'Input Type',
  Dataset: 'Dataset',

  NOT_SET: 'Not Set',
  ALREADY_SET: 'Already Set',

  ADD_WEIGHT_STATISTIC: 'Add Weighted Field',

  // 方向
  LEFT: 'Left',
  DOWN: 'Down',
  RIGHT: 'Right',
  UP: 'Up',
}

const Analyst_Params = {
  // 缓冲区分析
  BUFFER_LEFT_AND_RIGHT: 'Left and Right',
  BUFFER_LEFT: 'Left',
  BUFFER_RIGHT: 'Right',

  // 分析方法
  SIMPLE_DENSITY_ANALYSIS: 'Simple Density Analysis',
  KERNEL_DENSITY_ANALYSIS: 'Kernel Density Analysis',

  // 网格面类型
  QUADRILATERAL_MESH: 'Quadrilateral Mesh',
  HEXAGONAL_MESH: 'Hexagonal Mesh',

  // 分段模式
  EQUIDISTANT_INTERVAL: 'Equidistant Interval',
  LOGARITHMIC_INTERVAL: 'Logarithmic Interval',
  QUANTILE_INTERVAL: 'Quantile Interval',
  SQUARE_ROOT_INTERVAL: 'Square Root Interval',
  STANDARD_DEVIATION_INTERVAL: 'Standard Deviation Interval',

  // 长度单位
  METER: 'm',
  KILOMETER: 'km',
  YARD: 'yd',
  FOOT: 'ft',
  MILE: 'mile',

  // 面积单位
  SQUARE_MILE: 'mile²',
  SQUARE_METER: 'm²',
  SQUARE_KILOMETER: 'km²',
  HECTARE: 'ha',
  ARE: 'are',
  ACRE: 'acre',
  SQUARE_FOOT: 'ft²',
  SQUARE_YARD: 'yd²',

  // 颜色渐变模式
  GREEN_ORANGE_PURPLE_GRADIENT: 'Green Orange Purple Gradient',
  GREEN_ORANGE_RED_GRADIENT: 'Green Orange Red Gradient',
  RAINBOW_COLOR: 'Rainbow Color',
  SPECTRAL_GRADIENT: 'Spectral Gradient',
  TERRAIN_GRADIENT: 'Terrain Gradient',

  // 统计模式
  MAX: 'Max',
  MIN: 'Min',
  AVERAGE: 'Average',
  SUM: 'Sum',
  VARIANCE: 'Variance',
  STANDARD_DEVIATION: 'Standard Deviation',

  // 聚合类型
  AGGREGATE_WITH_GRID: 'Aggregate with Grid',
  AGGREGATE_WITH_REGION: 'Aggregate with Region',
}

const Analyst_Prompt = {
  PLEASE_CONNECT_TO_ISERVER: 'Please connect to iServer',
  PLEASE_CHOOSE_INPUT_METHOD: 'Please choose input method',
  PLEASE_CHOOSE_DATASET: 'Please choose dataset',
  LOGIN_ISERVER_FAILED:
    'Failed to connect iServer, please check ip, username and password',
  BEING_ANALYZED: 'Being analyzed',
  ANALYZING_FAILED: 'Analyzing failed',
}

export {
  Analyst_Modules,
  Analyst_Methods,
  Analyst_Labels,
  Analyst_Params,
  Analyst_Prompt,
}
