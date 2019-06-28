//制图
const Map_Label = {
  MAP: 'Map',
  LAYER: 'Layer',
  ATTRIBUTE: 'Attribute',
  SETTING: 'Setting',
  SCENE: 'Scene',
  NAME: 'Name',
}

//地图、场景主菜单
const Map_Main_Menu = {
  START: 'Start',
  START_OPEN_MAP: 'Open Map',
  START_NEW_MAP: 'New Map',
  START_RECENT: 'Recent',
  START_SAVE_MAP: 'Save Map',
  START_SAVE_AS_MAP: 'Save As ',
  START_OPEN_SENCE: 'Open Scene',
  START_NEW_SENCE: 'New Scene',
  START_SAVE_SENCE: 'Save Scene',
  START_SAVE_AS_SENCE: 'Save As ',

  OPEN: 'Add',
  OPEN_DATASOURCE: 'Datasource',
  OPEN_MAP: 'Map',
  OPEN_BACK: 'Back',

  LEGEND_COLUMN: 'Column Number',
  LEGEND_WIDTH: 'Width',
  LEGEND_HEIGHT: 'Height',
  LEGEND_COLOR: 'Color',

  STYLE: 'Styles',
  STYLE_SYMBOL: 'Symbol',
  STYLE_SYMBOL_SIZE: 'Symbol Size',
  STYLE_COLOR: 'Color',
  STYLE_ROTATION: 'Rotation',
  STYLE_TRANSPARENCY: 'Transparency',
  STYLE_LINE_WIDTH: 'Line Width',
  STYLE_FOREGROUND: 'Foreground',
  STYLE_BACKFROUNG: 'Background',
  STYLE_GRADIENT_FILL: 'Gradient fill',
  STYLE_FRAME_COLOR: 'Frame Color',
  STYLE_FRAME_SYMBOL: 'Frame Symbol',
  STYLE_FONT: 'Font',
  STYLE_FONT_SIZE: 'Font Size',
  STYLE_ALIGNMENT: 'Alignment',
  STYLE_FONT_STYLE: 'Font style',
  STYLE_CONTRAST: 'Contrast',
  STYLE_BRIGHTNESS: 'Brightness',
  STYLE_BOLD: 'Bold',
  STYLE_ITALIC: 'Italic',
  STYLE_UNDERLINE: 'Underline',
  STYLE_STRIKEOUT: 'Strikeout',
  STYLE_OUTLINE: 'Outline',
  STYLE_SHADOW: 'Shadow',
  ROTATE_LEFT: 'Rotate Left',
  ROTATE_RIGHT: 'Rotate Right',
  VERTICAL_FLIP: 'Vertical Flip',
  HORIZONTAL_FLIP: 'Horizontal Flip',

  TOOLS: 'Tools',
  TOOLS_DISTANCE_MEASUREMENT: 'Distance Measurement',
  TOOLS_AREA_MEASUREMENT: 'Area Measurement',
  TOOLS_AZIMUTH_MEASUREMENT: 'Azimuth Measurement',
  TOOLS_SELECT: 'Select',
  TOOLS_RECTANGLE_SELECT: 'Rectangle select',
  TOOLS_ROUND_SELECT: 'Round select',
  FULL_SCREEN: 'Full-Screen',

  PLOTS: 'Mark',
  DOT_LINE: 'Dot Line',
  FREE_LINE: 'Free Line',
  DOT_REGION: 'Dot Region',
  FREE_REGION: 'Free Region',
  TOOLS_3D_CREATE_POINT: 'Create Point',
  TOOLS_CREATE_POINT: 'Create Point',
  TOOLS_CREATE_LINE: 'Create Line',
  TOOLS_CREATE_REGION: 'Create Region',
  TOOLS_CREATE_TRACK: 'Create Track',
  TOOLS_CREATE_TEXT: 'Create Text',

  TOOLS_NAME: 'Name',
  TOOLS_REMARKS: 'Remarks',
  TOOLS_HTTP: 'http Address',
  TOOLS_PICTURES: 'Pictures',
  COLLECT_TIME: 'Time',
  COORDINATE: 'Coordinate',

  TOOLS_RECTANGLE_CLIP: 'Rectangle Clip',
  TOOLS_CIRCLE_CLIP: 'Circle Clip',
  TOOLS_POLYGON_CLIP: 'Polygon Clip',
  TOOLS_SELECT_OBJECT_AREA_CLIP: 'Select Cbject Area Clip',
  TOOLS_CLIP_INSIDE: 'Clip Inside',
  TOOLS_ERASE: 'Erase',
  TOOLS_EXACT_CLIP: 'Exact Clip',
  TOOLS_TARGET_DATASOURCE: 'Target Datasource',
  TOOLS_UNIFIED_SETTING: 'Unified setting',
  TOOLS_MAGNIFIER: 'Magnifier',
  TOOLS_SELECT_ALL: 'Select All',
  TOOLS_SELECT_REVERSE: 'Select Reverse',
  MAP_CLIP: 'Map Clip',
  CLIP: 'Clip',
  CAMERA: 'CAMERA',

  TOOLS_SCENE_SELECT: 'Select',
  TOOLS_PATH_ANALYSIS: 'Path Analysis',
  TOOLS_VISIBILITY_ANALYSIS: 'Visibility Analysis',
  TOOLS_CLEAN_PLOTTING: 'Clean Plotting',

  FLY: 'Fly',
  FLY_ROUTE: 'Flying Route',
  FLY_ADD_STOPS: 'Add Stops',
  FLY_AROUND_POINT: ' Fly around point',

  THEME: 'Create',
  THEME_UNIFORM_MAP: 'Uniform Map',
  THEME_UNIQUE_VALUES_MAP: 'Unique Values Map',
  THEME_RANGES_MAP: 'Ranges Map',
  THEME_UNIFORM_LABLE: 'Uniform Label',
  THEME_UNIQUE_VALUE_LABLE_MAP: 'Unique Value Label Map',
  THEME_RANGES_LABLE_MAP: 'Ranges Label Map',
  THEME_AREA: 'Area',
  THEME_STEP: 'Step',
  THEME_LINE: 'Line',
  THEME_POINT: 'Point',
  THEME_COLUMN: 'Column',
  THEME_3D_COLUMN: '3D Column',
  THEME_PIE: 'Pie',
  THEME_3D_PIE: '3D Pie',
  THEME_ROSE: 'Rose',
  THEME_3D_ROSE: '3D Rose',
  THEME_STACKED_BAR: 'Stacked Bar',
  THEME_3D_STACKED_BAR: '3D stacked Bar',
  THEME_RING: 'Ring',
  THEME_DOT_DENSITY_MAP: 'Dot Density Map',
  THEME_GRADUATED_SYMBOLS_MAP: 'Graduated Symbols Map',
  THEME_HEATMAP: 'HeatMap',

  THEME_HIDE_SYSTEM_FIELDS: 'Hide system fields',
  THEME_EXPRESSION: 'Expression',
  THEME_UNIQUE_EXPRESSION: 'Unique Expression',
  THEME_RANGE_EXPRESSION: 'Range Expression',
  THEME_COLOR_SCHEME: 'Color Scheme',
  THEME_FONT_SIZE: 'Font Size',
  THEME_FONT: 'Font',
  THEME_ROTATION: 'Rotation',
  THEME_COLOR: 'Color',

  THEME_METHOD: 'Method',
  THEME_EQUAL_INTERVAL: 'Equal Interval',
  THEME_SQURE_ROOT_INTERVAL: 'Squre Root Interval',
  THEME_STANDARD_DEVIATION_INTERVAL: 'Standard Deviation Interval',
  THEME_LOGARITHMIC_INTERVAL: 'Logarithmic Interval',
  THEME_QUANTILE_INTERVAL: 'Quantile Interval',
  THEME_MANUAL: 'Manual',

  THEME_BACK_SHAPE: 'Back Shape',
  THEME_DEFAULT: 'Default',
  THEME_RECTANGLE: 'Rectangle',
  THEME_ROUND_RECTANGLE: 'Round Rectangle',
  THEME_ELLIPSE: 'Ellipse',
  THEME_DIAMOND: 'Diamond',
  THEME_TRIANGLE: 'Triangle',
  THEME_MARKER_SYMBOL: 'Marker Symbol',

  THEME_HEATMAP_RADIUS: 'Nuclear Radius',
  THEME_HEATMAP_COLOR: 'Color Scheme',
  THEME_HEATMAP_FUZZY_DEGREE: 'Color Fuzzy Degree',
  THEME_HEATMAP_MAXCOLOR_WEIGHT: 'Max Color Weight',

  THEME_GRANDUATE_BY: 'Granduate by',
  THEME_CONSTANT: 'Constant',
  THEME_LOGARITHM: 'Logarithm',
  THEME_SQUARE_ROOT: 'Square Root',
  THEME_MAX_VISIBLE_SIZE: 'Max Visible Size',
  THEME_MIN_VISIBLE_SIZE: 'Min Visible Size',

  DOT_VALUE: 'Dot Value',
  GRADUATE_BY: 'Graduate by',
  DATUM_VALUE: 'Datum Value',
  RANGE_COUNT: 'Range Count',

  CREATE_WITH_SYMBOLS: 'Create with Symbols',
  CREATE_WITH_TEMPLATE: 'Create with Template',
  COLLECTION: 'Collect',
  COLLECTION_RECENT: 'Recent',
  COLLECTION_SYMBOL: 'Symbol',
  COLLECTION_GROUP: 'Group',
  COLLECTION_UNDO: 'Undo',
  COLLECTION_REDO: 'Redo',
  COLLECTION_CANCEL: 'Cancel',
  COLLECTION_SUBMIT: 'Submit',
  COLLECTION_METHOD: 'Collection Method',
  COLLECTION_POINTS_BY_GPS: 'Collect points by GPS',
  COLLECTION_LINE_BY_GPS: 'Collect line by GPS',
  COLLECTION_POINT_DRAW: 'Point Draw',
  COLLECTION_FREE_DRAW: 'Free Draw',
  COLLECTION_ADD_POINT: 'Add Points',
  COLLECTION_START: 'Start',
  COLLECTION_PAUSE: 'Pause',
  COLLECTION_STOP: 'Stop',

  EDIT: 'Edit',
  EDIT_ADD_NODES: 'Add Nodes',
  EDIT_NODES: 'Edit Nodes',
  EDIT_DELETE: 'Delete',
  EDIT_DELETE_NODES: 'Delete Nodes',
  EDIT_DELETE_OBJECT: 'Delete Object',
  EDIT_ERASE: 'Erase',
  EDIT_SPLIT: 'Split',
  EDIT_UNION: 'Union',
  EDIT_DRAW_HOLLOW: 'Draw Hollow',
  EDIT_PATCH_HOLLOW: 'Patch Hollow',
  EDIT_FILL_HOLLOW: 'Fill Hollow',
  EDIT_CANCEL_SELECTION: 'Cancel Selection',
  MOVE: 'Move',
  FREE_DRAW_ERASE: 'Free-draw Erase',

  PLOTTING_LIB_CHANGE: 'Change Plotting Lib',
  PLOTTING_LIB: 'Plotting Lib',

  SHARE: 'Share',
  SHARE_WECHAT: 'Wechat',
  SHARE_FRIENDS: 'Friends',
  SHARE_EXPLORE: 'Explore',
}

