import { SMap } from 'imobile_for_reactnative'
import ConstOnline from './ConstOnline'
import ToolbarBtnType from '../containers/workspace/components/ToolBar/ToolbarBtnType'
import { ConstToolType } from '../constants'

function OpenData(data, index) {
  (async function() {
    if (GLOBAL.isNewMap) {
      if (GLOBAL.isArrayData) {
        await SMap.removeLayer(0)
      } else {
        await SMap.removeLayer(0)
        await SMap.removeLayer(0)
      }
    }
    if (data instanceof Array) {
      await SMap.openDatasource(data[1].DSParams, index, false)
      await SMap.openDatasource(data[0].DSParams, index, false)
      GLOBAL.isArrayData = false
      GLOBAL.isNewMap = true
    } else {
      await SMap.openDatasource(data.DSParams, index, false)
      GLOBAL.isArrayData = true
      GLOBAL.isNewMap = true
    }
  }.bind(this)())
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
        action: () => {
          OpenData(ConstOnline.Google, 0)
        },
      },
      {
        title: 'Google Staelite',
        action: () => {
          OpenData(ConstOnline.Google, 1)
        },
      },
      {
        title: 'Google Terrain',
        action: () => {
          OpenData(ConstOnline.Google, 2)
        },
      },
      {
        title: 'Google Hybrid',
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
        title: 'OSM Map',
        action: () => {
          OpenData(ConstOnline.OSM, 0)
        },
      },
    ],
  },
  {
    title: 'SuperMapCloud',
    data: [
      {
        title: 'quanguo',
        action: () => {
          OpenData(ConstOnline.SuperMapCloud, 0)
        },
      },
    ],
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
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        containerType: 'symbol',
        isFullScreen: false,
        column: 4,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
  },
  {
    key: '线宽',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
  },
  {
    key: '颜色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.LINECOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
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
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        containerType: 'symbol',
        isFullScreen: false,
        column: 4,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
  },
  {
    key: '大小',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '大小',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
  },
  {
    key: '颜色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.POINTCOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
  },
  {
    key: '旋转角度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '旋转角度',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
  },
  {
    key: '透明度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '透明度',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
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
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
        containerType: 'symbol',
        isFullScreen: false,
        column: 4,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
  },
  {
    key: '前景色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONBEFORECOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
  },
  {
    key: '背景色',
    action: () => {
      GLOBAL.toolBox.menu()
      GLOBAL.toolBox.setState({
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
      GLOBAL.toolBox.setVisible(true, ConstToolType.REGIONAFTERCOLOR_SET, {
        containerType: 'colortable',
        column: 8,
        tableType: 'scroll',
        isFullScreen: false,
        height: ConstToolType.THEME_HEIGHT[3],
      })
    },
  },
  {
    key: '透明度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
  },
  // {
  //   key: '渐变',
  //   action: () => {
  //     GLOBAL.toolBox.setState({
  //       isTouchProgress: true,
  //       isSelectlist: false,
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
        isSelectlist: false,
        selectName: '透明度',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
  },
  {
    key: '对比度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '对比度',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
  },
  {
    key: '亮度',
    action: () => {
      GLOBAL.toolBox.setState({
        isTouchProgress: true,
        isSelectlist: false,
        selectName: '亮度',
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENUS,
          ToolbarBtnType.PLACEHOLDER,
        ],
      })
    },
  },
]
export { layerAdd, BotMap, openData, line, point, region, grid }
