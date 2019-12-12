import { SMap, DatasetType, FieldType } from 'imobile_for_reactnative'
import { ConstOnline } from '../constants'
import { getLanguage } from '../language'

/**
 * 获取图层属性
 * @param attributes
 * @param path
 * @param page
 * @param size
 * @param params 过滤条件 {filter: string  |  groupBy: string}
 * @param type
 * @returns {Promise.<{attributes, total, currentPage, startIndex, resLength}|*>}
 */
async function getLayerAttribute(
  attributes,
  path,
  page,
  size,
  params,
  type = 'loadMore',
) {
  let data = await SMap.getLayerAttribute(path, page, size, params)

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
        tableHead.unshift({
          value: item.fieldInfo.caption,
          isSystemField: item.fieldInfo.isSystemField,
          fieldInfo: item.fieldInfo,
        })
      } else {
        tableHead.push({
          value: item.fieldInfo.caption,
          isSystemField: item.fieldInfo.isSystemField,
          fieldInfo: item.fieldInfo,
        })
      }
    })
  } else if (result.head && result.head.length > 0) {
    result.head.forEach(item => {
      if (item.caption.toString().toLowerCase() === 'smid') {
        tableHead.unshift({
          value: item.caption,
          isSystemField: item.isSystemField,
          fieldInfo: item,
        })
      } else {
        tableHead.push({
          value: item.caption,
          isSystemField: item.isSystemField,
          fieldInfo: item,
        })
      }
    })
  }
  // else if (result.head && result.head.length > 0) {
  //   result.head.forEach(item => {
  //     if (item.caption.toString().toLowerCase() === 'smid') {
  //       tableHead.unshift({
  //         value: item.caption,
  //         isSystemField: item.isSystemField,
  //       })
  //     } else {
  //       tableHead.push({
  //         value: item.caption,
  //         isSystemField: item.isSystemField,
  //         fieldInfo: item.fieldInfo,
  //       })
  //     }
  //   })
  // }
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

const baseMapsOrigin = [
  'roadmap@GoogleMaps',
  'satellite@GoogleMaps',
  'terrain@GoogleMaps',
  'hybrid@GoogleMaps',
  // 'vec@TD',
  // 'cva@TDWZ',
  // 'img@TDYXM',
  'TrafficMap@BaiduMap',
  'Standard@OpenStreetMaps',
  'CycleMap@OpenStreetMaps',
  'TransportMap@OpenStreetMaps',
  'quanguo@SuperMapCloud',
  'roadmap_cn@bingMap',
  'baseMap',
]
let baseMaps = [...baseMapsOrigin]
function isBaseLayer(name) {
  for (let i = 0, n = baseMaps.length; i < n; i++) {
    if (name.toUpperCase().indexOf(baseMaps[i].toUpperCase()) >= 0) {
      return true
    }
  }
  return false
  // if (
  //   name.indexOf('roadmap@GoogleMaps') >= 0 ||
  //   name.indexOf('satellite@GoogleMaps') >= 0 ||
  //   name.indexOf('terrain@GoogleMaps') >= 0 ||
  //   name.indexOf('hybrid@GoogleMaps') >= 0 ||
  //   name.indexOf('vec@TD') >= 0 ||
  //   name.indexOf('cva@TDWZ') >= 0 ||
  //   name.indexOf('img@TDYXM') >= 0 ||
  //   name.indexOf('TrafficMap@BaiduMap') >= 0 ||
  //   name.indexOf('Standard@OpenStreetMaps') >= 0 ||
  //   name.indexOf('CycleMap@OpenStreetMaps') >= 0 ||
  //   name.indexOf('TransportMap@OpenStreetMaps') >= 0 ||
  //   name.indexOf('quanguo@SuperMapCloud') >= 0
  // ) {
  //   return true
  // }
  // return false
}

