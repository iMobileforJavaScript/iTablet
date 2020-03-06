import {
  SMap,
  Action,
  SMediaCollector,
  SAIDetectView,
  SCollector,
  DatasetType,
} from 'imobile_for_reactnative'
import {
  ConstToolType,
  TouchType,
  ConstPath,
  ToolbarType,
  Const,
} from '../../../../../../constants'
import {
  dataUtil,
  Toast,
  StyleUtils,
  LayerUtils,
} from '../../../../../../utils'
import { FileTools } from '../../../../../../native'
import { ImagePicker } from '../../../../../../components'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import Utils from '../../utils'

function begin() {
  GLOBAL.GPS = setInterval(() => {
    SMap.gpsBegin()
  }, 2000)
}

function stop() {
  if (GLOBAL.GPS !== undefined) {
    clearInterval(GLOBAL.GPS)
  }
}

function submit() {
  (async function() {
    if (GLOBAL.MapToolType === ConstToolType.MAP_TOOL_GPSINCREMENT) {
      await SMap.addGPSRecordset()
    }
    await SMap.submit()
    await SMap.buildNetwork()
  }.bind(this)())
}

function select(type) {
  if (type === undefined) {
    type = ToolbarModule.getParams().type
  }
  switch (type) {
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE:
    case ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE:
      SMap.setAction(Action.SELECT_BY_RECTANGLE)
      // SMap.selectByRectangle()
      break
    case ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT:
    case ConstToolType.MAP_TOOL_TAGGING_SELECT:
    case ConstToolType.MAP_TOOL_POINT_SELECT:
    default:
      SMap.setAction(Action.SELECT)
      break
  }
}

function cancelSelect() {
  ToolbarModule.getParams().setSelection(null)
  SMap.clearSelection()
  select()
}

function viewEntire() {
  SMap.viewEntire().then(async () => {
    const params = ToolbarModule.getParams()
    params.setToolbarVisible && params.setToolbarVisible(false)
    let currentFloorID = await SMap.getCurrentFloorID()
    params.changeFloorID && params.changeFloorID(currentFloorID || '')
  })
}

/** 单选 **/
function pointSelect() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  let type
  if (GLOBAL.MapToolType === ConstToolType.MAP_TOOLS) {
    type = ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT
  } else {
    type = ConstToolType.MAP_TOOL_POINT_SELECT
  }

  _params.setToolbarVisible(true, type, {
    containerType: 'table',
    column: 3,
    isFullScreen: false,
    height: ConstToolType.HEIGHT[0],
    cb: () => select(type),
  })
}

/** 框选 **/
function selectByRectangle() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  let type
  if (GLOBAL.MapToolType === ConstToolType.MAP_TOOLS) {
    type = ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE
  } else {
    type = ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE
  }

  _params.setToolbarVisible(true, type, {
    containerType: 'table',
    column: 3,
    isFullScreen: false,
    height: ConstToolType.HEIGHT[0],
    cb: () => select(type),
  })
}

/** 矩形裁剪 **/
function rectangleCut() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  // addMapCutListener()
  GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(true)

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_RECTANGLE_CUT, {
    isFullScreen: false,
    height: 0,
  })
}

/** 距离量算 **/
function measureLength() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  _params.showMeasureResult(true, 0)
  StyleUtils.setDefaultMapControlStyle().then(() => {
    SMap.measureLength(obj => {
      let pointArr = ToolbarModule.getData().pointArr || []
      let redoArr = []
      // 防止重复添加
      if (pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1) {
        pointArr.push(JSON.stringify(obj.curPoint))
        let newState = {}
        if (pointArr.length > 0 && _params.toolbarStatus.canUndo === false)
          newState.canUndo = true
        if (_params.toolbarStatus.canRedo) newState.canRedo = false
        Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)
        ToolbarModule.addData({ pointArr, redoArr, isFinished: true })
      } else {
        ToolbarModule.addData({ isFinished: true })
      }
      let rel = obj.curResult === 0 ? 0 : obj.curResult.toFixed(6)
      _params.showMeasureResult(true, rel + 'm')
    })
  })

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_MEASURE_LENGTH, {
    containerType: 'table',
    column: 4,
    isFullScreen: false,
    height: 0,
  })
}

/**  面积量算  **/
function measureArea() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  _params.showMeasureResult(true, 0)
  StyleUtils.setDefaultMapControlStyle().then(() => {
    SMap.measureArea(obj => {
      let pointArr = ToolbarModule.getData().pointArr || []
      let redoArr = []
      // 防止重复添加
      if (pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1) {
        pointArr.push(JSON.stringify(obj.curPoint))
        let newState = {}
        if (pointArr.length > 0 && _params.toolbarStatus.canUndo === false)
          newState.canUndo = true
        if (_params.toolbarStatus.canRedo) newState.canRedo = false
        Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)
        ToolbarModule.addData({ pointArr, redoArr, isFinished: true })
      } else {
        ToolbarModule.addData({ isFinished: true })
      }
      let rel = obj.curResult === 0 ? 0 : obj.curResult.toFixed(6)
      _params.showMeasureResult(true, rel + '㎡')
    })
  })

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_MEASURE_AREA, {
    containerType: 'table',
    column: 4,
    isFullScreen: false,
    height: 0,
  })
}

