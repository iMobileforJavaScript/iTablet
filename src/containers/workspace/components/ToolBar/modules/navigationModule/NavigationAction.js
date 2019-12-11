import NavigationService from '../../../../../NavigationService'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import NavigationData from './NavigationData'

async function listAction(type, params = {}) {
  const _params = ToolbarModule.getParams()
  if (type === ConstToolType.MAP_NAVIGATION_MODULE) {
    GLOBAL.ISOUTDOORMAP = true
    let selectedItem = params.item
    if (selectedItem) {
      _params.setToolbarVisible(false)
      _params.setNavigationDatas && _params.setNavigationDatas(selectedItem)
      await SMap.startNavigation(selectedItem)
      let mapController = _params.getMapController()
      NavigationService.navigate('NavigationView', {
        changeNavPathInfo: _params.changeNavPathInfo,
        showLocationView: true,
        mapController,
      })
      mapController.setVisible(false)
    } else {
      Toast.show(
        getLanguage(_params.language).Prompt.PLEASE_SELECT_NETWORKDATASET,
      )
    }
  }
}

function toolbarBack() {
  const _params = ToolbarModule.getParams()
  if (!_params) return
  const _data = ToolbarModule.getData()
  const lastData = _data.lastData || {}
  let selectList = _data.selectList
  _params.setToolbarVisible(true, ConstToolType.MAP_NAVIGATION_MODULE, {
    isFullScreen: true,
    isTouchProgress: false,
    showMenuDialog: false,
    containerType: ToolbarType.list,
    data: lastData.data,
    buttons: lastData.buttons,
    height: _data.height,
  })

  ToolbarModule.setData({
    type: ConstToolType.MAP_NAVIGATION_MODULE,
    getData: NavigationData.getData,
    data: lastData,
    actions,
    selectList,
  })
}

const actions = {
  listAction,
  toolbarBack,
}
export default actions
