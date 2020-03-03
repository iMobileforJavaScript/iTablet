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
import { SimpleDialog, ImageViewer } from '../index'
import { SMap, EngineType, DatasetType } from 'imobile_for_reactnative'
import Container from '../../../../components/Container'
import { scaleSize } from '../../../../utils/screen'
import NavigationService from '../../../NavigationService'
import CustomActions from './CustomActions'
import CustomView from './CustomView'
import { ConstPath, ConstOnline } from '../../../../constants'
import { FileTools } from '../../../../native'
import { Toast, LayerUtils } from '../../../../utils/index'
import RNFS, { stat } from 'react-native-fs'
import MSGConstant from '../MsgConstant'
import { getLanguage } from '../../../../language/index'
import FriendListFileHandle from '../FriendListFileHandle'
import CoworkTouchableView from '../CoworkTouchableView'
// eslint-disable-next-line import/no-unresolved
import ImageResizer from 'react-native-image-resizer'
import DataHandler from '../../Mine/DataHandler'
import 'moment/locale/zh-cn'

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
    closeWorkspace: () => {},
    getLayers: () => {},
  }
  constructor(props) {
    super(props)
    this.friend = global.getFriend()
    this.curUser = this.friend.props.user.currentUser
    this.targetId = this.props.navigation.getParam('targetId')
    this.targetUser = this.friend.getTargetUser(this.targetId)
    this.friend.setCurChat(this)
    this.action = this.props.navigation.getParam('action')
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

    this.action && this._handleAciton(this.action)
  }

  _handleAciton = async action => {
    NavigationService.getTopLevelNavigator()
    if (action.length > 0) {
      for (let i = 0; i < action.length; i++) {
        if (action[i].name === 'onSendFile') {
          await this.onSendFile(
            action[i].type,
            action[i].filePath,
            action[i].fileName,
            action[i].extraInfo,
          )
        }
      }
    }
  }

  onReceiveProgress(value) {
    this.setState({
      messages: this.state.messages.map(m => {
        if (m._id === value.msgId) {
          m.originMsg.message.message.progress = value.percentage
          m.downloading = true
          if (value.percentage === 100 || value.percentage === 0) {
            m.downloading = false
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
      this.SimpleDialog.setConfirm(() => {
        this.SimpleDialog.setVisible(false)
        this.endCowork()
      })
      this.SimpleDialog.setText(
        getLanguage(global.language).Friends.ALERT_EXIT_COWORK,
      )
      this.SimpleDialog.setVisible(true)
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

  endCowork = async () => {
    let close = () => {
      this.friend.setCurMod(undefined)
      this.setCoworkMode(false)
      global.coworkMode = false
      this.props.closeWorkspace()
      NavigationService.pop()
      this.props.navigation.replace('CoworkTabs', {
        targetId: this.targetId,
      })
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
              this.props.navigation.replace('CoworkTabs', {
                targetId: this.targetId,
              })
            })
        } else {
          close()
        }
      })
    } else {
      close()
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

  showNoFriendNotify = msgId => {
    msgId += 1
    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      message: '',
      type: MSGConstant.MSG_REJECT,
      user: {
        name: this.targetUser.userName,
        id: this.targetUser.userId,
        groupID: this.targetUser.userId,
        groupName: '',
      },
      time: time,
    }
    //保存
    let storeMsg = this.friend.storeMessage(message, this.targetUser.id, msgId)
    //显示
    let chatMsg = this._loadChatMsg(storeMsg)
    this.setState(previousState => {
      return {
        messages: GiftedChat.append(previousState.messages, chatMsg),
      }
    })
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
    let isFriend = FriendListFileHandle.getIsFriend(this.targetUser.id)
    if (isFriend === 0) {
      //对方还未添加您为好友
      this.showNoFriendNotify(msgId)
      return
    }
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
    let isFriend = FriendListFileHandle.getIsFriend(this.targetUser.id)
    if (isFriend === 0) {
      //对方还未添加您为好友
      this.showNoFriendNotify(msgId)
      return
    }
    this.friend._sendMessage(JSON.stringify(message), this.targetUser.id, false)
  }

  async onSendFile(type, filePath, fileName, extraInfo) {
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
    //要发送的文件,发送到rabbitMQ时使用
    // let message = {
    //   type: bGroup,
    //   user: {
    //     name: this.curUser.nickname,
    //     id: this.curUser.userId,
    //     groupID: groupID,
    //     groupName: groupName,
    //   },
    //   time: time,
    //   message: {
    //     type: MSGConstant.MSG_FILE, //文件本体
    //     message: {
    //       data: '',
    //       index: 0,
    //       length: 0,
    //     },
    //   },
    // }

    fileName = fileName + '.zip'
    let statResult = await stat(filePath)
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
        type: type,
        message: {
          // message: '[文件]',
          fileName: fileName,
          fileSize: statResult.size,
          filePath: filePath,
          progress: 0,
        },
      },
    }
    if (extraInfo) {
      Object.assign(informMsg.message.message, extraInfo)
    }

    let msgId = this.friend.getMsgId(this.targetUser.id)
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
    let isFriend = FriendListFileHandle.getIsFriend(this.targetUser.id)
    if (isFriend === 0) {
      //对方还未添加您为好友
      this.showNoFriendNotify(msgId)
      return
    }
    informMsg.message.message.filePath = ''
    this.friend.sendFile(
      informMsg,
      filePath,
      this.targetUser.id,
      msgId,
      result => {
        FileTools.deleteFile(filePath)
        if (!result) {
          this.friend.onReceiveProgress({
            talkId: this.targetUser.id,
            msgId: msgId,
            percentage: 0,
          })
          Toast.show(getLanguage(global.language).Friends.SEND_FAIL_NETWORK)
        } else {
          Toast.show(getLanguage(global.language).Friends.SEND_SUCCESS)
        }
      },
    )
  }

  /**
   * 发送图片
   */
  onSendPicture = async (data, sendToServer = true) => {
    // sendToServer = false

    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + this.curUser.userName + '/Data/Temp',
    )
    /**
     * uri
     * android:
     * 1. /storage/emulated/0/iTablet/Common/Images/02.png
     * 2. content://media/external/images/media/214684
     *    ==> /storage/emulated/0/ttt.fw
     *
     * ios:
     * 1. /var/mobile/Containers/Data/Application/B98D0EBB-9D73-45E9-94E7-38C327F2A9B9/Documents/iTablet/Common/Images/02.png
     * 2. assets-library://asset/asset.PNG?id=381993E0-7631-4BA0-A351-0536E30FAED0&ext=PNG
     *   ==> X
     */
    let uri = data.uri
    let filePath = uri
    let fileName
    let hasTempFile = false
    if (uri.indexOf('assets-library://') === 0) {
      let destPath = userPath + '/' + data.filename
      await RNFS.copyAssetsFileIOS(uri, destPath, 0, 0)
      filePath = destPath
      hasTempFile = true
    } else if (uri.indexOf('content://') === 0) {
      filePath = await FileTools.getContentAbsolutePathAndroid(uri)
      fileName = filePath.substr(filePath.lastIndexOf('/') + 1)
    } else {
      uri = uri.substr(uri.indexOf('/iTablet'))
    }

    let imgData
    if (sendToServer) {
      //获取缩略图
      let resizedImageUri = await ImageResizer.createResizedImage(
        filePath,
        60,
        100,
        'PNG',
        1,
        0,
        userPath,
      )
      imgData = await RNFS.readFile(resizedImageUri.path, 'base64')
      await RNFS.unlink(resizedImageUri.path)
    } else {
      imgData = await RNFS.readFile(filePath, 'base64')
    }

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

    let statResult = await stat(filePath)
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
        type: MSGConstant.MSG_PICTURE,
        message: {
          fileName: data.filename || fileName,
          fileSize: statResult.size,
          filePath: uri,
          imgdata: imgData,
          progress: 0,
        },
      },
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
    //发送文件及提醒
    let isFriend = FriendListFileHandle.getIsFriend(this.targetUser.id)
    if (isFriend === 0) {
      //对方还未添加您为好友
      this.showNoFriendNotify(msgId)
      return
    }
    message.message.message.filePath = ''
    let callback = result => {
      if (hasTempFile) {
        RNFS.unlink(filePath)
      }
      if (!result) {
        Toast.show(getLanguage(global.language).Friends.SEND_FAIL)
      }
    }
    if (sendToServer) {
      this.friend.sendFile(
        message,
        filePath,
        this.targetUser.id,
        msgId,
        callback,
      )
    } else {
      this.friend._sendMessage(
        JSON.stringify(message),
        this.targetUser.id,
        false,
        callback,
      )
    }
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

  receiveFile = async (message, receivePath, cb) => {
    let storeFileName = await this.getAvailableFileName(
      receivePath,
      message.originMsg.message.message.fileName,
    )

    message.downloading = true

    this.friend.receiveFile(
      message,
      receivePath,
      storeFileName,
      this.targetUser.id,
      async res => {
        message.originMsg.message.message.filePath =
          receivePath + '/' + storeFileName
        if (res === false) {
          message.downloading = false
          this.friend.onReceiveProgress({
            talkId: this.targetUser.id,
            msgId: message._id,
            percentage: 0,
          })
          let absolutePath = global.homePath + receivePath + '/' + storeFileName
          if (await FileTools.fileIsExist(absolutePath)) {
            FileTools.deleteFile(absolutePath)
          }
        }
        cb && cb(res)
      },
    )
  }

  receivePicture = async message => {
    if (message.download) {
      Toast.show(getLanguage(global.language).Friends.WAIT_DOWNLOADING)
      return
    }
    let homePath = await FileTools.appendingHomeDirectory()
    let userPath = ConstPath.UserPath + this.curUser.userName
    let receivePath = userPath + '/ReceivedFiles'
    if (Platform.OS === 'android') {
      homePath = 'file://' + homePath
    }

    this.receiveFile(message, receivePath, res => {
      if (res === true) {
        this.ImageViewer.setImageUri(
          homePath + message.originMsg.message.message.filePath,
        )
        this.setState({
          messages: this.state.messages.map(m => {
            return {
              ...m,
            }
          }),
        })
      }
    })
  }

  getAvailableFileName = async (filePath, fullFileName) => {
    let homePath = await FileTools.appendingHomeDirectory()
    let fileName = fullFileName.substr(0, fullFileName.lastIndexOf('.'))
    let suffix = fullFileName.substr(fullFileName.lastIndexOf('.'))
    let tempFullName = ''
    if (await FileTools.fileIsExist(homePath + filePath + '/' + fullFileName)) {
      for (let i = 1; ; i++) {
        tempFullName = fileName + '_' + i + suffix
        if (
          !(await FileTools.fileIsExist(
            homePath + filePath + '/' + tempFullName,
          ))
        ) {
          return tempFullName
        }
      }
    } else {
      return fullFileName
    }
  }

  onCustomViewTouch = async (type, message) => {
    switch (type) {
      case MSGConstant.MSG_MAP:
      case MSGConstant.MSG_LAYER:
      case MSGConstant.MSG_DATASET:
        this.onCustomViewFileTouch(type, message)
        break
      case MSGConstant.MSG_LOCATION:
        this.onCustomViewLocationTouch(message)
        break
      case MSGConstant.MSG_PICTURE:
        this.onCustomViewPictureTouch(message)
        break
      default:
        break
    }
  }

  onCustomViewPictureTouch = async message => {
    let homePath = await FileTools.appendingHomeDirectory()
    if (message.downloading) {
      Toast.show(getLanguage(global.language).Friends.WAIT_DOWNLOADING)
    } else if (!message.originMsg.message.message.filePath) {
      let fileSize = message.originMsg.message.message.fileSize
      let fileSizeText = fileSize.toFixed(2) + 'B'
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'KB'
      }
      if (fileSize > 1024) {
        fileSize = fileSize / 1024
        fileSizeText = fileSize.toFixed(2) + 'MB'
      }
      this.SimpleDialog.setText(
        getLanguage(global.language).Friends.LOAD_ORIGIN_PIC +
          '(' +
          fileSizeText +
          ')？',
      )
      this.SimpleDialog.setConfirm(() => {
        this.receivePicture(message)
      })
      this.SimpleDialog.setVisible(true)
      return
    }
    let uri = message.originMsg.message.message.filePath
    if (uri !== undefined && uri !== '') {
      if (Platform.OS === 'android') {
        if (uri.indexOf('content://') === -1) {
          uri = 'file://' + homePath + uri
        }
      } else {
        if (uri.indexOf('assets-library://') === -1) {
          uri = homePath + uri
        }
      }
    } else {
      let imgdata = message.originMsg.message.message.imgdata
      if (imgdata !== undefined) {
        uri = `data:image/png;base64,${imgdata}`
      }
    }
    this.ImageViewer.setPicMsg(message)
    this.ImageViewer.setImageUri(uri)
    this.ImageViewer.setVisible(true)
  }

  onCustomViewLocationTouch = async message => {
    if (global.coworkMode) {
      Toast.show(getLanguage(global.language).Friends.LOCATION_COWORK_NOTIFY)
    } else if (this.action) {
      Toast.show(getLanguage(global.language).Friends.LOCATION_SHARE_NOTIFY)
    } else {
      let wsData = JSON.parse(JSON.stringify(ConstOnline.Google))
      wsData.layerIndex = 3
      let licenseStatus = await SMap.getEnvironmentStatus()
      global.isLicenseValid = licenseStatus.isLicenseValid
      NavigationService.navigate('MapViewSingle', {
        wsData,
        isExample: true,
        noLegend: true,
        mapName: message.originMsg.message.message.message,
        showMarker: {
          longitude: message.originMsg.message.message.longitude,
          latitude: message.originMsg.message.message.latitude,
        },
      })
    }
  }

  onCustomViewFileTouch = async (type, message) => {
    let userPath = ConstPath.UserPath + this.curUser.userName
    let receivePath = userPath + '/ReceivedFiles'

    if (message.user._id !== this.curUser.userId) {
      if (message.downloading) {
        Toast.show(getLanguage(global.language).Friends.WAIT_DOWNLOADING)
      } else if (message.originMsg.message.message.progress !== 100) {
        this.SimpleDialog.setConfirm(() => {
          this.SimpleDialog.setVisible(false)
          this.receiveFile(message, receivePath)
        })
        this.SimpleDialog.setText(
          getLanguage(global.language).Friends.RECEIVE_CONFIRM,
        )
        this.SimpleDialog.setVisible(true)
      } else if (message.originMsg.message.message.progress === 100) {
        let homePath = await FileTools.appendingHomeDirectory()
        let filePath = homePath + message.originMsg.message.message.filePath
        if (!(await FileTools.fileIsExist(filePath))) {
          this.SimpleDialog.setConfirm(() => {
            this.SimpleDialog.setVisible(false)
            this.receiveFile(message, receivePath)
          })
          this.SimpleDialog.setText(
            getLanguage(global.language).Friends.DATA_NOT_FOUND,
          )
          this.SimpleDialog.setVisible(true)
          return
        }
        switch (type) {
          case MSGConstant.MSG_MAP:
            this.SimpleDialog.setConfirm(() => {
              this.SimpleDialog.setVisible(false)
              this.importMap(message)
            })
            this.SimpleDialog.setText(
              getLanguage(global.language).Friends.IMPORT_CONFIRM,
            )
            this.SimpleDialog.setVisible(true)
            break
          case MSGConstant.MSG_LAYER:
            if (!global.coworkMode) {
              this.showOpenCoworkDialog()
            } else {
              this.SimpleDialog.setConfirm(() => {
                this.SimpleDialog.setVisible(false)
                this.importLayer(message)
              })
              this.SimpleDialog.setText(
                getLanguage(global.language).Friends.IMPORT_CONFIRM,
              )
              this.SimpleDialog.setVisible(true)
            }
            break
          case MSGConstant.MSG_DATASET:
            if (!global.coworkMode) {
              this.showOpenCoworkDialog()
            } else {
              this.SimpleDialog.setConfirm(() => {
                this.SimpleDialog.setVisible(false)
                this.importDataset(message)
              })
              this.SimpleDialog.setText(
                getLanguage(global.language).Friends.IMPORT_CONFIRM,
              )
              this.SimpleDialog.setVisible(true)
            }

            break
          default:
            break
        }
      }
    }
  }

  importDataset = async message => {
    let mapOpen
    try {
      mapOpen = await SMap.isAnyMapOpened()
    } catch (error) {
      mapOpen = false
    }
    if (!(global.coworkMode && mapOpen)) {
      Toast.show(getLanguage(global.language).Friends.OPENCOWORKFIRST)
      return
    }
    let homePath = await FileTools.appendingHomeDirectory()
    let filePath = homePath + message.originMsg.message.message.filePath
    let fileDir = filePath.substr(0, filePath.lastIndexOf('.'))
    await FileTools.unZipFile(filePath, fileDir)
    //要导入的文件
    let fileList = await FileTools.getPathList(fileDir)

    if (fileList.length > 0) {
      let datasourceList = await SMap.getDatasources()
      let isDatasourceOpen = false
      //是否打开了对应的数据源
      for (let i = 0; i < datasourceList.length; i++) {
        if (
          datasourceList[i].alias ===
          message.originMsg.message.message.datasourceAlias
        ) {
          isDatasourceOpen = true
          break
        }
      }
      //没有对应的数据源则新建一个
      if (!isDatasourceOpen) {
        let datasourcePath =
          homePath +
          ConstPath.AppPath +
          'User/' +
          this.curUser.userName +
          '/' +
          ConstPath.RelativePath.Datasource
        let time = Date.parse(new Date())
        let newDatasourcePath = datasourcePath + 'import_' + time + '.udb'
        let datasourceParams = {}
        datasourceParams.server = newDatasourcePath
        datasourceParams.engineType = EngineType.UDB
        datasourceParams.alias =
          message.originMsg.message.message.datasourceAlias
        await SMap.createDatasource(datasourceParams)
        await SMap.openDatasource(datasourceParams)
      }
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].path.indexOf('.json') !== -1) {
          let jstr = await FileTools.readFile(homePath + fileList[i].path)
          let properties
          let hasPoint, hasLine, hasPolygon
          try {
            let items = jstr.split('\n')
            for (let i = 0; i < items.length; i++) {
              if (items[i] !== '') {
                let item = JSON.parse(items[i])
                if (!properties) {
                  properties = item.properties
                }
                if (item.geometry.type === 'Point') {
                  hasPoint = true
                } else if (item.geometry.type === 'LineString') {
                  hasLine = true
                } else if (item.geometry.type === 'Polygon') {
                  hasPolygon = true
                }
              }
            }
          } catch (error) {
            // console.log(error)
          }
          let type = 1
          let typeCount = 0
          if (hasPolygon) {
            type = DatasetType.REGION
            typeCount++
          }
          if (hasLine) {
            type = DatasetType.LINE
            typeCount++
          }
          if (hasPoint) {
            type = DatasetType.POINT
            typeCount++
          }
          if (typeCount !== 1) {
            type = DatasetType.CAD
          }
          await SMap.importDatasetFromGeoJson(
            message.originMsg.message.message.datasourceAlias,
            fileList[i].name.substr(0, fileList[i].name.lastIndexOf('.')),
            homePath + fileList[i].path,
            type,
            properties,
          )
        }
      }
    }

    await FileTools.deleteFile(fileDir)
    Toast.show(getLanguage(global.language).Friends.IMPORT_SUCCESS)
  }

  importLayer = async message => {
    let mapOpen
    try {
      mapOpen = await SMap.isAnyMapOpened()
    } catch (error) {
      mapOpen = false
    }
    if (!(global.coworkMode && mapOpen)) {
      Toast.show(getLanguage(global.language).Friends.OPENCOWORKFIRST)
      return
    }
    let homePath = await FileTools.appendingHomeDirectory()
    let filePath = homePath + message.originMsg.message.message.filePath
    let fileDir = filePath.substr(0, filePath.lastIndexOf('.'))
    await FileTools.unZipFile(filePath, fileDir)
    let fileList = await FileTools.getPathList(fileDir)
    let layer
    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].path.indexOf('.xml') !== -1) {
          layer = await FileTools.readFile(homePath + fileList[i].path)
          await SMap.insertXMLLayer(0, layer)
        }
      }
    }
    await FileTools.deleteFile(fileDir)
    this.props.getLayers(-1, async layers => {
      for (let i = layers.length; i > 0; i--) {
        if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
          await SMap.moveToTop(layers[i].name)
        }
      }
      SMap.refreshMap()
    })
    // NavigationService.navigate('MapView')
    Toast.show(getLanguage(global.language).Friends.IMPORT_SUCCESS)
  }

  importMap = async message => {
    GLOBAL.Loading.setLoading(
      true,
      getLanguage(global.language).Friends.IMPORT_DATA,
    )
    let homePath = await FileTools.appendingHomeDirectory()
    let receivePath = homePath + message.originMsg.message.message.filePath
    let importPath = homePath + '/iTablet/Import'
    try {
      await FileTools.unZipFile(receivePath, importPath)
      let dataList = await DataHandler.getExternalData(importPath)
      //暂时只支持单个工作空间的导入
      if (dataList.length === 1 && dataList[0].fileType === 'workspace') {
        await DataHandler.importWorkspace(dataList[0])
      }
      Toast.show(getLanguage(global.language).Friends.IMPORT_SUCCESS)
    } catch (error) {
      Toast.show(getLanguage(global.language).Friends.IMPORT_FAIL)
    } finally {
      GLOBAL.Loading.setLoading(false)
      FileTools.deleteFile(importPath)
    }
  }

  showOpenCoworkDialog = () => {
    this.SimpleDialog.setConfirm(() => {
      NavigationService.navigate('SelectModule')
    })
    this.SimpleDialog.setText(
      getLanguage(global.language).Friends.OPENCOWORKFIRST,
    )
    this.SimpleDialog.setVisible(true)
  }

  render() {
    let moreImg = require('../../../../assets/home/Frenchgrey/icon_else_selected.png')
    return (
      <Animated.View style={{ flex: 1, bottom: this.state.chatBottom }}>
        <Container
          style={{ backgroundColor: 'rgba(240,240,240,1.0)' }}
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
              onPress={async () => {
                // let mapOpen
                // try {
                //   mapOpen = await SMap.isAnyMapOpened()
                // } catch (error) {
                //   mapOpen = false
                // }
                // if (!mapOpen) {
                this.friend.curMod.action(this.curUser)
                // } else {
                //   NavigationService.navigate('MapView')
                // }
              }}
            />
          ) : null}
          <GiftedChat
            locale={getLanguage(global.language).Friends.LOCALE}
            placeholder={getLanguage(global.language).Friends.INPUT_MESSAGE}
            messages={this.state.messages}
            showAvatarForEveryMessage={false}
            onSend={this.onSend}
            loadEarlier={this.state.loadEarlier}
            onLoadEarlier={this.onLoadEarlier}
            isLoadingEarlier={this.state.isLoadingEarlier}
            label={getLanguage(global.language).Friends.LOAD_EARLIER}
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
                return (
                  <InputToolbar
                    {...props}
                    label={getLanguage(global.language).Friends.SEND}
                  />
                )
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
                props.currentMessage.type === MSGConstant.MSG_PICTURE ||
                props.currentMessage.type === MSGConstant.MSG_MAP ||
                props.currentMessage.type === MSGConstant.MSG_LOCATION ||
                props.currentMessage.type === MSGConstant.MSG_LAYER ||
                props.currentMessage.type === MSGConstant.MSG_DATASET
              ) {
                return null
              }
              return (
                <MessageText
                  {...props}
                  customTextStyle={{
                    fontSize: scaleSize(20),
                    lineHeight: scaleSize(25),
                  }}
                />
              )
            }}
          />
          {this.renderSimpleDialog()}
          {this.rennderImageViewer()}
        </Container>
      </Animated.View>
    )
  }

  renderCustomActions(props) {
    return (
      <CustomActions
        {...props}
        callBack={value => this.setState({ chatBottom: value })}
        sendCallBack={(type, value, fileName) => {
          if (type === 1) {
            this.onSendFile(MSGConstant.MSG_MAP, value, fileName)
          } else if (type === 3) {
            this.onSendLocation(value)
          } else if (type === 2) {
            this.onSendPicture(value)
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
            backgroundColor: '#rgba(255, 255, 255, 1.0)',
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
      (currentMessage.type && currentMessage.type === MSGConstant.MSG_MAP) ||
      currentMessage.type === MSGConstant.MSG_LAYER ||
      currentMessage.type === MSGConstant.MSG_DATASET ||
      currentMessage.type === MSGConstant.MSG_PICTURE
    ) {
      let progress = currentMessage.originMsg.message.message.progress
      if (progress === undefined) {
        progress = 0
      }
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
    return <CustomView {...props} onTouch={this.onCustomViewTouch} />
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

  renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
  }

  rennderImageViewer = () => {
    return (
      <ImageViewer
        ref={ref => (this.ImageViewer = ref)}
        receivePicture={this.receivePicture}
      />
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
