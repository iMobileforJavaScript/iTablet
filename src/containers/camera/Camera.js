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
import { Progress, MediaViewer, ImagePicker } from '../../components'
import { RNCamera } from 'react-native-camera'
import { SMediaCollector } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import { getLanguage } from '../../language'

import styles from './styles'
import ImageButton from '../../components/ImageButton'

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

const TIME_LIMIT = 60

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
    this.datasourceAlias = params.datasourceAlias || ''
    this.datasetName = params.datasetName || 'MediaDataset'
    this.limit = params.limit >= 0 ? params.limit : 9
    this.cb = params.cb
    this.camera = null

    this.state = {
      data: null,
      videoPaused: true, // 视频是否暂停
      showVideoController: false, // 视频控制器是否显示
      type: TYPE.PHOTO,
      recordStatus: RECORD_STATUS.UN_RECORD, // 拍摄状态
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    global.isPad && Orientation.lockToPortrait()
  }

  componentWillUnmount() {
    if (this.recordTimer) {
      clearInterval(this.recordTimer)
      this.recordTimer = null
    }
    global.isPad && Orientation.unlockAllOrientations()
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
    this.mediaViewer && this.mediaViewer.setVisible(true, data.uri)
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
      maxDuration: TIME_LIMIT,
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
    this.mediaViewer && this.mediaViewer.setVisible(true, data.uri)
  }

  /** 结束录制视频 **/
  stopRecording = async () => {
    if (
      (!this.camera && this.state.type === TYPE.VIDEO) ||
      this.state.recordStatus !== RECORD_STATUS.RECORDING
    )
      return
    this.camera && this.camera.stopRecording()
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
      this.mediaViewer && this.mediaViewer.setVisible(false)
    })
  }

  addMedia = async (mediaPaths = []) => {
    // TODO 添加提示
    if (!this.datasourceAlias) return
    let result = await SMediaCollector.addMedia({
      datasourceName: this.datasourceAlias,
      datasetName: this.datasetName,
      mediaPaths,
    })
    return result
  }

  /** 确认 **/
  confirm = () => {
    (async function() {
      let sourcePath = this.state.data.uri.replace('file://', '')

      let result = false
      if (this.cb && typeof this.cb === 'function') {
        result = true
        this.cb([sourcePath])
      } else {
        result = await this.addMedia([sourcePath])
      }

      this.state.type === TYPE.PHOTO &&
        this.camera &&
        this.camera.resumePreview()
      if (result) {
        // this.setState({
        //   recordStatus: RECORD_STATUS.RECORDED,
        // })
        NavigationService.goBack()
      }
    }.bind(this)())
  }

  openAlbum = () => {
    ImagePicker.AlbumListView.defaultProps.showDialog = false
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
    ImagePicker.getAlbum({
      maxSize: 9,
      callback: async data => {
        let mediaPaths = []
        if (data.length > 0) {
          data.forEach(item => {
            // mediaPaths.push(item.uri.replace(Platform.OS === 'ios' ? 'assets-library://' : 'contents://', ''))
            mediaPaths.push(item.uri)
          })
          if (this.cb && typeof this.cb === 'function') {
            this.cb(mediaPaths)
            NavigationService.goBack()
          } else {
            let result = await this.addMedia(mediaPaths)
            result && NavigationService.goBack()
          }
        }
      },
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
      <ImageButton
        containerStyle={styles.capture}
        iconStyle={styles.iconView}
        icon={getPublicAssets().common.icon_take_camera}
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
      />
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
        {this.renderProgress()}

        <MediaViewer ref={ref => (this.mediaViewer = ref)} />
        {this.renderBottomBtns()}
        {this.renderCenterBtn()}
        {this.renderChangeBtns()}
      </View>
    )
  }
}
