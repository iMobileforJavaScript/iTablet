/**
 * 视频预览界面
 */
import * as React from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import Video from 'react-native-video'
import { getPublicAssets } from '../../assets'
import { Progress } from '../Progress'
import { VIDEO_STATUS } from './MediaConst'

import styles from './styles'

export default class VideoViewer extends React.Component {
  props: {
    uri: Object,
    withBackBtn: boolean,
    backAction: () => {},
  }

  static defaultProps = {
    withBackBtn: false,
  }

  constructor(props) {
    super(props)

    this.state = {
      videoPaused: true, // 视频是否暂停
      videoControllerVisible: false, // 视频控制器是否显示
      videoStatus: VIDEO_STATUS.STOP, // 视频状态
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
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
    if (!this.props.uri || !this.player) return null
    if (this.state.videoStatus === VIDEO_STATUS.STOP) {
      this.player.seek(0, 0)
      this.mProgress.progress = 0
    }
    let videoPaused = !this.state.videoPaused
    this.setState({
      videoPaused: videoPaused,
      videoStatus: videoPaused ? VIDEO_STATUS.PAUSE : VIDEO_STATUS.PLAYING,
    })
  }

  /** 视频暂停 **/
  pause = () => {
    if (!this.props.uri || !this.player) return null
    this.setState({
      videoPaused: true,
      videoStatus: VIDEO_STATUS.PAUSE,
    })
  }

  renderProgress = () => {
    return (
      <Progress
        ref={ref => (this.mProgress = ref)}
        style={styles.progressView}
        progressAniDuration={0}
        progressColor={'#rgba(123, 183, 54, 0.5)'}
      />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Video
          source={{ uri: this.props.uri }}
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
              onPress={() => {
                if (typeof this.props.backAction === 'function') {
                  this.props.backAction()
                }
              }}
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
}