function getBaseLayers(layers = []) {
  let arr = []
  for (let i = 0; i < layers.length; i++) {
    let name = layers[i].name
    for (let i = 0, n = baseMaps.length; i < n; i++) {
      if (name.toUpperCase().indexOf(baseMaps[i].toUpperCase()) >= 0) {
        arr.push(layers[i])
      }
    }
    // if (
    //   name.indexOf('roadmap@GoogleMaps') >= 0 ||
    //   name.indexOf('satellite@GoogleMaps') >= 0 ||
    //   name.indexOf('terrain@GoogleMaps') >= 0 ||
    //   name.indexOf('hybrid@GoogleMaps') >= 0 ||
    //   name.indexOf('vec@TD') >= 0 ||
    //   name.indexOf('cva@TDWZ') >= 0 ||
    //   name.indexOf('img@TDYXM') >= 0 ||
    //   name.indexOf('TrafficMap@BaiduMap') >= 0 ||
    //   name.indexOf('Standard@OpenStreetMaps') >= 0 ||
    //   name.indexOf('CycleMap@OpenStreetMaps') >= 0 ||
    //   name.indexOf('TransportMap@OpenStreetMaps') >= 0 ||
    //   name.indexOf('quanguo@SuperMapCloud') >= 0
    // ) {
    //   arr.push(layers[i])
    // }
  }
  GLOBAL.BaseMapSize = arr.length
  return arr
}

function setBaseMap(baseMap) {
  baseMaps = [...baseMapsOrigin]
  baseMaps = baseMaps.concat(baseMap)
}
async function addBaseMap(
  layers = [],
  data = ConstOnline['Google'],
  index,
  visible = true,
) {
  if (getBaseLayers(layers).length === 0) {
    if (data instanceof Array) {
      for (let i = data.length - 1; i >= 0; i--) {
        await SMap.openDatasource(
          data[i].DSParams,
          index !== undefined ? index : data[i].layerIndex,
          false,
          visible,
        )
      }
      GLOBAL.BaseMapSize = data.length
    } else {
      await SMap.openDatasource(
        data.DSParams,
        index !== undefined ? index : data.layerIndex,
        false,
        visible,
      )
      GLOBAL.BaseMapSize = 1
    }
  }
}

/**
 * 判断当前图层类型 控制标注相关功能是否可用
 * @returns {string}
 */
function getLayerType(currentLayer) {
  // let currentLayer = GLOBAL.currentLayer
  let layerType = ''
  if (currentLayer && !currentLayer.themeType) {
    switch (currentLayer.type) {
      case DatasetType.CAD: {
        if (currentLayer.name.indexOf('@Label_') !== -1) {
          layerType = 'TAGGINGLAYER'
        } else {
          layerType = 'CADLAYER'
        }
        break
      }
      case DatasetType.POINT:
        layerType = 'POINTLAYER'
        break
      case DatasetType.LINE:
        layerType = 'LINELAYER'
        break
      case DatasetType.REGION:
        layerType = 'REGIONLAYER'
        break
      case DatasetType.TEXT:
        layerType = 'TEXTLAYER'
        break
    }
  }
  return layerType
}

function getFieldTypeText(intType, language = 'CN') {
  let text = ''
  switch (intType) {
    case FieldType.BOOLEAN:
      text = getLanguage(language).FieldType.BOOLEAN
      break
    case FieldType.BYTE:
      text = getLanguage(language).FieldType.BYTE
      break
    case FieldType.INT16:
      text = getLanguage(language).FieldType.INT16
      break
    case FieldType.INT32:
      text = getLanguage(language).FieldType.INT32
      break
    case FieldType.INT64:
      text = getLanguage(language).FieldType.INT64
      break
    case FieldType.SINGLE:
      text = getLanguage(language).FieldType.SINGLE
      break
    case FieldType.DOUBLE:
      text = getLanguage(language).FieldType.DOUBLE
      break
    case FieldType.LONGBINARY:
      text = getLanguage(language).FieldType.LONGBINARY
      break
    case FieldType.TEXT:
      text = getLanguage(language).FieldType.TEXT
      break
    case FieldType.CHAR:
      text = getLanguage(language).FieldType.CHAR
      break
    case FieldType.WTEXT:
      text = getLanguage(language).FieldType.WTEXT
      break
  }
  return text
}

export default {
  getLayerAttribute,
  searchLayerAttribute,
  searchSelectionAttribute,
  getSelectionAttributeByLayer,
  canBeUndo,
  canBeRedo,
  canBeRevert,

  isBaseLayer,
  addBaseMap,
  setBaseMap,
  getLayerType,
  getFieldTypeText,
}
