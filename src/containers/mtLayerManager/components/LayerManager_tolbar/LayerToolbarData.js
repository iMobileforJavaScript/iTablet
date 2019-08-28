import { getLanguage } from '../../../../language/index'
import { getPublicAssets } from '../../../../assets'

function getGroupData(type) {
  return [
    {
      title: getLanguage(type).Map_Layer.LAYERS_RENAME,
      //'重命名',
      image: getPublicAssets().mapTools.tools_layer_rename,
    },
    {
      title: getLanguage(type).Map_Layer.LAYERS_REMOVE,
      //'移除',
      image: require('../../../../assets/layerToolbar/layer_remove.png'),
    },
  ]
}

function layersetting(type, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(type)
  } else {
    data = [
      {
        title: getLanguage(type).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_LAYER_STYLE,
        //'图层风格',
        image: require('../../../../assets/function/icon_function_style.png'),
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      // {
      //   title: getLanguage(type).Map_Layer.LAYERS_MOVE_UP,
      //   image: require('../../../../assets/layerToolbar/layer_moveup.png'),
      // },
      // {
      //   title: getLanguage(type).Map_Layer.LAYERS_MOVE_DOWN,
      //   image: require('../../../../assets/layerToolbar/layer_movedown.png'),
      // },
      // {
      //   title: getLanguage(type).Map_Layer.LAYERS_TOP,
      //   image: require('../../../../assets/layerToolbar/layer_move_top.png'),
      // },
      // {
      //   title: getLanguage(type).Map_Layer.LAYERS_BOTTOM,
      //   image: require('../../../../assets/layerToolbar/layer_move_bottom.png'),
      // },
      // {
      //   title: '复制',
      //   data: [],
      // },
      // {
      //   title: '插入复制的图层',
      //   data: [],
      // },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SHARE,
        //'分享图层',
        image: require('../../../../assets/function/icon_function_share.png'),
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_REMOVE,
        //'移除',
        image: require('../../../../assets/layerToolbar/layer_remove.png'),
      },
      // {
      //   title: '取消',
      //   data: [],
      //   image: require('../../../../assets/mapToolbar/list_type_udb.png'),
      // },
    ]
  }
  return [
    {
      title: '',
      data: data,
    },
  ]
}

const base3DListData = [
  {
    title: '在线底图',
    index: 0,
    show: true,
    data: [
      // {
      //   title: 'bingmap',
      //   index: 0,
      //   show: true,
      //   type: 'l3dBingMaps',
      //   name: 'bingmap',
      //   url: 'http://t0.tianditu.com/img_c/wmts',
      // },
      {
        title: 'tianditu',
        index: 0,
        show: true,
        type: 'ImageFormatTypeJPG_PNG',
        name: 'tianditu',
        url:
          'http://t0.tianditu.com/img_c/wmts?tk=22f8a846ef9e3becd95a25b08bde8f36',
      },
    ],
  },
]

function layerThemeSetting(type, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(type)
  } else {
    data = [
      {
        title: getLanguage(type).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_CREATE_THEMATIC_MAP,
        //'新建专题图',
        image: getPublicAssets().mapTools.tools_new_thematic_map,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SHARE,
        //'分享图层',
        image: require('../../../../assets/function/icon_function_share.png'),
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_REMOVE,
        //'移除',
        image: require('../../../../assets/layerToolbar/layer_remove.png'),
      },
    ]
  }
  return [
    {
      title: '',
      data: data,
    },
  ]
}
function layerThemeSettings(type, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(type)
  } else {
    data = [
      {
        title: getLanguage(type).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_MODIFY_THEMATIC_MAP,
        //'修改专题图',
        image: getPublicAssets().mapTools.tools_modify_thematic_map,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SHARE,
        //'分享图层',
        image: require('../../../../assets/function/icon_function_share.png'),
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_REMOVE,
        //'移除',
        image: require('../../../../assets/layerToolbar/layer_remove.png'),
      },
    ]
  }
  return [
    {
      title: '',
      data: data,
    },
  ]
}

