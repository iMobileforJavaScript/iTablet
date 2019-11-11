/**
 * 图片预览界面
 */
import * as React from 'react'
import { Dimensions, Image, TouchableOpacity, Platform } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
// eslint-disable-next-line import/no-unresolved
import PhotoView from 'react-native-photo-view'
import styles from './styles'

export default class ImageViewer extends React.Component {
  props: {
    uri: Object,
    containerStyle: any,
    backAction: () => {},
  }

  static defaultProps = {
    containerStyle: styles.container,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  handleLayout = event => {
    let imageZoomShouldUpdate = false
    let imageShouldUpdate = false
    if (event.nativeEvent.layout.width !== this.width) {
      this.width = event.nativeEvent.layout.width
      this.height = event.nativeEvent.layout.height
      imageZoomShouldUpdate = true
    }
    Image.getSize(this.props.uri, (width, height) => {
      this.imageWidth = 200
      this.imageHeight = 200
      if (this.imageWidth !== width || this.imageHeight !== height) {
        imageShouldUpdate = true
        this.imageWidth = width
        this.imageHeight = height

        if (width > this.width || height > this.height) {
          let imgScale = this.imageHeight / this.imageWidth
          let imgViewScale = this.height / this.width

          if (imgScale > imgViewScale) {
            this.imageHeight = this.height
            this.imageWidth = this.height / imgScale
          } else {
            this.imageWidth = this.width
            this.imageHeight = this.width * imgScale
          }
        }
      }

      // 强制刷新
      (imageZoomShouldUpdate || imageShouldUpdate) && this.forceUpdate()
    })

    // this.forceUpdate()
  }

  renderIOS = () => {
    return (
      <ImageZoom
        onClick={() => {
          if (typeof this.props.backAction === 'function') {
            this.props.backAction()
          }
        }}
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={this.imageWidth}
        imageHeight={this.imageHeight}
        // enableCenterFocus={true}
      >
        <Image
          style={{ width: this.imageWidth, height: this.imageHeight }}
          source={{ uri: this.props.uri }}
        />
      </ImageZoom>
    )
  }

  renderAndroid = () => {
    return (
      <PhotoView
        source={{ uri: this.props.uri }}
        minimumZoomScale={0.5}
        maximumZoomScale={3}
        androidScaleType="center"
        style={{
          // width: this.imageWidth,
          // height: this.imageHeight,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
        }}
      />
    )
  }

  render() {
    return (
      <TouchableOpacity
        onLayout={this.handleLayout}
        activeOpacity={1}
        style={this.props.containerStyle}
        onPress={() => {
          if (typeof this.props.backAction === 'function') {
            this.props.backAction()
          }
        }}
      >
        {Platform.OS === 'ios' ? this.renderIOS() : this.renderAndroid()}
      </TouchableOpacity>
    )
  }
}
