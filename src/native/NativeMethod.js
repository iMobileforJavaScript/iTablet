import { NativeModules } from 'react-native'
const NativeMethod = NativeModules.NativeMethod

function getTemplates(userName = '') {
  return NativeMethod.getTemplates(userName)
}

export default {
  getTemplates,
}