/*
 * 顶部header菜单数据
 * */
const layerSettingCanVisit = type => [
  {
    title: getLanguage(type).Map_Layer.VISIBLE,
    // 设置图层可见
    image: require('../../../../assets/layerToolbar/layer_can_visible.png'),
  },
]

const layerSettingCanNotVisit = type => [
  {
    title: getLanguage(type).Map_Layer.NOT_VISIBLE,
    // 设置图层不可见
    image: require('../../../../assets/layerToolbar/layer_can_not_visible.png'),
  },
]

const layerSettingCanSelect = type => [
  {
    title: getLanguage(type).Map_Layer.OPTIONAL,
    image: require('../../../../assets/map/Frenchgrey/icon_selectable_selected.png'),
  },
]

const layerSettingCanNotSelect = type => [
  {
    title: getLanguage(type).Map_Layer.NOT_OPTIONAL,
    image: require('../../../../assets/map/Frenchgrey/icon_selectable.png'),
  },
]

const layerSettingCanEdit = type => [
  {
    title: getLanguage(type).Map_Layer.EDITABLE,
    image: require('../../../../assets/layerToolbar/layer_can_edit.png'),
  },
]

const layerSettingCanNotEdit = type => [
  {
    title: getLanguage(type).Map_Layer.NOT_EDITABLE,
    image: require('../../../../assets/layerToolbar/layer_can_not_edit.png'),
  },
]

const layerSettingCanSnap = type => [
  {
    title: getLanguage(type).Map_Layer.SNAPABLE,
    image: require('../../../../assets/layerToolbar/layer_can_catch.png'),
  },
]

const layerSettingCanNotSnap = type => [
  {
    title: getLanguage(type).Map_Layer.NOT_SNAPABLE,
    image: require('../../../../assets/layerToolbar/layer_can_not_catch.png'),
  },
]

const layer3dDefault = (type, selected) => {
  let data = {
    title: getLanguage(type).Map_Layer.NOT_OPTIONAL,
    image: require('../../../../assets/map/Frenchgrey/icon_selectable.png'),
    type: 'setLayerSelect',
  }
  if (selected === false) {
    data = {
      title: getLanguage(type).Map_Layer.OPTIONAL,
      image: require('../../../../assets/map/Frenchgrey/icon_selectable_selected.png'),
      type: 'setLayerSelect',
    }
  }
  return [
    {
      title: '',
      data: [
        {
          // title: getLanguage(type).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
          title:
            global.language === 'CN'
              ? '缩放至当前图层'
              : 'Scale to the current layer',
          image: getPublicAssets().mapTools.tools_visible_scale_range,
          type: 'scaleToLayer',
        },
        data,
      ],
    },
  ]
}

function layere3dImage() {
  return [
    {
      title: '',
      data: [
        {
          // title: getLanguage(type).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
          title:
            global.language === 'CN'
              ? '缩放至当前图层'
              : 'Scale to the current layer',
          image: getPublicAssets().mapTools.tools_visible_scale_range,
          type: 'scaleToLayer',
        },
        {
          title:
            global.language === 'CN' ? '添加影像图层' : 'Add a image layer',
          image: require('../../../../assets/mapTools/icon_create_black.png'),
          type: 'AddImage',
        },
        {
          title: global.language === 'CN' ? '移除当前图层' : 'Remove the layer',
          image: require('../../../../assets/layerToolbar/layer_remove.png'),
          type: 'RemoveLayer3d_image',
        },
        // {
        //   title: getLanguage(type).Map_Layer.BASEMAP_SWITH,
        //   image: require('../../../../assets/mapTools/icon_open_black.png'),
        // },
      ],
    },
  ]
}

