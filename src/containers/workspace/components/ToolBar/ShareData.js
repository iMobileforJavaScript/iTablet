/**
 * 获取地图分享数据
 */
import {
  SOnlineService,
  SScene,
  SMap,
  SIPortalService,
} from 'imobile_for_reactnative'
import { ConstToolType, ConstInfo, UserType } from '../../../../constants'
import { Toast, OnlineServicesUtils } from '../../../../utils'
import constants from '../../constants'
import { FileTools } from '../../../../native'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import * as LayerUtils from '../../../../containers/mtLayerManager/LayerUtils'
import { getThemeAssets } from '../../../../assets'
// import ToolbarBtnType from './ToolbarBtnType'
// const Fs = require('react-native-fs')
let _params = {}
let isSharing = false

function setParams(params) {
  _params = params
}

function getShareData(type, params) {
  let data = [],
    buttons = []
  _params = params
  if (type.indexOf('MAP_SHARE') <= -1) return { data, buttons }
  switch (type) {
    case ConstToolType.MAP_SHARE_MAP3D:
      data = [
        {
          key: constants.SUPERMAP_ONLINE,
          title: constants.SUPERMAP_ONLINE,
          action: () => {
            // showMap3DList(constants.SUPERMAP_ONLINE)
            SScene.getMapList().then(list => {
              let data = [list[0].name]
              _params.map = { ..._params.map, currentMap: { name: data } }
              show3DSaveDialog(constants.SUPERMAP_ONLINE)
            })
          },
          size: 'large',
          image: getThemeAssets().share.online,
        },
        {
          key: constants.SUPERMAP_IPORTAL,
          title: constants.SUPERMAP_IPORTAL,
          action: () => {
            // showMap3DList(constants.SUPERMAP_ONLINE)
            SScene.getMapList().then(list => {
              let data = [list[0].name]
              _params.map = { ..._params.map, currentMap: { name: data } }
              show3DSaveDialog(constants.SUPERMAP_IPORTAL)
            })
          },
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
          action: () => {
            // showMapList(constants.SUPERMAP_ONLINE)
            showSaveDialog(constants.SUPERMAP_ONLINE)
          },
          size: 'large',
          image: getThemeAssets().share.online,
        },
        {
          key: constants.SUPERMAP_IPORTAL,
          title: constants.SUPERMAP_IPORTAL,
          action: () => {
            // showMapList(constants.SUPERMAP_ONLINE)
            showSaveDialog(constants.SUPERMAP_IPORTAL)
          },
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

function showSaveDialog(type) {
  if (
    (type === constants.SUPERMAP_ONLINE &&
      !UserType.isOnlineUser(_params.user.currentUser)) ||
    (type === constants.SUPERMAP_IPORTAL &&
      !UserType.isIPortalUser(_params.user.currentUser))
  ) {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN_AND_SHARE)
    //'请登陆后再分享')
    return
  }
  if (type !== ConstToolType.MAP_SHARE_MAP3D && !_params.map.currentMap.name) {
    Toast.show(ConstInfo.PLEASE_SAVE_MAP)
    return
  }
  if (isSharing) {
    Toast.show(getLanguage(global.language).Prompt.SHARING)
    //'分享中，请稍后')
    return
  }
  NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(global.language).Map_Main_Menu.SHARE,
    //'分享',
    value: _params.map.currentMap.name,
    placeholder: getLanguage(global.language).Prompt.ENTER_MAP_NAME,
    type: 'name',
    cb: async value => {
      let list = [_params.map.currentMap.name]
      shareMap(type, list, value)
      NavigationService.goBack()
    },
  })

  // if (type === constants.SUPERMAP_ONLINE) {
  //   let list = [_params.map.currentMap.name]
  //   _params.setInputDialogVisible &&
  //     _params.setInputDialogVisible(true, {
  //       placeholder: '请输入分享数据名称',
  //       confirmAction: value => {
  //         shareToSuperMapOnline(list, value)
  //         _params.setInputDialogVisible(false)
  //       },
  //     })
  // } else if (type === ConstToolType.MAP_SHARE_MAP3D) {
  //   SScene.getMapList().then(list => {
  //     let data = [list[0].name]
  //     _params.setInputDialogVisible &&
  //       _params.setInputDialogVisible(true, {
  //         placeholder: '请输入分享数据名称',
  //         confirmAction: value => {
  //           share3DToSuperMapOnline(data, value)
  //           _params.setInputDialogVisible(false)
  //         },
  //       })
  //   })
  // }
}

function show3DSaveDialog(type) {
  if (
    (type === constants.SUPERMAP_ONLINE &&
      !UserType.isOnlineUser(_params.user.currentUser)) ||
    (type === constants.SUPERMAP_IPORTAL &&
      !UserType.isIPortalUser(_params.user.currentUser))
  ) {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN_AND_SHARE)
    //'请登陆后再分享')
    return
  }
  if (isSharing) {
    Toast.show(getLanguage(global.language).Prompt.SHARING)
    //'分享中，请稍后')
    return
  }
  NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(global.language).Map_Main_Menu.SHARE,
    //'分享',
    value: _params.map.currentMap.name,
    placeholder: getLanguage(global.language).Prompt.ENTER_MAP_NAME,
    type: 'name',
    cb: async value => {
      let list = await SScene.getMapList()
      let data = [list[0].name]
      share3DMap(type, data, value)
      NavigationService.goBack()
    },
  })
}

