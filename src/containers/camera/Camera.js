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
import { RNCamera } from 'react-native-camera'
import Video from 'react-native-video'
import { SMediaCollector } from 'imobile_for_reactnative'
import ImagePicker from 'react-native-image-crop-picker'
import Orientation from 'react-native-orientation'

import styles from './styles'

const TYPE = {
  PICTURE: 1,
  VIDEO: 2,
  AUDIO: 3,
}

export default class Camera extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    // const { params } = this.props.navigation.state || {}
    this.camera = null
    this.type = TYPE.PICTURE
    this.data = null

    this.state = {
      isFinished: false, // 拍摄是否完成
      videoPaused: true, // 视频是否暂停
    }

    this.taking = false // 是否在拍摄过程中
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentWillUnmount() {
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
    if (!this.camera || this.type !== TYPE.PICTURE || this.taking) return
    this.taking = true
    const options = { quality: 0.5, base64: true, pauseAfterCapture: true }
    this.data = await this.camera.takePictureAsync(options)
    //  eslint-disable-next-line
    this.setState(
      {
        isFinished: true,
      },
      () => {
        this.taking = false
      },
    )
  }

  /** 开始录制视频 **/
  recordAsync = async () => {
    if (!this.camera || this.type !== TYPE.VIDEO) return
    const options = {
      quality: RNCamera.Constants.VideoQuality['480p'],
      mirrorVideo: true,
    }
    this.data = await this.camera.recordAsync(options)
  }

  /** 结束录制视频 **/
  stopRecording = async () => {
    if (!this.camera && this.type === TYPE.VIDEO) return
    this.camera && this.camera.stopRecording()
    this.setState({
      isFinished: true,
    })
    // this.camera && this.camera.pausePreview()
  }

  /** 重拍 **/
  remake = () => {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        isFinished: false,
      })
      // 重置数据
      this.type === TYPE.PICTURE && this.camera && this.camera.resumePreview()
      this.data = null
      this.type = TYPE.PICTURE
    })
  }

  addMedia = async (mediaPaths = []) => {
    let result = await SMediaCollector.addMedia({
      datasourceName: 'Hunan',
      datasetName: 'MediaDataset',
      mediaPaths,
    })
    return result
  }

  /** 确认 **/
  confirm = () => {
    (async function() {
      let sourcePath = this.data.uri.replace('file://', '')

      let result = await this.addMedia([sourcePath])

      this.type === TYPE.PICTURE && this.camera && this.camera.resumePreview()
      if (result) {
        this.setState({
          isFinished: false,
        })
        NavigationService.goBack()
      }
    }.bind(this)())
  }

  /** 视频播放/暂停 **/
  play = () => {
    if (
      !this.data ||
      !this.data.uri ||
      !this.state.isFinished ||
      this.type !== TYPE.VIDEO ||
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

  renderVideo = () => {
    if (
      !this.data ||
      !this.data.uri ||
      !this.state.isFinished ||
      this.type !== TYPE.VIDEO
    )
      return null
    return (
      <Video
        source={{ uri: this.data.uri }}
        ref={ref => (this.player = ref)}
        paused={this.state.videoPaused}
        style={styles.video}
        onEnd={() => {
          if (this.player) {
            this.player.seek(0, 0)
          }
          !this.state.videoPaused &&
            this.setState({
              videoPaused: true,
            })
        }}
      />
    )
  }

  renderVideoControl = () => {
    if (
      !this.data ||
      !this.data.uri ||
      !this.state.isFinished ||
      this.type !== TYPE.VIDEO
    )
      return null
    return (
      <TouchableOpacity onPress={() => this.play()} style={styles.play}>
        <Image
          resizeMode={'contain'}
          source={getPublicAssets().common.icon_rephotograph}
          style={styles.smallIcon}
        />
      </TouchableOpacity>
    )
  }

  renderBottomBtns = () => {
    if (this.state.isFinished) {
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
    if (this.state.isFinished) return null
    return (
      <TouchableOpacity
        style={styles.capture}
        onPress={() => this.takePicture()}
        onLongPress={() => {
          this.type = TYPE.VIDEO
          this.recordAsync()
        }}
        delayPressIn={1000}
        onPressIn={() => {}}
        onPressOut={() => {
          (async function() {
            if (this.type === TYPE.VIDEO) {
              await this.stopRecording()
              // this.type = TYPE.PICTURE
            }
          }.bind(this)())
        }}
      >
        <Text style={{ fontSize: 14 }}> SNAP </Text>
      </TouchableOpacity>
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
        {this.renderVideoControl()}
        {this.renderBottomBtns()}
        {this.renderCenterBtn()}
      </View>
    )
  }
}
