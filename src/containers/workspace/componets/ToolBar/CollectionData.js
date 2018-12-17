import { SMap, SCollector, SMCollectorType } from 'imobile_for_reactnative'
import constants from '../../constants'
import ToolbarBtnType from './ToolbarBtnType'

let _params = {}

function setParams(params) {
  _params = params
}

/**
 * 获取采集操作
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
      image: require('../../../../assets/function/icon_function_base_map.png'),
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
      image: require('../../../../assets/mapTools/icon_play.png'),
    })
    data.push({
      key: 'stop',
      title: '停止',
      action: () => {},
      size: 'large',
      image: require('../../../../assets/mapTools/icon_pause.png'),
      selectedImage: require('../../../../assets/mapTools/icon_pause_selected.png'),
    })
  }
  data.push({
    key: constants.UNDO,
    title: constants.UNDO,
    action: () => undo(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_undo.png'),
    selectedImage: require('../../../../assets/mapTools/icon_undo_selected.png'),
  })
  data.push({
    key: constants.REDO,
    title: constants.REDO,
    action: () => redo(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_redo.png'),
    selectedImage: require('../../../../assets/mapTools/icon_redo_selected.png'),
  })
  data.push({
    key: constants.CANCEL,
    title: constants.CANCEL,
    action: () => cancel(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_cancel.png'),
    selectedImage: require('../../../../assets/mapTools/icon_cancel_selected.png'),
  })
  data.push({
    key: constants.SUBMIT,
    title: constants.SUBMIT,
    action: () => collectionSubmit(type),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_submit.png'),
    selectedImage: require('../../../../assets/mapTools/icon_submit_select.png'),
  })
  buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.CHANGE_COLLECTION,
    ToolbarBtnType.MAP_SYMBOL,
  ]

  return { data, buttons }
}

async function collectionSubmit(type) {
  if (
    typeof type === 'string' &&
    type.indexOf('MAP_COLLECTION_CONTROL_') >= 0
  ) {
    // 若当前操作为模板符号绘制
    await SMap.submit()
    if (_params.layers.editLayer.path) {
      SMap.setLayerFieldInfo(
        _params.layers.editLayer.path,
        _params.map.currentTemplateInfo.field,
      )
    }
    return
  }
  return SCollector.submit(type)
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
  getCollectionData,
}
