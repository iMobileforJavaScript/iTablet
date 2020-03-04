import * as React from 'react'
import { Platform } from 'react-native'
import { ConstToolType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import constants from '../../../../constants'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import Tool3DAction from './Tool3DAction'
import { SelectList } from './CustomViews'
import { SScene } from 'imobile_for_reactnative'
import { getPublicAssets } from '../../../../../../assets'

async function getData(type, params) {
  if (params) {
    ToolbarModule.setParams(params)
  } else {
    params = ToolbarModule.getParams()
  }
  let data = [],
    buttons = [],
    customView = null
  switch (type) {
    case ConstToolType.MAP3D_TOOL:
      data = [
        {
          key: 'distanceMeasure',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_DISTANCE_MEASUREMENT,
          //'距离量算',
          action: Tool3DAction.measureDistance,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_analystLien.png'),
        },
        {
          key: 'suerfaceMeasure',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_AREA_MEASUREMENT,
          //''面积量算',
          action: Tool3DAction.measureArea,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_analystSuerface.png'),
        },
        {
          key: 'map3DPoint',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_3D_CREATE_POINT,
          //'兴趣点',
          action: Tool3DAction.createPoint,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_favorite.png'),
        },
        {
          key: 'map3DText',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_TEXT,
          //''文字',
          action: Tool3DAction.createText,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_text.png'),
        },
        {
          key: 'map3DPiontLine',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_LINE,
          //''点绘线',
          action: Tool3DAction.createLine,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_pointLine.png'),
        },
        {
          key: 'map3DPointSurface',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_REGION,
          //''点绘面',
          action: Tool3DAction.createRegion,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_pointSuerface.png'),
        },
        {
          key: 'closeAllLabel',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_CLEAN_PLOTTING,
          //''清除标注',
          action: Tool3DAction.clearPlotting,
          size: 'large',
          image: require('../../../../../../assets/mapEdit/Frenchgrey/icon_clear.png'),
        },
        {
          key: 'action3d',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_SELECT,
          //''点选',
          action: Tool3DAction.select,
          size: 'large',
          image: require('../../../../../../assets/mapEdit/Frenchgrey/icon_action3d.png'),
        },
        {
          key: 'pointAnalyst',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_PATH_ANALYSIS,
          action: Tool3DAction.pathAnalyst,
          size: 'large',
          image: require('../../../../../../assets/mapToolbar/icon_scene_pointAnalyst.png'),
        },
        Platform.OS === 'android' && {
          key: 'boxClip',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_BOX_CLIP,
          action: Tool3DAction.boxClip,
          size: 'large',
          image: require('../../../../../../assets/mapToolbar/icon_sence_box_clip.png'),
        },
        // {
        //   key: 'planeClip',
        //   title: getLanguage(params.language).Map_Main_Menu
        //     .TOOLS_PLANE_CLIP,
        //   //'平面裁剪',
        //   action: () => {
        //     if (!GLOBAL.openWorkspace) {
        //       Toast.show(
        //         getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE,
        //       )
        //       //'请打开场景')
        //       return
        //     }
        //     try {
        //       // SScene.startDrawLine()
        //       this.showMap3DTool(ConstToolType.MAP3D_PLANE_CLIP)
        //     } catch (error) {
        //       Toast.show('点绘线失败')
        //     }
        //   },
        //   size: 'large',
        //   image: require('../../../../assets/mapToolbar/icon_sence_plane_clip.png'),
        // },
        // {
        //   key: 'crossClip',
        //   title: getLanguage(params.language).Map_Main_Menu
        //     .TOOLS_CROSS_CLIP,
        //   //'cross裁剪',
        //   action: () => {
        //     if (!GLOBAL.openWorkspace) {
        //       Toast.show(
        //         getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE,
        //       )
        //       //'请打开场景')
        //       return
        //     }
        //     try {
        //       // SScene.startDrawLine()
        //       this.showMap3DTool(ConstToolType.MAP3D_CROSS_CLIP)
        //     } catch (error) {
        //       Toast.show('点绘线失败')
        //     }
        //   },
        //   size: 'large',
        //   image: require('../../../../assets/mapToolbar/icon_sence_cross_clip.png'),
        // },
      ]
      break
    case ConstToolType.MAP3D_SYMBOL_SELECT:
      data = [
        {
          key: 'cancel',
          title: getLanguage(global.language).Prompt.CANCEL,
          //'取消',
          action: () => {
            SScene.clearSelection()
            params.setAttributes && params.setAttributes({})
          },
          size: 'large',
          image: require('../../../../../../assets/mapTools/icon_cancel_1.png'),
        },
      ]
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.SHOW_MAP3D_ATTRIBUTE]
      break
    case ConstToolType.MAP3D_BOX_CLIPPING:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.COMMIT_3D_CUT,
          image: require('../../../../../../assets/mapEdit/icon_function_theme_param_commit.png'),
          action: Tool3DAction.map3dCut,
        },
      ]
      break
    case ConstToolType.MAP3D_SYMBOL_POINT:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.BACK,
          image: require('../../../../../../assets/mapEdit/icon_back.png'),
          action: () => {
            if (GLOBAL.Type === constants.MAP_3D) SScene.symbolback()
          },
        },
        {
          type: ToolbarBtnType.SAVE,
          image: require('../../../../../../assets/mapEdit/commit.png'),
          action: () => {
            try {
              if (GLOBAL.Type === constants.MAP_3D) SScene.save()
              // getParams.getMap3DAttribute()
              Toast.show(getLanguage(params.language).Prompt.SAVE_SUCCESSFULLY)
              //'保存成功')
            } catch (error) {
              Toast.show(getLanguage(params.language).Prompt.SAVE_FAILED)
            }
          },
        },
      ]
      break
    case ConstToolType.MAP3D_SYMBOL_POINTLINE:
    case ConstToolType.MAP3D_SYMBOL_POINTSURFACE:
    case ConstToolType.MAP3D_SYMBOL_TEXT:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.BACK,
          image: require('../../../../../../assets/mapEdit/icon_back.png'),
          action: () => {
            if (GLOBAL.Type === constants.MAP_3D) SScene.symbolback()
          },
        },
        {
          type: ToolbarBtnType.CLEAR_CURRENT_LABEL,
          image: require('../../../../../../assets/mapEdit/icon_clear.png'),
          action: () => SScene.clearcurrentLabel(),
        },
        {
          type: ToolbarBtnType.SAVE,
          image: require('../../../../../../assets/mapEdit/commit.png'),
          action: () => {
            try {
              if (GLOBAL.Type === constants.MAP_3D) SScene.save()
              // getParams.getMap3DAttribute()
              Toast.show(getLanguage(params.language).Prompt.SAVE_SUCCESSFULLY)
              //'保存成功')
            } catch (error) {
              Toast.show(getLanguage(params.language).Prompt.SAVE_FAILED)
            }
          },
        },
      ]
      break
    case ConstToolType.MAP3D_BOX_CLIP:
    case ConstToolType.MAP3D_PLANE_CLIP:
    case ConstToolType.MAP3D_CROSS_CLIP:
    case ConstToolType.MAP3D_CLIP_SHOW:
    case ConstToolType.MAP3D_CLIP_HIDDEN:
    case ConstToolType.MAP3D_BOX_CLIP_IN:
    case ConstToolType.MAP3D_BOX_CLIP_OUT: {
      const _data = await getClipData(type)
      data = _data.data
      buttons = _data.buttons
      customView = _data.customView
      break
    }
    case ConstToolType.MAP3D_CIRCLEFLY:
      data = [
        {
          key: 'startFly',
          title: getLanguage(global.language).Map_Main_Menu.FLY_AROUND_POINT,
          //'绕点飞行',
          action: () => {
            GLOBAL.isCircleFlying = true
            SScene.startCircleFly()
          },
          size: 'large',
          image: require('../../../../../../assets/mapEdit/icon_play.png'),
          selectedImage: require('../../../../../../assets/mapEdit/icon_play.png'),
        },
      ]
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      break
  }
  return { data, buttons, customView }
}

