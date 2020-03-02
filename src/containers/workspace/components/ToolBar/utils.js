import { getLanguage } from '../../../../language'

/**
 * 判断Toolbar当前操作是否是指滑菜单操作
 * @param selectKey
 * @returns {boolean}
 */
function isTouchProgress(selectKey) {
  if (
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_LINE_WIDTH ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_SIZE ||
    selectKey ===
      getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_TRANSPARENCY ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.CONTRAST ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BRIGHTNESS ||
    selectKey ===
      getLanguage(GLOBAL.language).Map_Main_Menu.NUMBER_OF_SEGMENTS ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_ROTATION ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_FONT_SIZE ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.DOT_VALUE ||
    selectKey ===
      getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_SYMBOL_SIZE ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_WIDTH ||
    selectKey ===
      getLanguage(GLOBAL.language).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_COLUMN ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_HEIGHT ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.LEGEND_WIDTH ||
    selectKey === getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BORDER_WIDTH
  ) {
    return true
  }
  return false
}

export default {
  isTouchProgress,
}
