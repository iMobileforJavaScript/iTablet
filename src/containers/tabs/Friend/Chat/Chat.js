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
  NativeModules,
  NativeEventEmitter,
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
// eslint-disable-next-line import/no-unresolved
import RCTDeviceEventEmitter from 'RCTDeviceEventEmitter'
import { ConstPath, EventConst } from '../../../../constants'
import { color } from '../../../../styles'
import { FileTools } from '../../../../native'
import { Toast } from '../../../../utils/index'
import { stat } from 'react-native-fs'

let Top = scaleSize(38)
if (Platform.OS === 'ios') {
  Top = scaleSize(80)
}

const SMessageServiceiOS = NativeModules.SMessageService
const iOSEventEmitter = new NativeEventEmitter(SMessageServiceiOS)

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
      let chatMsg = this.loadMsgByType(msg)
      curMsg.push(chatMsg)
    }
    // curMsg.push({_id: Math.round(Math.random() * 1000000), text: '上次聊天到这', system: true})

    this._isMounted = true
    this.setState(() => {
      return {
        messages: curMsg,
      }
    })

    if (Platform.OS === 'iOS') {
      this.listener = iOSEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_RECEIVE_FILE,
        this.onReceiveProgress,
      )
      this.listener = iOSEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_SEND_FILE,
        this.onReceiveProgress,
      )
    } else {
      this.listener = RCTDeviceEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_RECEIVE_FILE,
        this.onReceiveProgress,
      )
      this.listener = RCTDeviceEventEmitter.addListener(
        EventConst.MESSAGE_SERVICE_SEND_FILE,
        this.onReceiveProgress,
      )
    }

    // this.setState({
    //   messageInfo:this.props.navigation.getParam('messageInfo'),
    //   messages: [
    //     {
    //       _id: 1,
    //       text: 'Hello developer',
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //   ],
    // })
  }

  onReceiveProgress(value) {
    this.setState({
      messages: this.state.messages.map(m => {
        if (m._id === value.msgId) {
          m.message.message.progress = value.percentage
        }
        return {
          ...m,
        }
      }),
    })
    //todo input to redux
    // this.friend._onReceiveProgress(value)
    // let reduxMessage =  this.friend.props.chat[this.curUser.userId][value.talkId].history[value.msgId]
    // reduxMessage.message.message.progress = value.percentage
    // this.friend.props.editChat &&
    //   this.friend.props.props.editChat({
    //     userId: this.curUser.userId,
    //     talkId: value.talkId,
    //     msgId: value.msgId,
    //     editItem: reduxMessage,
    //   })
  }

  componentWillUnmount() {
    this.friend.setCurChat(undefined)
    this._isMounted = false
    this.listener.remove()
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
        let chatMsg = this.loadMsgByType(msg)
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

  loadMsgByType(msg) {
    if (msg.msg.type) {
      switch (msg.msg.type) {
        default:
          return {
            _id: msg.msgId,
            text: ' ',
            createdAt: new Date(msg.time),
            user: { _id: msg.id, name: msg.name },
            type: msg.type,
            message: msg.msg,
          }
        case 6: //文件
          return {
            _id: msg.msgId,
            text: msg.msg.message.message,
            createdAt: new Date(msg.time),
            user: { _id: msg.id, name: msg.name },
            type: msg.type,
            message: msg.msg,
          }
        case 10: //位置
          return {
            _id: msg.msgId,
            text: msg.msg.message.message,
            createdAt: new Date(msg.time),
            user: { _id: msg.id, name: msg.name },
            type: msg.type,
            message: msg.msg,
            // location: {
            //   latitude: msg.msg.message.latitude,
            //   longitude: msg.msg.message.longitude,
            // },
          }
      }
    }
    return {
      _id: msg.msgId,
      text: msg.msg,
      createdAt: new Date(msg.time),
      user: { _id: msg.id, name: msg.name },
      type: msg.type,
      message: msg.msg,
    }
  }

  onSend(messages = []) {
    let bGroup = 1
    let groupID = messages[0].user._id
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
    }
    let ctime = new Date()
    let time = Date.parse(ctime)
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
    // for demo purpose
    // this.answerDemo(messages)
    messages[0].message = messages[0].text
    messages[0].type = bGroup
    let msgId = this.friend._getMsgId(this.targetUser.id)
    messages[0]._id = msgId
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      }
    })

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
        type: 10,
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
    let msgId = this.friend._getMsgId(this.targetUser.id)
    let msg = {
      //添加到giftedchat的消息
      _id: msgId,
      text: positionStr,
      type: 1,
      user: { name: this.curUser.nickname, _id: this.curUser.userId },
      createdAt: time,
      system: 0,
      // location: {
      //   latitude: value.latitude,
      //   longitude: value.longitude,
      // },
      message: {
        type: 10,
        message: {
          message: positionStr,
          longitude: value.longitude,
          latitude: value.latitude,
        },
      },
    }
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, msg),
      }
    })

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
    let message = {
      //要发送的消息
      type: bGroup,
      user: {
        name: this.curUser.nickname,
        id: this.curUser.userId,
        groupID: groupID,
      },
      time: time,
      system: 0,
      message: {
        type: 3, //文件本体
        message: {
          data: '',
          index: 0,
          length: 0,
        },
      },
    }

    let msgId = this.friend._getMsgId(this.targetUser.id)
    let fileName = filepath.substr(filepath.lastIndexOf('/') + 1)

    let statResult = await stat(filepath)
    let msg = {
      //添加到giftedchat的消息
      _id: msgId,
      text: '[文件]',
      type: 1, //文件接收通知
      user: { name: this.curUser.nickname, _id: this.curUser.userId },
      createdAt: time,
      system: 0,
      message: {
        type: 6,
        message: {
          message: '[文件]',
          fileName: fileName,
          fileSize: statResult.size,
          queueName: '',
          filePath: filepath,
          progress: 0,
        },
      },
    }
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, msg),
      }
    })

    this.friend._sendFile(
      JSON.stringify(message),
      filepath,
      this.targetUser.id,
      msgId,
    )
  }

  showInformSpot = b => {
    this.setState({ showInformSpot: b })
  }
  onReceive(text, bSystem) {
    let messageObj = JSON.parse(text)
    let msgId = this.friend._getMsgId(this.targetUser.id) - 1
    let msg = {}
    if (!messageObj.message.type) {
      //特殊处理文本消息
      msg = {
        _id: msgId,
        text: messageObj.message,
        createdAt: new Date(messageObj.time),
        system: bSystem,
        user: {
          _id: messageObj.user.id,
          name: messageObj.user.name,
          // avatar: 'https://facebook.github.io/react/img/logo_og.png',
        },
        type: messageObj.type,
        message: messageObj.message,
      }
    } else {
      msg = {
        _id: msgId,
        text: messageObj.message.message.message,
        createdAt: new Date(messageObj.time),
        system: bSystem,
        user: {
          _id: messageObj.user.id,
          name: messageObj.user.name,
          // avatar: 'https://facebook.github.io/react/img/logo_og.png',
        },
        type: messageObj.type,
        message: messageObj.message,
      }
      if (messageObj.message.type === 6) {
        //文件通知
        msg.message.message.isReceived = 0
      } else if (messageObj.message.type === 10) {
        //位置
        msg.location = {
          latitude: messageObj.message.message.latitude,
          longitude: messageObj.message.message.longitude,
        }
      }
    }

    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, msg),
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
    this.setState(previousState => {
      let length = previousState.messages
      let i = 0
      for (; i < length; i++) {
        if (previousState.messages[i]._id === message._id) {
          break
        }
      }
      previousState.messages[i].message.message.isReceived = 1
      return {
        messages: previousState.messages,
      }
    })
  }
  async onLongPress(context, message) {
    if (message.message.type) {
      switch (message.message.type) {
        case 6:
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
                props.currentMessage.message.type === 6
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
    if (currentMessage.message.type && currentMessage.message.type === 6) {
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
        confirmBtnTitle={'确定'}
        cancelBtnTitle={'取消'}
        confirmAction={() => {
          this.import.setDialogVisible(false)
          GLOBAL.Loading.setLoading(true, '数据导入中')

          FileTools.importData().then(
            result => {
              GLOBAL.Loading.setLoading(false)
              result && Toast.show('导入成功')
            },
            () => {
              GLOBAL.Loading.setLoading(false)
              Toast.show('导入失败')
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
        <Text style={styles.promptTtile}>{'是否导入数据'}</Text>
      </View>
    )
  }

  renderDownloadDialog = () => {
    return (
      <Dialog
        ref={ref => (this.download = ref)}
        type={'modal'}
        confirmBtnTitle={'确定'}
        cancelBtnTitle={'取消'}
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
        <Text style={styles.promptTtile}>{'是否接收数据'}</Text>
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
