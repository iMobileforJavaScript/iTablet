import NavigationService from '../containers/NavigationService'
import constants from '../containers/workspace/constants'
import ConstOnline from './ConstOnline'
import { Utility } from 'imobile_for_reactnative'
import { ConstPath } from '../constants'
import { Platform } from 'react-native'

export default [
  {
    key: '地图制图',
    title: '地图制图',
    baseImage: require('../assets/home/icon_lefttop_free.png'),
    moduleImage: require('../assets/home/icon_cartography.png'),
    action: async user => {
      const customerPath =
        ConstPath.CustomerPath + ConstPath.RelativeFilePath.CustomerWorkspace
      let wsPath = await Utility.appendingHomeDirectory(customerPath)
      let exist = await Utility.fileIsExistInHomeDirectory(customerPath)
      if (exist && !user.userName) {
        NavigationService.navigate('MapView', {
          // 若未登录，则打开游客工作空间
          operationType: constants.MAP_EDIT,
          wsData: [
            {
              DSParams: { server: wsPath },
              type: 'Workspace',
            },
            ConstOnline['Baidu'],
          ],
          mapName: ConstOnline['Baidu'].mapName,
          isExample: false,
        })
      } else {
        // TODO 打开对应user的工作空间
        NavigationService.navigate('MapView', {
          wsData: ConstOnline['SuperMapCloud'],
        })
      }
    },
  },
  {
    key: '三维场景',
    title: '三维场景',
    baseImage: require('../assets/home/icon_rightbottom_free.png'),
    moduleImage: require('../assets/home/icon_map3D.png'),
    action: async () => {
      let path,
        type = 'MAP_3D'
      if (Platform.OS === 'android') {
        path =
          (await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)) +
          'CBD_android/CBD_android.sxwu'
      } else {
        path =
          (await Utility.appendingHomeDirectory(ConstPath.SampleDataPath)) +
          'CBD_ios/CBD_ios.sxwu'
      }
      NavigationService.navigate('Map3D', { path: path, type: type })
    },
  },
  {
    key: 'AR地图',
    title: 'AR地图',
    baseImage: require('../assets/home/icon_lefttop_vip.png'),
    moduleImage: require('../assets/home/icon_ARmap.png'),
  },
  {
    key: '导航地图',
    title: '导航地图',
    baseImage: require('../assets/home/icon_rightbottom_vip.png'),
    moduleImage: require('../assets/home/icon_navigation.png'),
    action: () => {
      // NavigationService.navigate('MapView', { // 若未登录，则打开游客工作空间
      //   wsData: ConstOnline['Baidu'],
      //   isExample: false,
      // })
    },
  },
  {
    key: '专题地图',
    title: '专题地图',
    baseImage: require('../assets/home/icon_lefttop_vip.png'),
    moduleImage: require('../assets/home/icon_thematicmap.png'),
  },
  {
    key: '外业采集',
    title: '外业采集',
    baseImage: require('../assets/home/icon_rightbottom_vip.png'),
    moduleImage: require('../assets/home/icon_collection.png'),
    action: async user => {
      const customerPath =
        ConstPath.CustomerPath + ConstPath.RelativeFilePath.CustomerWorkspace
      let wsPath = await Utility.appendingHomeDirectory(customerPath)
      let exist = await Utility.fileIsExistInHomeDirectory(customerPath)
      // const customerPath =
      //   ConstPath.LocalDataPath + 'IndoorNavigationData/beijing.smwu'
      // let wsPath = await Utility.appendingHomeDirectory(customerPath)
      // let exist = await Utility.fileIsExistInHomeDirectory(customerPath)

      if (exist && !user.userName) {
        NavigationService.navigate('MapView', {
          // 若未登录，则打开游客工作空间
          wsData: [
            {
              DSParams: { server: wsPath },
              // layerIndex: 0,
              type: 'Workspace',
            },
            ConstOnline['Google'],
          ],
          mapName: '外业采集',
          isExample: false,
        })
      } else {
        // TODO 打开对应user的工作空间
        NavigationService.navigate('MapView', {
          wsData: [
            {
              DSParams: { server: wsPath },
              // layerIndex: 0,
              type: 'Workspace',
            },
            ConstOnline['Google'],
          ],
          mapName: '外业采集',
          isExample: false,
        })
      }
    },
  },
  {
    key: '应急标绘',
    title: '应急标绘',
    baseImage: require('../assets/home/icon_lefttop_vip.png'),
    moduleImage: require('../assets/home/icon_plot.png'),
  },
  {
    key: '数据分析',
    title: '数据分析',
    baseImage: require('../assets/home/icon_rightbottom_vip.png'),
    moduleImage: require('../assets/home/icon_mapanalysis.png'),
  },
]
