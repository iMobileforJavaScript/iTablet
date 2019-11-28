/**
 * 获取地图工具数据
 */
import { DatasetType, SMap, Action } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../../../constants'
import { getPublicAssets, getThemeAssets } from '../../../../../../assets'
import constants from '../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import ToolAction from './ToolAction'
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
function getData(type, params) {
  let data = [],
    buttons = []
  ToolbarModule.setParams(params)
  GLOBAL.MapToolType = type
  let layerType = ''
  // if (type.indexOf(ConstToolType.MAP_TOOL) === -1) return { data, buttons }
  switch (type) {
    case ConstToolType.MAP_TOOL_TAGGING:
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.PLACEHOLDER,
        ToolbarBtnType.TOOLBAR_COMMIT,
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
        ToolbarBtnType.TOOLBAR_COMMIT,
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
          action: ToolAction.measureLength,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_measure_length_black.png'),
        },
        {
          key: 'coverComput',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_AREA_MEASUREMENT,
          //'面积量算',
          action: ToolAction.measureArea,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_measure_area_black.png'),
        },
        {
          key: 'azimuthComput',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_AZIMUTH_MEASUREMENT,
          //'方位角量算',
          action: ToolAction.measureAngle,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_measure_angle_black.png'),
        },
        {
          key: 'pointSelect',
          title: getLanguage(global.language).Map_Main_Menu.TOOLS_SELECT,
          //'点选',
          action: ToolAction.pointSelect,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_free_point_select_black.png'),
        },
        {
          key: 'selectByRectangle',
          title: getLanguage(global.language).Map_Main_Menu
            .TOOLS_RECTANGLE_SELECT,
          //'框选',
          action: ToolAction.selectByRectangle,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_select_by_rectangle.png'),
        },
        {
          key: 'pointSelect',
          title: getLanguage(global.language).Map_Main_Menu.FULL_SCREEN,
          //'全幅',
          //getLanguage(global.language).Map_Main_Menu.START_OPEN_MAP,
          //'全幅',
          action: ToolAction.viewEntire,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_full_screen.png'),
        },
        {
          key: constants.POINT,
          title: getLanguage(global.language).Map_Main_Menu.TOOLS_CREATE_POINT,
          //constants.POINT,
          action: ToolAction.point,
          disable: layerType !== 'TAGGINGLAYER',
          size: 'large',
          image:
            layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_point_disable
              : require('../../../../../../assets/mapTools/icon_point_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_point_black.png'),
        },
        {
          key: constants.WORDS,
          title: getLanguage(global.language).Map_Main_Menu.TOOLS_CREATE_TEXT,
          //constants.WORDS,
          size: 'large',
          action: ToolAction.words,
          disable: layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_text_disable
              : require('../../../../../../assets/mapTools/icon_words_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_words_black.png'),
        },
        {
          key: constants.POINTLINE,
          title: getLanguage(global.language).Map_Main_Menu.DOT_LINE,
          //constants.POINTLINE,
          size: 'large',
          action: ToolAction.pointline,
          disable: layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_point_line_disable
              : require('../../../../../../assets/mapTools/icon_point_line_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_point_line_black.png'),
        },
        {
          key: constants.FREELINE,
          title: getLanguage(global.language).Map_Main_Menu.FREE_LINE,
          //constants.FREELINE,
          size: 'large',
          action: ToolAction.freeline,
          disable: layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_free_line_disable
              : require('../../../../../../assets/mapTools/icon_free_line_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_free_line_black.png'),
        },
        {
          key: constants.POINTCOVER,
          title: getLanguage(global.language).Map_Main_Menu.DOT_REGION,
          //constants.POINTCOVER,
          size: 'large',
          action: ToolAction.pointcover,
          disable: layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_region_disable
              : require('../../../../../../assets/mapTools/icon_point_cover_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_point_cover_black.png'),
        },
        {
          key: constants.FREECOVER,
          title: getLanguage(global.language).Map_Main_Menu.FREE_REGION,
          //constants.FREECOVER,
          size: 'large',
          action: ToolAction.freecover,
          disable: layerType !== 'TAGGINGLAYER',
          image:
            layerType !== 'TAGGINGLAYER'
              ? getThemeAssets().mapTools.icon_free_region_disable
              : require('../../../../../../assets/mapTools/icon_free_cover_black.png'),
          selectedImage: require('../../../../../../assets/mapTools/icon_free_cover_black.png'),
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
          action: ToolAction.rectangleCut,
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
          action: ToolAction.captureImage,
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
          action: ToolAction.tour,
          size: 'large',
          image: getPublicAssets().mapTools.tour,
        },
        {
          key: 'matchPictureStyle',
          title: getLanguage(global.language).Map_Main_Menu.STYLE_TRANSFER,
          action: ToolAction.matchPictureStyle,
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
    case ConstToolType.MAP_TOOL_MEASURE_LENGTH:
    case ConstToolType.MAP_TOOL_MEASURE_AREA:
    case ConstToolType.MAP_TOOL_MEASURE_ANGLE:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.UNDO,
          action: ToolAction.undo,
        },
        {
          type: ToolbarBtnType.REDO,
          action: ToolAction.redo,
        },
        {
          type: ToolbarBtnType.MEASURE_CLEAR,
          action: ToolAction.clearMeasure,
          image: require('../../../../../../assets/mapEdit/icon_clear.png'),
        },
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
          action: ToolAction.cancelSelect,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_cancel_1.png'),
        },
      ]
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.SHOW_ATTRIBUTE,
          action: ToolAction.showAttribute,
          image: require('../../../../../../assets/mapTools/icon_attribute_white.png'),
        },
      ]
      break
    case ConstToolType.MAP_TOOL_RECTANGLE_CUT:
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.TOOLBAR_COMMIT]
      break
    case ConstToolType.MAP_TOOL_INCREMENT:
      data = [
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Prompt.UNDO,
          action: () => {
            ToolAction.undo(ConstToolType.MAP_TOOL_INCREMENT)
          },
          size: 'large',
          image: require('../../../../../../assets/lightTheme/public/icon_undo_light.png'),
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Prompt.REDO,
          action: () => {
            ToolAction.redo(ConstToolType.MAP_TOOL_INCREMENT)
          },
          size: 'large',
          image: require('../../../../../../assets/lightTheme/public/icon_redo_light.png'),
        },
        {
          key: constants.CANCEL,
          title: getLanguage(global.language).Prompt.CANCEL,
          //constants.CANCEL_SELECT,
          action: () => {
            SMap.setAction(Action.PAN)
            SMap.setAction(Action.DRAWLINE)
          },
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_cancel_1.png'),
        },
        {
          key: constants.COMMIT,
          title: getLanguage(global.language).Prompt.COMMIT,
          //constants.CANCEL_SELECT,
          action: ToolAction.submit,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
        },
      ]
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.MAP_TOOL_GPSINCREMENT:
      data = [
        {
          key: constants.BEGIN,
          title: getLanguage(global.language).Prompt.BEGIN,
          action: ToolAction.begin,
          size: 'large',
          image: require('../../../../../../assets/Navigation/begin.png'),
        },
        {
          key: constants.STOP,
          title: getLanguage(global.language).Prompt.STOP,
          action: ToolAction.stop,
          size: 'large',
          image: require('../../../../../../assets/Navigation/stop.png'),
        },
        {
          key: constants.CANCEL,
          title: getLanguage(global.language).Prompt.CANCEL,
          //constants.CANCEL_SELECT,
          action: ToolAction.close,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_cancel_1.png'),
        },
        {
          key: constants.COMMIT,
          title: getLanguage(global.language).Prompt.COMMIT,
          //constants.CANCEL_SELECT,
          action: ToolAction.submit,
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_submit_black.png'),
        },
      ]
      buttons = [ToolbarBtnType.CANCEL]
      break
    case ConstToolType.STYLE_TRANSFER:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.STYLE_TRANSFER,
          action: ToolAction.matchPictureStyle,
          image: getPublicAssets().common.icon_album,
        },
        {
          type: ToolbarBtnType.STYLE_TRANSFER_PICKER,
          action: ToolAction.showMenuBox,
          image: require('../../../../../../assets/mapEdit/icon_function_theme_param_menu.png'),
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
  }
  return { data, buttons }
}

