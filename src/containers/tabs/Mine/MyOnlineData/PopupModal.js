import React, { PureComponent } from 'react'
import {
  Modal,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  Platform,
} from 'react-native'

import { color } from '../../../../styles'
import Toast from '../../../../utils/Toast'
const screenWidth = Dimensions.get('window').width

export default class PopupModal extends PureComponent {
  props: {
    onDeleteService: () => {},
    onDownloadFile: () => {},
    onPublishService: () => {},
    onChangeDataVisibility: () => {},
    onDeleteData: () => {},
    onCloseModal: () => {},
    modalVisible: boolean,
    data: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      isClick: true,
      progress: this.props.data.downloadingProgress,
    }
  }

  UNSAFE_componentWillReceiveProps() {
    this.bIsCallBackProps = true
  }

  _changeDownloadingState = progress => {
    this.bIsCallBackProps = false
    let isClick = false
    if (progress === '下载完成' || progress === '下载失败') {
      isClick = true
    }
    this.setState({ progress: progress, isClick: isClick })
  }

  _onClose() {
    this.props.onCloseModal()
  }
  _onRequestClose() {
    if (Platform.OS === 'android') {
      this._onClose()
    }
  }
  _publishServiceButton = () => {
    let title = '发布服务'
    let objContent = this.props.data
    let dataItemServices = objContent.dataItemServices
    for (let i = 0; i < dataItemServices.length; i++) {
      let serviceType = dataItemServices[i].serviceType
      if (serviceType === 'RESTMAP') {
        title = '删除' + dataItemServices[i].serviceName + '服务'
      }
    }
    return (
      <TouchableOpacity
        style={{ backgroundColor: color.content }}
        onPress={async () => {
          if (title === '发布服务') {
            this.props.onPublishService()
          } else {
            this.props.onDeleteService()
          }
        }}
      >
        <Text
          style={{
            lineHeight: 50,
            width: screenWidth,
            position: 'relative',
            textAlign: 'center',
            fontSize: 16,
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View
          style={{
            width: screenWidth,
            height: 1,
            backgroundColor: color.theme,
          }}
        />
      </TouchableOpacity>
    )
  }
  _dataVisibleButton = () => {
    let isPublish = false
    let authorizeSetting = this.props.data.authorizeSetting
    for (let i = 0; i < authorizeSetting.length; i++) {
      let dataPermissionType = authorizeSetting[i].dataPermissionType
      if (dataPermissionType === 'DOWNLOAD') {
        isPublish = true
        break
      }
    }
    let title
    if (isPublish) {
      title = '设为私有数据'
    } else {
      title = '设为共有数据'
    }
    return (
      <TouchableOpacity
        style={{ backgroundColor: color.content }}
        onPress={async () => {
          this.props.onChangeDataVisibility()
        }}
      >
        <Text
          style={{
            lineHeight: 50,
            width: screenWidth,
            position: 'relative',
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          {title}
        </Text>
        <View
          style={{
            width: screenWidth,
            height: 1,
            backgroundColor: color.theme,
          }}
        />
      </TouchableOpacity>
    )
  }

  _downloadButton = () => {
    let progress = '下载'
    if (this.props.data.isDownloading) {
      if (this.bIsCallBackProps) {
        progress = this.props.data.downloadingProgress
      } else {
        progress = this.state.progress
      }
    }
    return (
      <TouchableOpacity
        style={{ backgroundColor: color.content }}
        onPress={() => {
          if (this.props.data.isDownloading === true) {
            this.props.onDownloadFile()
          } else {
            Toast.show('有数据正在下载')
          }
        }}
      >
        <Text
          style={{
            lineHeight: 50,
            width: screenWidth,
            position: 'relative',
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          {progress}
        </Text>
        <View
          style={{
            width: screenWidth,
            height: 1,
            backgroundColor: color.theme,
          }}
        />
      </TouchableOpacity>
    )
  }

  _deleteButton = title => {
    return (
      <TouchableOpacity
        style={{ backgroundColor: color.content }}
        onPress={async () => {
          this.props.onDeleteData()
        }}
      >
        <Text
          style={{
            lineHeight: 50,
            width: screenWidth,
            position: 'relative',
            textAlign: 'center',
            fontSize: 16,
          }}
        >
          {title}
        </Text>
        <View
          style={{
            width: screenWidth,
            height: 1,
            backgroundColor: color.theme,
          }}
        />
      </TouchableOpacity>
    )
  }

  render() {
    let visible = this.props.modalVisible
    return (
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={visible}
        onRequestClose={this._onRequestClose}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => {
            this._onClose()
          }}
        >
          <View style={{ position: 'absolute', bottom: 0 }}>
            <View
              style={{
                width: screenWidth,
                height: 4,
                backgroundColor: color.theme,
              }}
            />
            {this._publishServiceButton()}
            <View
              style={{
                width: screenWidth,
                height: 4,
                backgroundColor: color.theme,
              }}
            />
            {this._downloadButton()}
            <View
              style={{
                width: screenWidth,
                height: 4,
                backgroundColor: color.theme,
              }}
            />
            {this._dataVisibleButton()}
            <View
              style={{
                width: screenWidth,
                height: 4,
                backgroundColor: color.theme,
              }}
            />
            {this._deleteButton('删除')}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
