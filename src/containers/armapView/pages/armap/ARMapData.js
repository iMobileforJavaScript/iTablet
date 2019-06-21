import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
// import { ARMap_Types } from '../../ARMapType'

function getData(language) {
  let data = [
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
      // action: (params = {}) => {
      //   NavigationService.navigate('AnalystListEntry', {
      //     ...params,
      //     type: ARMap_Types.OVERLAY_ANALYST,
      //     title: getLanguage(language).Analyst_Modules.OVERLAY_ANALYST,
      //   })
      // },
      image: getThemeAssets().analyst.analysis_overlay,
    },
    {
      key: getLanguage(language).Analyst_Modules.ONLINE_ANALYST,
      title: getLanguage(language).Analyst_Modules.ONLINE_ANALYST,
      size: 'large',
      // action: (params = {}) => {
      //   NavigationService.navigate('AnalystListEntry', {
      //     ...params,
      //     type: ARMap_Types.ONLINE_ANALYST,
      //     title: getLanguage(language).Analyst_Modules.ONLINE_ANALYST,
      //   })
      // },
      image: getThemeAssets().analyst.analysis_overlay,
    },
  ]
  return data
}
export default {
  getData,
}
