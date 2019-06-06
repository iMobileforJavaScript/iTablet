import { SMap } from 'imobile_for_reactnative'
import NavigationService from './NavigationService'
import { getLanguage } from '../language/index'
import { ConstToolType } from '../constants'

let _params = {}
let isfull = true

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
    case ConstToolType.NORMAL:
      if (isfull) {
        GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
        GLOBAL.scaleView && GLOBAL.scaleView.showFullMap()
      } else {
        GLOBAL.toolBox && GLOBAL.toolBox.existFullMap()
        GLOBAL.scaleView && GLOBAL.scaleView.exitFullMap()
      }
      isfull = !isfull
      break
    case ConstToolType.MAP_TOOL_TAGGING:
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
          GLOBAL.TouchType = ConstToolType.NORMAL
        },
        backcb: async () => {
          NavigationService.goBack()
        },
      })
      break
    case ConstToolType.NULL:
      break
  }
}

export { setGestureDetectorListener }
