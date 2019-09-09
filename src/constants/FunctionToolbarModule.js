import { SMap, DatasetType } from 'imobile_for_reactnative'
import ConstOnline from './ConstOnline'
import ToolbarBtnType from '../containers/workspace/components/ToolBar/ToolbarBtnType'
import { ConstToolType } from '../constants'
import constants from '../containers/workspace/constants'
import { getLanguage } from '../language/index'
import { Toast } from '../utils'
import * as LayerUtils from '../containers/mtLayerManager/LayerUtils'

async function OpenData(data, index) {
  let layers = await SMap.getLayersByType()
  let isOpen
  if (data instanceof Array) {
    for (let i = data.length - 1; i >= 0; i--) {
      isOpen = await SMap.isDatasourceOpen(data[i].DSParams)
    }
  } else {
    isOpen = await SMap.isDatasourceOpen(data.DSParams)
  }
  // Layer index = 0 为顶层
  if (isOpen) {
    for (let i = 1; i <= GLOBAL.BaseMapSize; i++) {
      if (
        layers.length > 0 &&
        LayerUtils.isBaseLayer(layers[layers.length - i].name)
      ) {
        await SMap.removeLayer(layers.length - i)
      }
    }
    if (data instanceof Array) {
      for (let i = data.length - 1; i >= 0; i--) {
        await SMap.openDatasource(data[i].DSParams, index, false)
      }
      GLOBAL.BaseMapSize = data.length
    } else {
      await SMap.openDatasource(data.DSParams, index, false)
      GLOBAL.BaseMapSize = 1
    }
  } else {
    Toast.show(getLanguage(global.language).Prompt.NETWORK_REQUEST_FAILED)
  }
  return true
}

const layerAdd = [
  {
    title: '选择数据源',
    data: [
      {
        title: '选择目录',
      },
    ],
  },
]

// const BotMap = [
//   {
//     title: 'Google',
//     data: [
//       {
//         title: 'Google RoadMap',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.Google, 0)
//         },
//       },
//       {
//         title: 'Google Satellite',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.Google, 1)
//         },
//       },
//       {
//         title: 'Google Terrain',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.Google, 2)
//         },
//       },
//       {
//         title: 'Google Hybrid',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.Google, 3)
//         },
//       },
//     ],
//   },
//   {
//     title: 'MapWorld',
//     data: [
//       // {
//       //   title: '全球矢量地图（经纬度）',
//       //   action: () => {
//       //     OpenData(ConstOnline.TDJWD,0)
//       //   },
//       // },
//       {
//         title: '全球矢量地图',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.TD, 0)
//         },
//       },
//       // {
//       //   title: '全球影像地图服务（经纬度）',
//       //   action: () => {
//       //     OpenData(ConstOnline.TDYX,0)
//       //   },
//       // },
//       {
//         title: '全球影像地图服务',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.TDYXM, 0)
//         },
//       },
//       // {
//       //   title: '全球地形晕渲地图服务（经纬度）',
//       //   action: () => {
//       //     OpenData(ConstOnline.TDQ,0)
//       //   },
//       // },
//     ],
//   },
//   {
//     title: 'Baidu',
//     data: [
//       {
//         title: 'Baidu Map',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.Baidu, 0)
//         },
//       },
//     ],
//   },
//   {
//     title: 'OSM',
//     data: [
//       {
//         title: 'Standard',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.OSM, 0)
//         },
//       },
//       {
//         title: 'CycleMap',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.OSM, 1)
//         },
//       },
//       {
//         title: 'Transport',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.OSM, 2)
//         },
//       },
//     ],
//   },
//   {
//     title: 'SuperMapCloud',
//     data: [
//       {
//         title: 'quanguo',
//         image: require('../assets/mapToolbar/list_type_map_black.png'),
//         action: () => {
//           OpenData(ConstOnline.SuperMapCloud, 0)
//         },
//       },
//     ],
//   },
// ]

