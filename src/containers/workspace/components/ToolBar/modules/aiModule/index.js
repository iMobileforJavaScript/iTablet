import AiData from './AiData'
import AiActions from './AiActions'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'

export async function action(type) {
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_AR_AIASSISTANT, {
    containerType: 'table',
    isFullScreen: true,
    height:
      params.device.orientation === 'LANDSCAPE' || ConstToolType.HEIGHT[2],
    column: params.device.orientation === 'LANDSCAPE' ? 5 : 4,
  })
  ToolbarModule.setData({
    type: type,
    getData: AiData.getData,
    actions: AiActions,
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
    image: getThemeAssets().ar.icon_ai_assistant,
    getData: AiData.getData,
    // actions: AnalysisAction,
  }
}
