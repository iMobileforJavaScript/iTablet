import { MapView, Map3D } from './pages'
// export { MapView, Map3D }

import { TabNavigator } from 'react-navigation'
import { Platform } from 'react-native'

import { color } from '../../styles'
import LayerManager from '../mtLayerManager'
// import Map3DLayerManager from '../map3DLayerManager'
import Layer3DManager from '../Layer3DManager'
import Setting from '../setting'
import MapSetting from '../mapSetting'
import { LayerAttribute } from '../layerAttribute'
import { AnalystTools } from '../analystView/pages'

const options = {
  animationEnabled: false, // 切换页面时是否有动画效果
  tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
  swipeEnabled: false, // 是否可以左右滑动切换tab
  backBehavior: 'initialRoute', // 按 back 键是否跳转到第一个Tab， none 为不跳转
  lazy: true,
  tabBarOptions: {
    activeTintColor: color.blue2, // 文字和图片选中颜色
    inactiveTintColor: '#999', // 文字和图片未选中颜色
    showIcon: true, // android 默认不显示 icon, 需要设置为 true 才会显示
    indicatorStyle: {
      height: 0, // 如TabBar下面显示有一条线，可以设高度为0后隐藏
    },
    style: {
      backgroundColor: color.theme, // TabBar 背景色
      // height: Platform.OS === 'android' ? 50 : 49,
      // height: scaleSize(96),
      height: 0,
      // borderTopColor: color.border,
      // borderTopWidth: 1,
    },
    tabStyle: {
      flexDirection: 'column',
      justifyContent: 'space-around',
    },
    labelStyle: {
      fontSize: Platform.OS === 'android' ? 16 : 12, // 文字大小
    },
  },
}

const MapTabs = TabNavigator(
  {
    MapView: {
      screen: MapView,
    },
    LayerManager: {
      screen: LayerManager,
    },
    LayerAttribute: {
      screen: LayerAttribute,
    },
    MapSetting: {
      screen: MapSetting,
    },
  },
  options,
)

const analystTabsOptions = Object.assign(options, {
  initialRouteIndex: 1,
  lazy: false,
  backBehavior: 'none',
})
const MapAnalystTabs = TabNavigator(
  {
    MapAnalystView: {
      screen: MapView,
    },
    AnalystTools: {
      screen: AnalystTools,
    },
    LayerAnalystManager: {
      screen: LayerManager,
    },
  },
  analystTabsOptions,
)

const Map3DTabs = TabNavigator(
  {
    Map3D: {
      screen: Map3D,
    },
    Layer3DManager: {
      screen: Layer3DManager,
    },
    LayerAttribute3D: {
      screen: LayerAttribute,
    },
    Map3DSetting: {
      screen: Setting,
    },
  },
  options,
)

export { MapTabs, Map3DTabs, MapAnalystTabs }
