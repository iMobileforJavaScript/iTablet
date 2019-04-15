import React, { PureComponent } from 'react'
import { Modal, Platform, TouchableOpacity, Text, View } from 'react-native'
import { color, size } from '../../../../styles'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
export default class LocalDataPopupModal extends PureComponent {
  props: {
    language: Object,
    modalVisible: boolean,
    onCloseModal: () => {},
    onDeleteData: () => {},
    onImportWorkspace: () => {},
  }

  defaultProps: {
    modalVisible: false,
  }

  constructor(props) {
    super(props)
    this.fontSize = size.fontSize.fontSizeXl
  }

  _onRequestClose = () => {
    if (Platform.OS === 'android') {
      this._onCloseModal()
    }
  }
  _onCloseModal = () => {
    this.props.onCloseModal()
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

  _onImportWorkspace = () => {
    let height = scaleSize(80)
    let lineHeight = scaleSize(80)
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onImportWorkspace()
        }}
      >
        <Text
          style={{
            width: '100%',
            height: height,
            backgroundColor: color.content_white,
            textAlign: 'center',
            lineHeight: lineHeight,
            fontSize: this.fontSize,
          }}
        >
          {/* 导入数据 */}
          {getLanguage(this.props.language).Profile.IMPORT_DATA}
        </Text>
        {this._renderSeparatorLine()}
      </TouchableOpacity>
    )
  }
  _onDeleteButton = () => {
    let height = scaleSize(80)
    let lineHeight = scaleSize(80)
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onDeleteData()
        }}
      >
        <Text
          style={{
            width: '100%',
            height: height,
            backgroundColor: color.content_white,
            textAlign: 'center',
            lineHeight: lineHeight,
            fontSize: this.fontSize,
          }}
        >
          {/* 删除 */}
          {getLanguage(this.props.language).Profile.DELETE_DATA}
        </Text>
        {this._renderSeparatorLine()}
      </TouchableOpacity>
    )
  }
  render() {
    // let animationType = Platform.OS === 'ios' ? 'slide' : 'fade'
    let animationType = 'fade'
    return (
      <Modal
        animationType={animationType}
        transparent={true}
        onRequestClose={this._onRequestClose}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right',
        ]}
        style={{ flex: 1 }}
        visible={this.props.modalVisible}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this._onCloseModal()
          }}
          style={{ flex: 1, backgroundColor: color.modalBgColor }}
        >
          <View
            style={{
              flex: 1,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            {this.props.onImportWorkspace && this._onImportWorkspace()}
            {this._onDeleteButton()}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
