import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import AiActions from './AiActions'

function getData() {
  let buttons = []
  let data = [
    {
      //目标分类
      key: 'aiClassify',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_CLASSIFY,
      action: AiActions.aiClassify,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_classify_light,
    },
    {
      //目标采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_TARGET_COLLECT,
      action: AiActions.aiDetect,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_collect_light,
    },
    {
      //态势采集
      key: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT,
      action: AiActions.polymerizeCollect,
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
      action: AiActions.illegallyParkCollect,
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
      action: AiActions.collectSceneForm,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.rightbar_ai_poi_light,
    },
    {
      //户型图采集
      key: 'arMeasureCollect',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_LAYOUT_COLLECT,
      action: AiActions.arMeasureCollect,
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
  // if (Platform.OS === 'ios') {
  //   data.splice(4, 1)
  // }
  return { data, buttons }
}

export default {
  getData,
}
