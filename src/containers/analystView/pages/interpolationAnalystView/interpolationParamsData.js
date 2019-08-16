import { getLanguage } from '../../../../language'
import { SAnalyst } from 'imobile_for_reactnative'

/**
 * 插值方法
 * @param language
 * @returns {[*,*]}
 */
function getInterpolationMethod(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.IDW,
      value: SAnalyst.InterpolationAlgorithmType.IDW,
    },
    {
      key: getLanguage(language).Analyst_Params.SPLINE,
      value: SAnalyst.InterpolationAlgorithmType.RBF,
    },
    {
      key: getLanguage(language).Analyst_Params.ORDINARY_KRIGING,
      value: SAnalyst.InterpolationAlgorithmType.KRIGING,
    },
    {
      key: getLanguage(language).Analyst_Params.SIMPLE_KRIGING,
      value: SAnalyst.InterpolationAlgorithmType.SimpleKRIGING,
    },
    {
      key: getLanguage(language).Analyst_Params.UNIVERSAL_KRIGING,
      value: SAnalyst.InterpolationAlgorithmType.UniversalKRIGING,
    },
  ]
}

function getPixelFormat(language) {
  return [
    {
      key: getLanguage(language).Analyst_Params.UBIT1,
      value: SAnalyst.PixelFormat.UBIT1,
    },
    {
      key: getLanguage(language).Analyst_Params.UBIT16,
      value: SAnalyst.PixelFormat.UBIT16,
    },
    {
      key: getLanguage(language).Analyst_Params.UBIT32,
      value: SAnalyst.PixelFormat.BIT32,
    },
    {
      key: getLanguage(language).Analyst_Params.SINGLE,
      value: SAnalyst.PixelFormat.SINGLE,
    },
    {
      key: getLanguage(language).Analyst_Params.DOUBLE,
      value: SAnalyst.PixelFormat.DOUBLE,
    },
  ]
}

export default {
  getInterpolationMethod,
  getPixelFormat,
}
