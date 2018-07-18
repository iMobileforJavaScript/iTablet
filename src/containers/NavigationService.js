// NavigationService.js

import { NavigationActions } from 'react-navigation'

let _navigator
let finishFlag = true

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

function navigate(routeName, params) {
  if (finishFlag) {
    finishFlag = false
    _navigate()
  } else {
    return
  }

  async function _navigate() {
    await _navigator.dispatch(
      NavigationActions.navigate({
        type: NavigationActions.NAVIGATE,
        routeName,
        params,
      })
    )
    setTimeout(() => {
      finishFlag = true
    }, 1000)
  }
}

function goBack(key, immediate) {
  async function _goBack() {
    await _navigator.dispatch(
      NavigationActions.back({
        key,
        immediate,
      })
    )
    setTimeout(() => {
      finishFlag = true
    }, 1000)
  }
  if (finishFlag) {
    finishFlag = false
    _goBack()
  } else {
    return
  }
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  goBack,
}