//图层
const Map_Layer = {
  PLOTS: 'My Plots',
  PLOTS_IMPORT: 'Import Marks',
  PLOTS_DELETE: 'Delete Marks',
  PLOTS_SET_AS_CURRENT: 'Set As Current Marks',

  LAYERS: 'My Layers',
  LAYERS_MOVE_UP: 'Move Up',
  LAYERS_MOVE_DOWN: 'Move Down',
  LAYERS_TOP: 'Top',
  LAYERS_BOTTOM: 'Bottom',
  LAYERS_LONG_PRESS: 'Long Press and Drag to Sort',
  LAYERS_SET_AS_CURRENT_LAYER: 'Set As Current Layer',
  LAYERS_FULL_VIEW_LAYER: 'Display This Layer In Full',
  LAYERS_LAYER_STYLE: 'Layer Style',
  LAYERS_FULL_EXTENT: 'Full Extent',
  LAYERS_SET_VISIBLE_SCALE: 'Set Visible Scale',
  LAYERS_RENAME: 'Rename',
  LAYERS_COPY: 'Copy',
  LAYERS_PASTE: 'Paste',
  LAYERS_LAYER_PROPERTIES: 'Layer Properties',
  LAYERS_REMOVE: 'Remove',
  LAYERS_MAXIMUM: 'Maximum Visible Scale',
  LAYERS_MINIMUM: 'Minimum Visible Scale',
  LAYERS_UER_DEFINE: 'User Define',
  LAYERS_SET_AS_CURRENT_SCALE: 'Set as Current Scale',
  LAYERS_CLEAR: 'Clear',
  LAYERS_LAYER_NAME: 'Layer Name',
  LAYERS_COMPLETE_LINE: 'Complete Line',
  LAYERS_OPTIMIZE_CROSS: 'Optimize Cross',
  LAYERS_ANTIALIASING: 'Antialiasing',
  LAYERS_SHOW_OVERLAYS: 'Show Overlays',
  LAYERS_SCALE_SYMBOL: 'Scale Symbol',
  LAYERS_SCALE: 'Scale',
  LAYERS_MIN_OBJECT_SIZE: 'Min Object Size',
  LAYERS_FILTER_OVERLAPPING_SMALL_OBJECTS: 'Filter Overlapping Small Objects',

  LAYERS_CREAT_THEMATIC_MAP: 'Creat Thematic Map',
  LAYERS_MODIFY_THEMATIC_MAP: 'Modify Thematic Map',

  BASEMAP: 'My Basemap',
  BASEMAP_SWITH: 'Switch Basemap',
  MY_TERRAIN: 'My Terrain',

  VISIBLE: 'Visible',
  NOT_VISIBLE: 'Not Visible',
  OPTIONAL: 'Optional',
  NOT_OPTIONAL: 'Not Optional',
  EDITABLE: 'Editable',
  NOT_EDITABLE: 'Not Editable',
  SNAPABLE: 'Snapable',
  NOT_SNAPABLE: 'Not Snapable',
}

