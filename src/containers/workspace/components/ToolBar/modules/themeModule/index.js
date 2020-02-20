import ThemeAction from './ThemeAction'
import ThemeData from './ThemeData'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { SMap } from 'imobile_for_reactnative'

async function action(type) {
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  let xml = await SMap.mapToXml()
  ToolbarModule.setData({
    type: type,
    getData: ThemeData.getData,
    actions: ThemeAction,
    mapXml: xml,
  })
  params.setToolbarVisible(true, ConstToolType.MAP_THEME_CREATE, {
    isFullScreen: true,
    column: params.device.orientation === 'LANDSCAPE' ? 8 : 4,
    height:
      params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[4]
        : ConstToolType.THEME_HEIGHT[10],
  })
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
    image: require('../../../../../../assets/function/icon_function_theme_create.png'),
    getData: ThemeData.getData,
    getMenuData: ThemeData.getMenuData,
    actions: ThemeAction,
  }
}
