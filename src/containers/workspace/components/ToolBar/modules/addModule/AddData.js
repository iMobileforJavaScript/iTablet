/**
 * 添加 数据
 */
import { ConstToolType, ConstPath, UserType } from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import { dataUtil } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { SThemeCartography, SMap, EngineType } from 'imobile_for_reactnative'
import ToolbarBtnType from '../../ToolbarBtnType'
import ToolbarModule from '../ToolbarModule'

/**
 * 获取数据源和地图菜单
 * @returns {Promise.<void>}
 */
async function getUDBsAndMaps() {
  let data = [],
    buttons = [ToolbarBtnType.THEME_CANCEL]
  let userUDBPath, userUDBs
  //过滤掉标注和标绘匹配正则
  let checkLabelAndPlot = /^(Label_|PlotEdit_(.*)@)(.*)((#$)|(#_\d+$)|(##\d+$))/
  if (
    ToolbarModule.getParams().user &&
    ToolbarModule.getParams().user.currentUser.userName &&
    ToolbarModule.getParams().user.currentUser.userType !==
      UserType.PROBATION_USER
  ) {
    let userPath =
      (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
      ToolbarModule.getParams().user.currentUser.userName +
      '/'
    userUDBPath = userPath + ConstPath.RelativePath.Datasource
    userUDBs = await FileTools.getPathListByFilter(userUDBPath, {
      extension: 'udb',
      type: 'file',
    })
    //过滤掉标注和标绘
    let filterUDBs = userUDBs.filter(item => {
      item.name = dataUtil.getNameByURL(item.path)
      return !item.name.match(checkLabelAndPlot)
    })
    filterUDBs.map(item => {
      item.image = require('../../../../../../assets/mapToolbar/list_type_udb_black.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
    })

    let mapData = await FileTools.getPathListByFilter(
      userPath + ConstPath.RelativePath.Map,
      {
        extension: 'xml',
        type: 'file',
      },
    )
    mapData.forEach(item => {
      item.image = require('../../../../../../assets/mapToolbar/list_type_map_black.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
      item.name = dataUtil.getNameByURL(item.path)
    })

    data = [
      // {
      //   title: Const.PUBLIC_DATA_SOURCE,
      //   data: customerUDBs,
      // },
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .OPEN_DATASOURCE,
        //Const.DATA_SOURCE,
        image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
        data: filterUDBs,
      },
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .OPEN_MAP,
        //Const.MAP,
        image: require('../../../../../../assets/mapToolbar/list_type_map.png'),
        data: mapData,
      },
    ]
  } else {
    let customerUDBPath = await FileTools.appendingHomeDirectory(
      ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
    )
    let customerUDBs = await FileTools.getPathListByFilter(customerUDBPath, {
      extension: 'udb',
      type: 'file',
    })
    //过滤掉标注和标绘
    let filterUDBs = customerUDBs.filter(item => {
      item.name = dataUtil.getNameByURL(item.path)
      return !item.name.match(checkLabelAndPlot)
    })
    filterUDBs.map(item => {
      item.image = require('../../../../../../assets/mapToolbar/list_type_udb_black.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
    })
    let customerPath = await FileTools.appendingHomeDirectory(
      ConstPath.CustomerPath,
    )
    let mapData = await FileTools.getPathListByFilter(
      customerPath + ConstPath.RelativePath.Map,
      {
        extension: 'xml',
        type: 'file',
      },
    )
    mapData.forEach(item => {
      item.image = require('../../../../../../assets/mapToolbar/list_type_map_black.png')
      item.info = {
        infoType: 'mtime',
        lastModifiedDate: item.mtime,
      }
      item.name = dataUtil.getNameByURL(item.path)
    })
    data = [
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .OPEN_DATASOURCE,
        //Const.DATA_SOURCE,
        image: require('../../../../../../assets/mapToolbar/list_type_udbs.png'),
        data: filterUDBs,
      },
      {
        title: getLanguage(ToolbarModule.getParams().language).Map_Main_Menu
          .OPEN_MAP,
        //Const.MAP,
        image: require('../../../../../../assets/mapToolbar/list_type_map.png'),
        data: mapData,
      },
    ]
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
      },
    ]

    buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  }
  return { data, buttons }
}

//获取导航的addModule数据
async function getAllDatas() {
  const params = ToolbarModule.getParams()
  let { data, buttons } = await getUDBsAndMaps()
  let list
  let userUDBPath, userUDBs
  let checkLabelAndPlot = /^(Label_|PlotEdit_(.*)@)(.*)((#$)|(#_\d+$)|(##\d+$))/
  if (
    params.user &&
    params.user.currentUser.userName &&
    params.user.currentUser.userType !== UserType.PROBATION_USER
  ) {
    let userPath =
      (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
      params.user.currentUser.userName +
      '/'
    userUDBPath = userPath + ConstPath.RelativePath.Datasource
    userUDBs = await FileTools.getPathListByFilter(userUDBPath, {
      extension: 'udb',
      type: 'file',
    })
  } else {
    let customerUDBPath = await FileTools.appendingHomeDirectory(
      ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
    )
    userUDBs = await FileTools.getPathListByFilter(customerUDBPath, {
      extension: 'udb',
      type: 'file',
    })
  }

  //过滤掉标注和标绘
  userUDBs = userUDBs.filter(item => {
    item.name = dataUtil.getNameByURL(item.path)
    return !item.name.match(checkLabelAndPlot)
  })

  for (let item of userUDBs) {
    let connectionInfo = {}
    connectionInfo.server = await FileTools.appendingHomeDirectory(item.path)
    connectionInfo.engineType = EngineType.UDB
    connectionInfo.alias = item.name
    await SMap.openNavDatasource(connectionInfo)
  }
  let datas = await SMap.getNetworkDataset()
  datas.length > 0 && (list = datas)
  if (list.length > 0) {
    list.forEach(
      item =>
        (item.image = require('../../../../../../assets/Navigation/network.png')),
    )
    let networkData = [
      {
        title: getLanguage(params.language).Map_Main_Menu.NETWORK_DATASET,
        image: require('../../../../../../assets/mapToolbar/dataset_type_network.png'),
        data: list,
      },
    ]
    data = data.concat(networkData)
  }
  return { data, buttons }
}

let navDatas
async function getData(type, params = {}) {
  switch (type) {
    case ConstToolType.MAP_THEME_ADD_DATASET:
      return getDatasets(type, params)
    case ConstToolType.MAP_ADD:
      return await getUDBsAndMaps()
    case ConstToolType.MAP_NAVIGATION_ADD_UDB:
      if (!navDatas) navDatas = await getAllDatas()
      return navDatas
  }
}

export default {
  getData,
}
