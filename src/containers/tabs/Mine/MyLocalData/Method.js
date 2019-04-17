import { NetInfo } from 'react-native'
//eslint-disable-next-line
import { ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import { getLanguage } from '../../../../language/index'
import { downloadFile } from 'react-native-fs'
import { SOnlineService, SMap } from 'imobile_for_reactnative'
// import console = require('console');
async function _setFilterDatas(fullFileDir, fileType, arrFilterFile) {
  try {
    let isRecordFile = false
    let udb = null
    let isWorkspace = false
    let arrDirContent = await FileTools.getDirectoryContent(fullFileDir)
    for (let i = 0; i < arrDirContent.length; i++) {
      let fileContent = arrDirContent[i]
      let isFile = fileContent.type
      let fileName = fileContent.name
      let newPath = fullFileDir + '/' + fileName

      if (isFile === 'file' && !isRecordFile) {
        // (fileType.udb && fileName.indexOf(fileType.udb) !== -1)
        if (
          (fileType.smwu && fileName.indexOf(fileType.smwu) !== -1) ||
          (fileType.sxwu && fileName.indexOf(fileType.sxwu) !== -1) ||
          (fileType.sxw && fileName.indexOf(fileType.sxw) !== -1) ||
          (fileType.smw && fileName.indexOf(fileType.smw) !== -1)
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
              directory: fullFileDir,
            })
            isRecordFile = true
            isWorkspace = true
          }
        } else if (fileType.udb && fileName.indexOf(fileType.udb) !== -1) {
          fileName = fileName.substring(0, fileName.length - 4)
          udb = {
            filePath: newPath,
            fileName: fileName,
            directory: fullFileDir,
          }
        }
        if (i === arrDirContent.length - 1) {
          if (!isWorkspace) {
            udb !== null && arrFilterFile.push(udb)
          }
        }
      } else if (isFile === 'directory') {
        await _setFilterDatas(newPath, fileType, arrFilterFile)
      }
    }
  } catch (e) {
    // Toast.show('没有数据')
  }
  return arrFilterFile
}

/** 构造游客以及当前用户数据*/
async function _constructAllUserSectionData() {
  let homePath = await _getHomePath()
  let path = homePath + ConstPath.UserPath2
  let newData = []
  await _setFilterDatas(path, { smwu: 'smwu', sxwu: 'sxwu' }, newData, false)
  return newData
}
/** 构造样例数据数据*/
async function _constructCacheSectionData(language) {
  let homePath = await _getHomePath()
  let path = homePath + ConstPath.CachePath2
  let newData = []
  await _setFilterDatas(path, { smwu: 'smwu', sxwu: 'sxwu' }, newData, false)
  //'样例数据'
  let titleWorkspace = getLanguage(language).Profile.SAMPLEDATA
  let sectionData
  if (newData.length === 0) {
    sectionData = []
  } else {
    sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
  }
  return sectionData
}

/** 构造当前用户数据*/
async function _constructUserSectionData(userName) {
  let homePath = await _getHomePath()
  let path =
    homePath +
    ConstPath.UserPath +
    userName +
    '/' +
    ConstPath.RelativeFilePath.ExternalData
  let newData = []
  await _setFilterDatas(path, { smwu: 'smwu', sxwu: 'sxwu' }, newData, false)
  return newData
}
/** 构造游客数据*/
async function _constructCustomerSectionData() {
  let homePath = await _getHomePath()
  let path =
    homePath + ConstPath.CustomerPath + ConstPath.RelativeFilePath.ExternalData
  let newData = []
  await _setFilterDatas(path, { smwu: 'smwu', sxwu: 'sxwu' }, newData, false)
  return newData
}

async function _constructTecentOfQQ() {
  let homePath = await _getHomePath()
  let path = homePath + '/Tencent/QQfile_recv'
  let newData = []
  await _setFilterDatas(path, { smwu: 'smwu', sxwu: 'sxwu' }, newData, false)
  return newData
}

async function _constructTecentOfweixin() {
  let homePath = await _getHomePath()
  let path = homePath + '/Tencent/MicroMsg/Download'
  let newData = []
  await _setFilterDatas(path, { smwu: 'smwu', sxwu: 'sxwu' }, newData, false)
  return newData
}

async function _getHomePath() {
  return await FileTools.appendingHomeDirectory()
}
async function getOnlineData(currentPage, pageSize, cb = () => {}) {
  let newData = []
  try {
    let strDataList = await SOnlineService.getDataList(currentPage, pageSize)
    let objDataList = JSON.parse(strDataList)
    if (objDataList.content && objDataList.content.length > 0) {
      cb && cb(objDataList.total)
      let arrDataContent = objDataList.content
      let contentLength = arrDataContent.length
      for (let i = 0; i < contentLength; i++) {
        let objContent = arrDataContent[i]
        objContent.fileName = objContent.fileName.substring(
          0,
          objContent.fileName.length - 4,
        )
        objContent.id = objContent.id + ''
        newData.push(objContent)
      }
    }
  } catch (e) {
    let result = await NetInfo.getConnectionInfo()
    if (result.type === 'unknown' || result.type === 'none') {
      Toast.show('网络错误')
    } else {
      // Toast.show('登录失效，请重新登录')
    }
  }
  return newData
}

