import React, { PureComponent } from 'react'
import { Modal, Platform, TouchableOpacity, Text, View } from 'react-native'
import { color } from '../../../styles'
export default class HomePopupModal extends PureComponent {
  props: {
    modalVisible: Boolean,
    isLogin: Boolean,
    onCloseModal: () => {},
    onLogin: () => {},
    onRegister: () => {},
    onLogout: () => {},
    onToggleAccount: () => {},
    onSetting: () => {},
    topNavigatorBarImageId: String,
  }

  defaultProps: {
    modalVisible: false,
  }

  constructor(props) {
    super(props)
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
      <View style={{ width: '100%', height: 4, backgroundColor: '#2D2D2F' }} />
    )
  }
  _renderItem = (label, onClick: () => {}) => {
    return (
      <View style={{ width: '100%' }}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: 60,
            backgroundColor: color.content,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            onClick()
          }}
        >
          <Text>{label}</Text>
        </TouchableOpacity>
        {this._renderSeparatorLine()}
      </View>
    )
  }

  _selectRender = () => {
    if (this.props.topNavigatorBarImageId === 'left') {
      if (this.props.isLogin) {
        return (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            {this._renderSeparatorLine()}
            {this._renderItem('切换账号', this.props.onToggleAccount)}
            {this._renderItem('退出', this.props.onLogout)}
          </View>
        )
      } else {
        return (
          <View
            style={{
              flex: 1,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            {this._renderSeparatorLine()}
            {this._renderItem('登录', this.props.onLogin)}
            {this._renderItem('注册', this.props.onRegister)}
          </View>
        )
      }
    } else {
      return (
        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          {this._renderSeparatorLine()}
          {this._renderItem('关于iTablet', this.props.onLogin)}
          {this._renderItem('设置', this.props.onSetting)}
        </View>
      )
    }
  }

  render() {
    return (
      <Modal
        animationType={'slide'}
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
          style={{ flex: 1, backgroundColor: '#rgba(0, 0, 0, 0.3)' }}
        >
          {this._selectRender()}
        </TouchableOpacity>
      </Modal>
    )
  }
}
