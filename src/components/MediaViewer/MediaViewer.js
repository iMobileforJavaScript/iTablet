/**
 * 多媒体预览界面
 */
import * as React from 'react'
import { Dimensions, Image, View, TouchableOpacity, Modal } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import Video from 'react-native-video'
import { getPublicAssets } from '../../assets'
import { checkType } from '../../utils'
import { Progress } from '../Progress'

import styles from './styles'

const TYPE = {
  PHOTO: 'photo',
  VIDEO: 'video',
  AUDIO: 'audio',
}

const VIDEO_STATUS = {
  PLAYING: 1, // 播放中
  PAUSE: 2, // 暂停
  STOP: 3, // 停止
}

export default class MediaViewer extends React.Component {
  props: {
    uri: Object,
    // type: string,
    isModal: boolean,
    containerStyle: any,
    withBackBtn: boolean,
  }

  static defaultProps = {
    isModal: false,
    withBackBtn: false,
    containerStyle: styles.container,
  }

  constructor(props) {
    super(props)

    this.state = {
      uri: props.uri || '',
      visible: false,

      videoPaused: true, // 视频是否暂停
      videoControllerVisible: false, // 视频控制器是否显示
      type: TYPE.PHOTO,
      videoStatus: VIDEO_STATUS.STOP, // 视频状态
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (this.state.uri !== prevState.uri) {
  //     this.forceUpdate()
  //   }
  // }

  setVisible = (visible = !this.state.visible, uri = '') => {
    let newState = {}
    if (visible !== this.state.visible) {
      newState.visible = visible
    }
    if (uri !== this.state.uri) {
      let type = checkType.getMediaTypeByPath(uri)
      if (this.state.type !== type) {
        newState.type = type
      }
      newState.uri = uri
    }
    if (Object.keys(newState).length > 0) {
      this.setState(newState, () => {
        visible && this.forceUpdate()
      })
    }
  }

  setVideoControllerVisible = (option = {}) => {
    if (option.visible === undefined) {
      option.visible = !this.state.videoControllerVisible
    }

    if (option.autoDismiss && option.visible) {
      this.timer = setTimeout(() => {
        this.setState({
          videoControllerVisible: false,
        })
        clearTimeout(this.timer)
        this.timer = null
      }, 2000)
    } else if (!option.visible) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    }

    if (option.visible !== this.state.videoControllerVisible) {
      this.setState({
        videoControllerVisible: option.visible,
      })
    }
  }

  /** 视频播放/暂停 **/
  play = () => {
    if (!this.state.uri || this.state.type !== TYPE.VIDEO || !this.player)
      return null
    if (this.state.videoStatus === VIDEO_STATUS.STOP) {
      this.player.seek(0, 0)
    }
    this.setState({
      videoPaused: !this.state.videoPaused,
      videoStatus: !this.state.videoPaused
        ? VIDEO_STATUS.PLAYING
        : VIDEO_STATUS.PAUSE,
    })
  }

  renderProgress = () => {
    if (
      this.state.type !== TYPE.VIDEO ||
      (this.state.type === TYPE.VIDEO &&
        this.state.videoStatus === VIDEO_STATUS.STOP)
    )
      return null

    return (
      <Progress
        ref={ref => (this.mProgress = ref)}
        style={styles.progressView}
        progressAniDuration={0}
        progressColor={'#rgba(123, 183, 54, 0.5)'}
      />
    )
  }

  renderVideoViewer = () => {
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: this.state.uri }}
          ref={ref => (this.player = ref)}
          paused={this.state.videoPaused}
          repeat={false}
          style={styles.video}
          onEnd={() => {
            if (this.player) {
              // this.player.seek(0, 0)
              if (this.mProgress) {
                this.mProgress.progress = 1
              }
              this.setState({
                videoPaused: true,
                videoStatus: VIDEO_STATUS.STOP,
              })
            }
          }}
          onProgress={({ currentTime, seekableDuration }) => {
            // console.warn(currentTime, seekableDuration)
            currentTime = currentTime.toFixed() - 1 + 1
            seekableDuration = seekableDuration.toFixed() - 1 + 1
            if (this.mProgress) {
              this.mProgress.progress = currentTime / seekableDuration
            }
          }}
        />
        {this.renderProgress()}
        <View style={styles.videoControlView}>
          <TouchableOpacity
            onPress={() =>
              this.setVideoControllerVisible({ autoDismiss: true })
            }
            style={styles.videoControlView}
          />
          {(this.state.videoControllerVisible || this.state.videoPaused) && (
            <TouchableOpacity onPress={() => this.play()} style={styles.play}>
              <View style={styles.playOverlay} />
              <Image
                resizeMode={'contain'}
                source={
                  this.state.videoPaused
                    ? getPublicAssets().common.icon_play_white
                    : getPublicAssets().common.icon_pause_white
                }
                style={styles.smallIcon}
              />
            </TouchableOpacity>
          )}
          {this.props.withBackBtn && (
            <TouchableOpacity
              onPress={() => this.setVisible(false)}
              style={styles.backBtn}
            >
              <View style={styles.backBtnBg} />
              <Image
                style={styles.backIcon}
                source={require('../../assets/public/Frenchgrey/icon-back-white.png')}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  renderImageViewer = () => {
    return (
      <ImageZoom
        onClick={() => this.setVisible(false)}
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={this.imageWidth}
        imageHeight={this.imageHeight}
        enableCenterFocus={true}
      >
        <Image
          style={{ width: this.imageWidth, height: this.imageHeight }}
          source={{ uri: this.state.uri }}
        />
      </ImageZoom>
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
    Image.getSize(this.state.uri, (width, height) => {
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

  renderContent = () => {
    let extension = this.state.uri.substr(this.state.uri.lastIndexOf('.') + 1)
    return (
      <TouchableOpacity
        onLayout={this.handleLayout}
        activeOpacity={1}
        style={this.props.containerStyle}
        onPress={() => {
          this.setVisible(false)
        }}
      >
        {extension === 'mp4' || extension === 'mov'
          ? this.renderVideoViewer()
          : this.renderImageViewer()}
      </TouchableOpacity>
    )
  }

  render() {
    if (!this.state.uri || !this.state.visible) return null

    if (this.props.isModal) {
      return (
        <Modal visible={this.state.visible} transparent={true}>
          {this.renderContent()}
        </Modal>
      )
    }
    return this.renderContent()
  }
}
