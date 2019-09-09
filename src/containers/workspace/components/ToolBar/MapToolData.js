/**
 * 获取地图工具数据
 */
import {
  SMap,
  Action,
  SMediaCollector,
  DatasetType,
} from 'imobile_for_reactnative'
import { ConstToolType, TouchType, ConstPath } from '../../../../constants'
import { dataUtil, Toast, StyleUtils } from '../../../../utils'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { FileTools } from '../../../../native'
import { ImagePicker } from '../../../../components'
import constants from '../../constants'
import ToolbarBtnType from './ToolbarBtnType'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'

let _params = {}

/**
 * 判断当前图层类型 控制标注相关功能是否可用
 * @returns {string}
 */
function getCurrentLayerType() {
  let currentLayer = GLOBAL.currentLayer
  let layerType = ''
  if (currentLayer && !currentLayer.themeType) {
    switch (currentLayer.type) {
      case DatasetType.CAD:
        layerType = 'TAGGINGLAYER'
        break
      case DatasetType.POINT:
        layerType = 'POINTLAYER'
        break
      case DatasetType.LINE:
        layerType = 'LINELAYER'
        break
      case DatasetType.REGION:
        layerType = 'REGIONLAYER'
        break
      case DatasetType.TEXT:
        layerType = 'TEXTLAYER'
        break
    }
  }
  return layerType
}
/**
 * 获取工具操作
 * @param type
 * @param params
 * @returns {{data: Array, buttons: Array}}
 */
