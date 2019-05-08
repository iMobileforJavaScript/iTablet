import { ConstAnalyst } from '../../../../constants'
import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'
function getData() {
  let data = [
    {
      key: ConstAnalyst.BUFFER_ANALYST,
      title: ConstAnalyst.BUFFER_ANALYST,
      action: (params = {}) => {
        NavigationService.navigate('BufferAnalystView', params)
      },
      size: 'large',
      image: getThemeAssets().analyst.analysis_buffer,
    },
    {
      key: ConstAnalyst.OVERLAY_ANALYST,
      title: ConstAnalyst.OVERLAY_ANALYST,
      size: 'large',
      action: (params = {}) => {
        NavigationService.navigate('OverlayAnalystEntry', params)
      },
      image: getThemeAssets().analyst.analysis_overlay,
    },
  ]
  return data
}
export default {
  getData,
}
