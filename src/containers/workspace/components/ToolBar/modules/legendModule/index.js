import LegendData from './LegendData'
import LegendAction from './LegendAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ToolbarType } from '../../../../../../constants'

async function action(type) {
  const _params = ToolbarModule.getParams()
  let mapLegend = _params.mapLegend
  if (mapLegend[GLOBAL.Type].isShow) {
    mapLegend[GLOBAL.Type] = {
      isShow: true,
      backgroundColor: mapLegend[GLOBAL.Type].backgroundColor,
      column: mapLegend[GLOBAL.Type].column,
      widthPercent: mapLegend[GLOBAL.Type].widthPercent,
      heightPercent: mapLegend[GLOBAL.Type].heightPercent,
      fontPercent: mapLegend[GLOBAL.Type].fontPercent,
      imagePercent: mapLegend[GLOBAL.Type].imagePercent,
      legendPosition: mapLegend[GLOBAL.Type].legendPosition,
    }
  } else {
    mapLegend[GLOBAL.Type] = {
      isShow: true,
      backgroundColor: 'white',
      column: 2,
      widthPercent: 80,
      heightPercent: 80,
      fontPercent: 50,
      imagePercent: 50,
      legendPosition: 'topLeft',
    }
  }
  _params.setMapLegend(mapLegend)
  _params.setToolbarVisible(true, ConstToolType.LEGEND, {
    containerType: ToolbarType.colorTable,
    column: _params.device.orientation === 'LANDSCAPE' ? 16 : 8,
    isFullScreen: false,
    height:
      _params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.THEME_HEIGHT[2]
        : ConstToolType.THEME_HEIGHT[3],
  })
  _params.showFullMap && _params.showFullMap(true)
  _params.navigation.navigate('MapView')
  ToolbarModule.setData({
    type: type,
    getData: LegendData.getData,
    getMenuData: LegendData.getMenuData,
    actions: LegendAction,
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
    image: require('../../../../../../assets/Navigation/navi_icon.png'),
    getData: LegendData.getData,
    getMenuData: LegendData.getMenuData,
    actions: LegendAction,
  }
}
