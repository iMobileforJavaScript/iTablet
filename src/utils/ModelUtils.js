/**
 * redux models 公共方法
 */
import { fromJS } from 'immutable'

/**
 * 检查model数据是否完整
 * @param state
 * @param payload
 * @returns {*}
 */
function checkModel(state, payload) {
  let _data = state
  if (payload) {
    _data = fromJS(payload)
    let setting = state.toJS()
    for (let key of Object.keys(setting)) {
      if (
        payload[key] === undefined ||
        typeof payload[key] !== typeof setting[key]
      ) {
        _data = state
      }
    }
  }
  return _data
}

export default {
  checkModel,
}
