import { NativeModules } from 'react-native'
const FileTools = NativeModules.FileTools

/**
 * 获取沙盒路径
 * @returns {Promise.<string>}
 */
async function getHomeDirectory() {
  return await FileTools.getHomeDirectory()
}

async function appendingHomeDirectory(path = '') {
  let homeDirectory = await FileTools.getHomeDirectory()
  return homeDirectory + path
}

/**
 * 获取文件夹中的目录内容
 * @param path
 * @returns {Promise}
 */
async function getDirectoryContent(path) {
  return await FileTools.getDirectoryContent(path)
}

/**
 * 判断文件是否存在
 * @param path
 * @returns {Promise}
 */
async function fileIsExist(path) {
  return await FileTools.fileIsExist(path)
}

/**
 * 判断文件是否存在在Home Directory中
 * @param path
 * @returns {Promise}
 */
async function fileIsExistInHomeDirectory(path) {
  return await FileTools.fileIsExistInHomeDirectory(path)
}

/**
 * 创建文件目录
 * @param path - 绝对路径
 * @returns {Promise}
 */
async function createDirectory(path) {
  return await FileTools.createDirectory(path)
}

/**
 * 获取文件夹内容
 * @param path
 * @returns {Promise}
 */
async function getPathList(path) {
  return await FileTools.getPathList(path)
}

/**
 * 根据过滤条件获取文件夹内容
 * @param path
 * @param filter  {name: 文件名, extension: 后缀， type: 文件类型(file | Directory)}
 * @returns {Promise}
 */
async function getPathListByFilter(
  path,
  { name = '', extension = '', type = 'Directory' },
) {
  return await FileTools.getPathListByFilter(path, { name, extension, type })
}

/**
 * 判断是否是文件夹
 * @param path
 * @returns {Promise.<Promise|*>}
 */
async function isDirectory(path) {
  return await FileTools.isDirectory(path)
}

async function readFile(filePath) {
  return await FileTools.readFile(filePath)
}

async function writeFile(filePath, strJson) {
  return await FileTools.writeToFile(filePath, strJson)
}

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
  getHomeDirectory,
  appendingHomeDirectory,
  getDirectoryContent,
  fileIsExist,
  fileIsExistInHomeDirectory,
  createDirectory,
  getPathList,
  isDirectory,
  getPathListByFilter,
  readFile,
  writeFile,
  zipFile,
  zipFiles,
  unZipFile,
  deleteFile,
  copyFile,
  initUserDefaultData,
}
