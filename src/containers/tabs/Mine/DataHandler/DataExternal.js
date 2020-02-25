import { FileTools } from '../../../../native'
import { SMap, SScene } from 'imobile_for_reactnative'
import { Platform } from 'react-native'
import cheerio from 'react-native-cheerio'
import RNFS from 'react-native-fs'
import { Buffer } from 'buffer'
var iconv = require('iconv-lite')

/**
 * 判断所有文件类型，优先级：
 * 1.External/Plotting中的标绘模版
 * 2.2维工作空间 smwu和关联udb，还存在3维scene时不check
 * 3.3维工作空间 sxwu和关联文件夹，符号库
 * 4.其他udb，符号等
 */
async function getExternalData(path, uncheckedChildFileList = []) {
  let resultList = []
  try {
    let contentList = await _getDirectoryContentDeep(path)

    let PL = []
    let WS = []
    let WS3D = []
    let DS = []
    let TIF = []
    let SHP = []
    let MIF = []
    let KML = []
    let KMZ = []
    let DWG = []
    let DXF = []
    let GPX = []
    let IMG = []
    let COLOR = []
    let SYMBOL = []

    //过滤临时文件： ~[0]@xxxx
    _checkTempFile(contentList)

    PL = await getPLList(path, contentList)
    WS = await getWSList(path, contentList, uncheckedChildFileList)
    WS3D = await getWS3DList(path, contentList, uncheckedChildFileList)
    DS = getDSList(path, contentList, uncheckedChildFileList)
    TIF = getTIFList(path, contentList, uncheckedChildFileList)
    SHP = getSHPList(path, contentList, uncheckedChildFileList)
    MIF = getMIFList(path, contentList, uncheckedChildFileList)
    KML = getKMLList(path, contentList, uncheckedChildFileList)
    KMZ = getKMZList(path, contentList, uncheckedChildFileList)
    if (Platform.OS === 'ios') {
      DWG = getDWGList(path, contentList, uncheckedChildFileList)
      DXF = getDXFList(path, contentList, uncheckedChildFileList)
    }
    GPX = getGPXList(path, contentList, uncheckedChildFileList)
    IMG = getIMGList(path, contentList, uncheckedChildFileList)
    COLOR = getColorList(path, contentList)
    SYMBOL = getSymbolList(path, contentList)
    resultList = resultList
      .concat(PL)
      .concat(WS)
      .concat(WS3D)
      .concat(DS)
      .concat(TIF)
      .concat(SHP)
      .concat(MIF)
      .concat(KML)
      .concat(KMZ)
      .concat(DWG)
      .concat(DXF)
      .concat(GPX)
      .concat(IMG)
      .concat(COLOR)
      .concat(SYMBOL)
    return resultList
  } catch (e) {
    // console.log(e)
    return resultList
  }
}

/** 获取标绘模版 */
async function getPLList(path, contentList) {
  let PL = []
  try {
    for (let i = 0; i < contentList.length; i++) {
      if (contentList[i].name === 'Plotting') {
        contentList[i].check = true
        PL = await _getPlottingList(path + '/' + contentList[i].name)
      }
    }
    return PL
  } catch (error) {
    // console.log(error)
    return PL
  }
}

/** 获取二维工作空间 */
async function getWSList(path, contentList, uncheckedChildFileList) {
  let WS = []
  let relatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isWorkspace(contentList[i].name)) {
          //检查工作空间类型，3维工作空间跳出；同时存在3维scence时不check
          let wsInfo = await _getLocalWorkspaceInfo(
            path + '/' + contentList[i].name,
          )
          contentList[i].wsInfo = wsInfo
          if (wsInfo.maps.length === 0 && wsInfo.scenes.length === 0) {
            contentList[i].check = true
            continue
          } else if (wsInfo.maps.length === 0 && wsInfo.scenes.length !== 0) {
            continue
          } else if (wsInfo.scenes.length === 0) {
            contentList[i].check = true
          }
          let relatedDatasources = wsInfo.datasources
          _checkDatasources(
            relatedFiles,
            relatedDatasources,
            path,
            contentList,
            uncheckedChildFileList,
          )
          WS.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'workspace',
            relatedFiles: relatedFiles,
            wsInfo: contentList[i].wsInfo,
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        WS = WS.concat(
          await getWSList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return WS
  } catch (e) {
    // console.log(e)
    return WS
  }
}

