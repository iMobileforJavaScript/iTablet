import * as React from 'react'
import { InteractionManager, TouchableOpacity, View, Image } from 'react-native'
import { ConstPath } from '../../constants'
import { FileTools } from '../../native'
import NavigationService from '../../containers/NavigationService'
import { getThemeAssets } from '../../assets'
import { SMMeasureView, SMeasureView } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
// import { getLanguage } from '../../language'

import styles from './styles'
import ImageButton from '../../components/ImageButton'

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
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentWillUnmount() {
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

  /** 保存 **/
  save = async () => {}

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
  confirm = () => {}

  renderBottomBtns = () => {
    return (
      <View style={styles.buttonView}>
        <TouchableOpacity onPress={() => this.undo()} style={styles.iconView}>
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_cancel}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.clearAll()}
          style={styles.iconView}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_clear}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  renderCenterBtn = () => {
    return (
      <ImageButton
        containerStyle={styles.capture}
        iconStyle={styles.iconView}
        activeOpacity={0.5}
        icon={getThemeAssets().ar.icon_ar_measure_add}
        onPress={() => {
          this.addNewRecord()
        }}
      />
    )
  }

  renderTopBtns = () => {
    return (
      <View style={styles.topView}>
        <TouchableOpacity
          onPress={() => NavigationService.goBack()}
          style={styles.iconView}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_back}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.save()} style={styles.iconView}>
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.icon_ar_measure_save}
            style={styles.smallIcon}
          />
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
        {this.renderTopBtns()}
      </View>
    )
  }
}
