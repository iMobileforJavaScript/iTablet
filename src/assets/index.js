import { ThemeType as AppThemeType } from '../constants'
import { DatasetType, ThemeType } from 'imobile_for_reactnative'

function getThemeAssets() {
  let asset = {}
  switch (GLOBAL.ThemeType) {
    case AppThemeType.DARK_THEME:
      asset = require('./darkTheme').default
      break
    case AppThemeType.LIGHT_THEME:
    default:
      asset = require('./lightTheme').default
      break
  }
  return asset
}

function getPublicAssets() {
  return require('./publicTheme').default
}

/** 获取专题类型Icon **/
function getThemeIconByType(type) {
  let icon
  switch (type) {
    case ThemeType.UNIQUE: // 单值专题图
      icon = require('./map/layers_theme_unique_style_black.png')
      break
    case ThemeType.RANGE: // 分段专题图
      icon = require('./map/layers_theme_range_style_black.png')
      break
    case ThemeType.LABEL: // 标签专题图
      icon = require('./map/layers_theme_unify_label_style_black.png')
      break
    case ThemeType.GRAPH: // 统计专题图
      icon = getThemeAssets().themeType.theme_graph_type
      break
    default:
      icon = require('./public/mapLoad.png')
      break
  }
  return icon
}

/** 获取图层类型Icon **/
function getLayerIconByType(type) {
  let icon
  switch (type) {
    case 'layerGroup':
      icon = require('./map/icon-directory.png')
      break
    case DatasetType.POINT: // 点数据集
      icon = require('./map/icon-shallow-dot_black.png')
      break
    case DatasetType.LINE: // 线数据集
      icon = require('./map/icon-shallow-line_black.png')
      break
    case DatasetType.REGION: // 多边形数据集
      icon = require('./map/icon-shallow-polygon_black.png')
      break
    case DatasetType.TEXT: // 文本数据集
      icon = require('./map/icon-shallow-text_black.png')
      break
    case DatasetType.IMAGE: // 影像数据集
      icon = require('./map/icon-shallow-image_black.png')
      break
    case DatasetType.CAD: // 复合数据集
      icon = require('./map/icon-cad_black.png')
      break
    case DatasetType.Network: // 复合数据集
      icon = require('./map/icon-network.png')
      break
    case DatasetType.GRID: // GRID数据集
      icon = require('./map/icon-grid_black.png')
      break
    default:
      icon = require('./public/mapLoad.png')
      break
  }
  return icon
}

export {
  getThemeAssets,
  getPublicAssets,
  getThemeIconByType,
  getLayerIconByType,
}
