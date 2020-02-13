import { getLanguage } from '../../../../../../language'
import { Toast, LayerUtils } from '../../../../../../utils'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import AddData from './AddData'
import NavigationService from '../../../../../NavigationService'

/**
 * containerType为list时，listAction为列表行点击事件
 * @param type
 * @param params {item, section, index}
 * @returns {Promise.<void>}
 */
async function listAction(type, params = {}) {
  if (
    type === ConstToolType.MAP_ADD ||
    type === ConstToolType.MAP_NAVIGATION_ADD_UDB
  ) {
    // 数据源和地图列表点击事件
    const _params = ToolbarModule.getParams()
    if (
      params.section &&
      params.section.title ===
        getLanguage(_params.language).Map_Main_Menu.OPEN_DATASOURCE
    ) {
      // 打开数据源
      const _data = await AddData.getData(
        ConstToolType.MAP_THEME_ADD_DATASET,
        params.item,
      )

      const height =
        _params.device.orientation === 'LANDSCAPE'
          ? ConstToolType.THEME_HEIGHT[3]
          : ConstToolType.THEME_HEIGHT[5]
      let data = {
        type: type,
        getData: AddData.getData,
        lastData: ToolbarModule.getData().data,
        actions,
        height,
      }
      let selectList = ToolbarModule.getData().selectList
      _data.data[0].allSelectType = true
      if (
        selectList &&
        Object.keys(selectList).length > 0 &&
        _data.data.length > 0 &&
        selectList[_data.data[0].title]
      ) {
        for (let item of _data.data[0].data) {
          item.isSelected =
            selectList[_data.data[0].title].indexOf(item.datasetName) >= 0
        }
        Object.assign(data, { selectList: ToolbarModule.getData().selectList })
      }

      _params.showFullMap && _params.showFullMap(true)
      _params.setToolbarVisible(true, ConstToolType.MAP_THEME_ADD_DATASET, {
        containerType: ToolbarType.selectableList,
        isFullScreen: true,
        isTouchProgress: false,
        showMenuDialog: false,
        height,
        data: _data.data,
        buttons: _data.buttons,
      })
      ToolbarModule.addData(data)
    } else if (
      params.section &&
      params.section.title ===
        getLanguage(_params.language).Map_Main_Menu.OPEN_MAP
    ) {
      // 添加地图
      _params.setContainerLoading &&
        _params.setContainerLoading(
          true,
          getLanguage(_params.language).Prompt.LOADING,
        )
      SMap.addMap(params.item.name || params.item.title).then(async result => {
        _params.setContainerLoading && _params.setContainerLoading(false)
        Toast.show(
          result
            ? getLanguage(_params.language).Prompt.ADD_SUCCESS
            : getLanguage(_params.language).Prompt.ADD_MAP_FAILED,
        )
        if (result) {
          await _params.getLayers(-1, async layers => {
            _params.setCurrentLayer(layers.length > 0 && layers[0])

            for (let i = layers.length; i > 0; i--) {
              if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
                await SMap.moveToTop(layers[i].name)
              }
            }
            SMap.refreshMap()
          })
        }
        _params.setToolbarVisible(false)
      })
    } else if (
      params.section &&
      params.section.title ===
        getLanguage(_params.language).Map_Main_Menu.NETWORK_DATASET
    ) {
      let selectedItem = params.item
      if (selectedItem) {
        _params.setToolbarVisible(false)
        _params.setNavigationDatas && _params.setNavigationDatas(selectedItem)
        //await SMap.startNavigation(selectedItem)
        NavigationService.navigate('NavigationView', {
          changeNavPathInfo: _params.changeNavPathInfo,
          getNavigationDatas: _params.getNavigationDatas,
        })
      } else {
        Toast.show(
          getLanguage(_params.language).Prompt.PLEASE_SELECT_NETWORKDATASET,
        )
      }
    }
  } else if (type === ConstToolType.MAP_THEME_ADD_DATASET) {
    // 数据集列表点击事件
    let data = ToolbarModule.getData()
    if (data && data.selectList) {
      data = Object.assign(data.selectList, params.selectList)
    } else {
      data = Object.assign(data, { selectList: params.selectList })
    }
    ToolbarModule.addData(data)
  } else if (type === ConstToolType.MAP_NAVIGATION_SELECT_MODEL) {
    params.refreshList && (await params.refreshList(params.item))
  }
}

async function listSelectableAction({ selectList }) {
  ToolbarModule.addData({ selectList })
}

/**
 * 返回从添加数据集列表->数据源和地图列表
 */
function toolbarBack() {
  const _params = ToolbarModule.getParams()
  if (!_params) return
  const _data = ToolbarModule.getData()
  const lastData = _data.lastData || {}
  let selectList = _data.selectList
  _params.setToolbarVisible(true, ConstToolType.MAP_ADD, {
    isFullScreen: true,
    isTouchProgress: false,
    showMenuDialog: false,
    containerType: ToolbarType.list,
    data: lastData.data,
    buttons: lastData.buttons,
    height: _data.height,
  })

  ToolbarModule.setData({
    type: ConstToolType.MAP_ADD,
    getData: AddData.getData,
    data: lastData,
    actions,
    selectList,
  })
}

async function commit() {
  const _params = ToolbarModule.getParams()
  const selectList =
    (ToolbarModule.getData() && ToolbarModule.getData().selectList) || []
  if (!_params) return
  if (Object.keys(selectList).length === 0) {
    Toast.show(getLanguage(_params.language).Prompt.PLEASE_ADD_DATASET)
    return
  }
  let result = {}
  for (let key of Object.keys(selectList)) {
    let resultArr = await SMap.addLayers(selectList[key], key)

    // 找出有默认样式的数据集，并给对应图层设置
    for (let i = 0; i < resultArr.length; i++) {
      let description =
        resultArr[i].description &&
        resultArr[i].description !== 'NULL' &&
        JSON.parse(resultArr[i].description)
      if (description && description.geoStyle) {
        await SMap.setLayerStyle(
          resultArr[i].layerName,
          JSON.stringify(description.geoStyle),
        )
      }
    }
    if (resultArr && resultArr.length > 0) result[key] = resultArr
  }

  if (Object.keys(result).length > 0) {
    _params.getLayers(-1, async layers => {
      if (layers.length > 0) {
        _params.setCurrentLayer(layers[0])
        SMap.setLayerEditable(layers[0].path, true)

        for (let i = layers.length; i > 0; i--) {
          if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
            await SMap.moveToTop(layers[i].name)
          }
        }
        SMap.refreshMap()
      }
    })

    _params.setToolbarVisible(false)
    GLOBAL.dialog.setDialogVisible(true)
    Toast.show(getLanguage(_params.language).Prompt.ADD_SUCCESS)
  } else {
    Toast.show(getLanguage(_params.language).Prompt.ADD_FAILED)
  }
}

const actions = {
  listAction,
  listSelectableAction,
  toolbarBack,
  commit,
}
export default actions
