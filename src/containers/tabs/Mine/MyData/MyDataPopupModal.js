import React, { PureComponent } from 'react'
import { Modal, Platform, TouchableOpacity, Text, View } from 'react-native'
import { color } from '../../../../styles'
export default class MyDataPopupModal extends PureComponent {
  props: {
    modalVisible: boolean,
    onCloseModal: () => {},
    data: Object,
  }

  defaultProps: {
    modalVisible: false,
    data: [],
  }

  constructor(props) {
    super(props)
    this.fontSize = Platform.OS === 'ios' ? 18 : 16
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
          backgroundColor: color.item_separate_white,
        }}
      />
    )
  }

  _renderList = () => {
    let list = []
    this.props.data.forEach(item => {
      list.push(this._renderBtn(item))
    })
    return list
  }

  _renderBtn = item => {
    return (
      <TouchableOpacity
        key={item.title}
        onPress={() => {
          item.action && item.action()
        }}
      >
        <Text
          style={{
            width: '100%',
            height: 60,
            backgroundColor: color.content_white,
            textAlign: 'center',
            lineHeight: 60,
            fontSize: this.fontSize,
          }}
        >
          {item.title}
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
          style={{ flex: 1, backgroundColor: '#rgba(0, 0, 0, 0.3)' }}
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
            {this._renderSeparatorLine()}
            {this._renderList()}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
