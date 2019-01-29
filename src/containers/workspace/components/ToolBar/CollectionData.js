import {
  SMap,
  SCollector,
  SMCollectorType,
  DatasetType,
  GeoStyle,
} from 'imobile_for_reactnative'
import constants from '../../constants'
import { ConstToolType, ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import ToolbarBtnType from './ToolbarBtnType'

let _params = {}

function setParams(params) {
  _params = params
}

/**
 * 获取采集操作
 * @param type
 * @param params
 * @returns {{data: Array, buttons: Array}}
 */
function getCollectionOperationData(type, params) {
  _params = params
  let data = [],
    buttons = []

  // 判断是否是采集操作功能
  if (
    type !== ConstToolType.MAP_COLLECTION_POINT &&
    type !== ConstToolType.MAP_COLLECTION_LINE &&
    type !== ConstToolType.MAP_COLLECTION_REGION
  )
    return { data, buttons }

  let gpsPointType =
    type === ConstToolType.MAP_COLLECTION_POINT
      ? SMCollectorType.POINT_GPS
      : type === ConstToolType.MAP_COLLECTION_LINE
        ? SMCollectorType.LINE_GPS_POINT
        : SMCollectorType.REGION_GPS_POINT
  data.push({
    key: 'gpsPoint',
    title: 'GPS打点',
    action: () => showCollection(gpsPointType),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_collection_point_collect.png'),
  })
  if (type !== ConstToolType.MAP_COLLECTION_POINT) {
    let gpsPathType =
      type === ConstToolType.MAP_COLLECTION_LINE
        ? SMCollectorType.LINE_GPS_PATH
        : SMCollectorType.REGION_GPS_PATH
    data.push({
      key: 'gpsPath',
      title: 'GPS轨迹',
      action: () => showCollection(gpsPathType),
      size: 'large',
      image: require('../../../../assets/mapTools/icon_collection_path_start.png'),
    })
  }

  switch (type) {
    case ConstToolType.MAP_COLLECTION_POINT:
      data.push(
        {
          key: 'pointDraw',
          title: '点绘式',
          action: () => showCollection(SMCollectorType.POINT_HAND),
          size: 'large',
          image: require('../../../../assets/mapTools/icon_collection_point.png'),
        },
        // {
        //   key: 'takePhoto',
        //   title: '拍照',
        //   action: () => showCollection(type),
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_take_photo.png'),
        // },
      )
      break
    case ConstToolType.MAP_COLLECTION_LINE:
      data.push(
        {
          key: 'pointDraw',
          title: '点绘式',
          action: () => showCollection(SMCollectorType.LINE_HAND_POINT),
          size: 'large',
          image: require('../../../../assets/mapTools/icon_collection_line.png'),
        },
        {
          key: 'freeDraw',
          title: '自由式',
          action: () => showCollection(SMCollectorType.LINE_HAND_PATH),
          size: 'large',
          image: require('../../../../assets/mapTools/icon_collection_line_freedom.png'),
        },
      )
      break
    case ConstToolType.MAP_COLLECTION_REGION:
      data.push(
        {
          key: 'pointDraw',
          title: '点绘式',
          action: () => showCollection(SMCollectorType.REGION_HAND_POINT),
          size: 'large',
          image: require('../../../../assets/mapTools/icon_collection_region.png'),
        },
        {
          key: 'freeDraw',
          title: '自由式',
          action: () => showCollection(SMCollectorType.REGION_HAND_PATH),
          size: 'large',
          image: require('../../../../assets/mapTools/icon_collection_region_freedom.png'),
        },
      )
      break
  }

  buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.PLACEHOLDER,
    ToolbarBtnType.MAP_SYMBOL,
  ]
  return { data, buttons }
}

/**
 * 获取采集操作数据
 * @param type
 * @returns {*}
 */
