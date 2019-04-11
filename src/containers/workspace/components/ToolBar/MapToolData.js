/**
 * 获取地图工具数据
 */
import { SMap, Action } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../constants'
import { dataUtil } from '../../../../utils'
// import { getPublicAssets } from '../../../../assets'
import constants from '../../constants'
import ToolbarBtnType from './ToolbarBtnType'
// import NavigationService from '../../../NavigationService'

let _params = {}

/**
 * 获取工具操作
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getMapTool(type, params) {
  let data = [],
    buttons = []
  _params = params
  if (type.indexOf(ConstToolType.MAP_TOOL) === -1) return { data, buttons }
  switch (type) {
    case ConstToolType.MAP_TOOL:
      data = [
        {
          key: 'distanceComput',
          title: '距离量算',
          action: measureLength,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_measure_length_black.png'),
        },
        {
          key: 'coverComput',
          title: '面积量算',
          action: measureArea,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_measure_area_black.png'),
        },
        {
          key: 'azimuthComput',
          title: '方位角量算',
          action: measureAngle,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_measure_angle_black.png'),
        },
        {
          key: 'pointSelect',
          title: '点选',
          action: pointSelect,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_free_point_select_black.png'),
        },
        {
          key: 'selectByRectangle',
          title: '框选',
          action: selectByRectangle,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_select_by_rectangle.png'),
        },
        {
          key: 'pointSelect',
          title: '全幅',
          action: viewEntire,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_full_screen.png'),
        },
        // {
        //   key: constants.POINT,
        //   title: constants.POINT,
        //   action: point,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_point_black.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_point_black.png'),
        // },
        // {
        //   key: constants.WORDS,
        //   title: constants.WORDS,
        //   size: 'large',
        //   action: words,
        //   image: require('../../../../assets/mapTools/icon_words_black.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_words_black.png'),
        // },
        // {
        //   key: constants.POINTLINE,
        //   title: constants.POINTLINE,
        //   size: 'large',
        //   action: pointline,
        //   image: require('../../../../assets/mapTools/icon_point_line_black.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_point_line_black.png'),
        // },
        // {
        //   key: constants.FREELINE,
        //   title: constants.FREELINE,
        //   size: 'large',
        //   action: freeline,
        //   image: require('../../../../assets/mapTools/icon_free_line_black.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_free_line_black.png'),
        // },
        // {
        //   key: constants.POINTCOVER,
        //   title: constants.POINTCOVER,
        //   size: 'large',
        //   action: pointcover,
        //   image: require('../../../../assets/mapTools/icon_point_cover_black.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_point_cover_black.png'),
        // },
        // {
        //   key: constants.FREECOVER,
        //   title: constants.FREECOVER,
        //   size: 'large',
        //   action: freecover,
        //   image: require('../../../../assets/mapTools/icon_free_cover_black.png'),
        //   selectedImage: require('../../../../assets/mapTools/icon_free_cover_black.png'),
        // },
        // {
        //   key: 'boxSelect',
        //   title: '框选',
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_point_cover.png'),
        // },
        // {
        //   key: 'roundSelect',
        //   title: '圆选',
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_free_cover.png'),
        // },
        // {
        //   key: 'rectangularCut',
        //   title: '矩形裁剪',
        //   action: rectangleCut,
        //   size: 'large',
        //   image: getPublicAssets().mapTools.tools_rectangle_cut,
        // },
        // {
        //   key: 'roundCut',
        //   title: '圆形裁剪',
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_road_track.png'),
        // },
        // {
        //   key: 'polygonCut',
        //   title: '多边形裁剪',
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_equal_track.png'),
        // },
        // {
        //   key: 'selectCut',
        //   title: '选中对象裁剪',
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_time_track.png'),
        // },
        // {
        //   key: 'magnifier',
        //   title: '放大镜',
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_intelligence_track.png'),
        // },
        // {
        //   key: 'eagleChart',
        //   title: '鹰眼图',
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_eagle_chart.png'),
        // },
        // {
        //   key: 'play',
        //   title: '播放',
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_play.png'),
        // },
        // {
        //   key: 'fullAmplitude',
        //   title: '全幅',
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_full_amplitude.png'),
        // },
      ]
      // buttons = [
      //   ToolbarBtnType.CANCEL,
      //   ToolbarBtnType.PLACEHOLDER,
      //   ToolbarBtnType.PLACEHOLDER,
      // ]
      break
    case ConstToolType.MAP_TOOL_MEASURE_LENGTH:
    case ConstToolType.MAP_TOOL_MEASURE_AREA:
    case ConstToolType.MAP_TOOL_MEASURE_ANGLE:
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.MEASURE_CLEAR,
      ]
      break
    case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
    case ConstToolType.MAP_TOOL_POINT_SELECT:
      data = [
        // {
        //   key: constants.SELECT_ALL,
        //   title: constants.SELECT_ALL,
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_point.png'),
        // },
        // {
        //   key: constants.SELECT_INVERSE,
        //   title: constants.SELECT_INVERSE,
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_words.png'),
        // },
        {
          key: constants.CANCEL_SELECT,
          title: constants.CANCEL_SELECT,
          action: cancelSelect,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_cancel_1.png'),
        },
      ]
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.SHOW_ATTRIBUTE]
      break
    case ConstToolType.MAP_TOOL_RECTANGLE_CUT:
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.COMMIT_CUT]
      break
  }
  return { data, buttons }
}

function select() {
  switch (GLOBAL.currentToolbarType) {
    case ConstToolType.MAP_TOOL_POINT_SELECT:
      SMap.setAction(Action.SELECT)
      break
    case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
      SMap.setAction(Action.SELECT_BY_RECTANGLE)
      // SMap.selectByRectangle()
      break
  }
}

function cancelSelect() {
  SMap.clearSelection()
}

function viewEntire() {
  SMap.viewEntire().then(() => {
    _params.setToolbarVisible && _params.setToolbarVisible(false)
  })
}

/** 单选 **/
function pointSelect() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_POINT_SELECT

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_POINT_SELECT, {
    containerType: 'table',
    column: 3,
    isFullScreen: false,
    height: ConstToolType.HEIGHT[0],
    cb: () => select(),
  })
}

