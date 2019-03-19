import { NativeModules } from 'react-native'
const NativeMethod = NativeModules.NativeMethod

function getTemplates(userName = '', module = '') {
  return NativeMethod.getTemplates(userName, module)
}

export default {
  getTemplates,
}
