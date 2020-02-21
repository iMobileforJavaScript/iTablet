import NavigationData from './NavigationData'
import NavigationAction from './NavigationAction'
import ToolbarModule from '../ToolbarModule'
import NavigationService from '../../../../../NavigationService'

async function action() {
  try {
    const _params = ToolbarModule.getParams()
    let { getNavigationDatas, setNavigationDatas } = _params
    NavigationService.navigate('NavigationView', {
      changeNavPathInfo: _params.changeNavPathInfo,
      setNavigationDatas,
      getNavigationDatas,
    })
    //   if (!GLOBAL.ISOUTDOORMAP) {
    //     //室内导航
    //     SMap.startIndoorNavigation()
    //     NavigationService.navigate('NavigationView', {
    //       changeNavPathInfo: _params.changeNavPathInfo,
    //     })
    //   } else {
    //     //当前是室外地图，只能进行行业导航和在线路径分析
    //     //行业导航
    //     let navigationDatas = _params.getNavigationDatas()
    //     if (navigationDatas && navigationDatas.name) {
    //       await SMap.startNavigation(navigationDatas)
    //       NavigationService.navigate('NavigationView', {
    //         changeNavPathInfo: _params.changeNavPathInfo,
    //       })
    //     } else {
    //       const _data = await NavigationData.getData(type)
    //       if (_data.data.length > 0) {
    //         _params.showFullMap && _params.showFullMap(true)
    //         _params.setToolbarVisible(true, type, {
    //           containerType: ToolbarType.list,
    //           isFullScreen: true,
    //           isTouchProgress: false,
    //           showMenuDialog: false,
    //           height:
    //             _params.device.orientation === 'LANDSCAPE'
    //               ? ConstToolType.THEME_HEIGHT[3]
    //               : ConstToolType.THEME_HEIGHT[5],
    //           data: _data.data,
    //           buttons: _data.buttons,
    //         })
    //         let data = {
    //           type: type,
    //           getData: NavigationData.getData,
    //           data: _data,
    //           actions: NavigationAction,
    //         }
    //         ToolbarModule.setData(data)
    //       } else {
    //         Toast.show(getLanguage(_params.language).Prompt.NO_NETWORK_DATASETS)
    //       }
    //     }
    //   }
  } catch (e) {
    //console.warn(e)
  }
}

export default function(type, title, customAction) {
  return {
    key: title,
    title: title,
    action: () => {
      if (customAction === false) {
        return
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: require('../../../../../../assets/Navigation/navi_icon.png'),
    getData: NavigationData.getData,
    actions: NavigationAction,
  }
}
