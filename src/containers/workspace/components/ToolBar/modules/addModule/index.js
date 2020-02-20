import AddData from './AddData'
import AddAction from './AddAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'

export async function action(type) {
  const _data = await AddData.getData(type)
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.list,
    isFullScreen: true,
    isTouchProgress: false,
    showMenuDialog: false,
    height:
      params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[3]
        : ConstToolType.THEME_HEIGHT[5],
    data: _data.data,
    buttons: _data.buttons,
  })
  let data = {
    type: type,
    getData: AddData.getData,
    data: _data,
    actions: AddAction,
  }
  ToolbarModule.setData(data)
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
    image: require('../../../../../../assets/function/icon_function_add.png'),
    getData: AddData.getData,
    actions: AddAction,
  }
}
