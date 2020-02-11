/**
 * Created by imobile-xzy on 2019/3/11.
 */
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
  Image,
} from 'react-native'
import NavigationService from '../../NavigationService'
import { SOnlineService } from 'imobile_for_reactnative'
import { scaleSize } from '../../../utils/screen'
import { Container, Dialog } from '../../../components'
import { dialogStyles } from './Styles'
//import Friend from './Friend'
import FriendListFileHandle from './FriendListFileHandle'
import { getLanguage } from '../../../language/index'
import { Toast } from '../../../utils'
import MSGConstant from './MsgConstant'

const dismissKeyboard = require('dismissKeyboard')

class AddFriend extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.target
    this.friend = {}
    this.user = this.props.navigation.getParam('user')
    this.state = {
      list: [],
      isLoading: false,
      text: '',
    }
    this.language = this.props.navigation.getParam('language')
  }
  componentDidMount() {
    this.friend = this.props.navigation.getParam('friend')
    this.user = this.props.navigation.getParam('user')
  }

  renderSearchBar = () => {
    return (
      <View
        style={{
          flex: 1,
          height: scaleSize(50),
          marginLeft: scaleSize(10),
          marginRight: scaleSize(10),
          marginBottom: scaleSize(5),
        }}
      >
        {
          <TextInput
            autoCapitalize="none"
            placeholder={
              getLanguage(this.language).Friends.ADD_FRIEND_PLACEHOLDER
            }
            placeholderTextColor={'#A7A7A7'}
            clearButtonMode="while-editing"
            onChangeText={newWord => this.setState({ text: newWord })}
            underlineColorAndroid="white"
            style={styles.searchBarTextInput}
          />
        }
      </View>
    )
  }

  search = async () => {
    let val = this.state.text
    if (!val) {
      return
    }
    this.container.setLoading(
      true,
      getLanguage(this.language).Friends.SEARCHING,
    )
    let result = await SOnlineService.getUserInfoBy(val, 0)
    if (result === false || result === '获取用户id失败') {
      result = ['0', getLanguage(this.language).Friends.SYS_NO_SUCH_USER]
    }
    this.setState({
      list: [result],
    })

    this.container.setLoading(false)
    dismissKeyboard()
  }

  //targetUser:[id,name]
  static acceptFriendAdd = (targetUser, isFriend, callback) => {
    FriendListFileHandle.addToFriendList(
      {
        markName: targetUser[1],
        name: targetUser[1],
        id: targetUser[0],
        info: { isFriend: isFriend },
      },
      callback,
    )
  }

  addFriendRequest = async () => {
    this.dialog.setDialogVisible(false)

    let item = this.target
    let curUserName = this.user.nickname
    let uuid = this.user.userId
    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      message: curUserName + ' 请求添加您为好友',
      type: MSGConstant.MSG_ADD_FRIEND,
      user: {
        name: curUserName,
        id: uuid,
        groupID: uuid,
        groupName: '',
      },
      time: time,
    }
    let messageStr = JSON.stringify(message) //message.toJSONString();

    if (this.target[0] === this.user.userId) {
      Toast.show(getLanguage(this.language).Friends.ADD_SELF)
      return
    }
    this.friend._sendMessage(messageStr, item[0], true)
    AddFriend.acceptFriendAdd([this.target[0], this.target[1]], 2)
  }
  renderSearchButton = () => {
    let text = this.state.text.trim()
    return (
      <TouchableOpacity
        style={{
          height: scaleSize(70),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        activeOpacity={text.length > 0 ? 0.5 : 1}
        onPress={this.search}
      >
        <View>
          <Text
            style={[
              styles.sendText,
              { color: text.length > 0 ? '#0084ff' : '#BBB' },
            ]}
          >
            {getLanguage(this.language).Friends.SEARCH}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderDialogChildren = () => {
    return (
      <View style={dialogStyles.dialogHeaderViewX}>
        <Image
          source={require('../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={dialogStyles.dialogHeaderImgX}
        />
        <Text style={dialogStyles.promptTtileX}>
          {getLanguage(this.language).Friends.ADD_AS_FRIEND}
        </Text>
      </View>
    )
  }
  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(this.language).Friends.CANCEL}
        confirmAction={this.addFriendRequest}
        opacity={1}
        opacityStyle={dialogStyles.dialogBackgroundX}
        style={dialogStyles.dialogBackgroundX}
      >
        {this.renderDialogChildren()}
      </Dialog>
    )
  }

  _renderItem(item) {
    let opacity = 1.0
    let headStr = item[1][0].toUpperCase()
    if (item[0] === '0') {
      opacity = 0.3
      headStr = '无'
    }
    return (
      <TouchableOpacity
        style={[styles.ItemViewStyle]}
        activeOpacity={0.75}
        disabled={item[0] === '0' ? true : false}
        onPress={() => {
          this.target = item //[id,name]
          if (this.target[0] == this.user.userId) {
            Toast.show(getLanguage(this.language).Friends.ADD_SELF)
            return
          }
          if (FriendListFileHandle.isFriend(this.target[0])) {
            NavigationService.navigate('Chat', {
              targetId: this.target[0],
            })
          } else {
            this.dialog.setDialogVisible(true)
          }
        }}
      >
        <View style={[styles.ITemHeadTextViewStyle, { opacity: opacity }]}>
          <Text style={styles.ITemHeadTextStyle}>{headStr}</Text>
        </View>
        <View style={[styles.ITemTextViewStyle, { opacity: opacity }]}>
          <Text style={styles.ITemTextStyle}>{item[1]}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    //console.log(params.user);
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Friends.ADD_FRIENDS,
          //'添加好友',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: '#ccc',
            top: scaleSize(10),
            marginLeft: scaleSize(10),
            marginRight: scaleSize(10),
          }}
        >
          {this.renderSearchBar()}
          {this.renderSearchButton()}
        </View>
        <FlatList
          style={{
            top: scaleSize(10),
          }}
          data={this.state.list}
          ItemSeparatorComponent={() => {
            return <View style={styles.SectionSeparaLineStyle} />
          }}
          // extraData={this.state}
          renderItem={({ item }) => this._renderItem(item)}
          initialNumToRender={2}
          keyExtractor={(item, index) => index.toString()}
          // ListEmptyComponent={<Loading/>}
          // ListHeaderComponent={this._renderSearch}
          // ListFooterComponent={this._renderFooter}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.3}
          returnKeyType={'search'}
          keyboardDismissMode={'on-drag'}
        />
        {this.renderDialog()}
      </Container>
    )
  }
}
var styles = StyleSheet.create({
  searchBarTextInput: {
    flex: 1,
    backgroundColor: 'white',
    // borderColor:'green',
    // height:textSize*1.4,
    // width:textSize*10,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: scaleSize(20),
    borderRadius: scaleSize(10),
    textAlign: 'center',
  },
  sendText: {
    fontWeight: '600',
    fontSize: scaleSize(25),
    backgroundColor: 'transparent',
    marginLeft: scaleSize(5),
    marginRight: scaleSize(10),
  },

  ITemTextStyle: {
    fontSize: scaleSize(30),
    color: 'black',
  },
  ITemTextViewStyle: {
    marginLeft: scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  ITemHeadTextStyle: {
    fontSize: scaleSize(25),
    color: 'white',
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
    height: scaleSize(70),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ITemHeadTextViewStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(40),
    width: scaleSize(40),
    borderRadius: scaleSize(40),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SectionSeparaLineStyle: {
    height: scaleSize(1),
    backgroundColor: 'rgba(160,160,160,1.0)',
    marginHorizontal: scaleSize(10),
    marginLeft: scaleSize(120),
  },
})

export default AddFriend
