import StartData from './StartData'
import StartAction from './StartAction'
import ToolbarModule from '../ToolbarModule'
import ToolBarHeight from '../ToolBarHeight'
import { ToolbarType } from '../../../../../../constants'

function action(type) {
  const params = ToolbarModule.getParams()
  const data = ToolBarHeight.getToolbarHeight(type)
  params.showFullMap && params.showFullMap(true)
  // const _data = StartData.getData(type)
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.table,
    column: data.column,
    height: data.height,
    // data: _data.data,
    // buttons: _data.buttons,
  })
  ToolbarModule.setData({
    type: type,
    getData: StartData.getData,
    actions: StartAction,
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
    image: require('../../../../../../assets/function/icon_function_start.png'),
    getData: StartData.getData,
    actions: StartAction,
  }
}
