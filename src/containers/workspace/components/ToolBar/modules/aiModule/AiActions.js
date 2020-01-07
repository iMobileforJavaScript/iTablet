import { getLanguage } from '../../../../../../language/index'
import {
  SMeasureView,
  // DatasetType,
  SAIDetectView,
  SMap,
  SCollectSceneFormView,
} from 'imobile_for_reactnative'
import NavigationService from '../../../../../NavigationService'
import { Toast } from '../../../../../../utils/index'
import { FileTools } from '../../../../../../native/index'
import { ConstPath } from '../../../../../../constants/index'
import FetchUtils from '../../../../../../utils/FetchUtils'
import ToolbarModule from '../ToolbarModule'

//违章采集
function illegallyParkCollect() {
  (async function() {
    let _params = ToolbarModule.getParams()
    let dataList = await SMap.getTaggingLayers(
      _params.user.currentUser.userName,
    )
    if (dataList.length > 0) {
      if (GLOBAL.showAIDetect) {
        GLOBAL.isswitch = true
        ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
      }
      const type = 'illegallyParkCollect'
      _params.navigation.navigate('ChooseTaggingLayer', { type })
    } else {
      Toast.show(getLanguage(_params.language).Prompt.PLEASE_NEW_PLOT_LAYER)
      _params.navigation.navigate('LayerManager')
    }

    // let isSupportedARCore = await SMeasureView.isSupportedARCore()
    // if (!isSupportedARCore) {
    //   Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
    //   return
    // }
  }.bind(this)())
}

//户型图采集
function arMeasureCollect() {
  (async function() {
    let _params = ToolbarModule.getParams()
    let isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }

    let dataList = await SMap.getTaggingLayers(
      _params.user.currentUser.userName,
    )
    if (dataList.length > 0) {
      if (GLOBAL.showAIDetect) {
        GLOBAL.isswitch = true
        ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
      }
      const type = 'arMeasureCollect'
      _params.navigation.navigate('ChooseTaggingLayer', { type })
    } else {
      Toast.show(getLanguage(_params.language).Prompt.PLEASE_NEW_PLOT_LAYER)
      _params.navigation.navigate('LayerManager')
    }
  }.bind(this)())
}

//AI分类
function aiClassify() {
  (async function() {
    let _params = ToolbarModule.getParams()
    if (GLOBAL.isDownload) {
      this.homePath = await FileTools.appendingHomeDirectory()
      let dustbinPath =
        this.homePath +
        ConstPath.Common_AIClassifyModel +
        'mobilenet_quant_224' +
        '/'
      this.dustbin_model = dustbinPath + 'mobilenet_quant_224' + '.tflite'
      this.dustbin_txt = dustbinPath + 'mobilenet_quant_224' + '.txt'
      let isDustbin =
        (await FileTools.fileIsExist(this.dustbin_model)) &&
        (await FileTools.fileIsExist(this.dustbin_txt))
      if (isDustbin) {
        let dataList = await SMap.getTaggingLayers(
          _params.user.currentUser.userName,
        )
        if (dataList.length > 0) {
          if (GLOBAL.showAIDetect) {
            GLOBAL.isswitch = true
            ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
          }
          const type = 'aiClassify'
          _params.navigation.navigate('ChooseTaggingLayer', { type })
        } else {
          Toast.show(getLanguage(_params.language).Prompt.PLEASE_NEW_PLOT_LAYER)
          _params.navigation.navigate('LayerManager')
        }
      } else {
        GLOBAL.isDownload = false
        let downloadData = getDownloadData(
          'mobilenet_quant_224',
          'mobilenet_quant_224',
        )
        _downloadData(downloadData)
        Toast.show(getLanguage(_params.language).Prompt.DOWNLOADING_PLEASE_WAIT)
      }
    } else {
      Toast.show(getLanguage(_params.language).Prompt.DOWNLOADING_PLEASE_WAIT)
    }
  }.bind(this)())
}

function getDownloadData(key, fileName) {
  let cachePath = this.homePath + ConstPath.CachePath
  let toPath = this.homePath + ConstPath.Common_AIClassifyModel + fileName
  return {
    key: key,
    fileName: fileName,
    cachePath: cachePath,
    copyFilePath: toPath,
  }
}

