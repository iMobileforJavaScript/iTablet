import constants from '../../constants'
import {
  SThemeCartography,
} from 'imobile_for_reactnative'

let _params = {}

function setRangeThemeParams(params) {
  _params = params
}

/** 设置分段模式 **/
function setRangeMode() {
  return SThemeCartography.createAndRemoveThemeRangeMap(_params)
}

function getRangeMode() {
  let data = [{
    // 等距分段
    key: constants.MAP_THEME_PARAM_RANGE_MODE_EQUALINTERVAL,
    title: '等距分段',
    action: setRangeMode,
    size: 'large',
    image: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
    selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
  },
  {
    // 平方根分段
    key: constants.MAP_THEME_PARAM_RANGE_MODE_SQUAREROOT,
    title: '平方根分段',
    action: setRangeMode,
    size: 'large',
    image: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
    selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
  },
  {
    // 标准差分段
    key: constants.MAP_THEME_PARAM_RANGE_MODE_STDDEVIATION,
    title: '标准差分段',
    action: setRangeMode,
    size: 'large',
    image: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
    selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
  },
  {
    // 对数分段
    key: constants.MAP_THEME_PARAM_RANGE_MODE_LOGARITHM,
    title: '对数分段',
    action: setRangeMode,
    size: 'large',
    image: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
    selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
  },
  {
    // 等计数分段
    key: constants.MAP_THEME_PARAM_RANGE_MODE_QUANTILE,
    title: '等计数分段',
    action: setRangeMode,
    size: 'large',
    image: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
    selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
  },
  {
    // 自定义分段
    key: constants.MAP_THEME_PARAM_RANGE_MODE_CUSTOMINTERVAL,
    title: '自定义分段',
    action: setRangeMode,
    size: 'large',
    image: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
    selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
  },
  ]
  return data
}

/**
 * 专题图颜色渐变类型常量
 */

function getColorGradientType() {
  let list = [
    {
      key: 'BLACKWHITE',
      title: '黑白渐变色',
    },
    {
      key: 'BLUEBLACK',
      title: '蓝黑渐变色',
    },
    {
      key: 'BLUERED',
      title: '蓝红渐变色',
    },
    {
      key: 'BLUEWHITE',
      title: '蓝白渐变色',
    },
    {
      key: 'CYANBLACK',
      title: '青黑渐变色',
    },
    {
      key: 'CYANBLUE',
      title: '青蓝渐变色',
    },
    {
      key: 'CYANGREEN',
      title: '青绿渐变色',
    },
    {
      key: 'CYANWHITE',
      title: '青白渐变色',
    },
    {
      key: 'GREENBLACK',
      title: '绿黑渐变色',
    },
    {
      key: 'GREENBLUE',
      title: '绿蓝渐变色',
    },
    {
      key: 'GREENORANGEVIOLET',
      title: '绿橙紫渐变色',
    },
    {
      key: 'GREENRED',
      title: '绿红渐变色',
    },
    {
      key: 'GREENWHITE',
      title: '绿白渐变色',
    },
    {
      key: 'PINKBLACK',
      title: '粉红黑渐变色',
    },
    {
      key: 'PINKBLUE',
      title: '粉红蓝渐变色',
    },
    {
      key: 'PINKRED',
      title: '粉红红渐变色',
    },
    {
      key: 'PINKWHITE',
      title: '粉红白渐变色',
    },
    {
      key: 'RAINBOW',
      title: '彩虹色',
    },
    {
      key: 'REDBLACK',
      title: '红黑渐变色',
    },
    {
      key: 'REDWHITE',
      title: '红白渐变色',
    },
    {
      key: 'SPECTRUM',
      title: '光谱渐变',
    },
    {
      key: 'TERRAIN',
      title: '地形渐变',
    },
    {
      key: 'YELLOWBLACK',
      title: '黄黑渐变色',
    },
    {
      key: 'YELLOWBLUE',
      title: '黄蓝渐变色',
    },
    {
      key: 'YELLOWGREEN',
      title: '黄绿渐变色',
    },
    {
      key: 'YELLOWRED',
      title: '黄红渐变色',
    },
    {
      key: 'YELLOWWHITE',
      title: '黄白渐变色',
    },
  ]
  return list
}

export default {
  getRangeMode,
  getColorGradientType,
  setRangeThemeParams,
}
