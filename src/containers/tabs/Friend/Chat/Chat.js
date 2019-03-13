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
    this._isMounted = true
    this.setState(() => {
      return {
        messages: require('./data/messages.js'),
        messageInfo: this.props.navigation.getParam('messageInfo'),
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

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState(previousState => {
          return {
            messages: GiftedChat.prepend(
              previousState.messages,
              require('./data/old_messages.js'),
            ),
            loadEarlier: false,
            isLoadingEarlier: false,
          }
        })
      }
    }, 1000) // simulating network
  }
  onSend(messages = []) {
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      }
    })

    // for demo purpose
    this.answerDemo(messages)
  }

  answerDemo(messages) {
    if (messages.length > 0) {
      if (messages[0].image || messages[0].location || !this._isAlright) {
        // eslint-disable-next-line
        this.setState(previousState => {
          return {
            typingText: 'React Native is typing',
          }
        })
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!')
          } else if (messages[0].location) {
            this.onReceive('My favorite place')
          } else {
            if (!this._isAlright) {
              this._isAlright = true
              this.onReceive('Alright')
            }
          }
        }
      }

      // eslint-disable-next-line
      this.setState(previousState => {
        return {
          typingText: null,
        }
      })
    }, 1000)
  }

  onReceive(text) {
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: '白小白',
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      }
    })
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
            {props.currentMessage.user.name[0]}
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
          fontSize: scaleSize(14),
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

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state['messageInfo']['title'],
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
            _id: 1, // sent messages should have same user._id
            name: 'Developer Xie',
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
