import constants from '../../constants'
import { SThemeCartography } from 'imobile_for_reactnative'
import { Toast } from '../../../../utils'

let _params = {}

function setRangeThemeParams(params) {
  _params = params
}

/** 设置分段模式 **/
function setRangeMode() {
  return SThemeCartography.createAndRemoveThemeRangeMap(_params)
}

function getRangeMode() {
  let data = [
    {
      // 等距分段
      key: constants.MAP_THEME_PARAM_RANGE_MODE_EQUALINTERVAL,
      title: '等距分段',
      action: setRangeMode,
      size: 'large',
      image: require('../../../../assets/mapTools/range_mode_equalinterval.png'),
      selectedImage: require('../../../../assets/mapTools/range_mode_equalinterval.png'),
    },
    {
      // 平方根分段
      key: constants.MAP_THEME_PARAM_RANGE_MODE_SQUAREROOT,
      title: '平方根分段',
      action: setRangeMode,
      size: 'large',
      image: require('../../../../assets/mapTools/range_mode_squareroot.png'),
      selectedImage: require('../../../../assets/mapTools/range_mode_squareroot.png'),
    },
    {
      // 标准差分段
      key: constants.MAP_THEME_PARAM_RANGE_MODE_STDDEVIATION,
      title: '标准差分段',
      action: setRangeMode,
      size: 'large',
      image: require('../../../../assets/mapTools/range_mode_stddeviation.png'),
      selectedImage: require('../../../../assets/mapTools/range_mode_stddeviation.png'),
    },
    {
      // 对数分段
      key: constants.MAP_THEME_PARAM_RANGE_MODE_LOGARITHM,
      title: '对数分段',
      action: setRangeMode,
      size: 'large',
      image: require('../../../../assets/mapTools/range_mode_logarithm.png'),
      selectedImage: require('../../../../assets/mapTools/range_mode_logarithm.png'),
    },
    {
      // 等计数分段
      key: constants.MAP_THEME_PARAM_RANGE_MODE_QUANTILE,
      title: '等计数分段',
      action: setRangeMode,
      size: 'large',
      image: require('../../../../assets/mapTools/range_mode_quantile.png'),
      selectedImage: require('../../../../assets/mapTools/range_mode_quantile.png'),
    },
    {
      // 自定义分段
      key: constants.MAP_THEME_PARAM_RANGE_MODE_CUSTOMINTERVAL,
      title: '自定义分段',
      action: setRangeMode,
      size: 'large',
      image: require('../../../../assets/mapTools/range_mode_squareroot.png'),
      selectedImage: require('../../../../assets/mapTools/range_mode_squareroot.png'),
    },
  ]
  return data
}

function showToast() {
  Toast.show('功能暂未开放')
}

/**设置统一标签背景形状 */
function getLabelBackShape() {
  let data = [
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_NONE,
      title: '空背景',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_DIAMOND,
      title: '菱形背景',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_diamond.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_diamond.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_ROUNDRECT,
      title: '圆角矩形背景',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_roundrect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_roundrect.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_RECT,
      title: '矩形背景',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_ELLIPSE,
      title: '椭圆形背景',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_ellipse.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_ellipse.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_TRIANGLE,
      title: '三角形背景',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_triangle.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_triangle.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_MARKER,
      title: '符号背景',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    },
  ]
  return data
}

/**设置统一标签字体 */
function getLabelFontName() {
  let data = [
    {
      key: '微软雅黑',
      title: '微软雅黑',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '宋体',
      title: '宋体',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_diamond.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_diamond.png'),
    },
    {
      key: '楷体',
      title: '楷体',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_roundrect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_roundrect.png'),
    },
    {
      key: '黑体',
      title: '黑体',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    },
    {
      key: '隶书',
      title: '隶书',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_ellipse.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_ellipse.png'),
    },
    {
      key: '幼圆',
      title: '幼圆',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_triangle.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_triangle.png'),
    },
    {
      key: '华文行楷',
      title: '华文行楷',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    },
    {
      key: '华文琥珀',
      title: '华文琥珀',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    },
    {
      key: '华文楷体',
      title: '华文楷体',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    },
    {
      key: '方正舒体',
      title: '方正舒体',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    },
    {
      key: '方正姚体',
      title: '方正姚体',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    },
    {
      key: '华文新魏',
      title: '华文新魏',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    },
  ]
  return data
}

/**设置统一标签旋转角度 */
function getLabelFontRotation() {
  let data = [
    {
      key: '左旋转90°',
      title: '左旋转90°',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_rotation_left.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_rotation_left.png'),
    },
    {
      key: '右旋转90°',
      title: '右旋转90°',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_rotation_right.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_rotation_right.png'),
    },
    {
      key: '上下翻转',
      title: '上下翻转',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_rotation_updown.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_rotation_updown.png'),
    },
    {
      key: '左右翻转',
      title: '左右翻转',
      action: showToast,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_rotation_leftright.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_rotation_leftright.png'),
    },
  ]
  return data
}