/** 获取三维工作空间 */
async function getWS3DList(path, contentList, uncheckedChildFileList) {
  let WS3D = []
  let relatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isWorkspace(contentList[i].name)) {
          //过滤2维工作空间后，剩下的都是3维工作空间或包含3维的工作空间
          contentList[i].check = true
          //过滤udb
          let relatedDatasources = contentList[i].wsInfo.datasources
          _checkDatasources(
            relatedFiles,
            relatedDatasources,
            path,
            contentList,
            uncheckedChildFileList,
          )
          //获取3维缓存图层的信息
          let layerInfo = await _getLayerInfo3D(
            path + '/' + contentList[i].name,
            path,
          )
          _checkRelated3DLayer(
            relatedFiles,
            layerInfo,
            path,
            contentList,
            uncheckedChildFileList,
          )
          _checkRelated3DSymbols(
            relatedFiles,
            contentList[i].wsInfo.scenes,
            path,
            contentList,
          )
          _checkFlyingFiles(relatedFiles, path, contentList)
          if (layerInfo.length !== 0) {
            WS3D.push({
              directory: path,
              fileName: contentList[i].name,
              filePath: path + '/' + contentList[i].name,
              fileType: 'workspace3d',
              relatedFiles: relatedFiles,
              wsInfo: contentList[i].wsInfo,
            })
          }
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        WS3D = WS3D.concat(
          await getWS3DList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return WS3D
  } catch (error) {
    // console.log(error)
    return WS3D
  }
}

/** 获取数据源 */
function getDSList(path, contentList, uncheckedChildFileList) {
  let DS = []
  let relatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isDatasource2(contentList[i].name)) {
          contentList[i].check = true
          //获取同名udd等
          _checkRelatedDS(relatedFiles, contentList[i].name, path, contentList)
          DS.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'datasource',
            relatedFiles: relatedFiles,
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        DS = DS.concat(
          getDSList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return DS
  } catch (error) {
    // console.log(error)
    return DS
  }
}

function getTIFList(path, contentList, uncheckedChildFileList) {
  let TIF = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isTIF(contentList[i].name)) {
          contentList[i].check = true
          TIF.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'tif',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        TIF = TIF.concat(
          getTIFList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return TIF
  } catch (error) {
    return TIF
  }
}

function getSHPList(path, contentList, uncheckedChildFileList) {
  let SHP = []
  let relatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isSHP(contentList[i].name)) {
          contentList[i].check = true
          _checkRelatedSHP(relatedFiles, contentList[i].name, path, contentList)
          SHP.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'shp',
            relatedFiles: relatedFiles,
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        SHP = SHP.concat(
          getSHPList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return SHP
  } catch (error) {
    return SHP
  }
}

function getMIFList(path, contentList, uncheckedChildFileList) {
  let MIF = []
  let relatedFiles = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isMIF(contentList[i].name)) {
          contentList[i].check = true
          _checkRelatedMIF(relatedFiles, contentList[i].name, path, contentList)
          MIF.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'mif',
            relatedFiles: relatedFiles,
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        MIF = MIF.concat(
          getMIFList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return MIF
  } catch (error) {
    return MIF
  }
}

function getKMLList(path, contentList, uncheckedChildFileList) {
  let KML = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isKML(contentList[i].name)) {
          contentList[i].check = true
          KML.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'kml',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        KML = KML.concat(
          getKMLList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return KML
  } catch (error) {
    return KML
  }
}

function getKMZList(path, contentList, uncheckedChildFileList) {
  let KMZ = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isKMZ(contentList[i].name)) {
          contentList[i].check = true
          KMZ.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'kmz',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        KMZ = KMZ.concat(
          getKMZList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return KMZ
  } catch (error) {
    return KMZ
  }
}

function getDWGList(path, contentList, uncheckedChildFileList) {
  let DWG = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isDWG(contentList[i].name)) {
          contentList[i].check = true
          DWG.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'dwg',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        DWG = DWG.concat(
          getDWGList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return DWG
  } catch (error) {
    return DWG
  }
}

function getDXFList(path, contentList, uncheckedChildFileList) {
  let DXF = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isDXF(contentList[i].name)) {
          contentList[i].check = true
          DXF.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'dxf',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        DXF = DXF.concat(
          getDXFList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return DXF
  } catch (error) {
    return DXF
  }
}

