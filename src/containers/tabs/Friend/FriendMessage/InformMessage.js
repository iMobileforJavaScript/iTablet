/**
 * Created by imobile-xzy on 2019/3/16.
 */

import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native'
import { scaleSize } from '../../../../utils/screen'
import { Container, Dialog } from '../../../../components'
import { dialogStyles } from './../Styles'
import { styles } from './Styles'
import AddFriend from './../AddFriend'

export default class InformMessage extends React.Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.friend = {}
    this.state = {
      messageInfo: this.props.navigation.getParam('messageInfo', ''),
      currentUser: this.props.navigation.getParam('user', ''),
    }
  }
  componentDidMount() {
    this.friend = this.props.navigation.getParam('friend')
    this.setState(() => {
      return {
        messageInfo: this.props.navigation.getParam('messageInfo'),
        currentUser: this.props.navigation.getParam('user', ''),
      }
    })
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    this.getContacts(nextProps)
  }

  _onSectionselect = item => {
    this.target = item
    this.dialog.setDialogVisible(true)
  }

  _dialogConfirm = () => {
    //  this.target;
    let curUserName = this.state.currentUser.nickname
    let uuid = this.state.currentUser.userId
    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      message: ' 我们已经是好友了,开始聊天吧',
      type: 1,
      user: { name: curUserName, id: uuid, groupID: uuid },
      time: time,
    }
    this.friend._sendMessage(
      JSON.stringify(message),
      this.target.messageId,
      false,
    )

    AddFriend.acceptFriendAdd([this.target.messageId, this.target.users[[0]]])
    this.friend.refreshList()
    this.dialog.setDialogVisible(false)
  }

  render() {
    //console.log(params.user);
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '通知消息',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          style={{
            top: scaleSize(10),
          }}
          data={this.state.messageInfo}
          ItemSeparatorComponent={() => {
            return <View style={styles.SectionSeparaLineStyle} />
          }}
          // extraData={this.state}
          // eslint-disable-next-line
          renderItem={({ item, index }) => this._renderItem(item)}
          initialNumToRender={2}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.3}
          returnKeyType={'search'}
          keyboardDismissMode={'on-drag'}
        />
        {this.renderDialog()}
      </Container>
    )
  }

  _renderItem(item, index) {
    let lastMessage = item['message']
    let time = item.time
    let ctime = new Date(time)
    let timeString =
      '' +
      ctime.getFullYear() +
      '/' +
      (ctime.getMonth() + 1) +
      '/' +
      ctime.getDate() +
      ' ' +
      ctime.getHours() +
      ':' +
      ctime.getMinutes()

    return (
      <TouchableOpacity
        style={styles.ItemViewStyle}
        activeOpacity={0.75}
        onPress={() => {
          this._onSectionselect(item, index)
        }}
      >
        <View style={styles.ITemHeadTextViewStyle}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {this._renderItemHeadView(item)}
          </View>
        </View>
        <View style={styles.ITemTextViewStyle}>
          {this._renderItemTitleView(item)}
          <Text
            style={{
              fontSize: scaleSize(20),
              color: 'grey',
              top: scaleSize(10),
            }}
          >
            {lastMessage}
          </Text>
        </View>
        <View
          style={{
            marginRight: scaleSize(20),
            flexDirection: 'column',
            justifyContent: 'flex-end',
            flexGrow: 1,
          }}
        >
          <Text
            style={{
              fontSize: scaleSize(20),
              color: 'grey',
              textAlign: 'right',
            }}
          >
            {timeString}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderItemHeadView(item) {
    if (item['messageType'] === 3) {
      let texts = []
      for (var i in item['users']) {
        if (i > 4) break
        texts.push(
          <Text
            style={{ fontSize: scaleSize(18), color: 'white', top: 2, left: 1 }}
          >
            {item['users'][i][0].toUpperCase() + ' '}
          </Text>,
        )
      }
      return texts
    } else {
      return <Text style={styles.ITemHeadTextStyle}>{item['users'][0][0]}</Text>
    }
  }
  _renderItemTitleView(item) {
    return <Text style={styles.ITemTextStyle}>{item['title']}</Text>
  }

  renderDialogChildren = () => {
    return (
      <View style={dialogStyles.dialogHeaderViewX}>
        <Image
          source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={dialogStyles.dialogHeaderImgX}
        />
        <Text style={dialogStyles.promptTtileX}>同意对方添加请求 ？</Text>
      </View>
    )
  }
  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={'modal'}
        confirmBtnTitle={'确定'}
        cancelBtnTitle={'取消'}
        confirmAction={this._dialogConfirm}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={dialogStyles.dialogBackgroundX}
      >
        {this.renderDialogChildren()}
      </Dialog>
    )
  }
}