/**  角度量算  **/
function measureAngle() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  _params.showMeasureResult(true, 0)
  StyleUtils.setDefaultMapControlStyle().then(() => {
    SMap.measureAngle(obj => {
      let pointArr = ToolbarModule.getData().pointArr || []
      let redoArr = []
      // 防止重复添加
      if (pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1) {
        //角度量算前两次打点不会触发回调，第三次打点添加一个标识，最后一次撤销直接清除当前所有点
        pointArr.indexOf('startLine') === -1 && pointArr.push('startLine')
        pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1 &&
          pointArr.push(JSON.stringify(obj.curPoint))
        let newState = {}
        if (pointArr.length > 0 && _params.toolbarStatus.canUndo === false)
          newState.canUndo = true
        if (_params.toolbarStatus.canRedo) newState.canRedo = false
        Object.keys(newState).length > 0 && _params.setToolbarStatus(newState)
        ToolbarModule.addData({ pointArr, redoArr, isFinished: true })
      } else {
        ToolbarModule.addData({ isFinished: true })
      }
      if (pointArr.length >= 2) {
        _params.showMeasureResult(true, dataUtil.angleTransfer(obj.curAngle, 6))
      } else {
        _params.showMeasureResult(true, '0°')
      }
    })
  })

  _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_MEASURE_ANGLE, {
    containerType: 'table',
    column: 4,
    isFullScreen: false,
    height: 0,
  })
}

/** 清除量算结果 **/
function clearMeasure(type) {
  const _params = ToolbarModule.getParams()
  type = _params.type
  if (typeof type === 'string' && type.indexOf('MAP_TOOL_MEASURE_') >= 0) {
    switch (type) {
      case ConstToolType.MAP_TOOL_MEASURE_LENGTH:
        ToolbarModule.getParams().showMeasureResult &&
          ToolbarModule.getParams().showMeasureResult(true, '0m')
        SMap.setAction(Action.MEASURELENGTH)
        break
      case ConstToolType.MAP_TOOL_MEASURE_AREA:
        ToolbarModule.getParams().showMeasureResult &&
          ToolbarModule.getParams().showMeasureResult(true, '0㎡')
        SMap.setAction(Action.MEASUREAREA)
        break
      case ConstToolType.MAP_TOOL_MEASURE_ANGLE:
        ToolbarModule.getParams().showMeasureResult &&
          ToolbarModule.getParams().showMeasureResult(true, '0°')
        SMap.setAction(Action.MEASUREANGLE)
        break
    }
    ToolbarModule.addData({ pointArr: [], redoArr: [], isFinished: true })
    _params.setToolbarStatus({
      canUndo: false,
      canRedo: false,
    })
  }
}

/** 量算功能 撤销事件 **/
async function undo(type) {
  if (ToolbarModule.getData().isFinished === false) return
  if (type === ConstToolType.MAP_TOOL_INCREMENT) {
    await SMap.undo()
    return
  }
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
  if (type === ConstToolType.MAP_TOOL_MEASURE_ANGLE && pointArr.length <= 1) {
    _params.showMeasureResult && _params.showMeasureResult(true, '0°')
    if (pointArr.length === 1) {
      newState.canRedo = false
      newState.canUndo = false
      pointArr = []
      redoArr = []
      SMap.setAction(Action.MEASUREANGLE)
    }
  }
  _params.setToolbarStatus(newState, async () => {
    await SMap.undo()
    // isFinished防止量算撤销回退没完成，再次触发事件，导致出错
    // pointArr为空，撤销到最后，不会进入量算回调，此时isFinished直接为true
    ToolbarModule.addData({
      pointArr,
      redoArr,
      isFinished: pointArr.length === 0,
    })
  })
}

/** 量算功能 重做事件 **/
async function redo(type = null) {
  if (ToolbarModule.getData().isFinished === false) return
  if (type === ConstToolType.MAP_TOOL_INCREMENT) {
    await SMap.redo()
    return
  }
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
  Object.keys(newState).length > 0 &&
    _params.setToolbarStatus(newState, async () => {
      await SMap.redo()
      // isFinished防止量算撤销回退没完成，再次触发事件，导致出错
      ToolbarModule.addData({ pointArr, redoArr, isFinished: false })
    })
}

