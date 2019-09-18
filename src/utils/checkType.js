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

function getMediaTypeByPath(uri = '') {
  let type = ''
  if (!uri || uri.lastIndexOf('.') < 0) return type
  uri = uri.toLowerCase()
  if (
    uri.endsWith('mp4') ||
    uri.endsWith('mov') ||
    uri.endsWith('avi') ||
    uri.endsWith('wmv')
  ) {
    type = 'video'
  } else if (
    uri.endsWith('jpg') ||
    uri.endsWith('jpeg') ||
    uri.endsWith('png') ||
    uri.endsWith('gif') ||
    uri.endsWith('bmp')
  ) {
    type = 'photo'
  }
  return type
}

export default {
  isVectorDataset,
  getMediaTypeByPath,
}
