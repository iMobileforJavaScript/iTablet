## components

> * AudioTools              (语音面板)
> * Button                  (自定义按钮)
> * ColorTableList          (颜色列表)
> * Container               (自定义容器组件)
> * DataSetListItem         
> * DataSetListSection
> * Dialog                  (提示框)
> * FlowTable
> * Header                  (自定义header组件(container的子组件))
> * HorizontalTableList
> * infoView
> * Input                   (输入框)
> * LayerItem
> * Loading                 (自定义Loading组件(container的子组件))
> * mapTools
> * PanAudioButton
> * PopModal
> * Progeress               (进度条)
> * Row
> * SaveDialog              (保存提示框)
> * SaveMapNameDialog       (地图保存提示框)
> * SearchBar               (搜索框)
> * SurfaceView
> * TableList
> * TreeList


### Progeress
| 属性        | 类型   |  概述  |
| --------   | -----:  | :----:  |
| progress                 |   number  |   当前进度                |
| buffer                   |   number  |   second progress进度    |
| progressColor            |   string  |   进度条颜色              |
| bufferColor              |   string  |   buffer进度条颜色        |
| progressAniDuration      |   number  |   进度动画时长            |
| bufferAniDuration        |   number  |   buffer动画时长          |


### Dialog
| 属性        | 类型   |  概述  |
| --------   | -----:  | :----:  |
| type                     |   string      |   MODAL,NON_MODAL 有无蒙版 |
| style                    |   StyleSheet  |   样式                    |
| titleStyle               |   StyleSheet  |   title样式               |
| infoStyle                |   StyleSheet  |   info样式                |
| backgroundStyle          |   StyleSheet  |   背景样式                |
| title                    |   string      |   标题                    |
| info                     |   string      |   info                   |
| backHide                 |   boolean     |   是否隐藏back            |
| children                 |   any         |   子组件                  |
| activeOpacity            |   number      |   不透明度                |
| cancelBtnTitle           |   string      |   取消按钮标题             |
| confirmBtnTitle          |   string      |   确定按钮标题             |
| confirmBtnVisible        |   boolean     |   确定按钮是否隐藏         |
| cancelBtnVisible         |   boolean     |   取消按钮是否隐藏         |
| cancelBtnStyle           |   StyleSheet  |   取消按钮样式            |
| confirmBtnStyle          |   StyleSheet  |   确定按钮样式            |
| confirmAction            |   function    |   确定按钮回调函数         |
| cancelAction             |   function    |   取消按钮回调函数         |
| confirmTitleStyle        |   StyleSheet  |   确定按钮标题样式         |
| cancelTitleStyle         |   StyleSheet  |   取消按钮是否样式         |
| showBtns                 |   boolean     |   隐藏所有按钮             |
| header                   |   any         |   头组件                  |
| opacity                  |   number      |   面板不透明的             |
| opacityStyle             |   StyleSheet  |   蒙板样式                 |
| onlyOneBtn               |   boolean     | 是否仅有一个按钮(按钮样式有变化)|


### SearchBar
| 属性        | 类型   |  概述  |
| --------   | -----:  | :----:  |
| onBlur                 |   function  |   当文本框失去焦点的时候调用此回调函数  |
| onFocus                |   function  |   当文本框获得焦点的时候调用此回调函数  |
| onClear                |   function  |   清空文本框时的回调函数              |
| onSubmitEditing        |   function  |   点击键盘确定键时的回调函数          |
| defaultValue           |   string    |   默认内容                |
| editable               |   boolean   |   文本是否可编辑           |
| placeholder            |   string    |   提示内容                |
| isFocused              |   string    |   让文本失去焦点           |
| keyboardAppearance     |   string    |   指定键盘的颜色           |
| returnKeyType          |   string    |   决定“确定”按钮显示的内容  |
| returnKeyLabel         |   string    |   确定返回键的外观         |
| blurOnSubmit           |   string    |   如果为true，文本框会在提交的时候失焦。对于单行输入框默认值为true，多行则为false          |



