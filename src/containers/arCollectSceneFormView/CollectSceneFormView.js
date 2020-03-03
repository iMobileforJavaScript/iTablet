import * as React from 'react'
import {
  InteractionManager,
  TouchableOpacity,
  View,
  Image,
  Text,
  DeviceEventEmitter,
  FlatList,
  NativeModules,
  NativeEventEmitter,
  Platform,
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
import { getLanguage } from '../../language'
import { color } from '../../styles'
import { Toast, dataUtil, scaleSize } from '../../utils'
import ToolbarModule from '../workspace/components/ToolBar/modules/ToolbarModule'
import { ConstPath, UserType } from '../../constants'

let nativeSCollectSceneFormView = NativeModules.SCollectSceneFormView
const nativeEvt = new NativeEventEmitter(nativeSCollectSceneFormView)

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
      collectData: GLOBAL.newcollectData,
      chooseDataSource: false,
      isnew: false,
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
        if (Platform.OS === 'ios') {
          nativeEvt.addListener(
            'onTotalLengthChanged',
            this.onTotalLengthChanged,
          )
        } else {
          DeviceEventEmitter.addListener(
            'onTotalLengthChanged',
            this.onTotalLengthChanged,
          )
        }
        // DeviceEventEmitter.addListener(
        //   'onTotalLengthChanged',
        //   this.onTotalLengthChanged,
        // )
      }.bind(this)())
    })
  }

  componentWillUnmount() {
    // Orientation.unlockAllOrientations()
    SCollectSceneFormView.onDestroy
    //移除监听
    if (Platform.OS === 'ios') {
      nativeEvt.removeListener(
        'onTotalLengthChanged',
        this.onTotalLengthChanged,
      )
    } else {
      DeviceEventEmitter.removeListener(
        'onTotalLengthChanged',
        this.onTotalLengthChanged,
      )
    }

    // DeviceEventEmitter.removeListener(
    //   'onTotalLengthChanged',
    //   this.onTotalLengthChanged,
    // )
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
    Toast.show(
      getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_START,
    )
    await SCollectSceneFormView.startRecording()
    this.setState({ isnew: true })
    // }
  }

  /** 切换视角 **/
  switchViewMode = async () => {
    await SCollectSceneFormView.switchViewMode()
  }

  /** 历史 **/
  history = async () => {
    let data = await SCollectSceneFormView.getHistoryData()
    if (data && data.history.length > 0) {
      const history = data.history
      NavigationService.navigate('CollectSceneFormHistoryView', {
        history,
      })
    } else {
      const history = []
      NavigationService.navigate('CollectSceneFormHistoryView', {
        history,
      })
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
    await SCollectSceneFormView.saveData('line')
    await SCollectSceneFormView.routeAdd()
    this.setState({ isnew: false })
    Toast.show(
      getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_SAVE_SUCCESS,
    )
    // NavigationService.navigate('InputPage', {
    //   headerTitle: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
    //   value: '',
    //   placeholder: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NAME,
    //   type: 'name',
    //   cb: async value => {
    //     NavigationService.goBack()
    //     await SCollectSceneFormView.saveData(value)
    //     this.setState({ isnew: false })
    //   },
    // })
  }

  /** 保存点 **/
  savepoint = async () => {
    // await SCollectSceneFormView.stopRecording()
    await SCollectSceneFormView.saveGPSData('point')
    this.setState({ isnew: false })
    Toast.show(
      getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_SAVE_SUCCESS,
    )
    // NavigationService.navigate('InputPage', {
    //   headerTitle: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
    //   value: '',
    //   placeholder: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NAME,
    //   type: 'name',
    //   cb: async value => {
    //     NavigationService.goBack()
    //     await SCollectSceneFormView.saveGPSData(value)
    //     this.setState({ isnew: false })
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

  cancel = async () => {
    if (this.state.chooseDataSource) {
      let data = await SCollectSceneFormView.getHistoryData()
      if (data && data.history.length > 0) {
        this.setState({
          showHistory: true,
          showbuttons: false,
          historyData: data.history,
          chooseDataSource: false,
        })
      } else {
        this.setState({
          showHistory: true,
          showbuttons: false,
          historyData: [],
          chooseDataSource: false,
        })
      }
    } else {
      this.setState({
        showHistory: false,
        showbuttons: true,
      })
    }
  }

  getDatasource = async () => {
    let userUDBPath, userUDBs
    //过滤掉标注和标绘匹配正则
    let checkLabelAndPlot = /^(Label_|PlotEdit_(.*)@)(.*)((#$)|(#_\d+$)|(##\d+$))/
    if (
      ToolbarModule.getParams().user &&
      ToolbarModule.getParams().user.currentUser.userName &&
      ToolbarModule.getParams().user.currentUser.userType !==
        UserType.PROBATION_USER
    ) {
      let userPath =
        (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
        ToolbarModule.getParams().user.currentUser.userName +
        '/'
      userUDBPath = userPath + ConstPath.RelativePath.Datasource
      userUDBs = await FileTools.getPathListByFilter(userUDBPath, {
        extension: 'udb',
        type: 'file',
      })
      //过滤掉标注和标绘
      let filterUDBs = userUDBs.filter(item => {
        item.name = dataUtil.getNameByURL(item.path)
        return !item.name.match(checkLabelAndPlot)
      })
      filterUDBs.map(item => {
        item.image = require('../../assets/mapToolbar/list_type_udb_black.png')
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
        }
      })
      this.setState({
        showHistory: true,
        historyData: filterUDBs,
        chooseDataSource: true,
      })
    } else {
      let customerUDBPath = await FileTools.appendingHomeDirectory(
        ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
      )
      let customerUDBs = await FileTools.getPathListByFilter(customerUDBPath, {
        extension: 'udb',
        type: 'file',
      })
      //过滤掉标注和标绘
      let filterUDBs = customerUDBs.filter(item => {
        item.name = dataUtil.getNameByURL(item.path)
        return !item.name.match(checkLabelAndPlot)
      })
      filterUDBs.map(item => {
        item.image = require('../../assets/mapToolbar/list_type_udb_black.png')
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
        }
      })
      this.setState({
        showHistory: true,
        historyData: filterUDBs,
        chooseDataSource: true,
      })
    }
  }

  changeSelect = async item => {
    let newData = this.state.historyData
    item.select = !item.select
    newData[item.index] = item
    this.setState({
      historyData: newData.concat(),
    })
  }

  onChooseDataSource = async item => {
    await SCollectSceneFormView.setDataSource(item.name, item.path)
    let data = await SCollectSceneFormView.getHistoryData()
    if (data && data.history.length > 0) {
      this.setState({
        showHistory: true,
        showbuttons: false,
        historyData: data.history,
        isLine: true,
        collectData: item.name,
        leftcolor: {
          color: color.blue1,
        },
        rightcolor: {
          color: 'black',
        },
        chooseDataSource: false,
      })
    } else {
      this.setState({
        showHistory: true,
        showbuttons: false,
        historyData: [],
        isLine: true,
        collectData: item.name,
        leftcolor: {
          color: color.blue1,
        },
        rightcolor: {
          color: 'black',
        },
        chooseDataSource: false,
      })
    }
  }

  onHistoryItemPress = async item => {
    let isShowtrace = await SCollectSceneFormView.isShowTrace()
    if (!isShowtrace) {
      await SCollectSceneFormView.startRecording()
    }
    item.forEach(async item => {
      if (item.select) {
        let isline = await SCollectSceneFormView.isLineDataset(item.index)
        await SCollectSceneFormView.loadData(item.index, isline)
      }
    })
    this.setState({
      showHistory: false,
      showbuttons: true,
    })
  }

  renderItem = ({ item }) => {
    const visibleImgBlack = item.select
      ? require('../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../assets/mapTools/icon_multi_unselected_disable_black.png')
    let visibleImg = visibleImgBlack

    if (this.state.chooseDataSource) {
      return (
        <View style={styles.itemView}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.historyItem}
            onPress={() => {
              this.onChooseDataSource(item)
            }}
          >
            <Text style={styles.historyItemText}>{item.name}</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.itemView}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.historySelect}
            onPress={() => {
              this.changeSelect(item)
            }}
          >
            <Image
              resizeMode={'contain'}
              style={styles.smallIcon}
              source={visibleImg}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.historyItem}
            onPress={() => {}}
          >
            <Text style={styles.historyItemText}>{item.name}</Text>
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
  }

  deleteHistory = async item => {
    await SCollectSceneFormView.deleteData(item.index)
    let data
    data = await SCollectSceneFormView.getHistoryData()
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
    return (
      <View style={styles.historyDataView}>
        <View style={styles.historypoint}>
          <TouchableOpacity
            onPress={async () => {
              this.getDatasource()
            }}
            style={styles.historyCloseIcon}
          >
            <Text style={[styles.historyTitle]}>{this.state.collectData}</Text>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_down}
              style={styles.smallIcons}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            height: scaleSize(3),
            backgroundColor: 'black',
          }}
        />
        <FlatList
          data={this.state.historyData}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          style={styles.list}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          extraData={this.state}
        />
        <View style={styles.listaction}>
          <TouchableOpacity
            onPress={() => {
              this.cancel()
            }}
            style={styles.btn_image}
          >
            <Text style={[styles.historyTitle]}>
              {getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_CANCEL}
            </Text>
          </TouchableOpacity>
          {!this.state.chooseDataSource && (
            <TouchableOpacity
              onPress={() => {
                this.onHistoryItemPress(this.state.historyData)
              }}
              style={styles.btn_image2}
            >
              <Text style={[styles.historyTitle]}>
                {getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_CONFIRM}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  renderBottomBtns = () => {
    return (
      <View style={styles.toolbar}>
        <View style={styles.buttonView}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => this.switchStatus()}
              style={styles.iconView}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_new}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
            <Text style={styles.buttonname}>
              {
                getLanguage(global.language).Map_Main_Menu
                  .MAP_AR_AI_ASSISTANT_NEWDATA
              }
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
            <Text style={styles.buttonname}>
              {getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_CLEAR}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => this.save()}
              style={styles.iconView}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_save_line}
                style={styles.smallIcon}
              />
            </TouchableOpacity>
            <Text style={styles.buttonname}>
              {getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_SAVE_LINE}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
            <Text style={styles.buttonname}>
              {getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_SAVE_POINT}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
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
            <Text style={styles.buttonname}>
              {getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_CHANGE}
            </Text>
          </View>
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
        {/*{this.state.showHistory && this.renderHistoryView()}*/}
        {this.state.showbuttons && this.renderBottomBtns()}
        {this.renderBottomBtn()}
        {this.renderLengthChangeView()}
      </Container>
    )
  }
}
