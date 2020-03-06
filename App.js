import React, { Component } from 'react'
import { View, AppState, StyleSheet, Platform, Image, Text, BackHandler, NativeModules,AsyncStorage,TouchableOpacity} from 'react-native'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import { setNav } from './src/models/nav'
import { setUser } from './src/models/user'
import { setAgreeToProtocol, setLanguage, setMapSetting ,setMap2Dto3D} from './src/models/setting'
import {
  setEditLayer,
  setSelection,
  setCurrentLayer,
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
import { setModules } from './src/models/appConfig'
import { Dialog, Loading } from './src/components'
import { setAnalystParams } from './src/models/analyst'
import { setCollectionInfo } from './src/models/collection'
import { setShow }  from './src/models/device'
import { FileTools }  from './src/native'
import ConfigStore from './src/store'
import { SaveView } from './src/containers/workspace/components'
import { scaleSize, Toast } from './src/utils'
import RootNavigator from './src/containers/RootNavigator'
import { color } from './src/styles'
import { ConstPath, ConstInfo, ConstToolType, ThemeType} from './src/constants'
import * as PT from './src/customPrototype'
import NavigationService from './src/containers/NavigationService'
import Orientation from 'react-native-orientation'
import { SOnlineService, SScene, SMap, SIPortalService ,SpeechManager, SSpeechRecognizer, SLocation} from 'imobile_for_reactnative'
import SplashScreen from 'react-native-splash-screen'
import UserType from './src/constants/UserType'
import { getLanguage } from './src/language/index'
import FetchUtils from './src/utils/FetchUtils'
import { ProtocolDialog } from './src/containers/tabs/Home/components'
import RNFS from 'react-native-fs'
import constants from './src/containers/workspace/constants'
import FriendListFileHandle from './src/containers/tabs/Friend/FriendListFileHandle'
import { SimpleDialog } from './src/containers/tabs/Friend'
import DataHandler from './src/containers/tabs/Mine/DataHandler'
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
    paddingTop:scaleSize(30),
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
  btnStyle: {
    height: scaleSize(80),
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  btnTextStyle: {
    fontSize: scaleSize(24),
    color: color.blue1,
  },
})

class AppRoot extends Component {
  static propTypes = {
    language: PropTypes.string,
    autoLanguage: PropTypes.bool,
    peripheralDevice: PropTypes.string,
    nav: PropTypes.object,
    backActions: PropTypes.object,
    user: PropTypes.object,
    editLayer: PropTypes.object,
    map: PropTypes.object,
    collection: PropTypes.object,
    layers: PropTypes.array,
    isAgreeToProtocol: PropTypes.bool,
    device: PropTypes.object,
    appConfig: PropTypes.object,

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
    setCurrentLayer: PropTypes.func,
    setModules: PropTypes.func,
  }

  constructor (props) {
    super(props)
    this.state = {
      sceneStyle: styles.invisibleMap,
      import: null,
    }
    let config = require('./config.json')
    this.props.setModules(config) // 设置模块
    this.initGlobal()
    PT.initCustomPrototype()
    this.login = this.login.bind(this)
    this.reCircleLogin = this.reCircleLogin.bind(this)

    if (this.props.language !== config.language) {
      this.props.setLanguage(config.language)
    } else if(this.props.autoLanguage) {
      this.props.setLanguage('AUTO')
    } else {
      this.props.setLanguage(this.props.language)
    }
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
    GLOBAL.isDownload = true //目标分类默认文件下载判断
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

  loginOnline = async () => {
    let isEmail = this.props.user.currentUser.isEmail
    let userName = this.props.user.currentUser.userName
    let password = this.props.user.currentUser.password
    let bLogin = false
    if (isEmail === true) {
      bLogin = await SOnlineService.login(userName, password)
    } else if (isEmail === false) {
      bLogin = await SOnlineService.loginWithPhoneNumber(userName, password)
    }
    return bLogin
  }

  async login(){
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      let result
      result = await this.loginOnline()
      if(result){
        result = await FriendListFileHandle.initFriendList(this.props.user.currentUser)
      }
      if(result){
        global.getFriend().onUserLoggedin()
      } else {
        global.getFriend()._logout(getLanguage(this.props.language).Profile.LOGIN_INVALID)
      }
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      let url = this.props.user.currentUser.serverUrl
      let userName = this.props.user.currentUser.userName
      let password = this.props.user.currentUser.password
      SIPortalService.init()
      SIPortalService.login(url, userName, password, true)
    }
  }