### SaveMapNameDialog
| 属性        | 类型   |  概述  |
| --------   | -----:  | :----:  |
| confirmAction            |   number  |   点击确定按钮时的回调函数    |
| cancelAction             |   number  |   点击取消按钮时的回调函数    |
| mapName                  |   string  |   地图名称                  |
| wsName                   |   string  |   工作空间名称              |
| path                     |   number  |   工作空间路径              |
| showWsName               |   boolean  |   是否显示工作空间名称       |


### SaveDialog
| 属性        | 类型   |  概述  |
| --------   | -----:  | :----:  |
| confirmAction            |   number  |   点击确定按钮时的回调函数    |
| cancelAction             |   number  |   点击取消按钮时的回调函数    |
| mapName                  |   string  |   地图名称                  |
| wsName                   |   string  |   工作空间名称              |
| path                     |   number  |   工作空间路径              |
| showWsName               |   boolean |   是否显示工作空间名称       |
| showPath                 |   boolean |   地图名称                  |
| withoutHeader            |   boolean |   是否显示头组件             |
| headerProps              |   Object  |   头组件Props               |
| navigation               |   Object  |   navigation               |


### Loading
| 属性        | 类型   |  概述  |
| --------   | -----:  | :----:  |
| style               |   StyleSheet  |   样式         |
| titleStyle          |   StyleSheet  |   标题样式      |
| loadingStyle        |   StyleSheet  |   loading样式  |
| loadingColor        |   string  |  loading颜色       |
| loadingAnimating    |   boolean |  loading动画       |
| title               |   string  |  loading标题       |
| flexDirection       |   string  |  flexDirection    |


### Header
| 属性        | 类型   |  概述  |
| --------   | -----:  | :----:  |
| header                    |   any         |   自定义Header             |
| headerStyle               |   StyleSheet  |   自定义Header Style       |
| withoutBack               |   boolean     |   是否有返回按钮            |
| backBtnType               |   string      |   返回按钮类型              |
| backAction                |   function    |   返回事件                 |
| title                     |   string      |   标题                     |
| headerViewStyle           |   StyleSheet  |                           |
| headerLeftStyle           |   StyleSheet  |                           |
| headerRightStyle          |   StyleSheet  |                           |
| headerTitleViewStyle      |   StyleSheet  |                           |
| headerTitleStyle          |   StyleSheet  |                           |
| headerLeft                |   any         |   Header左端组件，可为Array |
| headerRight               |   any         |   Header右端组件，可为Array |
| opacity                   |   number      |   透明度                   |
| activeOpacity             |   number      |   返回键点击透明度          |
| type                      |   string      |   default,float:浮动Header,floatNoTitle:浮动无title,透明背景,fix:固定顶部，绝对定位  |
| navigation                |   any         |   navigation              |
| count                     |   any         |                           |
| darkBackBtn               |   boolean     |   黑色透明背景，返回按钮     |
| headerCenter              |   any         |                           |
| backImg                   |   any         |   返回按钮图片              |


### Container
| 属性        | 类型   |  概述  |
| --------   | -----:  | :----:  |
| style                    |   StyleSheet  |   样式                   |
| titleStyle               |   StyleSheet  |   标题样式               |
| children                 |   any         |   子组件                 |
| title                    |   string      |   标题                   |
| header                   |   any         |   header组件             |
| bottomBar                |   any         |                         |
| withoutHeader            |   boolean     |   是否有header           |
| headerProps              |   Object      |   headerPorps           |
| bottomProps              |   Object      |   bottomProps           |
| navigation               |   Object      |   navigation            |
| initWithLoading          |   boolean     |   初始化loading          |
| dialogInfo               |   boolean     |   是否有dialogInfo       |
| scrollable               |   boolean     |   是否滑动               |

