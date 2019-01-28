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
    onAbout: () => {},
    getExit: () => {},
    topNavigatorBarImageId: String,
  }

  defaultProps: {
    modalVisible: false,
  }

  constructor(props) {
    super(props)
  }

  closeApp = async () => {
    this._onCloseModal()
    let exitDialog = this.props.getExit && this.props.getExit()
    if (exitDialog) {
      exitDialog.setDialogVisible(true)
    }
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
          backgroundColor: color.itemColorBlack,
        }}
      />
    )
  }
  _renderItem = (label, onClick: () => {}) => {
    let fontSize = Platform.OS === 'ios' ? 18 : 16
    return (
      <View style={{ width: '100%' }}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            width: '100%',
            height: 60,
            backgroundColor: color.content_white,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            onClick()
          }}
        >
          <Text style={{ fontSize: fontSize, color: color.fontColorBlack }}>
            {label}
          </Text>
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
            {/*{this._renderItem('注册', this.props.onRegister)}*/}
            {this._renderItem('退出登录', this.props.onLogout)}
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
          {this._renderItem('关于SuperMap iTablet', this.props.onAbout)}
          {this._renderItem('设置', this.props.onSetting)}
          {this._renderItem('退出', this.closeApp)}
        </View>
      )
    }
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
          style={{ flex: 1, backgroundColor: '#rgba(0, 0, 0, 0.3)' }}
        >
          {this._selectRender()}
        </TouchableOpacity>
      </Modal>
    )
  }
}
