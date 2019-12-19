/**
 * 分析工具
 */
import { getThemeAssets } from '../../../../../../assets'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import { ConstToolType, TouchType } from '../../../../../../constants'
import ToolbarModule from '../ToolbarModule'
import AnalysisAction from './AnalysisAction'
import ToolbarBtnType from '../../ToolbarBtnType'
// import { Analyst_Types } from '../../../../../analystView/AnalystType'
import { STransportationAnalyst } from 'imobile_for_reactnative'

function getData(type) {
  let buttons, data
  let temp = { buttons: [], data: [] }
  switch (type) {
    case ConstToolType.MAP_ANALYSIS:
      temp = getToolData()
      break
    case ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH:
      temp = getOptimalPathData()
      break
    case ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS:
      temp = getConnectivityData()
      break
    case ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH:
      temp = getTSPData()
      break
  }
  data = temp.data
  buttons = temp.buttons
  return { data, buttons }
}

/** 工具栏数据 **/
function getToolData() {
  const _params = ToolbarModule.getParams()
  let buttons = []
  let data = [
    {
      key: getLanguage(_params.language).Analyst_Modules.OPTIMAL_PATH,
      title: getLanguage(_params.language).Analyst_Modules.OPTIMAL_PATH,
      action: (params = {}) => {
        NavigationService.navigate('LocalAnalystView', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH,
          // cb: cb,
        })
      },
      size: 'large',
      image: getThemeAssets().analyst.analysis_shortestpath,
    },
    {
      key: getLanguage(_params.language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
      title: getLanguage(_params.language).Analyst_Modules
        .CONNECTIVITY_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('LocalAnalystView', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS,
        })
      },
      image: getThemeAssets().analyst.analysis_connectivity,
    },
    {
      key: getLanguage(_params.language).Analyst_Modules.FIND_TSP_PATH,
      title: getLanguage(_params.language).Analyst_Modules.FIND_TSP_PATH,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('LocalAnalystView', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH,
        })
      },
      image: getThemeAssets().analyst.analysis_traveling,
    },
    {
      key: getLanguage(_params.language).Analyst_Modules.BUFFER_ANALYST_SINGLE,
      title: getLanguage(_params.language).Analyst_Modules
        .BUFFER_ANALYST_SINGLE,
      action: (params = {}) => {
        NavigationService.navigate('BufferAnalystView', {
          ...params,
          type: 'single',
        })
      },
      size: 'large',
      image: getThemeAssets().analyst.analysis_buffer,
    },
    {
      key: getLanguage(_params.language).Analyst_Modules
        .BUFFER_ANALYST_MULTIPLE,
      title: getLanguage(_params.language).Analyst_Modules
        .BUFFER_ANALYST_MULTIPLE,
      action: (params = {}) => {
        NavigationService.navigate('BufferAnalystView', {
          ...params,
          type: 'multiple',
        })
      },
      size: 'large',
      image: getThemeAssets().analyst.analysis_multibuffer,
    },
    {
      key: getLanguage(_params.language).Analyst_Modules.OVERLAY_ANALYSIS,
      title: getLanguage(_params.language).Analyst_Modules.OVERLAY_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('AnalystListEntry', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_OVERLAY_ANALYSIS,
          title: getLanguage(_params.language).Analyst_Modules.OVERLAY_ANALYSIS,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay,
    },
    {
      key: getLanguage(_params.language).Analyst_Modules.THIESSEN_POLYGON,
      title: getLanguage(_params.language).Analyst_Modules.THIESSEN_POLYGON,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('ReferenceAnalystView', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_THIESSEN_POLYGON,
          title: getLanguage(_params.language).Analyst_Modules.THIESSEN_POLYGON,
        })
      },
      image: getThemeAssets().analyst.analysis_thiessen,
    },
    // {
    //   key: getLanguage(_params.language).Analyst_Modules.MEASURE_DISTANCE,
    //   title: getLanguage(_params.language).Analyst_Modules.MEASURE_DISTANCE,
    //   size: 'large',
    //   action: (params = {}) => {
    //     NavigationService.navigate('ReferenceAnalystView', {
    //       ...params,
    //       type: ConstToolType.MEASURE_DISTANCE,
    //       title: getLanguage(_params.language).Analyst_Modules.MEASURE_DISTANCE,
    //     })
    //   },
    //   image: getThemeAssets().analyst.analysis_measure,
    // },
    {
      key: getLanguage(_params.language).Analyst_Modules.INTERPOLATION_ANALYSIS,
      title: getLanguage(_params.language).Analyst_Modules
        .INTERPOLATION_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('InterpolationAnalystView', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_INTERPOLATION_ANALYSIS,
          title: getLanguage(_params.language).Analyst_Modules
            .INTERPOLATION_ANALYSIS,
        })
      },
      image: getThemeAssets().analyst.analysis_interpolation,
    },
    {
      key: getLanguage(_params.language).Analyst_Modules.ONLINE_ANALYSIS,
      title: getLanguage(_params.language).Analyst_Modules.ONLINE_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('AnalystListEntry', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_ONLINE_ANALYSIS,
          title: getLanguage(_params.language).Analyst_Modules.ONLINE_ANALYSIS,
        })
      },
      image: getThemeAssets().analyst.analysis_online,
    },
  ]
  return { data, buttons }
}

