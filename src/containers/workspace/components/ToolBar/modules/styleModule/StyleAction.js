import {
  ConstToolType,
  TouchType,
  ToolbarType,
  Const,
} from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import constants from '../../../../constants'
import { SCartography, SMap } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import Utils from '../../utils'

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
    )
  }
  ToolbarModule.setData()
  _params.setToolbarVisible(false, {
    isTouchProgress: false,
    showMenuDialog: false,
    selectKey: '',
  })
}

async function tableAction(params) {
  switch (params.type) {
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
    case ConstToolType.REGIONBORDERCOLOR_SET:
      SCartography.setFillBorderColor(params.key, params.layerName)
      break
  }
}

function layerListAction(data) {
  const _params = ToolbarModule.getParams()
  let orientation = _params.device.orientation
  SMap.setLayerEditable(data.path, true)
  if (data.type === 83) {
    _params.setToolbarVisible(true, ConstToolType.GRID_STYLE, {
      containerType: ToolbarType.list,
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    _params.showFullMap(true)
    _params.navigation.navigate('MapView')
  } else if (data.type === 1 || data.type === 3 || data.type === 5) {
    _params.setToolbarVisible(true, ConstToolType.MAP_STYLE, {
      containerType: ToolbarType.symbol,
      isFullScreen: false,
      column: orientation === 'PORTRAIT' ? 4 : 8,
      height:
        orientation === 'PORTRAIT'
          ? ConstToolType.THEME_HEIGHT[3]
          : ConstToolType.TOOLBAR_HEIGHT_2[3],
    })
    _params.showFullMap(true)
    _params.navigation.navigate('MapView')
  } else {
    Toast.show(
      getLanguage(_params.language).Prompt.THE_CURRENT_LAYER_CANNOT_BE_STYLED,
    )
    //'当前图层无法设置风格')
  }
}

function menu(type, selectKey, params = {}) {
  const _params = ToolbarModule.getParams()
  let isFullScreen, showMenuDialog, isTouchProgress
  let isBoxShow = GLOBAL.ToolBar && GLOBAL.ToolBar.getBoxShow()
  let showBox = function() {
    if (
      GLOBAL.Type === constants.MAP_EDIT ||
      type === ConstToolType.GRID_STYLE ||
      type === ConstToolType.MAP_STYLE ||
      type === ConstToolType.MAP_EDIT_STYLE ||
      type === ConstToolType.MAP_EDIT_MORE_STYLE ||
      ((type === ConstToolType.LINECOLOR_SET ||
        type === ConstToolType.POINTCOLOR_SET ||
        type === ConstToolType.REGIONBEFORECOLOR_SET ||
        type === ConstToolType.REGIONAFTERCOLOR_SET ||
        type === ConstToolType.REGIONBORDERCOLOR_SET ||
        type === ConstToolType.LEGEND ||
        type === ConstToolType.LEGEND_NOT_VISIBLE) &&
        isBoxShow)
    ) {
      params.showBox && params.showBox()
    }
  }.bind(this)

  let setData = function() {
    let buttons
    if (
      GLOBAL.Type === constants.MAP_EDIT ||
      type === ConstToolType.GRID_STYLE ||
      type === ConstToolType.MAP_STYLE ||
      type === ConstToolType.MAP_EDIT_STYLE ||
      type === ConstToolType.MAP_EDIT_MORE_STYLE ||
      type === ConstToolType.LINECOLOR_SET ||
      type === ConstToolType.POINTCOLOR_SET ||
      type === ConstToolType.REGIONBEFORECOLOR_SET ||
      type === ConstToolType.REGIONAFTERCOLOR_SET ||
      type === ConstToolType.REGIONBORDERCOLOR_SET ||
      type === ConstToolType.LEGEND ||
      type === ConstToolType.LEGEND_NOT_VISIBLE
    ) {
      if (type.indexOf('LEGEND') >= 0) {
        if (_params.mapLegend[GLOBAL.Type].isShow) {
          buttons = [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.NOT_VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ]
        } else {
          buttons = [
            ToolbarBtnType.CANCEL,
            ToolbarBtnType.VISIBLE,
            ToolbarBtnType.MENU,
            ToolbarBtnType.MENU_FLEX,
            ToolbarBtnType.TOOLBAR_COMMIT,
          ]
        }
      } else {
        buttons = [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.MENU,
          ToolbarBtnType.MENU_FLEX,
          ToolbarBtnType.TOOLBAR_COMMIT,
        ]
      }
    }
    params.setData &&
      params.setData({
        isFullScreen,
        showMenuDialog,
        isTouchProgress,
        buttons,
      })
  }.bind(this)

  if (Utils.isTouchProgress(selectKey)) {
    isFullScreen = true
    showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
    isTouchProgress = GLOBAL.ToolBar.state.showMenuDialog
    setData()
  } else {
    isFullScreen = !GLOBAL.ToolBar.state.showMenuDialog
    showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
    isTouchProgress = false
    if (!GLOBAL.ToolBar.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }
}

export default {
  commit,
  close,
  tableAction,
  layerListAction,
  menu,
}
