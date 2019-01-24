import React, { PureComponent } from 'react'
import { Modal, TouchableOpacity, View, Text, Platform } from 'react-native'
import Toast from '../../../../utils/Toast'

import { color } from '../../../../styles'
import { SOnlineService } from 'imobile_for_reactnative'
const screenWidth = '100%'

export default class PopupModal extends PureComponent {
  props: {
    onRefresh: () => {},
    onCloseModal: () => {},
    isPublish: boolean,
    modalVisible: boolean,
    title: string,
    itemId: string,
    index: number,
  }

  constructor(props) {
    super(props)
    this.fontSize = Platform.OS === 'ios' ? 18 : 16
  }

  _onClose = () => {
    this.props.onCloseModal()
  }

  _onRefresh() {
    this.props.onRefresh(
      this.props.itemId,
      this.props.isPublish,
      this.deleteService,
      this.props.index,
    )
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
  _publishButton = isPublish => {
    let title
    if (isPublish) {
      title = '设为共有服务'
    } else {
      title = '设为私有服务'
    }

    return (
      <TouchableOpacity
        style={{ backgroundColor: color.content_white }}
        onPress={async () => {
          this._onClose()
          let result = await SOnlineService.changeServiceVisibilityWithServiceId(
            this.props.itemId,
            isPublish,
          )
          if (typeof result === 'boolean' && result) {
            Toast.show('设置成功')
            this._onRefresh()
          } else {
            Toast.show('设置失败')
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
          {title}
        </Text>
        {this._renderSeparatorLine()}
      </TouchableOpacity>
    )
  }

  _deleteButton = title => {
    return (
      <TouchableOpacity
        style={{ backgroundColor: color.content_white }}
        onPress={async () => {
          this._onClose()
          let result = await SOnlineService.deleteServiceWithServiceId(
            this.props.itemId,
          )
          if (typeof result === 'boolean' && result) {
            this.deleteService = true
            this._onRefresh()
            Toast.show('删除成功')
          } else {
            Toast.show('删除失败')
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
          {title}
        </Text>
        {this._renderSeparatorLine()}
      </TouchableOpacity>
    )
  }

  render() {
    // let animationType = Platform.OS === 'ios' ? 'slide' : 'fade'
    let animationType = 'fade'
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
          <View style={{ width: '100%', position: 'absolute', bottom: 0 }}>
            {this._renderSeparatorLine()}
            {this._publishButton(!this.props.isPublish)}
            {this._deleteButton('删除')}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
