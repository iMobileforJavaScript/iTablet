import { SMap, DatasetType } from 'imobile_for_reactnative'
import ConstOnline from './ConstOnline'
import ToolbarBtnType from '../containers/workspace/components/ToolBar/ToolbarBtnType'
import { ConstToolType, ToolbarType } from '../constants'
import { getLanguage } from '../language/index'
import { Toast, LayerUtils } from '../utils'

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

//图例菜单 可见
const legendMenuInfo = (param, orientation) => [
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    action: () => {
      let height, column
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 16
      }
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
          containerType: ToolbarType.colorTable,
          column,
          isFullScreen: false,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
  },
]

//图例菜单 不可见
const legendMenuInfoNotVisible = (param, orientation) => [
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    action: () => {
      let column, height
      if (orientation === 'PORTRAIT') {
        height = ConstToolType.THEME_HEIGHT[3]
        column = 8
      } else {
        height = ConstToolType.THEME_HEIGHT[2]
        column = 16
      }
      GLOBAL.toolBox && GLOBAL.toolBox.menu()
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setVisible(true, ConstToolType.LEGEND, {
          containerType: ToolbarType.colorTable,
          column,
          isFullScreen: false,
          height,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLOR,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_COLUMN,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_WIDTH,
  },
  {
    key: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.setState({
          isTouchProgress: true,
          showMenuDialog: false,
          selectName: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
          selectKey: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
          buttons: [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ],
        })
    },
    selectName: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
    selectKey: getLanguage(param).Map_Main_Menu.LEGEND_HEIGHT,
  },
]

//智能配图
// const smartCartography = param => [
//   {
//     key: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
//     action: () => {
//       GLOBAL.toolBox &&
//         GLOBAL.toolBox.setState({
//           isTouchProgress: true,
//           showMenuDialog: false,
//           selectName: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
//           selectKey: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
//           buttons: [
//             ToolbarBtnType.CANCEL,
//             ToolbarBtnType.STYLE_TRANSFER,
//             ToolbarBtnType.MENU_FLEX,
//             ToolbarBtnType.TOOLBAR_COMMIT,
//           ],
//         })
//     },
//     selectKey: getLanguage(param).Map_Main_Menu.STYLE_BRIGHTNESS,
//   },
//   {
//     key: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
//     action: () => {
//       GLOBAL.toolBox &&
//         GLOBAL.toolBox.setState({
//           isTouchProgress: true,
//           showMenuDialog: false,
//           selectName: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
//           selectKey: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
//           buttons: [
//             ToolbarBtnType.CANCEL,
//             ToolbarBtnType.STYLE_TRANSFER,
//             ToolbarBtnType.MENU_FLEX,
//             ToolbarBtnType.TOOLBAR_COMMIT,
//           ],
//         })
//     },
//     selectKey: getLanguage(param).Map_Main_Menu.STYLE_CONTRAST,
//   },
//   {
//     key: getLanguage(param).Map_Main_Menu.SATURATION,
//     action: () => {
//       GLOBAL.toolBox &&
//         GLOBAL.toolBox.setState({
//           isTouchProgress: true,
//           showMenuDialog: false,
//           selectName: getLanguage(param).Map_Main_Menu.SATURATION,
//           selectKey: getLanguage(param).Map_Main_Menu.SATURATION,
//           buttons: [
//             ToolbarBtnType.CANCEL,
//             ToolbarBtnType.STYLE_TRANSFER,
//             ToolbarBtnType.MENU_FLEX,
//             ToolbarBtnType.TOOLBAR_COMMIT,
//           ],
//         })
//     },
//     selectKey: getLanguage(param).Map_Main_Menu.SATURATION,
//   },
// ]
export {
  layerAdd,
  // BotMap,
  layerManagerData,
  OpenData,
  legendMenuInfo,
  legendMenuInfoNotVisible,
  // smartCartography,
}
