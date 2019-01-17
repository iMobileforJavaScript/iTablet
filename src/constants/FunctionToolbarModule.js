import { SMap } from 'imobile_for_reactnative'
import ConstOnline from './ConstOnline'
import ToolbarBtnType from '../containers/workspace/components/ToolBar/ToolbarBtnType'
import { ConstToolType } from '../constants'

async function OpenData(data, index) {
  let layers = await SMap.getLayersByType()
  // Layer index = 0 为顶层
  for (let i = 1; i <= GLOBAL.BaseMapSize; i++) {
    await SMap.removeLayer(layers.length - i)
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

const BotMap = [
  {
    title: 'Google',
    data: [
      {
        title: 'Google RoadMap',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.Google, 0)
        },
      },
      {
        title: 'Google Staelite',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.Google, 1)
        },
      },
      {
        title: 'Google Terrain',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.Google, 2)
        },
      },
      {
        title: 'Google Hybrid',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.Google, 3)
        },
      },
    ],
  },
  {
    title: 'MapWorld',
    data: [
      // {
      //   title: '全球矢量地图（经纬度）',
      //   action: () => {
      //     OpenData(ConstOnline.TDJWD,0)
      //   },
      // },
      {
        title: '全球矢量地图',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.TD, 0)
        },
      },
      // {
      //   title: '全球影像地图服务（经纬度）',
      //   action: () => {
      //     OpenData(ConstOnline.TDYX,0)
      //   },
      // },
      {
        title: '全球影像地图服务',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.TDYXM, 0)
        },
      },
      // {
      //   title: '全球地形晕渲地图服务（经纬度）',
      //   action: () => {
      //     OpenData(ConstOnline.TDQ,0)
      //   },
      // },
    ],
  },
  {
    title: 'Baidu',
    data: [
      {
        title: 'Baidu Map',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.Baidu, 0)
        },
      },
    ],
  },
  {
    title: 'OSM',
    data: [
      {
        title: 'Standard',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.OSM, 0)
        },
      },
      {
        title: 'CycleMap',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.OSM, 1)
        },
      },
      {
        title: 'Transport',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.OSM, 2)
        },
      },
    ],
  },
  {
    title: 'SuperMapCloud',
    data: [
      {
        title: 'quanguo',
        image: require('../assets/mapToolbar/list_type_map.png'),
        action: () => {
          OpenData(ConstOnline.SuperMapCloud, 0)
        },
      },
    ],
  },
]

const layerManagerData = [
  {
    caption: 'Google RoadMap',
    action: () => {
      return OpenData(ConstOnline.Google, 0)
    },
  },
  {
    caption: 'Google Staelite',
    action: () => {
      return OpenData(ConstOnline.Google, 1)
    },
  },
  {
    caption: 'Google Terrain',
    action: () => {
      return OpenData(ConstOnline.Google, 2)
    },
  },
  {
    caption: 'Google Hybrid',
    action: () => {
      return OpenData(ConstOnline.Google, 3)
    },
  },
  {
    caption: '全球矢量地图',
    action: () => {
      return OpenData(ConstOnline.TD, 0)
    },
  },
  {
    caption: '全球影像地图服务',
    action: () => {
      return OpenData(ConstOnline.TDYXM, 0)
    },
  },
  {
    caption: 'Baidu Map',
    action: () => {
      return OpenData(ConstOnline.Baidu, 0)
    },
  },
  {
    caption: 'Standard',
    action: () => {
      return OpenData(ConstOnline.OSM, 0)
    },
  },
  {
    caption: 'CycleMap',
    action: () => {
      return OpenData(ConstOnline.OSM, 1)
    },
  },
  {
    caption: 'Transport',
    action: () => {
      return OpenData(ConstOnline.OSM, 2)
    },
  },
  {
    caption: 'quanguo',
    action: () => {
      return OpenData(ConstOnline.SuperMapCloud, 0)
    },
  },
]

const openData = [
  {
    title: '地图',
    data: [
      {
        title: '选择目录',
      },
    ],
  },
]

const line = [
  {
    key: '符号线',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '符号线',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        containerType: 'symbol',
        isFullScreen: false,
        column: 4,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '符号线',
  },
  {
    key: '线宽',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        showMenuDialog: false,
        buttons: [
          ToolbarBtnType.CANCEL,
          // ToolbarBtnType.MENUS,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
        selectName: '线宽',
        selectKey: '线宽',
      })
    },
    selectKey: '线宽',
  },
  {
    key: '颜色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '线颜色',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.LINECOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '线颜色',
  },
]