//属性
const Map_Attribute = {
  ATTRIBUTE_SORT: 'Sort',
  ATTRIBUTE_LOCATION: 'Location',
  ATTRIBUTE_EDIT: 'Edit',
  ATTRIBUTE_STATISTIC: 'Statistic',
  ATTRIBUTE_ASSOCIATION: 'Association',
  ATTRIBUTE_NO: 'NO.',
  ATTRIBUTE_CURRENT: 'Current',
  ATTRIBUTE_FIRST_RECORD: 'First record',
  ATTRIBUTE_LAST_RECORD: 'Last record',
  ATTRIBUTE_RELATIVE: 'Relative',
  ATTRIBUTE_ABSOLUTE: 'Absolute',
  ATTRIBUTE_UNDO: 'Undo',
  ATTRIBUTE_REDO: 'Redo',
  ATTRIBUTE_REVERT: 'Revert',
}

const Map_Setting = {
  BASIC_SETTING: 'Basic settings',
  ROTATION_GESTURE: 'Rotation Gesture',
  PITCH_GESTURE: 'Pitch Gesture',
  THEME_LEGEND: 'Theme Legend',

  //效果设置
  EFFECT_SETTINGS: 'Effect Settings',
  ANTI_ALIASING_MAP: 'Anti-aliasing Map',
  SHOW_OVERLAYS: 'Show Overlays',

  //范围设置
  BOUNDS_SETTING: 'Bounds settings',
  FIX_SCALE: 'Fixed Scale',

  //三维场景设置
  SCENE_NAME: 'Scene Name',
  FOV: 'FOV',
  SCENE_OPERATION_STATUS: 'Scene Operation Status',
  VIEW_MODE: 'View Mode',
  TERRAIN_SCALE: 'Terrain Scale',
  SPHERICAL: 'Spherical',
}

