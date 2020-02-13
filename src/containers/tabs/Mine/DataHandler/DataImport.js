import { FileTools } from '../../../../native'
import { ConstPath } from '../../../../constants'
import { SMap, EngineType } from 'imobile_for_reactnative'

async function importWorkspace(item) {
  let filePath = item.filePath
  let index = filePath.lastIndexOf('/')
  let path = filePath.substring(0, index)
  let snmFiles = await FileTools.getPathListByFilterDeep(path, 'snm')
  await SMap.copyNaviSnmFile(snmFiles)
  let type = _getWorkspaceType(filePath)
  let data = {
    server: filePath,
    type,
  }
  await SMap.importWorkspaceInfo(data)
}

/**
 * 1.遍历scenes，获取可用的文件夹名
 * 2.生成对应的pxp
 * 3.复制工作空间和相关文件
 */
async function importWorkspace3D(user, item) {
  let userPath = await FileTools.appendingHomeDirectory(
    ConstPath.UserPath + user.userName + '/Data/Scene',
  )

  let contentList = await FileTools.getDirectoryContent(userPath)

  let workspaceName = item.fileName.substring(0, item.fileName.lastIndexOf('.'))
  let workspaceFolder = _getAvailableName(
    workspaceName,
    contentList,
    'directory',
  )
  let workspaceInfo = {
    type: _getWorkspaceType(item.fileName) + '',
    server: workspaceFolder + '/' + item.fileName,
  }

  for (let i = 0; i < item.wsInfo.scenes.length; i++) {
    let scene = item.wsInfo.scenes[i]
    let pxp = _getAvailableName(scene, contentList, 'file', 'pxp')
    let pxpInfo = {
      Name: scene,
      Workspace: workspaceInfo,
    }
    await FileTools.writeFile(userPath + '/' + pxp, JSON.stringify(pxpInfo))

    let absoluteWorkspacePath = userPath + '/' + workspaceFolder
    await FileTools.createDirectory(absoluteWorkspacePath)
    await FileTools.copyFile(
      item.filePath,
      absoluteWorkspacePath + '/' + item.fileName,
    )

    for (let i = 0; i < item.relatedFiles.length; i++) {
      let filePath = item.relatedFiles[i]
      let fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
      await FileTools.copyFile(filePath, absoluteWorkspacePath + '/' + fileName)
    }
  }
}

async function importDatasource(user, item) {
  let userPath = await FileTools.appendingHomeDirectory(
    ConstPath.UserPath + user.userName + '/Data/Datasource',
  )

  let contentList = await FileTools.getDirectoryContent(userPath)

  let sourceUdb = item.filePath
  let sourceUdd =
    item.filePath.substring(0, item.filePath.lastIndexOf('.')) + '.udd'

  let datasourceName = item.fileName.substring(
    0,
    item.fileName.lastIndexOf('.'),
  )
  let udbName = _getAvailableName(datasourceName, contentList, 'file', 'udb')
  let uddName = _getAvailableName(datasourceName, contentList, 'file', 'udd')

  await FileTools.copyFile(sourceUdb, userPath + '/' + udbName)
  await FileTools.copyFile(sourceUdd, userPath + '/' + uddName)
}

async function importColor(user, item) {
  let userPath = await FileTools.appendingHomeDirectory(
    ConstPath.UserPath + user.userName + '/Data/Color',
  )

  return await _copyFile(item, userPath)
}

async function importSymbol(user, item) {
  let userPath = await FileTools.appendingHomeDirectory(
    ConstPath.UserPath + user.userName + '/Data/Symbol',
  )

  return await _copyFile(item, userPath)
}

async function importTIF(filePath, datasourceItem) {
  return await _importDataset('tif', filePath, datasourceItem)
}

async function importSHP(filePath, datasourceItem) {
  return await _importDataset('shp', filePath, datasourceItem)
}

async function importMIF(filePath, datasourceItem) {
  return await _importDataset('mif', filePath, datasourceItem)
}