async function point() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'POINTLAYER'
  ) {
    SMap.setAction(Action.CREATEPOINT)
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function words() {
  const _params = ToolbarModule.getParams()
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'TEXTLAYER'
  ) {
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    GLOBAL.TouchType = TouchType.MAP_TOOL_TAGGING
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function pointline() {
  const _params = ToolbarModule.getParams()
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'LINELAYER'
  ) {
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.CREATEPOLYLINE)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function freeline() {
  const _params = ToolbarModule.getParams()
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'LINELAYER'
  ) {
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.DRAWLINE)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function pointcover() {
  const _params = ToolbarModule.getParams()
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'REGIONLAYER'
  ) {
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.CREATEPOLYGON)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function freecover() {
  const _params = ToolbarModule.getParams()
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let layerType
  if (currentLayer) {
    layerType = LayerUtils.getLayerType(currentLayer)
  }
  if (
    layerType === 'TAGGINGLAYER' ||
    layerType === 'CADLAYER' ||
    layerType === 'REGIONLAYER'
  ) {
    _params.setToolbarVisible(true, ConstToolType.MAP_TOOL_TAGGING, {
      isFullScreen: false,
      height: ConstToolType.HEIGHT[4],
    })
    SMap.setAction(Action.DRAWPLOYGON)
  } else {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_PLOT_LAYER)
  }
}

async function setting() {
  NavigationService.navigate('AIDetecSettingsView')
  this.props.showFullMap && this.props.showFullMap(true)
  await SAIDetectView.setProjectionModeEnable(false)
}

// function name() {
//   return NavigationService.navigate('InputPage', {
//     headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
//     cb: async value => {
//       if (value !== '') {
//         (async function() {
//           await SMap.addRecordset(
//             GLOBAL.TaggingDatasetName,
//             'name',
//             value,
//             ToolbarModule.getParams().user.currentUser.userName,
//           )
//         }.bind(this)())
//       }
//       NavigationService.goBack()
//     },
//   })
// }

// function remark() {
//   return NavigationService.navigate('InputPage', {
//     headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_REMARKS,
//     cb: async value => {
//       if (value !== '') {
//         (async function() {
//           await SMap.addRecordset(
//             GLOBAL.TaggingDatasetName,
//             'remark',
//             value,
//             ToolbarModule.getParams().user.currentUser.userName,
//           )
//         }.bind(this)())
//       }
//       NavigationService.goBack()
//     },
//   })
// }
//
// function address() {
//   return NavigationService.navigate('InputPage', {
//     headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_HTTP,
//     cb: async value => {
//       if (value !== '') {
//         (async function() {
//           await SMap.addRecordset(
//             GLOBAL.TaggingDatasetName,
//             'address',
//             value,
//             ToolbarModule.getParams().user.currentUser.userName,
//           )
//         }.bind(this)())
//       }
//       NavigationService.goBack()
//     },
//   })
// }

//多媒体采集
function captureImage() {
  (async function() {
    const _params = ToolbarModule.getParams()
    let currentLayer = _params.currentLayer
    // let reg = /^Label_(.*)#$/
    if (currentLayer) {
      let layerType = LayerUtils.getLayerType(currentLayer)
      let isTaggingLayer = layerType === 'TAGGINGLAYER'
      // let isTaggingLayer = currentLayer.type === DatasetType.CAD
      // && currentLayer.datasourceAlias.match(reg)
      if (isTaggingLayer) {
        // await SMap.setTaggingGrid(
        //   currentLayer.datasetName,
        //   ToolbarModule.getParams().user.currentUser.userName,
        // )
        const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
        const datasetName = currentLayer.datasetName // 标注图层名称
        NavigationService.navigate('Camera', {
          datasourceAlias,
          datasetName,
        })
      }
    } else {
      Toast.show(
        getLanguage(ToolbarModule.getParams().language).Prompt
          .PLEASE_SELECT_PLOT_LAYER,
      )
      ToolbarModule.getParams().navigation.navigate('LayerManager')
    }
  }.bind(this)())
}

function tour() {
  (async function() {
    const _params = ToolbarModule.getParams()
    // let {isTaggingLayer, layerInfo} = await SMap.getCurrentTaggingLayer(
    //   ToolbarModule.getParams().user.currentUser.userName,
    // )
    //
    // // TODO 判断是否是轨迹标注图层
    // if (isTaggingLayer && GLOBAL.TaggingDatasetName) {
    //   let dsDes = layerInfo && layerInfo.datasetDescription &&
    //     layerInfo.datasetDescription !== 'NULL' && JSON.parse(layerInfo.datasetDescription)
    //   dsDes && dsDes.type !== 'tour' && await SMap.setTaggingGrid(
    //     GLOBAL.TaggingDatasetName,
    //     ToolbarModule.getParams().user.currentUser.userName,
    //   )
    //   ImagePicker.AlbumListView.defaultProps.showDialog = false
    //   ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    // } else {
    let targetPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        _params.user.currentUser.userName +
        '/' +
        ConstPath.RelativeFilePath.Media,
    )
    SMediaCollector.initMediaCollector(targetPath)

    let tourLayer
    ImagePicker.AlbumListView.defaultProps.showDialog = true
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = (
      value = '',
      cb = () => {},
    ) => {
      if (value !== '') {
        (async function() {
          await SMap.setLabelColor()
          let tagginData = await SMap.newTaggingDataset(
            value,
            _params.user.currentUser.userName,
            false, // 轨迹图层都设置为不可编辑
            'tour',
          )
          tourLayer = tagginData.layerName
          cb && cb()
        }.bind(this)())
      }
      Toast.show(value)
    }
    // }

    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'

    ImagePicker.getAlbum({
      maxSize: 9,
      callback: async data => {
        if (data.length <= 1) {
          Toast.show(
            getLanguage(global.language).Prompt.SELECT_TWO_MEDIAS_AT_LEAST,
          )
          return
        }
        if (tourLayer) {
          let res = await SMediaCollector.addTour(tourLayer, data)
          res.result && (await SMap.setLayerFullView(tourLayer))
        }
      },
    })
  }.bind(this)())
}

