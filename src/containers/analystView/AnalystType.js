const Analyst_Types = {
  BUFFER_ANALYSIS: 1,
  OVERLAY_ANALYSIS: 2,
  ONLINE_ANALYSIS: 3,
  OPTIMAL_PATH: 4,
  CONNECTIVITY_ANALYSIS: 5,
  FIND_TSP_PATH: 6,
  THIESSEN_POLYGON: 7,
  MEASURE_DISTANCE: 8,
  INTERPOLATION_ANALYSIS: 9,
}

const AggregatePointParams = {
  AGGREGATE_TYPE: 'AGGREGATE_TYPE',
  MESH_TYPE: 'MESH_TYPE',
  WEIGHT: 'WEIGHT', // 多选
  STATISTIC_MODE: 'STATISTIC_MODE', // 多选
  RANGE_MODE: 'RANGE_MODE',
  COLOR_GRADIENT_TYPE: 'COLOR_GRADIENT_TYPE',
}

const DensityParams = {
  ANALYST_METHOD: 'ANALYST_METHOD',
  MESH_TYPE: 'MESH_TYPE',
  WEIGHT: 'WEIGHT', // 多选
  RANGE_MODE: 'RANGE_MODE',
  AREA_UNIT: 'AREA_UNIT',
  COLOR_GRADIENT_TYPE: 'COLOR_GRADIENT_TYPE',
}
export { Analyst_Types, AggregatePointParams, DensityParams }
