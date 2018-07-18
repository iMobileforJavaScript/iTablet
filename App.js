import React, { Component } from 'react'
import { View, AppState, StyleSheet, Platform } from 'react-native'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import PropTypes from 'prop-types'
import RootNavigator from './src/containers'
import { setNav, setTest } from './src/models/nav'
import ConfigStore from './src/store'
import { Loading } from './src/components'
import { scaleSize, Toast } from './src/utils'
import NavigationService from './src/containers/NavigationService'

import { Workspace, SMSceneView, SMWorkspaceManagerView } from 'imobile_for_javascript'
import { constUtil } from './src/utils'

import {} from 'imobile_for_javascript'

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
    setNav: PropTypes.func,
    setTest: PropTypes.func,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      sceneStyle: styles.invisibleMap,
    }
    GLOBAL.AppState = AppState.currentState
  }
  
  componentDidMount() {
  }
  
  // _onGetInstance = sceneControl => {
  //   debugger
  //   GLOBAL.sceneControl = sceneControl
  //   // this._addScene()
  // }
  
  // _addScene = (path = '') => {
  //   let workspaceModule = new Workspace()
  //   ;(async function () {
  //     let workspace = await workspaceModule.createObj()   //创建workspace实例
  //     if (!GLOBAL.scene) {
  //       GLOBAL.scene = await GLOBAL.sceneControl.getScene()      //获取场景对象
  //     }
  //     await GLOBAL.scene.setWorkspace(workspace)        //设置工作空间
  //     let filePath = await Utility.appendingHomeDirectory(path)
  //     let openWk = await this.workspace.open(filePath)     //打开工作空间
  //     if (!openWk) {
  //       Toast.show(" 打开工作空间失败")
  //       return
  //     }
  //     let mapName = await workspace.getSceneName(0) //获取场景名称
  //     await GLOBAL.scene.open(mapName)                     //根据名称打开指定场景
  //     await GLOBAL.scene.refresh()                           //刷新场景
  //
  //     this.saveLatest()
  //   }).bind(this)()
  // }
  
  render() {
    return (
      <RootNavigator
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
        onNavigationStateChange={(prevState, currentState) => {
          this.props.setNav(currentState)
        
          // let prevRoute = prevState.routes[prevState.index],
          //   currentRoute = currentState.routes[currentState.index]
          // if (prevRoute.routeName !== 'Map3D' && currentRoute.routeName === 'Map3D') {
          //   console.log('navigate from '+ prevState.routeName + ' to ' + currentRoute.routeName + '  ----   1')
          //   this.setState({
          //     sceneStyle: styles.map,
          //   })
          // } else if (prevRoute.routeName === 'Map3D' && currentRoute.routeName !== 'Map3D') {
          //   console.log('navigate from '+ prevRoute.routeName + ' to ' + currentRoute.routeName + '  ----   2')
          //   this.setState({
          //     sceneStyle: styles.invisibleMap,
          //   })
          // } else {
          //   console.log('navigate from '+ prevRoute.routeName + ' to ' + currentRoute.routeName + '  ----   3')
          // }
        }}
      />
    )
    // return (
    //   <View style={{flex: 1}}>
    //     <RootNavigator
    //       ref={navigatorRef => {
    //         NavigationService.setTopLevelNavigator(navigatorRef);
    //       }}
    //       onNavigationStateChange={(prevState, currentState) => {
    //         this.props.setNav(currentState)
    //
    //         let prevRoute = prevState.routes[prevState.index],
    //           currentRoute = currentState.routes[currentState.index]
    //         if (prevRoute.routeName !== 'Map3D' && currentRoute.routeName === 'Map3D') {
    //           console.log('navigate from '+ prevState.routeName + ' to ' + currentRoute.routeName + '  ----   1')
    //           this.setState({
    //             sceneStyle: styles.map,
    //           })
    //         } else if (prevRoute.routeName === 'Map3D' && currentRoute.routeName !== 'Map3D') {
    //           console.log('navigate from '+ prevRoute.routeName + ' to ' + currentRoute.routeName + '  ----   2')
    //           this.setState({
    //             sceneStyle: styles.invisibleMap,
    //           })
    //         } else {
    //           console.log('navigate from '+ prevRoute.routeName + ' to ' + currentRoute.routeName + '  ----   3')
    //         }
    //       }}
    //     />
    //     {/*<View style={this.state.sceneStyle} >*/}
    //       {/*<SMSceneView ref={ref => GLOBAL.SceneView = ref} onGetScene={this._onGetInstance} />*/}
    //     {/*</View>*/}
    //   </View>
    // )
  }
}



const mapStateToProps = state => {
  return {
    nav: state.nav.toJS(),
  }
}

const AppRootWithRedux = connect(mapStateToProps, {
  setNav,
  setTest,
})(AppRoot)

const App = () =>
  <Provider store={store}>
    <PersistGate loading={<Loading/>} persistor={persistor}>
      <AppRootWithRedux />
    </PersistGate>
  </Provider>

export default App