function getMapTool(type, params) {
  let data = [],
    buttons = []
  _params = params
  GLOBAL.MapToolType = type
  let layerType = ''
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
          title: getLanguage(global.language).Map_Label.ATTRIBUTE,
          //'属性记录',
          data: [
            {
              title: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
              //'名称',
              value: '',
              //action: name,
            },
            {
              title: getLanguage(global.language).Map_Main_Menu.TOOLS_REMARKS,
              //'备注',
              value: '',
              //action: remark,
            },
            // { title: '风格', action: remark },
            {
              title: getLanguage(global.language).Map_Main_Menu.TOOLS_HTTP,
              //'http地址',
              value: '',
              //action: address,
            },
            // { title: '图片', action: address },
          ],
        },
      ]
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.COMMIT,
      ]
      break
    case ConstToolType.MAP_TOOLS:
    case ConstToolType.MAP_TOOL:
      layerType = getCurrentLayerType()
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
          disable: layerType !== 'POINTLAYER' && layerType !== 'TAGGINGLAYER',
          size: 'large',
          image:
            layerType !== 'POINTLAYER' && layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_point_disable
              : require('../../../../assets/mapTools/icon_point_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_black.png'),
        },
        {
          key: constants.WORDS,
          title: getLanguage(global.language).Map_Main_Menu.TOOLS_CREATE_TEXT,
          //constants.WORDS,
          size: 'large',
          action: words,
          disable: layerType !== 'TEXTLAYER' && layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'TEXTLAYER' && layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_text_disable
              : require('../../../../assets/mapTools/icon_words_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_words_black.png'),
        },
        {
          key: constants.POINTLINE,
          title: getLanguage(global.language).Map_Main_Menu.DOT_LINE,
          //constants.POINTLINE,
          size: 'large',
          action: pointline,
          disable: layerType !== 'LINELAYER' && layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'LINELAYER' && layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_point_line_disable
              : require('../../../../assets/mapTools/icon_point_line_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_line_black.png'),
        },
        {
          key: constants.FREELINE,
          title: getLanguage(global.language).Map_Main_Menu.FREE_LINE,
          //constants.FREELINE,
          size: 'large',
          action: freeline,
          disable: layerType !== 'LINELAYER' && layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'LINELAYER' && layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_free_line_disable
              : require('../../../../assets/mapTools/icon_free_line_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_free_line_black.png'),
        },
        {
          key: constants.POINTCOVER,
          title: getLanguage(global.language).Map_Main_Menu.DOT_REGION,
          //constants.POINTCOVER,
          size: 'large',
          action: pointcover,
          disable: layerType !== 'REGIONLAYER' && layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'REGIONLAYER' && layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_region_disable
              : require('../../../../assets/mapTools/icon_point_cover_black.png'),
          selectedImage: require('../../../../assets/mapTools/icon_point_cover_black.png'),
        },
        {
          key: constants.FREECOVER,
          title: getLanguage(global.language).Map_Main_Menu.FREE_REGION,
          //constants.FREECOVER,
          size: 'large',
          action: freecover,
          disable: layerType !== 'REGIONLAYER' && layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'REGIONLAYER' && layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_free_region_disable
              : require('../../../../assets/mapTools/icon_free_cover_black.png'),
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
        {
          key: 'captureImage',
          title: getLanguage(global.language).Map_Main_Menu.CAMERA,
          action: captureImage,
          size: 'large',
          disable: layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'TAGGINGLAYER'
              ? getPublicAssets().mapTools.tools_camera_disable
              : getPublicAssets().mapTools.tools_camera,
        },
        {
          key: 'tour',
          title: getLanguage(global.language).Map_Main_Menu.TOUR,
          action: tour,
          size: 'large',
          image: getPublicAssets().mapTools.tour,
        },
        {
          key: 'matchPictureStyle',
          title: getLanguage(global.language).Map_Main_Menu.STYLE_TRANSFER,
          action: matchPictureStyle,
          size: 'large',
          image: getThemeAssets().mapTools.rightbar_tool_style,
        },
        // {
        //   key: 'captureVideo',
        //   title: '视频',
        //   action: captureVideo,
        //   size: 'large',
        //   image: getPublicAssets().mapTools.tools_camera,
        // },
        // {
        //   key: 'startCaptureAudio',
        //   title: '开始录音',
        //   action: startCaptureAudio,
        //   size: 'large',
        //   image: getPublicAssets().mapTools.tools_camera,
        // },
        // {
        //   key: 'stopCaptureAudio',
        //   title: '停止录音',
        //   action: stopCaptureAudio,
        //   size: 'large',
        //   image: getPublicAssets().mapTools.tools_camera,
        // },
      ]
      // buttons = [
      //   ToolbarBtnType.CANCEL,
      //   ToolbarBtnType.PLACEHOLDER,
      //   ToolbarBtnType.PLACEHOLDER,
      // ]
      break
    // case ConstToolType.MAP_TOOL:
    //   data = [
    //     {
    //       key: 'distanceComput',
    //       title: getLanguage(global.language).Map_Main_Menu
    //         .TOOLS_DISTANCE_MEASUREMENT,
    //       //'距离量算',
    //       action: measureLength,
    //       size: 'large',
    //       image: require('../../../../assets/mapTools/icon_measure_length_black.png'),
    //     },
    //     {
    //       key: 'coverComput',
    //       title: getLanguage(global.language).Map_Main_Menu
    //         .TOOLS_AREA_MEASUREMENT,
    //       //'面积量算',
    //       action: measureArea,
    //       size: 'large',
    //       image: require('../../../../assets/mapTools/icon_measure_area_black.png'),
    //     },
    //     {
    //       key: 'azimuthComput',
    //       title: getLanguage(global.language).Map_Main_Menu
    //         .TOOLS_AZIMUTH_MEASUREMENT,
    //       //'方位角量算',
    //       action: measureAngle,
    //       size: 'large',
    //       image: require('../../../../assets/mapTools/icon_measure_angle_black.png'),
    //     },
    //     {
    //       key: 'pointSelect',
    //       title: getLanguage(global.language).Map_Main_Menu.TOOLS_SELECT,
    //       //'点选',
    //       action: pointSelect,
    //       size: 'large',
    //       image: require('../../../../assets/mapTools/icon_free_point_select_black.png'),
    //     },
    //     {
    //       key: 'selectByRectangle',
    //       title: getLanguage(global.language).Map_Main_Menu
    //         .TOOLS_RECTANGLE_SELECT,
    //       //'框选',
    //       action: selectByRectangle,
    //       size: 'large',
    //       image: require('../../../../assets/mapTools/icon_select_by_rectangle.png'),
    //     },
    //     {
    //       key: 'pointSelect',
    //       title: getLanguage(global.language).Map_Main_Menu.FULL_SCREEN,
    //       //'全幅',
    //       //getLanguage(global.language).Map_Main_Menu.START_OPEN_MAP,
    //       //'全幅',
    //       action: viewEntire,
    //       size: 'large',
    //       image: require('../../../../assets/mapTools/icon_full_screen.png'),
    //     },
    //     // {
    //     //   key: 'boxSelect',
    //     //   title: '框选',
    //     //   action: this.showBox,
    //     //   size: 'large',
    //     //   image: require('../../../../assets/mapTools/icon_point_cover.png'),
    //     // },
    //     // {
    //     //   key: 'roundSelect',
    //     //   title: '圆选',
    //     //   action: this.showBox,
    //     //   size: 'large',
    //     //   image: require('../../../../assets/mapTools/icon_free_cover.png'),
    //     // },
    //     {
    //       key: 'rectangularCut',
    //       title: getLanguage(global.language).Map_Main_Menu
    //         .TOOLS_RECTANGLE_CLIP,
    //       //'矩形裁剪',
    //       action: rectangleCut,
    //       size: 'large',
    //       image: getPublicAssets().mapTools.tools_rectangle_cut,
    //     },
    //     // {
    //     //   key: 'roundCut',
    //     //   title: '圆形裁剪',
    //     //   action: this.showBox,
    //     //   size: 'large',
    //     //   image: require('../../../../assets/mapTools/icon_road_track.png'),
    //     // },
    //     // {
    //     //   key: 'polygonCut',
    //     //   title: '多边形裁剪',
    //     //   action: this.showBox,
    //     //   size: 'large',
    //     //   image: require('../../../../assets/mapTools/icon_equal_track.png'),
    //     // },
    //     // {
    //     //   key: 'selectCut',
    //     //   title: '选中对象裁剪',
    //     //   action: this.showBox,
    //     //   size: 'large',
    //     //   image: require('../../../../assets/mapTools/icon_time_track.png'),
    //     // },
    //     // {
    //     //   key: 'magnifier',
    //     //   title: '放大镜',
    //     //   action: this.showBox,
    //     //   size: 'large',
    //     //   image: require('../../../../assets/mapTools/icon_intelligence_track.png'),
    //     // },
    //     // {
    //     //   key: 'eagleChart',
    //     //   title: '鹰眼图',
    //     //   action: this.showBox,
    //     //   size: 'large',
    //     //   image: require('../../../../assets/mapTools/icon_eagle_chart.png'),
    //     // },
    //     // {
    //     //   key: 'play',
    //     //   title: '播放',
    //     //   action: this.showBox,
    //     //   size: 'large',
    //     //   image: require('../../../../assets/mapTools/icon_play.png'),
    //     // },
    //     // {
    //     //   key: 'fullAmplitude',
    //     //   title: '全幅',
    //     //   action: this.showBox,
    //     //   size: 'large',
    //     //   image: require('../../../../assets/mapTools/icon_full_amplitude.png'),
    //     // },
    //   ]
    //   // buttons = [
    //   //   ToolbarBtnType.CANCEL,
    //   //   ToolbarBtnType.PLACEHOLDER,
    //   //   ToolbarBtnType.PLACEHOLDER,
    //   // ]
    //   break
    case ConstToolType.MAP_TOOL_MEASURE_LENGTH:
    case ConstToolType.MAP_TOOL_MEASURE_AREA:
    case ConstToolType.MAP_TOOL_MEASURE_ANGLE:
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.MEASURE_CLEAR,
      ]
      break
    case ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT:
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE:
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
    case ConstToolType.MAP_TOOL_INCREMENT:
      data = [
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Prompt.UNDO,
          // action: this.showBox,
          size: 'large',
          image: require('../../../../assets/lightTheme/public/icon_undo_light.png'),
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Prompt.REDO,
          // action: this.showBox,
          size: 'large',
          image: require('../../../../assets/lightTheme/public/icon_redo_light.png'),
        },
        {
          key: constants.CANCEL,
          title: getLanguage(global.language).Prompt.CANCEL,
          //constants.CANCEL_SELECT,
          // action: cancelSelect,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_cancel_1.png'),
        },
        {
          key: constants.COMMIT,
          title: getLanguage(global.language).Prompt.COMMIT,
          //constants.CANCEL_SELECT,
          action: submit,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_submit_black.png'),
        },
      ]
      buttons = [ToolbarBtnType.CANCEL_INCREMENT]
      break
    case ConstToolType.MAP_TOOL_GPSINCREMENT:
      data = [
        {
          key: constants.BEGIN,
          title: getLanguage(global.language).Prompt.BEGIN,
          action: begin,
          size: 'large',
          image: require('../../../../assets/Navigation/begin.png'),
        },
        {
          key: constants.STOP,
          title: getLanguage(global.language).Prompt.STOP,
          action: stop,
          size: 'large',
          image: require('../../../../assets/Navigation/stop.png'),
        },
        {
          key: constants.CANCEL,
          title: getLanguage(global.language).Prompt.CANCEL,
          //constants.CANCEL_SELECT,
          // action: cancelSelect,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_cancel_1.png'),
        },
        {
          key: constants.COMMIT,
          title: getLanguage(global.language).Prompt.COMMIT,
          //constants.CANCEL_SELECT,
          action: submit,
          size: 'large',
          image: require('../../../../assets/mapTools/icon_submit_black.png'),
        },
      ]
      buttons = [ToolbarBtnType.CANCEL_INCREMENT]
      break
  }
  return { data, buttons }
}