/**
 * 智能配图
 */
function matchPictureStyle() {
  const _params = ToolbarModule.getParams()
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'

  ImagePicker.getAlbum({
    maxSize: 1,
    callback: async data => {
      if (data.length === 1) {
        ToolbarModule.getParams().setContainerLoading &&
          ToolbarModule.getParams().setContainerLoading(
            true,
            getLanguage(global.language).Prompt.IMAGE_RECOGNITION_ING,
          )
        await SMap.matchPictureStyle(data[0].uri, res => {
          ToolbarModule.getParams().setContainerLoading &&
            ToolbarModule.getParams().setContainerLoading(false)
          if (!res || !res.result) {
            Toast.show(
              getLanguage(global.language).Prompt.IMAGE_RECOGNITION_FAILED,
            )
          }
        })
      }
      ToolbarModule.getParams().showFullMap &&
        ToolbarModule.getParams().showFullMap(true)
      _params.setToolbarVisible(true, ConstToolType.STYLE_TRANSFER, {
        isFullScreen: false,
        height: 0,
      })
    },
  })
}

/**
 * 显示编辑标注菜单
 */
function showEditLabel() {
  const _params = ToolbarModule.getParams()
  _params.setSelection()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  let type = ConstToolType.MAP_TOOL_TAGGING_SELECT

  _params.setToolbarVisible(true, type, {
    isFullScreen: false,
    height: 0,
    cb: () => select(type),
  })

  let layers = _params.layers.layers
  // 其他图层设置为不可选
  _setMyLayersSelectable(layers, false)

  Toast.show(
    global.language === 'CN'
      ? '点击文字左上角以选中文字'
      : 'Tap top-right of text to select it',
  )
}

/**
 * 选择标注_编辑
 */
function selectLabelToEdit() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  let event = ToolbarModule.getData().event

  let column = 4,
    height = ConstToolType.HEIGHT[3],
    containerType = ToolbarType.table,
    type = ''

  switch (global.MapToolType) {
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_POINT:
      type = ConstToolType.MAP_TOOL_TAGGING_EDIT_POINT
      height = ConstToolType.HEIGHT[0]
      break
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_LINE:
      type = ConstToolType.MAP_TOOL_TAGGING_EDIT_LINE
      height = ConstToolType.HEIGHT[2]
      break
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_REGION:
      type = ConstToolType.MAP_TOOL_TAGGING_EDIT_REGION
      height = ConstToolType.HEIGHT[2]
      containerType = ToolbarType.scrollTable
      break
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_TEXT:
      type = ConstToolType.MAP_TOOL_TAGGING_EDIT_TEXT
      height = ConstToolType.HEIGHT[0]
      break
  }
  if (type !== '') {
    _params.setToolbarVisible &&
      _params.setToolbarVisible(true, type, {
        isFullScreen: false,
        column,
        height,
        containerType,
        cb: () => SMap.appointEditGeometry(event.id, event.layerInfo.path),
      })
  }

  let layers = _params.layers.layers
  // 其他图层设置为不可选
  _setMyLayersSelectable(layers, false)

  Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_OBJECT)
}

/**
 * 选择标注_设置风格
 */