//地图设置菜单
const Map_Settings = {
  THEME_LEGEND: 'Theme Legend',
  //一级菜单
  BASIC_SETTING: 'Basic Settings',
  RANGE_SETTING: 'Bounds Settings',
  COORDINATE_SYSTEM_SETTING: 'Coordinate System Settings',
  ADVANCED_SETTING: 'Advanced Settings',
  LEGEND_SETTING: 'Legend Settings',

  //二级菜单 基本设置
  MAP_NAME: 'Map Name',
  SHOW_SCALE: 'Show Scale',
  ROTATION_GESTURE: 'Rotation Gesture',
  PITCH_GESTURE: 'Pitch Gesture',
  ROTATION_ANGLE: 'Rotation Angle',
  COLOR_MODE: 'Color Mode',
  BACKGROUND_COLOR: 'Background Color',
  MAP_ANTI_ALIASING: 'Map Anti-aliasing',
  FIX_SYMBOL_ANGLE: 'Fix Symbol Angle',
  FIX_TEXT_ANGLE: 'Fix Text Angle',
  FIX_TEXT_DIRECTION: 'Fix Text Direction',
  SHOW_OVERLAYS: 'Show overlays',

  //二级菜单 范围设置
  MAP_CENTER: 'Map Center',
  MAP_SCALE: 'Map Scale',
  FIX_SCALE_LEVEL: 'Fix Scale Level',
  CURRENT_VIEW_BOUNDS: 'Current View Bounds',

  //二级菜单 坐标系设置
  COORDINATE_SYSTEM: 'Coordinate System',
  COPY_COORDINATE_SYSTEM: 'Copy Coordinate System',
  DYNAMIC_PROJECTION: 'Dynamic Projection',
  TRANSFER_METHOD: 'Transfer Method',

  //二级菜单 高级设置
  FLOW_VISIUALIZATION: 'Flow Visiualization',
  SHOW_NEGATIVE_DATA: 'Show Negative Data',
  AUTOMATIC_AVOIDANCE: 'Automatic Avoidance',
  ZOOM_WITH_MAP: 'Zoom With Map',
  SHOW_TRACTION_LINE: 'Show Traction Line',
  GLOBAL_STATISTICS: 'GLOBAL Statistics',
  CHART_ANNOTATION: 'Chart Annotation',
  SHOW_AXIS: 'Show Axis',
  HISTOGRAM_STYLE: 'Histogram Style',
  ROSE_AND_PIE_CHART_STYLE: 'Rose & Pie Chart Style',

  //三级菜单 颜色模式
  DEFAULT_COLOR_MODE: 'Default Color Mode',
  BLACK_AND_WHITE: 'Black And White',
  GRAY_SCALE_MODE: 'Gray-Scale Mode',
  ANTI_BLACK_AND_WHITE: 'Anti Black And White',
  ANTI_BLACK_AND_WHITE_2: 'Anti Black And White,Other Colors Unchanged',

  //三级菜单 窗口四至范围
  LEFT: 'Left',
  RIGHT: 'Right',
  TOP: 'Top',
  BOTTOM: 'Bottom',

  //三级菜单 坐标系设置
  PLAN_COORDINATE_SYSTEM: 'Plan Coordinate System',
  GEOGRAPHIC_COORDINATE_SYSTEM: 'Geographic Coordinate System',
  PROJECTED_COORDINATE_SYSTEM: 'Projected Coordinate System',

  //三级菜单 复制坐标系
  FROM_DATASOURCE: 'From Datasource',
  FROM_DATASET: 'From Dataset',
  FROM_FILE: 'From File',

  //四级菜单 和复制提示
  TYPE: 'Type',
  FORMAT: 'Format',
  DATASOURCES: 'Datasources',
  DATASETS: 'Datasets',
  ALL_COORD_FILE: 'Supported Coordinate System File',
  SHAPE_COORD_FILE: 'Shape Coordinate System File',
  MAPINFO_FILE: 'MapInfo Change File',
  MAPINFO_TAB_FILE: 'MapInfo Tab File',
  IMG_COORD_FILE: 'Image Coordinate System File',
  COORD_FILE: 'Coordinate System File',

  //设置的一些参数
  PERCENT: 'Percent',
  OFF: 'OFF',
  CONFIRM: 'Confirm',
  COPY: 'Copy',
}

//地图工具
const Map_Tools = {
  VIDEO: 'Video',
  PHOTO: 'Photo',
  AUDIO: 'Audio',

  TAKE_PHOTO: 'Take photo',
  FROM_ALBUM: 'Choose from album',
  VIEW: 'View',
}

export {
  Map_Main_Menu,
  Map_Label,
  Map_Layer,
  Map_Attribute,
  Map_Setting,
  Map_Settings,
  Map_Tools,
}
