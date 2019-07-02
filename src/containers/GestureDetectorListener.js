import {
  SMap,
  STransportationAnalyst,
  // SFacilityAnalyst,
} from 'imobile_for_reactnative'
import NavigationService from './NavigationService'
import { getLanguage } from '../language'
import { TouchType } from '../constants'

let _params = {}

function setGestureDetectorListener(params) {
  (async function() {
    await SMap.setGestureDetector({
      singleTapHandler: touchCallback,
    })
  }.bind(this)())
  _params = params
}

async function touchCallback(event) {
  switch (GLOBAL.TouchType) {
    case TouchType.NORMAL:
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
        cb: async value => {
          if (value !== '') {
            await SMap.addTextRecordset(
              GLOBAL.TaggingDatasetName,
              value,
              _params.user.currentUser.userName,
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
      STransportationAnalyst.setStartPoint(event.screenPoint)
      break
    case TouchType.MIDDLE_STATIONS:
      STransportationAnalyst.addNode(event.screenPoint)
      break
    case TouchType.SET_END_STATION:
      STransportationAnalyst.setEndPoint(event.screenPoint)
      break
    case TouchType.SET_AS_START_STATION:
      STransportationAnalyst.setStartPoint(event.screenPoint)
      // SFacilityAnalyst.setStartPoint(event.screenPoint)
      break
    case TouchType.SET_AS_END_STATION:
      STransportationAnalyst.setEndPoint(event.screenPoint)
      // SFacilityAnalyst.setEndPoint(event.screenPoint)
      break
    case TouchType.ADD_STATIONS:
      STransportationAnalyst.addNode(event.screenPoint)
      break
    case TouchType.ADD_BARRIER_NODES:
      STransportationAnalyst.addBarrierNode(event.screenPoint)
      break
    case TouchType.ADD_NODES:
    case TouchType.NULL:
      break
  }
}

export { setGestureDetectorListener }
