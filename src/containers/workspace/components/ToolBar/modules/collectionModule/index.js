import CollectionData from './CollectionData'
import CollectionAction from './CollectionAction'
import ToolbarModule from '../ToolbarModule'
import ToolBarHeight from '../ToolBarHeight'
import { ConstToolType } from '../../../../../../constants'

function action(type) {
  const data = ToolBarHeight.getToolbarHeight(type)
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_SYMBOL, {
    isFullScreen: true,
    column: data.column,
    height: data.height,
  })
  ToolbarModule.setData({
    type: type,
    getData: CollectionData.getData,
    actions: CollectionAction,
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
    image: require('../../../../../../assets/function/icon_function_symbol.png'),
    getData: CollectionData.getData,
    actions: CollectionAction,
  }
}
