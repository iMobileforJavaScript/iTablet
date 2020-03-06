import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'
import { SScene } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import ToolBarHeight from '../ToolBarHeight'

let isClickMeasurePoint = true // 用于量算判断是否是选择点，true为新选择点，false为撤销回退
/** 距离量算 **/
function measureDistance() {
  const _params = ToolbarModule.getParams()
  if (!GLOBAL.openWorkspace) {
    Toast.show(getLanguage(_params.language).Prompt.PLEASE_OPEN_SCENE)
    //'请打开场景')
    return
  }
  SScene.checkoutListener('startMeasure')
  SScene.setMeasureLineAnalyst({
    callback: result => {
      if (!isClickMeasurePoint) {
        isClickMeasurePoint = true
        ToolbarModule.addData({ isFinished: true })
      }
      let pointArr = ToolbarModule.getData().pointArr || []
      let redoArr = ToolbarModule.getData().redoArr || []
      pointArr.indexOf(JSON.stringify(result)) === -1 &&
        result.x !== 0 &&
        pointArr.push(JSON.stringify(result))
      let newState = {}
      if (pointArr.length > 0 && _params.toolbarStatus.canUndo === false)
        newState.canUndo = true
      if (_params.toolbarStatus.canRedo) newState.canRedo = false
      Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)
      ToolbarModule.addData({ pointArr, redoArr, isFinished: true })
      result.length = Number(result.length)
      result.length = result.length > 0 ? result.length.toFixed(6) : 0
      _params.measureShow(true, result.length + 'm')
    },
  })
  showAnalystResult(ConstToolType.MAP3D_TOOL_DISTANCEMEASURE)
}

/** 面积量算 **/
function measureArea() {
  const _params = ToolbarModule.getParams()
  if (!GLOBAL.openWorkspace) {
    Toast.show(getLanguage(_params.language).Prompt.PLEASE_OPEN_SCENE)
    //'请打开场景')
    return
  }
  SScene.checkoutListener('startMeasure')
  SScene.setMeasureSquareAnalyst({
    callback: result => {
      if (!isClickMeasurePoint) {
        isClickMeasurePoint = true
        ToolbarModule.addData({ isFinished: true })
      }
      let pointArr = ToolbarModule.getData().pointArr || []
      let redoArr = ToolbarModule.getData().redoArr || []
      pointArr.indexOf(JSON.stringify(result)) === -1 &&
        result.x !== 0 &&
        pointArr.push(JSON.stringify(result))
      let newState = {}
      if (pointArr.length > 0 && _params.toolbarStatus.canUndo === false)
        newState.canUndo = true
      if (_params.toolbarStatus.canRedo) newState.canRedo = false
      Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)
      ToolbarModule.addData({ pointArr, redoArr, isFinished: true })
      result.totalArea = Number(result.totalArea)
      result.totalArea = result.totalArea > 0 ? result.totalArea.toFixed(6) : 0
      _params.measureShow(true, result.totalArea + '㎡')
    },
  })
  showAnalystResult(ConstToolType.MAP3D_TOOL_SUERFACEMEASURE)
}

/** 兴趣点 **/
function createPoint() {
  const params = ToolbarModule.getParams()
  try {
    if (!GLOBAL.openWorkspace) {
      Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
      //'请打开场景')
      return
    }
    SScene.checkoutListener('startLabelOperate')
    GLOBAL.Map3DSymbol = true
    SScene.startDrawFavorite(getLanguage(params.language).Prompt.POI)
    // this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINT)
    params.setToolbarVisible(true, ConstToolType.MAP3D_SYMBOL_POINT, {
      isFullScreen: false,
      height: 0,
    })
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.FAILED_TO_CREATE_POINT)
  }
}

/** 文字 **/
function createText() {
  const params = ToolbarModule.getParams()
  try {
    if (!GLOBAL.openWorkspace) {
      Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
      //'请打开场景')
      return
    }
    SScene.checkoutListener('startLabelOperate')
    GLOBAL.Map3DSymbol = true
    SScene.startDrawText({
      callback: result => {
        let dialog = params.dialog()
        dialog.setDialogVisible(true)
        ToolbarModule.addData({ point: result })
      },
    })
    // this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_TEXT)
    params.setToolbarVisible(true, ConstToolType.MAP3D_SYMBOL_TEXT, {
      isFullScreen: false,
      height: 0,
    })
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.FAILED_TO_CREATE_TEXT)
  }
}

/** 点绘线 **/
function createLine() {
  const params = ToolbarModule.getParams()
  if (!GLOBAL.openWorkspace) {
    Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
    //'请打开场景')
    return
  }
  SScene.checkoutListener('startLabelOperate')
  GLOBAL.Map3DSymbol = true
  try {
    SScene.startDrawLine()
    // this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINTLINE)
    params.setToolbarVisible(true, ConstToolType.MAP3D_SYMBOL_POINTLINE, {
      isFullScreen: false,
      height: 0,
    })
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.FAILED_TO_CREATE_LINE)
  }
}

