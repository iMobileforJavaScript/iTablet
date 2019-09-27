import * as React from 'react'
import {
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

export default class ChatImageViewer extends React.Component {
  props: {
    imgUri: String,
    receivePicture: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      imageUrls: [{ url: props.imgUri }],
      visible: false,
    }
    this.screenWidth = Dimensions.get('window').width
  }

  setVisible = visible => {
    if (visible !== this.state.visible) {
      this.setState({ visible })
    }
  }

  setImageUri = uri => {
    this.setState({
      imageUrls: [{ url: uri }],
    })
  }

  setPicMsg = message => {
    this.message = message
  }

  receivePicture = () => {
    if (!this.message.originMsg.message.message.filePath) {
      this.props.receivePicture && this.props.receivePicture(this.message)
    }
  }

  renderImageFooter = () => {
    return (
      <TouchableOpacity
        onPress={this.receivePicture}
        style={styles.bottomMenuStyle}
      >
        <Text>123</Text>
      </TouchableOpacity>
    )
  }

  render() {
    this.screenWidth = Dimensions.get('window').width
    return (
      <Modal
        animationType={'fade'}
        onBackButtonPress={() => {
          this.setVisible(false)
        }}
        visible={this.state.visible}
        transparent={true}
      >
        <ImageViewer
          imageUrls={this.state.imageUrls}
          // renderFooter={this.renderImageFooter}
          footerContainerStyle={[
            styles.footerContainerStyle,
            { width: this.screenWidth },
          ]}
          saveToLocalByLongPress={false}
          onClick={() => {
            this.setVisible(false)
          }}
        />
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  bottomMenuStyle: {
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'red',
    width: 200,
    height: 50,
  },
  footerContainerStyle: {
    alignItems: 'center',
  },
})
