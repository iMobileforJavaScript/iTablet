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
export { getMapSettings }