function selectLabelToStyle() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)

  let event = ToolbarModule.getData().event
  let showMenuDialog = false
  let isFullScreen = false
  let containerType = ''
  let height = ConstToolType.THEME_HEIGHT[3]
  let type = ''
  switch (global.MapToolType) {
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_POINT:
      containerType = ToolbarType.symbol
      type = ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT
      break
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_LINE:
      containerType = ToolbarType.symbol
      type = ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE
      break
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_REGION:
      containerType = ToolbarType.symbol
      type = ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION
      break
    case ConstToolType.MAP_TOOL_TAGGING_SELECT_TEXT:
      showMenuDialog = true
      height = 0
      isFullScreen = true
      type = ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT
      break
  }

  if (type !== '') {
    _params.setToolbarVisible &&
      _params.setToolbarVisible(true, type, {
        containerType,
        isFullScreen,
        column: 4,
        height,
        showMenuDialog,
        cb: () => {
          StyleUtils.setSingleSelectionStyle(event.layerInfo.path)
          SMap.setLayerEditable(event.layerInfo.path, false)
          SMap.setAction(Action.PAN)
        },
      })
  }

  let layers = _params.layers.layers
  // 其他图层设置为不可选
  _setMyLayersSelectable(layers, false)

  Toast.show(getLanguage(global.language).Prompt.PLEASE_SELECT_OBJECT)
}

//设置我的图层的可选择性
function _setMyLayersSelectable(layers, selectable) {
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].type === 'layerGroup') {
      _setMyLayersSelectable(layers[i].child, selectable)
    } else if (
      LayerUtils.getLayerType(layers[i]) !== 'TAGGINGLAYER' &&
      layers[i].isSelectable
    ) {
      SMap.setLayerSelectable(layers[i].path, selectable)
    }
  }
}

/**
 * 删除标注
 */
async function deleteLabel() {
  const _params = ToolbarModule.getParams()
  let _selection = _params.selection
  if (_selection.length === 0) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)
    return
  }

  _selection.forEach(async item => {
    if (item.ids.length > 0) {
      await SCollector.removeByIds(item.ids, item.layerInfo.path)
      await SMediaCollector.removeByIds(item.ids, item.layerInfo.name)
    }
  })
  _params.setSelection()
  let type = ConstToolType.MAP_TOOL_TAGGING_SELECT

  _params.setToolbarVisible(true, type, {
    isFullScreen: false,
    height: 0,
    cb: () => select(type),
  })
}

function geometrySelected(event) {
  const _params = ToolbarModule.getParams()
  let geoType
  for (let i = 0; i < event.fieldInfo.length; i++) {
    if (event.fieldInfo[i].name === 'SmGeoType') {
      geoType = event.fieldInfo[i].value
      break
    }
  }
  if (GLOBAL.MapToolType === ConstToolType.MAP_TOOL_TAGGING_SELECT) {
    ToolbarModule.addData({
      event: event,
    })
    let type = ''
    switch (geoType) {
      case DatasetType.POINT:
        type = ConstToolType.MAP_TOOL_TAGGING_SELECT_POINT
        break
      case DatasetType.LINE:
        type = ConstToolType.MAP_TOOL_TAGGING_SELECT_LINE
        break
      case DatasetType.REGION:
        type = ConstToolType.MAP_TOOL_TAGGING_SELECT_REGION
        break
      case DatasetType.TEXT:
        type = ConstToolType.MAP_TOOL_TAGGING_SELECT_TEXT
    }

    if (type !== '') {
      _params.setToolbarVisible(true, type, {
        isFullScreen: false,
        column: 5,
        height: ConstToolType.HEIGHT[0],
        cb: () => {
          StyleUtils.setSingleSelectionStyle(event.layerInfo.path)
          SMap.setLayerEditable(event.layerInfo.path, false)
          SMap.setAction(Action.PAN)
        },
      })
    }
  }
}

function colorAction(params) {
  switch (params.type) {
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_POINT_COLOR_SET:
      SMap.setTaggingMarkerColor(params.key)
      break
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_LINE_COLOR_SET:
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_BOARDERCOLOR_SET:
      SMap.setTaggingLineColor(params.key)
      break
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_REGION_FORECOLOR_SET:
      SMap.setTaggingFillForeColor(params.key)
      break
    case ConstToolType.MAP_TOOL_TAGGING_STYLE_TEXT_COLOR_SET:
      SMap.setTaggingTextColor(params.key)
      break
    default:
      break
  }
}

function setTaggingTextFont(param) {
  switch (param.title) {
    case getLanguage(global.language).Map_Main_Menu.STYLE_BOLD:
      SMap.setTaggingTextFont('BOLD')
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_ITALIC:
      SMap.setTaggingTextFont('ITALIC')
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_UNDERLINE:
      SMap.setTaggingTextFont('UNDERLINE')
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_STRIKEOUT:
      SMap.setTaggingTextFont('STRIKEOUT')
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_SHADOW:
      SMap.setTaggingTextFont('SHADOW')
      break
    case getLanguage(global.language).Map_Main_Menu.STYLE_OUTLINE:
      SMap.setTaggingTextFont('OUTLINE')
      break
  }
}

// function captureVideo () {
//   let options = {
//     datasourceName: 'Hunan',
//   }
//   SMediaCollector.captureVideo(options, data => {
//     console.warn(JSON.stringify(data))
//   })
// }
//
// function startCaptureAudio () {
//   let options = {
//     datasourceName: 'Hunan',
//   }
//   SMediaCollector.startCaptureAudio(options)
// }
//
// function stopCaptureAudio () {
//   SMediaCollector.stopCaptureAudio(data => {
//     console.warn(JSON.stringify(data))
//   })
// }

