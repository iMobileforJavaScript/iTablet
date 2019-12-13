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
      icon = getThemeAssets().themeType.theme_create_unique_style
      break
    case ThemeType.RANGE: // 分段专题图
      icon = getThemeAssets().themeType.theme_create_range_style
      break
    case ThemeType.LABEL: // 标签专题图
      icon = getThemeAssets().themeType.theme_create_unify_label
      break
    case ThemeType.LABELUNIQUE:
      icon = getThemeAssets().themeType.theme_create_unique_label
      break
    case ThemeType.LABELRANGE:
      icon = getThemeAssets().themeType.theme_create_range_label
      break
    case ThemeType.GRAPH: // 统计专题图
      icon = getThemeAssets().themeType.theme_graphmap
      break
    case ThemeType.DOTDENSITY: // 点密度专题图
      icon = getThemeAssets().themeType.theme_dot_density
      break
    case ThemeType.GRADUATEDSYMBOL: // 等级符号专题图
      icon = getThemeAssets().themeType.theme_graduated_symbol
      break
    case ThemeType.GRIDUNIQUE: // 栅格单值专题图
      icon = getThemeAssets().themeType.theme_grid_unique
      break
    case ThemeType.GRIDRANGE: // 栅格分段专题图
      icon = getThemeAssets().themeType.theme_grid_range
      break
    default:
      icon = getThemeAssets().layerType.icon_unknown
      break
  }
  return icon
}

function getThemeWhiteIconByType(type) {
  let icon
  switch (type) {
    case ThemeType.UNIQUE: // 单值专题图
      icon = getThemeAssets().themeType.theme_create_unique_style_selected
      break
    case ThemeType.RANGE: // 分段专题图
      icon = getThemeAssets().themeType.theme_create_range_style_selected
      break
    case ThemeType.LABEL: // 标签专题图
      icon = getThemeAssets().themeType.theme_create_unify_label_selected
      break
    case ThemeType.LABELUNIQUE:
      icon = getThemeAssets().themeType.theme_create_unique_label_selected
      break
    case ThemeType.LABELRANGE:
      icon = getThemeAssets().themeType.theme_create_range_label_selected
      break
    case ThemeType.GRAPH: // 统计专题图
      icon = getThemeAssets().themeType.theme_graphmap_selected
      break
    case ThemeType.DOTDENSITY: // 点密度专题图
      icon = getThemeAssets().themeType.theme_dot_density_selected
      break
    case ThemeType.GRADUATEDSYMBOL: // 等级符号专题图
      icon = getThemeAssets().themeType.theme_graduated_symbol_selected
      break
    case ThemeType.GRIDUNIQUE: // 栅格单值专题图
      icon = getThemeAssets().themeType.theme_grid_unique_selected
      break
    case ThemeType.GRIDRANGE: // 栅格分段专题图
      icon = getThemeAssets().themeType.theme_grid_range_selected
      break
    default:
      icon = getThemeAssets().layerType.icon_unknown
      break
  }
  return icon
}

const LAYER_GROUP = 'layerGroup'
/** 获取图层类型Icon **/
function getLayerIconByType(type) {
  let icon
  switch (type) {
    case LAYER_GROUP:
      icon = getThemeAssets().layerType.layer_group
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
    case DatasetType.MBImage: // 多波段影像
    case DatasetType.IMAGE: // 影像数据集
      // icon = require('./map/icon-shallow-image_black.png')
      icon = getThemeAssets().layerType.layer_type_image
      break
    case DatasetType.CAD: // 复合数据集
      // icon = require('./map/icon-cad_black.png')
      icon = getThemeAssets().layerType.layer_type_CAD
      break
    case DatasetType.Network: // 复合数据集
      icon = getThemeAssets().layerType.layer_type_network
      break
    case DatasetType.GRID: // GRID数据集
      icon = require('./map/icon-grid_black.png')
      break
    default:
      icon = getThemeAssets().layerType.icon_unknown
      break
  }
  return icon
}

function getLayerWhiteIconByType(type) {
  let icon
  switch (type) {
    case LAYER_GROUP:
      icon = getThemeAssets().layerType.layer_group_selected
      break
    case DatasetType.POINT: // 点数据集
      icon = require('./map/icon-shallow-dot.png')
      break
    case DatasetType.LINE: // 线数据集
      icon = require('./map/icon-shallow-line.png')
      break
    case DatasetType.REGION: // 多边形数据集
      icon = require('./map/icon-shallow-polygon.png')
      break
    case DatasetType.TEXT: // 文本数据集
      icon = require('./map/icon-shallow-text.png')
      break
    case DatasetType.MBImage: // 多波段影像
    case DatasetType.IMAGE: // 影像数据集
      // icon = require('./map/icon-shallow-image.png')
      icon = getThemeAssets().layerType.layer_type_image_selected
      break
    case DatasetType.CAD: // CAD数据集
      // icon = require('./map/icon-cad.png')
      icon = getThemeAssets().layerType.layer_type_CAD_selected
      break
    case DatasetType.Network: // 网络数据集
      icon = getThemeAssets().layerType.layer_type_network_selected
      break
    case DatasetType.GRID: // GRID数据集
      icon = require('./map/icon-grid.png')
      break
    default:
      icon = getThemeAssets().layerType.icon_unknown_selected
      break
  }
  return icon
}

export {
  getThemeAssets,
  getPublicAssets,
  getThemeIconByType,
  getThemeWhiteIconByType,
  getLayerIconByType,
  getLayerWhiteIconByType,
}
