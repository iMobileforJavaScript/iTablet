/**
 * 导航 数据
 */
import { ConstPath, ConstToolType, UserType } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { SMap, EngineType } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import { getLanguage } from '../../../../../../language'
import { FileTools } from '../../../../../../native'
import { dataUtil } from '../../../../../../utils'

//获取导航的addModule数据
async function getDataset() {
  const params = ToolbarModule.getParams()
  let data = [],
    buttons = [ToolbarBtnType.THEME_CANCEL]
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
    data = [
      {
        title: getLanguage(params.language).Map_Main_Menu.NETWORK_DATASET,
        image: require('../../../../../../assets/mapToolbar/dataset_type_network.png'),
        data: list,
      },
    ]
  }
  return { data, buttons }
}

let navData
async function getData(type) {
  switch (type) {
    case ConstToolType.MAP_NAVIGATION_MODULE:
      if (!navData) navData = getDataset()
      return navData
  }
}
export default {
  getData,
}
