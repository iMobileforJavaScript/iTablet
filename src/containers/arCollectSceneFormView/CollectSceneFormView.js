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
import {
  SMCollectSceneFormView,
  SCollectSceneFormView,
} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import styles from './styles'
import { Container } from '../../components'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
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
    this.SceneViewVisible = true

    this.state = {
      totalLength: 0,
    }
  }

  // eslint-disable-next-line
  componentWillMount() {
    Orientation.lockToPortrait()
  }

  componentDidMount() {
    //安排任务在交互和动画完成之后执行
    InteractionManager.runAfterInteractions(() => {
      // 初始化数据
      (async function() {
        let udbPath = await FileTools.appendingHomeDirectory(
          ConstPath.UserPath +
            this.props.user.currentUser.userName +
            '/' +
            ConstPath.RelativeFilePath.AR,
        )
        SCollectSceneFormView.initSceneFormView(
          this.datasourceAlias,
          this.datasetName,
          this.props.language,
          udbPath,
        )
        //注册监听
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
      'onTotalLengthChanged',
      this.onTotalLengthChanged,
    )
  }

  onTotalLengthChanged = params => {
    this.setState({
      totalLength: params.totalLength,
    })
  }

  /** 添加 **/
  switchViews = async () => {
    this.SceneViewVisible = !this.SceneViewVisible
    await SCollectSceneFormView.setArSceneViewVisible(this.SceneViewVisible)
  }

  /** 历史 **/
  history = async () => {}

  /** 清除 **/
  clearAll = async () => {
    await SCollectSceneFormView.clearData()
  }

  /** 保存 **/
  save = async () => {
    await SCollectSceneFormView.saveData()
  }

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
          <TouchableOpacity
            onPress={() => this.history()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_history}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.switchViews()}
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
