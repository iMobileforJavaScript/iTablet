import {
  SOnlineService,
  SScene,
  SMap,
  SIPortalService,
} from 'imobile_for_reactnative'
import { ConstToolType, ConstInfo, UserType } from '../../../../../../constants'
import { Toast, OnlineServicesUtils, LayerUtils } from '../../../../../../utils'
import constants from '../../../../constants'
import { FileTools } from '../../../../../../native'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'

/**
 * 分享到SuperMap Online
 */
async function shareMap(type, list = [], name = '') {
  try {
    // GLOBAL.Loading && GLOBAL.Loading.setLoading(true, '分享中')
    if (ToolbarModule.getData().isSharing) {
      Toast.show(getLanguage(global.language).Prompt.SHARING)
      //ConstInfo.SHARE_WAIT)
      return
    }
    ToolbarModule.getParams().setToolbarVisible &&
      ToolbarModule.getParams().setToolbarVisible(false)
    Toast.show(getLanguage(global.language).Prompt.SHARE_PREPARE)

    setTimeout(async () => {
      ToolbarModule.getParams().setSharing({
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
        [ToolbarModule.getParams().map.currentMap.name]: notExportMapIndexes,
      }

      ToolbarModule.getParams().exportWorkspace(
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
            for (
              let i = 0;
              i < ToolbarModule.getParams().online.share.length;
              i++
            ) {
              if (
                ToolbarModule.getParams().online.share[i].module ===
                  GLOBAL.Type &&
                ToolbarModule.getParams().online.share[i].name === dataName
              ) {
                currentSharingProgress = ToolbarModule.getParams().online.share[
                  i
                ].progress
                break
              }
            }
            if (progress < 100 && currentSharingProgress !== progress / 100) {
              // console.warn('uploading: ' + progress)
              ToolbarModule.getParams().setSharing({
                module: GLOBAL.Type,
                name: dataName,
                progress: (progress > 95 ? 95 : progress) / 100,
              })
            }
          }
          let onResult = async result => {
            if (typeof result === 'boolean' && result) {
              ToolbarModule.getParams().setSharing({
                module: GLOBAL.Type,
                name: dataName,
                progress: 1,
              })
            }
            setTimeout(() => {
              ToolbarModule.getParams().setSharing({
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
            ToolbarModule.addData({ isSharing: false })
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
    ToolbarModule.addData({ isSharing: false })
  }
}

/**
 * 分享3D到SuperMap Online
 */
async function share3DMap(type, list = []) {
  try {
    if (ToolbarModule.getParams().user.users.length <= 1) {
      Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN_AND_SHARE)
      //'请登陆后再分享')
      return
    }
    if (ToolbarModule.getData().isSharing) {
      Toast.show(getLanguage(global.language).Prompt.SHARING)
      //'分享中，请稍后')
      return
    }
    ToolbarModule.getParams().setToolbarVisible &&
      ToolbarModule.getParams().setToolbarVisible(false)
    if (list.length > 0) {
      ToolbarModule.addData({ isSharing: true })
      for (let index = 0; index < list.length; index++) {
        let dataName = list[index]
        ToolbarModule.getParams().setSharing({
          module: GLOBAL.Type,
          name: dataName,
          progress: 0,
        })
        ToolbarModule.getParams().exportmap3DWorkspace(
          { name: list[index] },
          async (result, zipPath) => {
            if (result) {
              if (type === constants.SUPERMAP_ONLINE) {
                await SOnlineService.uploadFile(zipPath, dataName, {
                  // onProgress: progress => {
                  //   ToolbarModule.getParams().setSharing({
                  //     module: GLOBAL.Type,
                  //     name: dataName,
                  //     progress: progress / 100,
                  //   })
                  // },
                  onResult: async () => {
                    GLOBAL.Loading && GLOBAL.Loading.setLoading(false)
                    Toast.show(
                      getLanguage(global.language).Prompt.SHARE_SUCCESS,
                    )
                    FileTools.deleteFile(zipPath)
                    ToolbarModule.addData({ isSharing: false })
                    setTimeout(() => {
                      ToolbarModule.getParams().setSharing({
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
                      getLanguage(global.language).Prompt.SHARE_SUCCESS,
                    )
                    FileTools.deleteFile(zipPath)
                    ToolbarModule.addData({ isSharing: false })
                    setTimeout(() => {
                      ToolbarModule.getParams().setSharing({
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
    ToolbarModule.addData({ isSharing: false })
  }
}

function showSaveDialog(type) {
  if (
    (type === constants.SUPERMAP_ONLINE &&
      !UserType.isOnlineUser(ToolbarModule.getParams().user.currentUser)) ||
    (type === constants.SUPERMAP_IPORTAL &&
      !UserType.isIPortalUser(ToolbarModule.getParams().user.currentUser))
  ) {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN_AND_SHARE)
    //'请登陆后再分享')
    return
  }
  if (
    type !== ConstToolType.MAP_SHARE_MAP3D &&
    !ToolbarModule.getParams().map.currentMap.name
  ) {
    Toast.show(ConstInfo.PLEASE_SAVE_MAP)
    return
  }
  if (ToolbarModule.getData().isSharing) {
    Toast.show(getLanguage(global.language).Prompt.SHARING)
    //'分享中，请稍后')
    return
  }
  NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(global.language).Map_Main_Menu.SHARE,
    //'分享',
    value: ToolbarModule.getParams().map.currentMap.name,
    placeholder: getLanguage(global.language).Prompt.ENTER_MAP_NAME,
    type: 'name',
    cb: async value => {
      let list = [ToolbarModule.getParams().map.currentMap.name]
      shareMap(type, list, value)
      NavigationService.goBack()
    },
  })
}

function show3DSaveDialog(type) {
  SScene.getMapList().then(list => {
    let data = [list[0].name]
    ToolbarModule.getParams().map = {
      ...ToolbarModule.getParams().map,
      currentMap: { name: data },
    }
    if (
      (type === constants.SUPERMAP_ONLINE &&
        !UserType.isOnlineUser(ToolbarModule.getParams().user.currentUser)) ||
      (type === constants.SUPERMAP_IPORTAL &&
        !UserType.isIPortalUser(ToolbarModule.getParams().user.currentUser))
    ) {
      Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN_AND_SHARE)
      //'请登陆后再分享')
      return
    }
    if (ToolbarModule.getData().isSharing) {
      Toast.show(getLanguage(global.language).Prompt.SHARING)
      //'分享中，请稍后')
      return
    }
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(global.language).Map_Main_Menu.SHARE,
      //'分享',
      value: ToolbarModule.getParams().map.currentMap.name,
      placeholder: getLanguage(global.language).Prompt.ENTER_MAP_NAME,
      type: 'name',
      cb: async value => {
        let list = await SScene.getMapList()
        let data = [list[0].name]
        share3DMap(type, data, value)
        NavigationService.goBack()
      },
    })
  })
}

export default {
  showSaveDialog,
  show3DSaveDialog,
}