function getMenuData(type) {
  let data = []
  switch (type) {
    case ConstToolType.STYLE_TRANSFER:
      data = [
        {
          key: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BRIGHTNESS,
          action: () => {
            GLOBAL.toolBox &&
              GLOBAL.toolBox.setState({
                isTouchProgress: true,
                showMenuDialog: false,
                selectName: getLanguage(GLOBAL.language).Map_Main_Menu
                  .STYLE_BRIGHTNESS,
                selectKey: getLanguage(GLOBAL.language).Map_Main_Menu
                  .STYLE_BRIGHTNESS,
                buttons: getData(ConstToolType.STYLE_TRANSFER).buttons,
              })
          },
          selectKey: getLanguage(GLOBAL.language).Map_Main_Menu
            .STYLE_BRIGHTNESS,
        },
        {
          key: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_CONTRAST,
          action: () => {
            GLOBAL.toolBox &&
              GLOBAL.toolBox.setState({
                isTouchProgress: true,
                showMenuDialog: false,
                selectName: getLanguage(GLOBAL.language).Map_Main_Menu
                  .STYLE_CONTRAST,
                selectKey: getLanguage(GLOBAL.language).Map_Main_Menu
                  .STYLE_CONTRAST,
                buttons: getData(ConstToolType.STYLE_TRANSFER).buttons,
              })
          },
          selectKey: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_CONTRAST,
        },
        {
          key: getLanguage(GLOBAL.language).Map_Main_Menu.SATURATION,
          action: () => {
            GLOBAL.toolBox &&
              GLOBAL.toolBox.setState({
                isTouchProgress: true,
                showMenuDialog: false,
                selectName: getLanguage(GLOBAL.language).Map_Main_Menu
                  .SATURATION,
                selectKey: getLanguage(GLOBAL.language).Map_Main_Menu
                  .SATURATION,
                buttons: getData(ConstToolType.STYLE_TRANSFER).buttons,
              })
          },
          selectKey: getLanguage(GLOBAL.language).Map_Main_Menu.SATURATION,
        },
      ]
      break
  }
  return data
}

export default {
  getData,
  getMenuData,
}
