import NavigationService from '../containers/NavigationService'
import { Platform } from 'react-native'
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
    baseImage: require('../assets/home/Frenchgrey/left_top_free.png'),
    moduleImage: require('../assets/home/Frenchgrey/icon_cartography.png'),
    style: {
      width: scaleSize(60),
      height: scaleSize(60),
      position: 'absolute',
      top: 0,
      left: 0,
    },
    action: async (user, lastMap) => {
      let data = ConstOnline['Google']
      GLOBAL.Type = constants.MAP_EDIT
      GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1
      GLOBAL.showMenu = true
      // GLOBAL.showFlex = true

      let homePath = await FileTools.appendingHomeDirectory()
      let userPath = ConstPath.CustomerPath
      if (user && user.userName) {
        userPath = ConstPath.UserPath + user.userName + '/'
      }
      let wsPath = homePath + userPath + ConstPath.RelativeFilePath.Workspace

      let wsData,
        isOpenLastMap = false

      if (lastMap) {
        isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(lastMap.path)
      }

      if (isOpenLastMap) {
        data = {
          DSParams: lastMap,
          type: 'LastMap',
        }
      } else {
        let moduleMapName = 'Hunan_叠加谷歌晕渲图风格'
        let moduleMapFullName = moduleMapName + '.xml'
        // 地图用相对路径
        let moduleMapPath =
          userPath + ConstPath.RelativeFilePath.Map + moduleMapFullName
        if (await FileTools.fileIsExist(homePath + moduleMapPath)) {
          data = {
            type: 'Map',
            path: moduleMapPath,
            name: moduleMapName,
          }
        }
      }

      wsData = [
        {
          DSParams: { server: wsPath },
          type: 'Workspace',
        },
        data,
      ]

      NavigationService.navigate('MapView', {
        operationType: constants.MAP_EDIT,
        wsData: wsData,
        mapName: '地图制图',
        isExample: false,
      })
    },
  },
  {
    key: '三维场景',
    title: '三维场景',
    baseImage: require('../assets/home/Frenchgrey/right_bottom_free.png'),
    moduleImage: require('../assets/home/Frenchgrey/icon_map3D.png'),
    style: {
      width: scaleSize(60),
      height: scaleSize(60),
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    action: async () => {
      GLOBAL.Type = ConstToolType.MAP_3D
      // if (user && user.userName) {
      //   let path = await FileTools.appendingHomeDirectory(
      //     ConstPath.UserPath + user.userName,
      //   )
      //   await SScene.setCustomerDirectory(path)
      // }
      let fileName = ''
      if (Platform.OS === 'android') {
        fileName = 'OlympicGreen_android'
      } else {
        fileName = 'OlympicGreen_ios'
      }
      let homePath = await FileTools.appendingHomeDirectory()
      let cachePath = homePath + ConstPath.CachePath
      let fileDirPath = cachePath + fileName
      let arrFile = await FileTools.getFilterFiles(fileDirPath)
      if (arrFile.length === 0) {
        NavigationService.navigate('Map3D', {})
      } else {
        let name =
          Platform.OS === 'android'
            ? 'OlympicGreen_android'
            : 'OlympicGreen_ios'
        NavigationService.navigate('Map3D', { name: name })
      }
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
    key: '专题制图',
    title: '专题制图',
    baseImage: require('../assets/home/Frenchgrey/left_top_vip.png'),
    moduleImage: require('../assets/home/Frenchgrey/icon_thematicmap.png'),
    style: {
      width: scaleSize(60),
      height: scaleSize(60),
      position: 'absolute',
      top: 0,
      left: 0,
    },
    action: async (user, lastMap) => {
      let data = ConstOnline['Google']
      GLOBAL.Type = constants.MAP_THEME
      GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1

      let homePath = await FileTools.appendingHomeDirectory()
      let userPath = ConstPath.CustomerPath
      if (user && user.userName) {
        userPath = ConstPath.UserPath + user.userName + '/'
      }
      let wsPath = homePath + userPath + ConstPath.RelativeFilePath.Workspace

      let wsData,
        isOpenLastMap = false

      if (lastMap) {
        isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(lastMap.path)
      }

      if (isOpenLastMap) {
        data = {
          DSParams: lastMap,
          type: 'LastMap',
        }
      } else {
        let moduleMapName = 'Beijing'
        let moduleMapFullName = moduleMapName + '.xml'
        // 地图用相对路径
        let moduleMapPath =
          userPath + ConstPath.RelativeFilePath.Map + moduleMapFullName
        if (await FileTools.fileIsExist(homePath + moduleMapPath)) {
          data = {
            type: 'Map',
            path: moduleMapPath,
            name: moduleMapName,
          }
        }
      }
      wsData = [
        {
          DSParams: { server: wsPath },
          type: 'Workspace',
        },
        data,
      ]

      NavigationService.navigate('MapView', {
        operationType: constants.MAP_THEME,
        wsData,
        mapName: '专题制图',
        isExample: false,
      })
    },
  },
  {
    key: '外业采集',
    title: '外业采集',
    baseImage: require('../assets/home/Frenchgrey/right_bottom_vip.png'),
    moduleImage: require('../assets/home/Frenchgrey/icon_collection.png'),
    style: {
      width: scaleSize(70),
      height: scaleSize(67),
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    action: async (user, lastMap) => {
      let data = ConstOnline['Google']
      data.layerIndex = 1
      GLOBAL.Type = constants.COLLECTION
      GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1

      let homePath = await FileTools.appendingHomeDirectory()
      let userPath = ConstPath.CustomerPath
      if (user && user.userName) {
        userPath = ConstPath.UserPath + user.userName + '/'
      }
      let wsPath = homePath + userPath + ConstPath.RelativeFilePath.Workspace

      let wsData,
        isOpenLastMap = false

      if (lastMap) {
        isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(lastMap.path)
      }

      if (isOpenLastMap) {
        data = {
          DSParams: lastMap,
          type: 'LastMap',
        }
      }

      wsData = [
        {
          DSParams: { server: wsPath },
          // layerIndex: 0,
          type: 'Workspace',
        },
        data,
      ]

      NavigationService.navigate('MapView', {
        operationType: constants.COLLECTION,
        wsData,
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
