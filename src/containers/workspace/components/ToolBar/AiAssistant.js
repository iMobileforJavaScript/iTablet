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

//高精度采集
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

function getAiAssistantData(type, params) {
  _params = params
  let buttons = []
  let data = [
    {
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_CUSTOM_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_CUSTOM_COLLECT,
      // action:openMap,
      size: 'large',
      image: getThemeAssets().ar.icon_ar,
    },
    {
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MUNICIPAL_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MUNICIPAL_COLLECT,
      // action:openMap,
      size: 'large',
      image: getThemeAssets().ar.icon_ar,
    },
    {
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_ILLEGAL_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_ILLEGAL_COLLECT,
      // action:openMap,
      size: 'large',
      image: getThemeAssets().ar.icon_ar,
    },
    {
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_ROAD_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_ROAD_COLLECT,
      // action:openMap,
      size: 'large',
      image: getThemeAssets().ar.icon_ar,
    },
    {
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_POI_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_POI_COLLECT,
      // action: openMap,
      size: 'large',
      image: getThemeAssets().ar.icon_ar,
    },
    {
      key: 'arMeasureCollect',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_MEASURE_COLLECT,
      action: arMeasureCollect,
      size: 'large',
      image: getThemeAssets().ar.icon_ar,
    },
  ]
  return { data, buttons }
}

export default {
  setParams,
  getAiAssistantData,
}
