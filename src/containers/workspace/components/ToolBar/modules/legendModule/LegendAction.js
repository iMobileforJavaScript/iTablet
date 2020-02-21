import { ConstToolType, Const } from '../../../../../../constants'
import Utils from '../../utils'
import ToolbarModule from '../ToolbarModule'
import LegendData from './LegendData'

//改变图例组件的显隐
function changeLegendVisible() {
  const _params = ToolbarModule.getParams()
  let legendData = _params.mapLegend
  let type = legendData[GLOBAL.Type].isShow
    ? ConstToolType.LEGEND_NOT_VISIBLE
    : ConstToolType.LEGEND
  let { data, buttons } = LegendData.getData(type)
  GLOBAL.ToolBar &&
    GLOBAL.ToolBar.setState({
      type,
      data,
      buttons,
    })
  legendData[GLOBAL.Type].isShow = type === ConstToolType.LEGEND
  _params.setMapLegend && _params.setMapLegend(legendData)
}

function commit() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false)
}

function close() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false)
}

function menu(type, selectKey, params = {}) {
  const _params = ToolbarModule.getParams()
  let isFullScreen, showMenuDialog, isTouchProgress
  let isBoxShow = GLOBAL.ToolBar && GLOBAL.ToolBar.getBoxShow()
  let showBox = function() {
    if (
      (type === ConstToolType.LEGEND ||
        type === ConstToolType.LEGEND_NOT_VISIBLE) &&
      isBoxShow
    ) {
      params.showBox && params.showBox()
    }
  }

  let setData = function() {
    let buttons = LegendData.getButtons(type)
    params.setData &&
      params.setData({
        isFullScreen,
        showMenuDialog,
        isTouchProgress,
        buttons,
      })
  }

  if (Utils.isTouchProgress(_params.language)) {
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

function tableAction(item = {}) {
  const _params = ToolbarModule.getParams()
  let legendData = _params.mapLegend
  legendData[GLOBAL.Type].backgroundColor = item.background
  _params.setMapLegend && _params.setMapLegend(legendData)
}

function cancelSelect() {
  const _params = ToolbarModule.getParams()

  let legendData = _params.mapLegend
  let type = legendData[GLOBAL.Type].isShow
    ? ConstToolType.LEGEND
    : ConstToolType.LEGEND_NOT_VISIBLE
  let isFullScreen, showMenuDialog, isTouchProgress
  let { data, buttons } = LegendData.getData(type)
  let setData = function() {
    GLOBAL.ToolBar &&
      GLOBAL.ToolBar.setState(
        {
          type,
          data,
          isFullScreen,
          showMenuDialog,
          isTouchProgress,
          buttons,
        },
        () => {
          GLOBAL.ToolBar.updateOverlayView()
        },
      )
  }
  isFullScreen = !GLOBAL.ToolBar.state.showMenuDialog
  showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
  isTouchProgress = false
  // 先滑出box，再显示Menu
  GLOBAL.ToolBar && GLOBAL.ToolBar.showBox()
  setTimeout(setData, Const.ANIMATED_DURATION_2)
}
function changePosition(params) {
  const _params = ToolbarModule.getParams()
  let legendData = { ..._params.mapLegend }
  legendData[GLOBAL.Type].legendPosition =
    params[0].selectedItem && params[0].selectedItem.value
  _params.setMapLegend(legendData)
}
export default {
  commit,
  close,
  menu,
  tableAction,

  cancelSelect,
  changePosition,
  changeLegendVisible,
}