// function showMapList(type) {
//   let data = []
//   SMap.getMaps().then(list => {
//     data = [
//       {
//         title: '地图',
//         data: list,
//       },
//     ]
//     _params.setToolbarVisible &&
//       _params.setToolbarVisible(true, ConstToolType.MAP_CHANGE, {
//         containerType: 'list',
//         isFullScreen: true,
//         height:
//           _params.device.orientation === 'LANDSCAPE'
//             ? ConstToolType.THEME_HEIGHT[4]
//             : ConstToolType.HEIGHT[3],
//         listSelectable: true,
//         data,
//         shareTo: type,
//         buttons: [
//           ToolbarBtnType.CANCEL,
//           ToolbarBtnType.PLACEHOLDER,
//           ToolbarBtnType.SHARE,
//         ],
//       })
//   })
// }

// function showMap3DList(type) {
//   let data = []
//   let arr = []
//   SScene.getMapList().then(list => {
//     for (let index = 0; index < list.length; index++) {
//       const element = list[index]
//       arr.push({ title: element.name })
//     }
//     data = [
//       {
//         title: '场景',
//         data: arr,
//       },
//     ]
//     _params.setToolbarVisible &&
//       _params.setToolbarVisible(true, ConstToolType.MAP3D_SHARE, {
//         containerType: 'list',
//         isFullScreen: true,
//         height: ConstToolType.HEIGHT[3],
//         listSelectable: true,
//         data,
//         shareTo: type,
//         buttons: [
//           ToolbarBtnType.CANCEL,
//           ToolbarBtnType.PLACEHOLDER,
//           ToolbarBtnType.MAP3DSHARE,
//         ],
//       })
//   })
// }

/**
 * 分享到SuperMap Online
 */
async function shareMap(type, list = [], name = '') {
  try {
    // GLOBAL.Loading && GLOBAL.Loading.setLoading(true, '分享中')
    if (isSharing) {
      Toast.show(getLanguage(global.language).Prompt.SHARING)
      //ConstInfo.SHARE_WAIT)
      return
    }
    _params.setToolbarVisible && _params.setToolbarVisible(false)
    Toast.show(getLanguage(global.language).Prompt.SHARE_PREPARE)

    setTimeout(async () => {
      _params.setSharing({
        module: GLOBAL.Type,
        name: name,
        progress: 0,
      })

      let layers = await SMap.getLayersByType()
      let notExportMapIndexes = []
      for (let i = 1; i <= GLOBAL.BaseMapSize; i++) {
        if (LayerUtils.isBaseLayer(layers[layers.length - i].name)) {
          notExportMapIndexes.push(layers.length - i)
        }
      }
      let notExport = {
        [_params.map.currentMap.name]: notExportMapIndexes,
      }

      _params.exportWorkspace(
        {
          maps: list,
          extra: {
            notExport,
          },
        },
        async (result, path) => {
          !result && Toast.show(ConstInfo.EXPORT_WORKSPACE_FAILED)
          // 分享
          let fileName = path.substr(path.lastIndexOf('/') + 1)
          let dataName = name || fileName.substr(0, fileName.lastIndexOf('.'))

          // SOnlineService.deleteData(dataName).then(async () => {
          Toast.show(getLanguage(global.language).Prompt.SHARE_START)
          let onProgeress = progress => {
            progress = parseInt(progress)
            let currentSharingProgress = 0
            for (let i = 0; i < _params.online.share.length; i++) {
              if (
                _params.online.share[i].module === GLOBAL.Type &&
                _params.online.share[i].name === dataName
              ) {
                currentSharingProgress = _params.online.share[i].progress
                break
              }
            }
            if (progress < 100 && currentSharingProgress !== progress / 100) {
              // console.warn('uploading: ' + progress)
              _params.setSharing({
                module: GLOBAL.Type,
                name: dataName,
                progress: (progress > 95 ? 95 : progress) / 100,
              })
            }
          }
          let onResult = async result => {
            if (typeof result === 'boolean' && result) {
              _params.setSharing({
                module: GLOBAL.Type,
                name: dataName,
                progress: 1,
              })
            }
            setTimeout(() => {
              _params.setSharing({
                module: GLOBAL.Type,
                name: dataName,
              })
            }, 2000)
            GLOBAL.Loading && GLOBAL.Loading.setLoading(false)
            Toast.show(
              typeof result === 'boolean' && result
                ? getLanguage(global.language).Prompt.SHARE_SUCCESS
                : getLanguage(global.language).Prompt.SHARE_FAILED,
            )
            FileTools.deleteFile(path)
            isSharing = false
          }

          if (type === constants.SUPERMAP_ONLINE) {
            await SOnlineService.uploadFile(path, dataName, {
              onProgress: onProgeress,
              onResult: async () => {
                SOnlineService.publishService(dataName)
                onResult(true)
              },
            })
          } else if (type === constants.SUPERMAP_IPORTAL) {
            await SIPortalService.uploadData(path, dataName + '.zip', {
              onProgress: onProgeress,
              onResult: async () => {
                let JSIPortalService = new OnlineServicesUtils('iportal')
                JSIPortalService.publishServiceByName(dataName + '.zip')
                onResult(true)
              },
            })
          }
        },
      )
    }, 500)
  } catch (e) {
    // GLOBAL.Loading && GLOBAL.Loading.setLoading(false)
    isSharing = false
  }
}