function _downloadData(downloadData) {
  (async function() {
    let _params = ToolbarModule.getParams()
    let keyword = downloadData.fileName
    let dataUrl = await FetchUtils.getFindUserDataUrl(
      'xiezhiyan123',
      keyword,
      '.zip',
    )
    let cachePath = downloadData.cachePath
    let fileDirPath = downloadData.copyFilePath
    let fileCachePath = cachePath + downloadData.fileName + '.zip'
    await FileTools.deleteFile(fileCachePath)
    try {
      let downloadOptions = {
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        fileName: downloadData.fileName,
        progressDivider: 1,
        key: downloadData.key,
      }
      _params
        .downloadFile(downloadOptions)
        .then(async () => {
          await FileTools.unZipFile(fileCachePath, fileDirPath)
          await FileTools.deleteFile(fileCachePath)
          _params.deleteDownloadFile({ id: 'mobilenet_quant_224' })
          GLOBAL.isDownload = true
          Toast.show(getLanguage(_params.language).Prompt.DOWNLOAD_SUCCESSFULLY)
        })
        .catch(() => {
          Toast.show(getLanguage(_params.language).Prompt.NETWORK_ERROR)
          FileTools.deleteFile(fileCachePath)
        })
    } catch (e) {
      Toast.show(getLanguage(_params.language).Prompt.NETWORK_ERROR)
      //'网络错误，下载失败'
      FileTools.deleteFile(fileCachePath)
    }
  }.bind(this)())
}

//目标采集
function aiDetect() {
  (async function() {
    let _params = ToolbarModule.getParams()
    let dataList = await SMap.getTaggingLayers(
      _params.user.currentUser.userName,
    )
    if (dataList.length > 0) {
      if (GLOBAL.showAIDetect) {
        GLOBAL.isswitch = true
        ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
      }
      const type = 'aiDetect'
      _params.navigation.navigate('ChooseTaggingLayer', { type })
    } else {
      Toast.show(getLanguage(_params.language).Prompt.PLEASE_NEW_PLOT_LAYER)
      _params.navigation.navigate('LayerManager')
    }
    // await SAIDetectView.startCountTrackedObjs(true)
  }.bind(this)())
}

//态势采集(聚合模式)
function polymerizeCollect() {
  (async function() {
    // await SAIDetectView.setProjectionModeEnable(true)
    // await SAIDetectView.setDrawTileEnable(false)
    await SAIDetectView.setIsPolymerize(true)
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.setVisible(false)
    if (!GLOBAL.showAIDetect) {
      (await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    // ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    // await SAIDetectView.startCountTrackedObjs(true)
  }.bind(this)())
}

//高精度采集
function collectSceneForm() {
  (async function() {
    let _params = ToolbarModule.getParams()
    let isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }

    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    let time = await SCollectSceneFormView.getSystemTime()
    GLOBAL.mapView.setState({ map: { height: 0 } })
    GLOBAL.newcollectData = time
    const datasourceAlias = time
    const datasetName = 'CollectSceneForm'
    const datasetPointName = 'CollectPointSceneForm'
    NavigationService.navigate('CollectSceneFormView', {
      datasourceAlias,
      datasetName,
      datasetPointName,
    })

    // NavigationService.navigate('InputPage', {
    //   headerTitle: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_NEWDATA,
    //   value: '',
    //   placeholder: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_NEW_DATANAME,
    //   type: 'name',
    //   cb: async value => {
    //     NavigationService.goBack()
    //   },
    //   backcb: () => {
    //     NavigationService.goBack()
    //     if (GLOBAL.isswitch) {
    //       GLOBAL.isswitch = false
    //       GLOBAL.toolBox && GLOBAL.toolBox.switchAr()
    //     }
    //   },
    // })
  }.bind(this)())
}

export default {
  illegallyParkCollect,
  arMeasureCollect,
  aiClassify,
  _downloadData,
  aiDetect,
  polymerizeCollect,
  collectSceneForm,
}
