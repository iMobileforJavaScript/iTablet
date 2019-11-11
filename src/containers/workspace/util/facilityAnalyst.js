import {
  // FacilityAnalyst,
  // FacilityAnalystSetting,
  // WeightFieldInfo,
  // WeightFieldInfos,
  Point,
  GeoStyle,
  Size2D,
  Action,
  GeoPoint,
} from 'imobile_for_reactnative'
import { Toast } from '../../../utils'

let mNodes = []
let analystSetting, facilityAnalyst
let mMapControl,
  mMap,
  mSelection,
  mAnalystLayer,
  mNodelLayer,
  mTrackingLayer,
  _setLoading = () => {}
function addNode(node) {
  mNodes.push(node)
}

function getNodes() {
  return mNodes
}

async function clear() {
  mNodes = []
  // TODO 清除Selection
  mTrackingLayer && (await mTrackingLayer.clear())
  if (mMapControl) {
    await mMapControl.setAction(Action.PAN)
  }
  if (mMap) {
    await mMap.refresh()
  }
}

async function dispose() {
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
  if (mAnalystLayer) {
    mAnalystLayer = null
  }
  if (mNodelLayer) {
    mNodelLayer = null
  }
  if (mSelection) {
    mSelection = null
  }
  if (_setLoading) {
    _setLoading = () => {}
  }
  if (facilityAnalyst) {
    await facilityAnalyst.dispose()
  }
}

function check(checkNodes = true) {
  if (!analystSetting || !mMap || !mSelection || !mTrackingLayer) {
    Toast.show('请加载分析图层')
    return false
  } else if (mNodes.length === 0 && checkNodes) {
    Toast.show('请加选择节点')
    return false
  }
  return true
}

