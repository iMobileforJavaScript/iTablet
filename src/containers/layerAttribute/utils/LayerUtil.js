import { SMap } from 'imobile_for_reactnative'

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
  if (result.data && result.data.length > 0) {
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
  }
}

export default {
  getLayerAttribute,
  searchLayerAttribute,
  searchSelectionAttribute,
  getSelectionAttributeByLayer,
}