/********** 裁剪手势监听 ************/
// async function addMapCutListener() {
//   await SMap.setGestureDetector({
//     touchBeganHandler: touchBeganHandler,
//     scrollHandler: scrollHandler,
//     touchEndHandler: touchEndHandler,
//     // scrollHandler: scrollHandler,
//   })
// }
//
// async function removeMapCutListener() {
//   await SMap.deleteGestureDetector()
// }
//
// let drawGeo = {
//   id: -1,
//   startPoint: {},
//   endPoint: {},
// }
// function touchBeganHandler (event) {
//   STracking.clear().then(async () => {
//     drawGeo.startPoint = {x: event.x, y: event.y}
//     drawGeo.id = await STracking.drawRectangle(drawGeo.id, drawGeo.startPoint, drawGeo.startPoint)
//   })
// }
//
// function scrollHandler (event) {
//   if (drawGeo.startPoint.x === event.x && drawGeo.startPoint.y === event.y){
//     return
//   } else if (drawGeo.startPoint.x === undefined && drawGeo.startPoint.y === undefined) {
//     drawGeo.startPoint.x = event.x
//     drawGeo.startPoint.y = event.y
//     return
//   }
//   drawGeo.endPoint = {x: event.x, y: event.y}
//   STracking.drawRectangle(drawGeo.id, drawGeo.startPoint, drawGeo.endPoint).then(async id => {
//     drawGeo.id = id
//   })
// }
//
// function touchEndHandler (event) {
//   drawGeo.endPoint = {x: event.x, y: event.y}
//   console.warn(JSON.stringify(drawGeo))
// }

function commit(type) {
  const _params = ToolbarModule.getParams()
  // getParams.showToolbar(false)
  if (typeof type === 'string' && type.indexOf('MAP_EDIT_') >= 0) {
    if (type === ConstToolType.MAP_EDIT_DEFAULT) {
      // 编辑完成关闭Toolbar
      _params.setToolbarVisible(false, '', {
        cb: () => {
          SMap.setAction(Action.PAN)
        },
      })
    } else if (
      type !== ConstToolType.MAP_TOOL_TAGGING &&
      type !== ConstToolType.MAP_TOOL_TAGGING_SETTING
    ) {
      // 编辑完成关闭Toolbar
      // 若为编辑点线面状态，点击关闭则返回没有选中对象的状态
      _params.setToolbarVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
        isFullScreen: false,
        height: 0,
        cb: () => {
          SMap.submit()
          SMap.setAction(Action.SELECT)
        },
      })
    }
  } else if (type === ConstToolType.MAP_TOOL_TAGGING) {
    (async function() {
      let currentLayer = _params.currentLayer
      // let reg = /^Label_(.*)#$/
      let layerType
      if (currentLayer && !currentLayer.themeType) {
        layerType = LayerUtils.getLayerType(currentLayer)
      }
      // if (
      //   isTaggingLayer||
      //   isPointLayer ||
      //   isLineLayer ||
      //   isRegionLayer ||
      //   isTextLayer
      // ) {
      layerType === 'TAGGINGLAYER' &&
        SMap.setTaggingGrid(
          currentLayer.datasetName,
          _params.user.currentUser.userName,
        )
      SMap.submit()
      SMap.refreshMap()
      SMap.setAction(Action.PAN)
      if (type === ConstToolType.MAP_TOOL_TAGGING) {
        _params.setToolbarVisible(
          true,
          ConstToolType.MAP_TOOL_TAGGING_SETTING,
          {
            isFullScreen: false,
            containerType: 'list',
            height:
              _params.device.orientation === 'LANDSCAPE'
                ? ConstToolType.TOOLBAR_HEIGHT[3]
                : ConstToolType.TOOLBAR_HEIGHT[3],
            column: _params.device.orientation === 'LANDSCAPE' ? 8 : 4,
          },
        )
      }
      // } else {
      //   Toast.show(
      //     getLanguage(_params.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
      //   )
      // }
    }.bind(this)())
  } else if (type === ConstToolType.MAP_TOOL_TAGGING_SETTING) {
    let datasourceName = GLOBAL.currentLayer.datasourceAlias
    let datasetName = GLOBAL.currentLayer.datasetName
    let name = ToolbarModule.getData().tools_name || ''
    let remark = ToolbarModule.getData().tools_remarks || ''
    let address = ToolbarModule.getData().tools_http || ''
    ;(async function() {
      name !== '' &&
        (await SMap.addRecordset(
          datasourceName,
          datasetName,
          'name',
          name,
          _params.user.currentUser.userName,
        ))
      remark !== '' &&
        (await SMap.addRecordset(
          datasourceName,
          datasetName,
          'remark',
          remark,
          _params.user.currentUser.userName,
        ))
      address !== '' &&
        (await SMap.addRecordset(
          datasourceName,
          datasetName,
          'address',
          address,
          _params.user.currentUser.userName,
        ))
    }.bind(this)())
    // getParams.taggingBack()
    _params.setToolbarVisible(false, type, {
      height: 0,
    })
    ToolbarModule.setData()
    //提交标注后 需要刷新属性表
    GLOBAL.NEEDREFRESHTABLE = true
  } else if (type === ConstToolType.MAP_TOOL_RECTANGLE_CUT) {
    NavigationService.navigate('MapCut', {
      points: GLOBAL.MapSurfaceView.getResult(),
    })
  } else if (type === ConstToolType.STYLE_TRANSFER) {
    // ToolbarPicker.hide()
    SMap.resetMapFixColorsModeValue(false)
    _params.setToolbarVisible(false, '', {
      cb: () => {
        SMap.setAction(Action.PAN)
      },
    })
  } else if (
    type.indexOf('MAP_TOOL_TAGGING_EDIT') !== -1 ||
    type.indexOf('MAP_TOOL_TAGGING_STYLE') !== -1
  ) {
    SMap.clearSelection()
    SMap.setAction(Action.PAN)
    let layers = _params.layers.layers
    // 还原其他图层的选择状态
    _setMyLayersSelectable(layers, true)
    for (let i = 0; i < layers.length; i++) {
      if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
        if (
          _params.currentLayer &&
          _params.currentLayer.name &&
          _params.currentLayer.name === layers[i].name
        ) {
          SMap.setLayerEditable(layers[i].path, true)
        }
      }
    }
    _params.setToolbarVisible(false)
  } else {
    return false // 表示没找到对应方法，调用默认方法
  }
}

