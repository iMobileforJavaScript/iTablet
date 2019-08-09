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
import { getPublicAssets, getThemeAssets } from '../../assets'
import { SMMeasureView, SMeasureView } from 'imobile_for_reactnative'
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

/*
 * AR高精度采集界面
 */
export default class MeasureView extends React.Component {
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
      type: TYPE.PHOTO,
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
    // Orientation.unlockAllOrientations()
  }

  componentDidMount() {
    (async function() {
      let targetPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
          this.props.user.currentUser.userName +
          '/' +
          ConstPath.RelativeFilePath.Media,
      )
      SMeasureView.saveDataset(targetPath, targetPath)
    }.bind(this)())
  }

  /** 添加 **/
  addNewRecord = async () => {
    await SMeasureView.addNewRecord()
  }

  /** 撤销 **/
  undo = async () => {
    await SMeasureView.undoDraw()
  }

  /** 清除 **/
  clearAll = async () => {
    await SMeasureView.clearAll()
  }

  /** 重置/切换模式 **/
  remake = () => {
    //安排任务在交互和动画完成之后执行
    InteractionManager.runAfterInteractions(() => {
      // 重置数据
    })
  }

  // addMedia = async (mediaPaths = []) => {
  //   // TODO 添加提示
  //   if (!this.datasourceAlias) return
  //   let result = await SMediaCollector.addMedia({
  //     datasourceName: this.datasourceAlias,
  //     datasetName: this.datasetName,
  //     mediaPaths,
  //   })
  //   return result
  // }

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
        NavigationService.goBack()
      }
    }.bind(this)())
  }

  renderBottomBtns = () => {
    // if (this.state.recordStatus === RECORD_STATUS.RECORDING) return null
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
          <TouchableOpacity onPress={() => this.undo()} style={styles.iconView}>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.icon_ai_measure_cancel}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.clearAll()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.icon_ai_measure_flag}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
      )
    }
  }

  renderCenterBtn = () => {
    // 照片/视频拍摄完成不显示此按钮
    return (
      <ImageButton
        containerStyle={styles.capture}
        iconStyle={styles.iconView}
        icon={getThemeAssets().ar.icon_ai_measure_cross}
        onPress={() => {
          this.addNewRecord()
        }}
      />
    )
  }

  renderChangeBtns = () => {
    // if (this.state.recordStatus !== RECORD_STATUS.UN_RECORD) return null
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
        <SMMeasureView ref={ref => (this.SMMeasureView = ref)} />
        {this.renderBottomBtns()}
        {this.renderCenterBtn()}
        {/*{this.renderChangeBtns()}*/}
      </View>
    )
  }
}
