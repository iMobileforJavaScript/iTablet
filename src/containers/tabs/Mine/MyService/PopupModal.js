import React, { PureComponent } from 'react'
import { Modal, TouchableOpacity, View, Text, Platform } from 'react-native'
import Toast from '../../../../utils/Toast'

import { color, size } from '../../../../styles'
import { SOnlineService } from 'imobile_for_reactnative'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
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
    this.fontSize = size.fontSize.fontSizeXl
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
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }
  _publishButton = isPublish => {
    let title
    if (isPublish) {
      title = getLanguage(global.language).Profile.SET_AS_PUBLIC_SERVICE
      //'设为公有服务'
    } else {
      title = getLanguage(global.language).Profile.SET_AS_PRIVATE_SERVICE
      //'设为私有服务'
    }
    let lineHeight = scaleSize(80)
    return (
      <TouchableOpacity
        style={{ backgroundColor: color.contentColorWhite }}
        onPress={async () => {
          this._onClose()
          let result = await SOnlineService.changeServiceVisibilityWithServiceId(
            this.props.itemId,
            isPublish,
          )
          if (typeof result === 'boolean' && result) {
            Toast.show(getLanguage(global.language).Prompt.SETTING_SUCCESS)
            //'设置成功')
            this._onRefresh()
          } else {
            Toast.show(getLanguage(global.language).Prompt.SETTING_FAILED)
            //'设置失败')
          }
        }}
      >
        <Text
          style={{
            lineHeight: lineHeight,
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
    let lineHeight = scaleSize(80)
    return (
      <TouchableOpacity
        style={{ backgroundColor: color.content_white }}
        onPress={async () => {
          try {
            this._onClose()
            let result = await SOnlineService.deleteServiceWithServiceId(
              this.props.itemId,
            )
            if (typeof result === 'boolean' && result) {
              this.deleteService = true
              this._onRefresh()
              Toast.show(getLanguage(global.language).Prompt.DELETED_SUCCESS)
              //'删除成功')
            } else if (typeof result === 'boolean' && !result) {
              this.deleteService = true
              this._onRefresh()
              Toast.show(getLanguage(global.language).Prompt.DELETED_SUCCESS)
              //'删除成功')
            } else {
              Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
              //'删除失败')
            }
          } catch (error) {
            Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
            //'删除失败')
          }
        }}
      >
        <Text
          style={{
            lineHeight: lineHeight,
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
          style={{ flex: 1, backgroundColor: color.modalBgColor }}
          activeOpacity={1}
          onPress={() => {
            this._onClose()
          }}
        >
          <View style={{ width: '100%', position: 'absolute', bottom: 0 }}>
            {this._renderSeparatorLine()}
            {this._publishButton(!this.props.isPublish)}
            {this._deleteButton(
              getLanguage(global.language).Profile.DELETE,
              //'删除'
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
