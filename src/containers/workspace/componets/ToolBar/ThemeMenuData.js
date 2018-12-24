import constants from '../../constants'
import { SThemeCartography } from 'imobile_for_reactnative'
// import { Toast } from '../../../../utils'
import ToolbarBtnType from './ToolbarBtnType'
import { ConstToolType } from '../../../../constants'

// function showTips() {
//   Toast.show('功能暂未开放')
// }

let _toolbarParams = {}

function showDatasetsList() {
  let data = []
  SThemeCartography.getAllDatasetNames().then(getdata => {
    for (let i = 0; i < getdata.length; i++) {
      let datalist = getdata[i]
      data[i] = {
        title: '数据源: ' + datalist.datasource.alias,
        data: datalist.list,
      }
    }
    _toolbarParams.setToolbarVisible &&
      _toolbarParams.setToolbarVisible(
        true,
        ConstToolType.MAP_THEME_PARAM_CREATE_DATASETS,
        {
          containerType: 'list',
          isFullScreen: true,
          isTouchProgress: false,
          isSelectlist: false,
          height: ConstToolType.THEME_HEIGHT[6],
          // listSelectable: true, //单选框
          data,
          buttons: [ToolbarBtnType.THEME_CANCEL],
        },
      )
    _toolbarParams.scrollListToLocation && _toolbarParams.scrollListToLocation()
  })
}

/**
 * 获取创建专题图菜单
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getThemeMapCreate(type, params) {
  _toolbarParams = params
  let data = [],
    buttons = []
  if (type !== ConstToolType.MAP_THEME_CREATE) return { data, buttons }
  data = [
    // {
    //   //统一风格
    //   key: constants.THEME_UNIFY_STYLE,
    //   title: constants.THEME_UNIFY_STYLE,
    //   action: showTips,
    //   size: 'large',
    //   image: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
    //   selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_style.png'),
    // },
    {
      //单值风格
      key: constants.THEME_UNIQUE_STYLE,
      title: constants.THEME_UNIQUE_STYLE,
      size: 'large',
      action: showDatasetsList,
      image: require('../../../../assets/mapTools/icon_function_theme_create_unique_style.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unique_style.png'),
    },
    {
      //分段风格
      key: constants.THEME_RANGE_STYLE,
      title: constants.THEME_RANGE_STYLE,
      size: 'large',
      action: showDatasetsList,
      image: require('../../../../assets/mapTools/icon_function_theme_create_range_style.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_range_style.png'),
    },
    // {
    //   //自定义风格
    //   key: constants.THEME_CUSTOME_STYLE,
    //   title: constants.THEME_CUSTOME_STYLE,
    //   size: 'large',
    //   action: showTips,
    //   image: require('../../../../assets/mapTools/icon_function_theme_create_custom_style.png'),
    //   selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_custom_style.png'),
    // },
    // {
    //   //自定义标签
    //   key: constants.THEME_CUSTOME_LABEL,
    //   title: constants.THEME_CUSTOME_LABEL,
    //   size: 'large',
    //   action: showTips,
    //   image: require('../../../../assets/mapTools/icon_function_theme_create_custom_label.png'),
    //   selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_custom_label.png'),
    // },
    {
      //统一标签
      key: constants.THEME_UNIFY_LABEL,
      title: constants.THEME_UNIFY_LABEL,
      size: 'large',
      action: showDatasetsList,
      image: require('../../../../assets/mapTools/icon_function_theme_create_unify_label.png'),
      selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unify_label.png'),
    },
    // {
    //   //单值标签
    //   key: constants.THEME_UNIQUE_LABEL,
    //   title: constants.THEME_UNIQUE_LABEL,
    //   size: 'large',
    //   action: showTips,
    //   image: require('../../../../assets/mapTools/icon_function_theme_create_unique_label.png'),
    //   selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_unique_label.png'),
    // },
    // {
    //   //分段标签
    //   key: constants.THEME_RANGE_LABEL,
    //   title: constants.THEME_RANGE_LABEL,
    //   size: 'large',
    //   action: showTips,
    //   image: require('../../../../assets/mapTools/icon_function_theme_create_range_label.png'),
    //   selectedImage: require('../../../../assets/mapTools/icon_function_theme_create_range_label.png'),
    // },
  ]
  return { data, buttons }
}

/**
 * 专题图参数设置
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getThemeMapParam(type, params) {
  _toolbarParams = params
  let data = [],
    buttons = []
  if (type !== ConstToolType.MAP_THEME_PARAM) return { data, buttons }
  buttons = [
    ToolbarBtnType.THEME_CANCEL,
    ToolbarBtnType.THEME_MENU,
    ToolbarBtnType.THEME_FLEX,
    ToolbarBtnType.THEME_COMMIT,
  ]
  return { data, buttons }
}

let _params = {}

function setThemeParams(params) {
  _params = params
}

/** 设置分段模式 **/
function setRangeMode() {
  return SThemeCartography.modifyThemeRangeMap(_params)
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
    // {
    //   // 自定义分段
    //   key: constants.MAP_THEME_PARAM_RANGE_MODE_CUSTOMINTERVAL,
    //   title: '自定义分段',
    //   action: setRangeMode,
    //   size: 'large',
    //   image: require('../../../../assets/mapTools/range_mode_squareroot.png'),
    //   selectedImage: require('../../../../assets/mapTools/range_mode_squareroot.png'),
    // },
  ]
  return data
}

