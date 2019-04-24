import { SMap, DatasetType, ThemeType } from 'imobile_for_reactnative'
import { getThemeAssets } from '../assets'

/**
 * 获取图层属性
 * @param attributes
 * @param path
 * @param page
 * @param size
 * @param type
 * @returns {Promise.<*>}
 */
async function getLayerAttribute(
  attributes,
  path,
  page,
  size,
  type = 'loadMore',
) {
  let data = await SMap.getLayerAttribute(path, page, size)

  return dealData(attributes, data, page, type)
}

/**
 * 搜索指定图层匹配对象的属性
 * @param attributes
 * @param path
 * @param params
 * @param page
 * @param size
 * @param type
 * @returns {Promise.<*>}
 */
async function searchLayerAttribute(
  attributes,
  path,
  params = {},
  page,
  size,
  type = 'loadMore',
) {
  // let data = await SMap.getLayerAttribute(path, page, size)
  let data = await SMap.searchLayerAttribute(path, params, page, size)

  return dealData(attributes, data, page, type)
}

/**
 * 搜索指定图层中Selection匹配对象的属性
 * @param attributes
 * @param path
 * @param searchKey
 * @param page
 * @param size
 * @param type
 * @returns {Promise.<*>}
 */
async function searchSelectionAttribute(
  attributes,
  path,
  searchKey = '',
  page,
  size,
  type = 'loadMore',
) {
  let data = await SMap.searchSelectionAttribute(path, searchKey, page, size)

  return dealData(attributes, data, page, type)
}

async function getSelectionAttributeByLayer(
  attributes,
  path,
  page,
  size,
  type = 'loadMore',
) {
  let data = await SMap.getSelectionAttributeByLayer(path, page, size)

  return dealData(attributes, data, page, type)
}

function dealData(attributes, result = {}, page, type) {
  let tableHead = []
  let resLength = (result.data && result.data.length) || 0
  if (resLength > 0) {
    result.data[0].forEach(item => {
      item.selected = false
      if (item.fieldInfo.caption.toString().toLowerCase() === 'smid') {
        tableHead.unshift(item.fieldInfo.caption)
      } else {
        tableHead.push(item.fieldInfo.caption)
      }
    })
  }
  attributes.head =
    tableHead.length === 0 && page > 0 ? attributes.head : tableHead
  if (type === 'refresh') {
    attributes.data = result.data.concat(attributes.data || [])
  } else if (type === 'reset') {
    attributes.data = result.data
  } else if (type === 'loadMore') {
    attributes.data = (attributes.data || []).concat(result.data)
  }

  return {
    attributes,
    total: result.total,
    currentPage: result.currentPage,
    startIndex: result.startIndex,
    resLength,
  }
}

function canBeUndo(layerHistory) {
  return (
    (layerHistory &&
      layerHistory.history &&
      layerHistory.history.length > 0 &&
      layerHistory.currentIndex < layerHistory.history.length - 1) ||
    false
  )
}

function canBeRedo(layerHistory) {
  return (
    (layerHistory &&
      layerHistory.history &&
      layerHistory.history.length > 0 &&
      layerHistory.currentIndex > 0) ||
    false
  )
}

function canBeRevert(layerHistory) {
  return (
    (layerHistory &&
      layerHistory.history &&
      layerHistory.history.length > 0 &&
      layerHistory.currentIndex < layerHistory.history.length - 1 &&
      ((!(layerHistory.history[layerHistory.currentIndex] instanceof Array) &&
        !(
          layerHistory.history[layerHistory.currentIndex + 1] instanceof Array
        )) ||
        (!(layerHistory.history[layerHistory.currentIndex] instanceof Array) &&
          layerHistory.history[layerHistory.currentIndex + 1] instanceof
            Array) ||
        (layerHistory.history[layerHistory.currentIndex] instanceof Array &&
          layerHistory.history[layerHistory.currentIndex + 1] instanceof
            Array))) ||
    false
  )
}

const LAYER_GROUP = 'layerGroup'
function getLayerWhiteIconByType(type) {
  let icon
  switch (type) {
    case 'layerGroup':
      icon = require('../assets/map/icon-layer-group.png')
      break
    case DatasetType.POINT: // 点数据集
      icon = require('../assets/map/icon-shallow-dot.png')
      break
    case DatasetType.LINE: // 线数据集
      icon = require('../assets/map/icon-shallow-line.png')
      break
    case DatasetType.REGION: // 多边形数据集
      icon = require('../assets/map/icon-shallow-polygon.png')
      break
    case DatasetType.TEXT: // 文本数据集
      icon = require('../assets/map/icon-shallow-text.png')
      break
    case DatasetType.IMAGE: // 影像数据集
      icon = require('../assets/map/icon-shallow-image.png')
      break
    case DatasetType.CAD: // 复合数据集
      // icon = require('../assets/map/icon-cad.png')
      icon = require('../assets/Mine/mine_my_plot_white.png')
      break
    case DatasetType.Network: // 复合数据集
      icon = require('../assets/map/icon-network.png')
      break
    case DatasetType.GRID: // GRID数据集
      icon = require('../assets/map/icon-grid.png')
      break
    default:
      icon = require('../assets/public/mapLoad.png')
      break
  }
  return icon
}

function getLayerIconByType(type) {
  let icon
  switch (type) {
    case LAYER_GROUP:
      icon = require('../assets/map/icon-layer-group.png')
      break
    case DatasetType.POINT: // 点数据集
      icon = require('../assets/map/icon-shallow-dot_black.png')
      break
    case DatasetType.LINE: // 线数据集
      icon = require('../assets/map/icon-shallow-line_black.png')
      break
    case DatasetType.REGION: // 多边形数据集
      icon = require('../assets/map/icon-shallow-polygon_black.png')
      break
    case DatasetType.TEXT: // 文本数据集
      icon = require('../assets/map/icon-shallow-text_black.png')
      break
    case DatasetType.IMAGE: // 影像数据集
      icon = require('../assets/map/icon-shallow-image_black.png')
      break
    case DatasetType.CAD: // 复合数据集
      // icon = require('../assets/map/icon-cad_black.png')
      icon = require('../assets/Mine/mine_my_plot.png')
      break
    case DatasetType.Network: // 复合数据集
      icon = require('../assets/map/icon-network.png')
      break
    case DatasetType.GRID: // GRID数据集
      icon = require('../assets/map/icon-grid_black.png')
      break
    default:
      icon = require('../assets/public/mapLoad.png')
      break
  }
  return icon
}

function getThemeIconByType(type) {
  let icon
  switch (type) {
    case ThemeType.UNIQUE: // 单值专题图
      icon = require('../assets/map/layers_theme_unique_style_black.png')
      break
    case ThemeType.RANGE: // 分段专题图
      icon = require('../assets/map/layers_theme_range_style_black.png')
      break
    case ThemeType.LABEL: // 标签专题图
      icon = require('../assets/map/layers_theme_unify_label_style_black.png')
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
      icon = require('../assets/public/mapLoad.png')
      break
  }
  return icon
}

export default {
  getLayerAttribute,
  searchLayerAttribute,
  searchSelectionAttribute,
  getSelectionAttributeByLayer,
  canBeUndo,
  canBeRedo,
  canBeRevert,

  getLayerWhiteIconByType,
  getLayerIconByType,
  getThemeIconByType,
}
