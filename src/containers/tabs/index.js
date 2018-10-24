import { TabNavigator } from 'react-navigation'
import React from 'react'
import { Platform, Image, StyleSheet, View, Text } from 'react-native'

import { scaleSize } from '../../utils'
import { color } from '../../styles'
import Home from './Home'
import Mine from './Mine'

const Tabs = TabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: () => {
        return {
          tabBarLabel: data => {
            return (
              <View style={styles.labelView}>
                <Text
                  style={data.focused ? styles.selectedTabText : styles.tabText}
                >
                  首页
                </Text>
              </View>
            )
          },
          tabBarIcon: ({ focused }: any) => (
            <Image
              resizeMode="contain"
              source={
                focused
                  ? require('../../assets/home/icon_home_selected.png')
                  : require('../../assets/home/icon_home_select.png')
              }
              style={styles.icon}
            />
          ),
          header: null,
        }
      },
    },
    // CloudService: {
    //   screen: CloudService,
    //   navigationOptions: () => {
    //     return {
    //       tabBarLabel: data => {
    //         return (
    //           <View style={styles.labelView}>
    //             <Text
    //               style={data.focused ? styles.selectedTabText : styles.tabText}
    //             >
    //               云服务
    //             </Text>
    //           </View>
    //         )
    //       },
    //       tabBarIcon: ({ focused }: any) =>
    //         <Image
    //           resizeMode="contain"
    //           source={
    //             focused
    //               ? require('../../assets/tabBar/icon-service-selected.png')
    //               : require('../../assets/tabBar/icon-service.png')
    //           }
    //           style={styles.icon}
    //         />,
    //       header: null,
    //     }
    //   },
    // },
    Mine: {
      screen: Mine,
      navigationOptions: () => {
        return {
          tabBarLabel: data => {
            return (
              <View style={styles.labelView}>
                <Text
                  style={data.focused ? styles.selectedTabText : styles.tabText}
                >
                  我的
                </Text>
              </View>
            )
          },
          tabBarIcon: ({ focused }: any) => (
            <Image
              resizeMode="contain"
              source={
                focused
                  ? require('../../assets/home/icon_mine_select.png')
                  : require('../../assets/home/icon_mine_select.png')
              }
              style={styles.icon}
            />
          ),
          header: null,
        }
      },
    },
  },
  {
    animationEnabled: false, // 切换页面时是否有动画效果
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 是否可以左右滑动切换tab
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
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
        height: scaleSize(96),
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabText: {
    color: color.gray2,
    fontSize: 12,
  },
  selectedTabText: {
    color: color.blue2,
    fontSize: 12,
  },
  icon: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  labelView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },
})

export default Tabs
