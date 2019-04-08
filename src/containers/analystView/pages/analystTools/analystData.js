import { ConstAnalyst } from '../../../../constants'
import { getThemeAssets } from '../../../../assets'
function getData() {
  let data = [
    {
      key: ConstAnalyst.BUFFER_ANALYST,
      title: ConstAnalyst.BUFFER_ANALYST,
      action: () => {},
      size: 'large',
      image: getThemeAssets().analyst.analysis_buffer,
    },
    {
      key: ConstAnalyst.OVERLAY_ANALYST,
      title: ConstAnalyst.OVERLAY_ANALYST,
      size: 'large',
      action: () => {},
      image: getThemeAssets().analyst.analysis_overlay,
    },
  ]
  return data
}
export default {
  getData,
}