/** 点绘面 **/
function createRegion() {
  const params = ToolbarModule.getParams()
  try {
    if (!GLOBAL.openWorkspace) {
      Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
      //'请打开场景')
      return
    }
    SScene.checkoutListener('startLabelOperate')
    GLOBAL.Map3DSymbol = true
    SScene.startDrawArea()
    // this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_POINTSURFACE)
    params.setToolbarVisible(true, ConstToolType.MAP3D_SYMBOL_POINTSURFACE, {
      isFullScreen: false,
      height: 0,
    })
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.FAILED_TO_CREATE_REGION)
  }
}

/** 清除标注 **/
function clearPlotting() {
  const params = ToolbarModule.getParams()
  if (!GLOBAL.openWorkspace) {
    Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
    //'请打开场景')
    return
  }
  GLOBAL.Map3DSymbol = true
  SScene.closeAllLabel()
  params.existFullMap && params.existFullMap()
  params.setToolbarVisible(false)
}

/** 路径分析 **/
function pathAnalyst() {
  const params = ToolbarModule.getParams()
  NavigationService.navigate('PointAnalyst', {
    container: params.setContainerLoading ? params.setContainerLoading : {},
    type: 'pointAnalyst',
  })
  params.existFullMap && params.existFullMap()
  params.setToolbarVisible(false)
}

/** 点选 **/
function select() {
  const params = ToolbarModule.getParams()
  SScene.setAction('PANSELECT3D')
  GLOBAL.action3d = 'PANSELECT3D'
  GLOBAL.Map3DSymbol = true
  // this.showMap3DTool(ConstToolType.MAP3D_SYMBOL_SELECT)
  const type = ConstToolType.MAP3D_SYMBOL_SELECT
  const _data = ToolBarHeight.getToolbarHeight(type)
  params.setToolbarVisible(true, type, {
    containerType: 'table',
    isFullScreen: false,
    column: _data.column,
    height: _data.height,
  })
}

/** box裁剪 **/
function boxClip() {
  const params = ToolbarModule.getParams()
  GLOBAL.action3d = 'PAN3D_FIX'
  if (!GLOBAL.openWorkspace) {
    Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
    //'请打开场景')
    return
  }
  GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(true)
  params.setToolbarVisible(true, ConstToolType.MAP3D_BOX_CLIPPING, {
    isFullScreen: false,
    height: 0,
  })
}

/** 三维裁剪参数获取 **/
async function map3dCut() {
  const params = ToolbarModule.getParams()
  let data = GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.getResult()
  if (data[0].x !== data[0].y) {
    let clipSetting = {
      startX: ~~data[0].x,
      startY: ~~data[0].y,
      endX: ~~data[2].x,
      endY: ~~data[2].y,
      clipInner: true,
      layers: [],
      isCliped: false,
    }
    let rel = await cut3d(clipSetting)
    rel.isCliped = true
    let layers = params.layerList
    layers.map(layer => {
      layer.selected = true
    })
    rel.layers = layers
    let num
    Object.keys(rel).map(key => {
      switch (key) {
        case 'X':
        case 'Y':
          num = 6
          break
        case 'Z':
          num = 1
          break
        case 'zRot':
          num = 0
          break
        case 'length':
          num = 0
          break
        case 'width':
          num = 0
          break
        case 'height':
          num = 0
          break
        case 'clipInner':
          break
      }
      if (rel[key] * 1 === rel[key])
        rel[key] = parseFloat(rel[key].toFixed(num))
    })
    GLOBAL.MapSurfaceView.show(false)
    // this.props.showMap3DTool(ConstToolType.MAP3D_BOX_CLIP)
    params.setToolbarVisible(true, ConstToolType.MAP3D_BOX_CLIP, {
      isFullScreen: false,
      height: 0,
    })
    params.setClipSetting && params.setClipSetting(rel)
  } else {
    Toast.show(getLanguage(GLOBAL.language).Map_Main_Menu.CUT_FIRST)
  }
}

//三维裁剪
async function cut3d(data) {
  //todo 三维裁剪 分this.state.type
  let rel = await SScene.clipByBox(data)
  let num
  Object.keys(rel).map(key => {
    switch (key) {
      case 'X':
      case 'Y':
        num = 6
        break
      case 'Z':
        num = 1
        break
      case 'zRot':
        num = 0
        break
      case 'length':
        num = 0
        break
      case 'width':
        num = 0
        break
      case 'height':
        num = 0
        break
      case 'clipInner':
        break
    }
    if (rel[key] * 1 === rel[key]) rel[key] = parseFloat(rel[key].toFixed(num))
  })
  return rel
}

