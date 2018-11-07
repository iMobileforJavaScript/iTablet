import NavigationService from '../containers/NavigationService'
import constants from '../containers/workspace/constants'
import ConstOnline from './ConstOnline'

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
    action: () => {
      NavigationService.navigate('MapView', ConstOnline['Baidu'])
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
