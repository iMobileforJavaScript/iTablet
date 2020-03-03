//提示语
const Prompt = {
  YES: 'Yes',
  NO: 'No',
  SAVE_TITLE: 'Do you want to save the changes to the current map?',
  SAVE_YES: 'Yes',
  SAVE_NO: 'No',
  CANCEL: 'Cancel',
  COMMIT: 'Commit',
  REDO: 'Redo',
  UNDO: 'Undo',
  SHARE: 'Share',
  DELETE: 'Delete',
  WECHAT: 'Wechat',
  BEGIN: 'Begin',
  STOP: 'Stop',
  FIELD_TO_PAUSE: 'Failed to pause',
  WX_NOT_INSTALLED: 'Wechat not installed',
  WX_SHARE_FAILED: 'Wechat share failed,Please check wechat install',
  RENAME: 'Rename',
  BATCH_DELETE: 'Batch Delete',

  DOWNLOAD_SAMPLE_DATA: 'Download the sample data?',
  DOWNLOAD: 'Download',
  DOWNLOADING: 'Loading',
  DOWNLOAD_SUCCESSFULLY: 'Done',
  DOWNLOAD_FAILED: 'Failed to Download',

  NO_REMINDER: 'No reminder',

  LOG_OUT: 'Are you sure you want to log out?',
  FAILED_TO_LOG: 'Failed to Login',
  INCORRECT_USER_INFO: 'Account not exist or password error',
  INCORRECT_IPORTAL_ADDRESS:
    'Failed to Login, Please check your server address',

  DELETE_STOP: 'Are you sure you want to delete stop?',
  DELETE_OBJECT: 'Are you sure you want to permanently delete the Object?',

  CONFIRM: 'Confirm',
  COMPLETE: 'Complete',

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
  ADD_MAP_FAILED: 'Can not add current map',
  CREATE_THEME_FAILED: 'Failed to Create Theme',
  PLEASE_ADD_DATASET: 'Please add the dataset',
  PLEASE_SELECT_OBJECT: 'Please select an object to edit',
  SWITCHING_PLOT_LIB: 'Switching',
  NON_SELECTED_OBJ: 'No object selected',
  CHANGE_BASE_MAP: 'Empty base map, please change first',

  SET_ALL_MAP_VISIBLE: 'All visible',
  SET_ALL_MAP_INVISIBLE: 'All invisible',
  LONG_PRESS_TO_SORT: '(Long press to sort)',

  PUBLIC_MAP: 'Public Map',
  SUPERMAP_FORUM: 'SuperMap Forum',
  SUPERMAP_KNOW: 'SuperMap Know',
  SUPERMAP_GROUP: 'SuperMap Group',

  INSTRUCTION_MANUAL: 'Instruction Manual',
  THE_CURRENT_LAYER: 'The current layer is',
  ENTER_KEY_WORDS: 'Please enter key words',
  SEARCHING: 'Searching',
  READING_DATA: 'Reading Data',
  CREATE_SUCCESSFULLY: 'Created Successfully',
  NO_SCENE_LIST: 'No data',
  SAVE_SUCCESSFULLY: 'Saved Successfully',
  NO_NEED_TO_SAVE: 'No need to save',
  SAVE_FAILED: 'Failed to Save',
  ENABLE_DYNAMIC_PROJECTION: 'Enable Dynamic Projection?',
  TURN_ON: 'Turn on',
  CREATE_FAILED: 'Create failed',
  INVALID_DATASET_NAME: 'Invalid dataset name or the name already exists',

  NO_PLOTTING_DEDUCTION: 'No Plotting Deduction in the current map',
  NO_FLY: 'No Fly in the current scene',
  PLEASE_OPEN_SCENE: 'Please open a scene',
  NO_SCENE: 'No Scene',

  PLEASE_ENTER_TEXT: 'Please enter text',

  PLEASE_SELECT_THEMATIC_LAYER: 'Please select a thematic layer',
  THE_CURRENT_LAYER_CANNOT_BE_STYLED:
    'The current layer cannot be styled, and please reselect another one',

  PLEASE_SELECT_PLOT_LAYER: 'Please Select Plot Layer',
  DONOT_SUPPORT_ARCORE: 'This Device does not support ARCore',
  PLEASE_NEW_PLOT_LAYER: 'Please Create New Plot Layer',
  DOWNLOADING_PLEASE_WAIT: 'Downloading Please Wait',
  SELECT_DELETE_BY_RECTANGLE: 'Please select delete item by rectangle select',

  CHOOSE_LAYER: 'Choose Layer',

  COLLECT_SUCCESS: 'Collect Success',

  SELECT_TWO_MEDIAS_AT_LEAST: 'You have to select two medias at least',

  NETWORK_REQUEST_FAILED: 'Network Request Failed',

  OPENING: 'Opening',

  SAVEING: 'Saveing',
  CREATING: 'Creating',
  PLEASE_ADD_DATASOURCE: 'Please Add a Datasource',
  NO_ATTRIBUTES: 'No Attributes',
  NO_SEARCH_RESULTS: 'No search results',

  READING_TEMPLATE: 'Reading Template',
  SWITCHED_TEMPLATE: 'Switched Template',
  THE_CURRENT_SELECTION: 'The current selection is ',

  IMPORTING_DATA: 'Importing Data',
  DATA_BEING_IMPORT: 'Data is being import',
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
  DELETE_CONFIRM: 'Are you sure you want to delete the item?',
  BATCH_DELETE_CONFIRM: 'Are you sure you want to delete the selected item(s)?',

  SELECT_AT_LEAST_ONE: 'Please select at least one item',
  DELETE_MAP_RELATE_DATA: 'Following map(s) will be affected, continue?',

  LOG_IN: 'Loading',
  ENTER_MAP_NAME: 'Please enter the map name',
  CLIP_ENTER_MAP_NAME: 'Enter the map name',
  ENTER_NAME: 'Please enter the name',
  ENTER_SERVICE_ADDRESS: 'Please enter the Service Address',
  ENTER_ANIMATION_NAME: 'Please enter the animation name',
  ENTER_ANIMATION_NODE_NAME: 'Please enter the animation node name',
  PLEASE_SELECT_PLOT_SYMBOL: 'Please select plot symbol',

  CLIPPING: 'Clipping',
  CLIPPED_SUCCESS: 'Clipped Successfully',
  CLIP_FAILED: 'Failed to Clip',

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

  EXPORTING: 'Exporting',
  EXPORT_SUCCESS: 'Exported Successfully',
  EXPORT_FAILED: 'Failed to Export',
  EXPORT_TO: 'Data have been exported to:',
  REQUIRE_PRJ_1984: 'PrjCoordSys of the dataset must be WGS_1984',

  UNDO_FAILED: 'Failed to Undo',
  REDO_FAILED: 'Failed to Redo',
  RECOVER_FAILED: 'Failed to Recover',

  SETTING_SUCCESS: 'Setted Successfully',
  SETTING_FAILED: 'Failed to Set',

  NETWORK_ERROR: 'Network Error',
  NO_NETWORK: 'No Internet connection',
  CHOOSE_CLASSIFY_MODEL: 'Choose Classify Model',
  USED_IMMEDIATELY: 'Used Immediately',
  USING: 'Using',
  DEFAULT_MODEL: 'Default Model',
  DUSTBIN_MODEL: 'Dustbin Model',
  LANT_MODEL: 'Lant Model',
  CHANGING: 'Changing',
  CHANGE_SUCCESS: 'Change Success',
  CHANGE_FAULT: 'Change Fault',
  DETECT_DUSTBIN_MODEL: 'Dustbin Model',
  ROAD_MODEL: 'Road Model',

  LICENSE_EXPIRED:
    'The trial license has expired. Do you want to continue the trial?',
  APPLY_LICENSE: 'Apply License',
  APPLY_LICENSE_FIRST: 'Please apply a valid license first',

  GET_LAYER_GROUP_FAILD: 'Failed to get layer group',
  TYR_AGAIN_LATER: ' Please try again later',

  LOCATING: 'locating',
  CANNOT_LOCATION: 'Failed to locat',
  INDEX_OUT_OF_BOUNDS: 'Index out of bounds',
  PLEASE_SELECT_LICATION_INFORMATION: 'Please set up Location',
  OUT_OF_MAP_BOUNDS: 'Out of map bounds',
  CANT_USE_TRACK_TO_INCREMENT_ROAD:
    "The current location is out of map bounds so that you can't use tracking to increment road",

  POI: 'POI',

  ILLEGAL_DATA: 'Illegal Data!',

  UNSUPPORTED_LAYER_TO_SHARE: 'Sharing of this layer is not supported yet',
  SELECT_DATASET_TO_SHARE: 'Please select the data set to share',
  ENTER_DATA_NAME: 'Please enter the data name',
  SHARED_DATA_10M: ' The file over 10MB cannot be shared',

  PHIONE_HAS_BEEN_REGISTERED: 'The mobile number is registered',
  NICKNAME_IS_EXISTS: 'The username already exists',
  VERIFICATION_CODE_ERROR: 'Verification code is incorrect or invalid',
  VERIFICATION_CODE_SENT: 'Verification code has been sent.',
  EMAIL_HAS_BEEN_REGISTERED: 'The E-mail is registered',
  REGISTERING: 'Registering',
  REGIST_SUCCESS: 'Registered Successfully',
  REGIST_FAILED: 'Failed to Register',
  GOTO_ACTIVATE: 'Please download the Trial License to the mailbox',
  ENTER_CORRECT_MOBILE: 'Please enter the correct mobile phone number',
  ENTER_CORRECT_EMAIL: 'Please enter the correct email address',

  //设置菜单提示信息
  ROTATION_ANGLE_ERROR: 'Rotation angle should be between -360° and 360°',
  MAP_SCALE_ERROR: 'Input error! Please enter a number',
  VIEW_BOUNDS_ERROR: 'Range error! Please enter a number',
  VIEW_BOUNDS_RANGE_ERROR:
    'Parameter error! Both height and width of the view should be greater than zero',
  MAP_CENTER_ERROR: 'Coordinate error! Both X and Y should be numbers',
  COPY_SUCCESS: 'Coping success!',
  //复制坐标系
  COPY_COORD_SYSTEM_SUCCESS: 'Coordinate system replication successfully',
  COPY_COORD_SYSTEM_FAIL: 'Coordinate system replication failed',
  ILLEGAL_COORDSYS: 'Not a supported coordinate system file',

  TRANSFER_PARAMS: 'Param error! Please enter a number',
  PLEASE_ENTER: 'Please enter ',

  REQUEST_TIMEOUT: 'Request timeout',

  IMAGE_RECOGNITION_ING: 'Loading',
  IMAGE_RECOGNITION_FAILED: 'Image recognition failed',

  ERROR_INFO_INVALID_URL: 'Invalid url',
  ERROR_INFO_NOT_A_NUMBER: 'This is not a number',
  ERROR_INFO_START_WITH_A_LETTER: 'The name can only start with a letter.',
  ERROR_INFO_ILLEGAL_CHARACTERS: 'The name can not contain illegal characters.',
  ERROR_INFO_EMPTY: 'The name can not be empty.',

  OPEN_LOCATION: 'Please open Location Service in System Setting',
  REQUEST_LOCATION: 'iTablet need location permission to complete the action',
  LOCATION_ERROR: 'Location request failed, please try agagin later',

  OPEN_THRID_PARTY: "You're going to open a thirty-party app, continue?",

  FIELD_ILLEGAL: 'Field illegal',
  PLEASE_SELECT_A_RASTER_LAYER: 'Please select a raster layer',

  PLEASE_ADD_DATASOURCE_BY_UNIFORM: 'Please add the Datasource by Uniform',
  CURRENT_LAYER_DOSE_NOT_SUPPORT_MODIFICATION:
    'The current layer does not support modification',

  FAILED_TO_CREATE_POINT: 'Failed to create point',
  FAILED_TO_CREATE_TEXT: 'Failed to create text',
  FAILED_TO_CREATE_LINE: 'Failed to create line',
  FAILED_TO_CREATE_REGION: 'Failed to create region',
  CLEAR_HISTORY: 'Clear history',
  //导航相关
  SEARCH_AROUND: 'Search around',
  GO_HERE: 'Go here',
  SHOW_MORE_RESULT: 'Show more results',
  PLEASE_SET_BASEMAP_VISIBLE: 'Please set basemap visible',
  NO_NETWORK_DATASETS: "Current workspace doesn't contain network dataset",
  NO_LINE_DATASETS: "Current workspace doesn't contain line dataset",
  NETWORK_DATASET_IS_NOT_AVAILABLE: 'Current network dataset is not available',
  POINT_NOT_IN_BOUNDS:
    "The bounds of the selected network dataset donsn't contains the point",
  POSITION_OUT_OF_MAP:
    'Your location is out of the bounds of map, please use simulate navigation',
  SELECT_DATASOURCE_FOR_NAVIGATION: 'Select data for navigation',
  PLEASE_SELECT_NETWORKDATASET: 'Select a network dataset first',
  PLEASE_SELECT_A_POINT_INDOOR: 'Please select point indoor',
  PATH_ANALYSIS_FAILED:
    'Path analysis failed! Please re-select the start and end points',
  ROAD_NETWORK_UNLINK:
    'Path analysis failed due to the disconnected road network from start-point to end-point',

  CHANGE_TO_OUTDOOR: 'switch to outdoor?',
  CHANGE_TO_INDOOR: 'switch to indoor?',
  SET_START_AND_END_POINTS: 'Please set the start and end points first',
  SELECT_LAYER_NEED_INCREMENTED:
    'Please select the layer need to be incremented',
  SELECT_THE_FLOOR: 'Please select the floor which the layer is located',
  LONG_PRESS_ADD_START: 'Please long press to add starting point',
  LONG_PRESS_ADD_END: 'Please long press to add destination',
  ROUTE_ANALYSING: 'Analysing',
  DISTANCE_ERROR:
    'The destination is too close to the start point,please reselect!',
  USE_ONLINE_ROUTE_ANALYST:
    "Points are out of dataset's bounds or there are no dataset around points, do you want to use online route analyst?",
  NOT_SUPPORT_ONLINE_NAVIGATION: 'Online navigation is not support yet.',

  //自定义专题图
  ONLY_INTEGER: 'Only integers can be entered!',
  ONLY_INTEGER_GREATER_THAN_2: 'Only integers greater than 2 can be entered!',
  PARAMS_ERROR: 'Params error! Failed to set!',
  SPEECH_TIP: "You may say:\n'Zoom in'，'Zoom out'，'Locate' or 'Close'",
  SPEECH_ERROR: 'Recognize error, please try again later',
  SPEECH_NONE: "You didn't seem to speak anything",

  NOT_SUPPORT_STATISTIC: 'The field not support statistic',
  ATTRIBUTE_DELETE_CONFIRM: 'Sure Delete this Attribute Field?',
  ATTRIBUTE_DELETE_TIPS: 'Can not recoverable after delete attribute',
  ATTRIBUTE_DELETE_SUCCESS: 'Attribute Field Delete Succeed',
  ATTRIBUTE_DELETE_FAILED: 'Attribute Field Delete Failed',
  ATTRIBUTE_ADD_SUCCESS: 'Attribute Add Succeed',
  ATTRIBUTE_ADD_FAILED: 'Attribute Add Failed',
  ATTRIBUTE_DEFAULT_VALUE_IS_NULL: 'Default value is null',
}

export { Prompt }
