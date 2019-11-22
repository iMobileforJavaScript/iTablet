import ToolAction from './ToolAction'
import ToolData from './ToolData'
import ToolbarModule from '../ToolbarModule'
import ToolBarHeight from '../ToolBarHeight'
import { ConstToolType } from '../../../../../../constants'

function action(type) {
  const data = ToolBarHeight.getToolbarHeight(type)
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_TOOLS, {
    isFullScreen: true,
    column: data.column,
    height: data.height,
  })
  // 重置canUndo和canRedo
  if (params.buttonView.state.canUndo || params.buttonView.state.canRedo) {
    params.buttonView.setState({
      canUndo: false,
      canRedo: false,
    })
  }
  ToolbarModule.setData({
    type: type,
    getData: ToolData.getData,
    actions: ToolAction,
  })
}

export default function(type, title, customAction) {
  return {
    key: title,
    title: title,
    action: () => {
      customAction ? customAction(type) : action(type)
    },
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_tool.png'),
    getData: ToolData.getData,
    getMenuData: ToolData.getMenuData,
    actions: ToolAction,
  }
}