import React, { PureComponent } from 'react'
import { Modal, TouchableOpacity, View, Text, Platform } from 'react-native'

import { color } from '../../../../styles'
import Toast from '../../../../utils/Toast'
const screenWidth = '100%'

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
    downloadingFileName: string,
  }

  constructor(props) {
    super(props)
    this.fontSize = Platform.OS === 'ios' ? 18 : 16
    this.state = {
      isClick: true,
      progress: this.props.data.downloadingProgress,
    }
  }

  componentDidMount() {
    // console.warn("PopupModal_componentDidMount")
  }

  UNSAFE_componentWillReceiveProps() {
    this.bIsCallBackProps = true
  }

  componentWillUnmount() {
    // console.warn("PopupModal_componentWillUnmount")
  }
  _changeDownloadingState = progress => {
    this.bIsCallBackProps = false
    let isClick = false
    if (progress === '下载完成' || progress === '下载失败') {
      isClick = true
    }
    if (this.state.progress !== progress) {
      this.setState({ progress: progress, isClick: isClick })
    }
  }

  _onClose() {
    this.props.onCloseModal()
  }
  _onRequestClose = () => {
    if (Platform.OS === 'android') {
      this._onClose()
    }
  }
  _renderSeparatorLine = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: color.item_separate_white,
        }}
      />
    )
  }

  _publishServiceButton = () => {
    let title = '发布服务'
    let objContent = this.props.data
    if (objContent && objContent.dataItemServices) {
      let dataItemServices = objContent.dataItemServices
      for (let i = 0; i < dataItemServices.length; i++) {
        let serviceType = dataItemServices[i].serviceType
        if (serviceType === 'RESTMAP') {
          title = '删除' + dataItemServices[i].serviceName + '服务'
        }
      }
      return (
        <TouchableOpacity
          style={{ backgroundColor: color.content_white }}
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
              lineHeight: 60,
              width: screenWidth,
              position: 'relative',
              textAlign: 'center',
              fontSize: this.fontSize,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {this._renderSeparatorLine()}
        </TouchableOpacity>
      )
    } else {
      return <View />
    }
  }
  _dataVisibleButton = () => {
    if (this.props.data && this.props.data.authorizeSetting) {
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
          style={{ backgroundColor: color.content_white }}
          onPress={async () => {
            this.props.onChangeDataVisibility()
          }}
        >
          <Text
            style={{
              lineHeight: 60,
              width: screenWidth,
              position: 'relative',
              textAlign: 'center',
              fontSize: this.fontSize,
            }}
          >
            {title}
          </Text>
          {this._renderSeparatorLine()}
        </TouchableOpacity>
      )
    } else {
      return <View />
    }
  }

  _downloadButton = () => {
    if (this.props.data && this.props.data.isDownloading !== undefined) {
      let progress = this.state.progress
      if (this.props.data.isDownloading) {
        if (this.bIsCallBackProps) {
          progress = this.props.data.downloadingProgress
        } else {
          progress = this.state.progress
        }
      }
      return (
        <TouchableOpacity
          style={{ backgroundColor: color.content_white }}
          onPress={() => {
            if (this.props.data.isDownloading === true) {
              if (progress.indexOf('%') !== -1) {
                Toast.show('当前数据正在下载')
              } else {
                this.props.onDownloadFile()
              }
            } else {
              let info
              if (this.props.downloadingFileName !== undefined) {
                info = this.props.downloadingFileName + '数据正在下载'
              } else {
                info = '有数据正在下载'
              }
              Toast.show(info)
            }
          }}
        >
          <Text
            style={{
              lineHeight: 60,
              width: screenWidth,
              position: 'relative',
              textAlign: 'center',
              fontSize: this.fontSize,
            }}
          >
            {progress}
          </Text>
          {this._renderSeparatorLine()}
        </TouchableOpacity>
      )
    } else {
      return <View />
    }
  }

  _deleteButton = title => {
    return (
      <TouchableOpacity
        style={{ backgroundColor: color.content_white }}
        onPress={async () => {
          this.props.onDeleteData()
        }}
      >
        <Text
          style={{
            lineHeight: 60,
            width: screenWidth,
            position: 'relative',
            textAlign: 'center',
            fontSize: this.fontSize,
          }}
        >
          {title}
        </Text>
        {this._renderSeparatorLine()}
      </TouchableOpacity>
    )
  }

  render() {
    let animationType = Platform.OS === 'ios' ? 'slide' : 'fade'
    let visible = this.props.modalVisible
    return (
      <Modal
        animationType={animationType}
        transparent={true}
        visible={visible}
        style={{ flex: 1 }}
        onRequestClose={this._onRequestClose}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#rgba(0, 0, 0, 0.3)' }}
          activeOpacity={1}
          onPress={() => {
            this._onClose()
          }}
        >
          <View
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 0,
            }}
          >
            {this._renderSeparatorLine()}
            {this._publishServiceButton()}
            {this._downloadButton()}
            {this._dataVisibleButton()}
            {this._deleteButton('删除')}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
