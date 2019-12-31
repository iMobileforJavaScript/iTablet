import React, { Component } from 'react'
import { Image, Text, View, StyleSheet } from 'react-native'
import FriendList from './FriendList/FriendList'
import { Container, Dialog, CheckBox } from '../../../components'
import { getLanguage } from '../../../language/index'
import { scaleSize, setSpText, Toast } from '../../../utils'
import {
  getLayerIconByType,
  getThemeAssets,
  getThemeIconByType,
} from '../../../assets'
import { stat } from 'react-native-fs'
import color from '../../../styles/color'
import { FileTools } from '../../../native'

export default class SelectFriend extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.user = params.user
    this.callBack = params.callBack
    this.type = params.type || ''
    this.layerData = params.layerData || {}
    this.state = {
      targetUser: params.targetUser || '',
    }
  }
  componentDidMount() {
    if (this.state.targetUser !== '') {
      this.Dialog.setDialogVisible(true)
    }
  }
  getLayerIcon = () => {
    let item = this.layerData
    if (item.themeType > 0) {
      return getThemeIconByType(item.themeType)
    } else if (item.isHeatmap) {
      return getThemeAssets().themeType.heatmap
    } else {
      return getLayerIconByType(item.type)
    }
  }

  onSendFile = async ({ type, filePath, fileName, extraInfo }) => {
    let currentUser = this.user.currentUser
    let bGroup = 1
    let groupID = currentUser.userId
    let groupName = ''
    if (this.state.targetUser.id.indexOf('Group_') !== -1) {
      bGroup = 2
      groupID = this.state.targetUser.id
      groupName = this.state.targetUser.title
    }
    let ctime = new Date()
    let time = Date.parse(ctime)

    fileName = fileName + '.zip'
    let statResult = await stat(filePath)
    //文件接收提醒
    let informMsg = {
      type: bGroup,
      time: time,
      user: {
        name: currentUser.nickname,
        id: currentUser.userId,
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

    let msgId = GLOBAL.getFriend().getMsgId(this.state.targetUser.id)
    //保存
    GLOBAL.getFriend().storeMessage(informMsg, this.state.targetUser.id, msgId)
    GLOBAL.getFriend().sendFile(
      informMsg,
      filePath,
      this.state.targetUser.id,
      msgId,
      result => {
        FileTools.deleteFile(filePath)
        if (!result) {
          GLOBAL.getFriend().onReceiveProgress({
            talkId: this.state.targetUser.id,
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

  renderChild = targetUser => {
    this.shareDataset = false
    let iconImg = this.getLayerIcon()
    let caption = this.layerData.caption || ''
    let title = targetUser.title || ''
    return (
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        <Text
          style={{
            paddingLeft: scaleSize(20),
            fontSize: setSpText(28),
          }}
        >
          {global.language === 'CN' ? '发送给:' : 'Send to:'}
        </Text>
        <View style={styles.ItemViewStyle}>
          <View style={styles.ITemHeadTextViewStyle}>
            <Text style={styles.ITemHeadTextStyle}>
              {(title && title[0].toUpperCase()) || ''}
            </Text>
          </View>
          <View style={styles.ITemTextViewStyle}>
            <Text style={styles.ITemTextStyle}>{title || ''}</Text>
          </View>
        </View>
        <View
          style={{
            height: 1,
            width: '100%',
            backgroundColor: '#EEEEEE',
          }}
        />
        <View
          style={{
            width: '100%',
            height: scaleSize(80),
            flexDirection: 'row',
            paddingLeft: scaleSize(80),
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <Image
            source={iconImg}
            style={{
              width: scaleSize(40),
              height: scaleSize(40),
            }}
            resizeMode={'contain'}
          />
          <Text style={{ marginLeft: scaleSize(5), fontSize: scaleSize(24) }}>
            {caption}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            height: scaleSize(80),
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: scaleSize(80),
          }}
        >
          <CheckBox
            style={{ height: scaleSize(30), width: scaleSize(30) }}
            onChange={() => {
              this.shareDataset = !this.shareDataset
            }}
          />
          <Text style={{ marginLeft: scaleSize(5), fontSize: scaleSize(24) }}>
            {getLanguage(global.language).Friends.SHARE_DATASET}
            {/* {同时分享对应数据集}*/}
          </Text>
        </View>
      </View>
    )
  }
  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Friends.TITLE_CHOOSE_FRIEND,
          navigation: this.props.navigation,
        }}
      >
        <FriendList
          ref={ref => (this.friendList = ref)}
          language={global.language}
          user={this.user.currentUser}
          friend={global.getFriend()}
          callBack={targetId => {
            if (this.type === 'ShareFromLayer') {
              let targetUser = GLOBAL.getFriend().getTargetUser(targetId + '')
              this.setState({
                targetUser,
              })
              this.Dialog.setDialogVisible(true)
            } else {
              this.callBack && this.callBack(targetId)
            }
          }}
        />
        {this.type === 'ShareFromLayer' && (
          <Dialog
            ref={ref => (this.Dialog = ref)}
            opacityStyle={styles.opacityView}
            style={styles.dialogBackground}
            confirmBtnTitle={getLanguage(global.language).Prompt.CONFIRM}
            cancelBtnTitle={getLanguage(global.language).Prompt.CANCEL}
            confirmBtnVisible={true}
            cancelBtnVisible={true}
            confirmAction={() => {
              this.Dialog.setDialogVisible(false)
              this.callBack &&
                this.callBack(
                  this.state.targetUser,
                  this.shareDataset,
                  this.onSendFile,
                )
              //this.props.navigation.goBack()
            }}
          >
            {this.renderChild(this.state.targetUser)}
          </Dialog>
        )}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  dialogBackground: {
    height: scaleSize(350),
    backgroundColor: color.content_white,
  },
  opacityView: {
    height: scaleSize(350),
    backgroundColor: color.content_white,
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    height: scaleSize(70),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ITemHeadTextViewStyle: {
    marginLeft: scaleSize(10),
    height: scaleSize(50),
    width: scaleSize(50),
    borderRadius: scaleSize(50),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ITemHeadTextStyle: {
    fontSize: setSpText(24),
    color: 'white',
  },
  ITemTextViewStyle: {
    marginLeft: scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  ITemTextStyle: {
    fontSize: scaleSize(30),
    color: 'black',
  },
})