/** 三维分析结果显示 */
function showAnalystResult(type) {
  const params = ToolbarModule.getParams()
  params.setToolbarVisible(true, type, {
    data: [],
    buttons: [
      ToolbarBtnType.CANCEL,
      // ToolbarBtnType.UNDO,
      // ToolbarBtnType.REDO,
      {
        type: ToolbarBtnType.UNDO,
        action: undo,
      },
      {
        type: ToolbarBtnType.REDO,
        action: redo,
      },
      // ToolbarBtnType.CLEAR,
      {
        type: ToolbarBtnType.MEASURE_CLEAR,
        action: () => clearMeasure(type),
        image: require('../../../../../../assets/mapEdit/icon_clear.png'),
      },
    ],
    // buttons: [ToolbarBtnType.CLOSE_ANALYST, ToolbarBtnType.CLEAR],
    isFullScreen: false,
    // height: ConstToolType.HEIGHT[0],
    // column: data.length,
    containerType: 'list',
  })
}

/** 量算功能 撤销事件 **/
function undo() {
  if (ToolbarModule.getData().isFinished === false) return
  isClickMeasurePoint = false
  let pointArr = ToolbarModule.getData().pointArr || []
  let redoArr = ToolbarModule.getData().redoArr || []
  const _params = ToolbarModule.getParams()
  if (!_params.toolbarStatus.canUndo) return
  let newState = {}
  if (pointArr.length > 0) {
    redoArr.push(pointArr.pop())
  }
  newState.canRedo = redoArr.length > 0
  newState.canUndo = pointArr.length > 0
  _params.setToolbarStatus(newState)
  ToolbarModule.addData({ pointArr, redoArr, isFinished: false })
  SScene.displayDistanceOrArea(pointArr)
}

/** 量算功能 重做事件 **/
function redo() {
  if (ToolbarModule.getData().isFinished === false) return
  isClickMeasurePoint = false
  let pointArr = ToolbarModule.getData().pointArr || []
  let redoArr = ToolbarModule.getData().redoArr || []
  const _params = ToolbarModule.getParams()
  if (!_params.toolbarStatus.canRedo || redoArr.length === 0) return
  let newState = {}
  if (redoArr.length > 0) {
    pointArr.push(redoArr.pop())
  }
  newState.canRedo = redoArr.length > 0
  newState.canUndo = pointArr.length > 0
  _params.setToolbarStatus(newState)
  Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)

  ToolbarModule.addData({ pointArr, redoArr, isFinished: false })
  SScene.displayDistanceOrArea(pointArr)
}

/** 清除三维量算 **/
function clearMeasure(type) {
  const _params = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.MAP3D_TOOL_SUERFACEMEASURE:
      SScene.clearSquareAnalyst()
      ToolbarModule.getParams().measureShow &&
        ToolbarModule.getParams().measureShow(true, '0㎡')
      ToolbarModule.addData({ pointArr: [], redoArr: [] })
      _params.setToolbarStatus({
        canUndo: false,
        canRedo: false,
        isFinished: true,
      })
      break
    case ConstToolType.MAP3D_TOOL_DISTANCEMEASURE:
      SScene.clearLineAnalyst()
      ToolbarModule.getParams().measureShow &&
        ToolbarModule.getParams().measureShow(true, '0m')
      ToolbarModule.addData({ pointArr: [], redoArr: [] })
      _params.setToolbarStatus({
        canUndo: false,
        canRedo: false,
        isFinished: true,
      })
      break
    case ConstToolType.MAP3D_BOX_CLIP:
    case ConstToolType.MAP3D_CROSS_CLIP:
    case ConstToolType.MAP3D_PLANE_CLIP:
    case ConstToolType.MAP3D_CLIP_SHOW:
    case ConstToolType.MAP3D_CLIP_HIDDEN:
    case ConstToolType.MAP3D_BOX_CLIP_IN:
    case ConstToolType.MAP3D_BOX_CLIP_OUT:
      //清除裁剪面 返回上个界面
      _params.clearClip && _params.clearClip()
      ToolbarModule.setData()
      SScene.clipSenceClear()
      GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show()
      _params.setToolbarVisible(true, ConstToolType.MAP3D_BOX_CLIPPING, {
        isFullScreen: false,
        height: 0,
      })
      break
    default:
      SScene.clear()
      break
  }
}

