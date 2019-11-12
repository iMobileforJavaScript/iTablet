export default class MessageDataHandle {
  static addChat = undefined

  static setHandle(handle) {
    MessageDataHandle.addChat = handle
  }

  static pushMessage(payload) {
    if (MessageDataHandle.addChat) {
      payload['operate'] = 'add'
      MessageDataHandle.addChat(payload)
    }
  }
  static unReadMessage(payload) {
    if (MessageDataHandle.addChat) {
      payload['operate'] = 'unRead'
      MessageDataHandle.addChat(payload)
    }
  }

  static readMessage(payload) {
    if (MessageDataHandle.addChat) {
      payload['operate'] = 'read'
      MessageDataHandle.addChat(payload)
    }
  }

  static delMessage(payload) {
    if (MessageDataHandle.addChat) {
      payload['operate'] = 'del'
      MessageDataHandle.addChat(payload)
    }
  }

  static editMessage(payload) {
    if (MessageDataHandle.addChat) {
      payload['operate'] = 'edit'
      MessageDataHandle.addChat(payload)
    }
  }
}