/** 框选 **/
function selectByRectangle() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE, {
    containerType: 'table',
    column: 3,
    isFullScreen: false,
    height: ConstToolType.HEIGHT[0],
    cb: () => select(),
  })
}

// /** 矩形裁剪 **/
// function rectangleCut() {
//   if (!_params.setToolbarVisible) return
//   _params.showFullMap && _params.showFullMap(true)
//   // addMapCutListener()
//   GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(true)
//   GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_RECTANGLE_CUT
//
//   _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_RECTANGLE_CUT, {
//     isFullScreen: false,
//     height: 0,
//     cb: () => select(),
//   })
// }

/** 距离量算 **/
function measureLength() {
  select()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  _params.showMeasureResult(true, 0)
  SMap.measureLength(obj => {
    _params.showMeasureResult(true, obj.curResult.toFixed(6) + 'm')
  })
  GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_MEASURE_LENGTH

  _params.setToolbarVisible(true, GLOBAL.currentToolbarType, {
    containerType: 'table',
    column: 4,
    isFullScreen: false,
    height: 0,
  })
}

/**  面积量算  **/
function measureArea() {
  select()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  _params.showMeasureResult(true, 0)
  SMap.measureArea(obj => {
    _params.showMeasureResult(true, obj.curResult.toFixed(6) + '㎡')
  })
  GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_MEASURE_AREA

  _params.setToolbarVisible(true, GLOBAL.currentToolbarType, {
    containerType: 'table',
    column: 4,
    isFullScreen: false,
    height: 0,
  })
}