const layerManagerData = [
  {
    title: 'Google RoadMap',
    action: () => {
      return OpenData(ConstOnline.Google, 0)
    },
    data: [],
    image: require('../assets/map/icon-shallow-image_black.png'),
    type: DatasetType.IMAGE,
    themeType: -1,
  },
  {
    title: 'Google Satellite',
    action: () => {
      return OpenData(ConstOnline.Google, 1)
    },
    data: [],
    image: require('../assets/map/icon-shallow-image_black.png'),
    type: DatasetType.IMAGE,
    themeType: -1,
  },
  {
    title: 'Google Terrain',
    action: () => {
      return OpenData(ConstOnline.Google, 2)
    },
    data: [],
    image: require('../assets/map/icon-shallow-image_black.png'),
    type: DatasetType.IMAGE,
    themeType: -1,
  },
  {
    title: 'Google Hybrid',
    action: () => {
      return OpenData(ConstOnline.Google, 3)
    },
    data: [],
    image: require('../assets/map/icon-shallow-image_black.png'),
    type: DatasetType.IMAGE,
    themeType: -1,
  },
  {
    title: 'BingMap',
    action: () => {
      return OpenData(ConstOnline.BingMap, 0)
    },
    data: [],
    image: require('../assets/map/icon-shallow-image_black.png'),
    type: DatasetType.IMAGE,
    themeType: -1,
  },
  // {
  //   title: '全球矢量地图',
  //   action: () => {
  //     return OpenData(ConstOnline.TD, 0)
  //   },
  //   data: [],
  //   image: require('../assets/map/icon-shallow-image_black.png'),
  //   type: DatasetType.IMAGE,
  //   themeType: -1,
  // },
  // {
  //   title: '全球影像地图服务',
  //   action: () => {
  //     return OpenData(ConstOnline.TDYXM, 0)
  //   },
  //   data: [],
  //   image: require('../assets/map/icon-shallow-image_black.png'),
  //   type: DatasetType.IMAGE,
  //   themeType: -1,
  // },
  // {
  //   title: 'Baidu Map',
  //   action: () => {
  //     return OpenData(ConstOnline.Baidu, 0)
  //   },
  //   data: [],
  //   image: require('../assets/map/icon-shallow-image_black.png'),
  //   type: DatasetType.IMAGE,
  //   themeType: -1,
  // },
  // {
  //   title: 'Standard',
  //   action: () => {
  //     return OpenData(ConstOnline.OSM, 0)
  //   },
  //   data: [],
  //   image: require('../assets/map/icon-shallow-image_black.png'),
  //   type: DatasetType.IMAGE,
  //   themeType: -1,
  // },
  // {
  //   title: 'CycleMap',
  //   action: () => {
  //     return OpenData(ConstOnline.OSM, 1)
  //   },
  //   data: [],
  //   image: require('../assets/map/icon-shallow-image_black.png'),
  //   type: DatasetType.IMAGE,
  //   themeType: -1,
  // },
  // {
  //   title: 'Transport',
  //   action: () => {
  //     return OpenData(ConstOnline.OSM, 2)
  //   },
  //   data: [],
  //   image: require('../assets/map/icon-shallow-image_black.png'),
  //   type: DatasetType.IMAGE,
  //   themeType: -1,
  // },
  // {
  //   title: 'quanguo',
  //   action: () => {
  //     return OpenData(ConstOnline.SuperMapCloud, 0)
  //   },
  //   data: [],
  //   image: require('../assets/map/icon-shallow-image_black.png'),
  //   type: DatasetType.IMAGE,
  //   themeType: -1,
  // },
]

// const openData = [
//   {
//     title: '地图',
//     data: [
//       {
//         title: '选择目录',
//       },
//     ],
//   },
// ]

