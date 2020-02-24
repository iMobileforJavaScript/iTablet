#Toolbar

setVisible(isShow, params)

***表1***

名称  |  含义 |  类型 |  参数 |  是否必填
:----:|:----:|:----:|:----:|:----:
isShow     | Toolbar类型    | Boolean |  | 是
params     | Toolbar详细参数 |  Object | 见表2 | 否

***表2*** params

名称  |  含义 |  类型 |  参数 |  是否必填
:----:|:----:|:----:|:----:|:----:
type            |  Toolbar类型                         | String | 详情请看ConstToolType.js | 是
data            |  数据                                |  Array | | 否
buttons         |  底部按钮                             |  Array | 详情请看ToolbarBtnType.js| 否
containerType   |  Toolbar上部内容类型                  |  详情请看ToolbarType.js | | 否
themeType       |  专题图类型                           |  Number or String | | 否
showMenuDialog  |  是否显示指滑菜单                      |  Boolean | | 否
isTouchProgress |  是否显示顶部指滑进度条                 |  Boolean | | 否
isFullScreen    |  是否是全屏，地图和Toolbar之间透明的遮罩 |  Boolean | | 否
selectKey       |  data中被选择数据的key                 |  String | | 否
selectName      |  data中被选择数据的Name                |  String | | 否
