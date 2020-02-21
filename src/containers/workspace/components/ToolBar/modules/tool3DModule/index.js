import Tool3DData from './Tool3DData'
import Tool3DAction from './Tool3DAction'
import ToolbarModule from '../ToolbarModule'
import ToolBarHeight from '../ToolBarHeight'
import { ToolbarType } from '../../../../../../constants'

function action(type) {
  const data = ToolBarHeight.getToolbarHeight(type)
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.table,
    isFullScreen: true,
    column: data.column,
    height: data.height,
  })
  ToolbarModule.setData({
    type: type,
    getData: Tool3DData.getData,
    actions: Tool3DAction,
  })
}

export default function(type, title, customAction) {
  ToolbarModule.setData({
    type: type,
    getData: Tool3DData.getData,
    actions: Tool3DAction,
  })
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
    image: require('../../../../../../assets/function/icon_function_tool.png'),
    getData: Tool3DData.getData,
    // getMenuData: Tool3DData.getMenuData,
    actions: Tool3DAction,
  }
}
