import React, { Component } from 'react'
import { View, AppState, StyleSheet, Platform } from 'react-native'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import RootNavigator from './src/containers'
import { setNav } from './src/models/nav'
import { setUser } from './src/models/user'
import {
  setEditLayer,
  setSelection,
} from './src/models/layers'
import {
  openWorkspace,
  closeMap,
  setCurrentMap,
  saveMap,
} from './src/models/map'
import {
  setCurrentTemplateInfo,
  setTemplate,
} from './src/models/template'
import { Dialog } from './src/components'
import { setMapSetting } from './src/models/setting'
import { setCollectionInfo } from './src/models/collection'
import { setShow }  from './src/models/device'
import { FileTools }  from './src/native'
import ConfigStore from './src/store'
import { Loading } from './src/components'
import { SaveView } from './src/containers/workspace/components'
import { scaleSize, Toast } from './src/utils'
import { ConstPath, ConstInfo, ConstToolType, ThemeType } from './src/constants'
import NavigationService from './src/containers/NavigationService'
import Orientation from 'react-native-orientation'
import { SOnlineService, SScene, SMap } from 'imobile_for_reactnative'
import SplashScreen from 'react-native-splash-screen'
const { persistor, store } = ConfigStore()

const styles = StyleSheet.create({
  map: {
    flex: 1,
    position: 'absolute',
    top: Platform.OS === 'ios' ? 64 : 44,
    left: 0,
    right: 0,
    bottom: scaleSize(100),
    alignSelf: 'stretch',
    backgroundColor: 'yellow',
  },
  invisibleMap: {
    width: 1,
    height: 1,
  },
})

class AppRoot extends Component {

