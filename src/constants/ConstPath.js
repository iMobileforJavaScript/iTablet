const AppPath = '/iTablet/'
const Data = 'Data/'
const DefaultData = 'DefaultData/'
const Collection = 'Collection'
const MapEdit = 'MapEdit'
const MapTheme = 'Map/MapTheme'
const Workspace = 'Workspace.sxwu' // 工作空间
const Plotting = 'Plotting'
const Module = {
  Collection,
  MapEdit,
  MapTheme,
  Plotting,
}

// 该目录下的数据会被创建在 '/iTablet/'下，不要轻易加
const RelativePath = {
  // 对应用户中的相对路径
  Environment: 'Environment/',
  License: 'License/',
  Log: 'Log/',
  ExternalData: 'ExternalData/',
  Data: Data,
  Datasource: Data + 'Datasource/',
  Scene: Data + 'Scene/',
  Template: Data + 'Template/',
  Plotting: Data + 'Plotting/',
  // PlottingExternalDefaultName: 'ExternalData/'+Plotting + '/标绘库',
  Symbol: Data + 'Symbol/',
  Attribute: Data + 'Attribute/',
  Workspace: Data + 'Workspace/',
  Map: Data + 'Map/',
  Color: Data + 'Color/',
  Temp: Data + 'Temp/', // 临时文件
}

const RelativeFilePath = {
  ExportData: 'ExportData/',
  ExternalData: 'ExternalData',
  WorkspaceFile: Workspace,
  // Workspace: Data + 'Workspace.smwu', // 工作空间
  DefaultData: DefaultData, // 默认数据文件夹目录
  DefaultWorkspaceDir: DefaultData + 'Workspace/', // 工作空间默认数据文件夹目录
  Workspace: {
    CN: DefaultData + 'Workspace/Workspace.sxwu', // 工作空间
    EN: DefaultData + 'Workspace_EN/Workspace.sxwu', // 英文工作空间
  },
  Scene: Data + 'Scene/',
  List: Data + 'Scene/List/',
  Map: Data + 'Map/',
  Color: Data + 'Color/',
  Collection: Data + 'Map/' + Collection + '/',
  MapEdit: Data + 'Map/' + MapEdit + '/',
  MapTheme: Data + 'Map/' + MapTheme + '/',
  Media: Data + 'Media/',
  AR: Data + 'Datasource/',
  Animation: Data + 'Animation/',
  NaviWorkspace: Data + 'Workspace/',
  Image: Data + 'Workspace/',
}

// 默认创建的目录
export default {
  AppPath,
  // SampleDataPath: AppPath + 'data/sample/', // 存放示例数据
  // LocalDataPath: AppPath + 'data/local/', // 存放用户地图数据
  // UserPath: AppPath + '/user/', // 存放用户数据
  LicensePath: AppPath + 'license/', // 存放许可文件
  // Audio: AppPath + 'audio/', // 存放语音

  CachePath: AppPath + 'Cache/',
  CachePath2: AppPath + 'Cache',
  // SampleDataPath: AppPath + '/SampleData/', // 存放示例数据
  UserPath: AppPath + 'User/', // 存放用户数据
  UserPath2: AppPath + 'User', // 存放用户数据
  Common: AppPath + 'Common/', // 公共数据
  Images: AppPath + 'Common/Images', // 公共图片
  Common_AIDetectModel: AppPath + 'Common/AI/DetectModel/', // 公共数据:检测模型
  Common_AIClassifyModel: AppPath + 'Common/AI/ClassifyModel/', // 公共数据:分类模型
  Import: AppPath + 'Import', //导入外部数据文件夹
  PlotIconPath: AppPath + 'Common/PlotData/SymbolIcon', //标绘符号图标地址
  PlotLibPath: AppPath + 'Common/PlotData/Symbol', //标绘符号库地址
  // 游客目录
  CustomerPath: AppPath + 'User/Customer/', // 存放游客数据
  RelativePath,
  RelativeFilePath,
  Module,
}
