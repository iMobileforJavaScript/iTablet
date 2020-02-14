import {
  SCollector,
  SMCollectorType,
  SMap,
  DatasetType,
  GeoStyle,
  Action,
} from 'imobile_for_reactnative'
import { ConstToolType, ConstPath } from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import ToolbarModule from '../ToolbarModule'
import CollectionData from './CollectionData'

/**
 *
 */
function changeCollection() {
  const params = ToolbarModule.getParams()
  const data = ToolbarModule.getData()
  SCollector.stopCollect()
  let toolbarType
  switch (data.lastType) {
    case SMCollectorType.REGION_GPS_PATH:
    case SMCollectorType.REGION_GPS_POINT:
    case SMCollectorType.REGION_HAND_PATH:
    case SMCollectorType.REGION_HAND_POINT:
      toolbarType = ConstToolType.MAP_COLLECTION_REGION
      break
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.LINE_GPS_POINT:
    case SMCollectorType.LINE_HAND_POINT:
    case SMCollectorType.LINE_HAND_PATH:
      toolbarType = ConstToolType.MAP_COLLECTION_LINE
      break
    case SMCollectorType.POINT_GPS:
    case SMCollectorType.POINT_HAND:
      toolbarType = ConstToolType.MAP_COLLECTION_POINT
      break
  }

  params.setToolbarVisible(true, toolbarType, {
    isFullScreen: false,
    height: ConstToolType.HEIGHT[0],
    cb: () => {
      ToolbarModule.addData({
        lastType: toolbarType,
      })
    },
  })
}

/** 采集分类点击事件 **/
function showCollection(type, layerName) {
  let { data, buttons } = CollectionData.getData(type)
  if (!ToolbarModule.getParams().setToolbarVisible) return
  let column = 4
  let rows = Math.ceil(data.length / column) - 1 + 1
  let height
  switch (rows) {
    case 2:
      height = ConstToolType.HEIGHT[2]
      break
    case 1:
    default:
      height = ConstToolType.HEIGHT[0]
      break
  }
  ToolbarModule.getParams().showFullMap(true)
  ToolbarModule.getParams().setToolbarVisible(true, type, {
    isFullScreen: false,
    height,
    data: data,
    buttons: buttons,
    column,
    cb: () => {
      ToolbarModule.addData({
        lastType: type,
      })
      createCollector(type, layerName)
    },
  })
}

function showSymbol() {
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_SYMBOL, {
    isFullScreen: true,
    height:
      params.device.orientation === 'PORTRAIT'
        ? ConstToolType.HEIGHT[3]
        : ConstToolType.THEME_HEIGHT[4],
    cb: () => SCollector.stopCollect(),
  })
}

