import React, { PureComponent } from 'react'
import {
  Modal,
  Platform,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
} from 'react-native'
import { color, size } from '../../styles'
import { scaleSize } from '../../utils'
import * as ExtraDimensions from 'react-native-extra-dimensions-android'

export default class PopModal extends PureComponent {
  props: {
    children: any,
    type?: string,
    onCloseModal: () => {},
  }

  defaultProps: {
    type: 'table',
  }

  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
    }
  }

  setVisible = (visible, cb) => {
    if (visible === undefined) {
      visible = !this.state.modalVisible
    } else if (visible === this.state.modalVisible) {
      return
    }
    this.setState(
      {
        modalVisible: visible,
      },
      () => {
        if (cb && typeof cb === 'function') {
          cb()
        }
      },
    )
  }

  _onRequestClose = () => {
    if (Platform.OS === 'android') {
      this._onCloseModal()
    }
  }

  _onCloseModal = () => {
    if (
      this.props.onCloseModal &&
      typeof this.props.onCloseModal === 'function'
    ) {
      this.props.onCloseModal()
    }
    this.setState({
      modalVisible: false,
    })
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

  _renderContent = () => {
    return (
      <View
        style={{
          flex: 1,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: color.contentColorWhite,
          paddingBottom: this.virtualMenuHeight,
        }}
      >
        {this.props.children}
      </View>
    )
  }

  render() {
    // let animationType = Platform.OS === 'ios' ? 'slide' : 'fade'
    let animationType = 'fade'
    const deviceHeight =
      Platform.OS === 'ios'
        ? Dimensions.get('window').height
        : ExtraDimensions.getRealWindowHeight() -
          ExtraDimensions.getStatusBarHeight()
    const deviceWidth = Dimensions.get('window').width
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
        visible={this.state.modalVisible}
      >
        <View style={{ height: deviceHeight, width: deviceWidth }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this._onCloseModal()
            }}
            style={{ flex: 1, backgroundColor: color.modalBgColor }}
          />
          {this._renderContent()}
        </View>
      </Modal>
    )
  }
}
