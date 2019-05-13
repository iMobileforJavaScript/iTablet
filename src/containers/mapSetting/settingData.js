import { getLanguage } from '../../language/index'

function getMapSettings() {
  let data = [
    {
      title: getLanguage(global.language).Map_Setting.BASIC_SETTING,
      // '基本设置',
      visible: true,
      data: [
        {
          name: getLanguage(global.language).Map_Setting.ROTATION_GESTURE,
          //'手势旋转',
          value: false,
        },
        {
          name: getLanguage(global.language).Map_Setting.PITCH_GESTURE,
          //'手势俯仰',
          value: false,
        },
        {
          name: getLanguage(global.language).Map_Setting.THEME_LEGEND,
          value: false,
        },
      ],
    },
    {
      title: getLanguage(global.language).Map_Setting.EFFECT_SETTINGS,
      //'效果设置',
      visible: true,
      data: [
        // {
        //   name: '旋转角度',
        //   value: '',
        // },
        // {
        //   name: '颜色模式',
        //   value: '',
        // },
        // {
        //   name: '背景颜色',
        //   value: '',
        // },
        // {
        //   name: '文本反走样',
        //   value: false,
        // },
        // {
        //   name: '线型反走样',
        //   value: false,
        // },
        // {
        //   name: '固定符号角度',
        //   value: false,
        // },
        // {
        //   name: '固定文本角度',
        //   value: false,
        // },
        // {
        //   name: '固定文本方向',
        //   value: false,
        // },
        {
          name: getLanguage(global.language).Map_Setting.ANTI_ALIASING_MAP,
          //'反走样地图',
          value: false,
        },
        {
          name: getLanguage(global.language).Map_Setting.SHOW_OVERLAYS,
          //'显示压盖对象',
          value: false,
        },
      ],
    },
    {
      title: getLanguage(global.language).Map_Setting.BOUNDS_SETTING,
      //'范围设置',
      visible: true,
      data: [
        // {
        //   name: '中心点',
        //   value: '',
        // },
        // {
        //   name: '比例尺',
        //   value: '',
        // },
        // {
        //   name: '固定比例尺级别',
        //   value: '',
        // },
        // {
        //   name: '当前窗口四至范围',
        //   value: '',
        // },
        {
          name: getLanguage(global.language).Map_Setting.FIX_SCALE,
          //'固定比例尺',
          value: false,
        },
      ],
    },
    // {
    //   title: '坐标系设置',
    //   visible: true,
    //   data: [
    //     {
    //       name: '投影信息',
    //       value: '',
    //     },
    //     {
    //       name: '投影设置',
    //       value: '',
    //     },
    //     {
    //       name: '投影转换',
    //       value: '',
    //     },
    //   ],
    // },
  ]
  return data
}
// 地图设置 新菜单栏
//todo 中英文
const getThematicMapSettings = () => [
  {
    title: '基本设置',
  },
  {
    title: '范围设置',
  },
  {
    title: '坐标系设置',
  },
  {
    title: '高级设置',
  },
  {
    title: '图例设置',
  },
]
/*
 * 二级 三级地图菜单 设置
 * */
//基本设置
const basicSettings = () => [
  {
    title: '地图名称',
    value: '',
    iconType: 'arrow',
  },
  {
    title: '显示比例尺',
    value: false,
    iconType: 'switch',
  },
  // {
  //   title:'显示指北针',
  //   value:false,
  //   iconType:'switch',
  // },
  {
    title: '旋转角度',
    value: '0°',
    iconType: 'arrow',
  },
  {
    title: '颜色模式',
    value: '',
    iconType: 'arrow',
  },
  {
    title: '背景颜色',
    iconType: 'text',
  },
  {
    title: '地图反走样',
    value: false,
    iconType: 'switch',
  },
  // {
  //   title:'线性反走样',
  //   value:true,
  //   iconType:'switch',
  // },
  {
    title: '固定符号角度',
    value: true,
    iconType: 'switch',
  },
  {
    title: '固定文本角度',
    value: false,
    iconType: 'switch',
  },
  {
    title: '固定文本方向',
    value: true,
    iconType: 'switch',
  },
  {
    title: '显示压盖对象',
    value: true,
    iconType: 'switch',
  },
]
//范围设置
const rangeSettings = () => [
  {
    title: '中心点',
    value: '',
    iconType: 'arrow',
  },
  {
    title: '比例尺',
    value: '',
    iconType: 'arrow',
  },
  {
    title: '固定比例尺级别',
    value: false,
    iconType: 'switch',
  },
  {
    title: '当前窗口四至范围',
    iconType: 'text',
  },
]
//坐标系设置
const coordinateSystemSettings = () => [
  {
    title: '坐标轴',
    value: 'GCS_WGS 1984',
    iconType: 'arrow',
  },
  {
    title: '动态投影',
    value: true,
    iconType: 'switch',
  },
  {
    title: '转换参数',
    iconType: 'arrow',
  },
]
//高级设置
const advancedSettings = () => [
  {
    title: '流动显示',
    value: true,
    iconType: 'switch',
  },
  {
    title: '显示负值数据',
    value: true,
    iconType: 'switch',
  },
  {
    title: '自动避让',
    value: false,
    iconType: 'switch',
  },
  {
    title: '随图缩放',
    value: false,
    iconType: 'switch',
  },
  {
    title: '显示牵引线',
    value: false,
    iconType: 'switch',
  },
  {
    title: '全据统计值',
    value: false,
    iconType: 'switch',
  },
  {
    title: '统计图注记',
    value: '百分比',
    iconType: 'arrow',
  },
  {
    title: '显示坐标轴',
    value: false,
    iconType: 'switch',
  },
  {
    title: '柱状图风格',
    iconType: 'arrow',
  },
  {
    title: '玫瑰图、饼图风格',
    iconType: 'arrow',
  },
]
export {
  getMapSettings,
  getThematicMapSettings,
  basicSettings,
  rangeSettings,
  coordinateSystemSettings,
  advancedSettings,
}