/** 获取裁剪数据 **/
async function getClipData(type) {
  let params = ToolbarModule.getParams()
  let clipSetting = params.getClipSetting && params.getClipSetting()
  let isClipInner = clipSetting.clipInner
  let customView
  let data = clipSetting.layers
  switch (type) {
    case ConstToolType.MAP3D_CLIP_SHOW:
      if (data[0].selected === undefined) {
        data.map(item => {
          item.selected = true
        })
      }
      customView = () => (
        <SelectList
          data={data}
          onSelect={layers => {
            Tool3DAction.layerChange(layers)
          }}
        />
      )
      break
  }

  const buttons = [
    {
      type: ToolbarBtnType.CANCEL,
      image: require('../../../../../../assets/mapEdit/icon_function_cancel.png'),
      action: () => Tool3DAction.closeClip(),
    },
    {
      type: ToolbarBtnType.CLIP_LAYER,
      image: getPublicAssets().mapTools.tab_layer,
      action: () => Tool3DAction.showLayerList(),
    },
    {
      type: ToolbarBtnType.MENU,
      action: () => Tool3DAction.showMenuDialog(),
    },
    {
      type: ToolbarBtnType.CHANGE_CLIP,
      image: isClipInner
        ? getPublicAssets().mapTools.scene_tool_clip_in
        : getPublicAssets().mapTools.scene_tool_clip_out,
      action: () => Tool3DAction.changeClip(),
    },
    {
      type: ToolbarBtnType.CLEAR,
      image: require('../../../../../../assets/mapEdit/icon_clear.png'),
      action: () => Tool3DAction.clearMeasure(type),
    },
  ]
  return { data, buttons, customView }
}

