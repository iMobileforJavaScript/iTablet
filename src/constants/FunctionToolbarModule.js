import { SMap } from 'imobile_for_reactnative'
import ConstOnline from './ConstOnline'
import ToolbarBtnType from '../containers/workspace/componets/ToolBar/ToolbarBtnType'
import { ConstToolType } from '../constants'

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
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Google'].DSParams, 0)
          }.bind(this)())
        },
      },
      {
        title: 'Google Staelite',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Google'].DSParams, 1)
          }.bind(this)())
        },
      },
      {
        title: 'Google Terrain',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Google'].DSParams, 2)
          }.bind(this)())
        },
      },
      {
        title: 'Google Hybrid',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Google'].DSParams, 3)
          }.bind(this)())
        },
      },
    ],
  },
  {
    title: 'MapWorld',
    data: [
      {
        title: '全球矢量地图（经纬度）',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TDJWD'].DSParams, 0)
            await SMap.openDatasource(ConstOnline['TDJWD'].labelDSParams, 0)
          }.bind(this)())
        },
      },
      {
        title: '全球矢量地图（墨卡托）',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TD'].DSParams, 0)
            await SMap.openDatasource(ConstOnline['TD'].labelDSParams, 0)
          }.bind(this)())
        },
      },
      {
        title: '全球影像地图服务（经纬度）',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TDYX'].DSParams, 0)
          }.bind(this)())
        },
      },
      {
        title: '全球影像地图服务（墨卡托）',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TDYXM'].DSParams, 0)
          }.bind(this)())
        },
      },
      {
        title: '全球地形晕渲地图服务（经纬度）',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['TDQ'].DSParams, 0)
          }.bind(this)())
        },
      },
    ],
  },
  {
    title: 'Baidu',
    data: [
      {
        title: 'Baidu Map',
        action: () => {
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['Baidu'].DSParams, 0)
          }.bind(this)())
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
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['OSM'].DSParams, 0)
          }.bind(this)())
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
          (async function() {
            await SMap.closeMap()
            await SMap.openDatasource(ConstOnline['SuperMapCloud'].DSParams, 0)
          }.bind(this)())
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