function getCollectionData(type, params) {
  _params = params
  let data = [],
    buttons = []
  let isCollection = false

  // MAP_COLLECTION_CONTROL_ 类型是MapControl的操作
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    isCollection = true
  } else {
    Object.keys(SMCollectorType).forEach(key => {
      if (SMCollectorType[key] === type) {
        isCollection = true
      }
    })
  }

  // 判断是否是采集功能
  if (!isCollection) return { data, buttons }

  if (
    type === SMCollectorType.POINT_GPS ||
    type === SMCollectorType.LINE_GPS_POINT ||
    type === SMCollectorType.REGION_GPS_POINT
  ) {
    data.push({
      key: 'addGPSPoint',
      title: '打点',
      action: () => SCollector.addGPSPoint(type),
      size: 'large',
      image: require('../../../../assets/mapTools/icon_collection_point_collect.png'),
    })
  }
  if (
    type === SMCollectorType.LINE_GPS_PATH ||
    type === SMCollectorType.REGION_GPS_PATH
  ) {
    data.push({
      key: 'start',
      title: '开始',
      action: () => SCollector.startCollect(type),
      size: 'large',
      image: require('../../../../assets/mapTools/icon_collection_path_start.png'),
    })
    data.push({
      key: 'stop',
      title: '停止',
      action: () => {},
      size: 'large',
      image: require('../../../../assets/mapTools/icon_pause.png'),
      selectedImage: require('../../../../assets/mapTools/icon_collection_path_pause.png'),
    })
  }
  data.push({
    key: constants.UNDO,
    title: constants.UNDO,
    action: () => undo(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_undo_black.png'),
  })
  data.push({
    key: constants.REDO,
    title: constants.REDO,
    action: () => redo(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_recover_black.png'),
  })
  data.push({
    key: constants.CANCEL,
    title: constants.CANCEL,
    action: () => cancel(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_close_black.png'),
  })
  data.push({
    key: constants.SUBMIT,
    title: constants.SUBMIT,
    action: () => collectionSubmit(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_submit_black.png'),
  })
  buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.CHANGE_COLLECTION,
    ToolbarBtnType.MAP_SYMBOL,
  ]

  return { data, buttons }
}

/** 采集分类点击事件 **/
function showCollection(type) {
  let { data, buttons } = getCollectionData(type, _params)
  if (!_params.setToolbarVisible) return
  // _params.setLastState()
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
  _params.setToolbarVisible(true, type, {
    isFullScreen: false,
    height,
    data: data,
    buttons: buttons,
    column,
    cb: () => {
      _params.setLastState()
      createCollector(type)
    },
  })
}

/** 创建采集 **/
async function createCollector(type) {
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
      if (_params.symbol.currentSymbol.type === 'marker') {
        geoStyle.setMarkerStyle(_params.symbol.currentSymbol.id)
      }
      mType = DatasetType.POINT
      break
    }
    case SMCollectorType.LINE_GPS_POINT:
    case SMCollectorType.LINE_GPS_PATH:
    case SMCollectorType.LINE_HAND_POINT:
    case SMCollectorType.LINE_HAND_PATH: {
      if (_params.symbol.currentSymbol.type === 'line') {
        geoStyle.setLineStyle(_params.symbol.currentSymbol.id)
      }
      mType = DatasetType.LINE
      break
    }
    case SMCollectorType.REGION_GPS_POINT:
    case SMCollectorType.REGION_GPS_PATH:
    case SMCollectorType.REGION_HAND_POINT:
    case SMCollectorType.REGION_HAND_PATH: {
      if (_params.symbol.currentSymbol.type === 'fill') {
        geoStyle.setFillStyle(_params.symbol.currentSymbol.id)
      }
      mType = DatasetType.REGION
      break
    }
  }
  //设置绘制风格
  await SCollector.setStyle(collectorStyle)

  let params = {}
  if (_params.template.currentTemplateInfo.layerPath) {
    params = { layerPath: _params.template.currentTemplateInfo.layerPath }
  } else {
    let datasetName = _params.symbol.currentSymbol.type
      ? _params.symbol.currentSymbol.type +
        '_' +
        _params.symbol.currentSymbol.id
      : ''
    let datasourcePath = await FileTools.appendingHomeDirectory(
      _params.user && _params.user.currentUser && _params.user.currentUser.name
        ? ConstPath.UserPath +
            _params.user.currentUser.name +
            '/' +
            ConstPath.RelativePath.Datasource
        : ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
    )

    let mapInfo = await SMap.getMapInfo()

    let datasourceName =
      (_params.map && _params.map.currentMap.name) ||
      mapInfo.name ||
      'Collection-' + new Date().getTime()
    params = {
      datasourcePath: _params.collection.datasourceParentPath || datasourcePath,
      datasourceName: _params.collection.datasourceName || datasourceName,
      datasetName,
      datasetType: mType,
      style: geoStyle,
    }
  }

  SCollector.setDataset(params).then(() => {
    SCollector.startCollect(type)
    _params.getLayers(-1, layers => {
      _params.setCurrentLayer(layers.length > 0 && layers[0])
    })
  })
}

async function collectionSubmit(type) {
  let result = await SCollector.submit(type)
  if (_params.template.currentTemplateInfo.layerPath) {
    SMap.setLayerFieldInfo(
      _params.template.currentTemplateInfo.layerPath,
      _params.template.currentTemplateInfo.field,
    )
  }
  return result
}

function cancel(type) {
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    type = -1
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

export default {
  setParams,
  getCollectionOperationData,
  getCollectionData,
  showCollection,
}
