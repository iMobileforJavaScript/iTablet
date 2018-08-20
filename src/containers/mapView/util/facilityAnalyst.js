import {
  FacilityAnalyst,
  FacilityAnalystSetting,
  WeightFieldInfo,
  WeightFieldInfos,
  Point,
  GeoStyle,
  Size2D,
  Action,
  GeoPoint,
} from 'imobile_for_javascript'
import { Toast } from '../../../utils'

let mNodes = []
let analystSetting, facilityAnalyst
let mMapControl, mMap, mSelection, mTrackingLayer

function addNode(node) {
  mNodes.push(node)
}

function getNodes() {
  return mNodes
}

async function clear() {
  mNodes = []
  // TODO 清除Selection
  mTrackingLayer && await mTrackingLayer.clear()
  mMapControl && await mMapControl.setAction(Action.PAN)
  mMap && await mMap.refresh()
}

function dispose() {
  mNodes = []
  // TODO 清除Selection
  if (mTrackingLayer) {
    mTrackingLayer = null
  }
  if (mMapControl) {
    mMapControl = null
  }
  if (mMap) {
    mMap = null
  }
  if (mSelection) {
    mSelection = null
  }
  if (mTrackingLayer) {
    mTrackingLayer = null
  }
}

function check() {
  if (!analystSetting || !mMap || !mSelection || !mTrackingLayer) {
    Toast.show('请加载分析图层')
    return false
  } else if (mNodes.length === 0) {
    Toast.show('请加选择节点')
    return false
  }
  return true
}

async function longPressHandler(event) {
  try {
    // if (!check()) return
    let pt = await new Point().createObj(event.x, event.y)
    let layer = await mMap.getLayer(0)
    let selection = await layer.hitTestEx(pt, 20)
    let selectionCount = await selection.getCount()

    if (selection && selectionCount > 0) {
      let recordset = selection.recordset
      let geometry = await recordset.getGeometry()
      let geoPoint = new GeoPoint()
      geoPoint._SMGeoPointId = geometry._SMGeometryId
      let records = await recordset.getFieldInfosArray()

      mNodes.push(records[0]['SMNODEID'].value)

      // TODO 显示分析按钮可选

      let geoStyle = await getGeoStyle(10, 10, 255, 105, 0)
      await geoStyle.setMarkerSymbolID(3614)
      // await geometry.setStyle(geoStyle)
      await geoPoint.setStyle(geoStyle)

      // let point = await geometry.getInnerPoint()

      // let count = mNodes.length
      // let x = await geoPoint.getX()
      // let y = await geoPoint.getY()
      // let point2D = await new Point2D().createObj(x, y)
      // let textPart = await new TextPart().createObjWithPoint2D('节点' + count, point2D)
      // let geoText = await new GeoText().createObj(textPart)
      // let textStyle = await new TextStyle().createObj()
      // await textStyle.setForeColor(0, 255, 0)
      // await geoText.setTextStyle(textStyle)

      await mTrackingLayer.add(geoPoint, '')
      // await mTrackingLayer.add(geoText, '')
      await mMap.refresh()

    }
  } catch (e) {
    console.error(e)
  }
}

async function loadModel(mapControl, layer, datasetVector) {
  try {
    await clear()
    mMapControl = mapControl
    
    mMap = await mMapControl.getMap()
    // TODO 更改layer
    // let layer = await mMap.getLayer(1)
    mSelection = await layer.getSelection()
    let name = await (await layer.getDataset()).getName()
    debugger
    mTrackingLayer = await mMap.getTrackingLayer()
    if (facilityAnalyst) {
      await facilityAnalyst.dispose()
    }
    analystSetting = await new FacilityAnalystSetting().createObj()
    debugger
    await addGestureDetector()
    await analystSetting.setNetworkDataset(datasetVector)
    await analystSetting.setNodeIDField('SmNodeID')
    await analystSetting.setEdgeIDField('SmID')
    await analystSetting.setFNodeIDField('SmFNode')
    await analystSetting.setTNodeIDField('SmFNode')
    await analystSetting.setDirectionField('Direction')
    debugger
    let fieldInfo = await new WeightFieldInfo().createObj()
    debugger
    await fieldInfo.setName('length')
    await fieldInfo.setFTWeightField('SmLength')
    await fieldInfo.setTFWeightField('SmLength')
    debugger
    let fieldInfos = await new WeightFieldInfos().createObj()
    debugger
    await fieldInfos.add(fieldInfo)
    debugger
    await analystSetting.setWeightFieldInfos(fieldInfos)
    debugger
    facilityAnalyst = await new FacilityAnalyst().createObj()
    debugger
    await facilityAnalyst.setAnalystSetting(analystSetting)
    debugger
    let result = await facilityAnalyst.load()
    debugger
    await mMapControl.setAction(Action.SELECT)
    return result
  } catch (e) {
    console.error(e)
    return false
  }
}