/**  角度量算  **/
function measureAngle() {
  select()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  _params.showMeasureResult(true, 0)
  SMap.measureAngle(obj => {
    _params.showMeasureResult(true, dataUtil.angleTransfer(obj.curAngle, 6))
  })
  GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_MEASURE_ANGLE

  _params.setToolbarVisible(true, GLOBAL.currentToolbarType, {
    containerType: 'table',
    column: 4,
    isFullScreen: false,
    height: 0,
  })
}

/** 清除量算结果 **/
function clearMeasure(type = GLOBAL.currentToolbarType) {
  if (typeof type === 'string' && type.indexOf('MAP_TOOL_MEASURE_') >= 0) {
    switch (type) {
      case ConstToolType.MAP_TOOL_MEASURE_LENGTH:
        SMap.setAction(Action.MEASURELENGTH)
        break
      case ConstToolType.MAP_TOOL_MEASURE_AREA:
        SMap.setAction(Action.MEASUREAREA)
        break
      case ConstToolType.MAP_TOOL_MEASURE_ANGLE:
        SMap.setAction(Action.MEASUREANGLE)
        break
    }
  }
}

// function point() {
//   if (!_params.setToolbarVisible) return
//   _params.showFullMap && _params.showFullMap(true)
//   SMap.setAction(Action.CREATEPOINT)
// }
//
// function words() {
//   (async function() {
//     let x = await SMap.getGestureDetector()
//     if (x !== null) {
//       NavigationService.navigate('InputPage', {
//         headerTitle: '标注名称',
//         cb: async value => {
//           if (value !== '') {
//             await SMap.addTextRecordset(GLOBAL.value, value, x.x, x.y)
//           }
//           NavigationService.goBack()
//         },
//       })
//     }
//   }.bind(this)())
// }
//
// function pointline() {
//   return SMap.setAction(Action.CREATEPOLYLINE)
// }
//
// function freeline() {
//   return SMap.setAction(Action.DRAWLINE)
// }
//
// function pointcover() {
//   return SMap.setAction(Action.CREATEPOLYGON)
// }
//
// function freecover() {
//   return SMap.setAction(Action.DRAWPLOYGON)
// }

/********** 裁剪手势监听 ************/
// async function addMapCutListener() {
//   await SMap.setGestureDetector({
//     touchBeganHandler: touchBeganHandler,
//     scrollHandler: scrollHandler,
//     touchEndHandler: touchEndHandler,
//     // scrollHandler: scrollHandler,
//   })
// }
//
// async function removeMapCutListener() {
//   await SMap.deleteGestureDetector()
// }
//
// let drawGeo = {
//   id: -1,
//   startPoint: {},
//   endPoint: {},
// }
// function touchBeganHandler (event) {
//   STracking.clear().then(async () => {
//     drawGeo.startPoint = {x: event.x, y: event.y}
//     drawGeo.id = await STracking.drawRectangle(drawGeo.id, drawGeo.startPoint, drawGeo.startPoint)
//   })
// }
//
// function scrollHandler (event) {
//   if (drawGeo.startPoint.x === event.x && drawGeo.startPoint.y === event.y){
//     return
//   } else if (drawGeo.startPoint.x === undefined && drawGeo.startPoint.y === undefined) {
//     drawGeo.startPoint.x = event.x
//     drawGeo.startPoint.y = event.y
//     return
//   }
//   drawGeo.endPoint = {x: event.x, y: event.y}
//   STracking.drawRectangle(drawGeo.id, drawGeo.startPoint, drawGeo.endPoint).then(async id => {
//     drawGeo.id = id
//   })
// }
//
// function touchEndHandler (event) {
//   drawGeo.endPoint = {x: event.x, y: event.y}
//   console.warn(JSON.stringify(drawGeo))
// }

export default {
  getMapTool,
  clearMeasure,
  // addMapCutListener,
  // removeMapCutListener,
}
