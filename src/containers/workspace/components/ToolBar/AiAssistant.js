/**
 * AI助手
 */
import { getThemeAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'
import { SMap, SMeasureView } from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'
import { Toast } from '../../../../utils'

let _params = {}

function setParams(params) {
  _params = params
}

//高精度采集(户型图)
function arMeasureCollect() {
  (async function() {
    let isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }
    let isTaggingLayer = await SMap.isTaggingLayer(
      _params.user.currentUser.userName,
    )
    if (isTaggingLayer && GLOBAL.TaggingDatasetName) {
      await SMap.setTaggingGrid(
        GLOBAL.TaggingDatasetName,
        _params.user.currentUser.userName,
      )
      const datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#' // 标注数据源名称
      const datasetName = GLOBAL.TaggingDatasetName // 标注图层名称
      NavigationService.navigate('MeasureView', {
        datasourceAlias,
        datasetName,
      })
    } else {
      Toast.show(getLanguage(_params.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
      _params.navigation.navigate('LayerManager')
    }
  }.bind(this)())
}

//AI分类
function aiClassify() {
  (async function() {
    let isTaggingLayer = await SMap.isTaggingLayer(
      _params.user.currentUser.userName,
    )
    if (isTaggingLayer && GLOBAL.TaggingDatasetName) {
      await SMap.setTaggingGrid(
        GLOBAL.TaggingDatasetName,
        _params.user.currentUser.userName,
      )
      const datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#' // 标注数据源名称
      const datasetName = GLOBAL.TaggingDatasetName // 标注图层名称
      NavigationService.navigate('ClassifyView', {
        datasourceAlias,
        datasetName,
      })
    } else {
      Toast.show(getLanguage(_params.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
      _params.navigation.navigate('LayerManager')
    }
  }.bind(this)())
}

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
      // action:openMap,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_collect_light,
    },
    {
      //态势采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
      // action:openMap,
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
      // action:openMap,
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
      //POI地图
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_POI_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_POI_COLLECT,
      // action: openMap,
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
  ]
  return { data, buttons }
}

export default {
  setParams,
  getAiAssistantData,
}
