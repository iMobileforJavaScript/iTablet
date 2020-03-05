import NavigationService from '../containers/NavigationService'
import { Platform } from 'react-native'
import constants from '../containers/workspace/constants'
import { FileTools } from '../native'
import ConstOnline from './ConstOnline'
import { ConstPath } from '../constants'
import { scaleSize } from '../utils'
import { getLanguage } from '../language/index'
import { getThemeAssets } from '../assets'
import Orientation from 'react-native-orientation'
import { SAIDetectView } from 'imobile_for_reactnative'
import Toast from '../utils/Toast'

const MAP_MODULE = {
  MAP_EDIT: '地图制图',
  MAP_3D: '三维场景',
  MAP_THEME: '专题制图',
  MAP_COLLECTION: '外业采集',
  MAP_PLOTTING: '应急标绘',
  MAP_ANALYST: '数据分析',
  MAP_AR: 'AR地图',
  MAP_NAVIGATION: '导航地图',
}

function getHeaderTitle(type) {
  if (!type) return ''
  switch (type) {
    case constants.MAP_EDIT:
      return getLanguage(global.language).Map_Module.MAP_EDIT
    case constants.MAP_3D:
      return getLanguage(global.language).Map_Module.MAP_3D
    case constants.MAP_THEME:
      return getLanguage(global.language).Map_Module.MAP_THEME
    case constants.COLLECTION:
      return getLanguage(global.language).Map_Module.MAP_COLLECTION
    case constants.MAP_PLOTTING:
      return getLanguage(global.language).Map_Module.MAP_PLOTTING
    case constants.MAP_ANALYST:
      return getLanguage(global.language).Map_Module.MAP_ANALYST
    case constants.MAP_AR:
      return getLanguage(global.language).Map_Module.MAP_AR
    case constants.MAP_NAVIGATION:
      return getLanguage(global.language).Map_Module.MAP_NAVIGATION
  }
}

export { MAP_MODULE, getHeaderTitle }