const line = param => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    //'符号线',
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.STYLE_SYMBOL, {
          containerType: 'symbol',
          isFullScreen: false,
          column: 4,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectKey: '符号线',
          selectName: '符号线',
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    //'符号线',
    selectName: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    //'符号线',
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectName: '线宽',
          selectKey: '线宽',
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_LINE_WIDTH,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.LINECOLOR_SET, {
          containerType: 'colortable',
          column: 8,
          tableType: 'scroll',
          isFullScreen: false,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectKey: '线颜色',
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
  },
]

const point = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
          containerType: 'symbol',
          isFullScreen: false,
          column: 4,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectName: '点符号',
          selectKey: '点符号',
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    //'大小',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '大小',
          selectKey: '大小',
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    //'大小',
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    //'大小',
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.POINTCOLOR_SET, {
          containerType: 'colortable',
          column: 8,
          tableType: 'scroll',
          isFullScreen: false,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectName: '颜色',
          selectKey: '点颜色',
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '旋转角度',
          selectKey: '旋转角度',
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '透明度',
          selectKey: '点透明度',
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
  },
]

const region = param => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    //'面符号',
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
          containerType: 'symbol',
          isFullScreen: false,
          column: 4,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectKey: '面符号',
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL,
    //'面符号',
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FOREGROUND,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONBEFORECOLOR_SET, {
          containerType: 'colortable',
          column: 8,
          tableType: 'scroll',
          isFullScreen: false,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectKey: '前景色',
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FOREGROUND,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BACKFROUNG,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONAFTERCOLOR_SET, {
          containerType: 'colortable',
          column: 8,
          tableType: 'scroll',
          isFullScreen: false,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectKey: '背景色',
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_BACKFROUNG,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectName: '透明度',
          selectKey: '面透明度',
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
  },
  // {
  //   key: '渐变',
  //   action: () => {
  //     GLOBAL.toolBox && GLOBAL.toolBox.setState({
  //       isTouchProgress: true,
  //       showMenuDialog: false,
  //       buttons: [
  //         ToolbarBtnType.CANCEL,
  //         ToolbarBtnType.MENUS,
  //         ToolbarBtnType.PLACEHOLDER,
  //       ],
  //     })
  //   },
  // },
]

const grid = param => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_TRANSPARENCY,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '透明度',
          selectKey: '栅格透明度',
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectKey: '栅格透明度',
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '对比度',
          selectKey: '栅格对比度',
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectKey: '栅格对比度',
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '亮度',
          selectKey: '栅格亮度',
          buttons: [
            ToolbarBtnType.CANCEL,
            // ToolbarBtnType.MENUS,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectKey: '栅格亮度',
  },
]

//单值
const uniqueMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getUniqueColorScheme(
          ConstToolType.MAP_THEME_PARAM_UNIQUE_COLOR,
          '颜色方案',
        )
    },
  },
]

//分段
const rangeMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_METHOD,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_METHOD,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_METHOD,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getRangeMode(
          ConstToolType.MAP_THEME_PARAM_RANGE_MODE,
          '分段方法',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    //'分段个数',
    selectKey: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    //'分段个数',
    btntitle: getLanguage(param).Map_Main_Menu.RANGE_COUNT,
    //'分段个数',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getRangeParameter(
          ConstToolType.MAP_THEME_PARAM_RANGE_PARAM,
          '分段个数',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getRangeColorScheme(
          ConstToolType.MAP_THEME_PARAM_RANGE_COLOR,
          '颜色方案',
        )
    },
  },
]

//统一标签
const labelMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_BACK_SHAPE,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_BACK_SHAPE,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_BACK_SHAPE,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getLabelBackShape(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE,
          '背景形状',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BACKFROUNG,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_BACKFROUNG,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_BACKFROUNG,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getColorTable(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE_COLOR,
          '背景颜色',
        )
    },
  },
  // {
  //   key: '字体',
  //   btntitle: '字体',
  //   action: () => {
  //     this.setSelectedMenu('字体')
  //     this.setDialogVisible(false)

  //     const toolRef = this.props.getToolBarRef()
  //     if (toolRef) {
  //       toolRef.getLabelFontName(
  //         ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTNAME,
  //       )
  //     }
  //   },
  // },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_FONT_SIZE,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getLabelFontSize(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE,
          '字号',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_ROTATION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getLabelFontRotation(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_ROTATION,
          '旋转角度',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getColorTable(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR,
          '颜色',
        )
    },
  },
]

