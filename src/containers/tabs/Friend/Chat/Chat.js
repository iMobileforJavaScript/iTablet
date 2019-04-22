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
} from 'react-native-gifted-chat'
import Container from '../../../../components/Container'
import { Dialog } from '../../../../components'
import { scaleSize } from '../../../../utils/screen'

import CustomActions from './CustomActions'
import CustomView from './CustomView'
import { ConstPath } from '../../../../constants'
import { color } from '../../../../styles'
import { FileTools } from '../../../../native'
import { Toast } from '../../../../utils/index'
import { stat } from 'react-native-fs'
import MSGConstant from '../MsgConstant'
import { getLanguage } from '../../../../language/index'

let Top = scaleSize(38)
if (Platform.OS === 'ios') {
  Top = scaleSize(80)
}

class Chat extends React.Component {
  props: {
    navigation: Object,
    user: Object,
  }
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      loadEarlier: true,
      typingText: null,
      isLoadingEarlier: false,
      showUserAvatar: true,
      messageInfo: this.props.navigation.getParam('messageInfo', ''),
      showInformSpot: false,
      chatBottom: 0,
    }

    this.friend = this.props.navigation.getParam('friend')
    this.targetUser = this.props.navigation.getParam('target')
    this.curUser = this.props.navigation.getParam('curUser')
    this.friend.setCurChat(this)

    this._isMounted = false
    this.onSend = this.onSend.bind(this)
    this.onSendFile = this.onSendFile.bind(this)
    this.onSendLocation = this.onSendLocation.bind(this)
    this.onLongPress = this.onLongPress.bind(this)
    this.onReceive = this.onReceive.bind(this)
    this.renderCustomActions = this.renderCustomActions.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.renderSystemMessage = this.renderSystemMessage.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.onLoadEarlier = this.onLoadEarlier.bind(this)
    this.onReceiveProgress = this.onReceiveProgress.bind(this)
    this.renderTicks = this.renderTicks.bind(this)
  }

  componentDidMount() {
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
          m.message.message.progress = value.percentage
          if (value.percentage === 100) {
            m.message.message.isReceived = 1
          }
        }
        return {
          ...m,
        }
      }),
    })
  }

  componentWillUnmount() {
    this.friend.setCurChat(undefined)
    this._isMounted = false
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
  _loadChatMsg(msg) {
    let chatMsg = {
      _id: msg.msgId,
      createdAt: new Date(msg.time),
      user: {
        _id: msg.id,
        name: msg.name,
      },
      type: msg.type,
      message: msg.msg,
      system: msg.system,
    }

    if (msg.msg.type) {
      if (msg.msg.message.message) {
        chatMsg.text = msg.msg.message.message
      } else {
        chatMsg.text = ' '
      }
    } else {
      chatMsg.text = msg.msg
    }
    return chatMsg
  }
  //将接收或要发送的消息转为chat消息
  _getChatMsg(messageStr, msgId) {
    let message = JSON.parse(messageStr)
    let chatMsg = {
      _id: msgId,
      createdAt: new Date(message.time),
      user: {
        _id: message.user.id,
        name: message.user.name,
      },
      type: message.type,
      message: message.message,
    }

    if (message.message.type) {
      if (message.message.message.message) {
        chatMsg.text = message.message.message.message
      } else {
        chatMsg.text = ' '
      }
    } else {
      chatMsg.text = message.message
    }
    return chatMsg
  }

  //发送普通消息
  onSend(messages = []) {
    let bGroup = 1
    let groupID = messages[0].user._id
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
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
      },
      time: time,
    }
    let msgId = this.friend.getMsgId(this.targetUser.id)
    //保存
    this.friend.storeMessage(message, this.targetUser.id, msgId)
    //显示
    let chatMsg = this._getChatMsg(JSON.stringify(message), msgId)
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
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
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
      },
      time: time,
    }
    let msgId = this.friend.getMsgId(this.targetUser.id)
    //保存
    this.friend.storeMessage(message, this.targetUser.id, msgId)
    //显示
    let Chatmsg = this._getChatMsg(JSON.stringify(message), msgId)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, Chatmsg),
      }
    })
    //发送
    this.friend._sendMessage(JSON.stringify(message), this.targetUser.id, false)
  }

  async onSendFile(filepath) {
    let bGroup = 1
    let groupID = this.curUser.userId
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
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
    this.friend.storeMessage(informMsg, this.targetUser.id, msgId)
    //显示
    let ChatMsg = this._getChatMsg(JSON.stringify(informMsg), msgId)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, ChatMsg),
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
      message.message.message.fileName,
      message.message.message.queueName,
      receivePath,
      this.targetUser.id,
      message._id,
    )
  }
  async onLongPress(context, message) {
    if (message.message.type) {
      switch (message.message.type) {
        case MSGConstant.MSG_FILE_NOTIFY:
          if (message.user._id !== this.curUser.userId) {
            let userPath = await FileTools.appendingHomeDirectory(
              ConstPath.UserPath + this.curUser.userName,
            )
            let receivePath = userPath + '/ReceivedFiles'
            if (message.message.message.isReceived === 0) {
              this.downloadmessage = message
              this.downloadreceivePath = receivePath
              this.download.setDialogVisible(true)
            } else {
              let toPath = await FileTools.appendingHomeDirectory(
                ConstPath.Import + '/weChat.zip',
              )
              FileTools.copyFile(
                receivePath + '/' + message.message.message.fileName,
                toPath,
              )
              this.import.setDialogVisible(true)
            }
          }
          break
        default:
          alert('undefined')
      }
    } else {
      alert('1')
    }
  }

  render() {
    return (
      <Animated.View style={{ flex: 1, bottom: this.state.chatBottom }}>
        <Container
          ref={ref => (this.container = ref)}
          headerProps={{
            title: this.targetUser['title'],
            withoutBack: false,
            navigation: this.props.navigation,
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
            onLongPress={this.onLongPress}
            renderActions={this.renderCustomActions}
            renderBubble={this.renderBubble}
            renderTicks={this.renderTicks}
            renderSystemMessage={this.renderSystemMessage}
            renderCustomView={this.renderCustomView}
            renderFooter={this.renderFooter}
            renderAvatar={this.renderAvatar}
            renderMessageText={props => {
              if (
                props.currentMessage.message.type &&
                props.currentMessage.message.type ===
                  MSGConstant.MSG_FILE_NOTIFY
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
      currentMessage.message.type &&
      currentMessage.message.type === MSGConstant.MSG_FILE_NOTIFY
    ) {
      let progress = currentMessage.message.message.progress
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

  renderCustomView(props) {
    return <CustomView {...props} />
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
}

const styles = StyleSheet.create({
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
