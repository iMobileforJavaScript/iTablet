import { FixColorMode } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'

/**
 * 获取智能配图mode
 * @param arr ep: ['线', '亮度']
 * @returns {*}
 */
function getMatchPictureMode(arr) {
  let mode
  switch (arr[arr.length - 1]) {
    case getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BRIGHTNESS:
      if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.FILL) {
        mode = FixColorMode.FCM_FB
      } else if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.BORDER) {
        mode = FixColorMode.FCM_BB
      } else if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.LINE) {
        mode = FixColorMode.FCM_LB
      } else if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.MARK) {
        mode = FixColorMode.FCM_TB
      }
      break
    case getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_CONTRAST:
      if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.FILL) {
        mode = FixColorMode.FCM_FH
      } else if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.BORDER) {
        mode = FixColorMode.FCM_BH
      } else if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.LINE) {
        mode = FixColorMode.FCM_LH
      } else if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.MARK) {
        mode = FixColorMode.FCM_TH
      }
      break
    case getLanguage(GLOBAL.language).Map_Main_Menu.SATURATION:
      if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.FILL) {
        mode = FixColorMode.FCM_FS
      } else if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.BORDER) {
        mode = FixColorMode.FCM_BS
      } else if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.LINE) {
        mode = FixColorMode.FCM_LS
      } else if (arr[0] === getLanguage(GLOBAL.language).Map_Main_Menu.MARK) {
        mode = FixColorMode.FCM_TS
      }
      break
  }
  return mode
}

/**
 * 获取智能配图对应属性的tip
 * @param arr ep: ['线', '亮度']
 * @param value
 * @returns {string}
 */
function getMatchPictureTip(arr, value) {
  let tips = ''
  if (
    arr[arr.length - 1] ===
    getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST
  ) {
    tips =
      getLanguage(global.language).Map_Main_Menu.STYLE_CONTRAST +
      '     ' +
      parseInt(value) +
      '%'
  } else if (
    arr[arr.length - 1] ===
    getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS
  ) {
    tips =
      getLanguage(global.language).Map_Main_Menu.STYLE_BRIGHTNESS +
      '     ' +
      parseInt(value) +
      '%'
  } else if (
    arr[arr.length - 1] ===
    getLanguage(global.language).Map_Main_Menu.SATURATION
  ) {
    tips =
      getLanguage(global.language).Map_Main_Menu.SATURATION +
      '     ' +
      parseInt(value) +
      '%'
  }
  return tips
}

export default {
  getMatchPictureMode,
  getMatchPictureTip,
}
