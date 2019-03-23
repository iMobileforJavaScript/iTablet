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
    }

    this.friend = this.props.navigation.getParam('friend')
    this.targetUser = this.props.navigation.getParam('target')
    this.curUser = this.props.navigation.getParam('curUser')
    this.friend.setCurChat(this)

    this._isMounted = false
    this.onSend = this.onSend.bind(this)
    this.onReceive = this.onReceive.bind(this)
    this.renderCustomActions = this.renderCustomActions.bind(this)
    this.renderBubble = this.renderBubble.bind(this)
    this.renderSystemMessage = this.renderSystemMessage.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
    this.onLoadEarlier = this.onLoadEarlier.bind(this)

    this._isAlright = null
  }

  componentDidMount() {
    let curMsg = []
    // curMsg = [
    //   {
    //     _id: Math.round(Math.random() * 1000000),
    //     text: 'Yes, and I use Gifted Chat!',
    //     createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    //     user: {
    //       _id: 1,
    //       name: 'xiezhiyan',
    //     },
    //     sent: true,
    //     received: true,
    //     // location: {
    //     //   latitude: 48.864601,
    //     //   longitude: 2.398704
    //     // },
    //   },
    //   {
    //     _id: Math.round(Math.random() * 1000000),
    //     text: 'Are you building a chat app?',
    //     createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    //     user: {
    //       _id: 44,
    //       name: '白小白',
    //     },
    //   },
    //   {
    //     _id: Math.round(Math.random() * 1000000),
    //     text: 'dfgfdgsdfg?',
    //     createdAt: new Date(Date.UTC(2016, 7, 30, 17, 28, 0)),
    //     user: {
    //       _id: 43,
    //       name: '白小白',
    //     },
    //   },
    //   {
    //     _id: Math.round(Math.random() * 1000000),
    //     text: 'You are officially rocking GiftedChat.',
    //     createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
    //     system: true,
    //   },
    // ]

    //加载两条
    let n = 0
    for (let i = this.targetUser.message.length - 1; i >= 0; i--) {
      if (n++ > 1) {
        break
      }
      let msg = this.targetUser.message[i]

      let chatMsg = {
        _id: msg.time,
        text: msg.msg,
        createdAt: new Date(msg.time),
        user: { _id: msg.id, name: msg.name },
      }
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

    let oldMsg = [
      // {
      //   _id: Math.round(Math.random() * 1000000),
      //   text:
      //     'It uses the same design as React, letting you compose a rich mobile UI from declarative components https://facebook.github.io/react-native/',
      //   createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
      //   user: {
      //     _id: 1,
      //     name: 'Developer',
      //   },
      // },
      // {
      //   _id: Math.round(Math.random() * 1000000),
      //   text: 'React Native lets you build mobile apps using only JavaScript',
      //   createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
      //   user: {
      //     _id: 1,
      //     name: 'Developer',
      //   },
      // },
      // {
      //   _id: Math.round(Math.random() * 1000000),
      //   text: 'This is a system message.',
      //   createdAt: new Date(Date.UTC(2016, 7, 30, 17, 20, 0)),
      //   system: true,
      // },
    ]
    if (this.targetUser.message.length > 2) {
      for (let i = this.targetUser.message.length - 1 - 2; i >= 0; i--) {
        let msg = this.targetUser.message[i]

        let chatMsg = {
          _id: msg.time,
          text: msg.msg,
          createdAt: new Date(msg.time),
          user: { _id: msg.id, name: msg.name },
        }
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
  onSend(messages = []) {
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      }
    })
    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      message: messages[0].text,
      type: 1,
      user: { name: messages[0].user.name, id: messages[0].user._id },
      time: time,
      system: 0,
    }
    this.friend._sendMessage(JSON.stringify(message), this.targetUser.id, false)
    // for demo purpose
    // this.answerDemo(messages)
  }

  // answerDemo(messages) {
  //   if (messages.length > 0) {
  //     if (messages[0].image || messages[0].location || !this._isAlright) {
  //       // eslint-disable-next-line
  //       this.setState(previousState => {
  //         return {
  //           typingText: 'React Native is typing',
  //         }
  //       })
  //     }
  //   }
  //   this.onReceive('Alright')
  //
  //   setTimeout(() => {
  //     if (this._isMounted === true) {
  //       if (messages.length > 0) {
  //         if (messages[0].image) {
  //           this.onReceive('Nice picture!')
  //         } else if (messages[0].location) {
  //           this.onReceive('My favorite place')
  //         } else {
  //           if (!this._isAlright) {
  //             this._isAlright = true
  //
  //           }
  //         }
  //       }
  //     }
  //
  //     // eslint-disable-next-line
  //     this.setState(previousState => {
  //       return {
  //         typingText: null,
  //       }
  //     })
  //   }, 1000)
  //
  // }

  onReceive(text) {
    let messageObj = JSON.parse(text)

    let bSystem = false
    if (messageObj.system === 1) {
      bSystem = true
    }
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: messageObj.message,
          createdAt: new Date(messageObj.time),
          system: bSystem,
          user: {
            _id: messageObj.user.id,
            name: messageObj.user.name,
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      }
    })
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
      'Action 1': props => {
        alert('option 1')
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
