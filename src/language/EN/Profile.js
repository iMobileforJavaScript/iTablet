//我的、发现
const Profile = {
  LOGIN_NOW: 'Login',
  IMPORT: 'Import',
  DATA: 'Data',
  MARK: 'Mark',
  MAP: 'Map',
  SCENE: 'Scene',
  BASEMAP: 'Base Map',
  SYMBOL: 'Symbol',
  SETTINGS: 'Settings',
  COLOR_SCHEME: 'Color Scheme',
  TEMPLATE: 'Template',
  COLLECTION_TEMPLATE: 'Surveying Template',
  PLOTTING_TEMPLATE: 'Plotting Template',
  NAVIGATION: 'Navigation',
  INCREMENT: 'Increment',
  ENCLOSURE: 'Enclosure',

  //我的——登录
  LOGIN: 'Login',
  LOGIN_CURRENT: 'Current user is already logged in',
  LOGIN_INVALID: 'Login expired. Please login again',
  MOBILE_LOGIN: 'Mobile Login',
  EMAIL_LOGIN: 'Email Login',
  ENTER_EMAIL_OR_USERNAME: 'Please enter your email or username',
  ENTER_MOBILE: 'Please enter your mobile number',
  ENTER_PASSWORD: 'Please enter your password',
  REGISTER: 'Register',
  FORGET_PASSWORD: 'Forgot password?',
  RESET_PASSWORD: 'Reset Password',
  MOBILE_REGISTER: 'Mobile Register',
  EMAIL_REGISTER: 'Email Register',
  ENTER_USERNAME: 'Please enter your username',
  ENTER_USERNAME2: 'Please enter user name',
  ENTER_CODE: 'Please enter your code',
  GET_CODE: 'Get Code',
  ENTER_EMAIL: 'Please enter your email',
  ENTER_SERVER_ADDRESS: 'Please enter server address',
  ENTER_VALID_SERVER_ADDRESS: 'Please enter a valid server address',
  ENTER_REALNAME: 'Please enter your real name',
  ENTER_COMPANY: 'Please enter your company',
  REGISTER_READ_PROTOCAL: 'I have read and agree to the ',
  REGISTER_ONLINE_PROTOCAL: 'SuperMap Terms of Service and Privacy Policy',
  CONNECTING: 'Connecting',
  CONNECT_SERVER_FAIL:
    'Failed to connect to the server, please check the network or server address',
  NEXT: 'Next',
  //
  SHARE: 'Share',
  PATH: 'Path',

  LOCAL: 'Local',
  SAMPLEDATA: 'Sampledata',
  ON_DEVICE: 'UserData',
  EXPORT_DATA: 'Export Data',
  IMPORT_DATA: 'Import Data',
  UPLOAD_DATA: 'Share Data',
  DELETE_DATA: 'Delete Data',
  OPEN_DATA: 'Open Data',
  NEW_DATASET: 'Create Dataset',
  UPLOAD_DATASET: 'Share Dataset',
  DELETE_DATASET: 'Delete Dataset',
  UPLOAD_MAP: 'Share Map',
  EXPORT_MAP: 'Export Map',
  DELETE_MAP: 'Delete Map',
  UPLOAD_SCENE: 'Share Scene',
  DELETE_SCENE: 'Delete Scene',
  UPLOAD_SYMBOL: 'Share Symbol',
  DELETE_SYMBOL: 'Delete Symbol',
  UPLOAD_TEMPLATE: 'Share Template',
  DELETE_TEMPLATE: 'Delete Template',
  UPLOAD_MARK: 'Share Mark',
  DELETE_MARK: 'Delete Mark',
  UPLOAD_COLOR_SCHEME: 'Share Color Scheme',
  DELETE_COLOR_SCHEME: 'Delete Color Scheme',
  BATCH_SHARE: 'Batch Share',
  BATCH_DELETE: 'Batch Delete',
  BATCH_OPERATE: 'Batch Operation',

  ABOUT: 'About',
  SERVICE_HOTLINE: 'Service Hotline',
  SALES_CONSULTATION: 'Sales Consultation',
  BUSINESS_WEBSITE: 'Business Website',
  SERVICE_AGREEMENT: 'Service Agreement',
  PRIVACY_POLICY: 'Privacy Policy',
  HELP_MANUAL: 'Help Manual',

  SWITCH_ACCOUNT: 'Switch Account',
  LOG_OUT: 'Log out',

  SWITCH_CURRENT: 'You are already loged in with this user',
  SWITCHING: 'Switching...',
  SWITCH_FAIL: 'Switch failed, please try to login with this user again',

  //地图服务地址
  SERVICE_ADDRESS: 'Service Address',
  MAP_NAME: 'Map Name',
  ENTER_SERVICE_ADDRESS: 'Please enter the Service Address',
  SAVE: 'Save',

  //我的服务
  SERVICE: 'Service',
  MY_SERVICE: 'Service',
  PRIVATE_SERVICE: 'Private Service',
  PUBLIC_SERVICE: 'Public Service',
  DELETE: 'Delete',
  //个人主页
  MY_ACCOUNT: 'My Account',
  PROFILE_PHOTO: 'Profile Photo',
  USERNAME: 'Username',
  PHONE: 'Phone',
  E_MAIL: 'E-mail',
  CONNECT: 'Connect',
  MANAGE_ACCOUNT: 'Manage Account',
  ADD_ACCOUNT: 'Add Account',
  DELETE_ACCOUNT: 'Delete Account',
  UNABLE_DELETE_SELF: 'Unable to delete current user',

  DELETE_SERVICE: 'Delete Service',
  PUBLISH_SERVICE: 'Publish',
  SET_AS_PRIVATE_SERVICE: 'Set as Private Service',
  SET_AS_PUBLIC_SERVICE: 'Set as Public Service',
  SET_AS_PRIVATE_DATA: 'Set as Private Data',
  SET_AS_PUBLIC_DATA: 'Set as Public Data',

  NO_SERVICE: 'No Service',

  SELECT_ALL: 'Select All',
  DESELECT_ALL: 'Deselect All',

  MAP_ONLINE: 'Online Map',
  MAP_2D: '2D Map',
  MAP_3D: '3D Map',
  BROWSE_MAP: 'Browse',

  GET_DATA_FAILED: 'Failed to get data',

  //创建数据集
  PLEASE_ADD_DATASET: 'Please add dataset',
  ADD_DATASET: 'Add Dataset',
  ENTER_DATASET_NAME: 'Please enter dataset name',
  SELECT_DATASET_TYPE: 'Please select dataset type',
  DATASET_NAME: 'Dataset Name',
  DATASET_TYPE: 'Dataset type',
  DATASET_TYPE_POINT: 'point',
  DATASET_TYPE_LINE: 'line',
  DATASET_TYPE_REGION: 'region',
  DATASET_TYPE_TEXT: 'text',
  CLEAR: 'Clear',
  CREATE: 'Create',

  //创建数据源
  NEW_DATASOURCE: 'Create Datasource',
  SET_DATASOURCE_NAME: 'Set Datasource Name',
  ENTER_DATASOURCE_NAME: 'Please enter datasource name',
  OPEN_DATASROUCE_FAILED: 'Failed to open datasource',

  SELECT_DATASET_EXPORT_TYPE: 'Select format for export',
  DATASET_EXPORT_NOT_SUPPORTED: 'Export of this dataset is not supported yet',

  //搜索
  SEARCH: 'Search',
  NO_SEARCH_RESULT: 'No search result',

  //设置
  STATUSBAR_HIDE: 'StatusBar Hide',
  SETTING_LICENSE: 'License',
  SETTING_ABOUT_ITABLET: 'About iTablet',
  SETTING_CHECK_VERSION: 'Check Version',
  SETTING_LANGUAGE: 'Language',
  SETTING_LANGUAGE_AUTO: 'Auto',
  //许可
  LICENSE_CURRENT: 'License Current',
  LICENSE_TYPE: 'License Type',
  LICENSE_TRIAL: 'License Trial',
  LICENSE_OFFICIAL: 'License Official',
  LICENSE_STATE: 'License State',
  LICENSE_SURPLUS: 'License Surplus ',
  LICENSE_DAY: ' Day',
  LICENSE_CONTAIN_MODULE: 'License Contain Module',
  LICENSE_OFFICIAL_INPUT: 'License Official Input',
  LICENSE_TRIAL_APPLY: 'License Trial Apply',
  LICENSE_OFFICIAL_CLEAN: 'License Official Clean',
  LICENSE_CLEAN_CANCLE: 'Clean Cancle',
  LICENSE_CLEAN_CONTINUE: 'Clean Continue',
  LICENSE_CLEAN_ALERT:
    'The number of licenses will be deducted from the next activation after clearing the license. The current remaining license number:',
  INPUT_LICENSE_SERIAL_NUMBER: 'Input License Serial Number',
  PLEASE_INPUT_LICENSE_SERIAL_NUMBER: 'Please Input License Serial Number',
  PLEASE_INPUT_LICENSE_SERIAL_NUMBER_NOT_CORRECT:
    'The input license serial number is not correct',
  LICENSE_SERIAL_NUMBER_ACTIVATION_SUCCESS: 'Serial Number Activat Success',
  LICENSE_REGISTER_BUY: 'Register Buy',
  LICENSE_HAVE_REGISTER: 'Have Registerd',
  LICENSE_NOT_CONTAIN_MODULE: 'Not Contain Module',
  LICENSE_MODULE_REGISTER_SUCCESS: 'Module Register Success',
  LICENSE_EXIT: 'Exit',
  LICENSE_EXIT_FAILED: 'Exit Failed',
  LICENSE_CURRENT_EXPIRE: 'Current License Invalid',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE:
    'This module is not included under the current license',
  LICENSE_NOT_CONTAIN_CURRENT_MODULE_SUB:
    'This module is not included under the current license and some of its functions will be unavailable！！！',
  //许可模块
  Core_Dev: 'Core Dev',
  Core_Runtime: 'Core Runtime',
  Navigation_Dev: 'Navigation Dev',
  Navigation_Runtime: 'Navigation Runtime',
  Realspace_Dev: 'Realspace Dev',
  Realspace_Runtime: 'Realspace Runtime',
  Plot_Dev: 'Plot Dev',
  Plot_Runtime: 'Plot Runtime',
  Industry_Navigation_Dev: 'Industry Navigation Dev',
  Industry_Navigation_Runtime: 'Industry Navigation Runtime',
  Indoor_Navigation_Dev: 'Indoor Navigation Dev',
  Indoor_Navigation_Runtime: 'Indoor Navigation Runtime',
  Plot3D_Dev: 'Plot3D Dev',
  Plot3D_Runtime: 'Plot3D Runtime',
  Realspace_Analyst_Dev: 'Realspace Analyst Dev',
  Realspace_Analyst_Runtime: 'Realspace Analyst Runtime',
  Realspace_Effect_Dev: 'Realspace Effect Dev',
  Realspace_Effect_Runtime: 'Realspace Effect Runtime',
}
export { Profile }
