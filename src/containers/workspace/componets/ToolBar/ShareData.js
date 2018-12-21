/**
 * 获取地图分享数据
 */
import { SMap, SOnlineService } from 'imobile_for_reactnative'
import { ConstToolType, ConstInfo } from '../../../../constants'
import { Toast } from '../../../../utils'
import constants from '../../constants'
import { FileTools } from '../../../../native'
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
      image: require('../../../../assets/mapTools/icon_share_online.png'),
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
async function shareToSuperMapOnline(list = [], name = '') {
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
    _params.exportWorkspace(
      {
        maps: list,
      },
      (result, path) => {
        Toast.show(
          result
            ? ConstInfo.EXPORT_WORKSPACE_SUCCESS
            : ConstInfo.EXPORT_WORKSPACE_FAILED,
        )
        // 分享
        let fileName = path.substr(path.lastIndexOf('/') + 1)
        let dataName = name || fileName.substr(0, fileName.lastIndexOf('.'))

        SOnlineService.deleteData(dataName).then(async () => {
          await SOnlineService.uploadFile(path, dataName, {
            // onProgress: progress => {
            //   console.warn(progress)
            // },
            onResult: async () => {
              let result = await SOnlineService.publishService(dataName)
              Toast.show(
                result ? ConstInfo.SHARE_SUCCESS : ConstInfo.SHARE_FAILED,
              )
              FileTools.deleteFile(path)
              isSharing = false
            },
          })
        })
      },
    )
  } catch (e) {
    isSharing = false
  }
}

export default {
  getShareData,
  shareToSuperMapOnline,
}
