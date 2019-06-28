import { STransportationAnalyst } from 'imobile_for_reactnative'
import { Analyst_Types } from '../containers/analystView/AnalystType'
import { getLanguage } from '../language'
import { Toast } from '../utils'

async function analyst(type) {
  let result
  switch (type) {
    case Analyst_Types.OPTIMAL_PATH:
      result = await STransportationAnalyst.findPath()
      break
    case Analyst_Types.CONNECTIVITY_ANALYSIS:
      result = await STransportationAnalyst.findPath()
      break
    case Analyst_Types.FIND_TSP_PATH:
      result = await STransportationAnalyst.findTSPPath()
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
  }
  msg && Toast.show(msg)
}

export default {
  analyst,
  clear,
  showMsg,
}
