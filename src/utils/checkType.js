import { DatasetType } from 'imobile_for_reactnative'

const vectorType = [
  DatasetType.CAD,
  DatasetType.TEXT,
  DatasetType.LINE,
  DatasetType.REGION,
  DatasetType.POINT,
  DatasetType.TABULAR,
]

function isVectorDataset(type) {
  for (let i = 0; i < vectorType.length; i++) {
    if (type === vectorType[i]) return true
  }
  return false
}

function getMediaTypeByPath(uri) {
  let type = ''
  if (!uri || uri.lastIndexOf('.') < 0) return type
  let extension = uri.substr(uri.lastIndexOf('.') + 1)
  if (
    extension === 'mp4' ||
    extension === 'mov' ||
    extension === 'avi' ||
    extension === 'wmv'
  ) {
    type = 'video'
  } else if (
    extension === 'jpg' ||
    extension === 'jpeg' ||
    extension === 'png' ||
    extension === 'gif' ||
    extension === 'bmp'
  ) {
    type = 'photo'
  }
  return type
}

export default {
  isVectorDataset,
  getMediaTypeByPath,
}
