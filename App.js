import React, { Component } from 'react'
import { View, AppState, StyleSheet, Platform } from 'react-native'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import RootNavigator from './src/containers'
import { setNav } from './src/models/nav'
import ConfigStore from './src/store'
import { Loading, PanAudioButton, AudioDialog } from './src/components'
import { scaleSize, AudioAnalyst } from './src/utils'
import NavigationService from './src/containers/NavigationService'

import { SpeechManager } from 'imobile_for_javascript'

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
    editLayer: PropTypes.object,
    setNav: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      sceneStyle: styles.invisibleMap,
    }
    GLOBAL.AppState = AppState.currentState
  }

  componentDidMount() {
    (async function () {
      try {
        // 初始化录音
        GLOBAL.SpeechManager = new SpeechManager()
        await GLOBAL.SpeechManager.init()
      } catch (e) {
        console.error(e)
      }
    }).bind(this)()
  }

  render() {
    return (
      <View style={{flex: 1}}>
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
        <PanAudioButton
          onPress={() => {
            if (this.props.nav.routes && this.props.nav.routes[this.props.nav.index].routeName === 'MapView') {
              GLOBAL.AudioDialog.setVisible(true, 'top')
            } else {
              GLOBAL.AudioDialog.setVisible(true)
            }
          }}
          ref={ref => GLOBAL.PanAudioButton = ref}/>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    nav: state.nav.toJS(),
    editLayer: state.layers.toJS().editLayer,
  }
}

const AppRootWithRedux = connect(mapStateToProps, {
  setNav,
})(AppRoot)

const App = () =>
  <Provider store={store}>
    <PersistGate loading={<Loading/>} persistor={persistor}>
      <AppRootWithRedux />
    </PersistGate>
  </Provider>

export default App
