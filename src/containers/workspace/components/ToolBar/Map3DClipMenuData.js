/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import { getLanguage } from '../../../../language/index'

const BoxClipData = () => [
  {
    title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER,
    data: [], //获取图层数据
  },
  {
    title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS,
    data: [
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_LENGTH,
        value: 0,
        iconType: 'Text',
      },
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_WIDTH,
        value: 0,
        iconType: 'Text',
      },
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_HEIGHT,
        value: 0,
        iconType: 'Text',
      },
      // {
      //   title:getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_ZROT,
      //   value:0,
      //   iconType:"Input",
      // },
    ],
  },
  {
    title: getLanguage(GLOBAL.language).Map_Main_Menu.POSITION,
    data: [
      {
        title: 'X',
        value: 0,
        iconType: 'Input',
      },
      {
        title: 'Y',
        value: 0,
        iconType: 'Input',
      },
      {
        title: 'Z',
        value: 0,
        iconType: 'Input',
      },
    ],
  },
  {
    title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_SETTING,
    data: [
      // {
      //   title:getLanguage(GLOBAL.language).Map_Main_Menu.LINE_COLOR,
      //   iconType:"Arrow",
      // },
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_INNER,
        iconType: 'Switch',
      },
    ],
  },
]

const CrossClipData = () => [
  {
    title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER,
    data: [],
  },
  {
    title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_SETTING,
    data: [
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu.LINE_COLOR,
        iconType: 'Arrow',
      },
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu.LINE_OPACITY,
        value: 100,
        maxValue: 100,
        minValue: 0,
        iconType: 'Input',
      },
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu.SHOW_OTHER_SIDE,
        iconType: 'Switch',
      },
    ],
  },
  {
    title: getLanguage(GLOBAL.language).Map_Main_Menu.POSITION,
    data: [
      {
        title: 'X',
        value: 0,
        iconType: 'Input',
      },
      {
        title: 'Y',
        value: 0,
        iconType: 'Input',
      },
      {
        title: 'Z',
        value: 0,
        iconType: 'Input',
      },
    ],
  },
  {
    title: getLanguage(GLOBAL.language).Map_Main_Menu.ROTATE_SETTINGS,
    data: [
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_XROT,
        value: 0,
        iconType: 'Input',
      },
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_YROT,
        value: 0,
        iconType: 'Input',
      },
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_ZROT,
        value: 0,
        iconType: 'Input',
      },
    ],
  },
]

const PlaneClipData = () => [
  {
    title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER,
    data: [],
  },
  {
    title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_SURFACE_SETTING,
    data: [
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_LENGTH,
        value: 10,
        iconType: 'Input',
      },
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_WIDTH,
        value: 10,
        iconType: 'Input',
      },
      {
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .CLIP_AREA_SETTINGS_HEIGHT,
        value: 0,
        iconType: 'Input',
      },
    ],
  },
]

export { BoxClipData, PlaneClipData, CrossClipData }
