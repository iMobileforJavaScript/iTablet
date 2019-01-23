const AppPath = '/iTablet/'
const Data = 'Data/'
const Collection = 'Collection'
const MapEdit = 'MapEdit'
const MapTheme = 'Map/MapTheme'

const Module = {
  Collection,
  MapEdit,
  MapTheme,
}

const RelativePath = {
  // 对应用户中的相对路径
  Environment: 'Environment/',
  License: 'License/',
  Log: 'Log/',
  ExternalData: 'ExternalData/',
  ExternalData2: 'ExternalData',
  Data: Data,
  Datasource: Data + 'Datasource/',
  Template: Data + 'Template/',
  Symbol: Data + 'Symbol/',
  Attribute: Data + 'Attribute/',
  Workspace: Data + 'Workspace/',
  Map: Data + 'Map/',
  Temp: Data + 'Temp/', // 临时文件
}

const RelativeFilePath = {
  Workspace: Data + 'Workspace.smwu', // 工作空间
  Scene: Data + 'Scene/',
  List: Data + 'Scene/List/',
  Map: Data + 'Map/',
  Collection: Data + 'Map/' + Collection + '/',
  MapEdit: Data + 'Map/' + MapEdit + '/',
  MapTheme: Data + 'Map/' + MapTheme + '/',
}

// 默认创建的目录
export default {
  AppPath,
  // SampleDataPath: AppPath + 'data/sample/', // 存放示例数据
  LocalDataPath: AppPath + 'data/local/', // 存放用户地图数据
  // UserPath: AppPath + '/user/', // 存放用户数据
  LicensePath: AppPath + 'license/', // 存放许可文件
  Audio: AppPath + 'audio/', // 存放语音

  CachePath: AppPath + 'Cache/',
  SampleDataPath: AppPath + '/SampleData/', // 存放示例数据
  UserPath: AppPath + 'User/', // 存放用户数据
  UserPath2: AppPath + 'User', // 存放用户数据
  Common: AppPath + 'Common/', // 公共数据
  // 游客目录
  CustomerPath: AppPath + 'User/Customer/', // 存放游客数据
  RelativePath,
  RelativeFilePath,
  Module,
}
