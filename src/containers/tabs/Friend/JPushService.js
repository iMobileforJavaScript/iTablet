import { Platform } from 'react-native'
import JPushModule from 'jpush-react-native'
import { Buffer } from 'buffer'
import fetch from 'node-fetch'
import MsgConstant from './MsgConstant'

export default class JPushService {
  static async push(messageStr, talkId) {
    let bCon = await this.isConnectService(talkId)
    if (bCon) return
    let messageObj = JSON.parse(messageStr)
    let messageText = messageObj.message
    if (messageObj.message.message) {
      messageText = messageObj.message.message.message
    }
    let request = {
      platform: 'all',
      audience: { alias: [talkId] },
      notification: {
        android: {
          alert: messageText,
          title: messageObj.user.name,
        },
        ios: {
          alert: messageText,
          sound: 'default',
          badge: '+1',
        },
      },
    }

    let url = 'https://api.jpush.cn/v3/push'
    let extraData = {
      headers: {
        Authorization:
          'Basic N2QyNDcwYmFhZDIwZTI3M2NkNmU1M2NjOjY0MDhjNzYxODdhZWEzN2Q3MjkyZWQ3Yg==',
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify(request),
    }
    let result = await fetch(url, extraData)
      .then(data => {
        return data.json()
      })
      .then(data => {
        return data
      })
    return result
  }

  //对方是否连接上RabbitMQ服务，没有连接上则发送push
  static async isConnectService(talkId) {
    let auth = Buffer.from(
      MsgConstant.MSG_UserName + ':' + MsgConstant.MSG_Password,
    ).toString('base64')
    let url =
      'http://' +
      MsgConstant.MSG_IP +
      ':15672/api/queues/%2F/Message_' +
      talkId +
      '?columns=consumers'
    let extraData = {
      headers: {
        Authorization: 'Basic ' + auth,
      },
    }
    let bCon = await fetch(url, extraData)
      .then(data => {
        return data.json()
      })
      .then(data => {
        return data.consumers === 0 ? false : true
      })
    return bCon
  }

  //userId
  static setAlias(userId) {
    // eslint-disable-next-line no-unused-vars
    JPushModule.setAlias(userId, result => {})
  }

  static deleteAlias = () => {
    // eslint-disable-next-line no-unused-vars
    JPushModule.deleteAlias(result => {})
  }

  static init(userId) {
    if (Platform.OS === 'android') {
      JPushModule.initPush()
      JPushModule.notifyJSDidLoad(resultCode => {
        // eslint-disable-next-line no-empty
        if (resultCode === 0) {
        }
      })
      // JPushModule.setStyleBasic()
    } else {
      JPushModule.setupPush()
    }

    this.removeListeners()

    if (userId === undefined) {
      this.deleteAlias()
      JPushModule.stopPush()
    } else {
      JPushModule.resumePush()
      this.setAlias(userId)
      this.addListeners()
    }
  }

  static addListeners() {
    // this.receiveCustomMsgListener = map => {
    // console.log('extras: ' + map.extras)
    // }
    // JPushModule.addReceiveCustomMsgListener(this.receiveCustomMsgListener)
    // this.receiveNotificationListener = map => {
    // console.log('alertContent: ' + map.alertContent)
    // console.log('extras: ' + map.extras)
    // }
    // JPushModule.addReceiveNotificationListener(this.receiveNotificationListener)
    // this.openNotificationListener = map => {
    // console.log('Opening notification!')
    // console.log('map.extra: ' + map.extras)
    // this.jumpSecondActivity()
    // }
    // JPushModule.addReceiveOpenNotificationListener(this.openNotificationListener)
    // this.getRegistrationIdListener = registrationId => {
    //   console.log('Device register succeed, registrationId ' + registrationId)
    // }
    // JPushModule.addGetRegistrationIdListener(this.getRegistrationIdListener)
  }

  static removeListeners() {
    // JPushModule.removeReceiveCustomMsgListener(this.receiveCustomMsgListener)
    // JPushModule.removeReceiveNotificationListener(this.receiveNotificationListener)
    // JPushModule.removeReceiveOpenNotificationListener(this.openNotificationListener)
    // JPushModule.removeGetRegistrationIdListener(this.getRegistrationIdListener)
    // console.log('Will clear all notifications')
    JPushModule.clearAllNotifications()
  }
}
