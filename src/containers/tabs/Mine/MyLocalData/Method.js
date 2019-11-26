import { NetInfo } from 'react-native'
import { ConstPath, UserType } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import { getLanguage } from '../../../../language/index'
import { downloadFile } from 'react-native-fs'
import {
  SOnlineService,
  SMap,
  SScene,
  SIPortalService,
} from 'imobile_for_reactnative'
import DataHandler from '../DataHandler'
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
        if (fileName === 'Plotting') {
          await _getPlotingLibDataList(newPath, arrFilterFile)
        } else await _setFilterDatas(newPath, fileType, arrFilterFile)
      }
    }
  } catch (e) {
    // Toast.show('没有数据')
  }
  return arrFilterFile
}

/**获取标绘库数据列表 */
async function _getPlotingLibDataList(fileDir, arrFile) {
  let arrPlotDirContent = await FileTools.getDirectoryContent(fileDir)
  for (let i = 0; i < arrPlotDirContent.length; i++) {
    let fileContent = arrPlotDirContent[i]
    let isFile = fileContent.type
    let fileName = fileContent.name
    let newPath = fileDir + '/' + fileName
    if (isFile === 'directory') {
      arrFile.push({
        filePath: newPath,
        fileName: fileName,
        directory: newPath,
        fileType: 'plotting',
      })
    }
  }
}

/** 构造样例数据数据*/
async function _constructCacheSectionData(language) {
  let homePath = await _getHomePath()
  let path = homePath + ConstPath.CachePath2
  let newData = []
  newData = await DataHandler.getExternalData(path)
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
  newData = await DataHandler.getExternalData(path)
  return newData
}

async function _getHomePath() {
  return await FileTools.appendingHomeDirectory()
}
async function getOnlineData(
  currentUser,
  currentPage,
  pageSize,
  cb = () => {},
) {
  let newData = []
  try {
    let strDataList
    if (UserType.isOnlineUser(currentUser)) {
      strDataList = await SOnlineService.getDataList(currentPage, pageSize)
    } else if (UserType.isIPortalUser(currentUser)) {
      strDataList = await SIPortalService.getMyDatas(currentPage, pageSize)
    }
    let objDataList = JSON.parse(strDataList)
    if (objDataList.content) {
      //过滤friendlist
      for (let i = objDataList.content.length - 1; i > -1; i--) {
        if (objDataList.content[i].fileName.indexOf('friend.list') != -1) {
          objDataList.content.splice(i, 1)
          objDataList.total -= 1
        } else if (objDataList.content[i].type === 'UDB') {
          objDataList.content.splice(i, 1)
          objDataList.total -= 1
        }
      }
    }
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
  currentUser,
  cookie,
  updateDownList,
  importWorkspace,
  importSceneWorkspace,
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
        currentUser.userName +
        '/' +
        ConstPath.RelativePath.ExternalData +
        itemInfo.fileName
      let filePath = await FileTools.appendingHomeDirectory(path + '.zip')
      let toPath = await FileTools.appendingHomeDirectory(path)
      // await SOnlineService.downloadFileWithDataId(filePath, this.itemInfo.id+"")
      let dataUrl = `https://www.supermapol.com/web/datas/${
        itemInfo.id
      }/download`
      if (UserType.isIPortalUser(currentUser)) {
        let url = currentUser.serverUrl
        if (url.indexOf('http') !== 0) {
          url = 'http://' + currentUser.serverUrl
        }
        dataUrl = `${url}/datas/${itemInfo.id}/download`
      }
      let headers = {}
      if (cookie) {
        headers = {
          Cookie: cookie,
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
                let filePath = newData[i].filePath
                let is3D = await SScene.is3DWorkspace({ server: filePath })
                if (is3D === true) {
                  let result = await importSceneWorkspace({
                    server: filePath,
                  })

                  if (result === true) {
                    Toast.show(
                      getLanguage(global.language).Prompt.IMPORTED_SUCCESS,
                    )
                  } else {
                    Toast.show(
                      getLanguage(global.language).Prompt.FAILED_TO_IMPORT,
                    )
                  }
                  result = await importWorkspace({ path: filePath })
                  // if (result.msg !== undefined) {
                  //   Toast.show(
                  //     getLanguage(global.language).Prompt.FAILED_TO_IMPORT,
                  //   )
                  // } else {
                  //   Toast.show(
                  //     getLanguage(global.language).Prompt.IMPORTED_SUCCESS,
                  //   )
                  // }
                } else {
                  let result = await importWorkspace({ path: filePath })
                  if (result.msg !== undefined) {
                    Toast.show(
                      getLanguage(global.language).Prompt.FAILED_TO_IMPORT,
                    )
                  } else {
                    Toast.show(
                      getLanguage(global.language).Prompt.IMPORTED_SUCCESS,
                    )
                  }
                }
              } else if (newData[i].fileType === 'datasource') {
                await SMap.importDatasourceFile(newData[i].filePath).then(
                  result => {
                    result.length > 0
                      ? Toast.show(
                        getLanguage(global.language).Prompt.IMPORTED_SUCCESS,
                      ) //'数据导入成功')
                      : Toast.show(
                        getLanguage(global.language).Prompt.FAILED_TO_IMPORT,
                      ) //'数据导入失败')
                  },
                  () => {
                    Toast.show(
                      getLanguage(global.language).Prompt.FAILED_TO_IMPORT,
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
  _constructCacheSectionData,
  _constructUserSectionData,
  _getHomePath,
  getOnlineData,
  downFileAction,
}
