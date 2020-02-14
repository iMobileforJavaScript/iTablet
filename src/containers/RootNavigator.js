import React, { Component } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import NavigationService from './NavigationService'
import AppNavigator from '../containers'
import { createAppContainer } from 'react-navigation'

export default class RootNavigator extends Component {
  static propTypes = {
    modules: PropTypes.object,

    setNav: PropTypes.func,
    setModules: PropTypes.func,
  }

  shouldComponentUpdate(nextProps) {
    let prevModules = Object.assign({}, this.props.modules)
    let nextModules = Object.assign({}, nextProps.modules)
    delete prevModules.currentMapModule
    delete nextModules.currentMapModule
    let shouldUpdate =
      JSON.stringify(prevModules) !== JSON.stringify(nextModules)
    return shouldUpdate
  }

  render() {
    let RootView = <View style={{ flex: 1 }} />
    if (
      this.props.modules.tabModules &&
      this.props.modules.tabModules.length > 0
    ) {
      const Root = createAppContainer(AppNavigator(this.props.modules))
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
