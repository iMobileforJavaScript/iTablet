import * as React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  View,
  Image,
  Text,
  DeviceEventEmitter,
} from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { getThemeAssets } from '../../assets'
import { SMMeasureView, SMeasureView } from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import styles from './styles'
import ImageButton from '../../components/ImageButton'
import { Container } from '../../components'
// import { getLanguage } from '../../language'

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
    this.datasetName = params.datasetName

    this.state = {
      currentLength: 0,
      totalLength: 0,
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      // 初始化数据
      (async function() {
        SMeasureView.initMeasureCollector(
          this.datasourceAlias,
          this.datasetName,
        )
        //注册监听
        DeviceEventEmitter.addListener(
          'onCurrentLengthChanged',
          this.onCurrentLengthChanged,
        )
        DeviceEventEmitter.addListener(
          'onTotalLengthChanged',
          this.onTotalLengthChanged,
        )
      }.bind(this)())
    })
  }

  componentWillUnmount() {
    // Orientation.unlockAllOrientations()
    //移除监听
    DeviceEventEmitter.removeListener(
      'onCurrentLengthChanged',
      this.onCurrentLengthChanged,
    )
    DeviceEventEmitter.removeListener(
      'onTotalLengthChanged',
      this.onTotalLengthChanged,
    )
  }

  onCurrentLengthChanged = params => {
    this.setState({
      currentLength: params.current,
    })
  }

  onTotalLengthChanged = params => {
    this.setState({
      totalLength: params.total,
    })
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
  save = async () => {
    if (!this.datasourceAlias && !this.datasetName) return
    let result = await SMeasureView.saveDataset()
    if (result) {
      await SMeasureView.clearAll()
    }
  }

  /** 重置/切换模式 **/
  remake = () => {
    //安排任务在交互和动画完成之后执行
    InteractionManager.runAfterInteractions(() => {
      // 重置数据
    })
  }

  /** 确认 **/
  confirm = () => {}

  back = () => {
    NavigationService.goBack()
    return true
  }

  renderBottomBtns = () => {
    return (
      <View style={styles.toolbar}>
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => this.clearAll()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_close}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.undo()} style={styles.iconView}>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_undo}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.addNewRecord()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_switch}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.save()} style={styles.iconView}>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_save}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
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

  renderLengthChangeView() {
    return (
      <View style={styles.lengthChangeView}>
        <Text style={styles.titleTotal}>
          {'总长度:' + this.state.totalLength + 'm'}
        </Text>
      </View>
    )
  }

  renderCurrentLengthChangeView() {
    return (
      <View style={styles.currentLengthChangeView}>
        <Text style={styles.title}>
          {'视点距离:' + this.state.currentLength + 'm'}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: '视频地图',
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMMeasureView ref={ref => (this.SMMeasureView = ref)} />
        {this.renderBottomBtns()}
        {/*{this.renderCenterBtn()}*/}
        {/*{this.renderTopBtns()}*/}
        {this.renderLengthChangeView()}
        {this.renderCurrentLengthChangeView()}
      </Container>
    )
  }
}