// const BoxClipData = () => [
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER,
//     data: [], //获取图层数据
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS,
//     data: [
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_LENGTH,
//         value: 0,
//         iconType: 'Text',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_WIDTH,
//         value: 0,
//         iconType: 'Text',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_HEIGHT,
//         value: 0,
//         iconType: 'Text',
//       },
//       // {
//       //   title:getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_ZROT,
//       //   value:0,
//       //   iconType:"Input",
//       // },
//     ],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.POSITION,
//     data: [
//       {
//         title: 'X',
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: 'Y',
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: 'Z',
//         value: 0,
//         iconType: 'Input',
//       },
//     ],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_SETTING,
//     data: [
//       // {
//       //   title:getLanguage(GLOBAL.language).Map_Main_Menu.LINE_COLOR,
//       //   iconType:"Arrow",
//       // },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_INNER,
//         iconType: 'Switch',
//       },
//     ],
//   },
// ]
//
// const CrossClipData = () => [
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER,
//     data: [],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_SETTING,
//     data: [
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu.LINE_COLOR,
//         iconType: 'Arrow',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu.LINE_OPACITY,
//         value: 100,
//         maxValue: 100,
//         minValue: 0,
//         iconType: 'Input',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu.SHOW_OTHER_SIDE,
//         iconType: 'Switch',
//       },
//     ],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.POSITION,
//     data: [
//       {
//         title: 'X',
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: 'Y',
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: 'Z',
//         value: 0,
//         iconType: 'Input',
//       },
//     ],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.ROTATE_SETTINGS,
//     data: [
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_XROT,
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_YROT,
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_ZROT,
//         value: 0,
//         iconType: 'Input',
//       },
//     ],
//   },
// ]
//
// const PlaneClipData = () => [
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER,
//     data: [],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_SURFACE_SETTING,
//     data: [
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_LENGTH,
//         value: 10,
//         iconType: 'Input',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_WIDTH,
//         value: 10,
//         iconType: 'Input',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_HEIGHT,
//         value: 0,
//         iconType: 'Input',
//       },
//     ],
//   },
// ]

export default {
  getData,
  getClipData,
}
