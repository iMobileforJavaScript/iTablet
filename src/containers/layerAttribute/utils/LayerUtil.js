import { SMap } from 'imobile_for_reactnative'

/**
 * 获取图层属性
 * @param attributes
 * @param path
 * @param page
 * @param size
 * @returns {Promise.<*>}
 */
async function getLayerAttribute(attributes, path, page, size) {
  let data = await SMap.getLayerAttribute(path, page, size)

  return dealData(attributes, data, page)
}

/**
 * 搜索指定图层匹配对象的属性
 * @param attributes
 * @param path
 * @param params
 * @param page
 * @param size
 * @returns {Promise.<*>}
 */
async function searchLayerAttribute(attributes, path, params = {}, page, size) {
  // let data = await SMap.getLayerAttribute(path, page, size)
  let data = await SMap.searchLayerAttribute(path, params, page, size)

  return dealData(attributes, data, page)
}

/**
 * 搜索指定图层中Selection匹配对象的属性
 * @param attributes
 * @param path
 * @param searchKey
 * @param page
 * @param size
 * @returns {Promise.<*>}
 */
async function searchSelectionAttribute(
  attributes,
  path,
  searchKey = '',
  page,
  size,
) {
  let data = await SMap.searchSelectionAttribute(path, searchKey, page, size)

  return dealData(attributes, data, page)
}

function dealData(attributes, data = [], page) {
  let tableHead = []
  if (data && data.length > 0) {
    data[0].forEach(item => {
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
  attributes.data = page === 0 ? data : (attributes.data || []).concat(data)

  return attributes
}

export default {
  getLayerAttribute,
  searchLayerAttribute,
  searchSelectionAttribute,
}
