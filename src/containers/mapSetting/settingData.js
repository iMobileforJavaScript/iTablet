import { getLanguage } from '../../language/index'
import { SMap } from 'imobile_for_reactnative'
import { CoordSysData } from './secondMapSettings/CoordSysData'
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
const getThematicMapSettings = () => [
  {
    title: getLanguage(global.language).Map_Settings.BASIC_SETTING,
  },
  {
    title: getLanguage(global.language).Map_Settings.RANGE_SETTING,
  },
  {
    title: getLanguage(global.language).Map_Settings.COORDINATE_SYSTEM_SETTING,
  },
  //高级设置 暂时屏蔽
  // {
  //   title: getLanguage(global.language).Map_Settings.ADVANCED_SETTING,
  // },
]
const getlegendSetting = () => [
  {
    title: getLanguage(global.language).Map_Settings.LEGEND_SETTING,
  },
]
const getnavigationSetting = () => [
  {
    title: getLanguage(global.language).Map_Settings.ENCLOSURE_NAME,
  },
  {
    title: getLanguage(global.language).Map_Settings.START_TIME,
  },
  {
    title: getLanguage(global.language).Map_Settings.END_TIME,
  },
  {
    title: getLanguage(global.language).Map_Settings.REMARKS,
  },
  {
    title: getLanguage(global.language).Map_Settings.DRAWING_RANGE,
  },
]
/*
 * 二级 三级地图菜单 设置
 * */
//基本设置
const basicSettings = () => [
  {
    title: getLanguage(global.language).Map_Settings.MAP_NAME,
    value: '',
    iconType: 'text',
  },
  {
    title: getLanguage(global.language).Map_Settings.SHOW_SCALE,
    value: false,
    iconType: 'switch',
  },
  {
    title: getLanguage(global.language).Map_Settings.ROTATION_GESTURE,
    value: false,
    iconType: 'switch',
  },
  {
    title: getLanguage(global.language).Map_Settings.PITCH_GESTURE,
    value: false,
    iconType: 'switch',
  },
  {
    title: getLanguage(global.language).Map_Settings.ROTATION_ANGLE,
    value: '0°',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.COLOR_MODE,
    value: '',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.BACKGROUND_COLOR,
    value: '',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.MAP_ANTI_ALIASING,
    value: false,
    iconType: 'switch',
  },
  {
    title: getLanguage(global.language).Map_Settings.FIX_SYMBOL_ANGLE,
    value: true,
    iconType: 'switch',
  },
  {
    title: getLanguage(global.language).Map_Settings.FIX_TEXT_ANGLE,
    value: false,
    iconType: 'switch',
  },
  {
    title: getLanguage(global.language).Map_Settings.FIX_TEXT_DIRECTION,
    value: true,
    iconType: 'switch',
  },
  {
    title: getLanguage(global.language).Map_Settings.SHOW_OVERLAYS,
    value: true,
    iconType: 'switch',
  },
  {
    title: getLanguage(global.language).Map_Settings.ENABLE_MAP_MAGNIFER,
    value: true,
    iconType: 'switch',
  },
]
//范围设置
const rangeSettings = () => [
  {
    title: getLanguage(global.language).Map_Settings.MAP_CENTER,
    value: '',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.MAP_SCALE,
    value: '',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.FIX_SCALE_LEVEL,
    value: false,
    iconType: 'switch',
  },
  {
    title: getLanguage(global.language).Map_Settings.CURRENT_VIEW_BOUNDS,
    value: '',
    iconType: 'arrow',
  },
]

//四至范围
const fourRanges = () => [
  {
    title: getLanguage(global.language).Map_Settings.LEFT,
    value: '',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.BOTTOM,
    value: '',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.RIGHT,
    value: '',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.TOP,
    value: '',
    iconType: 'arrow',
  },
]
//坐标系设置
const coordinateSystemSettings = () => [
  {
    title: getLanguage(global.language).Map_Settings.COORDINATE_SYSTEM,
    value: 'GCS_WGS 1984',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.COPY_COORDINATE_SYSTEM,
    value: '',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.DYNAMIC_PROJECTION,
    value: false,
    iconType: 'switch',
  },
  {
    title: getLanguage(global.language).Map_Settings.TRANSFER_METHOD,
    value: getLanguage(global.language).Map_Settings.OFF,
    iconType: 'arrow',
  },
]

