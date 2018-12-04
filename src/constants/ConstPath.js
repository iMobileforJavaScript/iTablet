const AppPath = '/iTablet/'
const Data = 'Data/'

const RelativePath = {
  // 对应用户中的相对路径
  Environment: 'Environment/',
  License: 'License/',
  Log: 'Log/',
  Data: Data,
  Datasource: Data + 'Datasource/',
  Template: Data + 'Template/',
  Symbol: Data + 'Symbol/',
  Attribute: Data + 'Attribute/',
}

const RelativeFilePath = {
  CustomerWorkspace: Data + 'Customer.smwu', // 游客工作空间
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

  // 游客目录
  CustomerPath: AppPath + 'User/Customer/', // 存放游客数据
  RelativePath,
  RelativeFilePath,
}
