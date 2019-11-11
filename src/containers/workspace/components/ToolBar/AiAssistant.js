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
    GLOBAL.mapView.setState({ map: { height: 0 } })
    const datasourceAlias = 'AR高精度采集'
    const datasetName = 'CollectSceneForm'
    NavigationService.navigate('CollectSceneFormView', {
      datasourceAlias,
      datasetName,
    })
  }.bind(this)())
}

//AR投放
// function arCastModelOperate() {
//   (async function() {
//     let isSupportedARCore = await SMeasureView.isSupportedARCore()
//     if (!isSupportedARCore) {
//       Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
//       return
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
  return { data, buttons }
}

export default {
  setParams,
  getAiAssistantData,
}
