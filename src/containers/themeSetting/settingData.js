async function getThemeSettings() {
  let data = [
    {
      titile: '基本设置',
      visible: true,
      index: 0,
      data: [
        {
          name: '场景名称',
          value: '专题图',
          isShow: true,
          index: 0,
        },
        {
          name: '相机角度',
          value: '90',
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
          value: 1,
          isShow: true,
          index: 0,
        },
      ],
    },
  ]
  return data
}
export default {
  getThemeSettings,
}
