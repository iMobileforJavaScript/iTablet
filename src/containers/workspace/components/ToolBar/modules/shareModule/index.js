import ShareData from './ShareData'
import ShareAction from './ShareAction'
import ToolbarModule from '../ToolbarModule'
import ToolBarHeight from '../ToolBarHeight'

function action(type) {
  const data = ToolBarHeight.getToolbarHeight(type)
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, type, {
    containerType: 'table',
    isFullScreen: true,
    column: data.column,
    height: data.height,
  })
  ToolbarModule.setData({
    type: type,
    getData: ShareData.getData,
    actions: ShareAction,
    isSharing: false,
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
    image: require('../../../../../../assets/function/icon_function_share.png'),
    getData: ShareData.getData,
    actions: ShareAction,
  }
}
