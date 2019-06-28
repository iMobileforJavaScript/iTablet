import { STransportationAnalyst } from 'imobile_for_reactnative'
import { Analyst_Types } from '../containers/analystView/AnalystType'

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

export default {
  analyst,
  clear,
}
