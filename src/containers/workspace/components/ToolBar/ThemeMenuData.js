import constants from '../../constants'
import { SThemeCartography } from 'imobile_for_reactnative'
// import { Toast } from '../../../../utils'
import ToolbarBtnType from './ToolbarBtnType'
import { ConstToolType } from '../../../../constants'
import { Toast } from '../../../../utils'

// function showTips() {
//   Toast.show('功能暂未开放')
// }

let _toolbarParams = {}

function showDatasetsList() {
  let data = []
  SThemeCartography.getAllDatasetNames().then(getdata => {
    getdata.reverse()
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
          height:
            _toolbarParams.device.orientation === 'LANDSCAPE'
              ? ConstToolType.THEME_HEIGHT[3]
              : ConstToolType.THEME_HEIGHT[6],
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
      title: '上下旋转',
      action: setLabelFontRotation,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_rotation_updown.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_rotation_updown.png'),
    },
    {
      key: '-180',
      title: '左右旋转',
      action: setLabelFontRotation,
      size: 'large',
      image: require('../../../../assets/mapTools/uniformlabel_rotation_leftright.png'),
      selectedImage: require('../../../../assets/mapTools/uniformlabel_rotation_leftright.png'),
    },
  ]
  return data
}

/**设置统一标签字体颜色 */
function setLabelColor() {
  if (_params.ColorType === 'FORECOLOR') {
    return SThemeCartography.setUniformLabelColor(_params)
  } else if (_params.ColorType === 'BACKSHAPE_COLOR') {
    return SThemeCartography.setUniformLabelBackColor(_params)
  }
}

