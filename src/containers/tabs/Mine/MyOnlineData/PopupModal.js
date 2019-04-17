import React, { PureComponent } from 'react'
import { Modal, TouchableOpacity, View, Text, Platform } from 'react-native'

import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
const screenWidth = '100%'

export default class PopupModal extends PureComponent {
  props: {
    onDownloadFile: () => {},
    onDeleteData: () => {},
    onCloseModal: () => {},
    modalVisible: boolean,
  }

  constructor(props) {
    super(props)
    this.fontSize = this.fontSize = size.fontSize.fontSizeXl
    this.state = {}
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
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  _downloadButton = (title = '导入') => {
    return (
      <TouchableOpacity
        style={{ backgroundColor: color.itemColorWhite }}
        onPress={() => {
          this.props.onDownloadFile && this.props.onDownloadFile()
        }}
      >
        <Text
          style={{
            lineHeight: scaleSize(80),
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
        style={{ backgroundColor: color.itemColorWhite }}
        onPress={async () => {
          this.props.onDeleteData()
        }}
      >
        <Text
          style={{
            lineHeight: scaleSize(80),
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
          <View
            style={{
              width: '100%',
              position: 'absolute',
              bottom: 0,
            }}
          >
            {this._renderSeparatorLine()}
            {this._downloadButton()}
            {this._deleteButton('删除')}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
