import ThemeAction from './ThemeAction'
import ThemeData from './ThemeData'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'

function action(type) {
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_THEME_CREATE, {
    isFullScreen: true,
    column: params.device.orientation === 'LANDSCAPE' ? 8 : 4,
    height:
      params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[4]
        : ConstToolType.THEME_HEIGHT[10],
  })
  ToolbarModule.setData({
    type: type,
    getData: ThemeData.getData,
    actions: ThemeAction,
  })
}

export default function(type, title) {
  return {
    key: title,
    title: title,
    action: () => action(type),
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_theme_create.png'),
    getData: ThemeData.getData,
    getMenuData: ThemeData.getMenuData,
    actions: ThemeAction,
  }
}
