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

export default {
  isVectorDataset,
}