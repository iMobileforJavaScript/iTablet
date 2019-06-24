/**
 * Created by imobile-xzy on 2019/3/8.
 */
import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native'
import {
  GiftedChat,
  Bubble,
  MessageText,
  SystemMessage,
  InputToolbar,
} from 'react-native-gifted-chat'
import { SMap } from 'imobile_for_reactnative'
import Container from '../../../../components/Container'
import { Dialog } from '../../../../components'
import { scaleSize } from '../../../../utils/screen'
import NavigationService from '../../../NavigationService'
import CustomActions from './CustomActions'
import CustomView from './CustomView'
import { ConstPath } from '../../../../constants'
import { color } from '../../../../styles'
import { FileTools } from '../../../../native'
import { Toast } from '../../../../utils/index'
import { stat } from 'react-native-fs'
import MSGConstant from '../MsgConstant'
import { getLanguage } from '../../../../language/index'
import FriendListFileHandle from '../FriendListFileHandle'
import { Buffer } from 'buffer'
import CoworkTouchableView from '../CoworkTouchableView'

let Top = scaleSize(38)
if (Platform.OS === 'ios') {
  Top = scaleSize(80)
}

class Chat extends React.Component {
  props: {
    navigation: Object,
    user: Object,
    setBackAction: () => {},
    removeBackAction: () => {},
  }
  constructor(props) {
    super(props)
    this.friend = this.props.navigation.getParam('friend')
    this.curUser = this.props.navigation.getParam('curUser')
    this.targetId = this.props.navigation.getParam('targetId')
    this.targetUser = this.friend.getTargetUser(this.targetId)
    this.friend.setCurChat(this)
    this._isMounted = false
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      showUserAvatar: true,
      messageInfo: this.props.navigation.getParam('messageInfo', ''),
      showInformSpot: false,
      chatBottom: 0,
      title: this.targetUser.title,
      coworkMode: global.coworkMode,
    }

