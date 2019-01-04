import React, { PureComponent } from 'react'
import { Modal, Platform, TouchableOpacity, Text, View } from 'react-native'
export default class LocalDataPopupModal extends PureComponent {
  props: {
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
  }

  _onRequestClose = () => {
    if (Platform.OS === 'android') {
      this._onCloseModal()
    }
  }
  _onCloseModal = () => {
    this.props.onCloseModal()
  }
  _onImportWorkspace = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onImportWorkspace()
        }}
      >
        <Text
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#555555',
            textAlign: 'center',
            lineHeight: 50,
          }}
        >
          导入数据
        </Text>
        <View
          style={{ width: '100%', height: 4, backgroundColor: '#2D2D2F' }}
        />
      </TouchableOpacity>
    )
  }
  _onDeleteButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.onDeleteData()
        }}
      >
        <Text
          style={{
            width: '100%',
            height: 50,
            backgroundColor: '#555555',
            textAlign: 'center',
            lineHeight: 50,
          }}
        >
          删除
        </Text>
        <View
          style={{ width: '100%', height: 4, backgroundColor: '#2D2D2F' }}
        />
      </TouchableOpacity>
    )
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
          style={{ flex: 1 }}
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
            {this._onImportWorkspace()}
            {this._onDeleteButton()}
          </View>
        </TouchableOpacity>
      </Modal>
    )
  }
}