//复制坐标系
const copyCoordinate = () => [
  {
    title: getLanguage(global.language).Map_Settings.FROM_DATASOURCE,
    value: '',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.FROM_DATASET,
    value: '',
    iconType: 'arrow',
  },
  {
    title: getLanguage(global.language).Map_Settings.FROM_FILE,
    value: '',
    iconType: 'arrow',
  },
]
//从文件复制坐标系类型列表
const coordMenuData = () => [
  [
    getLanguage(global.language).Map_Settings.ALL_COORD_FILE,
    getLanguage(global.language).Map_Settings.SHAPE_COORD_FILE,
    getLanguage(global.language).Map_Settings.MAPINFO_FILE,
    getLanguage(global.language).Map_Settings.MAPINFO_TAB_FILE,
    getLanguage(global.language).Map_Settings.IMG_COORD_FILE,
    getLanguage(global.language).Map_Settings.COORD_FILE,
  ],
  ['*.shp', '*.prj', '*.mif', '*.tab', '*.tif', '*.img', '*.sit', '*.xml'],
]
const coordMenuTitle = () => [
  getLanguage(global.language).Map_Settings.TYPE,
  getLanguage(global.language).Map_Settings.FORMAT,
]
//坐标系数据
const coordinateData = () => [
  {
    title: getLanguage(global.language).Map_Settings.PLAN_COORDINATE_SYSTEM,
    visible: true,
    data: [],
  },
  {
    title: getLanguage(global.language).Map_Settings
      .GEOGRAPHIC_COORDINATE_SYSTEM,
    visible: true,
    data: [
      {
        name: 'GCS_CHINA_2000',
        value: CoordSysData.GCS_CHINA_2000,
      },
      {
        name: 'GCS_WGS_1984',
        value: CoordSysData.GCS_WGS_1984,
      },
      {
        name: 'Xi-An 1980 China',
        value: CoordSysData.Xi_An_1980_China,
      },
    ],
  },
  {
    title: getLanguage(global.language).Map_Settings
      .PROJECTED_COORDINATE_SYSTEM,
    visible: true,
    data: [
      {
        name: 'Beijing54_Albers_Equal_Area',
        value: CoordSysData.Beijing54_Albers_Equal_Area,
      },
      {
        name: 'Sphere_Mercator',
        value: CoordSysData.Sphere_Mercator,
      },
    ],
  },
]

//转换方法
const transferData = () => [
  {
    title: 'Geocentric Transalation(3-para)',
    iconType: 'arrow',
    paramNum: 3,
  },
  {
    title: 'Molodensky(7-para)',
    iconType: 'arrow',
    paramNum: 7,
  },
  {
    title: 'Abridged Molodensky(7-para)',
    iconType: 'arrow',
    paramNum: 7,
  },
  {
    title: 'Position Vector(7-para)',
    iconType: 'arrow',
    paramNum: 7,
  },
  {
    title: 'Coordinate Frame(7-para)',
    iconType: 'arrow',
    paramNum: 7,
  },
  {
    title: 'Bursa-wolf(7-para)',
    iconType: 'arrow',
    paramNum: 7,
  },
]

//转换方法3参数设置
const transfer3ParamsSetting = () => [
  {
    title: '基本参数',
    value: [
      {
        title: getLanguage(global.language).Map_Settings.TRANSFER_METHOD,
        iconType: 'text',
        value: '',
      },
    ],
  },
  {
    title: '偏移量',
    value: [
      {
        title: 'X',
        iconType: 'arrow',
        value: 0,
        pos: 1,
      },
      {
        title: 'Y',
        iconType: 'arrow',
        value: 0,
        pos: 1,
      },
      {
        title: 'Z',
        iconType: 'arrow',
        value: 0,
        pos: 1,
      },
    ],
  },
]

