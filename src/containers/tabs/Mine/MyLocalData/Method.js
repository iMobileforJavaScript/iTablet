import { NetInfo } from 'react-native'
import { ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import { getLanguage } from '../../../../language/index'
import { downloadFile } from 'react-native-fs'
import { SOnlineService, SMap } from 'imobile_for_reactnative'
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
              fileType: 'workspace',
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
            fileType: 'datasource',
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
  await _setFilterDatas(
    path,
    {
      smwu: 'smwu',
      sxwu: 'sxwu',
    },
    newData,
    false,
  )
  return newData
}
/** 构造样例数据数据*/
async function _constructCacheSectionData(language) {
  let homePath = await _getHomePath()
  let path = homePath + ConstPath.CachePath2
  let newData = []
  await _setFilterDatas(
    path,
    {
      smwu: 'smwu',
      sxwu: 'sxwu',
    },
    newData,
    false,
  )
  //'样例数据'
  let titleWorkspace = getLanguage(language).Profile.SAMPLEDATA
  let sectionData
  if (newData.length === 0) {
    sectionData = []
  } else {
    sectionData = [
      {
        title: titleWorkspace,
        data: newData,
        isShowItem: true,
      },
    ]
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
  await _setFilterDatas(
    path,
    {
      smwu: 'smwu',
      sxwu: 'sxwu',
    },
    newData,
    false,
  )
  return newData
}
/** 构造游客数据*/
async function _constructCustomerSectionData() {
  let homePath = await _getHomePath()
  let path =
    homePath + ConstPath.CustomerPath + ConstPath.RelativeFilePath.ExternalData
  let newData = []
  await _setFilterDatas(
    path,
    {
      smwu: 'smwu',
      sxwu: 'sxwu',
    },
    newData,
    false,
  )
  return newData
}

async function _constructTecentOfQQ() {
  let homePath = await _getHomePath()
  let path = homePath + '/Tencent/QQfile_recv'
  let newData = []
  await _setFilterDatas(
    path,
    {
      smwu: 'smwu',
      sxwu: 'sxwu',
    },
    newData,
    false,
  )
  return newData
}

async function _constructTecentOfweixin() {
  let homePath = await _getHomePath()
  let path = homePath + '/Tencent/MicroMsg/Download'
  let newData = []
  await _setFilterDatas(
    path,
    {
      smwu: 'smwu',
      sxwu: 'sxwu',
    },
    newData,
    false,
  )
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
    if (down.length > 0) {
      for (let index = 0; index < down.length; index++) {
        const element = down[index]
        if (element.id && itemInfo.id === element.id && element.progress > 0) {
          Toast.show('文件正在导入，请稍后')
          return
        }
      }
    }
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
      let headers = {}
      if (cookie) {
        headers = {
          Cookie: 'JSESSIONID=' + cookie,
          'Cache-Control': 'no-cache',
        }
      }
      let downloadOptions = {
        fromUrl: dataUrl,
        toFile: filePath,
        background: true,
        headers: headers,
        progressDivider: 2,
        begin: () => {
          Toast.show(getLanguage(global.language).Prompt.IMPORTING_DATA)
          //'开始导入')
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
        async () => {
          let unzipRes = await FileTools.unZipFile(filePath, toPath)
          if (unzipRes === false) {
            await FileTools.deleteFile(filePath)
            Toast.show('网络数据已损坏，无法正常使用')
          } else {
            updateDownList({
              id: itemInfo.id,
              progress: 0,
              downed: true,
            })
            await FileTools.deleteFile(filePath)
            let newData = []
            await _setFilterDatas(
              toPath,
              {
                smwu: 'smwu',
                sxwu: 'sxwu',
                udb: 'udb',
              },
              newData,
            )
            for (let i in newData) {
              if (newData[i].fileType === 'workspace') {
                importWorkspace &&
                  (await importWorkspace({
                    path: newData[i].filePath,
                  }).then(result => {
                    result.mapsInfo.length > 0
                      ? Toast.show(
                        getLanguage(global.language).Prompt.IMPORTED_SUCCESS
                      ) //'数据导入成功')
                      : Toast.show(
                        getLanguage(global.language).Prompt.FAILED_TO_IMPORT
                      ) //'数据导入失败')
                  }))
              } else if (newData[i].fileType === 'datasource') {
                await SMap.importDatasourceFile(newData[i].filePath).then(
                  result => {
                    result.length > 0
                      ? Toast.show(
                        getLanguage(global.language).Prompt.IMPORTED_SUCCESS,
                      ) //'数据导入成功')
                      : Toast.show(getLanguage(global.language).Prompt.FAILED_TO_IMPORT
                      ) //'数据导入失败')
                  },
                  () => {
                    Toast.show(getLanguage(global.language).Prompt.FAILED_TO_IMPORT
                    ) //'数据导入失败')
                  },
                )
              }
            }
          }
        },
        () => {
          updateDownList({
            id: itemInfo.id,
            progress: 0,
            downed: false,
          })
          Toast.show(getLanguage(global.language).Prompt.FAILED_TO_IMPORT)
          //'请求异常，导入失败')
        },
      )
    }
  } catch (error) {
    Toast.show(getLanguage(global.language).Prompt.FAILED_TO_IMPORT)
    //'导入失败')
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
