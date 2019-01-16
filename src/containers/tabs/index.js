import { TabNavigator } from 'react-navigation'
import React from 'react'
import { Platform, Image, StyleSheet, View, Text } from 'react-native'

import { scaleSize } from '../../utils'
import { color } from '../../styles'
import Home, { Setting, AboutITablet } from './Home'
import Mine, {
  MyService,
  MyLocalData,
  MyOnlineData,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  Login,
} from './Mine'
import Find from './Find'
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
                  ? require('../../assets/tabBar/Frenchgrey/tab_home_selected.png')
                  : require('../../assets/tabBar/Frenchgrey/tab_home.png')
              }
              style={styles.icon}
            />
          ),
          header: null,
        }
      },
    },
    Find: {
      screen: Find,
      navigationOptions: () => {
        return {
          tabBarLabel: data => {
            return (
              <View style={styles.labelView}>
                <Text
                  style={data.focused ? styles.selectedTabText : styles.tabText}
                >
                  发现
                </Text>
              </View>
            )
          },
          tabBarIcon: ({ focused }: any) => (
            <Image
              resizeMode="contain"
              source={
                focused
                  ? require('../../assets/tabBar/Frenchgrey/tab_find_selected.png')
                  : require('../../assets/tabBar/Frenchgrey/tab_find.png')
              }
              style={styles.icon}
            />
          ),
          header: null,
        }
      },
    },
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
                  ? require('../../assets/tabBar/Frenchgrey/tab_user_selected.png')
                  : require('../../assets/tabBar/Frenchgrey/tab_user.png')
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
        marginTop: scaleSize(4.5),
        // flex:1,
      },
      labelStyle: {
        // fontSize: Platform.OS === 'android' ? 16 : 12, // 文字大小
        // backgroundColor:"red",
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
    fontSize: scaleSize(20),
    // paddingTop:Platform.OS === 'android' ?  scaleSize(3) : 0,
  },
  selectedTabText: {
    color: color.blue2,
    fontSize: scaleSize(20),
    // paddingTop:Platform.OS === 'android' ?  scaleSize(3) : 0,
  },
  icon: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  labelView: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Platform.OS === 'android' ? scaleSize(6) : 0,
  },
})
export default Tabs
export {
  /**Mine*/
  MyService,
  MyLocalData,
  MyOnlineData,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  /**Home*/
  Setting,
  AboutITablet,
  Login,
}
