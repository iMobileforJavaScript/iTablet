//提示语
const Prompt = {
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
  FAILED_TO_LOG: '登录失败',

  DELETE_STOP: '确认删除站点？',
  DELETE_OBJECT: '确定要永久删除该对象吗?',

  CONFIRM: '确定',
  COMPLETE: '完成',

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
  NO_NEED_TO_SAVE: '不需要保存',
  SAVE_FAILED: '保存失败',
  TURN_ON_AUTO_SPLIT_REGION: '是否开启动态投影',
  TURN_ON: '是',

  NO_FLY: '当前场景无飞行轨迹',
  PLEASE_OPEN_SCENE: '请打开场景',
  NO_SCENE: '无场景显示',

  PLEASE_ENTER_TEXT: '请输入文本内容',
  PLEASE_SELECT_THEMATIC_LAYER: '请先选择专题图层',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED: '当前图层无法设置风格，请重新选择图层',

  PLEASE_SELECT_PLOT_LAYER: '请选择或新建标注图层',

  NETWORK_REQUEST_FAILED: '网络请求失败',

  CREATING: '正在创建',
  PLEASE_ADD_DATASOURCE: '请先添加数据源',
  NO_ATTRIBUTES: '暂无属性',
  NO_SEARCH_RESULTS: '无搜索记录',

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
  CLIP_ENTER_MAP_NAME: '请输入地图名字',
  ENTER_SERVICE_ADDRESS: '请输入服务地址',

  ENTER_NAME: '请输入名称',

  CLIPPING: '地图裁剪中',
  CLIPPED_SUCCESS: '裁剪成功',
  CLIP_FAILED: '裁剪失败',

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

  GET_LAYER_GROUP_FAILD: '获取图层组失败',
  TYR_AGAIN_LATER: '请稍后再试',

  LOCATING: '定位中',
  CANNOT_LOCATION: '无法定位',
  INDEX_OUT_OF_BOUNDS: '位置越界',
  PLEASE_SELECT_LICATION_INFORMATION: '请选择定位信息',
  OUT_OF_MAP_BOUNDS: '不在地图范围内',

  POI: '兴趣点',

  SELECT_DATASET_TO_SHARE: '请选择要分享的数据集',
  ENTER_DATA_NAME: '请输入数据名称',
  SHARED_DATA_10M: '所分享文件超过10MB',

  PHIONE_HAS_BEEN_REGISTERED: '手机号已注册',
  NICKNAME_IS_EXISTS: '昵称已存在',
  VERIFICATION_CODE_ERROR: '短信验证码错误',
  VERIFICATION_CODE_SENT: '验证码已发送',
  EMAIL_HAS_BEEN_REGISTERED: '邮箱已注册',
  REGISTERING: '注册中',
  REGIST_SUCCESS: '注册成功',
  REGIST_FAILED: '注册失败',
  GOTO_ACTIVATE: '请前往邮箱激活',
  ENTER_CORRECT_MOBILE: '请输入正确的手机号',
  ENTER_CORRECT_EMAIL: '请输入正确的邮箱号',

  //设置菜单提示信息
  ROTATION_ANGLE_ERROR: '旋转角度应在-360°到360°之间',
  MAP_SCALE_ERROR: '比例输入错误!请输入一个数字',
  VIEW_BOUNDS_ERROR: '范围输入错误!请输入一个数字',
  VIEW_BOUNDS_RANGE_ERROR: '参数错误!窗口宽高不能小于0',
  MAP_CENTER_ERROR: '坐标输入错误!x,y都应该为数字',
  COPY_SUCCESS: '复制成功',
}

export { Prompt }
