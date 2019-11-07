/**
 * 获取地图分享数据
 */
import { ConstToolType } from '../../../../../../constants'
import constants from '../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ShareAction from './ShareAction'

function getData(type, params) {
  let data = [],
    buttons = []
  ToolbarModule.setParams(params)
  if (type.indexOf('MAP_SHARE') <= -1) return { data, buttons }
  switch (type) {
    case ConstToolType.MAP_SHARE_MAP3D:
      data = [
        {
          key: constants.SUPERMAP_ONLINE,
          title: constants.SUPERMAP_ONLINE,
          action: () => ShareAction.show3DSaveDialog(constants.SUPERMAP_ONLINE),
          size: 'large',
          image: getThemeAssets().share.online,
        },
        {
          key: constants.SUPERMAP_IPORTAL,
          title: constants.SUPERMAP_IPORTAL,
          action: () =>
            ShareAction.show3DSaveDialog(constants.SUPERMAP_IPORTAL),
          size: 'large',
          image: getThemeAssets().share.iportal,
        },
      ]
      break

    default:
      data = [
        // {
        //   key: constants.QQ,
        //   title: constants.QQ,
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_point.png'),
        // },
        // {
        //   key: constants.WECHAT,
        //   title: constants.WECHAT,
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_words.png'),
        // },
        // {
        //   key: constants.WEIBO,
        //   title: constants.WEIBO,
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_point_line.png'),
        // },
        {
          key: constants.SUPERMAP_ONLINE,
          title: constants.SUPERMAP_ONLINE,
          action: () => ShareAction.showSaveDialog(constants.SUPERMAP_ONLINE),
          size: 'large',
          image: getThemeAssets().share.online,
        },
        {
          key: constants.SUPERMAP_IPORTAL,
          title: constants.SUPERMAP_IPORTAL,
          action: () => ShareAction.showSaveDialog(constants.SUPERMAP_IPORTAL),
          size: 'large',
          image: getThemeAssets().share.iportal,
        },
        // {
        //   key: constants.FRIEND,
        //   title: constants.FRIEND,
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_point_cover.png'),
        // },
        // {
        //   key: constants.DISCOVERY,
        //   title: constants.DISCOVERY,
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_free_cover.png'),
        // },
        // {
        //   key: constants.SAVE_AS_IMAGE,
        //   title: constants.SAVE_AS_IMAGE,
        //   action: this.showBox,
        //   size: 'large',
        //   image: require('../../../../assets/mapTools/icon_common_track.png'),
        // },
      ]
      break
  }

  return { data, buttons }
}

export default {
  getData,
}
