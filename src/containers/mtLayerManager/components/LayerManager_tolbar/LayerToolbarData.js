import { getLanguage } from '../../../../language/index'

function layersetting(param) {
  return [
    {
      title: getLanguage(param).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
      //'设置为当前图层',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_this.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
      //'可见比例尺范围',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_range.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_LAYER_STYLE,
      //'图层风格',
      data: [],
      image: require('../../../../assets/function/icon_function_style.png'),
    },
    // {
    //   title: '图层属性',
    //   data: [],
    // },
    {
      title: getLanguage(param).Map_Layer.LAYERS_RENAME,
      //'重命名',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_rename.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_MOVE_UP,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_moveup.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_MOVE_DOWN,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_movedown.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_TOP,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_move_top.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_BOTTOM,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_move_bottom.png'),
    },
    // {
    //   title: '复制',
    //   data: [],
    // },
    // {
    //   title: '插入复制的图层',
    //   data: [],
    // },
    {
      title: getLanguage(param).Map_Layer.LAYERS_REMOVE,
      //'移除',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_remove.png'),
    },
    // {
    //   title: '取消',
    //   data: [],
    //   image: require('../../../../assets/mapToolbar/list_type_udb.png'),
    // },
  ]
}
const baseListData = [
  {
    title: '在线底图',
    index: 0,
    show: true,
    data: [
      // {
      //   title: 'STK',
      //   index: 0,
      //   show: true,
      //   type: 'terrainLayer',
      //   name: 'stk',
      //   url: 'https://assets.agi.com/stk-terrain/world',
      // },
      {
        title: 'bingmap',
        index: 0,
        show: true,
        type: 'l3dBingMaps',
        name: 'bingmap',
        url: 'http://t0.tianditu.com/img_c/wmts',
      },
    ],
  },
]

function layerThemeSetting(param) {
  return [
    {
      title: getLanguage(param).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
      //'设置为当前图层',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_this.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
      //'可见比例尺范围',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_range.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_CREAT_THEMATIC_MAP, //'新建专题图',
      data: [],
      image: require('../../../../assets/layerToolbar/theme_new.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_RENAME,
      //'重命名',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_rename.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_MOVE_UP,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_moveup.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_MOVE_DOWN,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_movedown.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_TOP,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_move_top.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_BOTTOM,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_move_bottom.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_REMOVE,
      //'移除',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_remove.png'),
    },
  ]
}
function layerThemeSettings(param) {
  return [
    {
      title: getLanguage(param).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
      //'设置为当前图层',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_this.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
      //'可见比例尺范围',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_range.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_MODIFY_THEMATIC_MAP,
      //'修改专题图',
      data: [],
      image: require('../../../../assets/layerToolbar/theme_modify.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_RENAME,
      //'重命名',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_rename.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_MOVE_UP,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_moveup.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_MOVE_DOWN,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_movedown.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_TOP,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_move_top.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_BOTTOM,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_move_bottom.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_REMOVE,
      //'移除',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_remove.png'),
    },
  ]
}

const layer3dSettingCanSelect = param => [
  {
    title: getLanguage(param).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
    data: [],
    image: require('../../../../assets/layerToolbar/layer_this.png'),
  },
  {
    title: '设置图层可选',
    data: [],
    image: require('../../../../assets/map/Frenchgrey/icon_selectable_selected.png'),
  },
]

const layer3dSettingCanNotSelect = param => [
  {
    title: getLanguage(param).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
    data: [],
    image: require('../../../../assets/layerToolbar/layer_this.png'),
  },
  {
    title: '设置图层不可选',
    data: [],
    image: require('../../../../assets/map/Frenchgrey/icon_selectable.png'),
  },
]

function layereditsetting(param) {
  return [
    {
      title: getLanguage(param).Map_Layer.BASEMAP_SWITH,
      data: [],
      image: require('../../../../assets/mapTools/icon_open_black.png'),
    },
  ]
}

function layerCollectionSetting(param) {
  return [
    {
      title: getLanguage(param).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
      //'设置为当前图层',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_this.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
      //'可见比例尺范围',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_range.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_RENAME,
      //'重命名',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_rename.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_MOVE_UP,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_moveup.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_MOVE_DOWN,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_movedown.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_TOP,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_move_top.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_BOTTOM,
      data: [],
      image: require('../../../../assets/layerToolbar/layer_move_bottom.png'),
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_REMOVE,
      //'移除',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_remove.png'),
    },
  ]
}
function taggingData(param) {
  return [
    {
      title: getLanguage(param).Map_Layer.PLOTS_IMPORT,
      //'导入标注',
      data: [],
      image: require('../../../../assets/function/icon_function_Tagging.png'),
    },
    {
      title: getLanguage(param).Map_Layer.PLOTS_DELETE,
      //'删除标注',
      data: [],
      image: require('../../../../assets/layerToolbar/layer_remove.png'),
    },
  ]
}

function scaleData(param) {
  return [
    {
      title: getLanguage(param).Map_Layer.LAYERS_MAXIMUM,
      //'最大可见比例尺',
      data: [],
    },
    {
      title: getLanguage(param).Map_Layer.LAYERS_MINIMUM,
      //'最小可见比例尺',
      data: [],
    },
  ]
}

const mscaleData = [
  {
    title: '1:5,000',
    data: [],
  },
  {
    title: '1:10,000',
    data: [],
  },
  {
    title: '1:25,000',
    data: [],
  },
  {
    title: '1:50,000',
    data: [],
  },
  {
    title: '1:100,000',
    data: [],
  },
  {
    title: '1:250,000',
    data: [],
  },
  {
    title: '1:500,000',
    data: [],
  },
  {
    title: '1:1,000,000',
    data: [],
  },
]

export {
  layersetting,
  layerThemeSetting,
  layer3dSettingCanSelect,
  layer3dSettingCanNotSelect,
  layerCollectionSetting,
  layerThemeSettings,
  layereditsetting,
  baseListData,
  taggingData,
  scaleData,
  mscaleData,
}