/**设置统一标签字体颜色 */
function getLabelFontColor() {
  let data = [
    {
      key: '#000000',
      action: showToast,
      size: 'large',
      background: '#000000',
    },
    {
      key: '#424242',
      action: showToast,
      size: 'large',
      background: '#424242',
    },
    {
      key: '#757575',
      action: showToast,
      size: 'large',
      background: '#757575',
    },
    {
      key: '#BDBDBD',
      action: showToast,
      size: 'large',
      background: '#BDBDBD',
    },
    {
      key: '#EEEEEE',
      action: showToast,
      size: 'large',
      background: '#EEEEEE',
    },
    {
      key: '#FFFFFF',
      action: showToast,
      size: 'large',
      background: '#FFFFFF',
    },
    {
      key: '#3E2723',
      action: showToast,
      size: 'large',
      background: '#3E2723',
    },
    {
      key: '#5D4037',
      action: showToast,
      size: 'large',
      background: '#5D4037',
    },
    {
      key: '#A1887F',
      action: showToast,
      size: 'large',
      background: '#A1887F',
    },
    {
      key: '#D7CCC8',
      action: showToast,
      size: 'large',
      background: '#D7CCC8',
    },
    {
      key: '#263238',
      action: showToast,
      size: 'large',
      background: '#263238',
    },
    {
      key: '#546E7A',
      action: showToast,
      size: 'large',
      background: '#546E7A',
    },
    {
      key: '#90A4AE',
      action: showToast,
      size: 'large',
      background: '#90A4AE',
    },
    {
      key: '#CFD8DC',
      action: showToast,
      size: 'large',
      background: '#CFD8DC',
    },
    {
      key: '#FFECB3',
      action: showToast,
      size: 'large',
      background: '#FFECB3',
    },
    {
      key: '#FFF9C4',
      action: showToast,
      size: 'large',
      background: '#FFF9C4',
    },
    {
      key: '#F1F8E9',
      action: showToast,
      size: 'large',
      background: '#F1F8E9',
    },
    {
      key: '#E3F2FD',
      action: showToast,
      size: 'large',
      background: '#E3F2FD',
    },
    {
      key: '#EDE7F6',
      action: showToast,
      size: 'large',
      background: '#EDE7F6',
    },
    {
      key: '#FCE4EC',
      action: showToast,
      size: 'large',
      background: '#FCE4EC',
    },
    {
      key: '#FBE9E7',
      action: showToast,
      size: 'large',
      background: '#FBE9E7',
    },
    {
      key: '#004D40',
      action: showToast,
      size: 'large',
      background: '#004D40',
    },
    {
      key: '#006064',
      action: showToast,
      size: 'large',
      background: '#006064',
    },
    {
      key: '#009688',
      action: showToast,
      size: 'large',
      background: '#009688',
    },
    {
      key: '#8BC34A',
      action: showToast,
      size: 'large',
      background: '#8BC34A',
    },
    {
      key: '#A5D6A7',
      action: showToast,
      size: 'large',
      background: '#A5D6A7',
    },
    {
      key: '#80CBC4',
      action: showToast,
      size: 'large',
      background: '#80CBC4',
    },
    {
      key: '#80DEEA',
      action: showToast,
      size: 'large',
      background: '#80DEEA',
    },
    {
      key: '#A1C2FA',
      action: showToast,
      size: 'large',
      background: '#A1C2FA',
    },
    {
      key: '#9FA8DA',
      action: showToast,
      size: 'large',
      background: '#9FA8DA',
    },
    {
      key: '#01579B',
      action: showToast,
      size: 'large',
      background: '#01579B',
    },
    {
      key: '#1A237E',
      action: showToast,
      size: 'large',
      background: '#1A237E',
    },
    {
      key: '#3F51B5',
      action: showToast,
      size: 'large',
      background: '#3F51B5',
    },
    {
      key: '#03A9F4',
      action: showToast,
      size: 'large',
      background: '#03A9F4',
    },
    {
      key: '#4A148C',
      action: showToast,
      size: 'large',
      background: '#4A148C',
    },
    {
      key: '#673AB7',
      action: showToast,
      size: 'large',
      background: '#673AB7',
    },
    {
      key: '#9C27B0',
      action: showToast,
      size: 'large',
      background: '#9C27B0',
    },
    {
      key: '#880E4F',
      action: showToast,
      size: 'large',
      background: '#880E4F',
    },
    {
      key: '#E91E63',
      action: showToast,
      size: 'large',
      background: '#E91E63',
    },
    {
      key: '#F44336',
      action: showToast,
      size: 'large',
      background: '#F44336',
    },
    {
      key: '#F48FB1',
      action: showToast,
      size: 'large',
      background: '#F48FB1',
    },
    {
      key: '#EF9A9A',
      action: showToast,
      size: 'large',
      background: '#EF9A9A',
    },
    {
      key: '#F57F17',
      action: showToast,
      size: 'large',
      background: '#F57F17',
    },
    {
      key: '#F4B400',
      action: showToast,
      size: 'large',
      background: '#F4B400',
    },
    {
      key: '#FADA80',
      action: showToast,
      size: 'large',
      background: '#FADA80',
    },
    {
      key: '#FFF59D',
      action: showToast,
      size: 'large',
      background: '#FFF59D',
    },
    {
      key: '#FFEB3B',
      action: showToast,
      size: 'large',
      background: '#FFEB3B',
    },
    {
      key: '#FFD700',
      action: showToast,
      size: 'large',
      background: '#FFD700',
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
  getLabelBackShape,
  getLabelFontName,
  getLabelFontRotation,
  getLabelFontColor,
}
