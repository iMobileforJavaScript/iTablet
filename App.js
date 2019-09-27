import React, { Component } from 'react'
import { View, AppState, StyleSheet, Platform, Image, Text, BackHandler, NativeModules } from 'react-native'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import RootNavigator from './src/containers'
import { setNav } from './src/models/nav'
import { setUser } from './src/models/user'
import { setAgreeToProtocol, setLanguage, setMapSetting ,setMap2Dto3D} from './src/models/setting'
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
  setCurrentTemplateList,
  setTemplate,
} from './src/models/template'
import { Dialog, Loading } from './src/components'
import { setAnalystParams } from './src/models/analyst'
import { setCollectionInfo } from './src/models/collection'
import { setShow }  from './src/models/device'
import { FileTools }  from './src/native'
import ConfigStore from './src/store'
import { SaveView } from './src/containers/workspace/components'
import { scaleSize, Toast } from './src/utils'
import { color } from './src/styles'
import { ConstPath, ConstInfo, ConstToolType, ThemeType} from './src/constants'
import * as PT from './src/customPrototype'
import NavigationService from './src/containers/NavigationService'
import Orientation from 'react-native-orientation'
import { SOnlineService, SScene, SMap,SMessageService, SIPortalService ,SpeechManager} from 'imobile_for_reactnative'
import SplashScreen from 'react-native-splash-screen'
import UserType from './src/constants/UserType'
import { getLanguage } from './src/language/index'
import FetchUtils from './src/utils/FetchUtils'
import { ProtocolDialog } from './src/containers/tabs/Home/components'
import RNFS from 'react-native-fs'
import constants from './src/containers/workspace/constants'
let AppUtils = NativeModules.AppUtils


const {persistor, store} = ConfigStore()

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
  dialogHeaderView: {
    paddingTop:scaleSize(40),
    flex: 1,
    //  backgroundColor:"pink",
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImg: {
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
    // marginLeft:scaleSize(145),
    // marginTop:scaleSize(21),
  },
  promptTtile: {
    fontSize: scaleSize(24),
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginLeft: scaleSize(10),
    marginRight: scaleSize(10),
    textAlign: 'center',
  },
  dialogBackground: {
    height: scaleSize(300),
  },
  opacityView: {
    height: scaleSize(300),
  },
})

