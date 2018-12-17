/**
 * 获取地图分享数据
 */
import { SMap, Utility, SOnlineService, SScene } from 'imobile_for_reactnative'
import { ConstToolType, ConstPath } from '../../../../constants'
import { Toast } from '../../../../utils'
import constants from '../../constants'
import ToolbarBtnType from './ToolbarBtnType'

let _params = {}
let isSharing = false

function getShareData(type, params) {
  let data = [],
    buttons = []
  _params = params
  if (type.indexOf('MAP_SHARE') <= -1) return { data, buttons }
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
      action: () => {
        showMapList(constants.SUPERMAP_ONLINE)
      },
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

function showMapList(type) {
  let data = []
  SMap.getMaps().then(list => {
    data = [
      {
        title: '地图',
        data: list,
      },
    ]
    _params.setToolbarVisible &&
      _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
        containerType: 'list',
        isFullScreen: true,
        height: ConstToolType.HEIGHT[3],
        listSelectable: true,
        data,
        shareTo: type,
        buttons: [
          ToolbarBtnType.CANCEL,
          ToolbarBtnType.PLACEHOLDER,
          ToolbarBtnType.SHARE,
        ],
      })
  })
}

/**
 * 分享到SuperMap Online
 */
async function shareToSuperMapOnline(type) {
  try {
    if (!_params.user.currentUser.userName) {
      Toast.show('请登陆后再分享')
      return
    }
    if (isSharing) {
      Toast.show('分享中，请稍后')
      return
    }
    Toast.show('开始分享')
    let dataName, customerPath, targetPath, dataPath
    if (type === 'MAP_SHARE') {
      dataName = _params.user.currentUser.userName
      customerPath =
        ConstPath.UserPath + dataName + '/' + ConstPath.RelativePath.Data
      targetPath = await Utility.appendingHomeDirectory(
        ConstPath.UserPath + dataName + '.zip',
      )
      dataPath = await Utility.appendingHomeDirectory(customerPath)
    } else {
      let path = await SScene.getWorkspacePath()
      dataPath = path.substr(0, path.lastIndexOf('/'))
      dataName = _params.user.currentUser.userName
      let fileName = dataPath.substr(dataPath.lastIndexOf('/') + 1)
      targetPath = await Utility.appendingHomeDirectory(
        ConstPath.UserPath + dataName + '/Scene/' + fileName + '.zip',
      )
      // targetPath = await Utility.appendingHomeDirectory(
      //   ConstPath.UserPath + dataName+ '/Scen/'+ '.zip',
      // )
    }
    let zipResult = await Utility.zipFiles([dataPath], targetPath)
    let uploadResult = false
    if (zipResult) {
      isSharing = true
      await SOnlineService.deleteData(dataName).then(async () => {
        uploadResult = await SOnlineService.uploadFile(targetPath, dataName, {
          // onProgress: progress => {
          //   console.warn(progress)
          // },
          onResult: async () => {
            let result = await SOnlineService.publishService(dataName)
            isSharing = false
            Toast.show(result ? '分享成功' : '分享成功')
            Utility.deleteFile(targetPath)
          },
        })
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
  shareToSuperMapOnline,
}
