/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
const BoxClipData = () => [
  {
    title: '裁剪图层',
    data: [], //获取图层数据
  },
  {
    title: '裁剪区域参数设置',
    data: [
      {
        title: '底面长',
        value: 0,
        iconType: 'Text',
      },
      {
        title: '底面宽',
        value: 0,
        iconType: 'Text',
      },
      {
        title: '高度',
        value: 0,
        iconType: 'Text',
      },
      // {
      //   title:"z旋转",
      //   value:0,
      //   iconType:"Input",
      // },
    ],
  },
  {
    title: '位置',
    data: [
      {
        title: 'x',
        value: 0,
        iconType: 'Input',
      },
      {
        title: 'y',
        value: 0,
        iconType: 'Input',
      },
      {
        title: 'z',
        value: 0,
        iconType: 'Input',
      },
    ],
  },
  {
    title: '裁剪设置',
    data: [
      // {
      //   title:"裁剪线颜色",
      //   iconType:"Arrow",
      // },
      {
        title: '区域内裁剪',
        iconType: 'Switch',
      },
    ],
  },
]

const CrossClipData = () => [
  {
    title: '裁剪图层',
    data: [],
  },
  {
    title: '裁剪设置',
    data: [
      {
        title: '裁剪线颜色',
        iconType: 'Arrow',
      },
      {
        title: '裁剪线透明度',
        value: 100,
        maxValue: 100,
        minValue: 0,
        iconType: 'Input',
      },
      {
        title: '显示另一侧',
        iconType: 'Switch',
      },
    ],
  },
  {
    title: '位置',
    data: [
      {
        title: 'x',
        value: 0,
        iconType: 'Input',
      },
      {
        title: 'y',
        value: 0,
        iconType: 'Input',
      },
      {
        title: 'z',
        value: 0,
        iconType: 'Input',
      },
    ],
  },
  {
    title: '旋转参数',
    data: [
      {
        title: 'x',
        value: 0,
        iconType: 'Input',
      },
      {
        title: 'y',
        value: 0,
        iconType: 'Input',
      },
      {
        title: 'z',
        value: 0,
        iconType: 'Input',
      },
    ],
  },
]

const PlaneClipData = () => [
  {
    title: '裁剪图层',
    data: [],
  },
  {
    title: '裁剪面设置',
    data: [
      {
        title: '长度',
        value: 10,
        iconType: 'Input',
      },
      {
        title: '宽度',
        value: 10,
        iconType: 'Input',
      },
      {
        title: '高度',
        value: 0,
        iconType: 'Input',
      },
    ],
  },
]

export { BoxClipData, PlaneClipData, CrossClipData }
