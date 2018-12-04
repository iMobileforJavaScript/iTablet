/**
 * 获取地图分享数据
 */
import { Utility, SOnlineService } from 'imobile_for_reactnative'
import { ConstToolType, ConstPath } from '../../../../constants'
import { Toast } from '../../../../utils'
import constants from '../../constants'

let _params = {}
let isSharing = false

function getShareData(type, params) {
  let data = [],
    buttons = []
  _params = params
  if (type !== ConstToolType.MAP_SHARE) return { data, buttons }
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
      action: shareToSuperMapOnline,
      size: 'large',
      image: require('../../../../assets/mapTools/icon_free_line.png'),
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
  return { data, buttons }
}

/**
 * 分享到SuperMap Online
 */
async function shareToSuperMapOnline() {
  try {
    if (!_params.user.currentUser.userName) {
      Toast.show('请登陆后再分享')
      return
    }
    if (isSharing) {
      Toast.show('分享中，请稍后')
      return
    }
    const dataName = 'Customer'
    const customerPath = ConstPath.CustomerPath + ConstPath.RelativePath.Data
    const targetPath = await Utility.appendingHomeDirectory(
      ConstPath.CustomerPath + 'Customer.zip',
    )
    let dataPath = await Utility.appendingHomeDirectory(customerPath)
    let zipResult = await Utility.zipFiles([dataPath], targetPath)
    let uploadResult = false
    if (zipResult) {
      isSharing = true
      uploadResult = await SOnlineService.uploadFile(targetPath, dataName, {
        // onProgress: progress => {
        //   console.warn(progress)
        // },
        onResult: async () => {
          let result = await SOnlineService.publishService(dataName)
          isSharing = false
          Toast.show(result ? '分享成功' : '分享成功')
        },
      })
    }
    return uploadResult
  } catch (e) {
    isSharing = false
    return false
  }
}

export default {
  getShareData,
}
