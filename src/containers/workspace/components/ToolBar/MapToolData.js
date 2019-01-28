/**
 * 获取地图工具数据
 */
import { SMap, Action } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../constants'
import { dataUtil } from '../../../../utils'
import constants from '../../constants'
import ToolbarBtnType from './ToolbarBtnType'

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
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_common_track.png'),
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
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.PLACEHOLDER,
      ]
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
          key: constants.CANCEL,
          title: constants.CANCEL,
          action: select,
          size: 'large',
          image: require('../../../../assets/mapEdit/cancel.png'),
        },
      ]
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.SHOW_ATTRIBUTE]
      break
  }
  return { data, buttons }
}

function select() {
  SMap.setAction(Action.SELECT)
}

function pointSelect() {
  select()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_POINT_SELECT

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_POINT_SELECT, {
    containerType: 'table',
    column: 3,
    isFullScreen: false,
    height: ConstToolType.HEIGHT[0],
  })
}

/** 距离量算 **/
function measureLength() {
  select()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  _params.showMeasureResult(true, 0)
  SMap.measureLength(obj => {
    _params.showMeasureResult(true, obj.curResult + 'm')
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
    _params.showMeasureResult(true, obj.curResult + '㎡')
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

export default {
  getMapTool,
  clearMeasure,
}
