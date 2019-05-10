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
  let _setting = state
  if (payload) {
    _setting = fromJS(payload)
    let setting = state.toJS()
    for (let key of setting.keys) {
      if (!payload[key]) {
        _setting = state
      }
    }
  }
  return _setting
}

export default {
  checkModel,
}
