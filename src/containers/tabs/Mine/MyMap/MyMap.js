import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { ConstPath } from '../../../../constants'

class MyMap extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.map
    this.state = {
      ...this.state,
      shareToLocal: true,
      shareToOnline: true,
      shareToIPortal: true,
      shareToWechat: true,
      shareToFriend: true,
    }
  }

  getData = async () => {
    let data = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'MAP',
    )

    let sectionData = []
    sectionData.push({
      title: 'MAP',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    if (!this.itemInfo) return false
    let mapPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    let mapExpPath = mapPath.substring(0, mapPath.lastIndexOf('.')) + '.exp'

    let result = await FileTools.deleteFile(mapPath)
    result = result && (await FileTools.deleteFile(mapExpPath))

    let dataPath = this.itemInfo.item.path.split('Data')
    let animationPath = await FileTools.appendingHomeDirectory(
      dataPath[0] +
        'Data/Animation/' +
        this.itemInfo.item.name.substring(
          0,
          this.itemInfo.item.name.lastIndexOf('.'),
        ),
    )
    let path = animationPath
    result && (await FileTools.deleteFile(path))

    return result
  }

  exportData = async (name, exportToTemp = true) => {
    let mapName = name
    let homePath = await FileTools.appendingHomeDirectory()
    let path =
      homePath +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.ExternalData +
      ConstPath.RelativeFilePath.ExportData +
      mapName +
      '/' +
      mapName +
      '.smwu'
    let zipPath
    if (exportToTemp) {
      let tempPath = homePath + this.getRelativeTempPath()
      let availableName = await this._getAvailableFileName(
        tempPath,
        'MyExport',
        'zip',
      )
      zipPath = tempPath + availableName
      this.exportPath = zipPath
    } else {
      let exportPath = homePath + this.getRelativeExportPath()
      let availableName = await this._getAvailableFileName(
        exportPath,
        name,
        'zip',
      )
      zipPath = exportPath + availableName
      this.exportPath = this.getRelativeExportPath() + availableName
    }

    let exportResult = false
    await this.props.exportWorkspace(
      { maps: [mapName], outPath: path, isOpenMap: true, zipPath },
      result => {
        exportResult = result
      },
    )
    return exportResult
  }
}

export default MyMap
