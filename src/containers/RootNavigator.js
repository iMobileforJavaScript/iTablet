import React, { Component } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import NavigationService from './NavigationService'
import AppNavigator from '../containers'
import { createAppContainer } from 'react-navigation'

export default class RootNavigator extends Component {
  static propTypes = {
    appConfig: PropTypes.object,

    setNav: PropTypes.func,
    setModules: PropTypes.func,
  }

  shouldComponentUpdate(nextProps) {
    let prevAppConfig = Object.assign({}, this.props.appConfig)
    let nextAppConfig = Object.assign({}, nextProps.appConfig)
    delete prevAppConfig.currentMapModule
    delete nextAppConfig.currentMapModule
    let shouldUpdate =
      JSON.stringify(prevAppConfig) !== JSON.stringify(nextAppConfig)
    return shouldUpdate
  }

  render() {
    let RootView = <View style={{ flex: 1 }} />
    if (
      this.props.appConfig.tabModules &&
      this.props.appConfig.tabModules.length > 0
    ) {
      const Root = createAppContainer(AppNavigator(this.props.appConfig))
      RootView = (
        <Root
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
      )
    }
    return RootView
  }
}