async function addGestureDetector() {
  await mMapControl.setGestureDetector({
    longPressHandler: longPressHandler,
    // scrollHandler: scrollHandler,
  })
}


async function deleteGestureDetector() {
  await mMapControl.deleteGestureDetector()
}

async function display() {
  try {
    if (!check()) return
    let recordSet = await mSelection.toRecordset()
    // let recordSet = await mSelection.recordset
    await recordSet.moveFirst()
    // let bb = await recordSet.moveFirst()
    // let isEOFF = await recordSet0.isEOF()
    let isEOF = await recordSet.isEOF()
    while (!isEOF) {
      let geometry = await recordSet.getGeometry()
      let style = await getGeoStyle(10, 10, 255, 105, 0)
      await geometry.setStyle(style)
      await mTrackingLayer.add(geometry, '')
      await recordSet.moveNext()

      isEOF = await recordSet.isEOF()
    }
    await mMap.refresh()
  } catch (e) {
    console.error(e)
    return false
  }
}

async function startSelect() {
  try {
    if (!check()) return
    await mMapControl.setAction(Action.SELECT)
    let geoStyle = await new GeoStyle().createObj()
    await geoStyle.setLineColor(255, 0, 0)
    await geoStyle.setLineWidth(0.4)
    await mSelection.setStyle(geoStyle)
  } catch (e) {
    console.error(e)
  }
}

/**
 * 创建并获取GeoStyle
 * @param w 宽度
 * @param h 高度
 * @param r 红
 * @param g 绿
 * @param b 蓝
 * @returns {Promise.<*>}
 */
async function getGeoStyle(w, h, r, g, b) {
  try {
    let geoStyle = await new GeoStyle().createObj()
    let size2D = await new Size2D().createObj(w, h)
    await geoStyle.setMarkerSize(size2D)
    await geoStyle.setLineColor(r, g, b)

    return geoStyle
  } catch (e) {
    console.error(e)
    return false
  }
}

// async function findConnectedEdgesFromNodes(mNodes) {
//   try {
//     if (!check()) return
//   } catch (e) {
//
//   }
// }

/**
 * 向上追踪
 * @param selection
 * @param weightName
 * @param isUncertainDirectionValid
 * @returns {Promise.<void>}
 */
async function traceUp(weightName = 'length', isUncertainDirectionValid = true) {
  try {
    if (!check()) return
    await mSelection.clear()
    for (let i = 0; i < mNodes.length; i++) {
      let { edges } = await facilityAnalyst.traceUpFromNode(mNodes[i], weightName, isUncertainDirectionValid)
      // let { edges } = await facilityAnalyst.findPathUpFromNode(mNodes[i], weightName, isUncertainDirectionValid)

      edges.forEach(edge => {
        mSelection.add(edge)
      })

      await display(mSelection)
      await mMapControl.setAction(Action.PAN)
    }
  } catch (e) {
    console.error(e)
  }
}

async function traceDown(weightName = 'length', isUncertainDirectionValid = true) {
  try {
    if (!check()) return
    await mSelection.clear()
    for (let i = 0; i < mNodes.length; i++) {
      let { edges } = await facilityAnalyst.traceDownFromNode(mNodes[i], weightName, isUncertainDirectionValid)

      edges.forEach(edge => {
        mSelection.add(edge)
      })

      await display(mSelection)
      await mMapControl.setAction(Action.PAN)
    }
  } catch (e) {
    console.error(e)
  }
}

async function connectedAnalyst(weightName = 'length', isUncertainDirectionValid = false) {
  try {
    if (!check()) return
    await mSelection.clear()
    debugger
    for (let i = 0; i < mNodes.length - 1; i++) {
      let { edges, message } = await facilityAnalyst.findPathFromNodes(mNodes[i], mNodes[i + 1], weightName, isUncertainDirectionValid)

      edges && edges.forEach(edge => {
        mSelection.add(edge)
      })

      await display(mSelection)
      await mMapControl.setAction(Action.PAN)
    }
  } catch (e) {
    console.error(e)
  }
}

export default {
  addNode,
  getNodes,
  clear,

  loadModel,
  display,

  startSelect,
  traceUp,
  traceDown,
  connectedAnalyst,

  getGeoStyle,

  addGestureDetector,
  deleteGestureDetector,

  dispose,
}