//单值标签
const uniqueLabelMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_UNIQUE_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_UNIQUE_EXPRESSION,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_UNIQUE_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_EXPRESSION,
          '单值表达式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getUniqueColorScheme(
          ConstToolType.MAP_THEME_PARAM_UNIQUELABEL_COLOR,
          '颜色方案',
        )
    },
  },
]

//分段标签
const rangeLabelMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_RANGE_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_RANGE_EXPRESSION,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_RANGE_EXPRESSION,
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_RANGELABEL_EXPRESSION,
          '单值表达式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getRangeColorScheme(
          ConstToolType.MAP_THEME_PARAM_RANGELABEL_COLOR,
          '颜色方案',
        )
    },
  },
]

//统计专题图
const graphMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getGraphThemeExpressions(
          ConstToolType.MAP_THEME_PARAM_GRAPH_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_GRANDUATE_BY,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_GRANDUATE_BY,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_GRANDUATE_BY,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getGraphThemeGradutedMode(
          ConstToolType.MAP_THEME_PARAM_GRAPH_GRADUATEDMODE,
          '计算方法',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getGraphThemeColorScheme(
          ConstToolType.MAP_THEME_PARAM_GRAPH_COLOR,
          '颜色方案',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_MAX_VISIBLE_SIZE,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getGraphMaxValue(
          ConstToolType.MAP_THEME_PARAM_GRAPH_MAXVALUE,
          '最大显示值',
          '最大显示值',
        )
    },
  },
]

//修改点密度专题图：设置点密度图的表达式，单点代表的值，点风格（大小和颜色）。
const dotDensityMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    //'',
    selectKey: '表达式',
    //getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.DOT_VALUE,
    //'单点代表值',
    selectKey: '单点代表值',
    //getLanguage(param).Map_Main_Menu.DOT_VALUE,
    //'单点代表值',
    btntitle: getLanguage(param).Map_Main_Menu.DOT_VALUE,
    //'单点代表值',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getDotDensityValueAndDotsize(
          ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_VALUE,
          '单点代表值',
          //'单点代表值',
          '单点代表值',
          //'单点代表值',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    selectKey: '点符号',
    //getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(
          true,
          ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS,
          {
            containerType: 'symbol',
            isFullScreen: false,
            column: 4,
            height: ConstToolType.THEME_HEIGHT[3],
            buttons: [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.MENU,
              ToolbarBtnType.MENU_FLEX,
              ToolbarBtnType.MENU_COMMIT,
            ],
            selectName: '点符号',
            selectKey: '点符号',
            themeType: constants.THEME_DOT_DENSITY,
            themeSymbolType: ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_SYMBOLS,
          },
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    selectKey: '符号大小',
    //getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getDotDensityValueAndDotsize(
          ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_SIZE,
          '符号大小',
          '符号大小',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    selectKey: '点颜色',
    // getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_COLOR,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getColorTable(
          ConstToolType.MAP_THEME_PARAM_DOT_DENSITY_COLOR,
          '点颜色',
          '点颜色',
        )
    },
  },
]

