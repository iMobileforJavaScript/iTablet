import PlotData from './PlotData'
import PlotAction from './PlotAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import ToolBarHeight from '../ToolBarHeight'
import { SMap, Action } from 'imobile_for_reactnative'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language/index'

export async function action(type) {
  const data = ToolBarHeight.getToolbarHeight(type)
  const params = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.PLOTTING:
      if (!GLOBAL.isInitSymbolPlotsEnd) {
        Toast.show(getLanguage(GLOBAL.language).Prompt.MAP_LOADING)
        return
      }
      params.showFullMap && params.showFullMap(true)
      params.setToolbarVisible(true, ConstToolType.MAP_SYMBOL, {
        isFullScreen: true,
        column: data.column,
        height: data.height,
      })
      break
    case ConstToolType.PLOTTING_ANIMATION:
      params.showFullMap && params.showFullMap(true)
      params.setToolbarVisible(true, ConstToolType.PLOT_ANIMATION_START, {
        isFullScreen: false,
        height: 0,
        cb: () => SMap.setAction(Action.SELECT),
      })
      break
  }
  ToolbarModule.setData({
    type: type,
    getData: PlotData.getData,
    actions: PlotAction,
  })
}

export default function(type, title, customAction) {
  let image
  if (type === ConstToolType.PLOTTING_ANIMATION) {
    image = require('../../../../../../assets/function/icon_function_theme_param.png')
  } else {
    image = require('../../../../../../assets/function/icon_function_symbol.png')
  }
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
    image: image,
    getData: PlotData.getData,
    actions: PlotAction,
  }
}