function getGPXList(path, contentList, uncheckedChildFileList) {
  let GPX = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isGPX(contentList[i].name)) {
          contentList[i].check = true
          GPX.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'gpx',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        GPX = GPX.concat(
          getGPXList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return GPX
  } catch (error) {
    return GPX
  }
}

function getIMGList(path, contentList, uncheckedChildFileList) {
  let IMG = []
  try {
    _checkUncheckedFile(path, contentList, uncheckedChildFileList)
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isIMG(contentList[i].name)) {
          contentList[i].check = true
          IMG.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'img',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        IMG = IMG.concat(
          getIMGList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
            uncheckedChildFileList,
          ),
        )
      }
    }
    return IMG
  } catch (error) {
    return IMG
  }
}

function getColorList(path, contentList) {
  let COLOR = []
  try {
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isColor(contentList[i].name)) {
          contentList[i].check = true
          COLOR.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'color',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        COLOR = COLOR.concat(
          getColorList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
          ),
        )
      }
    }
    return COLOR
  } catch (error) {
    return COLOR
  }
}

function getSymbolList(path, contentList) {
  let SYMBOL = []
  try {
    for (let i = 0; i < contentList.length; i++) {
      if (!contentList[i].check && contentList[i].type === 'file') {
        if (_isSymbol(contentList[i].name)) {
          contentList[i].check = true
          SYMBOL.push({
            directory: path,
            fileName: contentList[i].name,
            filePath: path + '/' + contentList[i].name,
            fileType: 'symbol',
          })
        }
      } else if (!contentList[i].check && contentList[i].type === 'directory') {
        SYMBOL = SYMBOL.concat(
          getSymbolList(
            path + '/' + contentList[i].name,
            contentList[i].contentList,
          ),
        )
      }
    }
    return SYMBOL
  } catch (error) {
    return SYMBOL
  }
}

/** 标绘模版 */
async function _getPlottingList(path) {
  let arrFile = []
  let arrPlotDirContent = await FileTools.getDirectoryContent(path)
  for (let i = 0; i < arrPlotDirContent.length; i++) {
    let fileContent = arrPlotDirContent[i]
    let isFile = fileContent.type
    let fileName = fileContent.name
    let newPath = path + '/' + fileName
    if (isFile === 'directory') {
      arrFile.push({
        filePath: newPath,
        fileName: fileName,
        directory: newPath,
        fileType: 'plotting',
      })
    }
  }
  return arrFile
}

/**
 * 检查同级目录下的相关数据源(UDB)
 * 其他文件夹下的文件加入uncheckedChildFileList
 */
function _checkDatasources(
  relatedFiles,
  relatedDatasources,
  path,
  contentList,
  uncheckedChildFileList,
) {
  try {
    for (let n = 0; n < relatedDatasources.length; n++) {
      let ServerPathNoExt = relatedDatasources[n].server.substring(
        0,
        relatedDatasources[n].server.lastIndexOf('.'),
      )
      relatedFiles.push(ServerPathNoExt + '.udb')
      relatedFiles.push(ServerPathNoExt + '.udd')
      let datasourceChecked = false
      for (let i = 0; i < contentList.length; i++) {
        if (
          !contentList[i].check &&
          contentList[i].type === 'file' &&
          _isDatasource(contentList[i].name)
        ) {
          if (
            path + '/' + contentList[i].name === ServerPathNoExt + '.udb' ||
            path + '/' + contentList[i].name === ServerPathNoExt + '.udd'
          ) {
            contentList[i].check = true
            datasourceChecked = true
          }
        }
      }
      if (!datasourceChecked) {
        uncheckedChildFileList.push(relatedDatasources[n].server)
      }
    }
  } catch (error) {
    // console.log(error)
  }
}

function _checkRelated3DLayer(
  relatedFiles,
  layerInfo,
  path,
  contentList,
  uncheckedChildFileList,
) {
  try {
    for (let n = 0; n < layerInfo.length; n++) {
      relatedFiles.push(layerInfo[n].path)
      let layerChecked = false
      for (let i = 0; i < contentList.length; i++) {
        if (!contentList[i].check && contentList[i].type === 'directory') {
          if (path + '/' + contentList[i].name === layerInfo[n].path) {
            contentList[i].check = true
            layerChecked = true
            break
          }
        }
      }
      if (!layerChecked) {
        uncheckedChildFileList.push(layerInfo[n].path)
      }
    }
  } catch (error) {
    // console.log(error)
  }
}

