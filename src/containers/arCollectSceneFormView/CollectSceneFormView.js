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
import { getLanguage } from '../../language'
import { color } from '../../styles'

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
    this.datasetPointName = params.datasetPointName
    this.SceneViewVisible = true
    this.isRecording = true
    this.state = {
      totalLength: 0,
      showHistory: false,
      historyData: Array,
      showbuttons: true,
      isLine: true,
      leftcolor: {
        color: 'black',
      },
      rightcolor: {
        color: 'black',
      },
    }
    this.clickAble = true // 防止重复点击
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
          this.datasetPointName,
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

  /** 新建开始 **/
  switchStatus = async () => {
    // this.isRecording = !this.isRecording
    // if (this.isRecording) {
    //   Toast.show(
    //     getLanguage(global.language).Map_Main_Menu
    //       .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_START,
    //   )
    //   await SCollectSceneFormView.startRecording()
    // } else {
    //   Toast.show(
    //     getLanguage(global.language).Map_Main_Menu
    //       .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_STOP,
    //   )
    await SCollectSceneFormView.startRecording()
    // }
  }

  /** 切换视角 **/
  switchViewMode = async () => {
    await SCollectSceneFormView.switchViewMode()
  }

  /** 历史 **/
  history = async () => {
    if (this.state.showHistory) {
      this.setState({
        showHistory: false,
        showbuttons: true,
      })
    } else {
      let data = await SCollectSceneFormView.getHistoryData(true)
      if (data && data.history.length > 0) {
        this.setState({
          showHistory: true,
          showbuttons: false,
          historyData: data.history,
          isLine: true,
          leftcolor: {
            color: color.blue1,
          },
          rightcolor: {
            color: 'black',
          },
        })
      } else {
        let datapoint = await SCollectSceneFormView.getHistoryData(false)
        if (datapoint && datapoint.history.length > 0) {
          this.setState({
            showHistory: true,
            showbuttons: false,
            historyData: datapoint.history,
            isLine: false,
            leftcolor: {
              color: 'black',
            },
            rightcolor: {
              color: color.blue1,
            },
          })
        } else {
          Toast.show(
            getLanguage(global.language).Map_Main_Menu
              .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY,
          )
        }
      }
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
    await SCollectSceneFormView.stopRecording()
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
      value: '',
      placeholder: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NAME,
      type: 'name',
      cb: async value => {
        NavigationService.goBack()
        await SCollectSceneFormView.saveData(value)
      },
    })
  }

  /** 保存点 **/
  savepoint = async () => {
    await SCollectSceneFormView.stopRecording()
    // NavigationService.navigate('InputPage', {
    //   headerTitle: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
    //   value: '',
    //   placeholder: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NAME,
    //   type: 'name',
    //   cb: async value => {
    //     NavigationService.goBack()
    await SCollectSceneFormView.saveGPSData('point')
    Toast.show(
      getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_SAVE_SUCCESS,
    )
    //   },
    // })
  }

  back = () => {
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
      if (GLOBAL.isswitch) {
        GLOBAL.isswitch = false
        GLOBAL.toolBox && GLOBAL.toolBox.switchAr()
      }
      GLOBAL.mapView.setState({
        map: {
          flex: 1,
          alignSelf: 'stretch',
          backgroundColor: '#ffbcbc',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexDirection: 'column',
        },
      })
      NavigationService.goBack()
      return true
    }
  }

  _renderItemSeparatorComponent = () => {
    return <View style={styles.ItemSeparatorComponent} />
  }

  _keyExtractor = item => item.name + item.index

  onHistoryItemPress = async item => {
    await SCollectSceneFormView.clearData()
    await SCollectSceneFormView.loadData(item.index, this.state.isLine)
    this.setState({
      showHistory: false,
      showbuttons: true,
    })
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.historyItem}
          onPress={() => {
            this.onHistoryItemPress(item)
          }}
        >
          {this.state.isLine && (
            <Text style={styles.historyItemText}>
              {item.name + '     ' + item.time}
            </Text>
          )}
          {!this.state.isLine && (
            <Text style={styles.historyItemText}>{item.name}</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.deleteHistory(item)}
          style={styles.historyDelete}
        >
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().ar.toolbar.icon_ar_toolbar_close}
            style={styles.smallIcon}
          />
        </TouchableOpacity>
      </View>
    )
  }

  deleteHistory = async item => {
    await SCollectSceneFormView.deleteData(item.name, this.state.isLine)
    let data
    if (this.state.isLine) {
      data = await SCollectSceneFormView.getHistoryData(true)
    } else {
      data = await SCollectSceneFormView.getHistoryData(false)
    }
    if (data) {
      this.setState({
        showHistory: true,
        historyData: data.history,
      })
    } else {
      this.setState({
        showHistory: true,
        historyData: [],
      })
      Toast.show(
        getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY,
      )
    }
  }

  renderHistoryView = () => {
    if (!this.state.historyData && this.state.historyData.length === 0) {
      return
    }
    return (
      <View style={styles.historyDataView}>
        <View style={styles.historypoint}>
          <TouchableOpacity
            onPress={async () => {
              let data = await SCollectSceneFormView.getHistoryData(true)
              if (data && data.history.length > 0) {
                this.setState({
                  isLine: true,
                  showHistory: true,
                  historyData: data.history,
                  leftcolor: { color: color.blue1 },
                  rightcolor: { color: 'black' },
                })
              } else {
                Toast.show(
                  getLanguage(global.language).Map_Main_Menu
                    .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY,
                )
              }
            }}
            style={styles.historyCloseIcon}
          >
            <Text style={[styles.historyTitle, this.state.leftcolor]}>
              {
                getLanguage(global.language).Map_Main_Menu
                  .MAP_AR_AI_ASSISTANT_SAVE_LINE
              }
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              let data = await SCollectSceneFormView.getHistoryData(false)
              if (data && data.history.length > 0) {
                this.setState({
                  isLine: false,
                  showHistory: true,
                  historyData: data.history,
                  rightcolor: { color: color.blue1 },
                  leftcolor: { color: 'black' },
                })
              } else {
                Toast.show(
                  getLanguage(global.language).Map_Main_Menu
                    .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY,
                )
              }
            }}
            style={styles.historyCloseIcon}
          >
            <Text style={[styles.historyTitle, this.state.rightcolor]}>
              {
                getLanguage(global.language).Map_Main_Menu
                  .MAP_AR_AI_ASSISTANT_SAVE_POINT
              }
            </Text>
          </TouchableOpacity>
        </View>
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
            onPress={() => this.switchStatus()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_switch}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => this.save()} style={styles.iconView}>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_save}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.savepoint()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_save_point}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.switchViewMode()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.ar_view_mode}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderBottomBtn() {
    return (
      <View style={styles.toolbarb}>
        <View style={styles.buttonViewb}>
          <TouchableOpacity onPress={() => this.back()} style={styles.iconView}>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_cancel}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.history()}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_classify_settings}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (this.state.showbuttons) {
                this.setState({ showbuttons: false })
              } else {
                this.setState({ showbuttons: true })
              }
            }}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_flex}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.iconView}>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.ai_setting}
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
          {getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOTALLENGTH +
            this.state.totalLength +
            'm'}
        </Text>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
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
        {this.state.showbuttons && this.renderBottomBtns()}
        {this.renderBottomBtn()}
        {this.renderLengthChangeView()}
      </Container>
    )
  }
}
