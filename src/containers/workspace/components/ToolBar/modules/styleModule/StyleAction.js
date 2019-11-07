import { ConstToolType, TouchType } from '../../../../../../constants'
import constants from '../../../../constants'
import { SCartography } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'

async function commit() {
  const _params = ToolbarModule.getParams()

  if (GLOBAL.Type === constants.MAP_EDIT) {
    GLOBAL.showMenu = true
  }

  ToolbarModule.setData()

  _params.setToolbarVisible(false, {
    isTouchProgress: false,
    showMenuDialog: false,
    selectKey: '',
  })
  GLOBAL.TouchType = TouchType.NORMAL
}

async function close() {
  const _params = ToolbarModule.getParams()

  const _data = ToolbarModule.getData()
  if (_data.currentLayerStyle) {
    await SCartography.setLayerStyle(
      _params.currentLayer.name,
      _data.currentLayerStyle,
    ).then(() => {
      ToolbarModule.setData()
    })
  }
  _params.setToolbarVisible(false, {
    isTouchProgress: false,
    showMenuDialog: false,
    selectKey: '',
  })
}

async function listAction(type, params = {}) {
  switch (type) {
    case ConstToolType.LINECOLOR_SET:
      SCartography.setLineColor(params.key, params.layerName)
      break
    case ConstToolType.POINTCOLOR_SET:
      SCartography.setMarkerColor(params.key, params.layerName)
      break
    case ConstToolType.REGIONBEFORECOLOR_SET:
      SCartography.setFillForeColor(params.key, params.layerName)
      break
    case ConstToolType.REGIONAFTERCOLOR_SET:
      SCartography.setFillBackColor(params.key, params.layerName)
      break
  }
}

export default {
  commit,
  close,
  listAction,
}
