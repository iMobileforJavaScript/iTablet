import { getLanguage } from '../../../../language'
import { SAnalyst } from 'imobile_for_reactnative'

/**
 * 半变异函数
 * @param language
 * @returns {[*,*]}
 */
function getSearchMethod(language, type) {
  let method = [
    {
      key: getLanguage(language).Analyst_Params.SEARCH_VARIABLE_LENGTH,
      value: SAnalyst.SearchMode.KDTREE_FIXED_COUNT,
    },
    {
      key: getLanguage(language).Analyst_Params.SEARCH_FIXED_LENGTH,
      value: SAnalyst.SearchMode.KDTREE_FIXED_RADIUS,
    },
  ]
  if (type === getLanguage(language).Analyst_Params.ORDINARY_KRIGING) {
    method.push({
      key: getLanguage(language).Analyst_Params.SEARCH_BLOCK,
      value: SAnalyst.SearchMode.QUADTREE,
    })
  }
  return method
}

/**
 * 半变异函数
 * @param language
 * @returns {[*,*]}
 */
function getSemivariogram(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.SPHERICAL,
      value: SAnalyst.VariogramMode.SPHERICAL,
    },
    {
      key: getLanguage(language).Analyst_Params.EXPONENTIAL,
      value: SAnalyst.VariogramMode.EXPONENTIAL,
    },
    {
      key: getLanguage(language).Analyst_Params.GAUSSIAN,
      value: SAnalyst.VariogramMode.GAUSSIAN,
    },
  ]
}

export default {
  getSearchMethod,
  getSemivariogram,
}
