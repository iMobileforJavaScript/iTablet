/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native'

import NavigationService from '../../../NavigationService'
import { Toast } from '../../../../utils/index'
import { scaleSize } from '../../../../utils/screen'
// import { getPinYinFirstCharacter } from '../../../../utils/pinyin'
import FriendListFileHandle from '../FriendListFileHandle'
import MessageDataHandle from '../MessageDataHandle'
import ConstPath from '../../../../constants/ConstPath'
import { FileTools } from '../../../../native'
import { dialogStyles, inputStyles } from '../Styles'
import { Dialog } from '../../../../components/Dialog'
// eslint-disable-next-line
//import { ActionPopover } from 'teaset'
// import { styles } from './../Styles'

class FriendGroup extends Component {
  props: {
    friend: Object,
    user: Object,
    chat: Array,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.inFormData = []

    //this.chat;
    this.state = {
      data: [],
      isRefresh: false,
      hasInformMsg: 0,
      inputText: '',
    }
  }

  // refresh = () =>
  // {
  //   if (JSON.stringify(this.chat) !== JSON.stringify(this.props.friend.props.chat)) {
  //     this.chat = this.props.friend.props.chat;
  //     this.getContacts(this.props)
  //   }
  // }
  componentDidMount() {
    // this.chat = this.props.friend.props.chat
    this.getContacts()
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat)
    ) {
      this.getContacts()
    }
  }

  upload = () => {
    FriendListFileHandle.upload()
  }
  download = () => {
    FriendListFileHandle.download()
    this.setState({ isRefresh: false })
  }
  refresh = () => {
    this.getContacts()
    this.setState({ isRefresh: false })
  }

  getContacts = async () => {
    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + this.props.user.userName,
    )

    FriendListFileHandle.getContacts(userPath, 'friend.list', results => {
      if (results) {
        let result = results.groupInfo
        try {
          // let data =  API.app.contactlist();     //获取联系人列表
          // const {list} = data;

          let srcFriendData = []
          for (let key in result) {
            if (result[key].id && result[key].groupName) {
              let frend = {}
              frend['id'] = result[key].id
              frend['groupName'] = result[key].groupName
              frend['members'] = result[key].members
              frend['masterID'] = result[key].masterID
              srcFriendData.push(frend)
            }
          }

          this.setState({
            data: srcFriendData,
          })
          // eslint-disable-next-line
        } catch (err) {
          //console.log('err', err)
          Toast.show(err.message)
        }
      }
    })
  }

  _onSectionselect = key => {
    let friend = {
      id: key.id,
      users: key.members,
      message: [],
      title: key.groupName,
    }

    let chatObj = {}
    if (this.props.friend.props.chat.hasOwnProperty(this.props.user.userId)) {
      let chats = this.props.friend.props.chat[this.props.user.userId]
      if (chats.hasOwnProperty(key.id)) {
        chatObj = chats[key.id].history
        friend = {
          id: key.id,
          users: key.members,
          message: chatObj,
          title: key.groupName,
        }
      }
    }

    NavigationService.navigate('Chat', {
      target: friend,
      curUser: this.props.user,
      friend: this.props.friend,
    })
  }

  _modifyName = () => {
    FriendListFileHandle.modifyGroupList(this.target.id, this.state.inputText)
    this.inputdialog.setDialogVisible(false)
  }
  _deleteGroup = () => {
    MessageDataHandle.delMessage({
      //清除未读信息
      userId: this.props.user.userId, //当前登录账户的id
      talkId: this.target.id, //会话ID
    })
    FriendListFileHandle.delFromGroupList(this.target.id)
    this.dialog.setDialogVisible(false)
  }

  render() {
    //console.log(params.user);
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: 'white',
          marginTop: scaleSize(20),
        }}
      >
        <FlatList
          ItemSeparatorComponent={() => {
            return <View style={styles.SectionSeparaLineStyle} />
          }}
          data={this.state.data}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this.download}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              title={'刷新中...'}
              enabled={true}
            />
          }
        />
        {this.renderDialog()}
        {this.renderInputDialog()}
      </View>
    )
  }

  _showPopover = (pressView, item) => {
    this.target = item
    let obj = {
      title: '设置备注',
      onPress: () => {
        this.inputdialog.setDialogVisible(true)
      },
    }
    pressView.measure((ox, oy, width, height, px, py) => {
      let items = [
        obj,
        {
          title: '删除群聊',
          onPress: () => {
            this.dialog.setDialogVisible(true)
          },
        },
      ]
      // ActionPopover.show(
      //   {
      //     x: px,
      //     y: py,
      //     width,
      //     height,
      //   },
      //   items,
      // )
    })
  }

  _renderItem(item) {
    let iTemView
    return (
      <TouchableOpacity
        ref={ref => (iTemView = ref)}
        style={[styles.ItemViewStyle]}
        activeOpacity={0.75}
        onPress={() => this._onSectionselect(item)}
        onLongPress={() => {
          this._showPopover(iTemView, item)
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
          <Text style={styles.ITemTextStyle}>{item.groupName}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  // _renderItem(item, index) {
  //   if (item && item['message'].length > 0) {
  //     let lastMessage = item['message'][item['message'].length - 1]
  //     let time = lastMessage.time
  //     let ctime = new Date(time)
  //     let timeString =
  //       '' +
  //       ctime.getFullYear() +
  //       '/' +
  //       (ctime.getMonth() + 1) +
  //       '/' +
  //       ctime.getDate() +
  //       ' ' +
  //       ctime.getHours() +
  //       ':' +
  //       ctime.getMinutes()
  //
  //     return (
  //       <TouchableOpacity
  //         style={styles.ItemViewStyle}
  //         activeOpacity={0.75}
  //         onPress={() => {
  //           this._onSectionselect(item, index)
  //         }}
  //       >
  //         <View style={styles.ITemHeadTextViewStyle}>
  //           {item.unReadMsg > 0 ? (
  //             <View
  //               style={{
  //                 position: 'absolute',
  //                 backgroundColor: 'red',
  //                 justifyContent: 'center',
  //                 height: scaleSize(25),
  //                 width: scaleSize(25),
  //                 borderRadius: scaleSize(25),
  //                 top: scaleSize(-6),
  //                 right: scaleSize(-12),
  //               }}
  //             >
  //               <Text
  //                 style={{
  //                   fontSize: scaleSize(20),
  //                   color: 'white',
  //                   textAlign: 'center',
  //                 }}
  //               >
  //                 {item.unReadMsg}
  //               </Text>
  //             </View>
  //           ) : null}
  //           <View
  //             style={{
  //               alignItems: 'center',
  //               justifyContent: 'center',
  //               flexDirection: 'row',
  //               flexWrap: 'wrap',
  //             }}
  //           >
  //             {this._renderItemHeadView(item)}
  //           </View>
  //         </View>
  //         <View style={styles.ITemTextViewStyle}>
  //           {this._renderItemTitleView(item)}
  //           <Text
  //             style={{
  //               fontSize: scaleSize(20),
  //               color: 'grey',
  //               top: scaleSize(10),
  //             }}
  //           >
  //             {lastMessage.msg}
  //           </Text>
  //         </View>
  //       </TouchableOpacity>
  //     )
  //   }
  // }

  _renderItemHeadView(item) {
    if (item.members.length > 1) {
      let texts = []
      for (let i in item.members) {
        if (i > 4) break
        texts.push(
          <Text
            style={{ fontSize: scaleSize(18), color: 'white', top: 2, left: 1 }}
          >
            {item['members'][i].name[0].toUpperCase() + ' '}
          </Text>,
        )
      }
      return texts
    } else {
      return (
        <Text style={styles.ITemHeadTextStyle}>
          {item['members'][0].name[0]}
        </Text>
      )
    }
  }
  // eslint-disable-next-line
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
        <Text style={dialogStyles.promptTtileX}>将该群聊删除?</Text>
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
        confirmAction={this._deleteGroup}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={dialogStyles.dialogBackgroundX}
      >
        {this.renderDialogChildren()}
      </Dialog>
    )
  }

  renderInputDialog = () => {
    return (
      <Dialog
        ref={ref => (this.inputdialog = ref)}
        style={{
          marginVertical: 15,
          width: scaleSize(420),
          height: scaleSize(250),
        }}
        type={'modal'}
        confirmAction={this._modifyName}
        // cancelAction={this.cancel}
      >
        <View style={inputStyles.item}>
          {/* <Text style={styles.title}>文本内容</Text> */}
          <TextInput
            underlineColorAndroid={'transparent'}
            accessible={true}
            accessibilityLabel={'文本内容'}
            onChangeText={text => {
              this.setState({
                inputText: text,
              })
            }}
            value={this.state.inputText}
            placeholder={'请输入备注名'}
            style={inputStyles.textInputStyle}
          />
        </View>
        {this.state.placeholder && (
          <Text style={styles.placeholder}>内容不符合规范请重新输入</Text>
        )}
      </Dialog>
    )
  }
}
const styles = StyleSheet.create({
  HeadViewStyle: {
    height: scaleSize(35),
    backgroundColor: 'rgba(160,160,160,1.0)',
    paddingHorizontal: scaleSize(10),
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
  },
  HeadTextStyle: {
    fontSize: scaleSize(22),
    color: 'white',
    marginLeft: scaleSize(20),
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
    height: scaleSize(90),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ITemHeadTextViewStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(20),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ITemHeadTextStyle: {
    fontSize: scaleSize(30),
    color: 'white',
  },

  ITemTextViewStyle: {
    marginLeft: scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  ITemTextStyle: {
    fontSize: scaleSize(30),
    color: 'black',
  },
  SectionSeparaLineStyle: {
    height: scaleSize(1),
    backgroundColor: 'rgba(160,160,160,1.0)',
    marginHorizontal: scaleSize(10),
    marginLeft: scaleSize(120),
  },
  FlatListViewStyle: {
    position: 'absolute',
    width: scaleSize(26),
    right: scaleSize(15),
    top: scaleSize(35),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FlatListItemViewStyle: {
    marginVertical: 2,
    height: scaleSize(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default FriendGroup
