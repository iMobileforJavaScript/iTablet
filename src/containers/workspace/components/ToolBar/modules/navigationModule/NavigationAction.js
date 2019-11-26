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
    const _data = await NavigationData.getData(
      ConstToolType.MAP_NAVIGATION_SELECT_MODEL,
    )
    const height =
      _params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[3]
        : ConstToolType.THEME_HEIGHT[5]
    let data = {
      type: ConstToolType.MAP_NAVIGATION_SELECT_MODEL,
      getData: NavigationData.getData,
      lastData: ToolbarModule.getData().data,
      actions,
      height,
      data: _data,
      selectedDataset: params.item,
    }
    _params.setToolbarVisible(true, ConstToolType.MAP_NAVIGATION_SELECT_MODEL, {
      containerType: ToolbarType.list,
      isFullScreen: true,
      height,
      isTouchProgress: false,
      showMenuDialog: false,
      data: _data.data,
      buttons: _data.buttons,
    })
    ToolbarModule.setData(data)
  } else if (type === ConstToolType.MAP_NAVIGATION_SELECT_MODEL) {
    params.refreshList && (await params.refreshList(params.item))
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

async function commit() {
  const _params = ToolbarModule.getParams()
  let { selectedModel, selectedDataset } = ToolbarModule.getData()
  if (selectedModel && selectedDataset) {
    let selectedData = {
      selectedDataset: selectedDataset.name,
      selectedModelFilePath: selectedModel.path,
    }
    _params.setToolbarVisible(false)
    _params.setNavigationDatas && _params.setNavigationDatas(selectedData)
    SMap.startNavigation(
      selectedData.selectedDataset,
      selectedData.selectedModelFilePath,
    )
    NavigationService.navigate('NavigationView', {
      changeNavPathInfo: _params.changeNavPathInfo,
      showLocationView: true,
    })
  } else {
    Toast.show(
      getLanguage(_params.language).Prompt
        .PLEASE_SELECT_NETWORKDATASET_AND_NETWORKMODEL,
    )
  }
}

function refreshModels(item) {
  let data = JSON.parse(JSON.stringify(ToolbarModule.getData().data)).data
  let innerData = data[0].data
  let selectedModel
  for (let i = 0; i < innerData.length; i++) {
    if (
      innerData[i].isSelected ||
      JSON.stringify(item) === JSON.stringify(innerData[i])
    ) {
      innerData[i].isSelected = !innerData[i].isSelected
      selectedModel = innerData[i]
    }
  }
  ToolbarModule.addData({ selectedModel })
  data[0].data = innerData
  return data
}

const actions = {
  listAction,
  toolbarBack,
  commit,
  refreshModels,
}
export default actions