function SetMap(param) {
  let moduleDatas = [
    {
      key: constants.MAP_EDIT,
      title: getLanguage(param).Map_Module.MAP_EDIT,
      baseImage:
        param === 'CN'
          ? require('../assets/home/Frenchgrey/left_top_free.png')
          : require('../assets/home/Frenchgrey/free_top_left.png'),
      moduleImage: getThemeAssets().nav.icon_map_edit,
      moduleImageTouch: getThemeAssets().nav.icon_map_edit_touch,
      moduleImageLight: require('../assets/home/Light/icon_cartography.png'),
      style: {
        width: scaleSize(60),
        height: scaleSize(60),
        position: 'absolute',
        top: 0,
        left: 0,
      },
      action: async (user, lastMap) => {
        let data = ConstOnline['Google']
        data.layerIndex = 3
        GLOBAL.Type = constants.MAP_EDIT
        GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1
        GLOBAL.showMenu = true
        // GLOBAL.showFlex = true
        let homePath = await FileTools.appendingHomeDirectory()
        let userPath = ConstPath.CustomerPath
        if (user && user.userName) {
          userPath = ConstPath.UserPath + user.userName + '/'
        }
        let wsPath =
          homePath +
          userPath +
          ConstPath.RelativeFilePath.Workspace[
            global.language === 'CN' ? 'CN' : 'EN'
          ]

        let wsData,
          isOpenLastMap = false

        if (lastMap) {
          isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(
            lastMap.path,
          )
        }

        if (isOpenLastMap) {
          data = {
            type: 'Map',
            ...lastMap,
          }
        } else {
          let moduleMapName = param === 'CN' ? '湖南' : 'LosAngeles'
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
          mapName: getLanguage(param).Map_Module.MAP_EDIT,
          isExample: false,
        })
      },
    },
    {
      key: constants.MAP_3D,
      title: getLanguage(param).Map_Module.MAP_3D,
      baseImage:
        param === 'CN'
          ? require('../assets/home/Frenchgrey/right_bottom_free.png')
          : require('../assets/home/Frenchgrey/free_bottom_right.png'),

      moduleImage: getThemeAssets().nav.icon_map_3d,
      moduleImageTouch: getThemeAssets().nav.icon_map_3d_touch,
      moduleImageLight: require('../assets/home/Light/icon_map3D.png'),
      style: {
        width: scaleSize(60),
        height: scaleSize(60),
        position: 'absolute',
        right: 0,
        bottom: 0,
      },
      action: async () => {
        GLOBAL.Type = constants.MAP_3D
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
    {
      key: constants.MAP_AR,
      title: getLanguage(param).Map_Module.MAP_AR,
      baseImage: require('../assets/home/Frenchgrey/left_top_vip.png'),
      moduleImage: getThemeAssets().nav.icon_map_vedio,
      moduleImageTouch: getThemeAssets().nav.icon_map_vedio_touch,
      moduleImageLight: require('../assets/home/Light/icon_videomap.png'),

      style: {
        width: scaleSize(70),
        height: scaleSize(67),
        position: 'absolute',
        right: 0,
        bottom: 0,
      },
      action: async (user, lastMap) => {
        let isAvailable = await SAIDetectView.checkIfAvailable()
        if (!isAvailable) {
          Toast.show(
            getLanguage(global.language).Map_Main_Menu
              .MAP_AR_DONT_SUPPORT_DEVICE,
          )
          return
        }
        isAvailable = await SAIDetectView.checkIfSensorsAvailable()
        if (!isAvailable) {
          Toast.show(
            getLanguage(global.language).Map_Main_Menu
              .MAP_AR_DONT_SUPPORT_DEVICE,
          )
          return
        }
        isAvailable = await SAIDetectView.checkIfCameraAvailable()
        if (!isAvailable) {
          Toast.show(
            getLanguage(global.language).Map_Main_Menu.MAP_AR_CAMERA_EXCEPTION,
          )
          return
        }

        let data = ConstOnline['Google']
        data.layerIndex = 1
        GLOBAL.Type = constants.MAP_AR
        GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1
        GLOBAL.showMenu = true
        // GLOBAL.showFlex = true
        let homePath = await FileTools.appendingHomeDirectory()
        let userPath = ConstPath.CustomerPath
        if (user && user.userName) {
          userPath = ConstPath.UserPath + user.userName + '/'
        }
        let wsPath =
          homePath +
          userPath +
          ConstPath.RelativeFilePath.Workspace[
            global.language === 'CN' ? 'CN' : 'EN'
          ]

        let wsData,
          isOpenLastMap = false

        if (lastMap) {
          isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(
            lastMap.path,
          )
        }

        if (isOpenLastMap) {
          data = {
            type: 'Map',
            ...lastMap,
          }
        }

        wsData = [
          {
            DSParams: { server: wsPath },
            type: 'Workspace',
          },
          data,
        ]

        global.isPad && Orientation.lockToPortrait()
        NavigationService.navigate('MapView', {
          operationType: constants.MAP_AR,
          wsData,
          mapName: getLanguage(param).Map_Module.MAP_AR,
          isExample: false,
        })
      },
    },
    {
      key: constants.MAP_NAVIGATION,
      title: getLanguage(param).Map_Module.MAP_NAVIGATION,
      baseImage: require('../assets/home/Frenchgrey/left_top_vip.png'),
      moduleImage: getThemeAssets().nav.icon_map_navigation,
      moduleImageTouch: getThemeAssets().nav.icon_map_navigation_touch,
      moduleImageLight: require('../assets/home/Light/icon_videomap.png'),
      style: {
        width: scaleSize(70),
        height: scaleSize(67),
        position: 'absolute',
        right: 0,
        bottom: 0,
      },
      action: async (user, lastMap) => {
        GLOBAL.INCREMENTDATASETNAME = ''
        let data = Object.assign({}, ConstOnline['Google'])
        data.layerIndex = 1
        GLOBAL.Type = constants.MAP_NAVIGATION

        let homePath = await FileTools.appendingHomeDirectory()
        let userPath = ConstPath.CustomerPath
        if (user && user.userName) {
          userPath = ConstPath.UserPath + user.userName + '/'
        }
        let wsPath =
          homePath +
          userPath +
          ConstPath.RelativeFilePath.Workspace[
            global.language === 'CN' ? 'CN' : 'EN'
          ]

        let wsData,
          isOpenLastMap = false

        if (lastMap) {
          isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(
            lastMap.path,
          )
        }

        if (isOpenLastMap) {
          data = {
            type: 'Map',
            ...lastMap,
          }
        } else {
          let moduleMapName = 'beijing'
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
            // layerIndex: 0,
            type: 'Workspace',
          },
          data,
        ]
        NavigationService.navigate('MapView', {
          operationType: constants.MAP_NAVIGATION,
          wsData,
          mapName: getLanguage(param).Map_Module.MAP_NAVIGATION,
          isExample: false,
        })
      },
    },
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
      key: constants.MAP_THEME,
      title: getLanguage(param).Map_Module.MAP_THEME,
      baseImage: require('../assets/home/Frenchgrey/left_top_vip.png'),
      moduleImage: getThemeAssets().nav.icon_map_theme,
      moduleImageTouch: getThemeAssets().nav.icon_map_theme_touch,
      moduleImageLight: require('../assets/home/Light/icon_thematicmap.png'),
      style: {
        width: scaleSize(60),
        height: scaleSize(60),
        position: 'absolute',
        top: 0,
        left: 0,
      },
      action: async (user, lastMap) => {
        let data = ConstOnline['Google']
        data.layerIndex = 3
        GLOBAL.Type = constants.MAP_THEME
        GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1
        let homePath = await FileTools.appendingHomeDirectory()
        let userPath = ConstPath.CustomerPath
        if (user && user.userName) {
          userPath = ConstPath.UserPath + user.userName + '/'
        }
        let wsPath =
          homePath +
          userPath +
          ConstPath.RelativeFilePath.Workspace[
            global.language === 'CN' ? 'CN' : 'EN'
          ]

        let wsData,
          isOpenLastMap = false

        if (lastMap) {
          isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(
            lastMap.path,
          )
        }

        if (isOpenLastMap) {
          data = {
            type: 'Map',
            ...lastMap,
          }
        } else {
          let moduleMapName =
            param === 'CN' ? 'LandBuild' : 'PrecipitationOfUSA'
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
          mapName: getLanguage(param).Map_Module.MAP_THEME,
          isExample: false,
        })
      },
    },
    {
      key: constants.COLLECTION,
      title: getLanguage(param).Map_Module.MAP_COLLECTION,
      baseImage: require('../assets/home/Frenchgrey/right_bottom_vip.png'),
      moduleImage: getThemeAssets().nav.icon_map_collection,
      moduleImageTouch: getThemeAssets().nav.icon_map_collection_touch,
      moduleImageLight: require('../assets/home/Light/icon_collection.png'),
      style: {
        width: scaleSize(70),
        height: scaleSize(67),
        position: 'absolute',
        right: 0,
        bottom: 0,
      },
      action: async (user, lastMap) => {
        let data = Object.assign({}, ConstOnline['Google'])
        data.layerIndex = 1
        GLOBAL.Type = constants.COLLECTION
        GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1
        let homePath = await FileTools.appendingHomeDirectory()
        let userPath = ConstPath.CustomerPath
        if (user && user.userName) {
          userPath = ConstPath.UserPath + user.userName + '/'
        }
        let wsPath =
          homePath +
          userPath +
          ConstPath.RelativeFilePath.Workspace[
            global.language === 'CN' ? 'CN' : 'EN'
          ]

        let wsData,
          isOpenLastMap = false

        if (lastMap) {
          isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(
            lastMap.path,
          )
        }

        if (isOpenLastMap) {
          data = {
            type: 'Map',
            ...lastMap,
          }
        } else {
          let moduleMapName = '国情普查_示范数据'
          let moduleMapFullName = moduleMapName + '.xml'
          // 地图相对路径
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
            // layerIndex: 0,
            type: 'Workspace',
          },
          data,
        ]
        NavigationService.navigate('MapView', {
          operationType: constants.COLLECTION,
          wsData,
          mapName: getLanguage(param).Map_Module.MAP_COLLECTION,
          isExample: false,
        })
      },
    },
    {
      key: constants.MAP_PLOTTING,
      title: getLanguage(param).Map_Module.MAP_PLOTTING,
      baseImage: require('../assets/home/Frenchgrey/right_bottom_vip.png'),
      moduleImage: getThemeAssets().nav.icon_map_plot,
      moduleImageTouch: getThemeAssets().nav.icon_map_plot_touch,
      moduleImageLight: require('../assets/home/Light/icon_plot.png'),
      style: {
        width: scaleSize(70),
        height: scaleSize(67),
        position: 'absolute',
        right: 0,
        bottom: 0,
      },
      action: async (user, lastMap) => {
        let data = Object.assign({}, ConstOnline['Google'])
        data.layerIndex = 1
        GLOBAL.Type = constants.MAP_PLOTTING
        GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1

        let homePath = await FileTools.appendingHomeDirectory()
        let userPath = ConstPath.CustomerPath
        if (user && user.userName) {
          userPath = ConstPath.UserPath + user.userName + '/'
        }
        let wsPath =
          homePath +
          userPath +
          ConstPath.RelativeFilePath.Workspace[
            global.language === 'CN' ? 'CN' : 'EN'
          ]

        let wsData,
          isOpenLastMap = false

        if (lastMap) {
          isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(
            lastMap.path,
          )
        }

        if (isOpenLastMap) {
          data = {
            type: 'Map',
            ...lastMap,
          }
        } else {
          // let moduleMapName = '福建'
          let moduleMapName = 'TourLine'
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
            // layerIndex: 0,
            type: 'Workspace',
          },
          data,
        ]

        NavigationService.navigate('MapView', {
          operationType: constants.MAP_PLOTTING,
          wsData,
          mapName: getLanguage(param).Map_Module.MAP_PLOTTING,
          isExample: false,
        })
      },
    },
    {
      key: constants.MAP_ANALYST,
      title: getLanguage(param).Map_Module.MAP_ANALYST,
      baseImage: require('../assets/home/Frenchgrey/right_bottom_vip.png'),
      moduleImage: getThemeAssets().nav.icon_map_analysis,
      moduleImageTouch: getThemeAssets().nav.icon_map_analysis_touch,
      moduleImageLight: require('../assets/home/Light/icon_mapanalysis.png'),
      style: {
        width: scaleSize(70),
        height: scaleSize(67),
        position: 'absolute',
        right: 0,
        bottom: 0,
      },
      action: async (user, lastMap) => {
        let data = Object.assign({}, ConstOnline['Google'])
        data.layerIndex = 1
        GLOBAL.Type = constants.MAP_ANALYST
        GLOBAL.BaseMapSize = data instanceof Array ? data.length : 1

        let homePath = await FileTools.appendingHomeDirectory()
        let userPath = ConstPath.CustomerPath
        if (user && user.userName) {
          userPath = ConstPath.UserPath + user.userName + '/'
        }
        let wsPath =
          homePath +
          userPath +
          ConstPath.RelativeFilePath.Workspace[
            global.language === 'CN' ? 'CN' : 'EN'
          ]

        let wsData,
          isOpenLastMap = false

        if (lastMap) {
          isOpenLastMap = await FileTools.fileIsExistInHomeDirectory(
            lastMap.path,
          )
        }

        if (isOpenLastMap) {
          data = {
            type: 'Map',
            ...lastMap,
          }
        } else {
          let moduleMapName = 'TracingAnalysis'
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
            // layerIndex: 0,
            type: 'Workspace',
          },
          data,
        ]

        NavigationService.navigate('MapView', {
          operationType: constants.MAP_ANALYST,
          wsData,
          mapName: getLanguage(param).Map_Module.MAP_ANALYST,
          isExample: false,
        })
      },
    },
  ]

  // if (Platform.OS === 'ios') {
  //   moduleDatas.splice(2, 1)
  // }

  return moduleDatas
}

export default SetMap
