import { MapView } from './pages'

// export { MapView, Map3D }

import { TabNavigator } from 'react-navigation'
import { Platform } from 'react-native'

import { color } from '../../styles'
import LayerManager from '../mtLayerManager'
import { LayerAttribute } from '../layerAttribute'

const MapTabs = TabNavigator(
  {
    MapView: {
      screen: MapView,
      // navigationOptions: () => {
      //   return {
      //     tabBarLabel: data => {
      //       return (
      //         <View style={styles.labelView}>
      //           <Text
      //             style={data.focused ? styles.selectedTabText : styles.tabText}
      //           >
      //             地图
      //           </Text>
      //         </View>
      //       )
      //     },
      //     tabBarIcon: ({ focused }: any) => (
      //       <Image
      //         resizeMode="contain"
      //         source={
      //           focused
      //             ? require('../../assets/mapToolbar/icon_map_selected.png')
      //             : require('../../assets/mapToolbar/icon_map.png')
      //         }
      //         style={styles.icon}
      //       />
      //     ),
      //     header: null,
      //   }
      // },
    },
    LayerManager: {
      screen: LayerManager,
      // navigationOptions: () => {
      //   return {
      //     tabBarLabel: data => {
      //       return (
      //         <View style={styles.labelView}>
      //           <Text
      //             style={data.focused ? styles.selectedTabText : styles.tabText}
      //           >
      //             图层
      //           </Text>
      //         </View>
      //       )
      //     },
      //     tabBarIcon: ({ focused }: any) => (
      //       <Image
      //         resizeMode="contain"
      //         source={
      //           focused
      //             ? require('../../assets/mapToolbar/icon_layer_selected.png')
      //             : require('../../assets/mapToolbar/icon_layer.png')
      //         }
      //         style={styles.icon}
      //       />
      //     ),
      //     header: null,
      //   }
      // },
    },
    LayerAttribute: {
      screen: LayerAttribute,
      // navigationOptions: () => {
      //   return {
      //     tabBarLabel: data => {
      //       return (
      //         <View style={styles.labelView}>
      //           <Text
      //             style={data.focused ? styles.selectedTabText : styles.tabText}
      //           >
      //             属性
      //           </Text>
      //         </View>
      //       )
      //     },
      //     tabBarIcon: ({ focused }: any) => (
      //       <Image
      //         resizeMode="contain"
      //         source={
      //           focused
      //             ? require('../../assets/mapToolbar/icon_attribute_selected.png')
      //             : require('../../assets/mapToolbar/icon_attribute.png')
      //         }
      //         style={styles.icon}
      //       />
      //     ),
      //     header: null,
      //   }
      // },
    },
    LayerManager1: {
      screen: LayerManager,
      // navigationOptions: () => {
      //   return {
      //     tabBarLabel: data => {
      //       return (
      //         <View style={styles.labelView}>
      //           <Text
      //             style={data.focused ? styles.selectedTabText : styles.tabText}
      //           >
      //             设置
      //           </Text>
      //         </View>
      //       )
      //     },
      //     tabBarIcon: ({ focused }: any) => (
      //       <Image
      //         resizeMode="contain"
      //         source={
      //           focused
      //             ? require('../../assets/mapToolbar/icon_setting_selected.png')
      //             : require('../../assets/mapToolbar/icon_setting.png')
      //         }
      //         style={styles.icon}
      //       />
      //     ),
      //     header: null,
      //   }
      // },
    },
  },
  {
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
        borderTopColor: color.border,
        borderTopWidth: 1,
      },
      tabStyle: {
        flexDirection: 'column',
        justifyContent: 'space-around',
      },
      labelStyle: {
        fontSize: Platform.OS === 'android' ? 16 : 12, // 文字大小
      },
    },
  },
)

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   tabText: {
//     color: color.gray2,
//     fontSize: 12,
//   },
//   selectedTabText: {
//     color: color.blue2,
//     fontSize: 12,
//   },
//   icon: {
//     width: scaleSize(40),
//     height: scaleSize(40),
//   },
//   labelView: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 5,
//   },
// })

export default MapTabs