function layere3dTerrain() {
  return [
    {
      title: '',
      data: [
        {
          // title: getLanguage(type).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
          title:
            global.language === 'CN'
              ? '缩放至当前图层'
              : 'Scale to the current layer',
          image: getPublicAssets().mapTools.tools_visible_scale_range,
          type: 'scaleToLayer',
        },
        {
          title:
            global.language === 'CN' ? '添加地形图层' : 'Add a terrain layer',
          image: require('../../../../assets/mapTools/icon_create_black.png'),
          type: 'AddTerrain',
        },
        {
          title: global.language === 'CN' ? '移除当前图层' : 'Remove the layer',
          image: require('../../../../assets/layerToolbar/layer_remove.png'),
          type: 'RemoveLayer3d_terrain',
        },
      ],
    },
  ]
}

function layereditsetting(type) {
  return [
    {
      title: '',
      data: [
        {
          title: getLanguage(type).Map_Layer.BASEMAP_SWITH,
          image: require('../../../../assets/mapTools/icon_open_black.png'),
        },
        {
          title: getLanguage(type).Map_Layer.LAYERS_REMOVE,
          //'移除',
          image: require('../../../../assets/layerToolbar/layer_remove.png'),
        },
      ],
    },
  ]
}

function taggingData(type) {
  return [
    {
      title: '',
      data: [
        {
          title: getLanguage(type).Map_Layer.LAYERS_FULL_VIEW_LAYER,
          //'全副显示图层',
          image: require('../../../../assets/layerToolbar/layer_full.png'),
        },
        {
          title: getLanguage(type).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
          //'设置为当前图层',
          image: getPublicAssets().mapTools.tools_set_current_layer,
        },
        {
          title: getLanguage(type).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
          //'可见比例尺范围',
          image: getPublicAssets().mapTools.tools_visible_scale_range,
        },
      ],
    },
  ]
}

function layerPlottingSetting(type, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(type)
  } else {
    data = [
      {
        title: getLanguage(type).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SHARE,
        //'分享图层',
        image: require('../../../../assets/function/icon_function_share.png'),
      },
    ]
  }
  return [
    {
      title: '',
      data: data,
    },
  ]
}
function layerCollectionSetting(type, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(type)
  } else {
    data = [
      {
        title: getLanguage(type).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_SHARE,
        //'分享图层',
        image: require('../../../../assets/function/icon_function_share.png'),
      },
      {
        title: getLanguage(type).Map_Layer.LAYERS_REMOVE,
        //'移除',
        image: require('../../../../assets/layerToolbar/layer_remove.png'),
      },
    ]
  }
  return [
    {
      title: '',
      data: data,
    },
  ]
}

function scaleData(type) {
  return [
    {
      title: '',
      data: [
        {
          title: getLanguage(type).Map_Layer.LAYERS_MAXIMUM,
          //'最大可见比例尺',
        },
        {
          title: getLanguage(type).Map_Layer.LAYERS_MINIMUM,
          //'最小可见比例尺',
        },
      ],
    },
  ]
}

const mscaleData = [
  {
    title: '',
    data: [
      {
        title: '1:5,000',
      },
      {
        title: '1:10,000',
      },
      {
        title: '1:25,000',
      },
      {
        title: '1:50,000',
      },
      {
        title: '1:100,000',
      },
      {
        title: '1:250,000',
      },
      {
        title: '1:500,000',
      },
      {
        title: '1:1,000,000',
      },
    ],
  },
]

export {
  layersetting,
  layerThemeSetting,
  layerPlottingSetting,
  layerCollectionSetting,
  layerThemeSettings,
  layereditsetting,
  //3d
  layere3dImage,
  base3DListData,
  layere3dTerrain,
  layer3dDefault,
  taggingData,
  scaleData,
  mscaleData,
  layerSettingCanSelect,
  layerSettingCanNotSelect,
  layerSettingCanVisit,
  layerSettingCanNotVisit,
  layerSettingCanEdit,
  layerSettingCanNotEdit,
  layerSettingCanSnap,
  layerSettingCanNotSnap,
}
