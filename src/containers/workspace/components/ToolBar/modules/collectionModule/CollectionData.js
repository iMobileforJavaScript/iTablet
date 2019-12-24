import { SCollector, SMCollectorType } from 'imobile_for_reactnative'
import constants from '../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import { ConstToolType } from '../../../../../../constants'
import CollectionAction from './CollectionAction'
import ToolbarModule from '../ToolbarModule'

/**
 * 获取采集操作数据
 * @param type
 * @returns {*}
 */
function getData(type) {
  let data = [],
    buttons = []
  let isCollection = false

  if (
    type === ConstToolType.MAP_COLLECTION_POINT ||
    type === ConstToolType.MAP_COLLECTION_LINE ||
    type === ConstToolType.MAP_COLLECTION_REGION
  ) {
    return getOperationData(type)
  }

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
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_ADD_POINT,
      //'打点',
      action: () => SCollector.addGPSPoint(type),
      size: 'large',
      image: require('../../../../../../assets/mapTools/icon_collection_point_collect.png'),
    })
  }
  if (
    type === SMCollectorType.LINE_GPS_PATH ||
    type === SMCollectorType.REGION_GPS_PATH
  ) {
    data.push({
      key: 'start',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
      //'开始',
      action: () => SCollector.startCollect(type),
      size: 'large',
      image: require('../../../../../../assets/mapTools/icon_collection_path_start.png'),
    })
    data.push({
      key: 'stop',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_STOP,
      //'停止',
      action: () => SCollector.pauseCollect(type),
      size: 'large',
      image: require('../../../../../../assets/mapTools/icon_pause.png'),
      selectedImage: require('../../../../../../assets/mapTools/icon_collection_path_pause.png'),
    })
  }
  if (
    type !== SMCollectorType.LINE_GPS_PATH &&
    type !== SMCollectorType.REGION_GPS_PATH
  ) {
    data.push({
      key: constants.UNDO,
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
      // constants.UNDO,
      action: () => CollectionAction.undo(type),
      size: 'large',
      image: require('../../../../../../assets/mapTools/icon_undo_black.png'),
    })
    data.push({
      key: constants.REDO,
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
      //constants.REDO,
      action: () => CollectionAction.redo(type),
      size: 'large',
      image: require('../../../../../../assets/mapTools/icon_recover_black.png'),
    })
  }
  data.push({
    key: constants.CANCEL,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_CANCEL,
    // constants.CANCEL,
    action: () => CollectionAction.cancel(type),
    size: 'large',
    image: require('../../../../../../assets/mapTools/icon_close_black.png'),
  })
  data.push({
    key: constants.SUBMIT,
    title: getLanguage(global.language).Map_Main_Menu.COLLECTION_SUBMIT,
    //constants.SUBMIT,
    action: () => CollectionAction.collectionSubmit(type),
    size: 'large',
    image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
  })
  buttons = [
    ToolbarBtnType.CANCEL,
    {
      type: ToolbarBtnType.CHANGE_COLLECTION,
      image: getThemeAssets().collection.icon_collection_change,
      action: CollectionAction.changeCollection,
    },
    {
      type: ToolbarBtnType.MAP_SYMBOL,
      image: require('../../../../../../assets/mapEdit/icon_function_symbol.png'),
      action: CollectionAction.showSymbol,
    },
    // ToolbarBtnType.COMPLETE,
  ]

  return { data, buttons }
}

/**
 * 获取采集操作
 * @param type
 * @param params
 * @returns {{data: Array, buttons: Array}}
 */
function getOperationData(type) {
  let data = [],
    buttons = []
  let _params = ToolbarModule.getParams()
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
    action: () =>
      CollectionAction.showCollection(gpsPointType, _params.currentLayer.path),
    size: 'large',
    image: require('../../../../../../assets/mapTools/icon_collection_point_collect.png'),
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
      action: () =>
        CollectionAction.showCollection(gpsPathType, _params.currentLayer.path),
      size: 'large',
      image: require('../../../../../../assets/mapTools/icon_collection_path_start.png'),
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
          action: () =>
            CollectionAction.showCollection(
              SMCollectorType.POINT_HAND,
              _params.currentLayer.path,
            ),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_collection_point.png'),
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
          action: () =>
            CollectionAction.showCollection(
              SMCollectorType.LINE_HAND_POINT,
              _params.currentLayer.path,
            ),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_collection_line.png'),
        },
        {
          key: 'freeDraw',
          title: getLanguage(global.language).Map_Main_Menu
            .COLLECTION_FREE_DRAW,
          //'自由式',
          action: () =>
            CollectionAction.showCollection(
              SMCollectorType.LINE_HAND_PATH,
              _params.currentLayer.path,
            ),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_collection_line_freedom.png'),
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
          action: () =>
            CollectionAction.showCollection(
              SMCollectorType.REGION_HAND_POINT,
              _params.currentLayer.path,
            ),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_collection_region.png'),
        },
        {
          key: 'freeDraw',
          title: getLanguage(global.language).Map_Main_Menu
            .COLLECTION_FREE_DRAW,
          //'自由式',
          action: () =>
            CollectionAction.showCollection(
              SMCollectorType.REGION_HAND_PATH,
              _params.currentLayer.path,
            ),
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_collection_region_freedom.png'),
        },
      )
      break
  }

  buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.PLACEHOLDER,
    {
      type: ToolbarBtnType.MAP_SYMBOL,
      image: require('../../../../../../assets/mapEdit/icon_function_symbol.png'),
      action: CollectionAction.showSymbol,
    },
  ]
  return { data, buttons }
}

export default {
  getData,
  getOperationData,
}