//关联当前文件夹下所有和场景同名的符号
function _checkRelated3DSymbols(relatedFiles, scenes, path, contentList) {
  for (let n = 0; n < scenes.length; n++) {
    for (let i = 0; i < contentList.length; i++) {
      if (
        !contentList[i].check &&
        contentList[i].type === 'file' &&
        _isSymbol(contentList[i].name)
      ) {
        let symName = contentList[i].name.substring(
          0,
          contentList[i].name.lastIndexOf('.'),
        )
        if (symName === scenes[n]) {
          contentList[i].check = true
          relatedFiles.push(path + '/' + contentList[i].name)
        }
      }
    }
  }
}

function _checkFlyingFiles(relatedFiles, path, contentList) {
  for (let i = 0; i < contentList.length; i++) {
    if (
      !contentList[i].check &&
      contentList[i].type === 'file' &&
      _isFlyingFile(contentList[i].name)
    ) {
      contentList[i].check = true
      relatedFiles.push(path + '/' + contentList[i].name)
    }
  }
}

function _checkRelatedDS(relatedFiles, name, path, contentList) {
  for (let i = 0; i < contentList.length; i++) {
    if (
      !contentList[i].check &&
      contentList[i].type === 'file' &&
      _isRelatedDS(name, contentList[i].name)
    ) {
      contentList[i].check = true
      relatedFiles.push(path + '/' + contentList[i].name)
    }
  }
}

//关联同名的其他shp文件
function _checkRelatedSHP(relatedFiles, name, path, contentList) {
  for (let i = 0; i < contentList.length; i++) {
    if (
      !contentList[i].check &&
      contentList[i].type === 'file' &&
      _isRelatedSHP(name, contentList[i].name)
    ) {
      contentList[i].check = true
      relatedFiles.push(path + '/' + contentList[i].name)
    }
  }
}

function _checkRelatedMIF(relatedFiles, name, path, contentList) {
  for (let i = 0; i < contentList.length; i++) {
    if (
      !contentList[i].check &&
      contentList[i].type === 'file' &&
      _isRelatedMIF(name, contentList[i].name)
    ) {
      contentList[i].check = true
      relatedFiles.push(path + '/' + contentList[i].name)
    }
  }
}

function _isType(name, types = []) {
  name = name.toLowerCase()
  let index = name.lastIndexOf('.')
  let ext
  if (index < 1) {
    return false
  } else {
    ext = name.substr(index + 1)
    let result = false
    for (let i = 0; i < types.length; i++) {
      if (ext === types[i]) {
        result = true
        break
      }
    }
    return result
  }
}

function _isWorkspace(name) {
  return _isType(name, ['smwu', 'sxwu', 'sxw', 'smw'])
}

/**
 * 所有datasource
 * @param {*} name
 */
function _isDatasource(name) {
  return _isType(name, ['udb', 'udd'])
}

/**
 * 不含同名的udd等的datasource
 * @param {*} name
 */
function _isDatasource2(name) {
  return _isType(name, ['udb'])
}

function _isSubDS(name) {
  return _isType(name, ['udd'])
}

function _isRelatedDS(name, checkName) {
  if (_isSubDS(checkName)) {
    name = name.substring(0, name.lastIndexOf('.'))
    checkName = checkName.substring(0, checkName.lastIndexOf('.'))
    return name === checkName
  } else {
    return false
  }
}

function _isTIF(name) {
  return _isType(name, ['tif'])
}

function _isSHP(name) {
  return _isType(name, ['shp'])
}

function _isSubSHP(name) {
  return _isType(name, ['dbf', 'prj', 'shx'])
}

function _isRelatedSHP(name, checkName) {
  if (_isSubSHP(checkName)) {
    name = name.substring(0, name.lastIndexOf('.'))
    checkName = checkName.substring(0, checkName.lastIndexOf('.'))
    return name === checkName
  } else {
    return false
  }
}

function _isMIF(name) {
  return _isType(name, ['mif'])
}

function _isSubMIF(name) {
  return _isType(name, ['mid'])
}

