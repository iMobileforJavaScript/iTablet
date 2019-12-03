import {
  SMap,
  Action,
  SMediaCollector,
  DatasetType,
  SAIDetectView,
} from 'imobile_for_reactnative'
import {
  ConstToolType,
  TouchType,
  ConstPath,
  ToolbarType,
} from '../../../../../../constants'
import { dataUtil, Toast, StyleUtils } from '../../../../../../utils'
import { FileTools } from '../../../../../../native'
import { ImagePicker } from '../../../../../../components'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'

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
      if (
        pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1 &&
        _params.buttonView
      ) {
        pointArr.push(JSON.stringify(obj.curPoint))
        let newState = {}
        if (pointArr.length > 0 && _params.buttonView.state.canUndo === false)
          newState.canUndo = true
        if (_params.buttonView.state.canRedo) newState.canRedo = false
        Object.keys(newState).length > 0 &&
          _params.buttonView.setState(newState)
        ToolbarModule.setData({ pointArr, redoArr })
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
      if (
        pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1 &&
        _params.buttonView
      ) {
        pointArr.push(JSON.stringify(obj.curPoint))
        let newState = {}
        if (pointArr.length > 0 && _params.buttonView.state.canUndo === false)
          newState.canUndo = true
        if (_params.buttonView.state.canRedo) newState.canRedo = false
        Object.keys(newState).length > 0 &&
          _params.buttonView.setState(newState)
        ToolbarModule.setData({ pointArr, redoArr })
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
      if (
        pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1 &&
        _params.buttonView
      ) {
        //角度量算前两次打点不会触发回调，第三次打点添加一个标识，最后一次撤销直接清除当前所有点
        pointArr.indexOf('startLine') === -1 && pointArr.push('startLine')
        pointArr.indexOf(JSON.stringify(obj.curPoint)) === -1 &&
          pointArr.push(JSON.stringify(obj.curPoint))
        let newState = {}
        if (pointArr.length > 0 && _params.buttonView.state.canUndo === false)
          newState.canUndo = true
        if (_params.buttonView.state.canRedo) newState.canRedo = false
        Object.keys(newState).length > 0 &&
          _params.buttonView.setState(newState)
        ToolbarModule.setData({ pointArr, redoArr })
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
    if (_params.buttonView) {
      ToolbarModule.addData({ pointArr: [], redoArr: [] })
      _params.buttonView.setState({
        canUndo: false,
        canRedo: false,
      })
    }
  }
}

/** 量算功能 撤销事件 **/
function undo(type) {
  if (type === ConstToolType.MAP_TOOL_INCREMENT) {
    SMap.undo()
    return
  }
  let pointArr = ToolbarModule.getData().pointArr || []
  let redoArr = ToolbarModule.getData().redoArr || []
  const _params = ToolbarModule.getParams()
  if (!_params.buttonView || !_params.buttonView.state.canUndo) return
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
  _params.buttonView.setState(newState)
  SMap.undo()
  ToolbarModule.addData({ pointArr, redoArr })
}

/** 量算功能 重做事件 **/
function redo(type = null) {
  if (type === ConstToolType.MAP_TOOL_INCREMENT) {
    SMap.redo()
    return
  }
  let pointArr = ToolbarModule.getData().pointArr || []
  let redoArr = ToolbarModule.getData().redoArr || []
  const _params = ToolbarModule.getParams()
  if (
    !_params.buttonView ||
    !_params.buttonView.state.canRedo ||
    redoArr.length === 0
  )
    return
  let newState = {}
  if (redoArr.length > 0) {
    pointArr.push(redoArr.pop())
  }
  newState.canRedo = redoArr.length > 0
  newState.canUndo = pointArr.length > 0
  _params.buttonView.setState(newState)
  Object.keys(newState).length > 0 && _params.buttonView.setState(newState)

  SMap.redo()
  ToolbarModule.addData({ pointArr, redoArr })
}

async function point() {
  const _params = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  let currentLayer = _params.currentLayer
  // let reg = /^Label_(.*)#$/
  let isTaggingLayer = false,
    isPointLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isPointLayer = currentLayer.type === DatasetType.POINT
  }
  if (isTaggingLayer || isPointLayer) {
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
  let isTaggingLayer = false,
    isTextLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isTextLayer = currentLayer.type === DatasetType.TEXT
  }
  if (isTaggingLayer || isTextLayer) {
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
  let isTaggingLayer = false,
    isLineLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isLineLayer = currentLayer.type === DatasetType.LINE
  }
  if (isTaggingLayer || isLineLayer) {
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
  let isTaggingLayer = false,
    isLineLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isLineLayer = currentLayer.type === DatasetType.LINE
  }
  if (isTaggingLayer || isLineLayer) {
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
  let isTaggingLayer = false,
    isRegionLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isRegionLayer = currentLayer.type === DatasetType.REGION
  }
  if (isTaggingLayer || isRegionLayer) {
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
  let isTaggingLayer = false,
    isRegionLayer = false
  if (currentLayer) {
    isTaggingLayer = currentLayer.type === DatasetType.CAD
    // && currentLayer.datasourceAlias.match(reg)
    isRegionLayer = currentLayer.type === DatasetType.REGION
  }
  if (isTaggingLayer || isRegionLayer) {
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
      let isTaggingLayer = currentLayer.type === DatasetType.CAD
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
        ToolbarModule.getParams().showFullMap &&
          ToolbarModule.getParams().showFullMap(true)
        _params.setToolbarVisible(true, ConstToolType.STYLE_TRANSFER, {
          isFullScreen: false,
          height: 0,
        })
      }
    },
  })
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
      let isTaggingLayer = false,
        isPointLayer = false,
        isLineLayer = false,
        isRegionLayer = false,
        isTextLayer = false
      if (currentLayer && !currentLayer.themeType) {
        isTaggingLayer = currentLayer.type === DatasetType.CAD
        // && currentLayer.datasourceAlias.match(reg)
        isPointLayer = currentLayer.type === DatasetType.POINT
        isLineLayer = currentLayer.type === DatasetType.LINE
        isRegionLayer = currentLayer.type === DatasetType.REGION
        isTextLayer = currentLayer.type === DatasetType.TEXT
      }
      if (
        isTaggingLayer ||
        isPointLayer ||
        isLineLayer ||
        isRegionLayer ||
        isTextLayer
      ) {
        isTaggingLayer &&
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
      } else {
        Toast.show(
          getLanguage(_params.language).Prompt.PLEASE_SELECT_PLOT_LAYER,
        )
      }
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
  } else if (type === ConstToolType.MAP_TOOL_RECTANGLE_CUT) {
    NavigationService.navigate('MapCut', {
      points: GLOBAL.MapSurfaceView.getResult(),
    })
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

function showMenuBox() {
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
  } else {
    return false
  }
}

export default {
  commit,
  showAttribute,
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
