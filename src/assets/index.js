import { ThemeType } from '../constants'

function getThemeAssets() {
  let asset = {}
  switch (GLOBAL.ThemeType) {
    case ThemeType.DARK_THEME:
      asset = require('./darkTheme').default
      break
    case ThemeType.LIGHT_THEME:
    default:
      asset = require('./lightTheme').default
      break
  }
  return asset
}

function getPublicAssets() {
  return require('./publicTheme').default
}

export { getThemeAssets, getPublicAssets }
