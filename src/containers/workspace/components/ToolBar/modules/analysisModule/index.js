import AnalysisData from './AnalysisData'
import AnalysisAction from './AnalysisAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'

export async function action(type) {
  const _data = await AnalysisData.getData(type)
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_ANALYSIS, {
    isFullScreen: false,
    height:
      params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.TOOLBAR_HEIGHT[2]
        : ConstToolType.TOOLBAR_HEIGHT[3],
    column: params.device.orientation === 'LANDSCAPE' ? 5 : 4,
  })
  let data = {
    type: ConstToolType.MAP_ANALYSIS,
    getData: AnalysisData.getData,
    data: _data,
    actions: AnalysisAction,
  }
  ToolbarModule.setData(data)
}

export default function(type, title) {
  return {
    key: title,
    title: title,
    action: () => action(type),
    size: 'large',
    image: getThemeAssets().functionBar.rightbar_analysis,
    getData: AnalysisData.getData,
    // actions: AnalysisAction,
  }
}
