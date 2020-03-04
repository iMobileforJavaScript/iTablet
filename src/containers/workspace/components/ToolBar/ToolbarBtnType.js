/** 地图按钮类型 **/
export default {
  COMPLETE: 'complete', // 完成
  CANCEL: 'cancel', // 取消
  CANCEL_INCREMENT: 'cancel_increment',
  CANCEL_2: 'cancel_2', // 取消，先执行Action，再隐藏Toolbar
  FLEX: 'flex', // 伸缩
  FLEX_FULL: 'flex_full', // 伸缩(展开全屏/收缩取消全屏)
  STYLE: 'style', // 样式
  COMMIT: 'commit', // 提交
  COMMIT_CUT: 'commitCut', // 提交
  COMMIT_3D_CUT: 'commit3dCut', //提交三维裁剪
  MAP3D_CUT_BACK: 'map3dCutBack', //三维裁剪返回按键
  MENU: 'menu', //菜单
  MENUS: 'menus', //菜单
  PLACEHOLDER: 'placeholder', // 占位
  CLOSE_ANALYST: 'closeAnalyst',
  CLEAR: 'clear',
  END_FLY: 'endfly',
  SAVE_FLY: 'savefly',
  TAGGING_BACK: 'TAGGING_BACK',
  END_ADD_FLY: 'endaddfly',
  BACK: 'back',
  SAVE: 'save',
  CLOSE_SYMBOL: 'closesymbol',
  CLOSE_TOOL: 'closetool',
  CLEAR_ATTRIBUTE: 'clearattribute',
  MAP_SYMBOL: 'mapSymbol',
  MAP_SYMBOL_TEMPLATE: 'mapSymbolTemplate',
  CHANGE_COLLECTION: 'changeCollection',
  SHOW_ATTRIBUTE: 'showAttribute', // 显示属性
  SHOW_MAP3D_ATTRIBUTE: 'showMap3DAttribute', // 显示属性
  CLEAR_CURRENT_LABEL: 'clearCurrentLabel',
  CLOSE_CIRCLE: 'closeCircle',
  SHARE: 'SHARE',
  END_ANIMATION: 'endAnimation',
  UNDO: 'undo', //二三维量算撤销功能
  REDO: 'redo', //二三维量算回退功能
  DELETE_OBJ: 'deleteObject',
  CLIP_LAYER: 'clip_layer', //三维裁剪图层
  CHANGE_CLIP: 'change_clip', //三维裁剪 切换区域内外
  //推演动画
  PLOT_ANIMATION_XML_LIST: 'plot_animation_xml_list', //推演动画的xml列表
  PLOT_ANIMATION_PLAY: 'plot_animation_play', //播放推演动画
  PLOT_ANIMATION_GO_OBJECT_LIST: 'plot_animation_go_object_list', //推演动画的节点对象列表
  PLOT_ANIMATION_SAVE: 'plot_animation_save', //保存推演动画成xml文件

  //专题制图
  THEME_CANCEL: 'theme_cancel',
  THEME_MENU: 'theme_menu',
  THEME_FLEX: 'theme_flex',
  THEME_COMMIT: 'theme_commit',
  THEME_GRAPH_TYPE: 'theme_graph_type',
  MAP3DSHARE: 'map3dshare',

  VISIBLE: 'visible',
  NOT_VISIBLE: 'not_visible',
  MENU_COMMIT: 'menu_commit',
  MENU_FLEX: 'menu_flex',

  MEASURE_CLEAR: 'measure_clear',
  STYLE_TRANSFER: 'style_transfer',
  STYLE_TRANSFER_PICKER: 'style_transfer_picker',

  TOOLBAR_BACK: 'toolbar_back', //工具栏 添加->返回上一级
  TOOLBAR_COMMIT: 'toolbar_commit', //工具栏 提交
  TOOLBAR_DONE: 'toolbar_done', //工具栏 完成

  SHOW_LIST: 'SHOW_LIST',
  SHOW_NODE_LIST: 'SHOW_NODE_LIST',
  PLAY: 'PLAY',
  SETTIING: 'setting',
  COLLECTTARGET: 'collecttarget',
  ANALYST: 'analyst', // 分析
}
