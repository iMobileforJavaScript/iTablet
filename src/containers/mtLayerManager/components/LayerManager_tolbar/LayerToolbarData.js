import { getLanguage } from '../../../../language'
import { getPublicAssets } from '../../../../assets'
import dataUtil from '../../../../utils/dataUtil'
import { DatasetType } from 'imobile_for_reactnative'
import constants from '../../../../containers/workspace/constants'

function getGroupData(language) {
  return [
    {
      title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
      //'全副显示图层',
      image: require('../../../../assets/layerToolbar/layer_full.png'),
    },
    {
      title: getLanguage(language).Map_Layer.LAYERS_RENAME,
      //'重命名',
      image: getPublicAssets().mapTools.tools_layer_rename,
    },
    {
      title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
      //'移除',
      image: require('../../../../assets/layerToolbar/layer_remove.png'),
    },
  ]
}

function layersetting(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_LAYER_STYLE,
        //'图层风格',
        image: require('../../../../assets/function/icon_function_style.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_MOVE_UP,
      //   image: require('../../../../assets/layerToolbar/layer_moveup.png'),
      // },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_MOVE_DOWN,
      //   image: require('../../../../assets/layerToolbar/layer_movedown.png'),
      // },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_TOP,
      //   image: require('../../../../assets/layerToolbar/layer_move_top.png'),
      // },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_BOTTOM,
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
        title: getLanguage(language).Map_Layer.LAYERS_SHARE,
        //'分享图层',
        image: require('../../../../assets/function/icon_function_share.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
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

function layerThemeSetting(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_CREATE_THEMATIC_MAP,
        //'新建专题图',
        image: getPublicAssets().mapTools.tools_new_thematic_map,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_LAYER_STYLE,
        //'图层风格',
        image: require('../../../../assets/function/icon_function_style.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SHARE,
        //'分享图层',
        image: require('../../../../assets/function/icon_function_share.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
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
function layerThemeSettings(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_MODIFY_THEMATIC_MAP,
        //'修改专题图',
        image: getPublicAssets().mapTools.tools_modify_thematic_map,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SHARE,
        //'分享图层',
        image: require('../../../../assets/function/icon_function_share.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
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
const layerSettingCanVisit = language => [
  {
    title: getLanguage(language).Map_Layer.VISIBLE,
    // 设置图层可见
    image: require('../../../../assets/layerToolbar/layer_can_visible.png'),
  },
]

const layerSettingCanNotVisit = language => [
  {
    title: getLanguage(language).Map_Layer.NOT_VISIBLE,
    // 设置图层不可见
    image: require('../../../../assets/layerToolbar/layer_can_not_visible.png'),
  },
]

const layerSettingCanSelect = language => [
  {
    title: getLanguage(language).Map_Layer.OPTIONAL,
    image: require('../../../../assets/map/Frenchgrey/icon_selectable_selected.png'),
  },
]

const layerSettingCanNotSelect = language => [
  {
    title: getLanguage(language).Map_Layer.NOT_OPTIONAL,
    image: require('../../../../assets/map/Frenchgrey/icon_selectable.png'),
  },
]

const layerSettingCanEdit = language => [
  {
    title: getLanguage(language).Map_Layer.EDITABLE,
    image: require('../../../../assets/layerToolbar/layer_can_edit.png'),
  },
]

const layerSettingCanNotEdit = language => [
  {
    title: getLanguage(language).Map_Layer.NOT_EDITABLE,
    image: require('../../../../assets/layerToolbar/layer_can_not_edit.png'),
  },
]

const layerSettingCanSnap = language => [
  {
    title: getLanguage(language).Map_Layer.SNAPABLE,
    image: require('../../../../assets/layerToolbar/layer_can_catch.png'),
  },
]

const layerSettingCanNotSnap = language => [
  {
    title: getLanguage(language).Map_Layer.NOT_SNAPABLE,
    image: require('../../../../assets/layerToolbar/layer_can_not_catch.png'),
  },
]

const layer3dDefault = (language, selected) => {
  let data = {
    title: getLanguage(language).Map_Layer.NOT_OPTIONAL,
    image: require('../../../../assets/map/Frenchgrey/icon_selectable_selected.png'),
    type: 'setLayerSelect',
  }
  if (selected === false) {
    data = {
      title: getLanguage(language).Map_Layer.OPTIONAL,
      image: require('../../../../assets/map/Frenchgrey/icon_selectable.png'),
      type: 'setLayerSelect',
    }
  }
  return [
    {
      title: '',
      data: [
        {
          // title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
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
          // title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
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
        //   title: getLanguage(language).Map_Layer.BASEMAP_SWITH,
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
          // title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
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

function layereditsetting(language) {
  return [
    {
      title: '',
      data: [
        {
          title: getLanguage(language).Map_Layer.BASEMAP_SWITH,
          image: require('../../../../assets/mapTools/icon_open_black.png'),
        },
        {
          title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
          //'移除',
          image: require('../../../../assets/layerToolbar/layer_remove.png'),
        },
      ],
    },
  ]
}

function taggingData(language) {
  return [
    {
      title: '',
      data: [
        {
          title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
          //'全副显示图层',
          image: require('../../../../assets/layerToolbar/layer_full.png'),
        },
        {
          title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
          //'设置为当前图层',
          image: getPublicAssets().mapTools.tools_set_current_layer,
        },
        {
          title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
          //'可见比例尺范围',
          image: getPublicAssets().mapTools.tools_visible_scale_range,
        },
      ],
    },
  ]
}

function layerPlottingSetting(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SHARE,
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
function layerNavigationSetting(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SHARE,
        //'分享图层',
        image: require('../../../../assets/function/icon_function_share.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
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
function layerCollectionSetting(language, isGroup = false, layerData) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        //'全副显示图层',
        image: require('../../../../assets/layerToolbar/layer_full.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        //'设置为当前图层',
        image: getPublicAssets().mapTools.tools_set_current_layer,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        //'可见比例尺范围',
        image: getPublicAssets().mapTools.tools_visible_scale_range,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_COLLECT,
        //'当前图层采集',
        image: require('../../../../assets/layerToolbar/icon_function_symbol.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        //'重命名',
        image: getPublicAssets().mapTools.tools_layer_rename,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SHARE,
        //'分享图层',
        image: require('../../../../assets/function/icon_function_share.png'),
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
        //'移除',
        image: require('../../../../assets/layerToolbar/layer_remove.png'),
      },
    ]
    if (layerData) {
      if (
        layerData.themeType > 0 ||
        layerData.isHeatmap ||
        (layerData.type >= 0 &&
          (layerData.type === DatasetType.CAD ||
            layerData.type === DatasetType.IMAGE ||
            layerData.type === DatasetType.MBImage ||
            layerData.type === DatasetType.TEXT ||
            GLOBAL.Type === constants.MAP_PLOTTING))
      ) {
        data.splice(3, 1) // 若当前图层为CAD或者TEXT，则没有'当前图层采集'选项
      }
    }
  }
  return [
    {
      title: '',
      data: data,
    },
  ]
}

function scaleData(language) {
  return [
    {
      title: '',
      data: [
        {
          title: getLanguage(language).Map_Layer.LAYERS_MAXIMUM,
          //'最大可见比例尺',
        },
        {
          title: getLanguage(language).Map_Layer.LAYERS_MINIMUM,
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

async function getVisibleScalePickerData(min, max) {
  let option = [
    {
      key: '1 : 2,500',
      value: 2500,
    },
    {
      key: '1 : 5,000',
      value: 5000,
    },
    {
      key: '1 : 10,000',
      value: 10000,
    },
    {
      key: '1 : 20,000',
      value: 20000,
    },
    {
      key: '1 : 25,000',
      value: 25000,
    },
    {
      key: '1 : 50,000',
      value: 50000,
    },
    {
      key: '1 : 100,000',
      value: 100000,
    },
    {
      key: '1 : 200,000',
      value: 200000,
    },
    {
      key: '1 : 500,000',
      value: 500000,
    },
    {
      key: '1 : 1,000,000',
      value: 1000000,
    },
    {
      key: '1 : 2,000,000',
      value: 2000000,
    },
    {
      key: '1 : 5,000,000',
      value: 5000000,
    },
    {
      key: '1 : 10,000,000',
      value: 10000000,
    },
    {
      key: '1 : 20,000,000',
      value: 20000000,
    },
    {
      key: '1 : 50,000,000',
      value: 50000000,
    },
    {
      key: '1 : 100,000,000',
      value: 100000000,
    },
    {
      key: '1 : 200,000,000',
      value: 200000000,
    },
  ]
  let minOption = option.clone()
  let minInitItem =
    min === 0
      ? { key: '0', value: 0 }
      : { key: '1 : ' + dataUtil.NumberWithThousandSep(min), value: min }
  let n = 0
  for (; n < minOption.length; n++) {
    if (minInitItem.value < minOption[n].value) {
      minOption.splice(n, 0, minInitItem)
      break
    } else if (minInitItem.value === minOption[n].value) {
      minInitItem = minOption[n]
      break
    }
  }
  if (n === minOption.length) {
    minOption.push(minInitItem)
  }
  // if (max !== 0) {
  //   let i = 0
  //   for (; i < minOption.length; i++) {
  //     if (minOption[i].value > max) {
  //       break
  //     }
  //   }
  //   if (i > 0) {
  //     minOption = minOption.slice(i)
  //   }
  // }
  let maxOption = option.clone()
  let maxInitItem =
    max === 0
      ? { key: '0', value: 0 }
      : { key: '1 : ' + dataUtil.NumberWithThousandSep(max), value: max }
  n = 0
  for (; n < maxOption.length; n++) {
    if (maxInitItem.value < maxOption[n].value) {
      maxOption.splice(n, 0, maxInitItem)
      break
    } else if (maxInitItem.value === maxOption[n].value) {
      maxInitItem = maxOption[n]
      break
    }
  }
  if (n === maxOption.length) {
    maxOption.push(maxInitItem)
  }
  // if (min !== 0) {
  //   let i = 0
  //   for (; i < maxOption.length; i++) {
  //     if (maxOption[i].value >= min) {
  //       break
  //     }
  //   }
  //   if (i > 0) {
  //     maxOption = maxOption.slice(0, i)
  //   }
  // }
  let clearOption = {
    key: getLanguage(global.language).Map_Layer.LAYERS_CLEAR,
    value: 0,
  }
  minOption.push(clearOption)
  maxOption.push(clearOption)
  let pickerData = [
    {
      key: getLanguage(global.language).Map_Layer.LAYERS_MINIMUM,
      value: '最小可见比例尺',
      children: minOption,
      initItem: minInitItem,
      selectedItem: minInitItem,
    },
    {
      key: getLanguage(global.language).Map_Layer.LAYERS_MAXIMUM,
      value: '最大可见比例尺',
      children: maxOption,
      initItem: maxInitItem,
      selectedItem: maxInitItem,
    },
  ]
  return pickerData
}

export {
  layersetting,
  layerThemeSetting,
  layerPlottingSetting,
  layerCollectionSetting,
  layerNavigationSetting,
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
  getVisibleScalePickerData,
}
