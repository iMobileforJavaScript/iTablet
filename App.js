import React, { Component } from 'react'
import { View, AppState, StyleSheet, Platform } from 'react-native'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import RootNavigator from './src/containers'
import { setNav } from './src/models/nav'
import { setUser } from './src/models/user'
import { openWorkspace } from './src/models/map'
import { setShow}  from './src/models/device'
import ConfigStore from './src/store'
import { Loading } from './src/components'
import { scaleSize, AudioAnalyst, Toast } from './src/utils'
import { ConstPath } from './src/constants'
import NavigationService from './src/containers/NavigationService'
import Orientation from 'react-native-orientation'
import {screen} from './src/utils'
import { SpeechManager, Utility, SOnlineService, SMap, WorkspaceType } from 'imobile_for_reactnative'

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
    setNav: PropTypes.func,
    setUser: PropTypes.func,
    openWorkspace:PropTypes.func,
    setShow:PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      sceneStyle: styles.invisibleMap,
    }
    GLOBAL.AppState = AppState.currentState
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleStateChange)
    ;(async function () {
      await this.initDirectories()
      SOnlineService.init()
      SOnlineService.removeCookie()
      let customerPath = ConstPath.CustomerPath+ConstPath.RelativeFilePath.Workspace
      let path = await Utility.appendingHomeDirectory(customerPath)
      this.props.openWorkspace({server:path})
      // await this.initEnvironment()
      // await this.initSpeechManager()
      // await this.initCustomerWorkspace()
      await this.initOrientation()
    }).bind(this)()
  }

  handleStateChange = appState => {
    if (appState === 'active') {
      // if (this.props.user.currentUser && this.props.user.currentUser.userName) {
      //   (async function () {
      //     let result = await new OnlineService().login(
      //       this.props.user.currentUser.userName,
      //       this.props.user.currentUser.password,
      //     )
      //     if (!(typeof result === 'boolean' && result)) {
      //       Toast.show('请重新登录')
      //       this.props.setUser({
      //         userName: '',
      //         password: '',
      //       })
      //     }
      //   }).bind(this)()
      // }
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
        absolutePath = await Utility.appendingHomeDirectory(path)
        let exist = await Utility.fileIsExistInHomeDirectory(path)
        let fileCreated = exist || await Utility.createDirectory(absolutePath)
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
        absolutePath = await Utility.appendingHomeDirectory(ConstPath.CustomerPath + path)
        let exist = await Utility.fileIsExistInHomeDirectory(ConstPath.CustomerPath + path)
        let fileCreated = exist || await Utility.createDirectory(absolutePath)
        isCreate = fileCreated && isCreate
      }
      return isCreate
    } catch (e) {
      return false
    }
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
  initCustomerWorkspace = async () => {
    try {
      const customerPath = ConstPath.CustomerPath
      let exist = await Utility.fileIsExistInHomeDirectory(customerPath + ConstPath.RelativePath.CustomerWorkspace)
      !exist && Utility.appendingHomeDirectory(customerPath).then(path => {
        SMap.saveWorkspace({
          caption: 'Customer',
          type: WorkspaceType.SMWU,
          server: path,
        })
      })
    } catch (e) {
      Toast.show('游客工作空间初始化失败')
    }
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
            AudioAnalyst.setConfig({
              nav: currentState,
            })
          }}
        />
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
  }
}

const AppRootWithRedux = connect(mapStateToProps, {
  setNav,
  setUser,
  openWorkspace,
  setShow,
})(AppRoot)

const App = () =>
  <Provider store={store}>
    <PersistGate loading={<Loading/>} persistor={persistor}>
      <AppRootWithRedux />
    </PersistGate>
  </Provider>

export default App
