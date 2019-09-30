/**
 * Tabs
 * 注：MapView相关的Tabs在Routes中始终保持一个
 */

import React from 'react'
import { MapView, Map3D } from './pages'

import { createBottomTabNavigator } from 'react-navigation'

import { color } from '../../styles'
import LayerManager from '../mtLayerManager'
import Layer3DManager from '../Layer3DManager'
import Setting from '../setting'
import MapSetting from '../mapSetting'
import { Chat } from '../tabs'
import { LayerAttribute } from '../layerAttribute'
import TabNavigationService from '../TabNavigationService'

function compose(Component) {
  class Tab extends Component {
    render() {
      return (
        <Component
          ref={navigatorRef => {
            TabNavigationService.setTopLevelNavigator(navigatorRef)
          }}
          {...this.props}
          // onNavigationStateChange={(prevState, currentState) => {
          //   console.log(JSON.stringify(currentState))
          // }}
        />
      )
    }
  }
  return Tab
}

const options = {
  animationEnabled: false, // 切换页面时是否有动画效果
  tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
  swipeEnabled: false, // 是否可以左右滑动切换tab
  backBehavior: 'initialRoute', // 按 back 键是否跳转到第一个Tab， none 为不跳转
  lazy: true,
  tabBarOptions: {
    showLabel: false,
    showIcon: false,
    indicatorStyle: {
      height: 0, // 如TabBar下面显示有一条线，可以设高度为0后隐藏
    },
    style: {
      backgroundColor: color.theme, // TabBar 背景色
      height: 0,
    },
    safeAreaInset: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
}

const MapTabs = compose(
  createBottomTabNavigator(
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
  ),
)

const CoworkTabs = createBottomTabNavigator(
  {
    //onechat
    Chat: {
      screen: Chat,
    },
    CoworkMapTabs: {
      screen: MapTabs,
    },
  },
  options,
)

// const analystTabsOptions = Object.assign({}, options, {
//   initialRouteIndex: 1,
//   lazy: false,
//   backBehavior: 'none',
// })
// const MapAnalystTabs = compose(
//   createBottomTabNavigator(
//     {
//       MapAnalystView: {
//         screen: MapView,
//       },
//       AnalystTools: {
//         screen: AnalystTools,
//       },
//       LayerAnalystManager: {
//         screen: LayerManager,
//       },
//     },
//     analystTabsOptions,
//   ),
// )

const Map3DTabs = createBottomTabNavigator(
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

export { MapTabs, Map3DTabs, CoworkTabs, MapView }
