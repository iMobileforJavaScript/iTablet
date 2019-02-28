import { SMap } from 'imobile_for_reactnative'

async function getLayerAttribute(attributes, path, page, size) {
  let data = await SMap.getLayerAttribute(path, page, size)
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
}