function close(type) {
  const _params = ToolbarModule.getParams()
  if (
    type === ConstToolType.MAP3D_TOOL_DISTANCEMEASURE ||
    type === ConstToolType.MAP3D_TOOL_SUERFACEMEASURE
  ) {
    SScene.closeAnalysis()
    _params.measureShow(false, '')
    _params.existFullMap && _params.existFullMap()
    _params.setToolbarVisible(false)
    // this.clickTime = 0
    _params.setToolbarStatus({
      canUndo: false,
      canRedo: false,
    })
  } else if (
    type === ConstToolType.MAP3D_SYMBOL_POINT ||
    type === ConstToolType.MAP3D_SYMBOL_POINTLINE ||
    type === ConstToolType.MAP3D_SYMBOL_POINTSURFACE ||
    type === ConstToolType.MAP3D_SYMBOL_TEXT
  ) {
    SScene.clearAllLabel()
    GLOBAL.Map3DSymbol = false
    _params.existFullMap && _params.existFullMap()
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.MAP3D_SYMBOL_SELECT) {
    SScene.clearSelection()
    _params.setAttributes({})
    _params.existFullMap && _params.existFullMap()
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.MAP3D_CIRCLEFLY) {
    SScene.stopCircleFly()
    SScene.clearCirclePoint()
    _params.existFullMap && _params.existFullMap()
    _params.setToolbarVisible(false)
  } else {
    SScene.checkoutListener('startTouchAttribute')
    SScene.setAction('PAN3D')
    GLOBAL.action3d = 'PAN3D'
    ToolbarModule.setData()
    return false
  }
  SScene.checkoutListener('startTouchAttribute')
  SScene.setAction('PAN3D')
  GLOBAL.action3d = 'PAN3D'
  ToolbarModule.setData()
}

function circleFly() {
  const _params = ToolbarModule.getParams()
  _params.showFullMap && _params.showFullMap(true)
  GLOBAL.action3d = 'PAN3D_FIX'
  _params.setToolbarVisible(true, ConstToolType.MAP3D_CIRCLEFLY, {
    containerType: ToolbarType.table,
    isFullScreen: false,
    column: 1,
    height: ConstToolType.HEIGHT[0],
  })
}
function showMenuDialog() {
  const _params = ToolbarModule.getParams()
  let _data = ToolbarModule.getData()
  let configs = JSON.parse(JSON.stringify(_data))
  if (configs.showBox) {
    _params.setToolbarVisible(true, ConstToolType.MAP3D_CLIP_HIDDEN, {
      isFullScreen: false,
      height: 0,
    })
    ToolbarModule.addData({ showBox: false })
  }
  _params.showMenuDialog && _params.showMenuDialog(configs)
}

function showLayerList() {
  const _params = ToolbarModule.getParams()
  let data = ToolbarModule.getData()
  let showBox = data.showBox
  _params.showMenuDialog &&
    _params.showMenuDialog({
      showMenuDialog: false,
    })
  if (!showBox) {
    _params.setToolbarVisible(true, ConstToolType.MAP3D_CLIP_SHOW, {
      isFullScreen: false,
      height: ConstToolType.TOOLBAR_HEIGHT[3],
    })
  } else {
    _params.setToolbarVisible(true, ConstToolType.MAP3D_CLIP_HIDDEN, {
      isFullScreen: false,
      height: 0,
    })
  }
  showBox = !showBox
  ToolbarModule.addData({ showBox })
}

function changeClip() {
  const _params = ToolbarModule.getParams()
  let _data = _params.getClipSetting()

  let clipSetting = JSON.parse(JSON.stringify(_data))
  clipSetting.clipInner = !clipSetting.clipInner
  if (!clipSetting.layers) {
    clipSetting.layers = _params.layerList || []
  }
  SScene.clipByBox(clipSetting)
  _params.setClipSetting && _params.setClipSetting(clipSetting)
  let type = clipSetting.clipInner
    ? ConstToolType.MAP3D_BOX_CLIP_IN
    : ConstToolType.MAP3D_BOX_CLIP_OUT
  _params.setToolbarVisible(true, type, {
    isFullScreen: false,
    height: 0,
  })
}
function layerChange(layers) {
  const _params = ToolbarModule.getParams()
  let _data = _params.getClipSetting()

  let clipSetting = JSON.parse(JSON.stringify(_data))
  clipSetting.layers = layers
  SScene.clipByBox(clipSetting)
  _params.setClipSetting && _params.setClipSetting(clipSetting)
}

function closeClip() {
  const _params = ToolbarModule.getParams()
  SScene.clipSenceClear()
  _params.setToolbarVisible(false)
  _params.existFullMap && _params.existFullMap()
  _params.setClipSetting && _params.setClipSetting({})
  _params.clearClip && _params.clearClip()
  ToolbarModule.setData()
  GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(false)
}
export default {
  close,

  measureDistance,
  measureArea,
  createPoint,
  createText,
  createLine,
  createRegion,
  clearPlotting,
  select,
  pathAnalyst,
  boxClip,
  clearMeasure,
  undo,
  redo,
  map3dCut,
  showLayerList,
  changeClip,
  showMenuDialog,
  layerChange,
  closeClip,
  cut3d,
  circleFly,
}
