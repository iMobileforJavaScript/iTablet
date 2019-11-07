import ShareData from './ShareData'
import ShareAction from './ShareAction'
import ToolbarModule from '../ToolbarModule'
import ToolBarHeight from '../ToolBarHeight'
import { ConstToolType } from '../../../../../../constants'

function action(type) {
  const data = ToolBarHeight.getToolbarHeight(type)
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_SHARE, {
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

export default function(type, title) {
  return {
    key: title,
    title: title,
    action: () => action(type),
    size: 'large',
    image: require('../../../../../../assets/function/icon_function_share.png'),
    getData: ShareData.getData,
    actions: ShareAction,
  }
}
