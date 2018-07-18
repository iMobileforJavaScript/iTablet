import { Toast } from '../../../utils'
import {
  DatasetType,
  GeoRegion,
  GeoStyle,
  Size2D,
  BufferAnalystGeometry,
  BufferAnalystParameter,
  DatasetVectorInfo,
  CursorType,
} from 'imobile_for_javascript'

async function analyst(data) {
  let { layer, bufferSetting, workspace, map } = data
  if (!layer) {
    Toast.show('请选择分析对象')
    return
  }

  if (!bufferSetting || !bufferSetting.endType) {
    Toast.show('请设置分析')
    return
  }

  let selection = await layer.getSelection()
  let queryRecordset = await selection.toRecordset()

  let trackLayer = await map.getTrackingLayer()
  await trackLayer.clear()
  let geoRegion
  let count = await queryRecordset.getRecordCount()
  if (count > 0) {
    let datasource = await workspace.getDatasource(0)
    let dtname = await datasource.getAvailableDatasetName('da')
    let datasetVectorInfo = await new DatasetVectorInfo().createObjByNameType(dtname, DatasetType.REGION)
    let datasetVector = await datasource.createDatasetVector(datasetVectorInfo)
    let recordset = await datasetVector.getRecordset(false, CursorType.DYNAMIC)
    let isEOF = await queryRecordset.isEOF()
    while (!isEOF) {
      let bufferAnalystParameter = await new BufferAnalystParameter().createObj()
      await bufferAnalystParameter.setEndType(bufferSetting.endType)
      await bufferAnalystParameter.setLeftDistance(bufferSetting.distance)
      await bufferAnalystParameter.setRightDistance(bufferSetting.distance)

      let geoForBuffer = await queryRecordset.getGeometry()
      let queryDataset = await queryRecordset.getDataset()
      let prj = await queryDataset.getPrjCoordSys()

      geoRegion = await BufferAnalystGeometry.createBuffer(geoForBuffer, bufferAnalystParameter, prj)
      let geoStyle = await new GeoStyle().createObj()
      await geoStyle.setLineColor(50, 244, 50)
      await geoStyle.setLineWidth(0.5)
      await geoStyle.setLineSymbolID(0)
      await geoStyle.setMarkerSymbolID(351)
      let size2D = await new Size2D().createObj(10, 10)
      await geoStyle.setMarkerSize(size2D)
      await geoStyle.setFillForeColor(244, 50, 50)
      await geoStyle.setFillOpaqueRate(70)

      await geoRegion.setStyle(geoStyle)
      await trackLayer.add(geoRegion, '')
      await queryRecordset.moveNext()
      // await recordset.addNew(geoRegion)
      // await recordset.update()
      isEOF = await queryRecordset.isEOF()
    }
    // await recordset.dispose()
  }
  await map.refresh()
}

function clear(map) {
  (async function () {
    let trackLayer = await map.getTrackingLayer()
    await trackLayer.clear()
    await map.refresh()
  }).bind(this)()
}

export default {
  analyst,
  clear,
}