  static propTypes = {
    nav: PropTypes.object,
    user: PropTypes.object,
    editLayer: PropTypes.object,
    map: PropTypes.object,
    collection: PropTypes.object,
    layers: PropTypes.array,
    setNav: PropTypes.func,
    setUser: PropTypes.func,
    openWorkspace:PropTypes.func,
    setShow:PropTypes.func,
    closeMap:PropTypes.func,
    setCurrentMap:PropTypes.func,

    setEditLayer:PropTypes.func,
    setSelection:PropTypes.func,
    setCollectionInfo:PropTypes.func,
    setCurrentTemplateInfo:PropTypes.func,
    setTemplate:PropTypes.func,
    setMapSetting:PropTypes.func,
    saveMap:PropTypes.func,
    setCurrentAttribute:PropTypes.func,
    setAttributes:PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      sceneStyle: styles.invisibleMap,
    }
    GLOBAL.AppState = AppState.currentState
    GLOBAL.isBackHome = true
    // TODO 动态切换主题，将 GLOBAL.ThemeType 放入Redux中管理
    GLOBAL.ThemeType = ThemeType.LIGHT_THEME
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleStateChange)
    ;(async function () {
      await this.initDirectories()
      SOnlineService.init()
      SOnlineService.removeCookie()
      let customerPath = ConstPath.CustomerPath+ConstPath.RelativeFilePath.Workspace
      let path = await FileTools.appendingHomeDirectory(customerPath)
      this.props.openWorkspace({server:path})
      // await this.initEnvironment()
      // await this.initSpeechManager()
      // await this.initCustomerWorkspace()
      await this.inspectEnvironment()
      await this.initOrientation()
    }).bind(this)()
    GLOBAL.clearMapData = () => {
      this.props.setEditLayer(null) // 清空地图图层中的数据
      this.props.setSelection(null) // 清空地图选中目标中的数据
      this.props.setMapSetting(null) // 清空地图设置中的数据
      this.props.setCollectionInfo() // 清空Collection中的数据
      this.props.setCurrentTemplateInfo() // 清空当前模板
      this.props.setTemplate() // 清空模板
      this.props.setCurrentMap() // 清空当前地图
    }
    Platform.OS === 'android' && SplashScreen.hide()
  }

  handleStateChange = appState => {
    if (appState === 'active') {
      if (this.props.user.currentUser && this.props.user.currentUser.userName) {
        (async function () {
          let isEmail = this.props.user.currentUser.isEmail
          let userName = this.props.user.currentUser.userName
          let password = this.props.user.currentUser.password
          if (isEmail === true) {
            await SOnlineService.login(userName, password)
          } else if (isEmail === false) {
            await SOnlineService.loginWithPhoneNumber(userName, password)
          }
        }).bind(this)()
      }
    }
  }

  inspectEnvironment=async()=>{
    let result=await FileTools.EnvironmentIsValid()
    if(!result){
      this.exit.setDialogVisible(true)
    }
  }

  //初始化横竖屏显示方式
  initOrientation=async()=>{
    Orientation.getOrientation((e, orientation) => {
      this.props.setShow({orientation:orientation})
    })
    Orientation.addOrientationListener(orientation => {
      if (orientation === "LANDSCAPE"){
        this.props.setShow({
          orientation:orientation,
        })
      }else{
        this.props.setShow({
          orientation:orientation,
        })
      }
    })
  }

  // 初始化文件目录
  initDirectories = async () => {
    try {
      let paths = Object.keys(ConstPath)
      let isCreate = true, absolutePath = ''
      for (let i = 0; i < paths.length; i++) {
        let path = ConstPath[paths[i]]
        if (typeof path !== 'string') continue
        absolutePath = await FileTools.appendingHomeDirectory(path)
        let exist = await FileTools.fileIsExistInHomeDirectory(path)
        let fileCreated = exist || await FileTools.createDirectory(absolutePath)
        isCreate = fileCreated && isCreate
      }
      isCreate = this.initCustomerDirectories() && isCreate
      if (!isCreate) {
        Toast.show('创建文件目录失败')
      }
    } catch (e) {
      Toast.show('创建文件目录失败')
    }
  }

  // 初始化游客用户文件目录
  initCustomerDirectories = async () => {
    try {
      let paths = Object.keys(ConstPath.RelativePath)
      let isCreate = true, absolutePath = ''
      for (let i = 0; i < paths.length; i++) {
        let path = ConstPath.RelativePath[paths[i]]
        if (typeof path !== 'string') continue
        absolutePath = await FileTools.appendingHomeDirectory(ConstPath.CustomerPath + path)
        let exist = await FileTools.fileIsExistInHomeDirectory(ConstPath.CustomerPath + path)
        let fileCreated = exist || await FileTools.createDirectory(absolutePath)
        isCreate = fileCreated && isCreate
      }
      return isCreate
    } catch (e) {
      return false
    }
  }

  // 初始化录音
  // initSpeechManager = async () => {
  //   try {
  //     GLOBAL.SpeechManager = new SpeechManager()
  //     await GLOBAL.SpeechManager.init()
  //   } catch (e) {
  //     Toast.show('语音初始化失败')
  //   }
  // }

  // 初始化游客工作空间
  // initCustomerWorkspace = async () => {
  //   try {
  //     const customerPath = ConstPath.CustomerPath
  //     let exist = await FileTools.fileIsExistInHomeDirectory(customerPath + ConstPath.RelativePath.CustomerWorkspace)
  //     !exist && FileTools.appendingHomeDirectory(customerPath).then(path => {
  //       SMap.saveWorkspace({
  //         caption: 'Customer',
  //         type: WorkspaceType.SMWU,
  //         server: path,
  //       })
  //     })
  //   } catch (e) {
  //     Toast.show('游客工作空间初始化失败')
  //   }
  // }

  map3dBackAction=async()=>{
    try {
      this.container && this.container.setLoading(true, '正在关闭')
      if (GLOBAL.openWorkspace) {
        // this.SaveDialog && this.SaveDialog.setDialogVisible(true)
        await SScene.closeWorkspace()
        this.container && this.container.setLoading(false)
        NavigationService.goBack()
      } else {
        this.container && this.container.setLoading(false)
        NavigationService.goBack()
      }
      this.props.setCurrentAttribute({})
      this.props.setAttributes({})
    } catch (e) {
      this.container && this.container.setLoading(false)
      NavigationService.goBack()
    }
  }

  saveMap = async () => {
    if (GLOBAL.Type===ConstToolType.MAP_3D){
      this.map3dBackAction()
      GLOBAL.openWorkspace && Toast.show(ConstInfo.SAVE_SCENE_SUCCESS)
      return
    }
    let mapName = ''
    if (this.props.map.currentMap.name) { // 获取当前打开的地图xml的名称
      mapName = this.props.map.currentMap.name
      mapName = mapName.substr(0, mapName.lastIndexOf('.')) || this.props.map.currentMap.name
    } else {
      let mapInfo = await SMap.getMapInfo()
      if (mapInfo && mapInfo.name) { // 获取MapControl中的地图名称
        mapName = mapInfo.name
      } else if (this.props.layers.length > 0) { // 获取数据源名称作为地图名称
        mapName = this.props.collection.datasourceName
      }
    }
    let addition = {}
    if (this.props.map.currentMap.Template) {
      addition.Template = this.props.map.currentMap.Template
    }
    await this.saveMapName(mapName, '', addition, this.closeMapHandler)
  }

  // 导出(保存)工作空间中地图到模块
  saveMapName = async (mapName = '', nModule = '', addition = {}, cb = () => {}) => {
    try {
      this.setSaveMapViewLoading(true, '正在保存地图')
      let result = await this.props.saveMap({mapName, nModule, addition})
      //   .then(result => {
      //   this.setSaveMapViewLoading(false)
      //   Toast.show(
      //     result ? ConstInfo.SAVE_MAP_SUCCESS : ConstInfo.SAVE_MAP_FAILED,
      //   )
      //   cb && cb()
      // }, () => {
      //   this.setSaveMapViewLoading(false)
      // })
      if (result) {
        this.setSaveMapViewLoading(false)
        Toast.show(
          result ? ConstInfo.SAVE_MAP_SUCCESS : ConstInfo.SAVE_MAP_FAILED,
        )
        cb && cb()
      } else {
        this.setSaveMapViewLoading(false)
      }
    } catch (e) {
      this.setSaveMapViewLoading(false)
    }
  }

  setSaveMapViewLoading = (loading = false, info, extra) => {
    GLOBAL.SaveMapView && GLOBAL.SaveMapView.setLoading(loading, info, extra)
  }

  closeMapHandler = async () => {
    if (GLOBAL.Type === ConstToolType.MAP_3D){
      this.map3dBackAction()
      return
    }
    if (GLOBAL.isBackHome) {
      try {
        this.setSaveMapViewLoading(true, '正在关闭地图')
        await this.props.closeMap()
        GLOBAL.clearMapData()
        this.setSaveMapViewLoading(false)
        NavigationService.goBack()
      } catch (e) {
        this.setSaveMapViewLoading(false)
      }
    } else {
      GLOBAL.isBackHome = true // 默认是true
    }
  }

  renderDialog=()=>{
    return(<Dialog
      ref={ref => (this.exit = ref)}
      type={'modal'}
      title={"许可异常，请更换许可"}
      onlyOneBtn={true}
      cancelBtnVisible={false}
      confirmAction={()=>{this.exit.setDialogVisible(false)}}
      opacity={1}
      opacityStyle={styles.opacityView}
      style={styles.dialogBackground}
    >
    </Dialog>)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <RootNavigator
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef)
          }}
          onNavigationStateChange={(prevState, currentState) => {
            this.props.setNav(currentState)
            // AudioAnalyst.setConfig({
            //   nav: currentState,
            // })
          }}
        />
        <SaveView
          ref={ref => GLOBAL.SaveMapView = ref}
          save={this.saveMap}
          notSave={this.closeMapHandler}
          cancel={() => {
            // this.backAction = null
          }}
        />
        {this.renderDialog()}
        <Loading ref={ref => GLOBAL.Loading = ref} initLoading={false}/>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.toJS(),
    nav: state.nav.toJS(),
    editLayer: state.layers.toJS().editLayer,
    device:state.device.toJS().device,
    map:state.map.toJS(),
    collection:state.collection.toJS(),
    layers:state.layers.toJS().layers,
  }
}

const AppRootWithRedux = connect(mapStateToProps, {
  setNav,
  setUser,
  openWorkspace,
  setShow,
  closeMap,
  setCurrentMap,
  setEditLayer,
  setSelection,
  setCollectionInfo,
  setCurrentTemplateInfo,
  setTemplate,
  setMapSetting,
  saveMap,
})(AppRoot)

const App = () =>
  <Provider store={store}>
    <PersistGate loading={Platform.OS === 'android' ? null : <Loading/>} persistor={persistor}>
      {/*<PersistGate loading={null} persistor={persistor}>*/}
      <AppRootWithRedux />
    </PersistGate>
  </Provider>

export default App
