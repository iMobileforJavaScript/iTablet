import React, { Component } from 'react'
import { View, AppState, StyleSheet, Platform } from 'react-native'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import RootNavigator from './src/containers'
import { setNav } from './src/models/nav'
import { setUser } from './src/models/user'
import ConfigStore from './src/store'
import { Loading, PanAudioButton, AudioDialog } from './src/components'
import { scaleSize, AudioAnalyst, Toast } from './src/utils'
import { ConstPath } from './src/constains'
import NavigationService from './src/containers/NavigationService'

import { SpeechManager, Utility, Environment, OnlineService } from 'imobile_for_javascript'

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
      // await this.initEnvironment()
      await this.initSpeechManager()
    }).bind(this)()
  }

  handleStateChange = appState => {
    if (appState === 'active') {
      if (this.props.user.currentUser && this.props.user.currentUser.userName) {
        (async function () {
          let result = await new OnlineService().login(
            this.props.user.currentUser.userName,
            this.props.user.currentUser.password,
          )
          if (typeof result !== 'boolean' && result) {
            Toast.show('请重新登录')
            this.props.setUser({
              userName: '',
              password: '',
            })
          }
        }).bind(this)()
      }
    }
  }

  // 初始化文件目录
  initDirectories = async () => {
    try {
      let paths = [
        ConstPath.AppPath, ConstPath.LicensePath, ConstPath.LocalDataPath,
        ConstPath.SampleDataPath, ConstPath.UserPath,
      ]
      let isCreate = false, absolutePath = ''
      for (let i = 0; i < paths.length; i++) {
        absolutePath = await Utility.appendingHomeDirectory(paths[i])
        isCreate = await Utility.createDirectory(absolutePath)
      }
      if (!isCreate) {
        Toast.show('创建文件目录失败')
      }
    } catch (e) {
      Toast.show('创建文件目录失败')
    }
  }

  // 初始化环境
  initEnvironment = async () => {
    try {
      let licensePath = await Utility.appendingHomeDirectory(ConstPath.LicensePath)
      let en = new Environment()
      let isSet = await en.setLicensePath(licensePath)
      if (!isSet) {
        Toast.show('许可文件设置失败')
        return
      }
      let isInit = await en.initialization()
      if (!isInit) {
        Toast.show('环境初始化失败')
      }
    } catch (e) {
      Toast.show('环境初始化失败')
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
        <AudioDialog
          ref={ref => GLOBAL.AudioDialog = ref}
          data={{
            layer: this.props.editLayer,
          }}
        />
        {
          (
            !this.props.nav.routes ||
            this.props.nav.routes && this.props.nav.routes[this.props.nav.index].routeName !== 'MapView'
          ) &&
          <PanAudioButton
            onPress={() => {
              if (this.props.nav.routes && this.props.nav.routes[this.props.nav.index].routeName === 'MapView') {
                GLOBAL.AudioDialog.setVisible(true, 'top')
              } else {
                GLOBAL.AudioDialog.setVisible(true)
              }
            }}
            ref={ref => GLOBAL.PanAudioButton = ref}/>
        }
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.toJS(),
    nav: state.nav.toJS(),
    editLayer: state.layers.toJS().editLayer,
  }
}

const AppRootWithRedux = connect(mapStateToProps, {
  setNav,
  setUser,
})(AppRoot)

const App = () =>
  <Provider store={store}>
    <PersistGate loading={<Loading/>} persistor={persistor}>
      <AppRootWithRedux />
    </PersistGate>
  </Provider>

export default App
