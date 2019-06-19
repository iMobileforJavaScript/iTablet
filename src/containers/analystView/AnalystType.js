const Analyst_Types = {
  BUFFER_ANALYST: 1,
  OVERLAY_ANALYST: 2,
  ONLINE_ANALYST: 3,
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
