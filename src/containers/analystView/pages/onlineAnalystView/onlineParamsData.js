import { getLanguage } from '../../../../language'

/**
 * 分析方法
 * @param language
 * @returns {[*,*]}
 */
function getAnalysisMethod(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.SIMPLE_DENSITY_ANALYSIS,
      value: 0,
    },
    {
      key: getLanguage(language).Analyst_Params.KERNEL_DENSITY_ANALYSIS,
      value: 1,
    },
  ]
}

/**
 * 网格面类型
 * @param language
 * @returns {[*,*]}
 */
function getMeshType(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.QUADRILATERAL_MESH,
      value: 0,
    },
    {
      key: getLanguage(language).Analyst_Params.HEXAGONAL_MESH,
      value: 1,
    },
  ]
}

/**
 * 网格面类型
 * @param language
 * @returns {[*,*]}
 */
function getAreaUnit(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.SQUARE_MILE,
      value: 'SquareMile',
    },
    {
      key: getLanguage(language).Analyst_Params.SQUARE_METER,
      value: 'SquareMeter',
    },
    {
      key: getLanguage(language).Analyst_Params.SQUARE_KILOMETER,
      value: 'SquareKiloMeter',
    },
    {
      key: getLanguage(language).Analyst_Params.HECTARE,
      value: 'Hectare',
    },
    {
      key: getLanguage(language).Analyst_Params.ARE,
      value: 'Are',
    },
    {
      key: getLanguage(language).Analyst_Params.ACRE,
      value: 'Acre',
    },
    {
      key: getLanguage(language).Analyst_Params.SQUARE_FOOT,
      value: 'SquareFoot',
    },
    {
      key: getLanguage(language).Analyst_Params.SQUARE_YARD,
      value: 'SquareYard',
    },
  ]
}

/**
 * 分段模式
 * @param language
 * @returns {[*,*,*,*,*]}
 */
function getRangeMode(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.EQUIDISTANT_INTERVAL,
      value: 'EQUALINTERVAL',
    },
    {
      key: getLanguage(language).Analyst_Params.LOGARITHMIC_INTERVAL,
      value: 'LOGARITHM',
    },
    {
      key: getLanguage(language).Analyst_Params.QUANTILE_INTERVAL,
      value: 'QUANTILE',
    },
    {
      key: getLanguage(language).Analyst_Params.SQUARE_ROOT_INTERVAL,
      value: 'SQUAREROOT',
    },
    {
      key: getLanguage(language).Analyst_Params.STANDARD_DEVIATION_INTERVAL,
      value: 'STDDEVIATION',
    },
  ]
}

/**
 * 颜色渐变模式
 * @param language
 * @returns {[*,*,*,*,*]}
 */
function getColorGradientType(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.GREEN_ORANGE_PURPLE_GRADIENT,
      value: 'GREENORANGEVIOLET',
    },
    {
      key: getLanguage(language).Analyst_Params.GREEN_ORANGE_RED_GRADIENT,
      value: 'GREENORANGERED',
    },
    {
      key: getLanguage(language).Analyst_Params.RAINBOW_COLOR,
      value: 'RAINBOW',
    },
    {
      key: getLanguage(language).Analyst_Params.SPECTRAL_GRADIENT,
      value: 'SPECTRUM',
    },
    {
      key: getLanguage(language).Analyst_Params.TERRAIN_GRADIENT,
      value: 'TERRAIN',
    },
  ]
}

/**
 * 统计模式
 * @param language
 * @returns {[*,*,*,*,*,*]}
 */
function getStatisticMode(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.MAX,
      value: 'max',
    },
    {
      key: getLanguage(language).Analyst_Params.MIN,
      value: 'min',
    },
    {
      key: getLanguage(language).Analyst_Params.AVERAGE,
      value: 'average',
    },
    {
      key: getLanguage(language).Analyst_Params.SUM,
      value: 'sum',
    },
    {
      key: getLanguage(language).Analyst_Params.VARIANCE,
      value: 'variance',
    },
    {
      key: getLanguage(language).Analyst_Params.STANDARD_DEVIATION,
      value: 'stdDeviation',
    },
  ]
}

function getAggregateType(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.AGGREGATE_WITH_GRID,
      value: 'SUMMARYMESH',
    },
    {
      key: getLanguage(language).Analyst_Params.AGGREGATE_WITH_REGION,
      value: 'SUMMARYREGION',
    },
  ]
}

let weight = []
function setWeight(data) {
  weight = data
}
function getWeight() {
  return weight
}

export default {
  getAnalysisMethod,
  getMeshType,
  getRangeMode,
  getAreaUnit,
  getColorGradientType,
  getStatisticMode,
  getAggregateType,

  setWeight,
  getWeight,
}
