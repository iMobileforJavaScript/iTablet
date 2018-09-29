import ConstPath from '../constains/ConstPath'
const testData_android = {
  data:[
  { key: '数据可视化', path: ConstPath.SampleDataPath + 'hotMap/hotMap.smwu', outPath: '/storage/emulated/0/iTablet/data/sample', fileName: "hotMap", filePath: '/storage/emulated/0/iTablet/data/sample/hotMap.zip' },
  { key: 'GL地图瓦片', path: ConstPath.SampleDataPath + 'Changchun/Changchun.smwu', outPath: '/storage/emulated/0/iTablet/data/sample', fileName: "Changchun", filePath: '/storage/emulated/0/iTablet/data/sample/Changchun.zip', openPath: '/storage/emulated/0/iTablet/data/sample/Changchun/Changchun.smwu' },
  { key: '影像叠加矢量地图', path: ConstPath.SampleDataPath + 'DOM/DOM.smwu', outPath: '/storage/emulated/0/iTablet/data/sample', fileName: "DOM", filePath:  '/storage/emulated/0/iTablet/data/sample/DOM.zip', openPath: '/storage/emulated/0/iTablet/data/sample/DOM/DOM.smwu' },
  { key: '三维场景', path: ConstPath.SampleDataPath + 'CBD_android/CBD_android.sxwu', outPath: '/storage/emulated/0/iTablet/data/sample', fileName: "CBD_android", filePath: '/storage/emulated/0/iTablet/data/sample/CBD_android.zip', openPath: '/storage/emulated/0/iTablet/data/sample/CBD_android/CBD_android.sxwu' },
  { key: '倾斜摄影', path: ConstPath.SampleDataPath + 'MaSai/MaSai.sxwu', outPath: '/storage/emulated/0/iTablet/data/sample', fileName: "MaSai", filePath: '/storage/emulated/0/iTablet/data/sample/MaSai.zip', openPath:  '/storage/emulated/0/iTablet/data/sample/MaSai/MaSai.sxwu' }]
}
const testData_ios = {
  data:[
  { key: '数据可视化', path: ConstPath.SampleDataPath + '/hotMap/hotMap.smwu', outPath: '/storage/emulated/0/iTablet/data/sample', fileName: "hotMap", filePath:  '/storage/emulated/0/iTablet/data/sample/hotMap.zip' },
  { key: 'GL地图瓦片', path: ConstPath.SampleDataPath + '/Changchun/Changchun.smwu', outPath: '/storage/emulated/0/iTablet/data/sample', fileName: "Changchun", filePath: '/storage/emulated/0/iTablet/data/sample/Changchun.zip', openPath:  '/storage/emulated/0/iTablet/data/sample/Changchun/Changchun.smwu' },
  { key: '影像叠加矢量地图', path: ConstPath.SampleDataPath + '/DOM/DOM.smwu', outPath: '/storage/emulated/0/iTablet/data/sample', fileName: "DOM", filePath: '/storage/emulated/0/iTablet/data/sample/DOM.zip', openPath:  '/storage/emulated/0/iTablet/data/sample/DOM/DOM.smwu' },
  { key: '三维场景', path: ConstPath.SampleDataPath + '/CBD_ios/CBD_ios.sxwu', outPath: '/storage/emulated/0/iTablet/data/sample', fileName: "CBD_ios", filePath: '/storage/emulated/0/iTablet/data/sample/CBD_ios.zip', openPath: '/storage/emulated/0/iTablet/data/sample/CBD_ios/CBD_ios.sxwu' },
  { key: '倾斜摄影', path: ConstPath.SampleDataPath + '/MaSai_ios/MaSai.sxwu', outPath: '/storage/emulated/0/iTablet/data/sample', fileName: "MaSai_ios", filePath:  '/storage/emulated/0/iTablet/data/sample/MaSai_ios.zip', openPath:   '/storage/emulated/0/iTablet/data/sample/MaSai_ios/MaSai_ios.sxwu' }]
}
export default {
  testData_android,
  testData_ios,
}