function begin() {
  GLOBAL.GPS = setInterval(() => {
    SMap.gpsBegin()
  }, 2000)
}

function stop() {
  if (GLOBAL.GPS !== undefined) {
    clearInterval(GLOBAL.GPS)
  }
}

function submit() {
  if (GLOBAL.INCREMENTDATASETNAME === '') {
    Toast.show('请先创建路网数据集')
    return
  }
  (async function() {
    if (GLOBAL.MapToolType === ConstToolType.MAP_TOOL_GPSINCREMENT) {
      await SMap.addGPSRecordset()
    }
    await SMap.submit()
    let data = []
    let maplist = await SMap.getNetWorkDataset()
    if (maplist && maplist.length > 0) {
      let userList = []
      maplist.forEach(item => {
        let name = item.dataset
        item.title = name
        item.name = name.split('.')[0]
        item.image = require('../../../../assets/Navigation/network.png')
        userList.push(item)
      })
    }
    data.push({
      title: getLanguage(global.language).Map_Main_Menu.NETDATA,
      //'选择数据集',
      image: require('../../../../assets/Navigation/network_white.png'),
      data: maplist || [],
    })
    _params.setToolbarVisible(true, ConstToolType.NETWORKDATASET, {
      containerType: 'list',
      height: ConstToolType.THEME_HEIGHT[4],
      data,
      isFullScreen: false,
      buttons: [ToolbarBtnType.CANCEL_INCREMENT],
    })
  }.bind(this)())
}

