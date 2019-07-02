import { SMap, SMCollectorType } from 'imobile_for_reactnative'
import constants from '../../constants'
import { ConstToolType } from '../../../../constants'
import ToolbarBtnType from './ToolbarBtnType'
import { getLanguage } from '../../../../language/index'

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
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_POINTS_BY_GPS,
    //'GPS打点',
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
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_LINE_BY_GPS,
      //'GPS轨迹',
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
          title: getLanguage(global.language).Map_Main_Menu
            .COLLECTION_POINT_DRAW,
          //'点绘式',
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
          title: getLanguage(global.language).Map_Main_Menu
            .COLLECTION_POINT_DRAW,
          //'点绘式',
          action: () => showCollection(SMCollectorType.LINE_HAND_POINT),
          size: 'large',
          image: require('../../../../assets/mapTools/icon_collection_line.png'),
        },
        {
          key: 'freeDraw',
          title: getLanguage(global.language).Map_Main_Menu
            .COLLECTION_FREE_DRAW,
          //'自由式',
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
          title: getLanguage(global.language).Map_Main_Menu
            .COLLECTION_POINT_DRAW,
          //'点绘式',
          action: () => showCollection(SMCollectorType.REGION_HAND_POINT),
          size: 'large',
          image: require('../../../../assets/mapTools/icon_collection_region.png'),
        },
        {
          key: 'freeDraw',
          title: getLanguage(global.language).Map_Main_Menu
            .COLLECTION_FREE_DRAW,
          //'自由式',
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
function getCollectionData(libId, symbolCode, params) {
  _params = params
  let data = [],
    buttons = []
  data.push({
    key: constants.UNDO,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
    // constants.UNDO,
    action: () => undo(),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_undo_black.png'),
  })
  data.push({
    key: constants.REDO,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
    //constants.REDO,
    action: () => redo(),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_recover_black.png'),
  })

  data.push({
    key: constants.CANCEL,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_CANCEL,
    // constants.CANCEL,
    action: () => cancel(libId, symbolCode),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_close_black.png'),
  })
  data.push({
    key: constants.SUBMIT,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_SUBMIT,
    //constants.SUBMIT,
    action: () => collectionSubmit(),
    size: 'large',
    image: require('../../../../assets/mapTools/icon_submit_black.png'),
  })
  buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.CHANGE_COLLECTION,
    ToolbarBtnType.MAP_SYMBOL,
    ToolbarBtnType.COMPLETE,
  ]

  return { data, buttons }
}

/** 采集分类点击事件 **/
async function showCollection(libId, symbolCode, type) {
  // await SMap.addCadLayer('PlotEdit')
  await SMap.setPlotSymbol(libId, symbolCode)
  let { data, buttons } = getCollectionData(libId, symbolCode, _params)
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
      // createCollector(type)
    },
  })
}

async function collectionSubmit() {
  await SMap.submit()
  await SMap.refreshMap()
}

async function cancel(libId, symbolCode) {
  SMap.cancel()
  SMap.setPlotSymbol(libId, symbolCode)
}

function undo() {
  SMap.undo()
  SMap.refreshMap()
}

function redo() {
  SMap.redo()
  SMap.refreshMap()
}

export default {
  setParams,
  getCollectionOperationData,
  getCollectionData,
  showCollection,
}