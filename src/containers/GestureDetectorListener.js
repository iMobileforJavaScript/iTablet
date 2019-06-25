import { SMap } from 'imobile_for_reactnative'
import NavigationService from './NavigationService'
import { getLanguage } from '../language'
import { TouchType } from '../constants'
import { Toast } from '../utils'

let _params = {}
// let isfull = true

function setGestureDetectorListener(params) {
  (async function() {
    await SMap.setGestureDetector({
      singleTapHandler: touchCallback,
    })
  }.bind(this)())
  _params = params
}

function touchCallback(event) {
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
              event.x,
              event.y,
            )
          }
          NavigationService.goBack()
          GLOBAL.TouchType = TouchType.NORMAL
        },
        backcb: async () => {
          NavigationService.goBack()
        },
      })
      break
    case TouchType.SET_START_STATION:
      Toast.show(TouchType.SET_START_STATION + '\n' + JSON.stringify(event))
      break
    case TouchType.MIDDLE_STATIONS:
      Toast.show(TouchType.MIDDLE_STATIONS + '\n' + JSON.stringify(event))
      break
    case TouchType.SET_END_STATION:
      Toast.show(TouchType.SET_END_STATION + '\n' + JSON.stringify(event))
      break
    case TouchType.SET_AS_START_STATION:
      Toast.show(TouchType.SET_AS_START_STATION + '\n' + JSON.stringify(event))
      break
    case TouchType.SET_AS_END_STATION:
      Toast.show(TouchType.SET_AS_END_STATION) + '\n' + JSON.stringify(event)
      break
    case TouchType.ADD_STATIONS:
      Toast.show(TouchType.ADD_STATIONS + '\n' + JSON.stringify(event))
      break
    case TouchType.ADD_BARRIER_NODES:
      Toast.show(TouchType.ADD_BARRIER_NODES + '\n' + JSON.stringify(event))
      break
    case TouchType.ADD_NODES:
    case TouchType.NULL:
      break
  }
}

export { setGestureDetectorListener }