//转换方法7参数设置
const transfer7ParamsSetting = () => [
  {
    title: '基本参数',
    value: [
      {
        title: getLanguage(global.language).Map_Settings.TRANSFER_METHOD,
        iconType: 'text',
        value: '',
      },
      {
        title: '比例差',
        iconType: 'arrow',
        value: 0,
        pos: 0,
      },
    ],
  },
  {
    title: '旋转角度(秒)',
    value: [
      {
        title: 'X',
        iconType: 'arrow',
        value: 0,
        pos: 1,
      },
      {
        title: 'Y',
        iconType: 'arrow',
        value: 0,
        pos: 1,
      },
      {
        title: 'Z',
        iconType: 'arrow',
        value: 0,
        pos: 1,
      },
    ],
  },
  {
    title: '偏移量',
    value: [
      {
        title: 'X',
        iconType: 'arrow',
        value: 0,
        pos: 2,
      },
      {
        title: 'Y',
        iconType: 'arrow',
        value: 0,
        pos: 2,
      },
      {
        title: 'Z',
        iconType: 'arrow',
        value: 0,
        pos: 2,
      },
    ],
  },
]

//高级设置
// const advancedSettings = () => [
//   {
//     title: getLanguage(global.language).Map_Settings.FLOW_VISIUALIZATION,
//     value: true,
//     iconType: 'switch',
//   },
//   {
//     title: getLanguage(global.language).Map_Settings.SHOW_NEGATIVE_DATA,
//     value: true,
//     iconType: 'switch',
//   },
//   {
//     title: getLanguage(global.language).Map_Settings.AUTOMATIC_AVOIDANCE,
//     value: false,
//     iconType: 'switch',
//   },
//   {
//     title: getLanguage(global.language).Map_Settings.ZOOM_WITH_MAP,
//     value: false,
//     iconType: 'switch',
//   },
//   {
//     title: getLanguage(global.language).Map_Settings.SHOW_TRACTION_LINE,
//     value: false,
//     iconType: 'switch',
//   },
//   {
//     title: getLanguage(global.language).Map_Settings.GLOBAL_STATISTICS,
//     value: false,
//     iconType: 'switch',
//   },
//   {
//     title: getLanguage(global.language).Map_Settings.CHART_ANNOTATION,
//     value: getLanguage(global.language).Map_Settings.PERCENT,
//     iconType: 'arrow',
//   },
//   {
//     title: getLanguage(global.language).Map_Settings.SHOW_AXIS,
//     value: false,
//     iconType: 'switch',
//   },
//   {
//     title: getLanguage(global.language).Map_Settings.HISTOGRAM_STYLE,
//     iconType: 'arrow',
//   },
//   {
//     title: getLanguage(global.language).Map_Settings.ROSE_AND_PIE_CHART_STYLE,
//     iconType: 'arrow',
//   },
// ]

// const histogramSettings = () => [
//   {
//     title: '柱宽度系数',
//     value: '1',
//     iconType: 'arrow',
//   },
//   {
//     title: '柱间距系数',
//     value: '0.618',
//     iconType: 'arrow',
//   },
// ]
const colorMode = () => [
  {
    value: getLanguage(global.language).Map_Settings.DEFAULT_COLOR_MODE,
    action: () => {
      return SMap.setMapColorMode(0)
    },
  },
  {
    value: getLanguage(global.language).Map_Settings.BLACK_AND_WHITE,
    action: () => {
      return SMap.setMapColorMode(1)
    },
  },
  {
    value: getLanguage(global.language).Map_Settings.GRAY_SCALE_MODE,
    action: () => {
      return SMap.setMapColorMode(2)
    },
  },
  {
    value: getLanguage(global.language).Map_Settings.ANTI_BLACK_AND_WHITE,
    action: () => {
      return SMap.setMapColorMode(3)
    },
  },
  {
    value: getLanguage(global.language).Map_Settings.ANTI_BLACK_AND_WHITE_2,
    action: () => {
      return SMap.setMapColorMode(4)
    },
  },
]
export {
  getMapSettings,
  getThematicMapSettings,
  getlegendSetting,
  basicSettings,
  rangeSettings,
  coordinateSystemSettings,
  coordinateData,
  copyCoordinate,
  coordMenuData,
  coordMenuTitle,
  transfer3ParamsSetting,
  transfer7ParamsSetting,
  // advancedSettings,
  colorMode,
  fourRanges,
  transferData,
  getnavigationSetting,
}