    this.onSend = this.onSend.bind(this)
    this.onSendFile = this.onSendFile.bind(this)
    this.onSendLocation = this.onSendLocation.bind(this)
    this.onReceive = this.onReceive.bind(this)
    this.renderCustomActions = this.renderCustomActions.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.renderSystemMessage = this.renderSystemMessage.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.onLoadEarlier = this.onLoadEarlier.bind(this)
    this.onReceiveProgress = this.onReceiveProgress.bind(this)
    this.renderTicks = this.renderTicks.bind(this)
  }

  onFriendListChanged = () => {
    let newTitle = this.isGroupChat()
      ? FriendListFileHandle.getGroup(this.targetUser.id).groupName
      : FriendListFileHandle.getFriend(this.targetUser.id).markName
    this.setState({ title: newTitle })
  }
  componentDidMount() {
    if (Platform.OS === 'android' && this.state.coworkMode) {
      this.props.setBackAction({
        key: this.props.navigation.state.routeName,
        action: () => this.back(),
      })
    }
    let curMsg = []

    //加载两条
    let n = 0
    for (let i = this.targetUser.message.length - 1; i >= 0; i--) {
      if (n++ > 3) {
        break
      }
      let msg = this.targetUser.message[i]
      let chatMsg = this._loadChatMsg(msg)
      curMsg.push(chatMsg)
    }

    this._isMounted = true
    this.setState(() => {
      return {
        messages: curMsg,
      }
    })
  }

  onReceiveProgress(value) {
    this.setState({
      messages: this.state.messages.map(m => {
        if (m._id === value.msgId) {
          m.originMsg.message.message.progress = value.percentage

          if (value.percentage === 100) {
            m.originMsg.message.message.isReceived = 1
          }
        }
        return {
          ...m,
        }
      }),
    })
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.navigation.state.routeName,
      })
    }
    this.friend.setCurChat(undefined)
    this._isMounted = false
  }

  back = () => {
    if (this.state.coworkMode) {
      this.exitCowork.setDialogVisible(true)
    }
    return true
  }

  setCoworkMode = value => {
    this.setState({ coworkMode: value })
    if (Platform.OS === 'android') {
      if (value) {
        this.props.setBackAction({
          key: this.props.navigation.state.routeName,
          action: () => this.back(),
        })
      } else {
        this.props.removeBackAction({
          key: this.props.navigation.state.routeName,
        })
      }
    }
  }
  // eslint-disable-next-line
  onPressAvator = data => {}

  onLoadEarlier() {
    // eslint-disable-next-line
    this.setState(previousState => {
      return {
        isLoadingEarlier: true,
      }
    })

    let oldMsg = []
    if (this.targetUser.message.length > 4) {
      for (let i = this.targetUser.message.length - 1 - 4; i >= 0; i--) {
        let msg = this.targetUser.message[i]
        let chatMsg = this._loadChatMsg(msg)
        oldMsg.push(chatMsg)
      }
    }

    if (this._isMounted === true) {
      this.setState(previousState => {
        return {
          messages: GiftedChat.prepend(previousState.messages, oldMsg),
          loadEarlier: false,
          isLoadingEarlier: false,
        }
      })
    }
  }
  //将redux中取出消息转为chat消息
  _loadChatMsg = message => {
    let msgStr = JSON.stringify(message)
    let msg = JSON.parse(msgStr)
    msg = this.friend.loadMsg(msg)
    let chatMsg = {
      _id: msg.msgId,
      createdAt: new Date(msg.originMsg.time),
      user: {
        _id: msg.originMsg.user.id,
        name: msg.originMsg.user.name,
      },
      type: msg.type,
      originMsg: msg.originMsg,
      text: msg.text,
      system: msg.system,
    }

    return chatMsg
  }

  isGroupChat = () => {
    let bGroup = false
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = true
    }
    return bGroup
  }
  //发送普通消息
  onSend(messages = []) {
    let bGroup = 1
    let groupID = messages[0].user._id
    let groupName = ''
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
      groupName = this.targetUser.title
    }
    let ctime = new Date()
    let time = Date.parse(ctime)
    //要发送/保存的消息
    let message = {
      message: messages[0].text,
      type: bGroup,
      user: {
        name: messages[0].user.name,
        id: messages[0].user._id,
        groupID: groupID,
        groupName: groupName,
      },
      time: time,
    }
    let msgId = this.friend.getMsgId(this.targetUser.id)
    //保存
    let storeMsg = this.friend.storeMessage(message, this.targetUser.id, msgId)
    //显示
    let chatMsg = this._loadChatMsg(storeMsg)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsg),
      }
    })
    //发送
    this.friend._sendMessage(JSON.stringify(message), this.targetUser.id, false)
  }

  onSendLocation(value) {
    let positionStr = value.address
    let bGroup = 1
    let groupID = this.curUser.userId
    let groupName = ''
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
      groupName = this.targetUser.title
    }
    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      message: {
        type: MSGConstant.MSG_LOCATION,
        message: {
          message: positionStr,
          longitude: value.longitude,
          latitude: value.latitude,
        },
      },
      type: bGroup,
      user: {
        name: this.curUser.nickname,
        id: this.curUser.userId,
        groupID: groupID,
        groupName: groupName,
      },
      time: time,
    }
    let msgId = this.friend.getMsgId(this.targetUser.id)
    //保存
    let storeMsg = this.friend.storeMessage(message, this.targetUser.id, msgId)
    //显示
    let chatMsg = this._loadChatMsg(storeMsg)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsg),
      }
    })
    //发送
    this.friend._sendMessage(JSON.stringify(message), this.targetUser.id, false)
  }

  async onSendFile(filepath) {
    let bGroup = 1
    let groupID = this.curUser.userId
    let groupName = ''
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
      groupName = this.targetUser.title
    }
    let ctime = new Date()
    let time = Date.parse(ctime)
    //要发送的文件
    let message = {
      type: bGroup,
      user: {
        name: this.curUser.nickname,
        id: this.curUser.userId,
        groupID: groupID,
        groupName: groupName,
      },
      time: time,
      message: {
        type: MSGConstant.MSG_FILE, //文件本体
        message: {
          data: '',
          index: 0,
          length: 0,
        },
      },
    }

    let msgId = this.friend.getMsgId(this.targetUser.id)
    let fileName = filepath.substr(filepath.lastIndexOf('/') + 1)
    let statResult = await stat(filepath)
    //文件接收提醒
    let informMsg = {
      type: bGroup,
      time: time,
      user: {
        name: this.curUser.nickname,
        id: this.curUser.userId,
        groupID: groupID,
        groupName: groupName,
      },
      message: {
        type: MSGConstant.MSG_FILE_NOTIFY,
        message: {
          message: '[文件]',
          fileName: fileName,
          fileSize: statResult.size,
          filePath: filepath,
          progress: 0,
        },
      },
    }
    //保存
    let storeMsg = this.friend.storeMessage(
      informMsg,
      this.targetUser.id,
      msgId,
    )
    //显示
    let chatMsg = this._loadChatMsg(storeMsg)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsg),
      }
    })
    //发送文件及提醒
    this.friend._sendFile(
      JSON.stringify(message),
      filepath,
      this.targetUser.id,
      msgId,
      informMsg,
    )
  }

  showInformSpot = b => {
    this.setState({ showInformSpot: b })
  }
  onReceive(msgId) {
    let talkId = this.targetUser.id
    let msg = this.friend.getMsgByMsgId(talkId, msgId)
    let chatMsg = this._loadChatMsg(msg)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsg),
        showInformSpot: false,
      }
    })
  }

  receiveFile = (message, receivePath) => {
    this.friend._receiveFile(
      message.originMsg.message.message.fileName,
      message.originMsg.message.message.queueName,
      receivePath,
      this.targetUser.id,
      message._id,
      message.user._id,
      message.originMsg.message.message.fileSize,
    )
  }

  onCustomViewFileTouch = (type, message) => {
    switch (type) {
      case MSGConstant.MSG_FILE_NOTIFY:
        this.onMapFileTouch(message)
        break
      case MSGConstant.MSG_LAYER:
        this.onLayerFileTouch(message)
        break
      default:
        break
    }
  }

  onLayerFileTouch = async message => {
    //TODO 以文件形式接收
    let LayerBase64 = message.originMsg.message.message.layerValue[0]
    let layer = Buffer.from(LayerBase64, 'base64').toString()

    NavigationService.navigate('MyData', {
      title: getLanguage(global.language).Profile.MAP,
      formChat: true,
      callBackMode: 'getName',
      chatCallBack: async moduleMapFullName => {
        let moduleMapName = moduleMapFullName.substr(
          0,
          moduleMapFullName.lastIndexOf('.'),
        )
        let userPath = (userPath =
          ConstPath.UserPath + this.curUser.userName + '/')
        let homePath = await FileTools.appendingHomeDirectory()
        // 地图用相对路径
        let moduleMapPath =
          userPath + ConstPath.RelativeFilePath.Map + moduleMapFullName
        let wsPath = homePath + userPath + ConstPath.RelativeFilePath.Workspace

        let data
        if (await FileTools.fileIsExist(homePath + moduleMapPath)) {
          data = {
            type: 'Map',
            path: moduleMapPath,
            name: moduleMapName,
            layer: layer,
          }
        }

        let wsData = [
          {
            DSParams: { server: wsPath },
            type: 'Workspace',
          },
          data,
        ]
        NavigationService.navigate('MapView', {
          wsData,
          isExample: true,
          mapName: moduleMapName,
        })
      },
    })
  }

  onMapFileTouch = async message => {
    if (message.user._id !== this.curUser.userId) {
      let userPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath + this.curUser.userName,
      )
      let receivePath = userPath + '/ReceivedFiles'
      if (message.originMsg.message.message.isReceived === 0) {
        this.downloadmessage = message
        this.downloadreceivePath = receivePath
        this.download.setDialogVisible(true)
      } else {
        let toPath = await FileTools.appendingHomeDirectory(
          ConstPath.Import + '/weChat.zip',
        )
        FileTools.copyFile(
          receivePath + '/' + message.originMsg.message.message.fileName,
          toPath,
        )
        this.import.setDialogVisible(true)
      }
    }
  }

  render() {
    let moreImg = require('../../../../assets/home/Frenchgrey/icon_else_selected.png')
    return (
      <Animated.View style={{ flex: 1, bottom: this.state.chatBottom }}>
        <Container
          ref={ref => (this.container = ref)}
          headerProps={{
            title: this.state.title,
            withoutBack: false,
            backAction: this.state.coworkMode && this.back,
            navigation: this.props.navigation,
            headerRight:
              this.targetUser.id.indexOf('Group_') === -1 ||
              FriendListFileHandle.isInGroup(
                this.targetUser.id,
                this.curUser.userId,
              ) ? (
                /* eslint-disable*/
                <TouchableOpacity
                  onPress={() => {
                    let route = this.isGroupChat()
                      ? 'ManageGroup'
                      : 'ManageFriend'
                    NavigationService.navigate(route, {
                      user: this.curUser,
                      targetId: this.targetId,
                      friend: this.friend,
                      chat: this,
                    })
                  }}
                  style={styles.moreView}
                >
                  <Image
                    resizeMode={'contain'}
                    source={moreImg}
                    style={styles.moreImg}
                  />
                </TouchableOpacity>
              ) : null,
            /* eslint-enable */
          }}
        >
          {this.state.showInformSpot ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'red',
                height: scaleSize(15),
                width: scaleSize(15),
                borderRadius: scaleSize(15),
                top: Top,
                left: scaleSize(75),
              }}
            />
          ) : null}
          {this.state.coworkMode ? (
            <CoworkTouchableView
              screen="Chat"
              onPress={() => {
                this.friend.curMod.action()
              }}
            />
          ) : null}
          <GiftedChat
            placeholder="message..."
            messages={this.state.messages}
            showAvatarForEveryMessage={false}
            onSend={this.onSend}
            loadEarlier={this.state.loadEarlier}
            onLoadEarlier={this.onLoadEarlier}
            isLoadingEarlier={this.state.isLoadingEarlier}
            showUserAvatar={this.state.showUserAvatar}
            renderAvatarOnTop={false}
            user={{
              _id: this.curUser.userId, // sent messages should have same user._id
              name: this.curUser.nickname,
            }}
            renderActions={this.renderCustomActions}
            //被移出群组后不显示输入栏
            renderInputToolbar={props => {
              if (
                this.targetUser.id.indexOf('Group_') === -1 ||
                FriendListFileHandle.isInGroup(
                  this.targetUser.id,
                  this.curUser.userId,
                )
              ) {
                return <InputToolbar {...props} />
              }
              return null
            }}
            renderBubble={this.renderBubble}
            renderTicks={this.renderTicks}
            renderSystemMessage={this.renderSystemMessage}
            renderCustomView={this.renderCustomView}
            renderFooter={this.renderFooter}
            renderAvatar={this.renderAvatar}
            renderMessageText={props => {
              if (
                props.currentMessage.type === MSGConstant.MSG_FILE_NOTIFY ||
                props.currentMessage.type === MSGConstant.MSG_LOCATION
              ) {
                return null
              }
              return (
                <MessageText
                  {...props}
                  customTextStyle={{ fontSize: scaleSize(20) }}
                />
              )
            }}
          />
          {this.renderImportDialog()}
          {this.renderDownloadDialog()}
          {this.renderExitCoworkChatDialog()}
        </Container>
      </Animated.View>
    )
  }

  renderCustomActions(props) {
    return (
      <CustomActions
        {...props}
        callBack={value => this.setState({ chatBottom: value })}
        sendCallBack={(type, value) => {
          if (type === 1) {
            this.onSendFile(value)
          } else if (type === 3) {
            this.onSendLocation(value)
          }
        }}
      />
    )
  }

  renderAvatar = props => {
    let backColor = 'rgba(229,125,33,1.0)'
    if (props.currentMessage.user._id !== 1) {
      backColor = 'rgba(51,151,218,1.0)'
    }

    let headerStr = ''
    if (props.currentMessage.user.name) {
      headerStr = props.currentMessage.user.name[0]
    }
    return (
      <TouchableOpacity
        {...props}
        // eslint-disable-next-line
        onPress={user => {
          this.onPressAvator(props.currentMessage.user)
        }}
      >
        <View
          style={{
            height: scaleSize(60),
            width: scaleSize(60),
            borderRadius: scaleSize(60),
            backgroundColor: backColor,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: scaleSize(30),
              color: 'white',
              textAlign: 'center',
            }}
          >
            {headerStr}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            //对方的气泡
            marginTop: scaleSize(1),
            backgroundColor: 'white',
            overflow: 'hidden',
            borderRadius: scaleSize(10),
          },
          right: {
            //我方的气泡
            marginTop: scaleSize(1),
            backgroundColor: 'blue',
            overflow: 'hidden',
            borderRadius: scaleSize(10),
          },
        }}
        //与下一条自己的消息连接处的样式
        containerToNextStyle={{
          left: {
            borderBottomLeftRadius: scaleSize(10),
          },
          right: {
            borderBottomRightRadius: scaleSize(10),
          },
        }}
        //与上一条自己的消息连接处的样式
        containerToPreviousStyle={{
          left: {
            borderTopLeftRadius: scaleSize(10),
          },
          right: {
            borderTopRightRadius: scaleSize(10),
          },
        }}
        //底栏样式
        bottomContainerStyle={{
          right: {
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
          },
          left: {
            justifyContent: 'space-between',
          },
        }}
      />
    )
  }
  //渲染标记
  renderTicks(props) {
    let currentMessage = props

    if (
      currentMessage.type &&
      currentMessage.type === MSGConstant.MSG_FILE_NOTIFY
    ) {
      let progress = currentMessage.originMsg.message.message.progress
      return (
        <View style={styles.tickView}>
          <Text
            style={
              currentMessage.user._id !== this.curUser.userId
                ? styles.tickLeft
                : [styles.tickLeft, styles.tickRight]
            }
          >
            {progress === 100 ? '✓' : progress === 0 ? '' : progress + '%'}
          </Text>
        </View>
      )
    }
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        containerStyle={{
          marginBottom: 15,
        }}
        textStyle={{
          fontSize: scaleSize(20),
        }}
      />
    )
  }

  renderCustomView = props => {
    return <CustomView {...props} onFileTouch={this.onCustomViewFileTouch} />
  }

  // eslint-disable-next-line
  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{this.state.typingText}</Text>
        </View>
      )
    }
    return null
  }

  renderImportDialog = () => {
    return (
      <Dialog
        ref={ref => (this.import = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(global.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(global.language).Friends.CANCEL}
        confirmAction={() => {
          this.import.setDialogVisible(false)
          GLOBAL.Loading.setLoading(
            true,
            getLanguage(global.language).Friends.IMPORT_DATA,
          )
          if (Platform.OS === 'ios') {
            FileTools.getUri(this.downloadreceivePath)
          }
          FileTools.importData().then(
            result => {
              GLOBAL.Loading.setLoading(false)
              result &&
                Toast.show(getLanguage(global.language).Friends.IMPORT_SUCCESS)
            },
            () => {
              GLOBAL.Loading.setLoading(false)
              Toast.show(getLanguage(global.language).Friends.IMPORT_FAIL)
            },
          )
        }}
        cancelAction={async () => {
          let importPath = ConstPath.Import
          await FileTools.deleteFile(importPath)
          this.import.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        {this.renderImportDialogChildren()}
      </Dialog>
    )
  }

  renderImportDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTtile}>
          {getLanguage(global.language).Friends.IMPORT_CONFIRM}
        </Text>
      </View>
    )
  }

  renderDownloadDialog = () => {
    return (
      <Dialog
        ref={ref => (this.download = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(global.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(global.language).Friends.CANCEL}
        confirmAction={() => {
          this.download.setDialogVisible(false)
          this.receiveFile(this.downloadmessage, this.downloadreceivePath)
        }}
        cancelAction={() => {
          this.download.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        {this.renderDownloadDialogChildren()}
      </Dialog>
    )
  }

  renderDownloadDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTtile}>
          {getLanguage(global.language).Friends.RECEIVE_CONFIRM}
        </Text>
      </View>
    )
  }

  renderExitCoworkChatDialog = () => {
    return (
      <Dialog
        ref={ref => (this.exitCowork = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(global.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(global.language).Friends.CANCEL}
        confirmAction={async () => {
          this.exitCowork.setDialogVisible(false)
          let close = () => {
            this.friend.setCurMod(undefined)
            this.setCoworkMode(false)
            global.coworkMode = false
            NavigationService.goBack()
          }
          let mapOpen
          try {
            mapOpen = await SMap.isAnyMapOpened()
          } catch (error) {
            mapOpen = false
          }
          if (mapOpen) {
            SMap.mapIsModified().then(result => {
              if (result) {
                GLOBAL.SaveMapView &&
                  GLOBAL.SaveMapView.setVisible(true, null, () => {
                    this.friend.setCurMod(undefined)
                    this.setCoworkMode(false)
                    global.coworkMode = false
                  })
              } else {
                close()
              }
            })
          } else {
            close()
          }
        }}
        cancelAction={() => {
          this.exitCowork.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        <View style={styles.dialogHeaderView}>
          <Image
            source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
            style={styles.dialogHeaderImg}
          />
          <Text style={styles.promptTtile}>
            {getLanguage(global.language).Friends.ALERT_EXIT_COWORK}
          </Text>
        </View>
      </Dialog>
    )
  }
}

const styles = StyleSheet.create({
  moreView: {
    flex: 1,
    // marginRight: scaleSize(10),
  },
  moreImg: {
    width: scaleSize(60),
    height: scaleSize(60),
  },
  footerContainer: {
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    marginBottom: scaleSize(10),
  },
  footerText: {
    fontSize: scaleSize(14),
    color: '#aaa',
  },
  dialogHeaderView: {
    flex: 1,
    //  backgroundColor:"pink",
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImg: {
    width: scaleSize(60),
    height: scaleSize(60),
    opacity: 1,
    // marginLeft:scaleSize(145),
    // marginTop:scaleSize(21),
  },
  promptTtile: {
    fontSize: scaleSize(24),
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  dialogBackground: {
    width: scaleSize(350),
    height: scaleSize(240),
    borderRadius: scaleSize(4),
    backgroundColor: 'white',
  },
  opacityView: {
    width: scaleSize(350),
    height: scaleSize(240),
    borderRadius: scaleSize(4),
    backgroundColor: 'white',
  },
  tickView: {
    flexDirection: 'row',
    marginRight: scaleSize(20),
    marginLeft: scaleSize(20),
    marginBottom: scaleSize(10),
  },
  tickLeft: {
    fontSize: scaleSize(18),
    color: 'gray',
  },
  tickRight: {
    color: 'white',
  },
})
export default Chat
