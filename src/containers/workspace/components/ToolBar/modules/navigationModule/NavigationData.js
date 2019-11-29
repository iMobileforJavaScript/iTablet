/**
 * 导航 数据
 */
import { ConstToolType } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
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

async function getData(type) {
  switch (type) {
    case ConstToolType.MAP_NAVIGATION_MODULE:
      return getDataset()
  }
}
export default {
  getData,
}
