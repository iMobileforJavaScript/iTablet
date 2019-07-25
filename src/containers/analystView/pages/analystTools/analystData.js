import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { Analyst_Types } from '../../AnalystType'

function getData(language) {
  let data = [
    {
      key: getLanguage(language).Analyst_Modules.OPTIMAL_PATH,
      title: getLanguage(language).Analyst_Modules.OPTIMAL_PATH,
      action: (params = {}) => {
        // NavigationService.navigate('AnalystListEntry', {
        //   ...params,
        //   type: Analyst_Types.OPTIMAL_PATH,
        //   title: getLanguage(language).Analyst_Modules.OPTIMAL_PATH,
        // })
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
      key: getLanguage(language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
      title: getLanguage(language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        // NavigationService.navigate('AnalystListEntry', {
        //   ...params,
        //   type: Analyst_Types.CONNECTIVITY_ANALYSIS,
        //   title: getLanguage(language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
        // })
        NavigationService.navigate('LocalAnalystView', {
          ...params,
          type: Analyst_Types.CONNECTIVITY_ANALYSIS,
          // cb: cb,
        })
      },
      image: getThemeAssets().analyst.analysis_connectivity,
    },
    {
      key: getLanguage(language).Analyst_Modules.FIND_TSP_PATH,
      title: getLanguage(language).Analyst_Modules.FIND_TSP_PATH,
      size: 'large',
      action: (params = {}) => {
        // NavigationService.navigate('AnalystListEntry', {
        //   ...params,
        //   type: Analyst_Types.FIND_TSP_PATH,
        //   title: getLanguage(language).Analyst_Modules.FIND_TSP_PATH,
        // })
        NavigationService.navigate('LocalAnalystView', {
          ...params,
          type: Analyst_Types.FIND_TSP_PATH,
          // cb: cb,
        })
      },
      image: getThemeAssets().analyst.analysis_traveling,
    },
    {
      key: getLanguage(language).Analyst_Modules.BUFFER_ANALYST,
      title: getLanguage(language).Analyst_Modules.BUFFER_ANALYST,
      action: (params = {}) => {
        NavigationService.navigate('BufferAnalystView', params)
      },
      size: 'large',
      image: getThemeAssets().analyst.analysis_buffer,
    },
    {
      key: getLanguage(language).Analyst_Modules.OVERLAY_ANALYST,
      title: getLanguage(language).Analyst_Modules.OVERLAY_ANALYST,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('AnalystListEntry', {
          ...params,
          type: Analyst_Types.OVERLAY_ANALYST,
          title: getLanguage(language).Analyst_Modules.OVERLAY_ANALYST,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay,
    },
    {
      key: getLanguage(language).Analyst_Modules.ONLINE_ANALYST,
      title: getLanguage(language).Analyst_Modules.ONLINE_ANALYST,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('AnalystListEntry', {
          ...params,
          type: Analyst_Types.ONLINE_ANALYST,
          title: getLanguage(language).Analyst_Modules.ONLINE_ANALYST,
        })
      },
      image: getThemeAssets().analyst.analysis_online,
    },
  ]
  return data
}
export default {
  getData,
}
