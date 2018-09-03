import {
  TransportationAnalyst,
  TransportationAnalystSetting,
  WeightFieldInfo,
  WeightFieldInfos,
  Point,
  CoordSysTranslator,
  CoordSysTransParameter,
  CoordSysTransMethod,
  Callout,
  GeoStyle,
  Size2D,
  Action,
  GeoPoint,
  GeoLineM,
  PrjCoordSys,
  PrjCoordSysType,
  SMMapView,
  TransportationAnalystParameter,
} from 'imobile_for_javascript'
import { Toast } from '../../../utils'

let point2Ds = []
let analystSetting, transportationAnalyst
let mMapView, mMapControl, mMap, mSelection, mTrackingLayer, mDatasetVector
let longPressEnable = true,
  endPointEnable = false, analystEnable = false

// TODO 设置旅行商/最佳路径 类型
// TODO 设置旅行商 配送中心，目的地 标示

function setStart() {

}

function setEnd() {

}

function addNode(node) {
  point2Ds.push(node)
}

function getNodes() {
  return point2Ds
}

async function clear() {
  point2Ds = []
  longPressEnable = true
  // TODO 清除Selection
  mTrackingLayer && await mTrackingLayer.clear()
  // transportationAnalyst && transportationAnalyst.dispose()
  // mMapControl && await mMapControl.setAction(Action.PAN)
  mMap && await mMap.refresh()
}

function dispose() {
  point2Ds = []
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
}

function check() {
  if (!analystSetting || !mMap || !mTrackingLayer) {
    Toast.show('请加载分析图层')
    return false
  } else if (point2Ds.length === 0) {
    Toast.show('请加选择节点')
    return false
  }
  return true
}

async function longPressHandler(event) {
  if (!longPressEnable) return // 防止重复点击
  longPressEnable = false
  try {
    // if (!check()) return
    let pt = await new Point().createObj(event.x, event.y)
    let pt2D = await mMap.pixelToMap(pt)
    let callOut = await new Callout().createObj(mMapView)
    // callOut.setStyle()
    await callOut.setCustomize(true)
    // await callOut.setLocation(pt2D)
    await callOut.setLocation(pt2D.x, pt2D.y)

    // 判断是否是经纬坐标
    let prjCoordSys = await mMap.getPrjCoordSys()
    let isLongitudeLatitude = await prjCoordSys.getType() === PrjCoordSysType.PCS_EARTH_LONGITUDE_LATITUDE
    if (!isLongitudeLatitude) {
      let points = []
      points.push(pt2D)

      let desPrjCoorSys = await new PrjCoordSys().createObj()
      await desPrjCoorSys.setType(PrjCoordSysType.PCS_EARTH_LONGITUDE_LATITUDE)

      let coordSysTransParameter = await new CoordSysTransParameter().createObj()
      await CoordSysTranslator.convertByPoint2Ds(points, prjCoordSys, desPrjCoorSys, coordSysTransParameter, CoordSysTransMethod.MTH_GEOCENTRIC_TRANSLATION)

      pt2D = points[0]
    }

    let geoPoint = await new GeoPoint().createObj(pt2D.x, pt2D.y)

    let geoStyle = await getGeoStyle(15, 15, 255, 0, 0)
    await geoStyle.setMarkerSymbolID(3614)
    await geoPoint.setStyle(geoStyle)
    await mTrackingLayer.add(geoPoint, '')
    await mMap.refresh()

    // if (!endPointEnable) {
    //   // await callOut.setContentView(Callout.Image.STARTPOINT)
    //   await mMapView.addCallOut(callOut, '起点')
    //   // await callOut.showAtXY(pt2D.x, pt2D.y)
    //   endPointEnable = true
    //   point2Ds.push({x: pt2D.x, y: pt2D.y})
    longPressEnable = true
    //   return
    // }

    // await callOut.setContentView(Callout.Image.DESTPOINT)
    // await mMapView.addCallOut(callOut, '终点')
    // await callOut.showAtXY(pt2D.x, pt2D.y)
    point2Ds.push({x: pt2D.x, y: pt2D.y})
    // longPressEnable = false // 只有起点和终点
  } catch (e) {
    console.error(e)
  }
}

