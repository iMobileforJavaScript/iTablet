import NavigationService from '../containers/NavigationService'
import constants from '../containers/workspace/constants'
import { FileTools } from '../native'
import ConstToolType from './ConstToolType'
import ConstOnline from './ConstOnline'
import { ConstPath } from '../constants'
import { scaleSize } from '../utils'

const MAP_MODULE = {
  MAP_EDIT: '地图制图',
  MAP_3D: '三维场景',
  MAP_THEME: '专题制图',
  MAP_COLLECTION: '外业采集',
}

export { MAP_MODULE }

export default [
  {
    key: '地图制图',
    title: '地图制图',
    baseImage: require('../assets/home/left_top_free.png'),
    moduleImage: require('../assets/home/icon_cartography.png'),
    style: {
      width: scaleSize(60),
      height: scaleSize(60),
      position: 'absolute',
      top: 0,
      left: 0,
    },
    action: async user => {
      let data = ConstOnline['Google']
      GLOBAL.Type = constants.MAP_EDIT
      GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1
      GLOBAL.showMenu = true
      GLOBAL.showFlex = true
      const customerPath =
        ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace
      // let exist = await FileTools.fileIsExistInHomeDirectory(customerPath)
      let wsPath
      if (user.userName) {
        const userWSPath =
          ConstPath.UserPath +
          user.userName +
          '/' +
          ConstPath.RelativeFilePath.Workspace
        wsPath = await FileTools.appendingHomeDirectory(userWSPath)
      } else {
        wsPath = await FileTools.appendingHomeDirectory(customerPath)
      }
      NavigationService.navigate('MapView', {
        operationType: constants.MAP_EDIT,
        wsData: [
          {
            DSParams: { server: wsPath },
            type: 'Workspace',
          },
          data,
        ],
        mapName: '地图制图',
        isExample: false,
      })
    },
  },
  {
    key: '三维场景',
    title: '三维场景',
    baseImage: require('../assets/home/right_bottom_free.png'),
    moduleImage: require('../assets/home/icon_map3D.png'),
    style: {
      width: scaleSize(60),
      height: scaleSize(60),
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    action: () => {
      GLOBAL.Type = ConstToolType.MAP_3D
      // let customerPath
      // let default3DDataPath
      // if (Platform.OS === 'android') {
      //   default3DDataPath = 'OlympicGreen_android/OlympicGreen_android.sxwu'
      // } else {
      //   default3DDataPath = 'OlympicGreen_ios/OlympicGreen_ios.sxwu'
      // }
      // customerPath =
      //   ConstPath.CustomerPath +
      //   ConstPath.RelativeFilePath.Scene +
      //   default3DDataPath

      // let ssPath = await FileTools.appendingHomeDirectory(customerPath)
      // if (user.userName) {
      //   const userWSPath =
      //     ConstPath.UserPath +
      //     user.userName +
      //     '/' +
      //     ConstPath.RelativeFilePath.Scene +
      //     default3DDataPath
      //   ssPath = await FileTools.appendingHomeDirectory(userWSPath)
      // } else {
      //   ssPath = await FileTools.appendingHomeDirectory(customerPath)
      // }
      NavigationService.navigate('Map3D', {})
    },
  },
  // {
  //   key: 'AR地图',
  //   title: 'AR地图',
  //   baseImage: require('../assets/home/icon_lefttop_vip.png'),
  //   moduleImage: require('../assets/home/icon_ARmap.png'),
  // },
  // {
  //   key: '导航地图',
  //   title: '导航地图',
  //   baseImage: require('../assets/home/icon_rightbottom_vip.png'),
  //   moduleImage: require('../assets/home/icon_navigation.png'),
  //   action: () => {
  //     // NavigationService.navigate('MapView', { // 若未登录，则打开游客工作空间
  //     //   wsData: ConstOnline['Baidu'],
  //     //   isExample: false,
  //     // })
  //   },
  // },
  {
    key: '专题地图',
    title: '专题地图',
    baseImage: require('../assets/home/left_top_vip.png'),
    moduleImage: require('../assets/home/icon_thematicmap.png'),
    style: {
      width: scaleSize(60),
      height: scaleSize(60),
      position: 'absolute',
      top: 0,
      left: 0,
    },
    action: async user => {
      let data = ConstOnline['Google']
      GLOBAL.Type = constants.MAP_THEME
      GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1
      const customerPath =
        ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace
      let wsPath
      if (user.userName) {
        const userWSPath =
          ConstPath.UserPath +
          user.userName +
          '/' +
          ConstPath.RelativeFilePath.Workspace
        wsPath = await FileTools.appendingHomeDirectory(userWSPath)
      } else {
        wsPath = await FileTools.appendingHomeDirectory(customerPath)
      }
      NavigationService.navigate('MapView', {
        operationType: constants.MAP_THEME,
        wsData: [
          {
            DSParams: { server: wsPath },
            type: 'Workspace',
          },
          data,
        ],
        mapName: '专题制图',
        isExample: false,
      })
    },
  },
  {
    key: '外业采集',
    title: '外业采集',
    baseImage: require('../assets/home/right_bottom_vip.png'),
    moduleImage: require('../assets/home/icon_collection.png'),
    style: {
      width: scaleSize(60),
      height: scaleSize(60),
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    action: async user => {
      let data = ConstOnline['Google']
      GLOBAL.Type = constants.COLLECTION
      GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1
      const customerPath =
        ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace
      // let exist = await FileTools.fileIsExistInHomeDirectory(customerPath)
      // let wsPath
      // const customerPath =
      //   ConstPath.LocalDataPath + 'IndoorNavigationData/beijing.smwu'
      let wsPath = await FileTools.appendingHomeDirectory(customerPath)
      // let exist = await FileTools.fileIsExistInHomeDirectory(customerPath)
      if (user.userName) {
        const userWSPath =
          ConstPath.UserPath +
          user.userName +
          '/' +
          ConstPath.RelativeFilePath.Workspace
        wsPath = await FileTools.appendingHomeDirectory(userWSPath)
      } else {
        wsPath = await FileTools.appendingHomeDirectory(customerPath)
      }
      NavigationService.navigate('MapView', {
        // 若未登录，则打开游客工作空间
        wsData: [
          {
            DSParams: { server: wsPath },
            // layerIndex: 0,
            type: 'Workspace',
          },
          data,
        ],
        mapName: '外业采集',
        isExample: false,
      })
    },
  },
  // {
  //   key: '应急标绘',
  //   title: '应急标绘',
  //   baseImage: require('../assets/home/icon_lefttop_vip.png'),
  //   moduleImage: require('../assets/home/icon_plot.png'),
  // },
  // {
  //   key: '数据分析',
  //   title: '数据分析',
  //   baseImage: require('../assets/home/icon_rightbottom_vip.png'),
  //   moduleImage: require('../assets/home/icon_mapanalysis.png'),
  // },
]
