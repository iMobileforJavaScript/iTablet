import NavigationData from './NavigationData'
import NavigationAction from './NavigationAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import NavigationService from '../../../../../NavigationService'
import { SMap } from 'imobile_for_reactnative'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'

async function action(type) {
  try {
    const _params = ToolbarModule.getParams()
    let isIndoorMap = await SMap.isIndoorMap()
    if (isIndoorMap) {
      GLOBAL.ISOUTDOORMAP = false
      //室内导航
      SMap.startIndoorNavigation()
      NavigationService.navigate('NavigationView', {
        changeNavPathInfo: _params.changeNavPathInfo,
        showLocationView: false,
      })
    } else {
      //当前是室外地图，只能进行行业导航和在线路径分析
      GLOBAL.ISOUTDOORMAP = true
      //行业导航
      let navigationDatas = _params.getNavigationDatas()
      if (navigationDatas) {
        await SMap.startNavigation(navigationDatas)
        let mapController = _params.getMapController()
        NavigationService.navigate('NavigationView', {
          changeNavPathInfo: _params.changeNavPathInfo,
          showLocationView: true,
          mapController,
        })
        mapController.setVisible(false)
      } else {
        const _data = await NavigationData.getData(type)
        if (_data.data.length > 0) {
          _params.showFullMap && _params.showFullMap(true)
          _params.setToolbarVisible(true, type, {
            containerType: ToolbarType.list,
            isFullScreen: true,
            isTouchProgress: false,
            showMenuDialog: false,
            height:
              _params.device.orientation === 'LANDSCAPE'
                ? ConstToolType.THEME_HEIGHT[3]
                : ConstToolType.THEME_HEIGHT[5],
            data: _data.data,
            buttons: _data.buttons,
          })
          let data = {
            type: type,
            getData: NavigationData.getData,
            data: _data,
            actions: NavigationAction,
          }
          ToolbarModule.setData(data)
        } else {
          Toast.show(getLanguage(_params.language).Prompt.NO_NETWORK_DATASETS)
        }
      }
    }
  } catch (e) {
    //console.warn(e)
  }
}

export default function(type, title) {
  return {
    key: title,
    title: title,
    action: () => action(type),
    size: 'large',
    image: require('../../../../../../assets/Navigation/navi_icon.png'),
    getData: NavigationData.getData,
    actions: NavigationAction,
  }
}
