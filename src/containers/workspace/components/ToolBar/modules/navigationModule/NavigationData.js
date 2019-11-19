/**
 * 导航 数据
 */
import { ConstPath, ConstToolType } from '../../../../../../constants'
import { FileTools } from '../../../../../../native'
import ToolbarBtnType from '../../ToolbarBtnType'
import { getThemeAssets } from '../../../../../../assets'
import { SMap } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import { getLanguage } from '../../../../../../language'

//获取导航的addModule数据
async function getDataset() {
  const params = ToolbarModule.getParams()
  let list = await SMap.getNetworkDataset()
  let data = [],
    buttons = [ToolbarBtnType.THEME_CANCEL]
  if (list.length > 0) {
    data = [
      {
        title: getLanguage(params.language).Map_Main_Menu.NETWORK_DATASET,
        image: require('../../../../../../assets/mapToolbar/list_type_udb.png'),
        data: list,
      },
    ]
  }
  return { data, buttons }
}

async function getModels() {
  let params = ToolbarModule.getParams()
  let path =
    (await FileTools.appendingHomeDirectory(
      params.user && params.user.currentUser.userName
        ? ConstPath.UserPath + params.user.currentUser.userName + '/'
        : ConstPath.CustomerPath,
    )) + ConstPath.RelativePath.Datasource
  let data = [
    {
      title: getLanguage(params.language).Map_Main_Menu.MODEL_FILE,
      image: getThemeAssets().functionBar.rightbar_network_model_white,
      data: [],
    },
  ]
  let _data = await FileTools.getNetModel(path)
  _data.forEach(item => (item.isSelected = false))
  data[0].data = _data
  let buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
  return { data, buttons }
}
async function getData(type) {
  switch (type) {
    case ConstToolType.MAP_NAVIGATION_MODULE:
      return getDataset()
    case ConstToolType.MAP_NAVIGATION_SELECT_MODEL:
      return getModels()
  }
}
export default {
  getData,
}