async function importKML(filePath, datasourceItem) {
  let name = filePath.substr(filePath.lastIndexOf('/') + 1)
  name = name.split('.')[0]
  return await _importDataset('kml', filePath, datasourceItem, {
    datasetName: name,
    importAsCAD: true,
  })
}

async function importKMZ(filePath, datasourceItem) {
  let name = filePath.substr(filePath.lastIndexOf('/') + 1)
  name = name.split('.')[0]
  return await _importDataset('kmz', filePath, datasourceItem, {
    datasetName: name,
    importAsCAD: true,
  })
}

async function importDWG(filePath, datasourceItem) {
  return await _importDataset('dwg', filePath, datasourceItem, {
    inverseBlackWhite: false,
    importAsCAD: true,
  })
}

async function importDXF(filePath, datasourceItem) {
  return await _importDataset('dxf', filePath, datasourceItem, {
    inverseBlackWhite: false,
    importAsCAD: true,
  })
}

async function importGPX(filePath, datasourceItem) {
  let name = filePath.substr(filePath.lastIndexOf('/') + 1)
  name = name.split('.')[0]
  return await _importDataset('gpx', filePath, datasourceItem, {
    datasetName: name,
  })
}

async function importIMG(filePath, datasourceItem) {
  return await _importDataset('img', filePath, datasourceItem)
}

async function _importDataset(
  type,
  filePath,
  datasourceItem,
  importParams = {},
) {
  try {
    let homePath = await FileTools.appendingHomeDirectory()
    let alias = datasourceItem.name
    let index = alias.lastIndexOf('.')
    if (index > 0) {
      alias = alias.substring(0, index)
    }
    let result = await SMap.importDataset(
      type,
      filePath,
      {
        server: homePath + datasourceItem.path,
        alias: alias,
        engineType: EngineType.UDB,
      },
      importParams,
    )
    SMap.closeDatasource(alias)
    return result
  } catch (error) {
    return false
  }
}

async function _copyFile(item, desDir) {
  let fileName = item.fileName.substring(0, item.fileName.lastIndexOf('.'))
  let fileType = item.fileName.substring(item.fileName.lastIndexOf('.') + 1)
  let contentList = await FileTools.getDirectoryContent(desDir)
  let name = _getAvailableName(fileName, contentList, 'file', fileType)
  return await FileTools.copyFile(item.filePath, desDir + '/' + name)
}

function _getAvailableName(name, fileList, type, ext = '') {
  let AvailabeName = name
  if (type === 'file' && ext !== '') {
    AvailabeName = name + '.' + ext
  }
  if (_isInlList(AvailabeName, fileList, type)) {
    for (let i = 1; ; i++) {
      AvailabeName = name + '_' + i
      if (type === 'file' && ext !== '') {
        AvailabeName = name + '_' + i + '.' + ext
      }
      if (!_isInlList(AvailabeName, fileList, type)) {
        return AvailabeName
      }
    }
  } else {
    return AvailabeName
  }
}

function _isInlList(name, fileList, type) {
  for (let i = 0; i < fileList.length; i++) {
    if (name === fileList[i].name && type === fileList[i].type) {
      return true
    }
  }
  return false
}

function _getWorkspaceType(path) {
  let index = path.lastIndexOf('.')
  let type
  if (index < 1) {
    return 1
  } else {
    type = path.substr(index + 1)
  }
  type = type.toUpperCase()
  var value
  switch (type) {
    case 'SMWU':
      value = 9
      break
    case 'SXWU':
      value = 8
      break
    case 'SMW':
      value = 5
      break
    case 'SXW':
      value = 4
      break
    case 'UDB':
      value = 219
      break
    default:
      value = 1
      break
  }
  return value
}

export default {
  importWorkspace,
  importWorkspace3D,
  importDatasource,
  importColor,
  importSymbol,
  importTIF,
  importSHP,
  importMIF,
  importKML,
  importKMZ,
  importDWG,
  importDXF,
  importGPX,
  importIMG,
}
