import * as React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  View,
  Image,
  Text,
} from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { getThemeAssets } from '../../assets'
import {
  SMCollectSceneFormView,
  // SCollectSceneFormView,
} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import styles from './styles'
import { Container } from '../../components'
// import { getLanguage } from '../../language'

/*
 * AR高精度采集界面
 */
export default class CollectSceneFormView extends React.Component {
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
        // SMeasureView.initMeasureCollector(
        //   this.datasourceAlias,
        //   this.datasetName,
        // )
        // //注册监听
        // DeviceEventEmitter.addListener(
        //   'onTotalLengthChanged',
        //   this.onTotalLengthChanged,
        // )
      }.bind(this)())
    })
  }

  componentWillUnmount() {
    // Orientation.unlockAllOrientations()
    //移除监听
    // DeviceEventEmitter.removeListener(
    //   'onTotalLengthChanged',
    //   this.onTotalLengthChanged,
    // )
    // SCollectSceneFormView.onDestroy()
  }

  onTotalLengthChanged = params => {
    this.setState({
      totalLength: params.total,
    })
  }

  /** 添加 **/
  switchModelViews = async () => {}

  /** 撤销 **/
  undo = async () => {}

  /** 清除 **/
  clearAll = async () => {}

  /** 保存 **/
  save = async () => {}

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
            onPress={() => this.switchModelViews()}
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

  renderLengthChangeView() {
    return (
      <View style={styles.lengthChangeView}>
        <Text style={styles.titleTotal}>
          {'总长度:' + this.state.totalLength + 'm'}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: '高精采集',
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMCollectSceneFormView
          ref={ref => (this.SMCollectSceneFormView = ref)}
        />
        {this.renderBottomBtns()}
        {this.renderLengthChangeView()}
      </Container>
    )
  }
}
