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
    if (exportToTemp) {
      targetPath = homePath + this.getRelativeTempFilePath()
    } else {
      let exportPath = homePath + this.getRelativeExportPath()
      let availableName = await this._getAvailableFileName(
        exportPath,
        name,
        'zip',
      )
      targetPath = exportPath + availableName
    }
    let archivePaths = []

    let symbolPath = homePath + this.itemInfo.item.path
    archivePaths = [symbolPath]

    let result = await FileTools.zipFiles(archivePaths, targetPath)
    return result
  }
}

export default MySymbol
