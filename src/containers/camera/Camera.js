/**
 * 相机界面
 */
import * as React from 'react'
import {
  InteractionManager,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native'
import { ConstPath } from '../../constants'
import { FileTools } from '../../native'
import NavigationService from '../../containers/NavigationService'
import { getPublicAssets } from '../../assets'
import { Progress } from '../../components'
import { RNCamera } from 'react-native-camera'
import Video from 'react-native-video'
import { SMediaCollector } from 'imobile_for_reactnative'
import ImagePicker from 'react-native-image-crop-picker'
import Orientation from 'react-native-orientation'
import { getLanguage } from '../../language'

import styles from './styles'

const TYPE = {
  PHOTO: 1,
  VIDEO: 2,
  AUDIO: 3,
}

const RECORD_STATUS = {
  UN_RECORD: 1, // 未拍摄
  RECORDING: 2, // 拍摄中，拍照没有这个状态
  RECORDED: 3, // 拍摄完
}

const TIME_LIMIT = 6

export default class Camera extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}
    this.datasourceAlias = params.datasourceAlias || 'Hunan'
    this.camera = null

    this.state = {
      data: null,
      // isFinished: false, // 拍摄是否完成
      videoPaused: true, // 视频是否暂停
      showVideoController: false, // 视频控制器是否显示
      type: TYPE.PHOTO,
      recordStatus: RECORD_STATUS.UN_RECORD, // 拍摄状态
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentWillUnmount() {
    if (this.recordTimer) {
      clearInterval(this.recordTimer)
      this.recordTimer = null
    }
    Orientation.unlockAllOrientations()
  }

  componentDidMount() {
    (async function() {
      let targetPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
          this.props.user.currentUser.userName +
          '/' +
          ConstPath.RelativeFilePath.Media,
      )
      SMediaCollector.initMediaCollector(targetPath)
    }.bind(this)())
  }

  /** 照相 **/
  takePicture = async () => {
    if (
      !this.camera ||
      this.state.type !== TYPE.PHOTO ||
      this.state.recordStatus === RECORD_STATUS.RECORDING
    )
      return
    this.setState({
      recordStatus: RECORD_STATUS.RECORDING,
    })
    const options = { quality: 0.5, base64: true, pauseAfterCapture: true }
    let data = await this.camera.takePictureAsync(options)
    this.setState({
      data,
      recordStatus: RECORD_STATUS.RECORDED,
    })
  }

  /** 开始录制视频 **/
  recordAsync = async () => {
    if (
      !this.camera ||
      this.state.type !== TYPE.VIDEO ||
      this.state.recordStatus === RECORD_STATUS.RECORDING
    )
      return
    const options = {
      quality: RNCamera.Constants.VideoQuality['480p'],
      mirrorVideo: false,
      maxDuration: 6,
    }

    let startTime = new Date().getTime()
    this.setState(
      {
        recordStatus: RECORD_STATUS.RECORDING,
      },
      () => {
        this.recordTimer = setInterval(() => {
          let currentTime = new Date().getTime()
          let progress = (currentTime - startTime) / 1000 / TIME_LIMIT
          if (this.mProgress) {
            this.mProgress.progress = progress
          }
        }, 1000)
      },
    )

    let data = await this.camera.recordAsync(options)

    if (this.recordTimer) {
      clearInterval(this.recordTimer)
      this.recordTimer = null
    }
    if (this.mProgress) {
      this.mProgress.progress = 0
    }
    this.setState({
      data,
      recordStatus: RECORD_STATUS.RECORDED,
    })
  }

  /** 结束录制视频 **/
  stopRecording = async () => {
    if (
      (!this.camera && this.state.type === TYPE.VIDEO) ||
      this.state.recordStatus !== RECORD_STATUS.RECORDING
    )
      return
    this.camera && this.camera.stopRecording()
    // this.setState({
    //   recordStatus: RECORD_STATUS.RECORDED,
    // })
    // this.camera && this.camera.pausePreview()
  }

  /** 重拍 **/
  remake = () => {
    InteractionManager.runAfterInteractions(() => {
      // 重置数据
      this.state.type === TYPE.PHOTO &&
        this.camera &&
        this.camera.resumePreview()
      this.setState({
        data: null,
        recordStatus: RECORD_STATUS.UN_RECORD,
      })
    })
  }

  addMedia = async (mediaPaths = []) => {
    let result = await SMediaCollector.addMedia({
      datasourceName: this.datasourceAlias,
      datasetName: 'MediaDataset',
      mediaPaths,
    })
    return result
  }

  /** 确认 **/
  confirm = () => {
    (async function() {
      let sourcePath = this.state.data.uri.replace('file://', '')

      let result = await this.addMedia([sourcePath])

      this.state.type === TYPE.PHOTO &&
        this.camera &&
        this.camera.resumePreview()
      if (result) {
        this.setState({
          recordStatus: RECORD_STATUS.RECORDED,
        })
        NavigationService.goBack()
      }
    }.bind(this)())
  }

  /** 视频播放/暂停 **/
  play = () => {
    if (
      !this.state.data ||
      !this.state.data.uri ||
      this.state.recordStatus !== RECORD_STATUS.RECORDED ||
      this.state.type !== TYPE.VIDEO ||
      !this.player
    )
      return null
    this.setState({
      videoPaused: !this.state.videoPaused,
    })
  }

  openAlbum = () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then(async images => {
      let mediaPaths = []
      if (images.length > 0) {
        images.forEach(item => {
          mediaPaths.push(item.path.replace('file://', ''))
        })
        let result = await this.addMedia(mediaPaths)
        if (result) {
          NavigationService.goBack()
        }
      }
    })
  }

  changeType = (type, cb = () => {}) => {
    if (!type || type === this.state.type) return

    if (this.state.type === TYPE.VIDEO) {
      this.state.recordStatus === RECORD_STATUS.RECORDING &&
        this.stopRecording()
    }

    this.setState(
      {
        data: null,
        recordStatus: RECORD_STATUS.UN_RECORD,
        videoPaused: true,
        type,
      },
      () => {
        cb && cb()
      },
    )
  }

  renderVideo = () => {
    if (
      !this.state.data ||
      !this.state.data.uri ||
      this.state.recordStatus !== RECORD_STATUS.RECORDED ||
      this.state.type !== TYPE.VIDEO
    )
      return null
    return (
      <Video
        source={{ uri: this.state.data.uri }}
        ref={ref => (this.player = ref)}
        paused={this.state.videoPaused}
        repeat={false}
        style={styles.video}
        onEnd={() => {
          if (this.player) {
            this.player.seek(0, 0)
            if (this.mProgress) {
              this.mProgress.progress = 1
            }
            this.setState({
              videoPaused: true,
            })
          }
        }}
        onProgress={({ currentTime, seekableDuration }) => {
          if (this.mProgress) {
            this.mProgress.progress = currentTime / seekableDuration
          }
        }}
      />
    )
  }

  renderProgress = () => {
    if (
      !(
        this.state.type === TYPE.VIDEO &&
        (!this.state.videoPaused ||
          this.state.recordStatus === RECORD_STATUS.RECORDING)
      )
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

  renderVideoControl = () => {
    if (
      !this.state.data ||
      !this.state.data.uri ||
      this.state.recordStatus !== RECORD_STATUS.RECORDED ||
      this.state.type !== TYPE.VIDEO
    )
      return null
    return (
      <View style={styles.videoControlView}>
        <TouchableOpacity
          onPress={() => {
            this.setState({
              showVideoController: !this.state.showVideoController,
            })
          }}
          style={styles.videoControlView}
        />
        {(this.state.showVideoController || this.state.videoPaused) && (
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
      </View>
    )
  }

  renderBottomBtns = () => {
    if (this.state.recordStatus === RECORD_STATUS.RECORDING) return null
    if (this.state.recordStatus === RECORD_STATUS.RECORDED) {
      return (
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => this.remake()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_rephotograph}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.confirm()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_confirm}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => NavigationService.goBack()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_back}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.openAlbum()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_album}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderCenterBtn = () => {
    // 照片/视频拍摄完成不显示此按钮
    if (this.state.recordStatus === RECORD_STATUS.RECORDED) return null
    return (
      <TouchableOpacity
        style={styles.capture}
        onPress={() => {
          if (this.state.type === TYPE.VIDEO) {
            if (this.state.recordStatus === RECORD_STATUS.RECORDING) {
              this.stopRecording()
            } else {
              this.recordAsync()
            }
          } else {
            this.takePicture()
          }
        }}
        // onLongPress={() => {
        //   this.changeType(TYPE.VIDEO, this.recordAsync)
        // }}
        // delayPressIn={1000}
        // onPressIn={() => {}}
        // onPressOut={() => {
        //   (async function() {
        //     if (this.state.type === TYPE.VIDEO) {
        //       await this.stopRecording()
        //     }
        //   }.bind(this)())
        // }}
      >
        {/*<Text style={{ fontSize: 14 }}> SNAP </Text>*/}
      </TouchableOpacity>
    )
  }

  renderChangeBtns = () => {
    if (this.state.recordStatus !== RECORD_STATUS.UN_RECORD) return null
    return (
      <View style={styles.changeView}>
        <TouchableOpacity
          onPress={() => this.changeType(TYPE.VIDEO)}
          style={styles.typeBtn}
        >
          <Text
            style={
              this.state.type === TYPE.VIDEO
                ? styles.typeTextSelected
                : styles.typeText
            }
          >
            {getLanguage(this.props.language).Map_Tools.VIDEO}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.changeType(TYPE.PHOTO)}
          style={styles.typeBtn}
        >
          <Text
            style={
              this.state.type === TYPE.PHOTO
                ? styles.typeTextSelected
                : styles.typeText
            }
          >
            {getLanguage(this.props.language).Map_Tools.PHOTO}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          {({ camera, status }) => {
            // recordAudioPermissionStatus
            if (status === 'READY') this.camera = camera
          }}
        </RNCamera>
        {this.renderVideo()}
        {this.renderProgress()}
        {this.renderVideoControl()}
        {this.renderBottomBtns()}
        {this.renderCenterBtn()}
        {this.renderChangeBtns()}
      </View>
    )
  }
}