async function loadModel(mapView, mapControl, datasetVector) {
  try {
    await clear()
    mMapView = mapView
    mMapControl = mapControl
    mMap = await mMapControl.getMap()
    mTrackingLayer = await mMap.getTrackingLayer()
    if (transportationAnalyst) {
      await transportationAnalyst.dispose()
    }
    mDatasetVector = datasetVector
    await addGestureDetector()

    analystSetting = await new TransportationAnalystSetting().createObj()

    await analystSetting.setNetworkDataset(datasetVector)
    await analystSetting.setNodeIDField('SmNodeID')
    await analystSetting.setEdgeIDField('SmEdgeID')
    await analystSetting.setEdgeNameField('roadName')
    await analystSetting.setTolerance(90)
    await analystSetting.setFNodeIDField('SmFNode')
    await analystSetting.setTNodeIDField('SmTNode')

    let fieldInfo = await new WeightFieldInfo().createObj()
    await fieldInfo.setName('length')
    await fieldInfo.setFTWeightField('smLength')
    await fieldInfo.setTFWeightField('smLength')

    let fieldInfos = await new WeightFieldInfos().createObj()
    await fieldInfos.add(fieldInfo)

    await analystSetting.setWeightFieldInfos(fieldInfos)

    transportationAnalyst = await new TransportationAnalyst().createObj()
    await transportationAnalyst.setAnalystSetting(analystSetting)

    let result = await transportationAnalyst.load()
    return result
    // return true
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

async function display(result) {
  try {
    if (!result) return
    await mTrackingLayer.clear()

    let routes = result.routes
    if (!routes || routes.length <= 0) {
      return
    }

    for (let i = 0; i < routes.length; i++) {
      let style = await getGeoLineStyle(1, 255, 80, 0)
      await routes[i].setStyle(style)
      await mTrackingLayer.add(routes[i], "result")
    }

    await mMap.refresh()

  } catch (e) {
    console.error(e)
    return false
  }
}

async function findPath() {
  try {
    if (!check()) return
    let parameter = await new TransportationAnalystParameter().createObj()
    await parameter.setWeightName('length')
    //设置最佳路径分析的返回对象

    await parameter.setPoints(point2Ds)
    await parameter.setNodesReturn(true)
    await parameter.setEdgesReturn(true)
    await parameter.setPathGuidesReturn(true)
    await parameter.setRoutesReturn(true)

    let result = await transportationAnalyst.findPath(parameter, false)
    this.display(result)
  } catch (e) {
    Toast.show('分析路径失败')
  }
}

async function findMTSPPath() {
  try {
    if (!check()) return
    let parameter = await new TransportationAnalystParameter().createObj()
    await parameter.setWeightName('length')
    //设置最佳路径分析的返回对象

    await parameter.setPoints(point2Ds)
    await parameter.setNodesReturn(true)
    await parameter.setEdgesReturn(true)
    await parameter.setPathGuidesReturn(true)
    await parameter.setRoutesReturn(true)

    let result = await transportationAnalyst.findMTSPPath(parameter, false)
    this.display(result)
  } catch (e) {
    Toast.show('分析路径失败')
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

async function getGeoLineStyle(w, r, g, b) {
  try {
    let geoStyle = await new GeoStyle().createObj()
    await geoStyle.setLineWidth(w)
    await geoStyle.setLineColor(r, g, b)

    return geoStyle
  } catch (e) {
    console.error(e)
    return false
  }
}

export default {
  setStart,
  setEnd,

  addNode,
  getNodes,
  clear,

  loadModel,
  display,

  findPath,

  getGeoStyle,
  getGeoLineStyle,

  addGestureDetector,
  deleteGestureDetector,

  dispose,
}