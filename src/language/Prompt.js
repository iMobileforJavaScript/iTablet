//提示语
const Chinese = {
  SAVE_TITLE: '是否保存当前地图',
  SAVE_YES: '保存',
  SAVE_NO: '不保存',
  CANCEL: '取消',
  SHARE: '分享',
  DELETE: '删除',
  WECHAT: '微信',

  DOWNLOAD_SAMPLE_DATA: '是否下载样例数据？',
  DOWNLOAD: '下载',
  DOWNLOADING: '下载中',
  DOWNLOAD_SUCCESSFULLY: '已下载',
  DOWNLOAD_FAILED: '下载失败',

  NO_REMINDER: '下次不再提醒',

  LOG_OUT: '是否退出登录？',

  DELETE_STOP: '确认删除站点？',
  DELETE_OBJECT: '确定要永久删除该对象吗?',

  CONFIRM: '确定',

  QUIT: '确认退出SuperMap iTablet?',
  MAP_LOADING: '地图加载中',
  LOADING: '加载中',
  THE_MAP_IS_OPENED: '该地图已打开',
  THE_SCENE_IS_OPENED: '该场景已打开',
  SWITCHING: '正在切换地图',
  CLOSING: '正在关闭地图',
  CLOSING_3D: '正在关闭地图',
  SAVING: '正在保存地图',
  SWITCHING_SUCCESS: '切换成功',
  ADD_SUCCESS: '添加成功',
  ADD_FAILED: '添加失败',
  PLEASE_SELECT_OBJECT: '请选择编辑对象',

  PUBLIC_MAP: '公共地图',
  SUPERMAP_FORUM: '超图论坛',
  SUPERMAP_KNOW: '超图知道',
  INSTRUCTION_MANUAL: '使用帮助',
  THE_CURRENT_LAYER: '当前图层为',
  ENTER_KEY_WORDS: '请输入搜索关键字',
  SERCHING: '搜索中',
  READING_DATA: '读取数据中',
  CREATE_SUCCESSFULLY: '创建成功',
  SAVE_SUCCESSFULLY: '保存成功',
  TURN_ON_AUTO_SPLIT_REGION: '是否开启动态投影',
  TURN_ON: '是',

  NO_FLY: '当前场景无飞行轨迹',
  PLEASE_OPEN_SCENE: '请打开场景',
  NO_SCENE: '无场景显示',

  PLEASE_ENTER_TEXT: '请输入文本内容',
  PLEASE_SELECT_THEMATIC_LAYER: '请先选择专题图层',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED: '当前图层无法设置风格，请重新选择图层',

  NETWORK_REQUEST_FAILED: '网络请求失败',

  CREATING: '正在创建',
  PLEASE_ADD_DATASOURCE: '请先添加数据源',
  NO_ATTRIBUTES: '暂无属性',

  READING_TEMPLATE: '正在读取模板',
  SWITCHED_TEMPLATE: '已为您切换模板',
  THE_CURRENT_SELECTION: '当前选择为 ',

  IMPORTING_DATA: '正在导入数据',
  IMPORTING: '导入中...',
  IMPORTED_SUCCESS: '导入成功',
  FAILED_TO_IMPORT: '导入失败',
  IMPORTED_3D_SUCCESS: '导入3D成功',
  FAILED_TO_IMPORT_3D: '导入3D失败',
  DELETING_DATA: '删除数据中',
  DELETING_SERVICE: '删除服务中',
  DELETED_SUCCESS: '删除成功',
  FAILED_TO_DELETE: '删除失败',
  PUBLISHING: '发布服务中',
  PUBLISH_SUCCESS: '发布成功',
  PUBLISH_FAILED: '发布失败',

  LOG_IN: '登录中',
  ENTER_MAP_NAME: '请输入地图名字',
  ENTER_NAME: '请输入名称',

  CLIPPING: '地图裁剪中',
  CLIPPED_SUCCESS: '裁剪成功',

  LAYER_CANNOT_CREATE_THEMATIC_MAP: '不支持由该图层创建专题图',

  ANALYSING: '路径分析中',
  CHOOSE_STARTING_POINT: '请输入起点',
  CHOOSE_DESTINATION: '请输入终点',

  LATEST: '最后修改时间: ',
  GEOGRAPHIC_COORDINATE_SYSTEM: '地理坐标系: ',
  PROJECTED_COORDINATE_SYSTEM: '投影坐标系: ',
  FIELD_TYPE: '字段类型: ',

  PLEASE_LOGIN_AND_SHARE: '请登陆后再分享',
  SHARING: '分享中',
  SHARE_SUCCESS: '分享成功',
  SHARE_FAILED: '分享失败',
  SHARE_PREPARE: '准备分享',
  SHARE_START: '开始分享',

  EXPORT_SUCCESS: '导出成功',
  EXPORT_FAILED: '导出失败',

  UNDO_FAILED: '撤销失败',
  REDO_FAILED: '恢复失败',
  RECOVER_FAILED: '还原失败',

  SETTING_SUCCESS: '设置成功',
  SETTING_FAILED: '设置失败',
  NETWORK_ERROR: '网络错误',

  LICENSE_EXPIRED: '试用许可已过期,请更换许可后重启',
  APPLY_LICENSE: '申请许可',
}
const English = {
  SAVE_TITLE: 'Do you want to save the changes to the current map?',
  SAVE_YES: 'Yes',
  SAVE_NO: 'No',
  CANCEL: 'Cancel',
  SHARE: 'Share',
  DELETE: 'Delete',
  WECHAT: 'Wechat',

  DOWNLOAD_SAMPLE_DATA: 'Download the sample data?',
  DOWNLOAD: 'Download',
  DOWNLOADING: 'Loading',
  DOWNLOAD_SUCCESSFULLY: 'Done',
  DOWNLOAD_FAILED: 'Failed to Download',

  NO_REMINDER: 'No reminder',

  LOG_OUT: 'Are you sure you want to log out?',

  DELETE_STOP: 'Are you sure you want to delete stop?',
  DELETE_OBJECT: 'Are you sure you want to permanently delete the Object?',

  CONFIRM: 'Confirm',

  QUIT: 'Quit SuperMap iTablet?',
  MAP_LOADING: 'Loading',
  LOADING: 'Loading',
  THE_MAP_IS_OPENED: 'The map is opened',
  THE_SCENE_IS_OPENED: 'The scene is opened',
  SWITCHING: 'Switching',
  CLOSING: 'Closing',
  CLOSING_3D: 'Closing',
  SAVING: 'Saving',
  SWITCHING_SUCCESS: 'Switch Successfully',
  ADD_SUCCESS: 'Added Successfully',
  ADD_FAILED: 'Failed to Add',
  PLEASE_SELECT_OBJECT: 'Please select an object to edit',

  PUBLIC_MAP: 'Public Map',
  SUPERMAP_FORUM: 'SuperMap Forum',
  SUPERMAP_KNOW: 'SuperMap Know',
  INSTRUCTION_MANUAL: 'Instruction Manual',
  THE_CURRENT_LAYER: 'The current layer is',
  ENTER_KEY_WORDS: 'Please enter key words',
  SEARCHING: 'Searching',
  READING_DATA: 'Reading Data',
  CREATE_SUCCESSFULLY: 'Created Successfully',
  SAVE_SUCCESSFULLY: 'Saved Successfully',
  TURN_ON_AUTO_SPLIT_REGION: 'Turn on Auto Split Region?',
  TURN_ON: 'Turn on',

  NO_FLY: 'No Fly in the current scene',
  PLEASE_OPEN_SCENE: 'Please open a scene',
  NO_SCENE: 'No Scene',

  PLEASE_ENTER_TEXT: 'Please enter text',

  PLEASE_SELECT_THEMATIC_LAYER: 'Please select a thematic layer',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED:
    'The current layer cannot be styled, and please reselect another one',

  NETWORK_REQUEST_FAILED: 'Network Request Failed',

  CREATING: 'Creating',
  PLEASE_ADD_DATASOURCE: 'Please Add a Datasource',
  NO_ATTRIBUTES: 'No Attributes',

  READING_TEMPLATE: 'Reading Template',
  SWITCHED_TEMPLATE: 'Switched Template',
  THE_CURRENT_SELECTION: 'The current selection is ',

  IMPORTING_DATA: 'Importing Data',
  IMPORTING: 'Importing',
  IMPORTED_SUCCESS: 'Imported Successfully',
  FAILED_TO_IMPORT: 'Failed to Import',
  IMPORTED_3D_SUCCESS: 'Imported Successfully',
  FAILED_TO_IMPORT_3D: 'Failed to Import',
  DELETING_DATA: 'Deleting Data',
  DELETING_SERVICE: 'Deleting Service',
  DELETED_SUCCESS: 'Deleted Successfully',
  FAILED_TO_DELETE: 'Failed to Delete',
  PUBLISHING: 'Publishing',
  PUBLISH_SUCCESS: 'Published Successfully',
  PUBLISH_FAILED: 'Failed to Publish',

  LOG_IN: 'Loading',
  ENTER_MAP_NAME: 'Please enter the map name',
  ENTER_NAME: 'Please enter the name',

  CLIPPING: 'Clipping',
  CLIPPED_SUCCESS: 'Clipped Successfully',

  LAYER_CANNOT_CREATE_THEMATIC_MAP:
    'The current layer cannot be used to create a thematic map.',

  ANALYSING: 'Analysing',
  CHOOSE_STARTING_POINT: 'Choose starting point',
  CHOOSE_DESTINATION: 'Choose destination',

  LATEST: 'Latest: ',
  GEOGRAPHIC_COORDINATE_SYSTEM: 'Geographic Coordinate System: ',
  PROJECTED_COORDINATE_SYSTEM: 'Projected Coordinate System: ',
  FIELD_TYPE: 'Field Type: ',

  PLEASE_LOGIN_AND_SHARE: 'Please log in and share',
  SHARING: 'Sharing',
  SHARE_SUCCESS: 'Shared Successfully',
  SHARE_FAILED: 'Failed to Share',
  SHARE_PREPARE: 'Preparing for sharing',
  SHARE_START: 'Start sharing',

  EXPORT_SUCCESS: 'Exported Successfully',
  EXPORT_FAILED: 'Failed to Export',

  UNDO_FAILED: 'Failed to Undo',
  REDO_FAILED: 'Failed to Redo',
  RECOVER_FAILED: 'Failed to Recover',

  SETTING_SUCCESS: 'Setted Successfully',
  SETTING_FAILED: 'Failed to Set',

  NETWORK_ERROR: 'Network Error',

  LICENSE_EXPIRED:
    'Trial license has expired. Please apply for a new one and restart.',
  APPLY_LICENSE: 'Apply License',
}

export { Chinese, English }
