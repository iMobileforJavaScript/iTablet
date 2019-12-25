import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { getLanguage } from '../../../../language/index'

class MyTemplate extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.template
    this.state = {
      ...this.state,
      shareToLocal: true,
      shareToOnline: true,
      shareToIPortal: true,
      showSectionHeader: true,
    }
  }

  getData = async () => {
    let plotData = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'TEMPLAE_PLOTTING',
    )
    let collectingData = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'TEMPLAE_COLLECTING',
    )
    let sectionData = []
    sectionData.push({
      title: getLanguage(global.language).Profile.PLOTTING_TEMPLATE,
      data: plotData || [],
      isShowItem: true,
    })
    sectionData.push({
      title: getLanguage(global.language).Profile.COLLECTION_TEMPLATE,
      data: collectingData || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    let filePath
    if (
      this.itemInfo.section.title ===
      getLanguage(global.language).Profile.COLLECTION_TEMPLATE
    ) {
      filePath = this.itemInfo.item.path.substring(
        0,
        this.itemInfo.item.path.lastIndexOf('/'),
      )
    } else if (
      this.itemInfo.section.title ===
      getLanguage(global.language).Profile.PLOTTING_TEMPLATE
    ) {
      filePath = this.itemInfo.item.path
    }
    let result = await FileTools.deleteFile(filePath)
    return result
  }

  exportData = async (name, exportToTemp = true) => {
    let homePath = await FileTools.appendingHomeDirectory()
    let fromPath
    if (
      this.itemInfo.section.title ===
      getLanguage(global.language).Profile.COLLECTION_TEMPLATE
    ) {
      fromPath = this.itemInfo.item.path.substring(
        0,
        this.itemInfo.item.path.lastIndexOf('/'),
      )
    } else if (
      this.itemInfo.section.title ===
      getLanguage(global.language).Profile.PLOTTING_TEMPLATE
    ) {
      fromPath = this.itemInfo.item.path
    }

    let toPath
    if (exportToTemp) {
      let tempPath = homePath + this.getRelativeTempPath()
      let availableName = await this._getAvailableFileName(
        tempPath,
        'MyExport',
        'zip',
      )
      toPath = tempPath + availableName
      this.exportPath = toPath
    } else {
      let exportPath = homePath + this.getRelativeExportPath()
      let availableName = await this._getAvailableFileName(
        exportPath,
        name,
        'zip',
      )
      toPath = exportPath + availableName
      this.exportPath = this.getRelativeExportPath() + availableName
    }
    let result = await FileTools.zipFile(fromPath, toPath)
    return result
  }
}

export default MyTemplate