/** 创建采集 **/
async function createCollector(type, layerName) {
  // 风格
  let geoStyle = new GeoStyle()
  let collectorStyle = new GeoStyle()
  collectorStyle.setPointColor(0, 255, 0)
  //线颜色
  collectorStyle.setLineColor(0, 255, 0)
  //面颜色
  collectorStyle.setFillForeColor(255, 0, 0)

  // let style = await SCollector.getStyle()
  let mType
  switch (type) {
    case SMCollectorType.POINT_GPS:
    case SMCollectorType.POINT_HAND: {
      if (
        ToolbarModule.getParams().symbol.currentSymbol &&
        ToolbarModule.getParams().symbol.currentSymbol.type &&
        ToolbarModule.getParams().symbol.currentSymbol.type.toLowerCase() ===
          'marker'
      ) {
        geoStyle.setMarkerStyle(
          ToolbarModule.getParams().symbol.currentSymbol.id,
        )
      }
      mType = DatasetType.POINT
      break
    }
    case SMCollectorType.LINE_GPS_POINT:
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.LINE_HAND_POINT:
    case SMCollectorType.LINE_HAND_PATH: {
      if (
        ToolbarModule.getParams().symbol.currentSymbol &&
        ToolbarModule.getParams().symbol.currentSymbol.type &&
        ToolbarModule.getParams().symbol.currentSymbol.type.toLowerCase() ===
          'line'
      ) {
        geoStyle.setLineStyle(ToolbarModule.getParams().symbol.currentSymbol.id)
      }
      mType = DatasetType.LINE
      break
    }
    case SMCollectorType.REGION_GPS_POINT:
    case SMCollectorType.REGION_GPS_PATH:
    case SMCollectorType.REGION_HAND_POINT:
    case SMCollectorType.REGION_HAND_PATH: {
      if (
        ToolbarModule.getParams().symbol.currentSymbol &&
        ToolbarModule.getParams().symbol.currentSymbol.type &&
        ToolbarModule.getParams().symbol.currentSymbol.type.toLowerCase() ===
          'fill'
      ) {
        geoStyle.setFillStyle(ToolbarModule.getParams().symbol.currentSymbol.id)
      }
      mType = DatasetType.REGION
      break
    }
  }

  let params = {}
  if (ToolbarModule.getParams().template.currentTemplateInfo.layerPath) {
    params = {
      layerPath: ToolbarModule.getParams().template.currentTemplateInfo
        .layerPath,
    }
  } else if (layerName !== undefined) {
    params = { layerPath: layerName }
  } else {
    let datasetName = ToolbarModule.getParams().symbol.currentSymbol.type
      ? ToolbarModule.getParams().symbol.currentSymbol.type +
        '_' +
        ToolbarModule.getParams().symbol.currentSymbol.id
      : ''
    let datasourcePath =
      ToolbarModule.getParams().collection.datasourceParentPath ||
      (await FileTools.appendingHomeDirectory(
        ToolbarModule.getParams().user &&
          ToolbarModule.getParams().user.currentUser &&
          ToolbarModule.getParams().user.currentUser.name
          ? ConstPath.UserPath +
              ToolbarModule.getParams().user.currentUser.name +
              '/' +
              ConstPath.RelativePath.Datasource
          : ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
      ))

    let mapInfo = await SMap.getMapInfo()

    let datasourceName =
      ToolbarModule.getParams().collection.datasourceName ||
      (ToolbarModule.getParams().map &&
        ToolbarModule.getParams().map.currentMap.name &&
        ToolbarModule.getParams().map.currentMap.name + '_collection') ||
      mapInfo.name + '_collection' ||
      'Collection-' + new Date().getTime()

    params = {
      datasourcePath: datasourcePath,
      datasourceName: datasourceName,
      datasetName,
      datasetType: mType,
      style: geoStyle,
    }
  }

  SCollector.setDataset(params).then(async layerInfo => {
    if (!layerInfo) return
    //设置绘制风格
    await SCollector.setStyle(collectorStyle)
    await SCollector.initCollect(type)
    ToolbarModule.getParams().getLayers(-1, () => {
      ToolbarModule.getParams().setCurrentLayer(layerInfo)
    })
  })
}

async function collectionSubmit(type) {
  let result = await SCollector.submit(type)
  switch (type) {
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.REGION_GPS_PATH:
      await SCollector.stopCollect()
      break
  }
  if (ToolbarModule.getParams().template.currentTemplateInfo.layerPath) {
    SMap.setLayerFieldInfo(
      ToolbarModule.getParams().template.currentTemplateInfo.layerPath,
      ToolbarModule.getParams().template.currentTemplateInfo.field,
    )
  }
  //采集后 需要刷新属性表
  GLOBAL.NEEDREFRESHTABLE = true
  return result
}

async function cancel(type) {
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    type = -1
  }
  switch (type) {
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.REGION_GPS_PATH:
      await SCollector.stopCollect()
      break
  }
  return SCollector.cancel(type)
}

function undo(type) {
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    type = -1
  }
  return SCollector.undo(type)
}

function redo(type) {
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    type = -1
  }
  return SCollector.redo(type)
}

async function close(type) {
  const params = ToolbarModule.getParams()
  let actionType = Action.PAN
  // 当前为采集状态
  if (typeof type === 'number') {
    await SCollector.stopCollect()
  }
  params.existFullMap && params.existFullMap()
  // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
  params.setToolbarVisible(false)
  params.setCurrentTemplateInfo()
  params.setCurrentSymbol()
  ToolbarModule.setData() // 关闭Toolbar清除临时数据
  SMap.setAction(actionType)
}

export default {
  close,

  changeCollection,
  showCollection,
  showSymbol,
  createCollector,
  collectionSubmit,
  cancel,
  undo,
  redo,
}
