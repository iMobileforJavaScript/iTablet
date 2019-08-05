/**
 * AI助手
 */
import { getThemeAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'

// let _params = {}
//
// function setParams(params) {
//   _params = params
// }

function getAiAssistantData() {
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
      // action:openMap,
      size: 'large',
      image: getThemeAssets().ar.icon_ar,
    },
  ]
  return { data, buttons }
}

export default {
  // setParams,
  getAiAssistantData,
}