async function downFileAction(
  down,
  itemInfo,
  userName,
  cookie,
  updateDownList,
  importWorkspace,
) {
  try {
    if (down[0].id && itemInfo.id === down[0].id && down[0].progress > 0) {
      Toast.show('文件正在导入，请稍后')
      return
    } else {
      if (itemInfo.id) {
        let path =
          ConstPath.UserPath +
          userName +
          '/' +
          ConstPath.RelativePath.ExternalData +
          itemInfo.fileName
        let filePath = await FileTools.appendingHomeDirectory(path + '.zip')
        let toPath = await FileTools.appendingHomeDirectory(path)
        // await SOnlineService.downloadFileWithDataId(filePath, this.itemInfo.id+"")
        let dataUrl = `https://www.supermapol.com/web/datas/${
          itemInfo.id
        }/download`
        let downloadOptions = {
          fromUrl: dataUrl,
          toFile: filePath,
          background: true,
          headers: {
            Cookie: 'JSESSIONID=' + cookie,
            'Cache-Control': 'no-cache',
          },
          progressDivider: 2,
          begin: () => {
            Toast.show('开始导入')
          },
          progress: res => {
            let value = ~~res.progress.toFixed(0)
            updateDownList({
              id: itemInfo.id,
              progress: value,
              downed: false,
            })
          },
        }
        let result = downloadFile(downloadOptions)
        result.promise.then(
          async result => {
            // console.warn(result)
            let unzipRes = await FileTools.unZipFile(filePath, toPath)
            debugger
            if (unzipRes === false) {
              await FileTools.deleteFile(filePath)
              Toast.show('网络数据已损坏，无法正常使用')
            } else {
              await FileTools.deleteFile(filePath)
              setFilterDatas(
                toPath,
                {
                  smwu: 'smwu',
                  sxwu: 'sxwu',
                  udb: 'udb',
                },
                importWorkspace,
              )
              updateDownList({
                id: itemInfo.id,
                progress: 0,
                downed: true,
              })
            }
            // if (result.statusCode) {
            //   //下载成功后解压导入
            //   if (result.statusCode >= 200 && result.statusCode < 300) 
            //   {
            //     Toast.show('文件导入中')
            //     debugger
            //     let result = await FileTools.unZipFile(filePath, toPath)
            //     debugger
            //     if (result) {
            //       await FileTools.deleteFile(filePath)
            //       setFilterDatas(
            //         toPath,
            //         {
            //           smwu: 'smwu',
            //           sxwu: 'sxwu',
            //           udb: 'udb',
            //         },
            //         importWorkspace,
            //       )
            //       updateDownList({
            //         id: itemInfo.id,
            //         progress: 0,
            //         downed: true,
            //       })
            //     }
            //   } else {
            //     Toast.show('请求异常，导入失败')
            //   }
            // }
          },
          //eslint-disable-next-line
          e => {
            Toast.show('请求异常，导入失败')
          },
        )
      }
    }
  } catch (error) {
    Toast.show('导入失败')
  }
}

async function setFilterDatas(
  fullFileDir,
  fileType,
  importWorkspace = () => {},
) {
  try {
    let isRecordFile = false
    let arrDirContent = await FileTools.getDirectoryContent(fullFileDir)
    for (let i = 0; i < arrDirContent.length; i++) {
      let fileContent = arrDirContent[i]
      let isFile = fileContent.type
      let fileName = fileContent.name
      let newPath = fullFileDir + '/' + fileName
      if (isFile === 'file' && !isRecordFile) {
        // (fileType.udb && fileName.indexOf(fileType.udb) !== -1)
        if (
          (fileType.smwu && fileName.indexOf(fileType.smwu) !== -1) ||
          (fileType.sxwu && fileName.indexOf(fileType.sxwu) !== -1) ||
          (fileType.sxw && fileName.indexOf(fileType.sxw) !== -1) ||
          (fileType.smw && fileName.indexOf(fileType.smw) !== -1)
        ) {
          if (
            !(
              fileName.indexOf('~[') !== -1 &&
              fileName.indexOf(']') !== -1 &&
              fileName.indexOf('@') !== -1
            )
          ) {
            importWorkspace &&
              (await importWorkspace({ path: newPath }).then(result => {
                result.mapsInfo.length > 0
                  ? Toast.show('数据导入成功')
                  : Toast.show('数据导入失败')
              }))
            isRecordFile = true
            break
          }
        } else if (fileType.udb && fileName.indexOf(fileType.udb) !== -1) {
          await SMap.importDatasourceFile(newPath).then(
            result => {
              result.length > 0
                ? Toast.show('数据导入成功')
                : Toast.show('数据导入失败')
            },
            () => {
              Toast.show('数据导入失败')
            },
          )
          break
        }
      } else if (isFile === 'directory') {
        await setFilterDatas(newPath, fileType,importWorkspace)
      }
    }
  } catch (e) {
    Toast.show('数据导入失败')
  }
}

export {
  _setFilterDatas,
  _constructAllUserSectionData,
  _constructCacheSectionData,
  _constructUserSectionData,
  _constructCustomerSectionData,
  _constructTecentOfQQ,
  _constructTecentOfweixin,
  _getHomePath,
  getOnlineData,
  downFileAction,
}