function getLabelColor() {
  let data = [
    {
      key: '#FFFFFF',
      action: setLabelColor,
      size: 'large',
      background: '#FFFFFF',
    },
    {
      key: '#000000',
      action: setLabelColor,
      size: 'large',
      background: '#000000',
    },
    {
      key: '#F0EDE1',
      action: setLabelColor,
      size: 'large',
      background: '#F0EDE1',
    },
    {
      key: '#1E477C',
      action: setLabelColor,
      size: 'large',
      background: '#1E477C',
    },
    {
      key: '#4982BC',
      action: setLabelColor,
      size: 'large',
      background: '#4982BC',
    },
    {
      key: '#00A1E9',
      action: setLabelColor,
      size: 'large',
      background: '#00A1E9',
    },
    {
      key: '#803000',
      action: setLabelColor,
      size: 'large',
      background: '#803000',
    },
    {
      key: '#BD5747',
      action: setLabelColor,
      size: 'large',
      background: '#BD5747',
    },
    {
      key: '#36E106',
      action: setLabelColor,
      size: 'large',
      background: '#36E106',
    },
    {
      key: '#9CBB58',
      action: setLabelColor,
      size: 'large',
      background: '#9CBB58',
    },
    {
      key: '#8364A1',
      action: setLabelColor,
      size: 'large',
      background: '#8364A1',
    },
    {
      key: '#4AADC7',
      action: setLabelColor,
      size: 'large',
      background: '#4AADC7',
    },
    {
      key: '#F89746',
      action: setLabelColor,
      size: 'large',
      background: '#F89746',
    },
    {
      key: '#E7A700',
      action: setLabelColor,
      size: 'large',
      background: '#E7A700',
    },
    {
      key: '#E7E300',
      action: setLabelColor,
      size: 'large',
      background: '#E7E300',
    },
    {
      key: '#D33248',
      action: setLabelColor,
      size: 'large',
      background: '#D33248',
    },
    {
      key: '#F1F1F1',
      action: setLabelColor,
      size: 'large',
      background: '#F1F1F1',
    },
    {
      key: '#7D7D7D',
      action: setLabelColor,
      size: 'large',
      background: '#7D7D7D',
    },
    {
      key: '#DDD9C3',
      action: setLabelColor,
      size: 'large',
      background: '#DDD9C3',
    },
    {
      key: '#C9DDF0',
      action: setLabelColor,
      size: 'large',
      background: '#C9DDF0',
    },
    {
      key: '#DBE4F3',
      action: setLabelColor,
      size: 'large',
      background: '#DBE4F3',
    },
    {
      key: '#BCE8FD',
      action: setLabelColor,
      size: 'large',
      background: '#BCE8FD',
    },
    {
      key: '#E5C495',
      action: setLabelColor,
      size: 'large',
      background: '#E5C495',
    },
    {
      key: '#F4DED9',
      action: setLabelColor,
      size: 'large',
      background: '#F4DED9',
    },
    {
      key: '#DBE9CE',
      action: setLabelColor,
      size: 'large',
      background: '#DBE9CE',
    },
    {
      key: '#EBF4DE',
      action: setLabelColor,
      size: 'large',
      background: '#EBF4DE',
    },
    {
      key: '#E5E1ED',
      action: setLabelColor,
      size: 'large',
      background: '#E5E1ED',
    },
    {
      key: '#DDF0F3',
      action: setLabelColor,
      size: 'large',
      background: '#DDF0F3',
    },
    {
      key: '#FDECDC',
      action: setLabelColor,
      size: 'large',
      background: '#FDECDC',
    },
    {
      key: '#FFE7C4',
      action: setLabelColor,
      size: 'large',
      background: '#FFE7C4',
    },
    {
      key: '#FDFACA',
      action: setLabelColor,
      size: 'large',
      background: '#FDFACA',
    },
    {
      key: '#F09CA0',
      action: setLabelColor,
      size: 'large',
      background: '#F09CA0',
    },
    {
      key: '#D7D7D7',
      action: setLabelColor,
      size: 'large',
      background: '#D7D7D7',
    },
    {
      key: '#585858',
      action: setLabelColor,
      size: 'large',
      background: '#585858',
    },
    {
      key: '#C6B797',
      action: setLabelColor,
      size: 'large',
      background: '#C6B797',
    },
    {
      key: '#8CB4EA',
      action: setLabelColor,
      size: 'large',
      background: '#8CB4EA',
    },
    {
      key: '#C1CCE4',
      action: setLabelColor,
      size: 'large',
      background: '#C1CCE4',
    },
    {
      key: '#7ED2F6',
      action: setLabelColor,
      size: 'large',
      background: '#7ED2F6',
    },
    {
      key: '#B1894F',
      action: setLabelColor,
      size: 'large',
      background: '#B1894F',
    },
    {
      key: '#E7B8B8',
      action: setLabelColor,
      size: 'large',
      background: '#E7B8B8',
    },
    {
      key: '#B0D59A',
      action: setLabelColor,
      size: 'large',
      background: '#B0D59A',
    },
    {
      key: '#D7E3BD',
      action: setLabelColor,
      size: 'large',
      background: '#D7E3BD',
    },
    {
      key: '#CDC1D9',
      action: setLabelColor,
      size: 'large',
      background: '#CDC1D9',
    },
    {
      key: '#B7DDE9',
      action: setLabelColor,
      size: 'large',
      background: '#B7DDE9',
    },
    {
      key: '#FAD6B1',
      action: setLabelColor,
      size: 'large',
      background: '#FAD6B1',
    },
    {
      key: '#F5CE88',
      action: setLabelColor,
      size: 'large',
      background: '#F5CE88',
    },
    {
      key: '#FFF55A',
      action: setLabelColor,
      size: 'large',
      background: '#FFF55A',
    },
    {
      key: '#EF6C78',
      action: setLabelColor,
      size: 'large',
      background: '#EF6C78',
    },
    {
      key: '#BFBFBF',
      action: setLabelColor,
      size: 'large',
      background: '#BFBFBF',
    },
    {
      key: '#3E3E3E',
      action: setLabelColor,
      size: 'large',
      background: '#3E3E3E',
    },
    {
      key: '#938953',
      action: setLabelColor,
      size: 'large',
      background: '#938953',
    },
    {
      key: '#548ED4',
      action: setLabelColor,
      size: 'large',
      background: '#548ED4',
    },
    {
      key: '#98B7D5',
      action: setLabelColor,
      size: 'large',
      background: '#98B7D5',
    },
    {
      key: '#00B4F0',
      action: setLabelColor,
      size: 'large',
      background: '#00B4F0',
    },
    {
      key: '#9A6C34',
      action: setLabelColor,
      size: 'large',
      background: '#9A6C34',
    },
    {
      key: '#D79896',
      action: setLabelColor,
      size: 'large',
      background: '#D79896',
    },
    {
      key: '#7EC368',
      action: setLabelColor,
      size: 'large',
      background: '#7EC368',
    },
    {
      key: '#C5DDA5',
      action: setLabelColor,
      size: 'large',
      background: '#C5DDA5',
    },
    {
      key: '#B1A5C6',
      action: setLabelColor,
      size: 'large',
      background: '#B1A5C6',
    },
    {
      key: '#93CDDD',
      action: setLabelColor,
      size: 'large',
      background: '#93CDDD',
    },
    {
      key: '#F9BD8D',
      action: setLabelColor,
      size: 'large',
      background: '#F9BD8D',
    },
    {
      key: '#F7B550',
      action: setLabelColor,
      size: 'large',
      background: '#F7B550',
    },
    {
      key: '#FFF100',
      action: setLabelColor,
      size: 'large',
      background: '#FFF100',
    },
    {
      key: '#E80050',
      action: setLabelColor,
      size: 'large',
      background: '#E80050',
    },
    {
      key: '#A6A6A7',
      action: setLabelColor,
      size: 'large',
      background: '#A6A6A7',
    },
    {
      key: '#2D2D2B',
      action: setLabelColor,
      size: 'large',
      background: '#2D2D2B',
    },
    {
      key: '#494428',
      action: setLabelColor,
      size: 'large',
      background: '#494428',
    },
    {
      key: '#1D3A5F',
      action: setLabelColor,
      size: 'large',
      background: '#1D3A5F',
    },
    {
      key: '#376192',
      action: setLabelColor,
      size: 'large',
      background: '#376192',
    },
    {
      key: '#00A1E9',
      action: setLabelColor,
      size: 'large',
      background: '#00A1E9',
    },
    {
      key: '#825320',
      action: setLabelColor,
      size: 'large',
      background: '#825320',
    },
    {
      key: '#903635',
      action: setLabelColor,
      size: 'large',
      background: '#903635',
    },
    {
      key: '#13B044',
      action: setLabelColor,
      size: 'large',
      background: '#13B044',
    },
    {
      key: '#76933C',
      action: setLabelColor,
      size: 'large',
      background: '#76933C',
    },
    {
      key: '#5E467C',
      action: setLabelColor,
      size: 'large',
      background: '#5E467C',
    },
    {
      key: '#31859D',
      action: setLabelColor,
      size: 'large',
      background: '#31859D',
    },
    {
      key: '#E46C07',
      action: setLabelColor,
      size: 'large',
      background: '#E46C07',
    },
    {
      key: '#F39900',
      action: setLabelColor,
      size: 'large',
      background: '#F39900',
    },
    {
      key: '#B7AB00',
      action: setLabelColor,
      size: 'large',
      background: '#B7AB00',
    },
    {
      key: '#A50036',
      action: setLabelColor,
      size: 'large',
      background: '#A50036',
    },
    {
      key: '#979D99',
      action: setLabelColor,
      size: 'large',
      background: '#979D99',
    },
    {
      key: '#0C0C0C',
      action: setLabelColor,
      size: 'large',
      background: '#0C0C0C',
    },
    {
      key: '#1C1A10',
      action: setLabelColor,
      size: 'large',
      background: '#1C1A10',
    },
    {
      key: '#0C263D',
      action: setLabelColor,
      size: 'large',
      background: '#0C263D',
    },
    {
      key: '#1D3A5F',
      action: setLabelColor,
      size: 'large',
      background: '#1D3A5F',
    },
    {
      key: '#005883',
      action: setLabelColor,
      size: 'large',
      background: '#005883',
    },
    {
      key: '#693904',
      action: setLabelColor,
      size: 'large',
      background: '#693904',
    },
    {
      key: '#622727',
      action: setLabelColor,
      size: 'large',
      background: '#622727',
    },
    {
      key: '#005E14',
      action: setLabelColor,
      size: 'large',
      background: '#005E14',
    },
    {
      key: '#4F6028',
      action: setLabelColor,
      size: 'large',
      background: '#4F6028',
    },
    {
      key: '#3E3050',
      action: setLabelColor,
      size: 'large',
      background: '#3E3050',
    },
    {
      key: '#245B66',
      action: setLabelColor,
      size: 'large',
      background: '#245B66',
    },
    {
      key: '#974805',
      action: setLabelColor,
      size: 'large',
      background: '#974805',
    },
    {
      key: '#AD6A00',
      action: setLabelColor,
      size: 'large',
      background: '#AD6A00',
    },
    {
      key: '#8B8100',
      action: setLabelColor,
      size: 'large',
      background: '#8B8100',
    },
    {
      key: '#7C0022',
      action: setLabelColor,
      size: 'large',
      background: '#7C0022',
    },
    {
      key: '#F0DCBE',
      action: setLabelColor,
      size: 'large',
      background: '#F0DCBE',
    },
    {
      key: '#F2B1CF',
      action: setLabelColor,
      size: 'large',
      background: '#F2B1CF',
    },
    {
      key: '#D3FFBF',
      action: setLabelColor,
      size: 'large',
      background: '#D3FFBF',
    },
    {
      key: '#00165F',
      action: setLabelColor,
      size: 'large',
      background: '#00165F',
    },
    {
      key: '#6673CB',
      action: setLabelColor,
      size: 'large',
      background: '#6673CB',
    },
    {
      key: '#006EBF',
      action: setLabelColor,
      size: 'large',
      background: '#006EBF',
    },
    {
      key: '#89CF66',
      action: setLabelColor,
      size: 'large',
      background: '#89CF66',
    },
    {
      key: '#70A900',
      action: setLabelColor,
      size: 'large',
      background: '#70A900',
    },
    {
      key: '#13B044',
      action: setLabelColor,
      size: 'large',
      background: '#13B044',
    },
    {
      key: '#93D150',
      action: setLabelColor,
      size: 'large',
      background: '#93D150',
    },
    {
      key: '#70319F',
      action: setLabelColor,
      size: 'large',
      background: '#70319F',
    },
    {
      key: '#00B4F0',
      action: setLabelColor,
      size: 'large',
      background: '#00B4F0',
    },
    {
      key: '#D38968',
      action: setLabelColor,
      size: 'large',
      background: '#D38968',
    },
    {
      key: '#FFBF00',
      action: setLabelColor,
      size: 'large',
      background: '#FFBF00',
    },
    {
      key: '#FFFF00',
      action: setLabelColor,
      size: 'large',
      background: '#FFFF00',
    },
    {
      key: '#C10000',
      action: setLabelColor,
      size: 'large',
      background: '#C10000',
    },
    {
      key: '#F0F1A6',
      action: setLabelColor,
      size: 'large',
      background: '#F0F1A6',
    },
    {
      key: '#FF0000',
      action: setLabelColor,
      size: 'large',
      background: '#FF0000',
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
      colorSchemeName: 'CA_Oranges',
      colorScheme: require('../../../../assets/rangeColorScheme/CA_Oranges.png'),
    },
    {
      key: 'CB_Reds',
      colorSchemeName: 'CB_Reds',
      colorScheme: require('../../../../assets/rangeColorScheme/CB_Reds.png'),
    },
    {
      key: 'CC_Lemons',
      colorSchemeName: 'CC_Lemons',
      colorScheme: require('../../../../assets/rangeColorScheme/CC_Lemons.png'),
    },
    {
      key: 'CD_Cyans',
      colorSchemeName: 'CD_Cyans',
      colorScheme: require('../../../../assets/rangeColorScheme/CD_Cyans.png'),
    },
    {
      key: 'CE_Greens',
      colorSchemeName: 'CE_Greens',
      colorScheme: require('../../../../assets/rangeColorScheme/CE_Greens.png'),
    },
    {
      key: 'CF_Blues',
      colorSchemeName: 'CF_Blues',
      colorScheme: require('../../../../assets/rangeColorScheme/CF_Blues.png'),
    },
    {
      key: 'CG_Purples',
      colorSchemeName: 'CG_Purples',
      colorScheme: require('../../../../assets/rangeColorScheme/CG_Purples.png'),
    },
    {
      key: 'DA_Oranges',
      colorSchemeName: 'DA_Oranges',
      colorScheme: require('../../../../assets/rangeColorScheme/DA_Oranges.png'),
    },
    {
      key: 'DB_Reds',
      colorSchemeName: 'DB_Reds',
      colorScheme: require('../../../../assets/rangeColorScheme/DB_Reds.png'),
    },
    {
      key: 'DC_Lemons',
      colorSchemeName: 'DC_Lemons',
      colorScheme: require('../../../../assets/rangeColorScheme/DC_Lemons.png'),
    },
    {
      key: 'DD_Cyans',
      colorSchemeName: 'DD_Cyans',
      colorScheme: require('../../../../assets/rangeColorScheme/DD_Cyans.png'),
    },
    {
      key: 'DE_Greens',
      colorSchemeName: 'DE_Greens',
      colorScheme: require('../../../../assets/rangeColorScheme/DE_Greens.png'),
    },
    {
      key: 'DF_Blues',
      colorSchemeName: 'DF_Blues',
      colorScheme: require('../../../../assets/rangeColorScheme/DF_Blues.png'),
    },
    {
      key: 'DG_Purples',
      colorSchemeName: 'DG_Purples',
      colorScheme: require('../../../../assets/rangeColorScheme/DG_Purples.png'),
    },
    {
      key: 'EA_Oranges',
      colorSchemeName: 'EA_Oranges',
      colorScheme: require('../../../../assets/rangeColorScheme/EA_Oranges.png'),
    },
    {
      key: 'EB_Reds',
      colorSchemeName: 'EB_Reds',
      colorScheme: require('../../../../assets/rangeColorScheme/EB_Reds.png'),
    },
    {
      key: 'EC_Lemons',
      colorSchemeName: 'EC_Lemons',
      colorScheme: require('../../../../assets/rangeColorScheme/EC_Lemons.png'),
    },
    {
      key: 'ED_Cyans',
      colorSchemeName: 'ED_Cyans',
      colorScheme: require('../../../../assets/rangeColorScheme/ED_Cyans.png'),
    },
    {
      key: 'EE_Greens',
      colorSchemeName: 'EE_Greens',
      colorScheme: require('../../../../assets/rangeColorScheme/EE_Greens.png'),
    },
    {
      key: 'EF_Blues',
      colorSchemeName: 'EF_Blues',
      colorScheme: require('../../../../assets/rangeColorScheme/EF_Blues.png'),
    },
    {
      key: 'EG_Purples',
      colorSchemeName: 'EG_Purples',
      colorScheme: require('../../../../assets/rangeColorScheme/EG_Purples.png'),
    },
    {
      key: 'FA_Oranges',
      colorSchemeName: 'FA_Oranges',
      colorScheme: require('../../../../assets/rangeColorScheme/FA_Oranges.png'),
    },
    {
      key: 'FB_Reds',
      colorSchemeName: 'FB_Reds',
      colorScheme: require('../../../../assets/rangeColorScheme/FB_Reds.png'),
    },
    {
      key: 'FC_Lemons',
      colorSchemeName: 'FC_Lemons',
      colorScheme: require('../../../../assets/rangeColorScheme/FC_Lemons.png'),
    },
    {
      key: 'FD_Cyans',
      colorSchemeName: 'FD_Cyans',
      colorScheme: require('../../../../assets/rangeColorScheme/FD_Cyans.png'),
    },
    {
      key: 'FE_Greens',
      colorSchemeName: 'FE_Greens',
      colorScheme: require('../../../../assets/rangeColorScheme/FE_Greens.png'),
    },
    {
      key: 'FF_Blues',
      colorSchemeName: 'FF_Blues',
      colorScheme: require('../../../../assets/rangeColorScheme/FF_Blues.png'),
    },
    {
      key: 'FG_Purples',
      colorSchemeName: 'FG_Purples',
      colorScheme: require('../../../../assets/rangeColorScheme/FG_Purples.png'),
    },
    {
      key: 'GA_Yellow to Orange',
      colorSchemeName: 'GA_Yellow to Orange',
      colorScheme: require('../../../../assets/rangeColorScheme/GA_Yellow_to_Orange.png'),
    },
    {
      key: 'GB_Orange to Red',
      colorSchemeName: 'GB_Orange to Red',
      colorScheme: require('../../../../assets/rangeColorScheme/GB_Orange_to_Red.png'),
    },
    {
      key: 'GC_Olive to Purple',
      colorSchemeName: 'GC_Olive to Purple',
      colorScheme: require('../../../../assets/rangeColorScheme/GC_Olive_to_Purple.png'),
    },
    {
      key: 'GD_Green to Orange',
      colorSchemeName: 'GD_Green to Orange',
      colorScheme: require('../../../../assets/rangeColorScheme/GD_Green_to_Orange.png'),
    },
    {
      key: 'GE_Blue to Lemon',
      colorSchemeName: 'GE_Blue to Lemon',
      colorScheme: require('../../../../assets/rangeColorScheme/GE_Blue_to_Lemon.png'),
    },
    {
      key: 'ZA_Temperature 1',
      colorSchemeName: 'ZA_Temperature 1',
      colorScheme: require('../../../../assets/rangeColorScheme/ZA_Temperature_1.png'),
    },
    {
      key: 'ZB_Temperature 2',
      colorSchemeName: 'ZB_Temperature 2',
      colorScheme: require('../../../../assets/rangeColorScheme/ZB_Temperature_2.png'),
    },
    {
      key: 'ZC_Temperature 3',
      colorSchemeName: 'ZC_Temperature 3',
      colorScheme: require('../../../../assets/rangeColorScheme/ZC_Temperature_3.png'),
    },
    {
      key: 'ZD_Temperature 4',
      colorSchemeName: 'ZD_Temperature 4',
      colorScheme: require('../../../../assets/rangeColorScheme/ZD_Temperature_4.png'),
    },
    {
      key: 'ZE_Precipitation 1',
      colorSchemeName: 'ZE_Precipitation 1',
      colorScheme: require('../../../../assets/rangeColorScheme/ZE_Precipitation_1.png'),
    },
    {
      key: 'ZF_Precipitation 2',
      colorSchemeName: 'ZF_Precipitation 2',
      colorScheme: require('../../../../assets/rangeColorScheme/ZF_Precipitation_2.png'),
    },
    {
      key: 'ZG_Precipitation 3',
      colorSchemeName: 'ZG_Precipitation 3',
      colorScheme: require('../../../../assets/rangeColorScheme/ZG_Precipitation_3.png'),
    },
    {
      key: 'ZH_Precipitation 4',
      colorSchemeName: 'ZH_Precipitation 4',
      colorScheme: require('../../../../assets/rangeColorScheme/ZH_Precipitation_4.png'),
    },
    {
      key: 'ZI_Altitude 1',
      colorSchemeName: 'ZI_Altitude 1',
      colorScheme: require('../../../../assets/rangeColorScheme/ZI_Altitude_1.png'),
    },
    {
      key: 'ZJ_Altitude 2',
      colorSchemeName: 'ZJ_Altitude 2',
      colorScheme: require('../../../../assets/rangeColorScheme/ZJ_Altitude_2.png'),
    },
    {
      key: 'ZK_Altitude 3',
      colorSchemeName: 'ZK_Altitude 3',
      colorScheme: require('../../../../assets/rangeColorScheme/ZK_Altitude_3.png'),
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
      colorSchemeName: 'BA_Blue',
      colorScheme: require('../../../../assets/uniqueColorScheme/BA_Blue.png'),
    },
    {
      key: 'BB_Green',
      colorSchemeName: 'BB_Green',
      colorScheme: require('../../../../assets/uniqueColorScheme/BB_Green.png'),
    },
    {
      key: 'BC_Orange',
      colorSchemeName: 'BC_Orange',
      colorScheme: require('../../../../assets/uniqueColorScheme/BC_Orange.png'),
    },
    {
      key: 'BD_Pink',
      colorSchemeName: 'BD_Pink',
      colorScheme: require('../../../../assets/uniqueColorScheme/BD_Pink.png'),
    },
    {
      key: 'CA_Red Rose',
      colorSchemeName: 'CA_Red Rose',
      colorScheme: require('../../../../assets/uniqueColorScheme/CA_Red_Rose.png'),
    },
    {
      key: 'CB_Blue and Yellow',
      colorSchemeName: 'CB_Blue and Yellow',
      colorScheme: require('../../../../assets/uniqueColorScheme/CB_Blue_and_Yellow.png'),
    },
    {
      key: 'CC_Pink and Green',
      colorSchemeName: 'CC_Pink and Green',
      colorScheme: require('../../../../assets/uniqueColorScheme/CC_Pink_and_Green.png'),
    },
    {
      key: 'CD_Fresh',
      colorSchemeName: 'CD_Fresh',
      colorScheme: require('../../../../assets/uniqueColorScheme/CD_Fresh.png'),
    },
    {
      key: 'DA_Ragular',
      colorSchemeName: 'DA_Ragular',
      colorScheme: require('../../../../assets/uniqueColorScheme/DA_Ragular.png'),
    },
    {
      key: 'DB_Common',
      colorSchemeName: 'DB_Common',
      colorScheme: require('../../../../assets/uniqueColorScheme/DB_Common.png'),
    },
    {
      key: 'DC_Bright',
      colorSchemeName: 'DC_Bright',
      colorScheme: require('../../../../assets/uniqueColorScheme/DC_Bright.png'),
    },
    {
      key: 'DD_Warm',
      colorSchemeName: 'DD_Warm',
      colorScheme: require('../../../../assets/uniqueColorScheme/DD_Warm.png'),
    },
    {
      key: 'DE_Set',
      colorSchemeName: 'DE_Set',
      colorScheme: require('../../../../assets/uniqueColorScheme/DE_Set.png'),
    },
    {
      key: 'DF_Pastel',
      colorSchemeName: 'DF_Pastel',
      colorScheme: require('../../../../assets/uniqueColorScheme/DF_Pastel.png'),
    },
    {
      key: 'DG_Grass',
      colorSchemeName: 'DG_Grass',
      colorScheme: require('../../../../assets/uniqueColorScheme/DG_Grass.png'),
    },
    {
      key: 'EA_Sin_ColorScheme8',
      colorSchemeName: 'EA_Sin_ColorScheme8',
      colorScheme: require('../../../../assets/uniqueColorScheme/EA_Sin_ColorScheme8.png'),
    },
    {
      key: 'EB_Sweet',
      colorSchemeName: 'EB_Sweet',
      colorScheme: require('../../../../assets/uniqueColorScheme/EB_Sweet.png'),
    },
    {
      key: 'EC_Dusk',
      colorSchemeName: 'EC_Dusk',
      colorScheme: require('../../../../assets/uniqueColorScheme/EC_Dusk.png'),
    },
    {
      key: 'ED_Pastel',
      colorSchemeName: 'ED_Pastel',
      colorScheme: require('../../../../assets/uniqueColorScheme/ED_Pastel.png'),
    },
    {
      key: 'EE_Lake',
      colorSchemeName: 'EE_Lake',
      colorScheme: require('../../../../assets/uniqueColorScheme/EE_Lake.png'),
    },
    {
      key: 'EF_Grass',
      colorSchemeName: 'EF_Grass',
      colorScheme: require('../../../../assets/uniqueColorScheme/EF_Grass.png'),
    },
    {
      key: 'EG_Sin_ColorScheme1',
      colorSchemeName: 'EG_Sin_ColorScheme1',
      colorScheme: require('../../../../assets/uniqueColorScheme/EG_Sin_ColorScheme1.png'),
    },
    {
      key: 'EH_Sin_ColorScheme4',
      colorSchemeName: 'EH_Sin_ColorScheme4',
      colorScheme: require('../../../../assets/uniqueColorScheme/EH_Sin_ColorScheme4.png'),
    },
    {
      key: 'EI_Sin_ColorScheme6',
      colorSchemeName: 'EI_Sin_ColorScheme6',
      colorScheme: require('../../../../assets/uniqueColorScheme/EI_Sin_ColorScheme6.png'),
    },
    {
      key: 'EJ_Sin_ColorScheme7',
      colorSchemeName: 'EJ_Sin_ColorScheme7',
      colorScheme: require('../../../../assets/uniqueColorScheme/EJ_Sin_ColorScheme7.png'),
    },
    {
      key: 'FA_Red-Yellow-Blue',
      colorSchemeName: 'FA_Red-Yellow-Blue',
      colorScheme: require('../../../../assets/uniqueColorScheme/FA_Red-Yellow-Blue.png'),
    },
    {
      key: 'FA_Blue-Yellow-Red',
      colorSchemeName: 'FA_Blue-Yellow-Red',
      colorScheme: require('../../../../assets/uniqueColorScheme/FA_Blue-Yellow-Red.png'),
    },
    {
      key: 'FB_Red-Yellow-Green',
      colorSchemeName: 'FB_Red-Yellow-Green',
      colorScheme: require('../../../../assets/uniqueColorScheme/FB_Red-Yellow-Green.png'),
    },
  ]
  return list
}

/**专题制图:提交 */
function saveMapTheme() {
  let save = SThemeCartography.saveMap()
  if (save) {
    Toast.show('保存成功')
  } else {
    Toast.show('保存失败')
  }
}

export default {
  getRangeMode,
  getColorGradientType,
  setThemeParams,
  getLabelBackShape,
  getLabelFontName,
  getLabelFontRotation,
  getLabelColor,
  getThemeFourMenu,
  getThemeThreeMenu,
  getThemeMapCreate,
  getThemeMapParam,
  getRangeColorScheme,
  getUniqueColorScheme,
  saveMapTheme,
}
