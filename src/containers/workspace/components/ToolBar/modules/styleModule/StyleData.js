import { SCartography } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import StyleData from './StyleData'
import * as StyleAction from './StyleAction'
import { ConstToolType } from '../../../../../../constants'
import ToolbarBtnType from '../../ToolbarBtnType'
import { line, point, region, grid, colors, colorsWithNull } from './data'

function getData(type, params) {
  let data = []
  switch (type) {
    case ConstToolType.MAP_STYLE:
    case ConstToolType.GRID_STYLE:
      if (
        ToolbarModule.getParams().currentLayer &&
        !ToolbarModule.getData().currentLayerStyle
      ) {
        SCartography.getLayerStyle(
          ToolbarModule.getParams().currentLayer.name,
        ).then(value => {
          ToolbarModule.addData({
            type: type,
            getData: StyleData.getData,
            actions: StyleAction.default,
            currentLayerStyle: value,
          })
        })
      }
      break
    case ConstToolType.POINTCOLOR_SET:
      data = colors
      break
    case ConstToolType.LINECOLOR_SET:
    case ConstToolType.REGIONBEFORECOLOR_SET:
    case ConstToolType.REGIONAFTERCOLOR_SET:
    case ConstToolType.REGIONBORDERCOLOR_SET:
      data = colorsWithNull
      break
  }
  ToolbarModule.setParams(params)
  let buttons = [
    ToolbarBtnType.CANCEL,
    ToolbarBtnType.MENU,
    ToolbarBtnType.MENU_FLEX,
    ToolbarBtnType.TOOLBAR_COMMIT,
  ]
  return { data, buttons }
}

function getMenuData() {
  const _params = ToolbarModule.getParams()
  let data = []
  if (_params.currentLayer) {
    switch (_params.currentLayer.type) {
      case 1:
        data = point(_params.language, _params.device.orientation)
        break
      case 3:
        data = line(_params.language, _params.device.orientation)
        break
      case 5:
        data = region(_params.language, _params.device.orientation)
        break
      case 83:
        data = grid(_params.language)
        break
    }
  }
  return data
}

export default {
  getData,
  getMenuData,
}