async function showAttribute() {
  const _params = ToolbarModule.getParams()
  let _selection = _params.selection
  if (_selection.length === 0) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)
    return
  }

  let attributes = await SMap.getSelectionAttributeByLayer(
    _selection[0].layerInfo.path,
    0,
    1,
  )
  if (attributes.total === 0) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)
    return
  }

  let selectObjNums = 0
  _selection.forEach(item => {
    selectObjNums += item.ids.length
  })
  selectObjNums === 0 &&
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)

  NavigationService.navigate(
    'LayerSelectionAttribute',
    GLOBAL.SelectedSelectionAttribute && {
      selectionAttribute: GLOBAL.SelectedSelectionAttribute,
    },
  )
}

function menu(type, selectKey, params = {}) {
  let isFullScreen, showMenuDialog, isTouchProgress
  let showBox = function() {
    if (type.indexOf('MAP_TOOL_TAGGING_STYLE') !== -1) {
      params.showBox && params.showBox()
    }
  }.bind(this)

  let setData = function() {
    params.setData &&
      params.setData({
        isFullScreen,
        showMenuDialog,
        isTouchProgress,
      })
  }.bind(this)

  if (Utils.isTouchProgress(selectKey)) {
    isFullScreen = true
    showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
    isTouchProgress = GLOBAL.ToolBar.state.showMenuDialog
    setData()
  } else {
    isFullScreen = !GLOBAL.ToolBar.state.showMenuDialog
    showMenuDialog = !GLOBAL.ToolBar.state.showMenuDialog
    isTouchProgress = false
    if (!GLOBAL.ToolBar.state.showMenuDialog) {
      // 先滑出box，再显示Menu
      showBox()
      setTimeout(setData, Const.ANIMATED_DURATION_2)
    } else {
      // 先隐藏Menu，再滑进box
      setData()
      showBox()
    }
  }
}

function showMenuBox(type, selectKey, params = {}) {
  if (type.indexOf('MAP_TOOL_TAGGING_STYLE') !== -1) {
    if (Utils.isTouchProgress(selectKey)) {
      params.setData &&
        params.setData({
          isTouchProgress: GLOBAL.ToolBar.state.showMenuDialog,
          showMenuDialog: !GLOBAL.ToolBar.state.showMenuDialog,
          isFullScreen: true,
        })
    } else {
      if (!GLOBAL.ToolBar.state.showMenuDialog) {
        params.showBox && params.showBox()
      } else {
        params.setData &&
          params.setData({
            showMenuDialog: false,
            isFullScreen: false,
          })
        params.showBox && params.showBox()
      }
    }
    return
  }

  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(true, ConstToolType.STYLE_TRANSFER_PICKER, {
    containerType: ToolbarType.picker,
    isFullScreen: false,
    height: ConstToolType.TOOLBAR_HEIGHT_2[3],
    // cb: () => SCollector.stopCollect(),
  })
}

/**
 * Picker类型确认按钮
 * @param params
 * {
    selectKey: item,
    selectName: item,
   }
 */