function _isRelatedMIF(name, checkName) {
  if (_isSubMIF(checkName)) {
    name = name.substring(0, name.lastIndexOf('.'))
    checkName = checkName.substring(0, checkName.lastIndexOf('.'))
    return name === checkName
  } else {
    return false
  }
}

function _isKML(name) {
  return _isType(name, ['kml'])
}

function _isKMZ(name) {
  return _isType(name, ['kmz'])
}

function _isDWG(name) {
  return _isType(name, ['dwg'])
}

function _isDXF(name) {
  return _isType(name, ['dxf'])
}

function _isGPX(name) {
  return _isType(name, ['gpx'])
}

function _isIMG(name) {
  return _isType(name, ['img'])
}

function _isSymbol(name) {
  return _isType(name, ['sym', 'lsl', 'bru'])
}

function _isColor(name) {
  return _isType(name, ['scs'])
}

function _isFlyingFile(name) {
  return _isType(name, ['fpf'])
}

async function _getLocalWorkspaceInfo(serverPath) {
  return await SMap.getLocalWorkspaceInfo(serverPath)
}

async function _getLayerInfo3D(serverUrl, currentPath) {
  let layers = []
  try {
    if (Platform.OS === 'android') {
      let scenes = await SScene.getSceneXMLfromWorkspace(serverUrl)
      for (let i = 0; i < scenes.length; i++) {
        let xml = scenes[i].xml
        let $ = cheerio.load(xml)
        let nodes = $('sml\\:DataSourceAlias')
        for (let n = 0; n < nodes.length; n++) {
          let rpath = nodes[n].children[0].nodeValue
          //处理反斜线
          rpath = rpath.replace(/\\/g, '/')
          //目前只获取工作空间同级的图层文件夹
          if (rpath.indexOf('./') === 0) {
            let pathArr = rpath.split('/')
            let path = pathArr[1]
            layers.push({
              name: scenes[i].name,
              path: currentPath + '/' + path,
            })
          }
        }
      }
    } else {
      let wsType = serverUrl
        .substr(serverUrl.lastIndexOf('.') + 1)
        .toLowerCase()
      //ios目前直接从工作空间文件读取
      if (wsType === 'sxwu') {
        let workspaceStr = await RNFS.readFile(serverUrl, 'base64')
        let rawStr = Buffer.from(workspaceStr, 'base64')
        workspaceStr = iconv.decode(rawStr, 'gb2312')

        let $ = cheerio.load(workspaceStr)
        let nodes = $('sml\\:DataSourceAlias')
        for (let n = 0; n < nodes.length; n++) {
          let rpath = nodes[n].children[0].nodeValue
          //处理反斜线
          rpath = rpath.replace(/\\/g, '/')
          //目前只获取工作空间同级的图层文件夹
          if (rpath.indexOf('./') === 0) {
            let pathArr = rpath.split('/')
            let path = pathArr[1]
            layers.push({
              name: path,
              path: currentPath + '/' + path,
            })
          }
        }
      }
    }
    return layers
  } catch (error) {
    // console.log(error)
    return layers
  }
}

function _checkUncheckedFile(path, contentList, uncheckedChildFileList) {
  for (let i = uncheckedChildFileList.length - 1; i >= 0; i--) {
    for (let n = 0; n < contentList.length; n++) {
      if (path + '/' + contentList[n].name === uncheckedChildFileList[i]) {
        contentList[n].check = true
        uncheckedChildFileList.splice(i, 1)
      }
    }
  }
}

function _checkTempFile(contentList) {
  for (let i = 0; i < contentList.length; i++) {
    if (contentList[i].name.indexOf('~[') === 0) {
      contentList[i].check = true
    } else if (
      contentList[i].name.indexOf('~[') !== 0 &&
      contentList[i].type === 'directory'
    ) {
      _checkTempFile(contentList[i].contentList)
    }
  }
}

/** 递归获取所有文件 */
async function _getDirectoryContentDeep(path) {
  let contentList = []
  try {
    contentList = await FileTools.getDirectoryContent(path)
    for (let i = 0; i < contentList.length; i++) {
      if (contentList[i].type === 'directory') {
        contentList[i].contentList = await _getDirectoryContentDeep(
          path + '/' + contentList[i].name,
        )
      }
    }
    return contentList
  } catch (error) {
    // console.log(e)
    return contentList
  }
}

export default {
  getExternalData,
}
