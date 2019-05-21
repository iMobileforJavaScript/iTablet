// NavigationService.js

import { NavigationActions } from 'react-navigation'

let _navigator
let preRoute = undefined

function getTopLevelNavigator() {
  return _navigator
}

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

function navigate(routeName, params) {
  (async function() {
    if (routeName === preRoute) return
    preRoute = routeName
    await _navigator.dispatch(
      NavigationActions.navigate({
        type: NavigationActions.NAVIGATE,
        routeName,
        params,
      }),
    )
    setTimeout(() => {
      preRoute = undefined
    }, 2000)
  })()
}

/**
 *
 * @param routeName 从该页面返回
 * @param immediate
 */
function goBack(routeName, immediate) {
  (async function _goBack() {
    let key
    if (routeName) {
      let routes = _navigator.state.nav.routes
      for (let i = routes.length - 1; i >= 0; i--) {
        if (routes[i].routeName === routeName) {
          key = routes[i].key
          break
        }
      }
    }
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