function select() {
  switch (GLOBAL.currentToolbarType) {
    case ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT:
    case ConstToolType.MAP_TOOL_POINT_SELECT:
      SMap.setAction(Action.SELECT)
      break
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE:
    case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
      SMap.setAction(Action.SELECT_BY_RECTANGLE)
      // SMap.selectByRectangle()
      break
  }
}

function cancelSelect() {
  _params.setSelection(null)
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

  if (GLOBAL.MapToolType === ConstToolType.MAP_TOOLS) {
    GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT
  } else {
    GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_POINT_SELECT
  }

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

  if (GLOBAL.MapToolType === ConstToolType.MAP_TOOLS) {
    GLOBAL.currentToolbarType =
      ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE
  } else {
    GLOBAL.currentToolbarType = ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE
  }

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
  StyleUtils.setDefaultMapControlStyle().then(() => {
    SMap.measureLength(obj => {
      _params.showMeasureResult(true, obj.curResult.toFixed(6) + 'm')
    })
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
  StyleUtils.setDefaultMapControlStyle().then(() => {
    SMap.measureArea(obj => {
      _params.showMeasureResult(true, obj.curResult.toFixed(6) + '㎡')
    })
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
  StyleUtils.setDefaultMapControlStyle().then(() => {
    SMap.measureAngle(obj => {
      _params.showMeasureResult(true, dataUtil.angleTransfer(obj.curAngle, 6))
    })
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
        _params.showMeasureResult && _params.showMeasureResult(true, '0m')
        SMap.setAction(Action.MEASURELENGTH)
        break
      case ConstToolType.MAP_TOOL_MEASURE_AREA:
        _params.showMeasureResult && _params.showMeasureResult(true, '0㎡')
        SMap.setAction(Action.MEASUREAREA)
        break
      case ConstToolType.MAP_TOOL_MEASURE_ANGLE:
        _params.showMeasureResult && _params.showMeasureResult(true, '0°')
        SMap.setAction(Action.MEASUREANGLE)
        break
    }
  }
}

async function point() {
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let isTaggingLayer = false,
    isPointLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isPointLayer = currentLayer.type === DatasetType.POINT
  }
  if (isTaggingLayer || isPointLayer) {
    SMap.setAction(Action.CREATEPOINT)
    GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function words() {
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let isTaggingLayer = false,
    isTextLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isTextLayer = currentLayer.type === DatasetType.TEXT
  }
  if (isTaggingLayer || isTextLayer) {
    GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    GLOBAL.TouchType = TouchType.MAP_TOOL_TAGGING
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function pointline() {
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let isTaggingLayer = false,
    isLineLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isLineLayer = currentLayer.type === DatasetType.LINE
  }
  if (isTaggingLayer || isLineLayer) {
    GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.CREATEPOLYLINE)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function freeline() {
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let isTaggingLayer = false,
    isLineLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isLineLayer = currentLayer.type === DatasetType.LINE
  }
  if (isTaggingLayer || isLineLayer) {
    GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.DRAWLINE)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function pointcover() {
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let isTaggingLayer = false,
    isRegionLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isRegionLayer = currentLayer.type === DatasetType.REGION
  }
  if (isTaggingLayer || isRegionLayer) {
    GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.CREATEPOLYGON)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function freecover() {
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let isTaggingLayer = false,
    isRegionLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isRegionLayer = currentLayer.type === DatasetType.REGION
  }
  if (isTaggingLayer || isRegionLayer) {
    GLOBAL.ToolBar.setVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.DRAWPLOYGON)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

// function name() {
//   return NavigationService.navigate('InputPage', {
//     headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
//     cb: async value => {
//       if (value !== '') {
//         (async function() {
//           await SMap.addRecordset(
//             GLOBAL.TaggingDatasetName,
//             'name',
//             value,
//             _params.user.currentUser.userName,
//           )
//         }.bind(this)())
//       }
//       NavigationService.goBack()
//     },
//   })
// }

// function remark() {
//   return NavigationService.navigate('InputPage', {
//     headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_REMARKS,
//     cb: async value => {
//       if (value !== '') {
//         (async function() {
//           await SMap.addRecordset(
//             GLOBAL.TaggingDatasetName,
//             'remark',
//             value,
//             _params.user.currentUser.userName,
//           )
//         }.bind(this)())
//       }
//       NavigationService.goBack()
//     },
//   })
// }
//
// function address() {
//   return NavigationService.navigate('InputPage', {
//     headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_HTTP,
//     cb: async value => {
//       if (value !== '') {
//         (async function() {
//           await SMap.addRecordset(
//             GLOBAL.TaggingDatasetName,
//             'address',
//             value,
//             _params.user.currentUser.userName,
//           )
//         }.bind(this)())
//       }
//       NavigationService.goBack()
//     },
//   })
// }

//多媒体采集
function captureImage() {
  (async function() {
    let currentLayer = GLOBAL.currentLayer
    // let reg = /^Label_(.*)#$/
    if (currentLayer) {
      let isTaggingLayer = currentLayer.type === DatasetType.CAD
      // && currentLayer.datasourceAlias.match(reg)
      if (isTaggingLayer) {
        await SMap.setTaggingGrid(
          currentLayer.datasetName,
          _params.user.currentUser.userName,
        )
        const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
        const datasetName = currentLayer.datasetName // 标注图层名称
        NavigationService.navigate('Camera', {
          datasourceAlias,
          datasetName,
        })
      }
    } else {
      Toast.show(getLanguage(_params.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
      _params.navigation.navigate('LayerManager')
    }
  }.bind(this)())
}

function tour() {
  (async function() {
    // let {isTaggingLayer, layerInfo} = await SMap.getCurrentTaggingLayer(
    //   _params.user.currentUser.userName,
    // )
    //
    // // TODO 判断是否是轨迹标注图层
    // if (isTaggingLayer && GLOBAL.TaggingDatasetName) {
    //   let dsDes = layerInfo && layerInfo.datasetDescription &&
    //     layerInfo.datasetDescription !== 'NULL' && JSON.parse(layerInfo.datasetDescription)
    //   dsDes && dsDes.type !== 'tour' && await SMap.setTaggingGrid(
    //     GLOBAL.TaggingDatasetName,
    //     _params.user.currentUser.userName,
    //   )
    //   ImagePicker.AlbumListView.defaultProps.showDialog = false
    //   ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    // } else {
    let targetPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        _params.user.currentUser.userName +
        '/' +
        ConstPath.RelativeFilePath.Media,
    )
    SMediaCollector.initMediaCollector(targetPath)

    let tourLayer
    ImagePicker.AlbumListView.defaultProps.showDialog = true
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = (
      value = '',
      cb = () => {},
    ) => {
      if (value !== '') {
        (async function() {
          await SMap.setLabelColor()
          let tagginData = await SMap.newTaggingDataset(
            value,
            _params.user.currentUser.userName,
            false, // 轨迹图层都设置为不可编辑
            'tour',
          )
          tourLayer = tagginData.layerName
          cb && cb()
        }.bind(this)())
      }
      Toast.show(value)
    }
    // }

    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'

    ImagePicker.getAlbum({
      maxSize: 9,
      callback: async data => {
        if (data.length <= 1) {
          Toast.show(
            getLanguage(global.language).Prompt.SELECT_TWO_MEDIAS_AT_LEAST,
          )
          return
        }
        if (tourLayer) {
          let res = await SMediaCollector.addTour(tourLayer, data)
          res.result && (await SMap.setLayerFullView(tourLayer))
        }
      },
    })
  }.bind(this)())
}

/**
 * 智能配图
 */
function matchPictureStyle() {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'

  ImagePicker.getAlbum({
    maxSize: 1,
    callback: async data => {
      if (data.length === 1) {
        _params.setContainerLoading &&
          _params.setContainerLoading(
            true,
            getLanguage(global.language).Prompt.IMAGE_RECOGNITION_ING,
          )
        await SMap.matchPictureStyle(data[0].uri, res => {
          _params.setContainerLoading && _params.setContainerLoading(false)
          if (!res || !res.result) {
            Toast.show(
              getLanguage(global.language).Prompt.IMAGE_RECOGNITION_FAILED,
            )
          }
        })
        _params.showFullMap && _params.showFullMap(true)
        GLOBAL.ToolBar.setVisible(true, ConstToolType.STYLE_TRANSFER, {
          isFullScreen: false,
          height: 0,
        })
      }
    },
  })
}

// function captureVideo () {
//   let options = {
//     datasourceName: 'Hunan',
//   }
//   SMediaCollector.captureVideo(options, data => {
//     console.warn(JSON.stringify(data))
//   })
// }
//
// function startCaptureAudio () {
//   let options = {
//     datasourceName: 'Hunan',
//   }
//   SMediaCollector.startCaptureAudio(options)
// }
//
// function stopCaptureAudio () {
//   SMediaCollector.stopCaptureAudio(data => {
//     console.warn(JSON.stringify(data))
//   })
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
  matchPictureStyle,
  // addMapCutListener,
  // removeMapCutListener,
}