  reCircleLogin(){
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      if(GLOBAL.loginTimer !== undefined){
        clearInterval(GLOBAL.loginTimer)
        GLOBAL.loginTimer = undefined
      }
      GLOBAL.loginTimer = setInterval(this.loginOnline,60000 )
    }
  }

  componentDidMount () {
    this.inspectEnvironment()
    this.login()
    this.reCircleLogin()
    if(this.props.peripheralDevice !== 'local') {
      SLocation.changeDevice(this.props.peripheralDevice)
    }
    if(Platform.OS === 'android') {
    //  this.initSpeechManager()
      SSpeechRecognizer.init('5a45b65c')
    } else {
      SSpeechRecognizer.init('5b63b509')
    }
    AppState.addEventListener('change', this.handleStateChange)
    ;(async function () {
      await this.initDirectories()
      await FileTools.initUserDefaultData(this.props.user.currentUser.userName || 'Customer')
      SOnlineService.init()
      // SOnlineService.removeCookie()
      SIPortalService.init()
      await this.initOrientation()
      await this.getImportState()
      await this.addImportExternalDataListener()
      await this.addGetShareResultListener()
      await this.openWorkspace()
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
      this.props.setCurrentLayer() // 清空当前图层
    }
    Platform.OS === 'android' && SplashScreen.hide()

    Platform.OS === 'android' &&
    BackHandler.addEventListener('hardwareBackPress', this.back)
  }

  openWorkspace = async () => {
    let wsPath = ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace[this.props.language === 'CN' ? 'CN' : 'EN'], path = ''
    if (
      this.props.user.currentUser.userType !== UserType.PROBATION_USER ||
      (this.props.user.currentUser.userName !== '' && this.props.user.currentUser.userName !== 'Customer')
    ) {
      let userWsPath = ConstPath.UserPath + this.props.user.currentUser.userName + '/' + ConstPath.RelativeFilePath.Workspace[this.props.language === 'CN' ? 'CN' : 'EN']
      if (await FileTools.fileIsExistInHomeDirectory(userWsPath)) {
        path = await FileTools.appendingHomeDirectory(userWsPath)
      } else {
        path = await FileTools.appendingHomeDirectory(wsPath)
      }
    } else {
      path = await FileTools.appendingHomeDirectory(wsPath)
    }
    // let customerPath = ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace[this.props.language === 'CN' ? 'CN' : 'EN']
    // path = await FileTools.appendingHomeDirectory(customerPath)

    this.props.openWorkspace({server: path})
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
        this.reCircleLogin()
      }
    }

  }

  inspectEnvironment = async () => {

    let serialNumber =await SMap.initSerialNumber('')
    if(serialNumber!==''){
      AsyncStorage.setItem(constants.LICENSE_OFFICIAL_STORAGE_KEY, serialNumber)
    }

    let status = await SMap.getEnvironmentStatus()
    if (!status.isLicenseValid) {
      GLOBAL.LicenseValidDialog.setDialogVisible(true)
    }
    // else if(serialNumber === '' && !status.isTrailLicense)
    // {
    //   GLOBAL.isNotItableLicenseDialog.setDialogVisible(true)
    // }

    if(serialNumber!==''&&!status.isTrailLicense){
      let licenseInfo = await SMap.getSerialNumberAndModules()
      if(licenseInfo!=null&&licenseInfo.modulesArray){
        let modules=licenseInfo.modulesArray
        let size = modules.length
        let number = 0
        for (let i = 0; i < size; i++) {
          let modultCode = Number(modules[i])
          if(modultCode == 0){
            continue
          }
          number = number + (1<<(modultCode%100))
        }
        GLOBAL.modulesNumber=number
      }

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

  getImportState = async () => {
    let result = await FileTools.getImportState()
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
      // await SMapSuspension.closeMap()
      // GLOBAL.SMMapSuspension&&GLOBAL.SMMapSuspension.setVisible(false)
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
      // await SMapSuspension.closeMap()
      // GLOBAL.SMMapSuspension&&GLOBAL.SMMapSuspension.setVisible(false)
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
        <Text style={styles.promptTtile}>
          {getLanguage(this.props.language).Profile.LICENSE_CURRENT_EXPIRE}
          {/* 试用许可已过期,请更换许可后重启 */}
        </Text>
        <View style={{marginTop: scaleSize(30),width: '100%',height: 1,backgroundColor: color.item_separate_white}}></View>
        <TouchableOpacity style={styles.btnStyle}
          onPress={this.inputOfficialLicense}
        >
          <Text style={styles.btnTextStyle}>
            {getLanguage(this.props.language).Profile.LICENSE_OFFICIAL_INPUT}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnStyle}
          onPress={this.applyTrialLicense}
        >
          <Text style={styles.btnTextStyle}>
            {getLanguage(this.props.language).Profile.LICENSE_TRIAL_APPLY}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnStyle}
          onPress={this.exitApp}
        >
          <Text style={styles.btnTextStyle}>
            {getLanguage(this.props.language).Profile.LICENSE_EXIT}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  //退出app
  exitApp= async () => {
    try {
      await AppUtils.AppExit()
    } catch (error) {
      Toast.show(getLanguage(this.props.language).Profile.LICENSE_EXIT_FAILED)
    }
  }
  //接入正式许可
  inputOfficialLicense=async () =>{

    // if(Platform.OS === 'ios'){
    //   GLOBAL.Loading.setLoading(
    //     true,
    //     this.props.language === 'CN' ? '许可申请中...' : 'Applying',
    //   )

    //   let activateResult = await SMap.activateNativeLicense()
    //   if(activateResult === -1){
    //     //没有本地许可文件
    //     GLOBAL.noNativeLicenseDialog.setDialogVisible(true)
    //   }else if(activateResult === -2){
    //     //本地许可文件序列号无效
    //     Toast.show(
    //       getLanguage(this.props.language).Profile
    //         .LICENSE_NATIVE_EXPIRE,
    //     )
    //   }else {
    //     AsyncStorage.setItem(constants.LICENSE_OFFICIAL_STORAGE_KEY, activateResult)
    //     let modules = await SMap.licenseContainModule(activateResult)
    //     let size = modules.length
    //     let number = 0
    //     for (let i = 0; i < size; i++) {
    //       let modultCode = Number(modules[i])
    //       number = number + modultCode
    //     }
    //     GLOBAL.modulesNumber = number

    //     GLOBAL.LicenseValidDialog.setDialogVisible(false)
    //     GLOBAL.getLicense && GLOBAL.getLicense()
    //     Toast.show(
    //       getLanguage(this.props.language).Profile
    //         .LICENSE_SERIAL_NUMBER_ACTIVATION_SUCCESS,
    //     )
    //   }
    //   GLOBAL.Loading.setLoading(
    //     false,
    //     this.props.language === 'CN' ? '许可申请中...' : 'Applying...',
    //   )
    //   return
    // }

    GLOBAL.LicenseValidDialog.setDialogVisible(false)
    NavigationService.navigate('LicenseJoin',{
      cb: async () => {
        NavigationService.goBack()
        GLOBAL.LicenseValidDialog.setDialogVisible(false)
        Toast.show(getLanguage(this.props.language).Profile.LICENSE_SERIAL_NUMBER_ACTIVATION_SUCCESS)
        GLOBAL.LicenseValidDialog.callback&&GLOBAL.LicenseValidDialog.callback()
      },
      backAction:()=>{
        NavigationService.goBack()
        GLOBAL.LicenseValidDialog.setDialogVisible(true)
      },
    })
  }
  //申请试用许可
  applyTrialLicense =async () => {
    GLOBAL.LicenseValidDialog.setDialogVisible(false)
    GLOBAL.Loading.setLoading(
      true,
      this.props.language==='CN'?"许可申请中...":"Applying"
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
            this.props.language==='CN'?"许可申请中...":"Applying..."
          )
          Toast.show(this.props.language==='CN'?"许可申请失败,请检查网络连接":'License application failed.Please check the network connection')
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
            this.props.language==='CN'?"许可申请中...":"Applying"
          )
          SMap.initTrailLicensePath()
          this.openWorkspace()
          Toast.show(this.props.language==='CN'?"试用成功":'Successful trial')
          GLOBAL.LicenseValidDialog.callback&&GLOBAL.LicenseValidDialog.callback()
        })
    }catch (e) {
      GLOBAL.Loading.setLoading(
        false,
        this.props.language==='CN'?"许可申请中...":"Applying"
      )
      Toast.show(this.props.language==='CN'?"许可申请失败,请检查网络连接":'License application failed.Please check the network connection')
      GLOBAL.LicenseValidDialog.callback&&GLOBAL.LicenseValidDialog.callback()
    }
    // NavigationService.navigate('Protocol', { type: 'ApplyLicense' })
  }
  renderDialog = () => {
    return (<Dialog
      ref={ref => (GLOBAL.LicenseValidDialog = ref)}
      showBtns={false}
      type={Dialog.Type.NON_MODAL}
      opacity={1}
      opacityStyle={styles.opacityView}
      style={styles.dialogBackground}
      confirmBtnTitle={this.props.language==='CN' ? '试用' : 'The trial'}
      cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
    >
      {this.renderLicenseDialogChildren()}
    </Dialog>
    )
  }
  renderLicenseNotModuleChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Text style={styles.promptTtile}>
          {getLanguage(this.props.language).Profile.LICENSE_NOT_CONTAIN_CURRENT_MODULE}
          {/* 试用许可已过期,请更换许可后重启 */}
        </Text>
        <View style={{marginTop: scaleSize(30),width: '100%',height: 1,backgroundColor: color.item_separate_white}} />
        <View
          style={{height: scaleSize(200),
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center'}}
          onPress={this.inputOfficialLicense}
        >
          <Text style={{fontSize: scaleSize(20),marginLeft:scaleSize(30),marginRight:scaleSize(30)}}>
            {getLanguage(this.props.language).Profile.LICENSE_NOT_CONTAIN_CURRENT_MODULE_SUB}
          </Text>
        </View>
        <View style={{width: '100%',height: 1,backgroundColor: color.item_separate_white}} />
        <TouchableOpacity
          style={{height: scaleSize(80),
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'}}
          onPress={()=>{ GLOBAL.licenseModuleNotContainDialog.setDialogVisible(false)}}
        >
          <Text style={styles.btnTextStyle}>
            {getLanguage(this.props.language).Prompt.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
  renderLicenseNotModuleDialog = () => {
    return (
      <Dialog
        ref={ref => (GLOBAL.licenseModuleNotContainDialog = ref)}
        showBtns={false}
        opacity={1}
        opacityStyle={[styles.opacityView, { height: scaleSize(340) }]}
        style={[styles.dialogBackground, { height: scaleSize(340) }]}
      >
        {this.renderLicenseNotModuleChildren()}
      </Dialog>
    )
  }

  renderImportDialog = () => {
    return (
      <Dialog
        ref={ref => (this.import = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.YES}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        confirmAction={async () => {
          this.import.setDialogVisible(false)
          GLOBAL.Loading.setLoading(
            true,
            getLanguage(this.props.language).Friends.IMPORT_DATA,
          )
          let homePath = global.homePath
          let importPath = homePath + '/iTablet/Import'
          let filePath = importPath + '/import.zip'
          let isImport = false
          if(await FileTools.fileIsExist(filePath)) {
            await FileTools.unZipFile(filePath, importPath)
            let dataList = await DataHandler.getExternalData(importPath)
            //暂时只支持单个工作空间的导入
            if(dataList.length === 1 && dataList[0].fileType === 'workspace') {
              await DataHandler.importWorkspace(dataList[0])
              isImport = true
            }
          }
          FileTools.deleteFile(importPath)
          isImport
            ? Toast.show(getLanguage(this.props.language).Prompt.IMPORTED_SUCCESS)
            : Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
          GLOBAL.Loading.setLoading(false)
        }}
        cancelAction={ async () => {
          let homePath = global.homePath
          let importPath = homePath + ConstPath.Import
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

  //提示没有本地许可文件
  renderNoNativeOfficialLicenseDialog = () => {
    return (<Dialog
      ref={ref => (GLOBAL.noNativeLicenseDialog = ref)}
      showBtns={false}
      type={Dialog.Type.NON_MODAL}
      opacity={1}
      opacityStyle={styles.opacityView}
      style={styles.dialogBackground}
    >
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('./src/assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTtile}>
          {getLanguage(GLOBAL.language).Profile.LICENSE_NO_NATIVE_OFFICAL}
        </Text>
        <View style={{width: '100%',height: 1,backgroundColor: color.item_separate_white ,marginTop:scaleSize(40)}}></View>
        <TouchableOpacity
          style={{height: scaleSize(60),
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'}}
          onPress={()=>{ GLOBAL.noNativeLicenseDialog.setDialogVisible(false)}}
        >
          <Text style={{ fontSize: scaleSize(24), color: color.fontColorBlack }}>
            {getLanguage(this.props.language).Prompt.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    </Dialog>
    )

  }

  //提示正式许可不是itablet app激活的许可
  renderIsNotItabletLicenseDialog = () => {
    return (<Dialog
      ref={ref => (GLOBAL.isNotItableLicenseDialog = ref)}
      showBtns={false}
      type={Dialog.Type.NON_MODAL}
      opacity={1}
      opacityStyle={styles.opacityView}
      style={styles.dialogBackground}
    >
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('./src/assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={{fontSize: scaleSize(24),
          height: scaleSize(120),
          color: color.theme_white,
          marginTop: scaleSize(5),
          marginLeft: scaleSize(10),
          marginRight: scaleSize(10),
          textAlign: 'center'}}>
          {getLanguage(GLOBAL.language).Profile.LICENSE_NOT_ITABLET_OFFICAL}
        </Text>
        <View style={{width: '100%',height: 1,backgroundColor: color.item_separate_white }}></View>
        <TouchableOpacity
          style={{height: scaleSize(60),
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'}}
          onPress={()=>{ GLOBAL.isNotItableLicenseDialog.setDialogVisible(false)}}
        >
          <Text style={{ fontSize: scaleSize(24), color: color.fontColorBlack }}>
            {getLanguage(this.props.language).Prompt.CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    </Dialog>
    )

  }

  renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => global.SimpleDialog = ref}/>
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <RootNavigator
          appConfig={this.props.appConfig}
          setModules={this.props.setModules}
          setNav={this.props.setNav}
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
        {this.renderSimpleDialog()}
        {this.renderImportDialog()}
        {this.renderLicenseNotModuleDialog()}
        {this.renderNoNativeOfficialLicenseDialog()}
        {this.renderIsNotItabletLicenseDialog()}
        {!this.props.isAgreeToProtocol && this._renderProtocolDialog()}
        <Loading ref={ref => GLOBAL.Loading = ref} initLoading={false}/>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.setting.toJS().language,
    autoLanguage: state.setting.toJS().autoLanguage,
    peripheralDevice: state.setting.toJS().peripheralDevice,
    user: state.user.toJS(),
    nav: state.nav.toJS(),
    editLayer: state.layers.toJS().editLayer,
    device: state.device.toJS().device,
    map: state.map.toJS(),
    collection: state.collection.toJS(),
    layers: state.layers.toJS().layers,
    backActions: state.backActions.toJS(),
    isAgreeToProtocol: state.setting.toJS().isAgreeToProtocol,
    appConfig: state.appConfig.toJS(),
  }
}

const AppRootWithRedux = connect(mapStateToProps, {
  setNav,
  setUser,
  openWorkspace,
  setShow,
  closeMap,
  setCurrentMap,
  setCurrentLayer,
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
  setModules,
})(AppRoot)

const App = () =>
  <Provider store={store}>
    <PersistGate loading={Platform.OS === 'android' ? null : <Loading/>} persistor={persistor}>
      {/*<PersistGate loading={null} persistor={persistor}>*/}
      <AppRootWithRedux />
    </PersistGate>
  </Provider>

export default App
