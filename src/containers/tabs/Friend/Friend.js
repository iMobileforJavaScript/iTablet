/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import Container from '../../../components/Container'
import { Dimensions, TouchableOpacity, Image } from 'react-native'
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view'

import NavigationService from '../../NavigationService'
import { scaleSize } from '../../../utils/screen'
//import { Toast } from '../../../utils/index'
import styles from './Styles'
//import color from '../../../styles/color'
//import FetchUtils from '../../../utils/FetchUtils'
import { getThemeAssets } from '../../../assets'
import FriendMessage from './FriendMessage'
import FriendGroup from './FriendGroup'
import FriendList from './FriendList'

let searchImg = getThemeAssets().friend.friend_search
let addFriendImg = getThemeAssets().friend.friend_add

export default class Friend extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.state = {
      data: [{}],
      isRefresh: false,
      progressWidth: this.screenWidth * 0.4,
      isLoadingData: false,
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '好友',
          headerLeft: (
            <TouchableOpacity
              style={styles.addFriendView}
              onPress={() => {
                NavigationService.navigate('AddFriend', '')
              }}
            >
              <Image source={addFriendImg} style={styles.addFriendImg} />
            </TouchableOpacity>
          ),
          headerRight: (
            <TouchableOpacity
              onPress={() => {
                {
                  /*this.topNavigatorBarImageId = 'right'*/
                }
                {
                  /*this.setState({ modalIsVisible: true })*/
                }
              }}
              style={styles.searchView}
            >
              <Image
                resizeMode={'contain'}
                source={searchImg}
                style={styles.searchImg}
              />
            </TouchableOpacity>
          ),
          withoutBack: true,
          navigation: this.props.navigation,
        }}
      >
        <ScrollableTabView
          renderTabBar={() => <DefaultTabBar />}
          initialPage={0}
          tabBarUnderlineStyle={{
            backgroundColor: 'rgba(70,128,223,1.0)',
            height: 2,
            width: 20,
            marginLeft: this.screenWidth / 3 / 2 - 10,
          }}
          tabBarBackgroundColor="white"
          tabBarActiveTextColor="rgba(70,128,223,1.0)"
          tabBarInactiveTextColor="black"
          tabBarTextStyle={{
            fontSize: scaleSize(25),
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          <FriendMessage tabLabel="消息" />
          <FriendList tabLabel="好友" />
          <FriendGroup tabLabel="群组" />
        </ScrollableTabView>
      </Container>
    )
  }
}