class AppRoot extends Component {
  static propTypes = {
    language: PropTypes.string,
    nav: PropTypes.object,
    backActions: PropTypes.object,
    user: PropTypes.object,
    editLayer: PropTypes.object,
    map: PropTypes.object,
    collection: PropTypes.object,
    layers: PropTypes.array,
    isAgreeToProtocol: PropTypes.bool,
    device: PropTypes.object,

    setNav: PropTypes.func,
    setUser: PropTypes.func,
    openWorkspace: PropTypes.func,
    setShow: PropTypes.func,
    closeMap: PropTypes.func,
    setCurrentMap: PropTypes.func,

    setEditLayer: PropTypes.func,
    setSelection: PropTypes.func,
    setCollectionInfo: PropTypes.func,
    setCurrentTemplateInfo: PropTypes.func,
    setCurrentTemplateList: PropTypes.func,
    setTemplate: PropTypes.func,
    setMapSetting: PropTypes.func,
    saveMap: PropTypes.func,
    setCurrentAttribute: PropTypes.func,
    setAttributes: PropTypes.func,
    setAnalystParams: PropTypes.func,
    setAgreeToProtocol: PropTypes.func,
    setLanguage: PropTypes.func,
    setMap2Dto3D: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      sceneStyle: styles.invisibleMap,
      import: null,
    }
    this.initGlobal()
    PT.initCustomPrototype()
    this.login = this.login.bind(this)
    this.reCircleLogin = this.reCircleLogin.bind(this)
  }

  UNSAFE_componentWillMount(){
    SOnlineService.init()
  }

  initGlobal = () => {
    GLOBAL.AppState = AppState.currentState
    GLOBAL.isBackHome = true
    GLOBAL.loginTimer = undefined
    GLOBAL.STARTX = undefined  //离线导航起点
    GLOBAL.ENDX = undefined  //离线导航终点
    GLOBAL.ROUTEANALYST = undefined  //离线导航分析
    GLOBAL.HASCHOSE = false  //离线数据选择
    this.props.setMap2Dto3D(false) //release版没有重置为false
    // TODO 动态切换主题，将 GLOBAL.ThemeType 放入Redux中管理
    GLOBAL.ThemeType = ThemeType.LIGHT_THEME
    GLOBAL.TaggingDatasetName = ''
    GLOBAL.BaseMapSize = 1
    //地图比例尺
    GLOBAL.scaleView = null
    GLOBAL.SelectedSelectionAttribute = null // 框选-属性-关联对象 {layerInfo, index, data}
    this.setIsPad()
  }

  setIsPad = async () => {
    let isPad
    if(Platform.OS === 'ios') {
      isPad = Platform.isPad
    } else {
      isPad = await AppUtils.isPad()
    }
    GLOBAL.isPad = isPad
  }

  async login(){
    if (UserType.isOnlineUser(this.props.user.currentUser)) {

      let isEmail = this.props.user.currentUser.isEmail
      let userName = this.props.user.currentUser.userName
      let password = this.props.user.currentUser.password
      let bLogin = false
      if (isEmail === true) {
        bLogin = await SOnlineService.login(userName, password)
      } else if (isEmail === false) {
        bLogin = await SOnlineService.loginWithPhoneNumber(userName, password)
      }
      if (!bLogin) {
        if (isEmail === true) {
          bLogin = await SOnlineService.login(userName, password)
        } else if (isEmail === false) {
          bLogin = await SOnlineService.loginWithPhoneNumber(userName, password)
        }
        // Toast.show('登陆状态失效')
      }else{
        if(!this.initFriend){
          global.getFriend().onUserLoggedin()
          this.initFriend = true
        }
        // Toast.show('登陆')
      }
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      if(!this.IPortalLoggedin){
        let url = this.props.user.currentUser.serverUrl
        let userName = this.props.user.currentUser.userName
        let password = this.props.user.currentUser.password
        SIPortalService.init()
        SIPortalService.login(url, userName, password, true)
        this.IPortalLoggedin = true
      }
    }
  }

  reCircleLogin(){
    if(GLOBAL.loginTimer !== undefined){
      clearInterval(GLOBAL.loginTimer)
      GLOBAL.loginTimer = undefined
    }
    GLOBAL.loginTimer = setInterval(this.login,60000 )
  }

  componentDidMount () {
    this.login()
    this.reCircleLogin()
    // this.initSpeechManager()
    AppState.addEventListener('change', this.handleStateChange)
    ;(async function () {
      await this.initDirectories()
      await FileTools.initUserDefaultData(this.props.user.currentUser.userName || 'Customer')
      SOnlineService.init()
      // SOnlineService.removeCookie()
      SIPortalService.init()
      let wsPath = ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace, path = ''
      if (
        this.props.user.currentUser.userType !== UserType.PROBATION_USER ||
        (this.props.user.currentUser.userName !== '' && this.props.user.currentUser.userName !== 'Customer')
      ) {
        let userWsPath = ConstPath.UserPath + this.props.user.currentUser.userName + '/' + ConstPath.RelativeFilePath.Workspace
        if (await FileTools.fileIsExistInHomeDirectory(userWsPath)) {
          path = await FileTools.appendingHomeDirectory(userWsPath)
        } else {
          path = await FileTools.appendingHomeDirectory(wsPath)
        }
      } else {
        path = await FileTools.appendingHomeDirectory(wsPath)
      }
      // let customerPath = ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace
      // path = await FileTools.appendingHomeDirectory(customerPath)
      await this.inspectEnvironment()
      await this.initOrientation()
      await this.getImportResult()
      await this.addImportExternalDataListener()
      await this.addGetShareResultListener()
      this.props.openWorkspace({server: path})
    }).bind(this)()

    GLOBAL.clearMapData = () => {
      this.props.setEditLayer(null) // 清空地图图层中的数据
      this.props.setSelection(null) // 清空地图选中目标中的数据
      this.props.setMapSetting(null) // 清空地图设置中的数据
      this.props.setAnalystParams(null) // 清空分析中的数据
      this.props.setCollectionInfo() // 清空Collection中的数据
      this.props.setCurrentTemplateInfo() // 清空当前模板
      this.props.setCurrentTemplateList() // 清空当前模板
      this.props.setTemplate() // 清空模板
      this.props.setCurrentMap() // 清空当前地图
    }
    Platform.OS === 'android' && SplashScreen.hide()

    Platform.OS === 'android' &&
    BackHandler.addEventListener('hardwareBackPress', this.back)
  }

  back = () => {
    if (Platform.OS === 'android') {
      // 防止初始化时，nav为空
      let nav = this.props.nav && this.props.nav.routes
        ? this.props.nav
        : NavigationService.getTopLevelNavigator().state.nav
      let current = nav.routes[nav.index]
      let key
      while (current.routes) {
        current = current.routes[current.index]
      }
      key = current.routeName
      if (this.props.backActions[key] && typeof this.props.backActions[key] === 'function') {
        this.props.backActions[key]()
        return true
      } else {
        return false
      }
    }
  }

  handleStateChange = appState => {
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      if (appState === 'active') {
        SMessageService.resume()
        this.reCircleLogin()
      }else if(appState === 'background'){
        SMessageService.suspend()
      }
    }

  }

  inspectEnvironment = async () => {
    let status = await SMap.getEnvironmentStatus()
    if (!status.isLicenseValid) {
      this.exit.setDialogVisible(true)
    }
  }

  orientation = o=> {
    this.props.setShow({
      orientation: o,
    })
  }
  //初始化横竖屏显示方式
  initOrientation = async () => {
    Orientation.getOrientation((e, orientation) => {
      this.props.setShow({orientation: orientation})
    })
    Orientation.removeOrientationListener(this.orientation)
    Orientation.addOrientationListener(this.orientation)
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

  addImportExternalDataListener = async () => {
    await FileTools.addImportExternalData({
      callback: result => {
        result && this.import.setDialogVisible(true)
      },
    })
  }

  addGetShareResultListener = async () => {
    await FileTools.getShareResult({
      callback: () => {
        if(GLOBAL.shareFilePath&&GLOBAL.shareFilePath.length>1){
          // FileTools.deleteFile(GLOBAL.shareFilePath)
        }
        // result && this.import.setDialogVisible(true)
      },
    })
  }

  getImportResult = async () => {
    let result = await FileTools.getImportResult()
    if (result === null)return
    result && this.import.setDialogVisible(true)
  }

  // 初始化录音
  initSpeechManager = async () => {
    try {
      GLOBAL.SpeechManager = new SpeechManager()
      await GLOBAL.SpeechManager.init()
    } catch (e) {
      Toast.show('语音初始化失败')
    }
  }

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

  map3dBackAction = async () => {
    try {
      this.container && this.container.setLoading(true, '正在关闭')
      if (GLOBAL.openWorkspace) {
        // this.SaveDialog && this.SaveDialog.setDialogVisible(true)
        // await SScene.saveWorkspace()
        await SScene.closeWorkspace()
        this.container && this.container.setLoading(false)
        NavigationService.goBack()
      } else {
        this.container && this.container.setLoading(false)
        NavigationService.goBack()
      }
      // this.props.setCurrentAttribute({})
      // this.props.setAttributes({})
    } catch (e) {
      this.container && this.container.setLoading(false)
      NavigationService.goBack()
    }
  }

  saveMap = async () => {
    if (GLOBAL.Type === constants.MAP_NAVIGATION) {
      await SMap.stopGuide()
      await SMap.clearPoint()
      this.props.setMap2Dto3D(false)
    }
    if (GLOBAL.Type === ConstToolType.MAP_3D) {
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
      this.setSaveMapViewLoading(true,getLanguage(this.props.language).Prompt.SAVING)
      //'正在保存地图')
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
      if (result || result === '') {
        this.setSaveMapViewLoading(false)
        Toast.show(
          result || result === '' ?
            getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY
            : ConstInfo.SAVE_MAP_FAILED,
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
    if (GLOBAL.Type === constants.MAP_NAVIGATION) {
      await SMap.stopGuide()
      await SMap.clearPoint()
      this.props.setMap2Dto3D(false)
    }
    if (GLOBAL.Type === ConstToolType.MAP_3D) {
      this.map3dBackAction()
      return
    }
    if (GLOBAL.isBackHome) {
      try {
        this.setSaveMapViewLoading(true,
          getLanguage(this.props.language).Prompt.CLOSING,
          //'正在关闭地图'
        )
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

  renderLicenseDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('./src/assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTtile}>
          {getLanguage(this.props.language).Prompt.LICENSE_EXPIRED}
          {/* 试用许可已过期,请更换许可后重启 */}
        </Text>
      </View>
    )
  }

  renderDialog = () => {
    return (<Dialog
      ref={ref => (this.exit = ref)}
      type={Dialog.Type.NON_MODAL}
      confirmAction={async () => {
        this.exit.setDialogVisible(false)
        GLOBAL.Loading.setLoading(
          true,
          global.language==='CN'?"许可申请中...":"Applying"
        )
        try{
          let fileCachePath = await FileTools.appendingHomeDirectory('/iTablet/license/Trial_License.slm')
          let bRes = await RNFS.exists(fileCachePath)
          if(bRes){
            await RNFS.unlink(fileCachePath)
          }
          let dataUrl = undefined
          setTimeout(()=>{
            if(dataUrl === undefined){
              GLOBAL.Loading.setLoading(
                false,
                global.language==='CN'?"许可申请中...":"Applying..."
              )
              Toast.show(global.language==='CN'?"许可申请失败,请检查网络连接":'License application failed.Please check the network connection')
            }
          }, 10000 )
          dataUrl = await FetchUtils.getFindUserDataUrl(
            'xiezhiyan123',
            'Trial_License',
            '.geojson',
          )
          let downloadOptions = {
            fromUrl: dataUrl,
            toFile: fileCachePath,
            background: true,
            fileName: 'Trial_License.slm',
            progressDivider: 1,
          }

          const ret =  RNFS.downloadFile(downloadOptions)

          ret.promise
            .then(async () => {
              GLOBAL.Loading.setLoading(
                false,
                global.language==='CN'?"许可申请中...":"Applying"
              )
              Toast.show(global.language==='CN'?"试用成功":'Successful trial')
            })
        }catch (e) {
          GLOBAL.Loading.setLoading(
            false,
            global.language==='CN'?"许可申请中...":"Applying"
          )
          Toast.show(global.language==='CN'?"许可申请失败,请检查网络连接":'License application failed.Please check the network connection')
        }
        // NavigationService.navigate('Protocol', { type: 'ApplyLicense' })
      }}
      opacity={1}
      opacityStyle={styles.opacityView}
      style={styles.dialogBackground}
      confirmBtnTitle={global.language==='CN' ? '试用' : 'The trial'}
      cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
    >
      {this.renderLicenseDialogChildren()}
    </Dialog>
    )
  }

  renderImportDialog = () => {
    return (
      <Dialog
        ref={ref => (this.import = ref)}
        type={'modal'}
        confirmBtnTitle={'确定'}
        cancelBtnTitle={'取消'}
        confirmAction={() => {
          this.import.setDialogVisible(false)
          GLOBAL.Loading.setLoading(
            true,
            '数据导入中',
          )
          FileTools.importData().then(result => {
            GLOBAL.Loading.setLoading(false)
            result && Toast.show('导入成功')
          }, () => {
            GLOBAL.Loading.setLoading(false)
            Toast.show('导入失败')
          })
        }}
        cancelAction={ async () => {
          let importPath =ConstPath.Import
          await FileTools.deleteFile(importPath)
          this.import.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        {this.renderImportDialogChildren()}
      </Dialog>
    )
  }

  _renderProtocolDialog = () => {
    return (
      <ProtocolDialog
        ref={ref => (this.protocolDialog = ref)}
        language={this.props.language}
        device={this.props.device}
        setLanguage={this.props.setLanguage}
        confirm={isAgree => {
          this.props.setAgreeToProtocol && this.props.setAgreeToProtocol(isAgree)
          this.protocolDialog.setVisible(false)
        }}
      />
    )
  }

  renderImportDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('./src/assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTtile}>{'是否导入外部数据'}</Text>
      </View>
    )
  }

  render () {
    global.language=this.props.language
    return (
      <View style={{flex: 1}}>
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
            this.props.setMap2Dto3D(true)
          }}
        />
        {this.renderDialog()}
        {this.renderImportDialog()}
        {!this.props.isAgreeToProtocol && this._renderProtocolDialog()}
        <Loading ref={ref => GLOBAL.Loading = ref} initLoading={false}/>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.setting.toJS().language,
    user: state.user.toJS(),
    nav: state.nav.toJS(),
    editLayer: state.layers.toJS().editLayer,
    device: state.device.toJS().device,
    map: state.map.toJS(),
    collection: state.collection.toJS(),
    layers: state.layers.toJS().layers,
    backActions: state.backActions.toJS(),
    isAgreeToProtocol: state.setting.toJS().isAgreeToProtocol,
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
  setCurrentTemplateList,
  setTemplate,
  setMapSetting,
  setAnalystParams,
  saveMap,
  setAgreeToProtocol,
  setLanguage,
  setMap2Dto3D,
})(AppRoot)

const App = () =>
  <Provider store={store}>
    <PersistGate loading={Platform.OS === 'android' ? null : <Loading/>} persistor={persistor}>
      {/*<PersistGate loading={null} persistor={persistor}>*/}
      <AppRootWithRedux />
    </PersistGate>
  </Provider>

export default App
