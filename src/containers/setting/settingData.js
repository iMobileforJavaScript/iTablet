import { SScene } from 'imobile_for_reactnative'
async function getMap3DSettings() {
  let item = await SScene.getSetting()
  let data = [
    {
      title: '基本设置',
      visible: true,
      index: 0,
      data: [
        {
          name: '场景名称',
          value: item.sceneNmae,
          isShow: true,
          index: 0,
        },
        {
          name: '相机角度',
          value: item.heading,
          isShow: true,
          index: 0,
        },
        {
          name: '视图模式',
          value: '球面',
          isShow: true,
          index: 0,
        },
        {
          name: '地形缩放比例',
          value: true,
          isShow: true,
          index: 0,
        },
      ],
    },
  ]
  return data
}
export default {
  getMap3DSettings,
}
