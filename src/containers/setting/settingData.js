import { SScene } from 'imobile_for_reactnative'
import { getLanguage } from '../../language/index'
async function getMap3DSettings() {
  let item = await SScene.getSetting()
  let data = [
    {
      title: getLanguage(global.language).Map_Setting.BASIC_SETTING,
      visible: true,
      data: [
        {
          //'场景名称',
          name: getLanguage(global.language).Map_Setting.SCENE_NAME,
          value: item.sceneNmae,
        },
        {
          //'相机角度',
          name: getLanguage(global.language).Map_Setting.FOV,
          value: item.heading,
        },
        {
          //'场景操作状态',
          name: getLanguage(global.language).Map_Setting.SCENE_OPERATION_STATUS,
          value: GLOBAL.action3d ? GLOBAL.action3d : 'NULL',
        },
        {
          //'视图模式',
          name: getLanguage(global.language).Map_Setting.VIEW_MODE,
          //'球面',
          value: getLanguage(global.language).Map_Setting.SPHERICAL,
        },
        // {
        //   name: '地形缩放比例',
        //   value: true,
        // },
      ],
    },
  ]
  return data
}
export default {
  getMap3DSettings,
}
