import { ConstAnalyst } from '../../../../constants'
import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'
function getData() {
  let data = [
    {
      key: ConstAnalyst.CLIP,
      title: ConstAnalyst.CLIP,
      action: (cb = () => {}) => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.CLIP,
          cb: cb,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_clip,
    },
    {
      key: ConstAnalyst.UNION,
      title: ConstAnalyst.UNION,
      action: (cb = () => {}) => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.UNION,
          cb: cb,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_union,
    },
    {
      key: ConstAnalyst.ERASE,
      title: ConstAnalyst.ERASE,
      action: (cb = () => {}) => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.ERASE,
          cb: cb,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_erase,
    },
    {
      key: ConstAnalyst.INTERSECT,
      title: ConstAnalyst.INTERSECT,
      action: (cb = () => {}) => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.INTERSECT,
          cb: cb,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_intersect,
    },
    {
      key: ConstAnalyst.IDENTITY,
      title: ConstAnalyst.IDENTITY,
      action: (cb = () => {}) => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.IDENTITY,
          cb: cb,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_identity,
    },
    {
      key: ConstAnalyst.XOR,
      title: ConstAnalyst.XOR,
      action: (cb = () => {}) => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.XOR,
          cb: cb,
        })
      },
      image: getThemeAssets().analyst.analysis_overlay_xor,
    },
    {
      key: ConstAnalyst.UPDATE,
      title: ConstAnalyst.UPDATE,
      action: (cb = () => {}) => {
        NavigationService.navigate('OverlayAnalystView', {
          title: ConstAnalyst.UPDATE,
          cb: cb,
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