async function longPressHandler(event) {
  try {
    if (!check(false)) return
    let pt = await new Point().createObj(event.x, event.y)
    // let layer = await mMap.getLayer(0)
    let selection = await mNodelLayer.hitTestEx(pt, 20)
    let selectionCount = await selection.getCount()
    if (selection && selectionCount > 0) {
      let recordset = selection.recordset
      let geometry = await recordset.getGeometry()
      let geoPoint = new GeoPoint()
      geoPoint._SMGeoPointId = geometry._SMGeometryId
      let records = await recordset.getFieldInfosArray()

      for (let i = 0; i < records[0].length; i++) {
        if (records[0].name === 'SMNODEID') {
          mNodes.push(records[0]['SMNODEID'].value)
          break
        }
      }

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
    () => {}
  }
}

async function loadModel(
  mapControl,
  analystLayer,
  nodelLayer,
  datasetVector,
  setLoading = () => {},
) {
  try {
    await dispose()
    _setLoading = setLoading
    mMapControl = mapControl
    mMap = await mMapControl.getMap()
    mAnalystLayer = analystLayer
    mNodelLayer = nodelLayer
    mSelection = await mAnalystLayer.getSelection()

    mTrackingLayer = await mMap.getTrackingLayer()
    if (facilityAnalyst) {
      await facilityAnalyst.dispose()
    }
    // analystSetting = await new FacilityAnalystSetting().createObj()
    // await addGestureDetector()
    //
    // await analystSetting.setNetworkDataset(datasetVector)
    // await analystSetting.setNodeIDField('SmNodeID')
    // await analystSetting.setEdgeIDField('SmID')
    // await analystSetting.setFNodeIDField('SmFNode')
    // await analystSetting.setTNodeIDField('SmTNode')
    // await analystSetting.setDirectionField('Direction')
    //
    // let fieldInfo = await new WeightFieldInfo().createObj()
    // await fieldInfo.setName('length')
    // await fieldInfo.setFTWeightField('SmLength')
    // await fieldInfo.setTFWeightField('SmLength')
    //
    // let fieldInfos = await new WeightFieldInfos().createObj()
    // await fieldInfos.add(fieldInfo)
    //
    // await analystSetting.setWeightFieldInfos(fieldInfos)
    //
    // facilityAnalyst = await new FacilityAnalyst().createObj()
    // await facilityAnalyst.setAnalystSetting(analystSetting)
    //
    // let result = await facilityAnalyst.load()
    //
    // mMapControl && (await mMapControl.setAction(Action.SELECT))
    // return result || false
  } catch (e) {
    Toast.show('加载失败')
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

async function display(selection) {
  try {
    if (!check()) return
    let recordSet = await selection.toRecordset()
    // let recordSet = await mSelection.recordset
    await recordSet.moveFirst()
    // let bb = await recordSet.moveFirst()
    // let isEOFF = await recordSet0.isEOF()
    let isEOF = await recordSet.isEOF()
    while (!isEOF) {
      let geometry = await recordSet.getGeometry()
      let style = await getGeoStyle(10, 10, 255, 105, 0)
      await geometry.setStyle(style)
      mTrackingLayer && (await mTrackingLayer.add(geometry, ''))
      await recordSet.moveNext()

      isEOF = await recordSet.isEOF()
    }
    recordSet.dispose()
    _setLoading(false)
    await (await mMapControl.getMap()).refresh()
    // await mMap.refresh()
  } catch (e) {
    _setLoading(false)
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
    () => {}
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
async function traceUp(
  weightName = 'length',
  isUncertainDirectionValid = true,
) {
  try {
    if (!check()) return
    await mSelection.clear()
    _setLoading(true, '分析中')
    for (let i = 0; i < mNodes.length; i++) {
      let { edges } = await facilityAnalyst.traceUpFromNode(
        mNodes[i],
        weightName,
        isUncertainDirectionValid,
      )
      // let { edges } = await facilityAnalyst.findPathUpFromNode(mNodes[i], weightName, isUncertainDirectionValid)

      if (!edges || edges.length <= 0) {
        _setLoading(false)
        Toast.show('没有上游')
        return
      }

      edges &&
        edges.forEach(async edge => {
          await mSelection.add(edge)
        })
    }
    await display(mSelection)
    await mMapControl.setAction(Action.PAN)
  } catch (e) {
    _setLoading(false)
    Toast.show('上游追踪失败')
  }
}

async function traceDown(
  weightName = 'length',
  isUncertainDirectionValid = true,
) {
  try {
    if (!check()) return
    await mSelection.clear()
    _setLoading(true, '分析中')
    for (let i = 0; i < mNodes.length; i++) {
      let { edges } = await facilityAnalyst.traceDownFromNode(
        mNodes[i],
        weightName,
        isUncertainDirectionValid,
      )

      if (!edges || edges.length <= 0) {
        _setLoading(false)
        Toast.show('没有下游')
        return
      }

      edges &&
        edges.forEach(async edge => {
          await mSelection.add(edge)
        })
    }
    await display(mSelection)
    await mMapControl.setAction(Action.PAN)
  } catch (e) {
    _setLoading(false)
    Toast.show('下游追踪失败')
  }
}

async function connectedAnalyst(
  weightName = 'length',
  isUncertainDirectionValid = false,
) {
  try {
    if (!check()) return
    await mSelection.clear()
    _setLoading(true, '分析中')
    for (let i = 0; i < mNodes.length - 1; i++) {
      let { edges } = await facilityAnalyst.findPathFromNodes(
        mNodes[i],
        mNodes[i + 1],
        weightName,
        isUncertainDirectionValid,
      )

      if (!edges || edges.length <= 0) {
        _setLoading(false)
        Toast.show('两点间不连通')
        return
      }

      edges &&
        edges.forEach(async edge => {
          await mSelection.add(edge)
        })
    }

    await display(mSelection)
    await mMapControl.setAction(Action.PAN)
  } catch (e) {
    _setLoading(false)
    Toast.show('连通分析失败')
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
