import {
  OverlayAnalystParameter,
  DatasetVectorInfo,
  OverlayAnalyst,
} from 'imobile_for_reactnative'
import { Toast } from '../../../utils'
const METHOD_CLIP = 'clip'
const METHOD_ERASE = 'erase'
const METHOD_UNION = 'union'
const METHOD_IDENTITY = 'identity'
const METHOD_XOR = 'xOR'
const METHOD_UPDATE = 'update'
const METHOD_INTERSECT = 'intersect'

/**
 * 裁剪（clip）     点线面
 * 擦除（erase）    点线面
 * 同一（identity） 点线面
 * 求交（intersect）点线面
 * 合并（union）    面
 * 对称差（xOR）    面
 * 更新（update）   面
 */

/**
 * 叠加分析操作
 * @param workspace
 * @param method
 * @param dataset
 * @param targetDataset
 * @param parameter
 * @returns {Promise.<{result: boolean, resultDatasetName: string, resultLayerName: string}>}
 */
async function analyst({
  workspace,
  method,
  dataset,
  targetDataset,
  parameter,
}) {
  try {
    let overlayParameter = parameter
    if (!overlayParameter) {
      overlayParameter = await new OverlayAnalystParameter().createObj()
    }
    await overlayParameter.setTolerance(0.0000011074)
    await overlayParameter.setOperationRetainedFields(['ClassID'])
    await overlayParameter.setSourceRetainedFields(['Name'])

    let datasource = await workspace.getDatasource(0)
    let datasourceName = await datasource.getAlias()

    let dtname = await datasource.getAvailableDatasetName(method)
    let datasetVectorInfo = await new DatasetVectorInfo().createObjByNameType(
      dtname,
      dataset.type,
    )
    let resultDataset = await datasource.createDatasetVector(datasetVectorInfo)

    let overlay = new OverlayAnalyst()

    let result = false
    switch (method) {
      case METHOD_CLIP:
        result = await overlay.clip(
          dataset,
          targetDataset,
          resultDataset,
          overlayParameter,
        )
        break
      case METHOD_ERASE:
        result = await overlay.erase(
          dataset,
          targetDataset,
          resultDataset,
          overlayParameter,
        )
        break
      case METHOD_INTERSECT:
        result = await overlay.intersect(
          dataset,
          targetDataset,
          resultDataset,
          overlayParameter,
        )
        break
      case METHOD_IDENTITY:
        result = await overlay.identity(
          dataset,
          targetDataset,
          resultDataset,
          overlayParameter,
        )
        break
      case METHOD_UNION:
        result = await overlay.union(
          dataset,
          targetDataset,
          resultDataset,
          overlayParameter,
        )
        break
      case METHOD_UPDATE:
        result = await overlay.update(
          dataset,
          targetDataset,
          resultDataset,
          overlayParameter,
        )
        break
      case METHOD_XOR:
        result = await overlay.xOR(
          dataset,
          targetDataset,
          resultDataset,
          overlayParameter,
        )
        break
    }
    return {
      result,
      resultDatasetName: dtname,
      resultLayerName: dtname + '@' + datasourceName,
    }
  } catch (e) {
    Toast.show('分析失败')
  }
}

export default {
  analyst,
}
