import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'

/**
 * 叠加跳转回调
 * @param title
 * @param cb
 */
function overlayCallback(title, cb) {
  NavigationService.navigate('OverlayAnalystView', {
    title: title,
    cb: cb,
  })
}

/**
 * 叠加分析方式列表
 * @param language
 * @returns {[*,*,*,*,*,*,*]}
 */
function getOverlayAnalystData(language) {
  let data = [
    {
      key: getLanguage(language).Analyst_Methods.CLIP,
      title: getLanguage(language).Analyst_Methods.CLIP,
      action: (cb = () => {}) =>
        overlayCallback(getLanguage(language).Analyst_Methods.CLIP, cb),
      image: getThemeAssets().analyst.analysis_overlay_clip,
    },
    {
      key: getLanguage(language).Analyst_Methods.UNION,
      title: getLanguage(language).Analyst_Methods.UNION,
      action: (cb = () => {}) =>
        overlayCallback(getLanguage(language).Analyst_Methods.UNION, cb),
      image: getThemeAssets().analyst.analysis_overlay_union,
    },
    {
      key: getLanguage(language).Analyst_Methods.ERASE,
      title: getLanguage(language).Analyst_Methods.ERASE,
      action: (cb = () => {}) =>
        overlayCallback(getLanguage(language).Analyst_Methods.ERASE, cb),
      image: getThemeAssets().analyst.analysis_overlay_erase,
    },
    {
      key: getLanguage(language).Analyst_Methods.INTERSECT,
      title: getLanguage(language).Analyst_Methods.INTERSECT,
      action: (cb = () => {}) =>
        overlayCallback(getLanguage(language).Analyst_Methods.INTERSECT, cb),
      image: getThemeAssets().analyst.analysis_overlay_intersect,
    },
    {
      key: getLanguage(language).Analyst_Methods.IDENTITY,
      title: getLanguage(language).Analyst_Methods.IDENTITY,
      action: (cb = () => {}) =>
        overlayCallback(getLanguage(language).Analyst_Methods.IDENTITY, cb),
      image: getThemeAssets().analyst.analysis_overlay_identity,
    },
    {
      key: getLanguage(language).Analyst_Methods.XOR,
      title: getLanguage(language).Analyst_Methods.XOR,
      action: (cb = () => {}) =>
        overlayCallback(getLanguage(language).Analyst_Methods.XOR, cb),
      image: getThemeAssets().analyst.analysis_overlay_xor,
    },
    {
      key: getLanguage(language).Analyst_Methods.UPDATE,
      title: getLanguage(language).Analyst_Methods.UPDATE,
      action: (cb = () => {}) =>
        overlayCallback(getLanguage(language).Analyst_Methods.UPDATE, cb),
      image: getThemeAssets().analyst.analysis_overlay_update,
    },
  ]
  return data
}

/**
 * 在线分析列表回调
 * @param title
 * @param cb
 */
function onlineCallback(title, cb) {
  NavigationService.navigate('OnlineAnalystView', {
    title: title,
    cb: cb,
  })
}

/**
 * 在线分析方式列表
 * @param language
 * @returns {[*,*]}
 */
function getOnlineAnalystData(language) {
  let data = [
    {
      key: getLanguage(language).Analyst_Methods.DENSITY,
      title: getLanguage(language).Analyst_Methods.DENSITY,
      action: (cb = () => {}) =>
        onlineCallback(getLanguage(language).Analyst_Methods.DENSITY, cb),
      image: getThemeAssets().analyst.analysis_overlay_clip,
    },
    {
      key: getLanguage(language).Analyst_Methods.AGGREGATE_POINTS_ANALYSIS,
      title: getLanguage(language).Analyst_Methods.AGGREGATE_POINTS_ANALYSIS,
      action: (cb = () => {}) =>
        onlineCallback(
          getLanguage(language).Analyst_Methods.AGGREGATE_POINTS_ANALYSIS,
          cb,
        ),
      image: getThemeAssets().analyst.analysis_overlay_union,
    },
  ]
  return data
}

export default {
  getOverlayAnalystData,
  getOnlineAnalystData,
}
