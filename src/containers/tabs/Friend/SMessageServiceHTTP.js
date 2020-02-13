import { Buffer } from 'buffer'
import fetch from 'node-fetch'

export default class SMessageServiceHTTP {
  //对方是否连接上RabbitMQ服务，没有连接上则发送push
  static async isConnectService(talkId) {
    let auth = Buffer.from(
      GLOBAL.MSG_UserName + ':' + GLOBAL.MSG_Password,
    ).toString('base64')
    let url =
      'http://' +
      GLOBAL.MSG_IP +
      ':' +
      GLOBAL.MSG_HTTP_Port +
      '/api/queues/%2F/Message_' +
      talkId +
      '?columns=consumers'
    let extraData = {
      headers: {
        Authorization: 'Basic ' + auth,
      },
    }
    let response = await fetch(url, extraData)
    let data = await response.json()
    return data.consumers === 0 ? false : true
  }

  static async getConsumer(userId) {
    try {
      let auth = Buffer.from(
        GLOBAL.MSG_UserName + ':' + GLOBAL.MSG_Password,
      ).toString('base64')
      let url =
        'http://' +
        GLOBAL.MSG_IP +
        ':' +
        GLOBAL.MSG_HTTP_Port +
        '/api/queues/%2F/Message_' +
        userId +
        '?columns=consumer_details'
      let extraData = {
        headers: {
          Authorization: 'Basic ' + auth,
        },
      }
      let comsumer = await fetch(url, extraData)
        .then(data => {
          return data.json()
        })
        .then(data => {
          return data.consumer_details[0].consumer_tag
        })
        .catch(() => {
          return false
        })
      return comsumer
    } catch (e) {
      return false
    }
  }

  static async getConnection(userId) {
    let auth = Buffer.from(
      GLOBAL.MSG_UserName + ':' + GLOBAL.MSG_Password,
    ).toString('base64')
    let url =
      'http://' +
      GLOBAL.MSG_IP +
      ':' +
      GLOBAL.MSG_HTTP_Port +
      '/api/queues/%2F/Message_' +
      userId +
      '?columns=consumer_details'
    let extraData = {
      headers: {
        Authorization: 'Basic ' + auth,
      },
    }
    let connectionName = await fetch(url, extraData)
      .then(data => {
        return data.json()
      })
      .then(data => {
        return data.consumer_details[0].channel_details.connection_name
      })
      .catch(() => {
        return false
      })
    return connectionName
  }

  static async closeConnection(connectionName) {
    let auth = Buffer.from(
      GLOBAL.MSG_UserName + ':' + GLOBAL.MSG_Password,
    ).toString('base64')
    let url =
      'http://' +
      GLOBAL.MSG_IP +
      ':' +
      GLOBAL.MSG_HTTP_Port +
      '/api/connections/' +
      connectionName
    encodeURI(url)
    let extraData = {
      headers: {
        Authorization: 'Basic ' + auth,
      },
      method: 'DELETE',
    }
    let res = await fetch(url, extraData)
      .then(data => {
        return data
      })
      .then(data => {
        return data
      })
      .catch(() => {
        return false
      })
    return res
  }
}