/** 路径分析数据 **/
function getOptimalPathData() {
  const _params = ToolbarModule.getParams()
  let buttons = [
    ToolbarBtnType.CANCEL,
    {
      type: ToolbarBtnType.ANALYST,
      image: getThemeAssets().analyst.analysis_analyst,
      action: () =>
        AnalysisAction.analyst(ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH),
    },
    ToolbarBtnType.TOOLBAR_DONE,
  ]
  let data = [
    {
      key: getLanguage(_params.language).Analyst_Labels.ADD_STATIONS,
      title: getLanguage(_params.language).Analyst_Labels.ADD_STATIONS,
      action: () => (GLOBAL.TouchType = TouchType.ADD_STATIONS),
      size: 'large',
      image: getThemeAssets().analyst.analysis_stop,
    },
    {
      key: getLanguage(_params.language).Analyst_Labels.ADD_BARRIER_NODES,
      title: getLanguage(_params.language).Analyst_Labels.ADD_BARRIER_NODES,
      action: () => (GLOBAL.TouchType = TouchType.ADD_BARRIER_NODES),
      size: 'large',
      image: getThemeAssets().analyst.analysis_barrier,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.COLLECTION_UNDO,
      title: getLanguage(_params.language).Map_Main_Menu.COLLECTION_UNDO,
      action: () => STransportationAnalyst.undo(),
      size: 'large',
      image: getThemeAssets().publicAssets.icon_undo,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.COLLECTION_REDO,
      title: getLanguage(_params.language).Map_Main_Menu.COLLECTION_REDO,
      action: () => STransportationAnalyst.redo(),
      size: 'large',
      image: getThemeAssets().publicAssets.icon_redo,
    },
    {
      key: getLanguage(_params.language).Analyst_Labels.CLEAR,
      title: getLanguage(_params.language).Analyst_Labels.CLEAR,
      action: () => {
        STransportationAnalyst.clear()
        GLOBAL.bubblePane && GLOBAL.bubblePane.clear()
      },
      size: 'large',
      image: require('../../../../../../assets/mapEdit/Frenchgrey/icon_clear.png'),
    },
  ]
  return { data, buttons }
}

