import {
  SMap,
  STransportationAnalyst,
  // SFacilityAnalyst,
} from 'imobile_for_reactnative'
import NavigationService from './NavigationService'
import { getLanguage } from '../language'
import { TouchType } from '../constants'
//eslint-disable-next-line
let _params = {}

function setGestureDetectorListener(params) {
  (async function() {
    await SMap.setGestureDetector({
      singleTapHandler: touchCallback,
      longPressHandler: longtouchCallback,
    })
  }.bind(this)())
  _params = params
}

async function longtouchCallback(event) {
  switch (GLOBAL.TouchType) {
    case TouchType.NORMAL:
      break
    case TouchType.NAVIGATION_TOUCH_BEGIN:
      (async function() {
        GLOBAL.STARTX = event.mapPoint.x
        GLOBAL.STARTY = event.mapPoint.y
        let result = await SMap.isIndoorPoint(
          event.mapPoint.x,
          event.mapPoint.y,
        )
        await SMap.getStartPoint(
          event.mapPoint.x,
          event.mapPoint.y,
          result.isindoor,
        )
        if (result.isindoor) {
          GLOBAL.INDOORSTART = true
        } else {
          GLOBAL.INDOORSTART = false
        }
      }.bind(this)())
      break
    case TouchType.NAVIGATION_TOUCH_END:
      (async function() {
        GLOBAL.ENDX = event.mapPoint.x
        GLOBAL.ENDY = event.mapPoint.y
        let endresult = await SMap.isIndoorPoint(
          event.mapPoint.x,
          event.mapPoint.y,
        )
        await SMap.getEndPoint(
          event.mapPoint.x,
          event.mapPoint.y,
          endresult.isindoor,
        )
        if (endresult.isindoor) {
          GLOBAL.INDOOREND = true
        } else {
          GLOBAL.INDOOREND = false
        }
      }.bind(this)())
      break
  }
}

async function touchCallback(event) {
  switch (GLOBAL.TouchType) {
    case TouchType.NORMAL:
      if (
        GLOBAL.PoiInfoContainer &&
        GLOBAL.PoiInfoContainer.state.resultList.length > 0 &&
        !GLOBAL.PoiInfoContainer.state.showMore
      ) {
        GLOBAL.PoiInfoContainer.hidden()
      }
      // if (isfull) {
      //   GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
      // } else {
      //   GLOBAL.toolBox && GLOBAL.toolBox.existFullMap()
      // }
      // isfull = !isfull
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