/**
 * 分享3D到SuperMap Online
 */
async function share3DMap(type, list = []) {
  try {
    // GLOBAL.Loading && GLOBAL.Loading.setLoading(true, '分享中')
    let isSharing = false
    if (_params.user.users.length <= 1) {
      Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN_AND_SHARE)
      //'请登陆后再分享')
      return
    }
    if (isSharing) {
      Toast.show(getLanguage(global.language).Prompt.SHARING)
      //'分享中，请稍后')
      return
    }
    _params.setToolbarVisible && _params.setToolbarVisible(false)
    if (list.length > 0) {
      isSharing = true
      for (let index = 0; index < list.length; index++) {
        let dataName = list[index]
        _params.setSharing({
          module: GLOBAL.Type,
          name: dataName,
          progress: 0,
        })
        _params.exportmap3DWorkspace(
          { name: list[index] },
          async (result, zipPath) => {
            if (result) {
              if (type === constants.SUPERMAP_ONLINE) {
                await SOnlineService.uploadFile(zipPath, dataName, {
                  // onProgress: progress => {
                  //   _params.setSharing({
                  //     module: GLOBAL.Type,
                  //     name: dataName,
                  //     progress: progress / 100,
                  //   })
                  // },
                  onResult: async () => {
                    GLOBAL.Loading && GLOBAL.Loading.setLoading(false)
                    Toast.show(
                      // result ? ConstInfo.SHARE_SUCCESS : ConstInfo.SHARE_FAILED,
                      getLanguage(global.language).Prompt.SHARE_SUCCESS,
                      //ConstInfo.SHARE_SUCCESS,
                    )
                    FileTools.deleteFile(zipPath)
                    isSharing = false
                    setTimeout(() => {
                      _params.setSharing({
                        module: GLOBAL.Type,
                        name: dataName,
                      })
                    }, 2000)
                  },
                })
              } else if (type === constants.SUPERMAP_IPORTAL) {
                await SIPortalService.uploadData(zipPath, dataName + '.zip', {
                  // onProgress:onProgeress,
                  onResult: async () => {
                    GLOBAL.Loading && GLOBAL.Loading.setLoading(false)
                    Toast.show(
                      // result ? ConstInfo.SHARE_SUCCESS : ConstInfo.SHARE_FAILED,
                      getLanguage(global.language).Prompt.SHARE_SUCCESS,
                      //ConstInfo.SHARE_SUCCESS,
                    )
                    FileTools.deleteFile(zipPath)
                    isSharing = false
                    setTimeout(() => {
                      _params.setSharing({
                        module: GLOBAL.Type,
                        name: dataName,
                      })
                    }, 2000)
                  },
                })
              }
            } else {
              Toast.show('上传失败')
            }
          },
        )
      }
    }
  } catch (error) {
    // GLOBAL.Loading && GLOBAL.Loading.setLoading(false)
    // Toast.show('分享失败')
  }
}

export default {
  getShareData,
  setParams,
}
