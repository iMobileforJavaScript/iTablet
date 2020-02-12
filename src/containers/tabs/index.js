import { createBottomTabNavigator } from 'react-navigation'
import React from 'react'
import { Platform } from 'react-native'
import { scaleSize } from '../../utils'
import { getThemeAssets } from '../../assets'
import { color } from '../../styles'
import Home, { Setting, AboutITablet } from './Home'
import Mine, {
  MyService,
  MyLocalData,
  MyMap,
  MyScene,
  MyDatasource,
  MySymbol,
  MyTemplate,
  MyColor,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  SelectLogin,
  Login,
  IPortalLogin,
  MyLabel,
  MyBaseMap,
  MyDataset,
  NewDataset,
  SearchMine,
} from './Mine'
import Find from './Find'
import SuperMapKnown from './Find/superMapKnown'
import PublicData from './Find/PublicData'
import Friend, {
  Chat,
  AddFriend,
  InformMessage,
  CreateGroupChat,
  RecommendFriend,
  ManageFriend,
  ManageGroup,
  SelectModule,
  GroupMemberList,
  SelectFriend,
} from './Friend'
import InformSpot from './Friend/InformSpot'
import TabItem from './TabItem'

const Tabs = function(arr) {
  let tabs = {}
  for (let i = 0; i < arr.length; i++) {
    switch (arr[i]) {
      case 'Home':
        tabs.Home = {
          screen: Home,
          navigationOptions: () => {
            return {
              tabBarLabel: data => {
                return (
                  <TabItem
                    data={data}
                    title={'Home'}
                    selectedImage={getThemeAssets().tabBar.tab_home_selected}
                    image={getThemeAssets().tabBar.tab_home}
                  />
                )
              },
              header: null,
            }
          },
        }
        break
      case 'Friend':
        tabs.Friend = {
          screen: Friend,
          navigationOptions: () => {
            return {
              tabBarLabel: data => {
                return (
                  <TabItem
                    data={data}
                    title={'Friend'}
                    selectedImage={getThemeAssets().tabBar.tab_friend_selected}
                    image={getThemeAssets().tabBar.tab_friend}
                    renderExtra={() => {
                      return (
                        <InformSpot
                          style={{
                            right:
                              Platform.OS === 'android' ? scaleSize(50) : 0,
                          }}
                        />
                      )
                    }}
                  />
                )
              },
              header: null,
            }
          },
        }
        break
      case 'Find':
        tabs.Find = {
          screen: Find,
          navigationOptions: () => {
            return {
              tabBarLabel: data => {
                return (
                  <TabItem
                    data={data}
                    title={'Find'}
                    selectedImage={
                      getThemeAssets().tabBar.tab_discover_selected
                    }
                    image={getThemeAssets().tabBar.tab_discover}
                  />
                )
              },
              header: null,
            }
          },
        }
        break
      case 'Mine':
        tabs.Mine = {
          screen: Mine,
          navigationOptions: () => {
            return {
              tabBarLabel: data => {
                return (
                  <TabItem
                    data={data}
                    title={'Mine'}
                    selectedImage={getThemeAssets().tabBar.tab_mine_selected}
                    image={getThemeAssets().tabBar.tab_mine}
                  />
                )
              },
              header: null,
            }
          },
        }
        break
    }
  }
  return createBottomTabNavigator(tabs, {
    animationEnabled: false, // 切换页面时是否有动画效果
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 是否可以左右滑动切换tab
    backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    lazy: false,
    tabBarOptions: {
      activeTintColor: color.itemColorGray, // 文字和图片选中颜色
      inactiveTintColor: color.itemColorGray, // 文字和图片未选中颜色
      showIcon: false, // android 默认不显示 icon, 需要设置为 true 才会显示
      indicatorStyle: {
        height: 0, // 如TabBar下面显示有一条线，可以设高度为0后隐藏
      },
      style: {
        backgroundColor: '#EEEEEE', // TabBar 背景色
        // height: Platform.OS === 'android' ? 50 : 49,
        height: scaleSize(96),
        borderTopColor: '#EEEEEE',
        borderTopWidth: 1,
        // alignItems:"center",
        justifyContent: 'center',
      },
      tabStyle: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignContent: 'center',
        // marginTop: scaleSize(2),
        height: scaleSize(96),
        flex: 1,
        // backgroundColor: "blue"
      },
      labelStyle: {
        // backgroundColor:"white",
        // fontSize: Platform.OS === 'android' ? 16 : 12, // 文字大小
        // backgroundColor:"red",
      },
    },
  })
}

export {
  Tabs,
  /**Mine*/
  MyService,
  MyLocalData,
  MyMap,
  MyScene,
  MyDatasource,
  MySymbol,
  MyTemplate,
  MyColor,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  MyDataset,
  NewDataset,
  SearchMine,
  /**Home*/
  Setting,
  AboutITablet,
  SelectLogin,
  Login,
  IPortalLogin,
  /**friend*/
  Chat,
  InformMessage,
  AddFriend,
  CreateGroupChat,
  RecommendFriend,
  ManageFriend,
  ManageGroup,
  SelectModule,
  GroupMemberList,
  SelectFriend,
  //-----------
  MyLabel,
  MyBaseMap,
  SuperMapKnown,
  PublicData,
}
