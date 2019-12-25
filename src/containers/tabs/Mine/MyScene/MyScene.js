import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'

class MyScene extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.scene
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
      'SCENE',
    )

    let sectionData = []
    sectionData.push({
      title: 'SCENE',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    if (!this.itemInfo) return false
    let scenePath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    let pxpPath = scenePath + '.pxp'

    let result = await FileTools.deleteFile(scenePath)
    result = result && (await FileTools.deleteFile(pxpPath))

    return result
  }

  exportData = async (name, exportToTemp = true) => {
    let homePath = await FileTools.appendingHomeDirectory()
    let targetPath
    if (exportToTemp) {
      let tempPath = homePath + this.getRelativeTempPath()
      let availableName = await this._getAvailableFileName(
        tempPath,
        'MyExport',
        'zip',
      )
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
    let archivePaths = []

    let scenePath = homePath + this.itemInfo.item.path
    let pxpPath = scenePath + '.pxp'
    archivePaths = [scenePath, pxpPath]

    let result = await FileTools.zipFiles(archivePaths, targetPath)
    return result
  }
}

export default MyScene
