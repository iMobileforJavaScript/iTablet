import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'

class MyColor extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.color
    this.state = {
      ...this.state,
      shareToLocal: true,
      shareToOnline: true,
      shareToIPortal: true,
    }
  }

  getData = async () => {
    let data = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'COLOR',
    )

    let sectionData = []
    sectionData.push({
      title: 'COLOR',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    if (!this.itemInfo) return false
    let filePath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )

    let result = await FileTools.deleteFile(filePath)

    return result
  }

  exportData = async (name, exportToTemp = true) => {
    let homePath = await FileTools.appendingHomeDirectory()
    let targetPath
    if (exportToTemp) {
      let tempPath = homePath + this.getRelativeTempPath()
      let availableName
      if (this.shareType === 'online' || this.shareType === 'iportal') {
        availableName = await this._getAvailableFileName(tempPath, name, 'scs')
      } else {
        availableName = await this._getAvailableFileName(
          tempPath,
          'MyExport',
          'zip',
        )
      }
      targetPath = tempPath + availableName
      this.exportPath = targetPath
    } else {
      let exportPath = homePath + this.getRelativeExportPath()
      let availableName = await this._getAvailableFileName(
        exportPath,
        name,
        'zip',
      )
      targetPath = exportPath + availableName
      this.exportPath = this.getRelativeExportPath() + availableName
    }

    let filePath = homePath + this.itemInfo.item.path
    let result
    if (this.shareType === 'online' || this.shareType === 'iportal') {
      result = await FileTools.copyFile(filePath, targetPath, true)
    } else {
      let archivePaths = []
      archivePaths = [filePath]
      result = await FileTools.zipFiles(archivePaths, targetPath)
    }
    return result
  }
}

export default MyColor
