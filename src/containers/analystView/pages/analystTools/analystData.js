import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { ConstToolType } from '../../../../constants'
// import { Analyst_Types } from '../../AnalystType'

function getData(language) {
  let data = [
    {
      key: getLanguage(language).Analyst_Modules.OPTIMAL_PATH,
      title: getLanguage(language).Analyst_Modules.OPTIMAL_PATH,
      action: (params = {}) => {
        // NavigationService.navigate('AnalystListEntry', {
        //   ...params,
        //   type: ConstToolType.MAP_ANALYSIS_OPTIMAL_PATH,
        //   title: getLanguage(language).Analyst_Modules.OPTIMAL_PATH,
        // })
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
      key: getLanguage(language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
      title: getLanguage(language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        // NavigationService.navigate('AnalystListEntry', {
        //   ...params,
        //   type: ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS,
        //   title: getLanguage(language).Analyst_Modules.CONNECTIVITY_ANALYSIS,
        // })
        NavigationService.navigate('LocalAnalystView', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_CONNECTIVITY_ANALYSIS,
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
        //   type: ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH,
        //   title: getLanguage(language).Analyst_Modules.FIND_TSP_PATH,
        // })
        NavigationService.navigate('LocalAnalystView', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_FIND_TSP_PATH,
          // cb: cb,
        })
      },
      image: getThemeAssets().analyst.analysis_traveling,
    },
    {
      key: getLanguage(language).Analyst_Modules.BUFFER_ANALYST_SINGLE,
      title: getLanguage(language).Analyst_Modules.BUFFER_ANALYST_SINGLE,
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
      key: getLanguage(language).Analyst_Modules.BUFFER_ANALYST_MULTIPLE,
      title: getLanguage(language).Analyst_Modules.BUFFER_ANALYST_MULTIPLE,
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
      key: getLanguage(language).Analyst_Modules.OVERLAY_ANALYSIS,
      title: getLanguage(language).Analyst_Modules.OVERLAY_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('AnalystListEntry', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_OVERLAY_ANALYSIS,
          title: getLanguage(language).Analyst_Modules.OVERLAY_ANALYSIS,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay,
    },
    {
      key: getLanguage(language).Analyst_Modules.ONLINE_ANALYSIS,
      title: getLanguage(language).Analyst_Modules.ONLINE_ANALYSIS,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('AnalystListEntry', {
          ...params,
          type: ConstToolType.MAP_ANALYSIS_ONLINE_ANALYSIS,
          title: getLanguage(language).Analyst_Modules.ONLINE_ANALYSIS,
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
