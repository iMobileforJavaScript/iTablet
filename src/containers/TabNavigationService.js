/**
 * 含地图的Tabs，同时只能存在一个
 */
let _navigator

function getTopLevelNavigator() {
  return _navigator
}

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef
}

function navigate(routeName, params) {
  _navigator.props.navigation.navigate(routeName, params)
  // (async function() {
  //   if (routeName === preRoute) return
  //   preRoute = routeName
  //   await _navigator.dispatch(
  //     NavigationActions.navigate({
  //       type: NavigationActions.NAVIGATE,
  //       routeName,
  //       params,
  //     }),
  //   )
  //   setTimeout(() => {
  //     preRoute = undefined
  //   }, 2000)
  // })()
}

export default {
  navigate,
  getTopLevelNavigator,
  setTopLevelNavigator,
}
