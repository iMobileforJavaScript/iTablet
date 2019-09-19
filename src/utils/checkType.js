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
  if (!uri) return type
  uri = uri.toLowerCase()
  if (
    uri.endsWith('mp4') ||
    uri.endsWith('mov') ||
    uri.endsWith('avi') ||
    uri.endsWith('wmv') ||
    uri.indexOf('/video/') > 0
  ) {
    type = 'video'
  } else if (
    uri.endsWith('jpg') ||
    uri.endsWith('jpeg') ||
    uri.endsWith('png') ||
    uri.endsWith('gif') ||
    uri.endsWith('bmp') ||
    uri.indexOf('/images/') > 0
  ) {
    type = 'photo'
  }
  return type
}

export default {
  isVectorDataset,
  getMediaTypeByPath,
}
