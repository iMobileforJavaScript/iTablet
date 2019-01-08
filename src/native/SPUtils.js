import { NativeModules } from 'react-native'
const SPUtils = NativeModules.SPUtils

function createFile(fileName) {
  return SPUtils.createFile(fileName)
}

function putInt(fileName, key, value) {
  return SPUtils.putInt(fileName, key, value)
}

function putBoolean(fileName, key, value) {
  return SPUtils.putBoolean(fileName, key, value)
}

function putString(fileName, key, value) {
  return SPUtils.putString(fileName, key, value)
}

function getInt(fileName, key, defValue) {
  return SPUtils.getInt(fileName, key, defValue)
}

function getBoolean(fileName, key, defValue) {
  return SPUtils.getBoolean(fileName, key, defValue)
}

function getString(fileName, key, defValue) {
  return SPUtils.getString(fileName, key, defValue)
}

export default {
  createFile,
  putInt,
  putBoolean,
  putString,
  getInt,
  getBoolean,
  getString,
}