/** 连通性分析数据 **/
function getConnectivityData() {
  const _params = ToolbarModule.getParams()
  let buttons = [
    ToolbarBtnType.CANCEL,
    {
      type: ToolbarBtnType.ANALYST,
      image: getThemeAssets().analyst.analysis_analyst,
      action: () =>
        AnalysisAction.analyst(
          ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS,
        ),
    },
    ToolbarBtnType.TOOLBAR_DONE,
  ]
  let data = [
    {
      key: getLanguage(_params.language).Analyst_Labels.SET_AS_START_STATION,
      title: getLanguage(_params.language).Analyst_Labels.SET_AS_START_STATION,
      action: () => (GLOBAL.TouchType = TouchType.SET_AS_START_STATION),
      size: 'large',
      image: getThemeAssets().analyst.analysis_startpoint,
    },
    {
      key: getLanguage(_params.language).Analyst_Labels.SET_AS_END_STATION,
      title: getLanguage(_params.language).Analyst_Labels.SET_AS_END_STATION,
      action: () => (GLOBAL.TouchType = TouchType.SET_AS_END_STATION),
      size: 'large',
      image: getThemeAssets().analyst.analysis_endpoint,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.COLLECTION_UNDO,
      title: getLanguage(_params.language).Map_Main_Menu.COLLECTION_UNDO,
      action: () => STransportationAnalyst.undo(),
      size: 'large',
      image: getThemeAssets().publicAssets.icon_undo,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.COLLECTION_REDO,
      title: getLanguage(_params.language).Map_Main_Menu.COLLECTION_REDO,
      action: () => STransportationAnalyst.redo(),
      size: 'large',
      image: getThemeAssets().publicAssets.icon_redo,
    },
    {
      key: getLanguage(_params.language).Analyst_Labels.CLEAR,
      title: getLanguage(_params.language).Analyst_Labels.CLEAR,
      action: () => {
        STransportationAnalyst.clear()
        GLOBAL.bubblePane && GLOBAL.bubblePane.clear()
      },
      size: 'large',
      image: require('../../../../../../assets/mapEdit/Frenchgrey/icon_clear.png'),
    },
  ]
  return { data, buttons }
}

/** 商旅分析数据 **/
function getTSPData() {
  const _params = ToolbarModule.getParams()
  let buttons = [
    ToolbarBtnType.CANCEL,
    {
      type: ToolbarBtnType.ANALYST,
      image: getThemeAssets().analyst.analysis_analyst,
      action: () =>
        AnalysisAction.analyst(ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH),
    },
    ToolbarBtnType.TOOLBAR_DONE,
  ]
  let data = [
    {
      key: getLanguage(_params.language).Analyst_Labels.ADD_STATIONS,
      title: getLanguage(_params.language).Analyst_Labels.ADD_STATIONS,
      action: () => (GLOBAL.TouchType = TouchType.ADD_STATIONS),
      size: 'large',
      image: getThemeAssets().analyst.analysis_stop,
    },
    {
      key: getLanguage(_params.language).Analyst_Labels.ADD_BARRIER_NODES,
      title: getLanguage(_params.language).Analyst_Labels.ADD_BARRIER_NODES,
      action: () => (GLOBAL.TouchType = TouchType.ADD_BARRIER_NODES),
      size: 'large',
      image: getThemeAssets().analyst.analysis_barrier,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.COLLECTION_UNDO,
      title: getLanguage(_params.language).Map_Main_Menu.COLLECTION_UNDO,
      action: () => STransportationAnalyst.undo(),
      size: 'large',
      image: getThemeAssets().publicAssets.icon_undo,
    },
    {
      key: getLanguage(_params.language).Map_Main_Menu.COLLECTION_REDO,
      title: getLanguage(_params.language).Map_Main_Menu.COLLECTION_REDO,
      action: () => STransportationAnalyst.redo(),
      size: 'large',
      image: getThemeAssets().publicAssets.icon_redo,
    },
    {
      key: getLanguage(_params.language).Analyst_Labels.CLEAR,
      title: getLanguage(_params.language).Analyst_Labels.CLEAR,
      action: () => {
        STransportationAnalyst.clear()
        GLOBAL.bubblePane && GLOBAL.bubblePane.clear()
      },
      size: 'large',
      image: require('../../../../../../assets/mapEdit/Frenchgrey/icon_clear.png'),
    },
  ]
  return { data, buttons }
}

export default {
  getData,
}
