/**
 * 分析工具
 */
import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { Analyst_Types } from '../../../analystView/AnalystType'

// let _params = {}
//
// function setParams(params) {
//   _params = params
// }

function getAnalysisData() {
  let buttons = []
  let data = [
    {
      key: getLanguage(global.language).Analyst_Modules.OPTIMAL_PATH,
      title: getLanguage(global.language).Analyst_Modules.OPTIMAL_PATH,
      action: (params = {}) => {
        NavigationService.navigate('LocalAnalystView', {
          ...params,
          type: Analyst_Types.OPTIMAL_PATH,
          // cb: cb,
        })
      },
      size: 'large',
      image: getThemeAssets().analyst.analysis_shortestpath,
    },
    {
      key: getLanguage(global.language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
      title: getLanguage(global.language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('LocalAnalystView', {
          ...params,
          type: Analyst_Types.CONNECTIVITY_ANALYSIS,
        })
      },
      image: getThemeAssets().analyst.analysis_connectivity,
    },
    {
      key: getLanguage(global.language).Analyst_Modules.FIND_TSP_PATH,
      title: getLanguage(global.language).Analyst_Modules.FIND_TSP_PATH,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('LocalAnalystView', {
          ...params,
          type: Analyst_Types.FIND_TSP_PATH,
        })
      },
      image: getThemeAssets().analyst.analysis_traveling,
    },
    {
      key: getLanguage(global.language).Analyst_Modules.BUFFER_ANALYST_SINGLE,
      title: getLanguage(global.language).Analyst_Modules.BUFFER_ANALYST_SINGLE,
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
      key: getLanguage(global.language).Analyst_Modules.BUFFER_ANALYST_MULTIPLE,
      title: getLanguage(global.language).Analyst_Modules
        .BUFFER_ANALYST_MULTIPLE,
      action: (params = {}) => {
        NavigationService.navigate('BufferAnalystView', {
          ...params,
          type: 'multiple',
        })
      },
      size: 'large',
      image: getThemeAssets().analyst.analysis_buffer,
    },
    {
      key: getLanguage(global.language).Analyst_Modules.OVERLAY_ANALYSIS,
      title: getLanguage(global.language).Analyst_Modules.OVERLAY_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('AnalystListEntry', {
          ...params,
          type: Analyst_Types.OVERLAY_ANALYSIS,
          title: getLanguage(global.language).Analyst_Modules.OVERLAY_ANALYSIS,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay,
    },
    {
      key: getLanguage(global.language).Analyst_Modules.THIESSEN_POLYGON,
      title: getLanguage(global.language).Analyst_Modules.THIESSEN_POLYGON,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('ReferenceAnalystView', {
          ...params,
          type: Analyst_Types.THIESSEN_POLYGON,
          title: getLanguage(global.language).Analyst_Modules.THIESSEN_POLYGON,
        })
      },
      image: getThemeAssets().analyst.analysis_thiessen,
    },
    // {
    //   key: getLanguage(global.language).Analyst_Modules.MEASURE_DISTANCE,
    //   title: getLanguage(global.language).Analyst_Modules.MEASURE_DISTANCE,
    //   size: 'large',
    //   action: (params = {}) => {
    //     NavigationService.navigate('ReferenceAnalystView', {
    //       ...params,
    //       type: Analyst_Types.MEASURE_DISTANCE,
    //       title: getLanguage(global.language).Analyst_Modules.MEASURE_DISTANCE,
    //     })
    //   },
    //   image: getThemeAssets().analyst.analysis_measure,
    // },
    {
      key: getLanguage(global.language).Analyst_Modules.ONLINE_ANALYSIS,
      title: getLanguage(global.language).Analyst_Modules.ONLINE_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('AnalystListEntry', {
          ...params,
          type: Analyst_Types.ONLINE_ANALYSIS,
          title: getLanguage(global.language).Analyst_Modules.ONLINE_ANALYSIS,
        })
      },
      image: getThemeAssets().analyst.analysis_online,
    },
  ]
  return { data, buttons }
}

export default {
  // setParams,
  getAnalysisData,
}