/**设置统一标签背景形状 */
function setLabelBackShape() {
  return SThemeCartography.setUniformLabelBackShape(_params)
}

function getLabelBackShape() {
  let data = [
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_NONE,
      title: '空背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_DIAMOND,
      title: '菱形背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_diamond.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_diamond.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_ROUNDRECT,
      title: '圆角矩形背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_roundrect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_roundrect.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_RECT,
      title: '矩形背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_ELLIPSE,
      title: '椭圆形背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_ellipse.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_ellipse.png'),
    },
    {
      key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_TRIANGLE,
      title: '三角形背景',
      action: setLabelBackShape,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_triangle.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_triangle.png'),
    },
    // {
    //   key: constants.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_MARKER,
    //   title: '符号背景',
    //   action: showTips,
    //   size: 'large',
    //   image: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    //   selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_rect.png'),
    // },
  ]
  return data
}

/**设置统一标签字体 */
function setLabelFontName() {
  return SThemeCartography.setUniformLabelFontName(_params)
}

function getLabelFontName() {
  let data = [
    {
      key: '微软雅黑',
      title: '微软雅黑',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '宋体',
      title: '宋体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '楷体',
      title: '楷体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '黑体',
      title: '黑体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '隶书',
      title: '隶书',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '幼圆',
      title: '幼圆',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '华文行楷',
      title: '华文行楷',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '华文琥珀',
      title: '华文琥珀',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '华文楷体',
      title: '华文楷体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '方正舒体',
      title: '方正舒体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '方正姚体',
      title: '方正姚体',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
    {
      key: '华文新魏',
      title: '华文新魏',
      action: setLabelFontName,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_backshape_none.png'),
    },
  ]
  return data
}

/**设置统一标签旋转角度 */
function setLabelFontRotation() {
  return SThemeCartography.setUniformLabelRotaion(_params)
}

function getLabelFontRotation() {
  let data = [
    {
      key: '90',
      title: '左旋转90°',
      action: setLabelFontRotation,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_rotation_left.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_rotation_left.png'),
    },
    {
      key: '-90',
      title: '右旋转90°',
      action: setLabelFontRotation,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_rotation_right.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_rotation_right.png'),
    },
    {
      key: '180',
      title: '上下翻转',
      action: setLabelFontRotation,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_rotation_updown.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_rotation_updown.png'),
    },
    {
      key: '-180',
      title: '左右翻转',
      action: setLabelFontRotation,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_rotation_leftright.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_rotation_leftright.png'),
    },
  ]
  return data
}

/**设置统一标签字体颜色 */
function setLabelFontColor() {
  return SThemeCartography.setUniformLabelColor(_params)
}

function getLabelFontColor() {
  let data = [
    {
      key: '#000000',
      action: setLabelFontColor,
      size: 'large',
      background: '#000000',
    },
    {
      key: '#424242',
      action: setLabelFontColor,
      size: 'large',
      background: '#424242',
    },
    {
      key: '#757575',
      action: setLabelFontColor,
      size: 'large',
      background: '#757575',
    },
    {
      key: '#BDBDBD',
      action: setLabelFontColor,
      size: 'large',
      background: '#BDBDBD',
    },
    {
      key: '#EEEEEE',
      action: setLabelFontColor,
      size: 'large',
      background: '#EEEEEE',
    },
    {
      key: '#FFFFFF',
      action: setLabelFontColor,
      size: 'large',
      background: '#FFFFFF',
    },
    {
      key: '#3E2723',
      action: setLabelFontColor,
      size: 'large',
      background: '#3E2723',
    },
    {
      key: '#5D4037',
      action: setLabelFontColor,
      size: 'large',
      background: '#5D4037',
    },
    {
      key: '#A1887F',
      action: setLabelFontColor,
      size: 'large',
      background: '#A1887F',
    },
    {
      key: '#D7CCC8',
      action: setLabelFontColor,
      size: 'large',
      background: '#D7CCC8',
    },
    {
      key: '#263238',
      action: setLabelFontColor,
      size: 'large',
      background: '#263238',
    },
    {
      key: '#546E7A',
      action: setLabelFontColor,
      size: 'large',
      background: '#546E7A',
    },
    {
      key: '#90A4AE',
      action: setLabelFontColor,
      size: 'large',
      background: '#90A4AE',
    },
    {
      key: '#CFD8DC',
      action: setLabelFontColor,
      size: 'large',
      background: '#CFD8DC',
    },
    {
      key: '#FFECB3',
      action: setLabelFontColor,
      size: 'large',
      background: '#FFECB3',
    },
    {
      key: '#FFF9C4',
      action: setLabelFontColor,
      size: 'large',
      background: '#FFF9C4',
    },
    {
      key: '#F1F8E9',
      action: setLabelFontColor,
      size: 'large',
      background: '#F1F8E9',
    },
    {
      key: '#E3F2FD',
      action: setLabelFontColor,
      size: 'large',
      background: '#E3F2FD',
    },
    {
      key: '#EDE7F6',
      action: setLabelFontColor,
      size: 'large',
      background: '#EDE7F6',
    },
    {
      key: '#FCE4EC',
      action: setLabelFontColor,
      size: 'large',
      background: '#FCE4EC',
    },
    {
      key: '#FBE9E7',
      action: setLabelFontColor,
      size: 'large',
      background: '#FBE9E7',
    },
    {
      key: '#004D40',
      action: setLabelFontColor,
      size: 'large',
      background: '#004D40',
    },
    {
      key: '#006064',
      action: setLabelFontColor,
      size: 'large',
      background: '#006064',
    },
    {
      key: '#009688',
      action: setLabelFontColor,
      size: 'large',
      background: '#009688',
    },
    {
      key: '#8BC34A',
      action: setLabelFontColor,
      size: 'large',
      background: '#8BC34A',
    },
    {
      key: '#A5D6A7',
      action: setLabelFontColor,
      size: 'large',
      background: '#A5D6A7',
    },
    {
      key: '#80CBC4',
      action: setLabelFontColor,
      size: 'large',
      background: '#80CBC4',
    },
    {
      key: '#80DEEA',
      action: setLabelFontColor,
      size: 'large',
      background: '#80DEEA',
    },
    {
      key: '#A1C2FA',
      action: setLabelFontColor,
      size: 'large',
      background: '#A1C2FA',
    },
    {
      key: '#9FA8DA',
      action: setLabelFontColor,
      size: 'large',
      background: '#9FA8DA',
    },
    {
      key: '#01579B',
      action: setLabelFontColor,
      size: 'large',
      background: '#01579B',
    },
    {
      key: '#1A237E',
      action: setLabelFontColor,
      size: 'large',
      background: '#1A237E',
    },
    {
      key: '#3F51B5',
      action: setLabelFontColor,
      size: 'large',
      background: '#3F51B5',
    },
    {
      key: '#03A9F4',
      action: setLabelFontColor,
      size: 'large',
      background: '#03A9F4',
    },
    {
      key: '#4A148C',
      action: setLabelFontColor,
      size: 'large',
      background: '#4A148C',
    },
    {
      key: '#673AB7',
      action: setLabelFontColor,
      size: 'large',
      background: '#673AB7',
    },
    {
      key: '#9C27B0',
      action: setLabelFontColor,
      size: 'large',
      background: '#9C27B0',
    },
    {
      key: '#880E4F',
      action: setLabelFontColor,
      size: 'large',
      background: '#880E4F',
    },
    {
      key: '#E91E63',
      action: setLabelFontColor,
      size: 'large',
      background: '#E91E63',
    },
    {
      key: '#F44336',
      action: setLabelFontColor,
      size: 'large',
      background: '#F44336',
    },
    {
      key: '#F48FB1',
      action: setLabelFontColor,
      size: 'large',
      background: '#F48FB1',
    },
    {
      key: '#EF9A9A',
      action: setLabelFontColor,
      size: 'large',
      background: '#EF9A9A',
    },
    {
      key: '#F57F17',
      action: setLabelFontColor,
      size: 'large',
      background: '#F57F17',
    },
    {
      key: '#F4B400',
      action: setLabelFontColor,
      size: 'large',
      background: '#F4B400',
    },
    {
      key: '#FADA80',
      action: setLabelFontColor,
      size: 'large',
      background: '#FADA80',
    },
    {
      key: '#FFF59D',
      action: setLabelFontColor,
      size: 'large',
      background: '#FFF59D',
    },
    {
      key: '#FFEB3B',
      action: setLabelFontColor,
      size: 'large',
      background: '#FFEB3B',
    },
    {
      key: '#FFD700',
      action: setLabelFontColor,
      size: 'large',
      background: '#FFD700',
    },
  ]
  return data
}

function getThemeFourMenu() {
  let buttons = [
    ToolbarBtnType.THEME_CANCEL,
    ToolbarBtnType.THEME_MENU,
    ToolbarBtnType.THEME_FLEX,
    ToolbarBtnType.THEME_COMMIT,
  ]
  return buttons
}

function getThemeThreeMenu() {
  let buttons = [
    ToolbarBtnType.THEME_CANCEL,
    ToolbarBtnType.THEME_MENU,
    ToolbarBtnType.THEME_COMMIT,
  ]
  return buttons
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

/**
 * 分段专题图颜色方案
 */
function getRangeColorScheme() {
  let list = [
    {
      key: 'CA_Oranges',
      title: 'CA_Oranges',
    },
    {
      key: 'CB_Reds',
      title: 'CB_Reds',
    },
    {
      key: 'CC_Lemons',
      title: 'CC_Lemons',
    },
    {
      key: 'CD_Cyans',
      title: 'CD_Cyans',
    },
    {
      key: 'CE_Greens',
      title: 'CE_Greens',
    },
    {
      key: 'CF_Blues',
      title: 'CF_Blues',
    },
    {
      key: 'CG_Purples',
      title: 'CG_Purples',
    },
    {
      key: 'DA_Oranges',
      title: 'DA_Oranges',
    },
    {
      key: 'DB_Reds',
      title: 'DB_Reds',
    },
    {
      key: 'DC_Lemons',
      title: 'DC_Lemons',
    },
    {
      key: 'DD_Cyans',
      title: 'DD_Cyans',
    },
    {
      key: 'DE_Greens',
      title: 'DE_Greens',
    },
    {
      key: 'DF_Blues',
      title: 'DF_Blues',
    },
    {
      key: 'DG_Purples',
      title: 'DG_Purples',
    },
    {
      key: 'EA_Oranges',
      title: 'EA_Oranges',
    },
    {
      key: 'EB_Reds',
      title: 'EB_Reds',
    },
    {
      key: 'EC_Lemons',
      title: 'EC_Lemons',
    },
    {
      key: 'ED_Cyans',
      title: 'ED_Cyans',
    },
    {
      key: 'EE_Greens',
      title: 'EE_Greens',
    },
    {
      key: 'EF_Blues',
      title: 'EF_Blues',
    },
    {
      key: 'EG_Purples',
      title: 'EG_Purples',
    },
    {
      key: 'FA_Oranges',
      title: 'FA_Oranges',
    },
    {
      key: 'FB_Reds',
      title: 'FB_Reds',
    },
    {
      key: 'FC_Lemons',
      title: 'FC_Lemons',
    },
    {
      key: 'FD_Cyans',
      title: 'FD_Cyans',
    },
    {
      key: 'FE_Greens',
      title: 'FE_Greens',
    },
    {
      key: 'FF_Blues',
      title: 'FF_Blues',
    },
    {
      key: 'FG_Purples',
      title: 'FG_Purples',
    },
    {
      key: 'GA_Yellow to Orange',
      title: 'GA_Yellow to Orange',
    },
    {
      key: 'GB_Orange to Red',
      title: 'GB_Orange to Red',
    },
    {
      key: 'GC_Olive to Purple',
      title: 'GC_Olive to Purple',
    },
    {
      key: 'GD_Green to Orange',
      title: 'GD_Green to Orange',
    },
    {
      key: 'GE_Blue to Lemon',
      title: 'GE_Blue to Lemon',
    },
    {
      key: 'ZA_Temperature 1',
      title: 'ZA_Temperature 1',
    },
    {
      key: 'ZB_Temperature 2',
      title: 'ZB_Temperature 2',
    },
    {
      key: 'ZC_Temperature 3',
      title: 'ZC_Temperature 3',
    },
    {
      key: 'ZD_Temperature 4',
      title: 'ZD_Temperature 4',
    },
    {
      key: 'ZE_Precipitation 1',
      title: 'ZE_Precipitation 1',
    },
    {
      key: 'ZF_Precipitation 2',
      title: 'ZF_Precipitation 2',
    },
    {
      key: 'ZG_Precipitation 3',
      title: 'ZG_Precipitation 3',
    },
    {
      key: 'ZH_Precipitation 4',
      title: 'ZH_Precipitation 4',
    },
    {
      key: 'ZI_Altitude 1',
      title: 'ZI_Altitude 1',
    },
    {
      key: 'ZJ_Altitude 2',
      title: 'ZJ_Altitude 2',
    },
    {
      key: 'ZK_Altitude 3',
      title: 'ZK_Altitude 3',
    },
  ]
  return list
}

/**
 * 单值专题图颜色方案
 */

function getUniqueColorScheme() {
  let list = [
    {
      key: 'BA_Blue',
      title: 'BA_Blue',
    },
    {
      key: 'BB_Green',
      title: 'BB_Green',
    },
    {
      key: 'BC_Orange',
      title: 'BC_Orange',
    },
    {
      key: 'BD_Pink',
      title: 'BD_Pink',
    },
    {
      key: 'CA_Red Rose',
      title: 'CA_Red Rose',
    },
    {
      key: 'CB_Blue and Yellow',
      title: 'CB_Blue and Yellow',
    },
    {
      key: 'CC_Pink and Green',
      title: 'CC_Pink and Green',
    },
    {
      key: 'CD_Fresh',
      title: 'CD_Fresh',
    },
    {
      key: 'DA_Ragular',
      title: 'DA_Ragular',
    },
    {
      key: 'DB_Common',
      title: 'DB_Common',
    },
    {
      key: 'DC_Bright',
      title: 'DC_Bright',
    },
    {
      key: 'DD_Warm',
      title: 'DD_Warm',
    },
    {
      key: 'DE_Set',
      title: 'DE_Set',
    },
    {
      key: 'DF_Pastel',
      title: 'DF_Pastel',
    },
    {
      key: 'DG_Grass',
      title: 'DG_Grass',
    },
    {
      key: 'EA_Sin_ColorScheme8',
      title: 'EA_Sin_ColorScheme8',
    },
    {
      key: 'EB_Sweet',
      title: 'EB_Sweet',
    },
    {
      key: 'EC_Dusk',
      title: 'EC_Dusk',
    },
    {
      key: 'ED_Pastel',
      title: 'ED_Pastel',
    },
    {
      key: 'EE_Lake',
      title: 'EE_Lake',
    },
    {
      key: 'EF_Grass',
      title: 'EF_Grass',
    },
    {
      key: 'EG_Sin_ColorScheme1',
      title: 'EG_Sin_ColorScheme1',
    },
    {
      key: 'EH_Sin_ColorScheme4',
      title: 'EH_Sin_ColorScheme4',
    },
    {
      key: 'EI_Sin_ColorScheme6',
      title: 'EI_Sin_ColorScheme6',
    },
    {
      key: 'EJ_Sin_ColorScheme7',
      title: 'EJ_Sin_ColorScheme7',
    },
    {
      key: 'FA_Red-Yellow-Blue',
      title: 'FA_Red-Yellow-Blue',
    },
    {
      key: 'FB_Red-Yellow-Green',
      title: 'FB_Red-Yellow-Green',
    },
  ]
  return list
}

export default {
  getRangeMode,
  getColorGradientType,
  setThemeParams,
  getLabelBackShape,
  getLabelFontName,
  getLabelFontRotation,
  getLabelFontColor,
  getThemeFourMenu,
  getThemeThreeMenu,
  getThemeMapCreate,
  getThemeMapParam,
  getRangeColorScheme,
  getUniqueColorScheme,
}
