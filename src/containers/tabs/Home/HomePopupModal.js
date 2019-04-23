import React, { PureComponent } from 'react'
import { Modal, Platform, TouchableOpacity, Text, View } from 'react-native'
import { color, size } from '../../../styles'
import { scaleSize } from '../../../utils'
import { getLanguage } from '../../../language/index'

export default class HomePopupModal extends PureComponent {
  props: {
    language: string,
    setLanguage: () => {},
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
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }
  _renderItem = (label, onClick: () => {}) => {
    let fontSize = size.fontSize.fontSizeXl
    let height = scaleSize(80)
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: color.contentColorWhite,
          // paddingLeft: scaleSize(16),
          // paddingRight: scaleSize(16),
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            width: '100%',
            height: height,
            backgroundColor: color.contentColorWhite,
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
            {this._renderItem(
              //'切换账号'
              getLanguage(this.props.language).Profile.SWITCH_ACCOUNT,
              this.props.onToggleAccount,
            )}
            {/*{this._renderItem('注册', this.props.onRegister)}*/}
            {this._renderItem(
              //'退出登录'
              getLanguage(this.props.language).Profile.LOG_OUT,
              this.props.onLogout,
            )}
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
            {this._renderItem(
              getLanguage(this.props.language).Navigator_Lable.LEFT_TOP_LOG,
              this.props.onLogin,
            )}
            {this._renderItem(
              getLanguage(this.props.language).Navigator_Lable.LEFT_TOP_REG,
              this.props.onRegister,
            )}
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
            backgroundColor: color.contentColorWhite,
          }}
        >
          {this._renderItem(
            getLanguage(this.props.language).Navigator_Lable.RIGHT_TOP_ABOUT,
            this.props.onAbout,
          )}
          {this._renderItem(
            this.props.language == 'EN' ? '中文' : 'English',
            () => {
              if (this.props.language == 'EN') {
                this.props.setLanguage('CN')
                global.language = 'CN'
              } else {
                this.props.setLanguage('EN')
                global.language = 'EN'
              }
            },
          )}
          {/* {this._renderItem(
            getLanguage(this.props.language).Navigator_Lable.RIGHT_TOP_SETTING,
            this.props.onSetting,
          )} */}
          {this._renderItem(
            getLanguage(this.props.language).Navigator_Lable.RIGHT_TOP_EXIT,
            this.closeApp,
          )}
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
          style={{ flex: 1, backgroundColor: color.modalBgColor }}
        >
          {this._selectRender()}
        </TouchableOpacity>
      </Modal>
    )
  }
}