function pickerConfirm(params) {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(true, ConstToolType.STYLE_TRANSFER, {
    isFullScreen: true,
    showMenuDialog: false,
    isTouchProgress: true,
    height: 0,
    ...params,
  })
}

/**
 * Picker类型确认按钮
 */
function pickerCancel() {
  const _params = ToolbarModule.getParams()
  _params.setToolbarVisible(true, ConstToolType.STYLE_TRANSFER, {
    isFullScreen: false,
    showMenuDialog: false,
    isTouchProgress: false,
    height: 0,
  })
}

/**
 * Toolbar列表多选框
 * @param selectList
 * @returns {Promise.<void>}
 */
async function listSelectableAction({ selectList }) {
  ToolbarModule.addData({ selectList })
}

function toolbarBack() {
  const _params = ToolbarModule.getParams()
  if (GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_SELECT_') !== -1) {
    SMap.clearSelection()
    _params.setSelection()
    let type = ConstToolType.MAP_TOOL_TAGGING_SELECT

    _params.setToolbarVisible(true, type, {
      isFullScreen: false,
      height: 0,
      cb: () => select(type),
    })
  } else if (
    GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_EDIT') !== -1 ||
    GLOBAL.MapToolType.indexOf('MAP_TOOL_TAGGING_STYLE') !== -1
  ) {
    let type = ''
    if (GLOBAL.MapToolType.indexOf('_POINT') !== -1) {
      type = ConstToolType.MAP_TOOL_TAGGING_SELECT_POINT
    } else if (GLOBAL.MapToolType.indexOf('_LINE') !== -1) {
      type = ConstToolType.MAP_TOOL_TAGGING_SELECT_LINE
    } else if (GLOBAL.MapToolType.indexOf('_REGION') !== -1) {
      type = ConstToolType.MAP_TOOL_TAGGING_SELECT_REGION
    } else if (GLOBAL.MapToolType.indexOf('_TEXT') !== -1) {
      type = ConstToolType.MAP_TOOL_TAGGING_SELECT_TEXT
    }
    if (type !== '') {
      let event = ToolbarModule.getData().event
      _params.setToolbarVisible(true, type, {
        isFullScreen: false,
        column: 5,
        height: ConstToolType.HEIGHT[0],
        cb: () => {
          StyleUtils.setSingleSelectionStyle(event.layerInfo.path)
          SMap.setLayerEditable(event.layerInfo.path, false)
          SMap.setAction(Action.PAN)
        },
      })
    }
  }
}

function close(type) {
  const _params = ToolbarModule.getParams()
  if (
    type === ConstToolType.MAP_TOOL_SELECT_BY_RECTANGLE ||
    type === ConstToolType.MAP_TOOL_TAGGING_SELECT_BY_RECTANGLE ||
    type === ConstToolType.MAP_TOOL_TAGGING_POINT_SELECT ||
    type === ConstToolType.MAP_TOOL_POINT_SELECT
  ) {
    SMap.setAction(Action.PAN)
    SMap.clearSelection()
    _params.setToolbarVisible(false)
  } else if (type === ConstToolType.MAP_TOOL_TAGGING_SELECT) {
    SMap.setAction(Action.PAN)
    let layers = _params.layers.layers
    // 还原其他图层的选择状态
    _setMyLayersSelectable(layers, true)
    for (let i = 0; i < layers.length; i++) {
      if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
        if (
          _params.currentLayer &&
          _params.currentLayer.name &&
          _params.currentLayer.name === layers[i].name
        ) {
          SMap.setLayerEditable(layers[i].path, true)
        }
      }
    }
    _params.setToolbarVisible(false)
  } else if (
    typeof type === 'string' &&
    type.indexOf('MAP_TOOL_MEASURE_') >= 0
  ) {
    ToolbarModule.addData({ pointArr: [], redoArr: [] })
    _params.setToolbarStatus({
      canUndo: false,
      canRedo: false,
    })
    SMap.setAction(Action.PAN)
    _params.showMeasureResult(false)
    _params.setToolbarVisible(false)
  } else {
    return false
  }
}

export default {
  commit,
  showAttribute,
  menu,
  showMenuBox,
  matchPictureStyle,
  pickerConfirm,
  pickerCancel,
  measureLength,
  measureArea,
  measureAngle,
  clearMeasure,
  undo,
  redo,
  listSelectableAction,
  close,
  toolbarBack,
  showEditLabel,
  selectLabelToEdit,
  selectLabelToStyle,
  deleteLabel,
  geometrySelected,
  colorAction,
  setTaggingTextFont,

  begin,
  stop,
  submit,
  select,
  cancelSelect,
  viewEntire,
  pointSelect,
  selectByRectangle,
  rectangleCut,
  point,
  words,
  pointline,
  freeline,
  pointcover,
  freecover,
  captureImage,
  tour,

  setting,
}
