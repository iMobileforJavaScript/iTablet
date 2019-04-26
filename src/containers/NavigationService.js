// NavigationService.js

import { NavigationActions } from 'react-navigation'

let _navigator
let clickAble = true

function getTopLevelNavigator() {
  return _navigator
}

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

function navigate(routeName, params) {
  (async function() {
    if (clickAble) {
      clickAble = false
      await _navigator.dispatch(
        NavigationActions.navigate({
          type: NavigationActions.NAVIGATE,
          routeName,
          params,
        }),
      )
      setTimeout(() => {
        clickAble = true
      }, 1500)
    }
  })()
}

function goBack(key, immediate) {
  (async function _goBack() {
    await _navigator.dispatch(
      NavigationActions.back({
        key,
        immediate,
      }),
    )
  })()
}

function reset(routeName, params) {
  let resetAction = NavigationActions.popToTop({
    routeName,
    params,
  })
  _navigator.dispatch(resetAction)
}

// add other navigation functions that you need and export them

export default {
  navigate,
  getTopLevelNavigator,
  setTopLevelNavigator,
  goBack,
  reset,
}
