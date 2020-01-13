import {
  NativeModules,
  DeviceEventEmitter,
  NativeEventEmitter,
  Platform,
} from 'react-native'
const FileTools = NativeModules.FileTools
const nativeEvt = new NativeEventEmitter(FileTools)
const MESSAGE_IMPORTEXTERNALDATA =
  'com.supermap.RN.Mapcontrol.message_importexternaldata'
const MESSAGE_SHARERESULT = 'com.supermap.RN.Mapcontrol.message_shareresult'
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
 * 获取content url的绝对路径
 * @param {*} contentUrl
 */
async function getContentAbsolutePathAndroid(contentUrl) {
  if (Platform.OS === 'android') {
    return await FileTools.getContentAbsolutePath(contentUrl)
  }
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
async function getPathListByFilter(path, filter = {}) {
  return await FileTools.getPathListByFilter(path, filter)
}

/**
 * 遍历指定目录下指定类型文件
 * @param path  文件目录
 * @param extensions  类型  字符串形式，多个类型逗号隔开 如 "xml,shp"
 * @returns Array   返回值格式 [{name:'xxx',path:'xxx'}]
 */
async function getPathListByFilterDeep(path, extensions) {
  return await FileTools.getPathListByFilterDeep(path, extensions)
}
/**
 * 获取指定路径下可用地图名
 * @param path
 * @param name
 * @returns {Promise}
 */
async function getAvailableMapName(path, name) {
  let maps = await FileTools.getPathListByFilter(path, {
    name,
    extension: 'xml',
    type: 'file',
  })
  let exist = true
  let _name = name

  function checkName(__name) {
    let _exist = false
    let newName = __name
    for (let i = 0; i < maps.length; i++) {
      let mapName = maps[i].name
      if (mapName.indexOf('.') > 0) {
        mapName = mapName.substring(0, mapName.indexOf('.'))
      }
      if (mapName === newName) {
        _exist = true
        newName = __name + '_' + (i + 1)
        break
      }
    }
    return {
      name: newName,
      exist: _exist,
    }
  }

  if (maps.length > 0) {
    while (exist) {
      let result = checkName(_name)
      exist = result.exist
      _name = result.name
    }
  }

  return _name
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

function EnvironmentIsValid() {
  return FileTools.EnvironmentIsValid()
}

function addImportExternalData(handlers) {
  if (Platform.OS === 'ios' && handlers) {
    if (typeof handlers.callback === 'function') {
      nativeEvt.addListener(MESSAGE_IMPORTEXTERNALDATA, function(e) {
        handlers.callback(e)
      })
    }
  } else if (Platform.OS === 'android' && handlers) {
    if (typeof handlers.callback === 'function') {
      DeviceEventEmitter.addListener(MESSAGE_IMPORTEXTERNALDATA, function(e) {
        handlers.callback(e)
      })
    }
  }
}

function getShareResult(handlers) {
  if (Platform.OS === 'ios' && handlers) {
    if (typeof handlers.callback === 'function') {
      nativeEvt.addListener(MESSAGE_SHARERESULT, function(e) {
        handlers.callback(e)
      })
    }
  } else if (Platform.OS === 'android' && handlers) {
    if (typeof handlers.callback === 'function') {
      DeviceEventEmitter.addListener(MESSAGE_SHARERESULT, function(e) {
        handlers.callback(e)
      })
    }
  }
}

function getImportState() {
  return FileTools.getImportState()
}

/**
 * 深度遍历fileDir目录下的fileType数据,并添加到arrFilterFile中
 * fileDir 文件目录
 * fileType 文件类型 {smwu:'smwu',sxwu:'sxwu',sxw:'sxw',smw:'smw',udb:'udb'}
 * arrFilterFile 添加到arrFilterFile数组中保存
 * */
async function getFilterFiles(
  fileDir: string,
  fileType: Object,
  arrFilterFile: Array,
) {
  if (arrFilterFile === undefined) {
    arrFilterFile = []
  }
  try {
    if (typeof fileDir !== 'string') {
      return []
    }
    if (fileType === undefined) {
      fileType = {
        smwu: 'smwu',
        sxwu: 'sxwu',
        sxw: 'sxw',
        smw: 'smw',
      }
    }
    let isRecordFile = false
    let arrDirContent = await getDirectoryContent(fileDir)
    for (let i = 0; i < arrDirContent.length; i++) {
      let fileContent = arrDirContent[i]
      let isFile = fileContent.type
      let fileName = fileContent.name
      let newPath = fileDir + '/' + fileName
      if (isFile === 'file' && !isRecordFile) {
        if (
          (fileType.smwu && fileName.indexOf(fileType.smwu) !== -1) ||
          (fileType.sxwu && fileName.indexOf(fileType.sxwu) !== -1) ||
          (fileType.sxw && fileName.indexOf(fileType.sxw) !== -1) ||
          (fileType.smw && fileName.indexOf(fileType.smw) !== -1) ||
          (fileType.udb && fileName.indexOf(fileType.udb) !== -1)
        ) {
          if (
            !(
              fileName.indexOf('~[') !== -1 &&
              fileName.indexOf(']') !== -1 &&
              fileName.indexOf('@') !== -1
            )
          ) {
            fileName = fileName.substring(0, fileName.length - 5)
            arrFilterFile.push({
              filePath: newPath,
              fileName: fileName,
              directory: fileDir,
            })
            isRecordFile = true
          }
        }
      } else if (isFile === 'directory') {
        await getFilterFiles(newPath, fileType, arrFilterFile)
      }
    }
  } catch (e) {
    // Toast.show('没有数据')
  }
  return arrFilterFile
}

/**
 * 获取指定路径下的地图（xml），含是否是模版地图
 * @param path
 * @param filter
 * @returns {Promise.<*>}
 */
async function getMaps(path = '', filter = {}) {
  try {
    if (!path) return []
    return await FileTools.getMaps(path, filter)
  } catch (e) {
    return e
  }
}

/**
 * 获取指定路径下的工作空间
 * @param path
 * @param filter
 * @returns {Promise.<*>}
 */
async function getNavigationWorkspace(path = '', filter = {}) {
  try {
    if (!path) return []
    return await FileTools.getNavigationWorkspace(path, filter)
  } catch (e) {
    return e
  }
}

/**
 * 获取指定路径下的网络模型
 * @param path
 * @returns {Promise.<*>}
 */
async function getNetModel(path = '') {
  try {
    if (!path) return []
    return await FileTools.getNetModel(path)
  } catch (e) {
    return e
  }
}

/**
 * 获取指定路径下的室内数据源
 * @param path
 * @param filter
 * @returns {Promise.<*>}
 */
async function getIndoorData(path = '', filter = {}) {
  try {
    if (!path) return []
    return await FileTools.getIndoorData(path, filter)
  } catch (e) {
    return e
  }
}

/**
 * 返回视频缩略图
 * @param path
 * @returns {Promise.<*>}
 */
async function getThumbnail(path = '') {
  try {
    if (!path) return ''
    return await FileTools.getThumbnail(path)
  } catch (e) {
    return e
  }
}

export default {
  getHomeDirectory,
  appendingHomeDirectory,
  getDirectoryContent,
  getContentAbsolutePathAndroid,
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
  getFilterFiles,
  getMaps,
  getNavigationWorkspace,
  getNetModel,
  getIndoorData,
  getAvailableMapName,
  EnvironmentIsValid,
  addImportExternalData,
  getShareResult,
  getImportState,
  getThumbnail,
  getPathListByFilterDeep,
}
