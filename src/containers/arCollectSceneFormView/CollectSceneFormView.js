import * as React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  View,
  Image,
  Text,
  DeviceEventEmitter,
  FlatList,
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
import { Toast } from '../../utils'
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
    this.isRecording = true

    this.state = {
      totalLength: 0,
      showHistory: false,
      historyData: Array,
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

  /** 切换 **/
  switchStatus = async () => {
    this.isRecording = !this.isRecording
    if (this.isRecording) {
      Toast.show('开始记录')
      await SCollectSceneFormView.startRecording()
    } else {
      Toast.show('暂停记录')
      await SCollectSceneFormView.stopRecording()
    }
  }

  /** 历史 **/
  history = async () => {
    let data = await SCollectSceneFormView.getHistoryData()
    if (data && data.history.length > 0) {
      this.setState({
        showHistory: true,
        historyData: data.history,
      })
    } else {
      Toast.show('没有历史数据')
    }
  }

  /** 清除 **/
  clearAll = async () => {
    await SCollectSceneFormView.clearData()
    this.setState({
      totalLength: 0,
    })
  }

  /** 保存 **/
  save = async () => {
    NavigationService.navigate('InputPage', {
      headerTitle: '高精采集',
      value: '',
      placeholder: '请输入采集名称',
      cb: async value => {
        NavigationService.goBack()
        await SCollectSceneFormView.saveData(value)
      },
    })
  }

  back = () => {
    NavigationService.goBack()
    return true
  }

  _renderItemSeparatorComponent = () => {
    return <View style={styles.ItemSeparatorComponent} />
  }

  _keyExtractor = item => item.name + item.index

  onHistoryItemPress = async item => {
    await SCollectSceneFormView.clearData()
    await SCollectSceneFormView.loadData(item.index)
    this.setState({
      showHistory: false,
    })
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.historyItem}
        onPress={() => {
          this.onHistoryItemPress(item)
        }}
      >
        <Text style={styles.historyItemText}>
          {item.name + '     ' + item.time}
        </Text>
      </TouchableOpacity>
    )
  }

  hiddleHistoryView = () => {
    this.setState({
      showHistory: false,
    })
  }

  renderHistoryView = () => {
    if (!this.state.historyData && this.state.historyData.length === 0) {
      return
    }
    return (
      <View style={styles.historyDataView}>
        <Text style={styles.historyTitle}>{'历史记录:'}</Text>
        <TouchableOpacity
          onPress={() => this.hiddleHistoryView()}
          style={styles.historyCloseIcon}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.toolbar.icon_ar_toolbar_close}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
        <FlatList
          data={this.state.historyData}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          style={styles.list}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          extraData={this.state}
        />
      </View>
    )
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
            onPress={() => this.switchStatus()}
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
        {this.state.showHistory && this.renderHistoryView()}
        {this.renderBottomBtns()}
        {this.renderLengthChangeView()}
      </Container>
    )
  }
}
