import { NativeModules } from 'react-native'
const FileTools = NativeModules.FileTools

function zipFile(archivePath, targetPath) {
  if (!archivePath || !targetPath) return
  return FileTools.zipFile(archivePath, targetPath)
}

function zipFiles(archivePaths = [], targetPath) {
  if (archivePaths.length <= 0 || !targetPath) return
  return FileTools.zipFiles(archivePaths, targetPath)
}

function unZipFile(archivePath, targetPath) {
  if (!archivePath || !targetPath) return
  return FileTools.unZipFile(archivePath, targetPath)
}

function deleteFile(path) {
  if (!path) return
  return FileTools.deleteFile(path)
}

function copyFile(fromPath, toPath, override = false) {
  if (!fromPath || !toPath) return
  return FileTools.copyFile(fromPath, toPath, override)
}

function initUserDefaultData(userName = '') {
  return FileTools.initUserDefaultData(userName)
}

export default {
  zipFile,
  zipFiles,
  unZipFile,
  deleteFile,
  copyFile,
  initUserDefaultData,
}
