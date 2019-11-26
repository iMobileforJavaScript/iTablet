import Fly3DData from './Fly3DData'
import Fly3DAction from './Fly3DAction'
import ToolbarModule from '../ToolbarModule'
import ToolBarHeight from '../ToolBarHeight'
import { ToolbarType } from '../../../../../../constants'
import { SScene } from 'imobile_for_reactnative'

function action(type) {
  const params = ToolbarModule.getParams()
  const data = ToolBarHeight.getToolbarHeight(type)
  params.showFullMap && params.showFullMap(true)
  SScene.checkoutListener('startMeasure')
  params.setToolbarVisible(true, type, {
    containerType: ToolbarType.list,
    column: data.column,
    height: data.height,
  })
  ToolbarModule.setData({
    type: type,
    getData: Fly3DData.getData,
    actions: Fly3DAction,
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
    image: require('../../../../../../assets/function/Frenchgrey/icon_symbolFly.png'),
    getData: Fly3DData.getData,
    actions: Fly3DAction,
  }
}