//修改等级符号专题图：设置表达式，分级方式，基准值，正值基准值风格（大小和颜色）。
const graduatedSymbolMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_EXPRESSION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.GRADUATE_BY,
    //'分级方式',
    selectKey: getLanguage(param).Map_Main_Menu.GRADUATE_BY,
    //'分级方式',
    btntitle: getLanguage(param).Map_Main_Menu.GRADUATE_BY,
    //'分级方式',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getGraduatedSymbolGradutedMode(
          ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_GRADUATEDMODE,
          '分级方式',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.DATUM_VALUE,
    //'基准值',
    selectKey: getLanguage(param).Map_Main_Menu.DATUM_VALUE,
    //'基准值',
    btntitle: getLanguage(param).Map_Main_Menu.DATUM_VALUE,
    //'基准值',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getGraduatedSymbolBaseValueAndSymbolSize(
          ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_VALUE,
          '基准值',
          '基准值',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    btntitle: getLanguage(param).Map_Main_Menu.THEME_MARKER_SYMBOL,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(
          true,
          ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOLS,
          {
            containerType: 'symbol',
            isFullScreen: false,
            column: 4,
            height: ConstToolType.THEME_HEIGHT[3],
            buttons: [
              ToolbarBtnType.CANCEL,
              ToolbarBtnType.MENU,
              ToolbarBtnType.MENU_FLEX,
              ToolbarBtnType.MENU_COMMIT,
            ],
            selectName: '点符号',
            selectKey: '点符号',
            themeType: constants.THEME_GRADUATED_SYMBOL,
            themeSymbolType: ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOLS,
          },
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    btntitle: getLanguage(param).Map_Main_Menu.STYLE_SYMBOL_SIZE,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getGraduatedSymbolBaseValueAndSymbolSize(
          ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_SIZE,
          '符号大小',
          '符号大小',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_COLOR,
    //'符号颜色',
    selectKey: getLanguage(param).Map_Main_Menu.THEME_COLOR,
    //'符号颜色',
    btntitle: getLanguage(param).Map_Main_Menu.THEME_COLOR,
    //'符号颜色',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getColorTable(
          ConstToolType.MAP_THEME_PARAM_GRADUATED_SYMBOL_COLOR,
          '符号颜色',
          '符号颜色',
        )
    },
  },
]

//栅格单值专题图
const gridUniqueMenuInfo = param => [
  {
    key: '颜色方案',
    selectKey: '颜色方案',
    btntitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getUniqueColorScheme(
          ConstToolType.MAP_THEME_PARAM_GRID_UNIQUE_COLOR,
          '颜色方案',
          '颜色方案',
        )
    },
  },
  // {
  //   key: '缺省风格',
  //   selectKey: '缺省风格',
  //   btntitle: '缺省风格',
  //   action: () => {
  //     GLOBAL.toolBox &&
  //     GLOBAL.toolBox.getColorTable(
  //       ConstToolType.MAP_THEME_PARAM_GRID_UNIQUE_DEFAULT_COLOR,
  //       '缺省风格',
  //       '缺省风格',
  //     )
  //   },
  // },
]

//栅格分段专题图（分段方法有缺陷，只有等距分段有用，先注释掉）
const gridRangeMenuInfo = param => [
  // {
  //   key: '分段方法',
  //   selectKey: '分段方法',
  //   btntitle: '分段方法',
  //   action: () => {
  //     GLOBAL.toolBox &&
  //     GLOBAL.toolBox.getGridRangeMode(
  //       ConstToolType.MAP_THEME_PARAM_GRID_RANGE_RANGEMODE,
  //       '分段方法',
  //       '分段方法',
  //     )
  //   },
  // },
  {
    key: '分段个数',
    selectKey: '分段个数',
    btntitle: '分段个数',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getRangeParameter(
          ConstToolType.MAP_THEME_PARAM_GRID_RANGE_RANGECOUNT,
          '分段个数',
          '分段个数',
        )
    },
  },
  {
    key: '颜色方案',
    selectKey: '颜色方案',
    btntitle: getLanguage(param).Map_Main_Menu.THEME_COLOR_SCHEME,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getRangeColorScheme(
          ConstToolType.MAP_THEME_PARAM_GRID_RANGE_COLOR,
          '颜色方案',
          '颜色方案',
        )
    },
  },
]