const point = [
  {
    key: '点符号',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '点符号',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        containerType: 'symbol',
        isFullScreen: false,
        column: 4,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '点符号',
  },
  {
    key: '大小',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        showMenuDialog: false,
        selectName: '大小',
        selectKey: '大小',
        buttons: [
          ToolbarBtnType.CANCEL,
          // ToolbarBtnType.MENUS,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '大小',
  },
  {
    key: '颜色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '点颜色',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.POINTCOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '点颜色',
  },
  {
    key: '旋转角度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        showMenuDialog: false,
        selectName: '旋转角度',
        selectKey: '旋转角度',
        buttons: [
          ToolbarBtnType.CANCEL,
          // ToolbarBtnType.MENUS,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '旋转角度',
  },
  {
    key: '透明度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        showMenuDialog: false,
        selectName: '透明度',
        selectKey: '点透明度',
        buttons: [
          ToolbarBtnType.CANCEL,
          // ToolbarBtnType.MENUS,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '点透明度',
  },
]

const region = [
  {
    key: '面符号',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '面符号',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        containerType: 'symbol',
        isFullScreen: false,
        column: 4,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '面符号',
  },
  {
    key: '前景色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '前景色',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONBEFORECOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '前景色',
  },
  {
    key: '背景色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.FLEX,
        ],
        selectKey: '背景色',
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONAFTERCOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
    selectKey: '背景色',
  },
  {
    key: '透明度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        showMenuDialog: false,
        buttons: [
          ToolbarBtnType.CANCEL,
          // ToolbarBtnType.MENUS,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
        selectName: '透明度',
        selectKey: '面透明度',
      })
    },
    selectKey: '面透明度',
  },
  // {
  //   key: '渐变',
  //   action: () => {
  //     GLOBAL.toolBox.setState({
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

const grid = [
  {
    key: '透明度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        showMenuDialog: false,
        selectName: '透明度',
        selectKey: '栅格透明度',
        buttons: [
          ToolbarBtnType.CANCEL,
          // ToolbarBtnType.MENUS,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '栅格透明度',
  },
  {
    key: '对比度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        showMenuDialog: false,
        selectName: '对比度',
        selectKey: '栅格对比度',
        buttons: [
          ToolbarBtnType.CANCEL,
          // ToolbarBtnType.MENUS,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '栅格对比度',
  },
  {
    key: '亮度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        showMenuDialog: false,
        selectName: '亮度',
        selectKey: '栅格亮度',
        buttons: [
          ToolbarBtnType.CANCEL,
          // ToolbarBtnType.MENUS,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
    selectKey: '栅格亮度',
  },
]

//单值
const uniqueMenuInfo = [
  {
    key: '表达式',
    selectKey: '表达式',
    btntitle: '表达式',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_UNIQUE_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: '颜色方案',
    selectKey: '颜色方案',
    btntitle: '颜色方案',
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
const rangeMenuInfo = [
  {
    key: '表达式',
    selectKey: '表达式',
    btntitle: '表达式',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_RANGE_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: '分段方法',
    selectKey: '分段方法',
    btntitle: '分段方法',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getRangeMode(
          ConstToolType.MAP_THEME_PARAM_RANGE_MODE,
          '分段方法',
        )
    },
  },
  {
    key: '分段个数',
    selectKey: '分段个数',
    btntitle: '分段个数',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getRangeParameter(
          ConstToolType.MAP_THEME_PARAM_RANGE_PARAM,
          '分段个数',
        )
    },
  },
  {
    key: '颜色方案',
    selectKey: '颜色方案',
    btntitle: '颜色方案',
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
const labelMenuInfo = [
  {
    key: '表达式',
    selectKey: '表达式',
    btntitle: '表达式',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getThemeExpress(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_EXPRESSION,
          '表达式',
        )
    },
  },
  {
    key: '背景形状',
    selectKey: '背景形状',
    btntitle: '背景形状',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getLabelBackShape(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_BACKSHAPE,
          '背景形状',
        )
    },
  },
  {
    key: '背景颜色',
    selectKey: '背景颜色',
    btntitle: '背景颜色',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getLabelBackColor(
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
    key: '字号',
    selectKey: '字号',
    btntitle: '字号',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getLabelFontSize(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FONTSIZE,
          '字号',
        )
    },
  },
  {
    key: '旋转角度',
    selectKey: '旋转角度',
    btntitle: '旋转角度',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getLabelFontRotation(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_ROTATION,
          '旋转角度',
        )
    },
  },
  {
    key: '颜色',
    selectKey: '颜色',
    btntitle: '颜色',
    action: () => {
      GLOBAL.toolBox &&
        GLOBAL.toolBox.getLabelFontColor(
          ConstToolType.MAP_THEME_PARAM_UNIFORMLABEL_FORECOLOR,
          '颜色',
        )
    },
  },
]

export {
  layerAdd,
  BotMap,
  layerManagerData,
  openData,
  line,
  point,
  region,
  grid,
  uniqueMenuInfo,
  rangeMenuInfo,
  labelMenuInfo,
}
