import { SMap, Action, STransportationAnalyst } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../../../constants'
import { AnalystTools } from '../../../../../../utils'
import ToolbarModule from '../ToolbarModule'
// import AnalysisData from './AnalysisData'

function close(type) {
  const _params = ToolbarModule.getParams()
  let action = ToolbarModule.getData().backAction || null
  action && action()
  AnalystTools.clear(type)
  _params.setToolbarVisible(true, ConstToolType.MAP_ANALYSIS, {
    isFullScreen: true,
    height:
      _params.device.orientation === 'LANDSCAPE'
        ? ConstToolType.TOOLBAR_HEIGHT[2]
        : ConstToolType.TOOLBAR_HEIGHT[3],
    column: _params.device.orientation === 'LANDSCAPE' ? 5 : 4,
  })
}

async function analyst(type) {
  const _params = ToolbarModule.getParams()
  if (
    type === ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH ||
    type === ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS ||
    type === ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH
  ) {
    await AnalystTools.clearRoutes(type)
  }
  AnalystTools.analyst(type)
    .then(({ edges }) => {
      if (edges && edges.length > 0) {
        _params.setAnalystParams(null)
        AnalystTools.showMsg(type, true, _params.language)
      } else {
        AnalystTools.showMsg(type, false, _params.language)
      }
    })
    .catch(() => {
      AnalystTools.showMsg(type, false, _params.language)
    })
}

function commit() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(false, '', {
    cb: () => {
      SMap.setAction(Action.PAN)
      STransportationAnalyst.clear()
      GLOBAL.bubblePane && GLOBAL.bubblePane.clear()
    },
  })
}

export default {
  commit,
  close,

  analyst,
}
