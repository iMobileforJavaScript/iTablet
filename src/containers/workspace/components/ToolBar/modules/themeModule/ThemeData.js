/**
 * 获取地图专题图数据
 */
import { ConstToolType } from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import ToolbarModule from '../ToolbarModule'
import ThemeMenuData from './data'
import ThemeAction from './ThemeAction'
import ToolbarBtnType from '../../ToolbarBtnType'
import constants from '../../../../constants'
import { SThemeCartography } from 'imobile_for_reactnative'

/**
 * 获取专题图操作
 * @param type
 * @param params
 * @returns {{data: Array, buttons: Array}}
 */
function getData(type, params) {
  let data = [],
    buttons = [],
    temp = {}
  ToolbarModule.setParams(params)
  // GLOBAL.MapToolType = type
  switch (type) {
    case ConstToolType.MAP_THEME_CREATE:
    case ConstToolType.MAP_THEME_CREATE_BY_LAYER:
      temp = ThemeMenuData.getThemeMapCreate(type)
      data = temp.data
      buttons = temp.buttons
      break
    case ConstToolType.MAP_THEME_PARAM:
    case ConstToolType.MAP_THEME_PARAM_GRAPH:
      temp = ThemeMenuData.getThemeMapParam(type)
      data = temp.data
      buttons = temp.buttons
      break
    case ConstToolType.MAP_THEME_START_CREATE:
      temp = ThemeMenuData.getThemeMapStartCreate(type)
      data = temp.data
      buttons = temp.buttons
      break
    default:
      if (type.indexOf(ConstToolType.MAP_THEME_PARAM_GRAPH + '_') > 0) {
        buttons = ThemeMenuData.getThemeFiveMenu()
      }
      break
  }
  return { data, buttons }
}

async function getDatasets(type, params = {}) {
  let buttons = []
  let data = []

  if (type === ConstToolType.MAP_THEME_ADD_DATASET) {
    let selectList =
      (ToolbarModule.getData() && ToolbarModule.getData().selectList) || []
    let path = await FileTools.appendingHomeDirectory(params.path)
    let list = await SThemeCartography.getUDBName(path)

    list.forEach(_params => {
      if (_params.geoCoordSysType && _params.prjCoordSysType) {
        _params.info = {
          infoType: 'dataset',
          geoCoordSysType: _params.geoCoordSysType,
          prjCoordSysType: _params.prjCoordSysType,
        }
      }
      if (
        Object.keys(selectList).length > 0 &&
        selectList[params.name] !== undefined &&
        selectList[params.name].length > 0
      ) {
        // for (let item of selectList[params.name]) {
        //   _params.isSelected = Object.keys(item)[0] === _params.datasetName
        // }
        _params.isSelected = selectList[params.name][_params.datasetName]
      }
    })
    let arr = params.name.split('.')
    let alias = arr[0]
    data = [
      {
        title: alias,
        image: require('../../../../../../assets/mapToolbar/list_type_udb.png'),
        data: list,
        allSelectType: true,
      },
    ]

    buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  }
  return { data, buttons }
}

function getMenuData(type, themeType) {
  let data = []
  if (type.indexOf('MAP_THEME_PARAM') === -1) return data
  let themeParams = ToolbarModule.getData().themeParams // 切换到menu，保留themeParams，用于保存专题参数
  let mapXml = ToolbarModule.getData().mapXml // 切换到menu，保留mapXml，用于还原专题图
  let moduleData = {
    type: type,
    getData: getData,
    actions: ThemeAction,
    themeParams,
  }
  if (themeParams) {
    Object.assign(moduleData, themeParams)
  }
  if (mapXml) {
    Object.assign(moduleData, { mapXml })
  }
  ToolbarModule.setData(moduleData)
  if (themeType === constants.THEME_UNIQUE_STYLE) {
    data = ThemeMenuData.uniqueMenuInfo(GLOBAL.language)
  } else if (themeType === constants.THEME_RANGE_STYLE) {
    data = ThemeMenuData.rangeMenuInfo(GLOBAL.language)
  } else if (themeType === constants.THEME_UNIFY_LABEL) {
    data = ThemeMenuData.labelMenuInfo(GLOBAL.language)
  } else if (themeType === constants.THEME_UNIQUE_LABEL) {
    data = ThemeMenuData.uniqueLabelMenuInfo(GLOBAL.language)
  } else if (themeType === constants.THEME_RANGE_LABEL) {
    data = ThemeMenuData.rangeLabelMenuInfo(GLOBAL.language)
  } else if (themeType === constants.THEME_GRAPH_STYLE) {
    data = ThemeMenuData.graphMenuInfo(GLOBAL.language)
  } else if (themeType === constants.THEME_DOT_DENSITY) {
    data = ThemeMenuData.dotDensityMenuInfo(GLOBAL.language)
  } else if (themeType === constants.THEME_GRADUATED_SYMBOL) {
    data = ThemeMenuData.graduatedSymbolMenuInfo(GLOBAL.language)
  } else if (themeType === constants.THEME_GRID_UNIQUE) {
    data = ThemeMenuData.gridUniqueMenuInfo(GLOBAL.language)
  } else if (themeType === constants.THEME_GRID_RANGE) {
    data = ThemeMenuData.gridRangeMenuInfo(GLOBAL.language)
  } else if (themeType === constants.THEME_HEATMAP) {
    data = ThemeMenuData.heatmapMenuInfo(GLOBAL.language)
  }
  return data
}

export default {
  getData,
  getMenuData,
  getDatasets,
}
