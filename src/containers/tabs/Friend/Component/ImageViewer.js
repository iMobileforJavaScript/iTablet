import * as React from 'react'
import { Modal } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

export default class ChatImageViewer extends React.Component {
  props: {
    imgUri: String,
  }

  constructor(props) {
    super(props)
    this.state = {
      imageUrls: [{ url: props.imgUri }],
      visible: false,
    }
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

  render() {
    return (
      <Modal visible={this.state.visible} transparent={true}>
        <ImageViewer
          imageUrls={this.state.imageUrls}
          onClick={() => {
            this.setVisible(false)
          }}
        />
      </Modal>
    )
  }
}
