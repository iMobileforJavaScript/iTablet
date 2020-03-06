import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  AsyncStorage,
  StatusBar,
  NativeModules,
  InteractionManager,
  Platform,
  NetInfo,
} from 'react-native'
import { Container, Dialog } from '../../../components'
import { ModuleList } from './components'
import styles from './styles'
import Toast from '../../../utils/Toast'
import {
  SScene,
  SMap,
  SOnlineService,
  SIPortalService,
} from 'imobile_for_reactnative'
import FileTools from '../../../native/FileTools'
import ConstPath from '../../../constants/ConstPath'
import HomePopupModal from './HomePopupModal'
import NavigationService from '../../NavigationService'
import UserType from '../../../constants/UserType'
import { getLanguage } from '../../../language'
import { getThemeAssets } from '../../../assets'
import color from '../../../styles/color'
import { scaleSize } from '../../../utils'
import { SimpleDialog } from '../Friend'

const appUtilsModule = NativeModules.AppUtils
export default class Home extends Component {
  props: {
    navigation: Object,
    language: string,
    setLanguage: () => {},
    nav: Object,
    latestMap: Object,
    currentUser: Object,
    setShow: () => {},
    device: Object,
    user: Object,
    appConfig: Object,
    importSceneWorkspace: () => {},
    importWorkspace: () => {},
    closeWorkspace: () => {},
    openWorkspace: () => {},
    setUser: () => {},
    setDownInformation: () => {},
    setBackAction: () => {},
    removeBackAction: () => {},
    setCurrentMapModule: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      isDownloaded: false,
      modalIsVisible: false,
      dialogCheck: false,
      downloadData: null,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      if (Platform.OS === 'android') {
        this.props.setBackAction({ action: () => this.showMorePop() })
      }
      this._initStatusBarVisible()
    })
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.navigation.state.routeName,
      })
    }
  }

  _initStatusBarVisible = async () => {
    let result = await AsyncStorage.getItem('StatusBarVisible')
    let statusBarVisible = result === 'true'
    // this.setState({ statusBarVisible:statusBarVisible }) /** 初始化状态栏可不可见*/
    StatusBar.setHidden(statusBarVisible)
  }
  _onImportWorkspace = async filePath => {
    try {
      if (filePath !== undefined) {
        let index = filePath.lastIndexOf('/')
        let path = filePath.substring(0, index)
        let snmFiles = await FileTools.getPathListByFilterDeep(path, 'snm')
        await SMap.copyNaviSnmFile(snmFiles)
        // if (isFirstImportWorkspace === true) {
        //   this.container && this.container.setLoading(true, '导入数据中...')
        // }
        let is3D = await SScene.is3DWorkspace({ server: filePath })
        if (is3D === true) {
          let result = await this.props.importSceneWorkspace({
            server: filePath,
          })
          if (result === true) {
            // Toast.show('导入3D成功')
          } else {
            Toast.show(getLanguage(global.language).Prompt.IMPORTED_SUCCESS)
          }
          result = await SMap.importWorkspaceInfo({
            server: filePath,
            type: 9,
          })

          // if (result.length === 0) {
          //   Toast.show(
          //     getLanguage(global.language).Prompt.FAILED_TO_IMPORT,
          //   )
          // }
        } else {
          let result = await SMap.importWorkspaceInfo({
            server: filePath,
            type: 9,
          })

          if (result.length === 0) {
            Toast.show(getLanguage(global.language).Prompt.FAILED_TO_IMPORT)
          }
        }
      }
    } catch (e) {
      Toast.show('导入失败')
    } finally {
      // if (isFirstImportWorkspace === true) {
      //   this.container && this.container.setLoading(false)
      // }
    }
  }
  headRender() {
    let userImg = require('../../../assets/home/icon_mine_select.png')
    let moreImg = require('../../../assets/home/icon_else_selected.png')
    const title = 'SuperMap iTablet'
    return (
      <View style={styles.header}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.userView}>
          <Image source={userImg} style={styles.userImg} />
        </TouchableOpacity>
        <Text style={styles.headTitle}>{title}</Text>
        <TouchableOpacity>
          <Image
            resizeMode={'contain'}
            source={moreImg}
            style={styles.moreImg}
          />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
      </View>
    )
  }
  _closeModal = () => {
    this.setState({ modalIsVisible: false })
  }

  _onLogin = () => {
    this._closeModal()
    NavigationService.navigate('SelectLogin')
    // NavigationService.navigate('Mine')
  }
  _onRegister = () => {
    this._closeModal()
    NavigationService.navigate('Register')
  }

  _onSetting = () => {
    this._closeModal()
    // StatusBar.setHidden(true,'slide')
    NavigationService.navigate('Setting', {
      user: this.props.user,
    })
  }

  _onSettingLanguage = () => {
    this._closeModal()
    NavigationService.navigate('LanguageSetting')
  }

  _onAbout = () => {
    this._closeModal()
    NavigationService.navigate('AboutITablet')
  }

  _onToggleAccount = () => {
    this._closeModal()
    NavigationService.navigate('ToggleAccount')
  }

  _logoutConfirm = () => {
    this._closeModal()
    this.SimpleDialog.setConfirm(() => {
      this.SimpleDialog.setVisible(false)
      this._onLogout()
    })
    this.SimpleDialog.setText(getLanguage(this.props.language).Prompt.LOG_OUT)
    this.SimpleDialog.setVisible(true)
  }

  _onLogout = () => {
    if (this.container) {
      //this.container.setLoading(true, '注销中...')
    }
    try {
      if (UserType.isOnlineUser(this.props.currentUser)) {
        SOnlineService.logout()
      } else if (UserType.isIPortalUser(this.props.currentUser)) {
        SIPortalService.logout()
      }
      this.props.closeWorkspace(async () => {
        SOnlineService.removeCookie()
        let customPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath +
            ConstPath.RelativeFilePath.Workspace[
              global.language === 'CN' ? 'CN' : 'EN'
            ],
        )
        this.props.setUser({
          userName: 'Customer',
          userType: UserType.PROBATION_USER,
        })
        this._closeModal()
        if (this.container) {
          this.container.setLoading(false)
        }
        // NavigationService.navigate('Mine')
        NavigationService.popToTop('Tabs')
        this.props.openWorkspace({ server: customPath })
      })
    } catch (e) {
      if (this.container) {
        this.container.setLoading(false)
      }
    }
  }

  showDialog = value => {
    this.dialog.setDialogVisible(value)
  }

  getModuleItem = (
    ref,
    confirm,
    cancel,
    downloadData,
    currentUserName,
    dialogCheck,
  ) => {
    this.moduleItemRef = ref
    this.dialogConfirm = confirm
    this.dialogCancel = cancel
    this.downloadData = downloadData
    this.currentUserName = currentUserName
    this.setState({ dialogCheck: dialogCheck, downloadData: downloadData })
  }

  getExit = () => {
    return this.exit
  }

  exitConfirm = async () => {
    try {
      // await this._onLogout()
      await appUtilsModule.AppExit()
    } catch (error) {
      Toast.show('退出失败')
    }
  }

  confirm = async () => {
    //先判断是否有网
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected) {
        let confirm = this.dialogConfirm ? this.dialogConfirm : () => {}
        confirm &&
          confirm(this.moduleItemRef, this.downloadData, this.state.dialogCheck)
      } else {
        Toast.show(getLanguage(this.props.language).Prompt.NO_NETWORK)
      }
    })
  }

  cancel = () => {
    let cancel = this.dialogCancel ? this.dialogCancel : () => {}
    cancel && cancel(this.moduleItemRef, this.state.dialogCheck)
  }

  showUserPop = () => {
    this.topNavigatorBarImageId = 'left'
    this.setState({ modalIsVisible: true })
  }

  showMorePop = () => {
    this.topNavigatorBarImageId = 'right'
    this.setState({ modalIsVisible: true })
  }

  renderDialogChildren = () => {
    let storage = null
    let fileName = null
    if (this.state.downloadData !== null) {
      fileName = this.state.downloadData.fileName
      storage =
        (this.state.downloadData.size === undefined
          ? 0
          : (this.state.downloadData.size / 1024 / 1024).toFixed(2)) + 'MB'
    }
    let Img = this.state.dialogCheck
      ? require('../../../assets/home/Frenchgrey/icon_check_selected.png')
      : require('../../../assets/home/Frenchgrey/icon_check.png')
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTtile}>
          {getLanguage(this.props.language).Prompt.DOWNLOAD_SAMPLE_DATA}
        </Text>
        <Text style={styles.depict}>{fileName + '  ' + storage}</Text>
        <TouchableOpacity
          style={styles.checkView}
          onPress={() => {
            let newdialogCheck = !this.state.dialogCheck
            this.setState({ dialogCheck: newdialogCheck })
          }}
        >
          <Image source={Img} style={styles.checkImg} />
          <Text style={styles.dialogCheck}>
            {getLanguage(this.props.language).Prompt.NO_REMINDER}
            {/* 不再提示 */}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderExitDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTtile}>
          {getLanguage(this.props.language).Prompt.QUIT}
          {/* 确定退出SuperMap iTablet ？ */}
        </Text>
      </View>
    )
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={'modal'}
        confirmAction={this.confirm}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.DOWNLOAD}
        //{'下载'}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        //{'取消'}
        // backgroundStyle={styles.dialogBackground}
        opacity={1}
        opacityStyle={[styles.opacityView, { height: scaleSize(340) }]}
        style={[styles.dialogBackground, { height: scaleSize(340) }]}
        cancelAction={this.cancel}
      >
        {this.renderDialogChildren()}
      </Dialog>
    )
  }

  renderExitDialog = () => {
    return (
      <Dialog
        ref={ref => (this.exit = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        confirmAction={this.exitConfirm}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        {this.renderExitDialogChildren()}
      </Dialog>
    )
  }

  _renderModal = () => {
    let isLogin =
      this.props.currentUser.password !== undefined &&
      this.props.currentUser.password !== ''
    return (
      <HomePopupModal
        language={this.props.language}
        setLanguage={this.props.setLanguage}
        isLogin={isLogin}
        onLogin={this._onLogin}
        onRegister={this._onRegister}
        onToggleAccount={this._onToggleAccount}
        onLogout={this._logoutConfirm}
        onSetting={this._onSetting}
        onSettingLanguage={this._onSettingLanguage}
        onAbout={this._onAbout}
        modalVisible={this.state.modalIsVisible}
        onCloseModal={this._closeModal}
        topNavigatorBarImageId={this.topNavigatorBarImageId}
        getExit={this.getExit}
      />
    )
  }

  _renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
  }

  render() {
    let userImg =
      this.props.user.currentUser.userType === UserType.PROBATION_USER ||
      typeof this.props.user.currentUser.userType === 'undefined'
        ? getThemeAssets().tabBar.icon_home_photo
        : {
          uri:
              'https://cdn3.supermapol.com/web/cloud/84d9fac0/static/images/myaccount/icon_plane.png',
        }
    let moreImg = require('../../../assets/home/Frenchgrey/icon_else_selected.png')
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.props.appConfig.name,
          headerLeft: (
            <TouchableOpacity
              style={styles.userView}
              onPress={() => this.showUserPop()}
            >
              <Image source={userImg} style={styles.userImg} />
            </TouchableOpacity>
          ),
          headerRight: (
            <TouchableOpacity
              onPress={() => this.showMorePop()}
              style={styles.moreView}
            >
              <Image
                resizeMode={'contain'}
                source={moreImg}
                style={styles.moreImg}
              />
            </TouchableOpacity>
          ),
        }}
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.contentWhite,
          }}
        >
          <ModuleList
            ref={ref => (this.modulelist = ref)}
            importWorkspace={this._onImportWorkspace}
            setDownInformation={this.props.setDownInformation}
            currentUser={this.props.currentUser}
            styles={styles.modulelist}
            device={this.props.device}
            showDialog={this.showDialog}
            getModuleItem={this.getModuleItem}
            latestMap={this.props.latestMap}
            mapModules={this.props.appConfig.mapModules}
            setCurrentMapModule={this.props.setCurrentMapModule}
          />
          {this._renderModal()}
          {this.renderDialog()}
          {this.renderExitDialog()}
          {this._renderSimpleDialog()}
        </View>
      </Container>
    )
  }
}
