import { TabNavigator } from 'react-navigation'
import React, { PureComponent } from 'react'
import { Image, StyleSheet, View, Text } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { getThemeAssets } from '../../assets'
import { color } from '../../styles'
import Home, { Setting, AboutITablet } from './Home'
//eslint-disable-next-line
import { TabItem } from './TabItem'
import Mine, {
  MyService,
  MyLocalData,
  MyData,
  MyOnlineData,
  Register,
  MyOnlineMap,
  ScanOnlineMap,
  Personal,
  ToggleAccount,
  Login,
  MyLabel,
  MyBaseMap,
  MyModule,
} from './Mine'
import Find from './Find'
import SuperMapKnown from './Find/superMapKnown'
// eslint-disable-next-line
import Friend, {
  Chat,
  AddFriend,
  InformMessage,
  CreateGroupChat,
} from './Friend'
// eslint-disable-next-line no-unused-vars
import InformSpot from './Friend/InformSpot'
import { getLanguage } from '../../language/index'
import { connect } from 'react-redux'

class tabItem extends PureComponent {
  props: {
    language: String,
    data: Object,
    title: Object,
    source_focuse: Object,
    source_unfocuse: Object,
  }
  gettitle = () => {
    //alert(this.props.title)
    let t = ''
    switch (this.props.title) {
      case 'home':
        t = getLanguage(this.props.language).Navigator_Lable.HOME
        break
      case 'friend':
        t = getLanguage(this.props.language).Navigator_Lable.FRIENDS
        break
      case 'find':
        t = getLanguage(this.props.language).Navigator_Lable.EXPLORE
        break
      case 'user':
        t = getLanguage(this.props.language).Navigator_Lable.PROFILE
        break
    }
    return t
  }
  render() {
    return (
      <View style={styles.labelView}>
        <Image
          resizeMode="contain"
          source={
            this.props.data.focused
              ? this.props.source_focuse
              : this.props.source_unfocuse
          }
          style={styles.icon}
        />
        <Text style={styles.tabText}>{this.gettitle()}</Text>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  language: state.setting.toJS().language,
})
const mapDispatchToProps = {}
const TabBarLabel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(tabItem)

const Tabs = TabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: () => {
        return {
          tabBarLabel: data => {
            return (
              <TabBarLabel
                data={data}
                title={'home'}
                source_focuse={getThemeAssets().tabBar.tab_home_selected}
                source_unfocuse={getThemeAssets().tabBar.tab_home}
              />
            )
          },
          // tabBarIcon: ({ focused }: any) => (
          //   <Image
          //     resizeMode="contain"
          //     source={
          //       focused
          //         ? require('../../assets/tabBar/Frenchgrey/tab_home_selected.png')
          //         : require('../../assets/tabBar/Frenchgrey/tab_home.png')
          //     }
          //     style={styles.icon}
          //   />
          // ),
          header: null,
        }
      },
    },
    // Friend: {
    //   screen: Friend,
    //   navigationOptions: () => {
    //     return {
    //       tabBarLabel: data => {
    //         return (
    //           <View style={[styles.labelView]}>
    //             <Image
    //               resizeMode="contain"
    //               source={
    //                 data.focused
    //                   ? getThemeAssets().tabBar.tab_friend_selected
    //                   : getThemeAssets().tabBar.tab_friend
    //               }
    //               style={styles.icon}
    //             />
    //             <Text style={styles.tabText}>好友</Text>
    //             <InformSpot />
    //           </View>
    //         )
    //       },
    //       header: null,
    //     }
    //   },
    // },
    Find: {
      screen: Find,
      navigationOptions: () => {
        return {
          tabBarLabel: data => {
            return (
              <TabBarLabel
                data={data}
                title={'find'}
                source_focuse={require('../../assets/tabBar/Frenchgrey/tab_find_selected.png')}
                source_unfocuse={require('../../assets/tabBar/Frenchgrey/tab_find.png')}
              />
            )
          },
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
              <TabBarLabel
                data={data}
                title={'user'}
                source_focuse={require('../../assets/tabBar/Frenchgrey/tab_user_selected.png')}
                source_unfocuse={require('../../assets/tabBar/Frenchgrey/tab_user.png')}
              />
            )
          },
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
    lazy: false,
    tabBarOptions: {
      activeTintColor: color.blue2, // 文字和图片选中颜色
      inactiveTintColor: '#999', // 文字和图片未选中颜色
      showIcon: false, // android 默认不显示 icon, 需要设置为 true 才会显示
      indicatorStyle: {
        height: 0, // 如TabBar下面显示有一条线，可以设高度为0后隐藏
      },
      style: {
        backgroundColor: color.theme, // TabBar 背景色
        // height: Platform.OS === 'android' ? 50 : 49,
        height: scaleSize(96),
        borderTopColor: color.border,
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
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabText: {
    color: color.fontColorWhite,
    fontSize: setSpText(20),
    // paddingTop:Platform.OS === 'android' ?  scaleSize(3) : 0,
  },
  selectedTabText: {
    color: color.blue2,
    fontSize: setSpText(20),
    // paddingTop:Platform.OS === 'android' ?  scaleSize(3) : 0,
  },
  icon: {
    width: scaleSize(60),
    height: scaleSize(60),
    // backgroundColor: "pink"
  },
  labelView: {
    // marginTop: Platform.OS === 'android' ? scaleSize(2) : 0,
    // backgroundColor: "red",
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export {
  Tabs,
  /**Mine*/
  MyService,
  MyLocalData,
  MyData,
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
  /**friend*/
  Chat,
  InformMessage,
  AddFriend,
  CreateGroupChat,
  //-----------
  MyLabel,
  MyBaseMap,
  MyModule,
  SuperMapKnown,
}
