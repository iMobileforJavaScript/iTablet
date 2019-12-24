import { createBottomTabNavigator } from 'react-navigation'
import Home, { Setting, AboutITablet } from './Home'
import Mine, {
  MyService,
  MyLocalData,
  MyMap,
  MyScene,
  MyDatasource,
  MySymbol,
  MyTemplate,
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
import TabBar from './TabBar'

const Tabs = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
    },
    Friend: {
      screen: Friend,
    },
    Find: {
      screen: Find,
    },
    Mine: {
      screen: Mine,
    },
  },
  {
    animationEnabled: false, // 切换页面时是否有动画效果
    tabBarPosition: 'bottom', // 显示在底端，android 默认是显示在页面顶端的
    swipeEnabled: false, // 是否可以左右滑动切换tab
    backBehavior: 'initialRoute', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
    lazy: false,
    tabBarComponent: TabBar,
  },
)

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
}
