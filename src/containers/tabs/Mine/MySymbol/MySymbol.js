import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'

class MySymbol extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.symbol
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
      'SYMBOL',
    )

    let sectionData = []
    sectionData.push({
      title: 'SYMBOL',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    if (!this.itemInfo) return false
    let symbolPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )

    let result = await FileTools.deleteFile(symbolPath)

    return result
  }

  exportData = async (name, exportToTemp = true) => {
    let homePath = await FileTools.appendingHomeDirectory()
    let targetPath

    let fileName = this.itemInfo.item.name
    let type =
      fileName.lastIndexOf('.') > 0
        ? fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase()
        : ''
    if (exportToTemp) {
      let tempPath = homePath + this.getRelativeTempPath()
      let availableName
      if (this.shareType === 'online' || this.shareType === 'iportal') {
        availableName = await this._getAvailableFileName(tempPath, name, type)
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

    let symbolPath = homePath + this.itemInfo.item.path
    let result
    if (this.shareType === 'online' || this.shareType === 'iportal') {
      result = await FileTools.copyFile(symbolPath, targetPath, true)
    } else {
      let archivePaths = []
      archivePaths = [symbolPath]
      result = await FileTools.zipFiles(archivePaths, targetPath)
    }
    return result
  }
}

export default MySymbol
