import ConstPath from '../constants/ConstPath'
const testData_android = {
  data: [
    {
      key: '数据可视化',
      path: ConstPath.SampleDataPath + 'hotMap/hotMap.smwu',
      outPath: ConstPath.SampleDataPath,
      fileName: 'hotMap',
      filePath: ConstPath.SampleDataPath + 'hotMap.zip',
    },
    {
      key: 'GL地图瓦片',
      path: ConstPath.SampleDataPath + 'Changchun/Changchun.smwu',
      outPath: ConstPath.SampleDataPath,
      fileName: 'Changchun',
      filePath: ConstPath.SampleDataPath + 'Changchun.zip',
      openPath: ConstPath.SampleDataPath + 'Changchun/Changchun.smwu',
    },
    {
      key: '影像叠加矢量地图',
      path: ConstPath.SampleDataPath + 'DOM/DOM.smwu',
      outPath: ConstPath.SampleDataPath,
      fileName: 'DOM',
      filePath: ConstPath.SampleDataPath + 'DOM.zip',
      openPath: ConstPath.SampleDataPath + 'DOM/DOM.smwu',
    },
    {
      key: '三维场景',
      path: ConstPath.SampleDataPath + 'CBD_android/CBD_android.sxwu',
      outPath: ConstPath.SampleDataPath,
      fileName: 'CBD_android',
      filePath: ConstPath.SampleDataPath + 'CBD_android.zip',
      openPath: ConstPath.SampleDataPath + 'CBD_android/CBD_android.sxwu',
    },
    {
      key: '倾斜摄影',
      path: ConstPath.SampleDataPath + 'MaSai/MaSai.sxwu',
      outPath: ConstPath.SampleDataPath,
      fileName: 'MaSai',
      filePath: ConstPath.SampleDataPath + 'MaSai.zip',
      openPath: ConstPath.SampleDataPath + 'MaSai/MaSai.sxwu',
    },
  ],
}
const testData_ios = {
  data: [
    {
      key: '数据可视化',
      path: ConstPath.SampleDataPath + '/hotMap/hotMap.smwu',
      outPath: ConstPath.SampleDataPath,
      fileName: 'hotMap',
      filePath: ConstPath.SampleDataPath + 'hotMap.zip',
    },
    {
      key: 'GL地图瓦片',
      path: ConstPath.SampleDataPath + '/Changchun/Changchun.smwu',
      outPath: ConstPath.SampleDataPath,
      fileName: 'Changchun',
      filePath: ConstPath.SampleDataPath + 'Changchun.zip',
      openPath: ConstPath.SampleDataPath + 'Changchun/Changchun.smwu',
    },
    {
      key: '影像叠加矢量地图',
      path: ConstPath.SampleDataPath + '/DOM/DOM.smwu',
      outPath: ConstPath.SampleDataPath,
      fileName: 'DOM',
      filePath: ConstPath.SampleDataPath + 'DOM.zip',
      openPath: ConstPath.SampleDataPath + 'DOM/DOM.smwu',
    },
    {
      key: '三维场景',
      path: ConstPath.SampleDataPath + '/CBD_ios/CBD_ios.sxwu',
      outPath: ConstPath.SampleDataPath,
      fileName: 'CBD_ios',
      filePath: ConstPath.SampleDataPath + 'CBD_ios.zip',
      openPath: ConstPath.SampleDataPath + 'CBD_ios/CBD_ios.sxwu',
    },
    {
      key: '倾斜摄影',
      path: ConstPath.SampleDataPath + '/MaSai_ios/MaSai.sxwu',
      outPath: ConstPath.SampleDataPath,
      fileName: 'MaSai_ios',
      filePath: ConstPath.SampleDataPath + 'MaSai_ios.zip',
      openPath: ConstPath.SampleDataPath + 'MaSai_ios/MaSai_ios.sxwu',
    },
  ],
}
export default {
  testData_ios,
  testData_android,
}
