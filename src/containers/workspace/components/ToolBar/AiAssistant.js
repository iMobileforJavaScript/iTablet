/**
 * AI助手
 */
import { getThemeAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'
import {
  SMeasureView,
  // DatasetType,
  SAIDetectView,
  SMap,
} from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'
import { Toast } from '../../../../utils'
import { FileTools } from '../../../../native'
import { ConstPath } from '../../../../constants'
import FetchUtils from '../../../../utils/FetchUtils'
import { Platform } from 'react-native'

let _params = {}

function setParams(params) {
  _params = params
}

//违章采集
function illegallyParkCollect() {
  (async function() {
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
    let isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }

    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_NEWDATA,
      value: '',
      placeholder: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_NEW_DATANAME,
      type: 'name',
      cb: async value => {
        NavigationService.goBack()
        GLOBAL.mapView.setState({ map: { height: 0 } })
        GLOBAL.newcollectData = value
        const datasourceAlias = value
        const datasetName = 'CollectSceneForm'
        const datasetPointName = 'CollectPointSceneForm'
        NavigationService.navigate('CollectSceneFormView', {
          datasourceAlias,
          datasetName,
          datasetPointName,
        })
      },
      backcb: () => {
        NavigationService.goBack()
        if (GLOBAL.isswitch) {
          GLOBAL.isswitch = false
          GLOBAL.toolBox && GLOBAL.toolBox.switchAr()
        }
      },
    })
  }.bind(this)())
}

// //AR投放
// function arCastModelOperate() {
//   (async function() {
//     let isSupportedARCore = await SMeasureView.isSupportedARCore()
//     if (!isSupportedARCore) {
//       Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
//       return
//     }
//     if (GLOBAL.showAIDetect) {
//       GLOBAL.isswitch = true
//       ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
//     }
//     const datasourceAlias = 'AR投放'
//     const datasetName = 'CastModelOperate'
//     NavigationService.navigate('CastModelOperateView', {
//       datasourceAlias,
//       datasetName,
//     })
//   }.bind(this)())
// }

function getAiAssistantData(type, params) {
  _params = params
  let buttons = []
  let data = [
    {
      //目标分类
      key: 'aiClassify',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_CLASSIFY,
      action: aiClassify,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_classify_light,
    },
    {
      //目标采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
      action: aiDetect,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_collect_light,
    },
    {
      //态势采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
      action: polymerizeCollect,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar
        .rightbar_ai_aggregate_collect_light,
    },
    {
      //违章采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT,
      action: illegallyParkCollect,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_violation_light,
    },
    // {
    //   //路面采集
    //   key: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_ROAD_COLLECT,
    //   title: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_ROAD_COLLECT,
    //   // action:openMap,
    //   size: 'large',
    //   image: getThemeAssets().ar.icon_ar,
    // },
    {
      //高精度采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
      action: collectSceneForm,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_poi_light,
    },
    {
      //户型图采集
      key: 'arMeasureCollect',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT,
      action: arMeasureCollect,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_layout_light,
    },
    // {
    //   //AR投放
    //   key: 'arCastModelOperate',
    //   title: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_CAST_MODEL_OPERATE,
    //   action: arCastModelOperate,
    //   size: 'large',
    //   image: getThemeAssets().ar.functiontoolbar.ar_cast,
    // },
  ]
  if (Platform.OS === 'ios') {
    data.splice(2, 3)
  }
  return { data, buttons }
}

export default {
  setParams,
  getAiAssistantData,
}
