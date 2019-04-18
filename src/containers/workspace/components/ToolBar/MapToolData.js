/**
 * 获取地图工具数据
 */
import { SMap, Action } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../constants'
import { dataUtil } from '../../../../utils'
import { getPublicAssets } from '../../../../assets'
import constants from '../../constants'
import ToolbarBtnType from './ToolbarBtnType'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language/index'

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
    case ConstToolType.MAP_TOOL_TAGGING:
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.COMMIT,
      ]
      break
    case ConstToolType.MAP_TOOL_TAGGING_SETTING:
      data = [
        {
          title: getLanguage(global.language).Map_Lable.ATTRIBUTE,
          //'属性记录',
          data: [
            {
              title: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
              //'名称',
              action: name,
            },
            {
              title: getLanguage(global.language).Map_Main_Menu.TOOLS_REMARKS,
              //'备注',
              action: remark,
            },
            // { title: '风格', action: remark },
            {
              title: getLanguage(global.language).Map_Main_Menu.TOOLS_HTTP,
              //'http地址',
              action: address,
            },
            // { title: '图片', action: address },
          ],
        },
      ]
      buttons = [
        // ToolbarBtnType.TAGGING_BACK,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.COMMIT,
      ]
      break
    case ConstToolType.MAP_TOOL:
      data = [
        {
          key: 'distanceComput',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_DISTANCE_MEASUREMENT,
          //'距离量算',
          action: measureLength,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_measure_length_black.png'),
        },
        {
          key: 'coverComput',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_AREA_MEASUREMENT,
          //'面积量算',
          action: measureArea,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_measure_area_black.png'),
        },
        {
          key: 'azimuthComput',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_AZIMUTH_MEASUREMENT,
          //'方位角量算',
          action: measureAngle,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_measure_angle_black.png'),
        },
        {
          key: 'pointSelect',
          title: getLanguage(global.language).Map_Main_Menu.TOOLS_SELECT,
          //'点选',
          action: pointSelect,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_free_point_select_black.png'),
        },
        {
          key: 'selectByRectangle',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_RECTANGLE_SELECT,
          //'框选',
          action: selectByRectangle,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_select_by_rectangle.png'),
        },
        {
          key: 'pointSelect',
          title: getLanguage(global.language).Map_Main_Menu.FULL_SCREEN,
          //'全幅',
          //getLanguage(global.language).Map_Main_Menu.START_OPEN_MAP,
          //'全幅',
          action: viewEntire,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_full_screen.png'),
        },
        {
          key: constants.POINT,
          title: getLanguage(global.language).Map_Main_Menu.TOOLS_CREATE_POINT,
          //constants.POINT,
          action: point,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_point_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_black.png'),
        },
        {
          key: constants.WORDS,
          title: getLanguage(global.language).Map_Main_Menu.TOOLS_CREATE_TEXT,
          //constants.WORDS,
          size: 'large',
          action: words,
          image: require('../../../../assets/mapTools/icon_words_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_words_black.png'),
        },
        {
          key: constants.POINTLINE,
          title: getLanguage(global.language).Map_Main_Menu.DOT_LINE,
          //constants.POINTLINE,
          size: 'large',
          action: pointline,
          image: require('../../../../assets/mapTools/icon_point_line_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_line_black.png'),
        },
        {
          key: constants.FREELINE,
          title: getLanguage(global.language).Map_Main_Menu.FREE_LINE,
          //constants.FREELINE,
          size: 'large',
          action: freeline,
          image: require('../../../../assets/mapTools/icon_free_line_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_line_black.png'),
        },
        {
          key: constants.POINTCOVER,
          title: getLanguage(global.language).Map_Main_Menu.DOT_REGION,
          //constants.POINTCOVER,
          size: 'large',
          action: pointcover,
          image: require('../../../../assets/mapTools/icon_point_cover_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_cover_black.png'),
        },
        {
          key: constants.FREECOVER,
          title: getLanguage(global.language).Map_Main_Menu.FREE_REGION,
          //constants.FREECOVER,
          size: 'large',
          action: freecover,
          image: require('../../../../assets/mapTools/icon_free_cover_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_cover_black.png'),
        },
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
        {
          key: 'rectangularCut',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_RECTANGLE_CLIP,
          //'矩形裁剪',
          action: rectangleCut,
          size: 'large',
          image: getPublicAssets().mapTools.tools_rectangle_cut,
        },
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
          title: getLanguage(global.language).Prompt.CANCEL,
          //constants.CANCEL_SELECT,
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
  select()
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

/** 矩形裁剪 **/
function rectangleCut() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  // addMapCutListener()
  GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(true)
  GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_RECTANGLE_CUT

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_RECTANGLE_CUT, {
    isFullScreen: false,
    height: 0,
    cb: () => select(),
  })
}

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

function point() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  SMap.setAction(Action.CREATEPOINT)
  GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
    isFullScreen: false,
    height: ConstToolType.HEIGHT[4],
  })
}

function words() {
  (async function() {
    await SMap.setGestureDetector({
      singleTapHandler: setwords,
    })
  }.bind(this)())
  GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
    isFullScreen: false,
    height: ConstToolType.HEIGHT[4],
  })
}

function setwords(event) {
  NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
    cb: async value => {
      if (value !== '') {
        await SMap.addTextRecordset(
          GLOBAL.TaggingDatasetName,
          value,
          _params.user.currentUser.userName,
          event.x,
          event.y,
        )
      }
      await SMap.deleteGestureDetector()
      NavigationService.goBack()
    },
    backcb: async () => {
      await SMap.deleteGestureDetector()
      NavigationService.goBack()
    },
  })
}

function pointline() {
  GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
    isFullScreen: false,
    height: ConstToolType.HEIGHT[4],
  })
  SMap.setAction(Action.CREATEPOLYLINE)
}

function freeline() {
  GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
    isFullScreen: false,
    height: ConstToolType.HEIGHT[4],
  })
  SMap.setAction(Action.DRAWLINE)
}

function pointcover() {
  GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
    isFullScreen: false,
    height: ConstToolType.HEIGHT[4],
  })
  SMap.setAction(Action.CREATEPOLYGON)
}

function freecover() {
  GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
    isFullScreen: false,
    height: ConstToolType.HEIGHT[4],
  })
  SMap.setAction(Action.DRAWPLOYGON)
}

function name() {
  return NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
    cb: async value => {
      if (value !== '') {
        (async function() {
          await SMap.addRecordset(
            GLOBAL.TaggingDatasetName,
            'name',
            value,
            _params.user.currentUser.userName,
          )
        }.bind(this)())
      }
      NavigationService.goBack()
    },
  })
}

function remark() {
  return NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_REMARKS,
    cb: async value => {
      if (value !== '') {
        (async function() {
          await SMap.addRecordset(
            GLOBAL.TaggingDatasetName,
            'remark',
            value,
            _params.user.currentUser.userName,
          )
        }.bind(this)())
      }
      NavigationService.goBack()
    },
  })
}

function address() {
  return NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_HTTP,
    cb: async value => {
      if (value !== '') {
        (async function() {
          await SMap.addRecordset(
            GLOBAL.TaggingDatasetName,
            'address',
            value,
            _params.user.currentUser.userName,
          )
        }.bind(this)())
      }
      NavigationService.goBack()
    },
  })
}

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