//热力图
const heatmapMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_RADIUS,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_RADIUS,
    // btntitle: '核半径',
    btntitle: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_RADIUS,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getHeatmapParams(
          ConstToolType.MAP_THEME_PARAM_HEAT_AGGREGATION_RADIUS,
          '核半径',
          '核半径',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_COLOR,
    // btntitle: '颜色方案',
    btntitle: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_COLOR,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getAggregationColorScheme(
          ConstToolType.MAP_THEME_PARAM_HEAT_AGGREGATION_COLOR,
          '颜色方案',
          '颜色方案',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_FUZZY_DEGREE,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_FUZZY_DEGREE,
    // btntitle: '颜色渐变模糊度',
    btntitle: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_FUZZY_DEGREE,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getHeatmapParams(
          ConstToolType.MAP_THEME_PARAM_HEAT_AGGREGATION_FUZZYDEGREE,
          '颜色渐变模糊度',
          '颜色渐变模糊度',
        )
    },
  },
  {
    key: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_MAXCOLOR_WEIGHT,
    selectKey: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_MAXCOLOR_WEIGHT,
    // btntitle: '最大颜色权重',
    btntitle: getLanguage(param).Map_Main_Menu.THEME_HEATMAP_MAXCOLOR_WEIGHT,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getHeatmapParams(
          ConstToolType.MAP_THEME_PARAM_HEAT_AGGREGATION_MAXCOLOR_WEIGHT,
          '最大颜色权重',
          '最大颜色权重',
        )
    },
  },
]

//图例菜单 可见
const legendMenuInfo = param => [
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
          containerType: 'colortable',
          column: 8,
          tableType: 'scroll',
          isFullScreen: false,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectName: '填充色',
          selectKey: '填充色',
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    //'列数',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '列数',
          selectKey: '列数',
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    //'列数',
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    //'列数',
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    //'宽度',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '宽度',
          selectKey: '宽度',
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    //'宽度',
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    //'宽度',
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    //'高度',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '高度',
          selectKey: '高度',
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    //'高度',
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    //'高度',
  },
]

//图例菜单 不可见
const legendMenuInfoNotVisible = param => [
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    action: () => {
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
          containerType: 'colortable',
          column: 8,
          tableType: 'scroll',
          isFullScreen: false,
          height: ConstToolType.THEME_HEIGHT[3],
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
          selectName: '填充色',
          selectKey: '填充色',
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    //'列数',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '列数',
          selectKey: '列数',
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    //'列数',
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    //'列数',
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    //'宽度',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '宽度',
          selectKey: '宽度',
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    //'宽度',
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    //'宽度',
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    //'高度',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: '高度',
          selectKey: '高度',
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    //'高度',
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    //'高度',
  },
]

//智能配图
const smartCartography = param => [
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.SMART_CARTOGRAPHY,
            ToolbarBtnType.SMART_CARTOGRAPHY_PICKER,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
  },
  {
    key: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
          selectKey: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.SMART_CARTOGRAPHY,
            ToolbarBtnType.SMART_CARTOGRAPHY_PICKER,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
  },
  {
    key: getLanguage(param).Map_Main_Menu.SATURATION,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.SATURATION,
          selectKey: getLanguage(param).Map_Main_Menu.SATURATION,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.SMART_CARTOGRAPHY,
            ToolbarBtnType.SMART_CARTOGRAPHY_PICKER,
            ToolbarBtnType.MENU_COMMIT,
          ],
        })
    },
    selectKey: getLanguage(param).Map_Main_Menu.SATURATION,
  },
]
export {
  layerAdd,
  // BotMap,
  layerManagerData,
  OpenData,
  line,
  point,
  region,
  grid,
  uniqueMenuInfo,
  rangeMenuInfo,
  labelMenuInfo,
  uniqueLabelMenuInfo,
  rangeLabelMenuInfo,
  graphMenuInfo,
  dotDensityMenuInfo,
  graduatedSymbolMenuInfo,
  gridUniqueMenuInfo,
  gridRangeMenuInfo,
  legendMenuInfo,
  legendMenuInfoNotVisible,
  heatmapMenuInfo,
  smartCartography,
}
