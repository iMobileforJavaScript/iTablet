import NavigationService from '../containers/NavigationService'
import constants from '../containers/workspace/constants'
import ConstOnline from './ConstOnline'
import { Utility, SMap, WorkspaceType } from 'imobile_for_reactnative'
import { ConstPath } from '../constants'

let count = 0

export default [
  {
    key: '地图制图',
    title: '地图制图',
    baseImage: require('../assets/home/icon_lefttop_free.png'),
    moduleImage: require('../assets/home/icon_cartography.png'),
    action: () => {
      NavigationService.navigate('MapView', {
        operationType: constants.MAP_EDIT,
        ...ConstOnline['TD'],
      })
    },
  },
  {
    key: '三维场景',
    title: '三维场景',
    baseImage: require('../assets/home/icon_rightbottom_free.png'),
    moduleImage: require('../assets/home/icon_map3D.png'),
    action: () => {
      NavigationService.navigate('Map3D', {})
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
      Utility.appendingHomeDirectory(ConstPath.CustomerPath).then(path => {
        SMap.saveWorkspace({
          caption: 'Customer',
          type: WorkspaceType.SMWU,
          // version: 1.0,
          server: path,
          user: '321',
          password: '123',
        })
      })
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
    action: async () => {
      // NavigationService.navigate('MapView', ConstOnline['Baidu'])
      // let path = ConstPath.LocalDataPath + 'beijing_new/beijing.smwu'
      let path = ConstPath.LocalDataPath + 'IndoorNavigationData/beijing.smwu'
      let filePath = await Utility.appendingHomeDirectory(path)
      let exist = await Utility.fileIsExistInHomeDirectory(path)
      count++
      if (exist && count % 2 === 1) {
        // NavigationService.navigate('MapView', { type: '', path: path, isExample: true })
        NavigationService.navigate('MapView', {
          path: filePath,
          type: 'LOCAL',
          isExample: false,
        })
      } else {
        NavigationService.navigate('MapView', ConstOnline['Baidu'])
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
