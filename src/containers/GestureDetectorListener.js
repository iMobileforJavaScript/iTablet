import {
  SMap,
  STransportationAnalyst,
  // SFacilityAnalyst,
} from 'imobile_for_reactnative'
import NavigationService from './NavigationService'
import { getLanguage } from '../language'
import { TouchType } from '../constants'
//eslint-disable-next-line
import { Toast } from '../utils'
//eslint-disable-next-line
let _params = {}
let isDoubleTouchCome = false
function setGestureDetectorListener(params) {
  (async function() {
    await SMap.setGestureDetector({
      singleTapHandler: touchCallback,
      longPressHandler: longtouchCallback,
      doubleTapHandler: doubleTouchCallback,
    })
  }.bind(this)())
  _params = params
}

async function isDoubleTouchComing() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(isDoubleTouchCome)
      isDoubleTouchCome = false
    }, 200)
  })
}

// eslint-disable-next-line no-unused-vars
async function doubleTouchCallback(event) {
  isDoubleTouchCome = true
}

async function longtouchCallback(event) {
  switch (GLOBAL.TouchType) {
    case TouchType.NORMAL:
      break
    case TouchType.NAVIGATION_TOUCH_BEGIN:
      (async function() {
        await SMap.getStartPoint(event.LLPoint.x, event.LLPoint.y, false)
        GLOBAL.STARTX = event.LLPoint.x
        GLOBAL.STARTY = event.LLPoint.y
        //室内地图只允许在室内标注点
        // if (!GLOBAL.ISOUTDOORMAP) {
        //   let isindoor = await SMap.isIndoorPoint(
        //     event.LLPoint.x,
        //     event.LLPoint.y,
        //   )
        //   if (isindoor) {
        //     GLOBAL.STARTX = event.LLPoint.x
        //     GLOBAL.STARTY = event.LLPoint.y
        //     await SMap.getStartPoint(event.LLPoint.x, event.LLPoint.y, true)
        //   } else {
        //     Toast.show(
        //       getLanguage(_params.language).Prompt.PLEASE_SELECT_A_POINT_INDOOR,
        //     )
        //   }
        // } else {
        //   if (
        //     Math.sqrt(
        //       Math.pow(event.LLPoint.x - GLOBAL.ENDX, 2) +
        //         Math.pow(event.LLPoint.y - GLOBAL.ENDY, 2),
        //     ) < 0.001
        //   ) {
        //     Toast.show(getLanguage(GLOBAL.language).Prompt.DISTANCE_ERROR)
        //     return
        //   }
        //   GLOBAL.STARTX = event.LLPoint.x
        //   GLOBAL.STARTY = event.LLPoint.y
        //   await SMap.getStartPoint(event.LLPoint.x, event.LLPoint.y, false)
        // }
      }.bind(this)())
      break
    case TouchType.NAVIGATION_TOUCH_END:
      (async function() {
        await SMap.getEndPoint(event.LLPoint.x, event.LLPoint.y, false)
        GLOBAL.ENDX = event.LLPoint.x
        GLOBAL.ENDY = event.LLPoint.y
        //室内地图只允许在室内标注点
        // if (!GLOBAL.ISOUTDOORMAP) {
        //   let isindoor = await SMap.isIndoorPoint(
        //     event.LLPoint.x,
        //     event.LLPoint.y,
        //   )
        //   if (isindoor) {
        //     GLOBAL.ENDX = event.LLPoint.x
        //     GLOBAL.ENDY = event.LLPoint.y
        //     await SMap.getEndPoint(event.LLPoint.x, event.LLPoint.y, true)
        //   } else {
        //     Toast.show(
        //       getLanguage(_params.language).Prompt.PLEASE_SELECT_A_POINT_INDOOR,
        //     )
        //   }
        // } else {
        //   if (
        //     Math.sqrt(
        //       Math.pow(event.LLPoint.x - GLOBAL.STARTX, 2) +
        //         Math.pow(event.LLPoint.y - GLOBAL.STARTY, 2),
        //     ) < 0.001
        //   ) {
        //     Toast.show(getLanguage(GLOBAL.language).Prompt.DISTANCE_ERROR)
        //     return
        //   }
        //   GLOBAL.ENDX = event.LLPoint.x
        //   GLOBAL.ENDY = event.LLPoint.y
        //   await SMap.getEndPoint(event.LLPoint.x, event.LLPoint.y, false)
        // }
      }.bind(this)())
      break
  }
}
let isfull = false
async function touchCallback(event) {
  let guideInfo
  switch (GLOBAL.TouchType) {
    case TouchType.NORMAL:
      if (
        GLOBAL.PoiInfoContainer &&
        GLOBAL.PoiInfoContainer.state.resultList.length > 0 &&
        !GLOBAL.PoiInfoContainer.state.showMore
      ) {
        GLOBAL.PoiInfoContainer.hidden()
      }
      guideInfo = await SMap.isGuiding()
      if (
        !guideInfo.isOutdoorGuiding &&
        !guideInfo.isIndoorGuiding &&
        (!GLOBAL.NAVIGATIONSTARTHEAD ||
          !GLOBAL.NAVIGATIONSTARTHEAD.state.show) &&
        !GLOBAL.PoiInfoContainer.state.visible
      ) {
        if (!(await isDoubleTouchComing())) {
          if (isfull) {
            GLOBAL.toolBox && GLOBAL.toolBox.existFullMap()
          } else {
            GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
          }
          isfull = !isfull
        }
      }
      break
    case TouchType.MAP_TOOL_TAGGING:
      NavigationService.navigate('InputPage', {
        headerTitle: getLanguage(global.language).Map_Main_Menu.TOOLS_NAME,
        type: 'name',
        cb: async value => {
          if (value !== '') {
            let datasourceName = GLOBAL.currentLayer.datasourceAlias
            let datasetName = GLOBAL.currentLayer.datasetName
            await SMap.addTextRecordset(
              datasourceName,
              datasetName,
              value,
              event.screenPoint.x,
              event.screenPoint.y,
            )
            NavigationService.goBack()
            GLOBAL.TouchType = TouchType.NORMAL
          }
        },
        backcb: async () => {
          NavigationService.goBack()
        },
      })
      break
    case TouchType.SET_START_STATION:
      STransportationAnalyst.setStartPoint(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.START_STATION,
      )
      break
    case TouchType.MIDDLE_STATIONS:
      STransportationAnalyst.addNode(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.MIDDLE_STATION,
      )
      break
    case TouchType.SET_END_STATION:
      STransportationAnalyst.setEndPoint(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.END_STATION,
      )
      break
    case TouchType.SET_AS_START_STATION:
      STransportationAnalyst.setStartPoint(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.START_STATION,
      )
      // SFacilityAnalyst.setStartPoint(event.screenPoint)
      break
    case TouchType.SET_AS_END_STATION:
      STransportationAnalyst.setEndPoint(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.END_STATION,
      )
      // SFacilityAnalyst.setEndPoint(event.screenPoint)
      break
    case TouchType.ADD_STATIONS:
      STransportationAnalyst.addNode(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.NODE,
      )
      break
    case TouchType.ADD_BARRIER_NODES:
      STransportationAnalyst.addBarrierNode(
        event.screenPoint,
        getLanguage(global.language).Analyst_Labels.BARRIER_NODE,
      )
      break
    case TouchType.ANIMATION_WAY:
      SMap.addAnimationWayPoint(event.screenPoint, true)
      break
    case TouchType.ADD_NODES:
    case TouchType.NULL:
      break
  }
}

export { setGestureDetectorListener }
