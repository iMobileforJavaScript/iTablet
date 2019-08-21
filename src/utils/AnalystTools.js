import {
  STransportationAnalyst,
  // SFacilityAnalyst,
} from 'imobile_for_reactnative'
import { Analyst_Types } from '../containers/analystView/AnalystType'
import { getLanguage } from '../language'

async function analyst(type) {
  let result
  switch (type) {
    case Analyst_Types.OPTIMAL_PATH:
      result = STransportationAnalyst.findPath({
        weightName: 'length',
      })
      break
    case Analyst_Types.CONNECTIVITY_ANALYSIS:
      result = STransportationAnalyst.findPath({
        weightName: 'length',
      })
      // result = await SFacilityAnalyst.findPathFromNodes()
      break
    case Analyst_Types.FIND_TSP_PATH:
      result = STransportationAnalyst.findTSPPath({
        weightName: 'length',
      })
      break
  }
  return result
}

async function clear(type) {
  let result
  switch (type) {
    case Analyst_Types.OPTIMAL_PATH:
      result = await STransportationAnalyst.clear()
      break
    case Analyst_Types.CONNECTIVITY_ANALYSIS:
      result = await STransportationAnalyst.clear()
      // result = await SFacilityAnalyst.clear()
      break
    case Analyst_Types.FIND_TSP_PATH:
      result = await STransportationAnalyst.clear()
      break
  }
  return result
}

function showMsg(type, isSuccess, language = 'CN') {
  let msg = ''
  switch (type) {
    case Analyst_Types.OPTIMAL_PATH:
      msg =
        !isSuccess &&
        getLanguage(language).Analyst_Prompt.NOT_FIND_SUITABLE_PATH
      break
    case Analyst_Types.CONNECTIVITY_ANALYSIS:
      msg = isSuccess
        ? getLanguage(language).Analyst_Prompt.TWO_NODES_ARE_CONNECTED
        : getLanguage(language).Analyst_Prompt.TWO_NODES_ARE_NOT_CONNECTED
      break
    case Analyst_Types.FIND_TSP_PATH:
      msg =
        !isSuccess &&
        getLanguage(language).Analyst_Prompt.NOT_FIND_SUITABLE_PATH
      break
    case -1:
    default:
      msg = getLanguage(language).Analyst_Prompt.ANALYZING_FAILED
  }
  // msg &&
  //   Toast.show(msg, {
  //     duration: Toast.DURATION.TOAST_LONG,
  //   })
  msg &&
    GLOBAL.bubblePane &&
    GLOBAL.bubblePane.addBubble(
      {
        title: msg,
        type: isSuccess ? 'success' : 'error',
      },
      // !isSuccess && {
      //   top: 60,
      // },
    )
}

export default {
  analyst,
  clear,
  showMsg,
}
