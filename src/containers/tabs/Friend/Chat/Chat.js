/**
 * Created by imobile-xzy on 2019/3/8.
 */
import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native'
import {
  GiftedChat,
  Actions,
  Bubble,
  MessageText,
  SystemMessage,
} from 'react-native-gifted-chat'
import Container from '../../../../components/Container'
import { scaleSize } from '../../../../utils/screen'

import CustomActions from './CustomActions'
import CustomView from './CustomView'

let Top = scaleSize(60)
if (Platform.OS === 'android') {
  Top -= 20
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
    }

    this.friend = this.props.navigation.getParam('friend')
    this.targetUser = this.props.navigation.getParam('target')
    this.curUser = this.props.navigation.getParam('curUser')
    this.friend.setCurChat(this)

    this._isMounted = false
    this.onSend = this.onSend.bind(this)
    this.onSendFile = this.onSendFile.bind(this)
    this.onLongPress = this.onLongPress.bind(this)
    this.onReceive = this.onReceive.bind(this)
    this.renderCustomActions = this.renderCustomActions.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.renderSystemMessage = this.renderSystemMessage.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.onLoadEarlier = this.onLoadEarlier.bind(this)
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

  
  loadMsgByType(msg){
    switch(msg.type){
      default:
          return {
          _id: msg.msgId,
          text: msg.msg,
          createdAt: new Date(msg.time),
          user: { _id: msg.id, name: msg.name },
          type: msg.type, //根据type渲染
        }
      case(4):
          return {
          _id: msg.msgId,
          text: msg.msg,
          createdAt: new Date(msg.time),
          user: { _id: msg.id, name: msg.name },
          type: msg.type, //根据type渲染
          fileName: msg.fileName,
          queueName: msg.queueName,
          isReceived: msg.isReceived,
        }
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
    messages[0].type = bGroup
    let msgId = this.friend._getChatId(this.targetUser.id)
    messages[0]._id = msgId
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      }
    })

    this.friend._sendMessage(JSON.stringify(message), this.targetUser.id, false)
  }

  onSendFile() {
    // filepath1
    let bGroup = 1
    let groupID = this.curUser.userId
    if (this.targetUser.id.indexOf('Group_') != -1) {
      bGroup = 2
      groupID = this.targetUser.id
    }
    let filepath = '/sdcard/send.zip'
    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      type: 3, //文件
      user: { name: this.curUser.nickname, id: this.curUser.userId, groupID: groupID },
      time: time,
      system: 0,
    }

    let msgId = this.friend._getChatId(this.targetUser.id)
    let msg = {
      _id: msgId,
      text: '[文件]',
      type: 4, //文件接收通知
      user: { name: this.curUser.nickname, _id: this.curUser.userId },
      createdAt: time,
      system: 0,
      fileName: '',
      queueName: '',
    }
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, msg),
      }
    })

    this.friend._sendFile(JSON.stringify(message), filepath, this.targetUser.id)
  }

  showInformSpot = b => {
    this.setState({ showInformSpot: b })
  }
  onReceive(text, bSystem) {
    let messageObj = JSON.parse(text)
    let msgId = this.friend._getChatId(this.targetUser.id) - 1
    let msg = {
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
    }
    if(msg.type === 4){
      msg.fileName = messageObj.fileName
      msg.queueName = messageObj.queueName
      msg.isReceived = 0
    }

    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, msg),
        showInformSpot: false,
      }
    })
  }

  onLongPress(context, message) {
    console.log(message)
    switch (message.type) {
      case 1:
        alert(GiftedChat.getMessages())
        break
      case 4:
        if(message.user._id !== this.curUser.userId){
          alert('4')
          if(message.isReceived === 0){
            this.friend._receiveFile(message.fileName, message.queueName, this.targetUser.id, message._id)
            this.setState(previousState => {
              let length = previousState.messages
              for(i=0; i<length;i++){
                if(previousState.messages[i]._id===message._id){
                  break
                }
              }
              previousState.messages[i].isReceived = 1
              return {
                messages: previousState.messages,
              }
            })
          }else{
            alert("已接收此文件")
          }
        }
        
        break
      default:
        alert('undefined')
    }
  }

  render() {
    return (
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
              left: scaleSize(80),
            }}
          />
        ) : null}
        <GiftedChat
          placeholder="message..."
          messages={this.state.messages}
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
          renderSystemMessage={this.renderSystemMessage}
          renderCustomView={this.renderCustomView}
          renderFooter={this.renderFooter}
          renderAvatar={this.renderAvatar}
          renderMessageText={props => (
            <MessageText
              {...props}
              customTextStyle={{ fontSize: scaleSize(20) }}
            />
          )}
        />
      </Container>
    )
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return <CustomActions {...props} />
    }
    const options = {
      // eslint-disable-next-line
      '发送文件': props => {
        this.onSendFile()
      },
      // eslint-disable-next-line
      'Action 2': props => {
        alert('option 2')
      },
      Cancel: () => {},
    }
    return <Actions {...props} options={options} />
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
            backgroundColor: 'white',
          },
          right: {
            //我方的气泡
            backgroundColor: 'blue',
          },
        }}
      />
    )
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
})
export default Chat
