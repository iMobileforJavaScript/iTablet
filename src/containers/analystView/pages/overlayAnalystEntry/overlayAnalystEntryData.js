import { ConstAnalyst } from '../../../../constants'
import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'
function getData() {
  let data = [
    {
      key: ConstAnalyst.CLIP,
      title: ConstAnalyst.CLIP,
      action: () => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.CLIP,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_clip,
    },
    {
      key: ConstAnalyst.UNION,
      title: ConstAnalyst.UNION,
      action: () => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.UNION,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_union,
    },
    {
      key: ConstAnalyst.ERASE,
      title: ConstAnalyst.ERASE,
      action: () => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.ERASE,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_erase,
    },
    {
      key: ConstAnalyst.INTERSECT,
      title: ConstAnalyst.INTERSECT,
      action: () => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.INTERSECT,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_intersect,
    },
    {
      key: ConstAnalyst.IDENTITY,
      title: ConstAnalyst.IDENTITY,
      action: () => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.IDENTITY,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_identity,
    },
    {
      key: ConstAnalyst.XOR,
      title: ConstAnalyst.XOR,
      action: () => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.XOR,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_xor,
    },
    {
      key: ConstAnalyst.UPDATE,
      title: ConstAnalyst.UPDATE,
      action: () => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.UPDATE,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_update,
    },
  ]
  return data
}
export default {
  getData,
}
