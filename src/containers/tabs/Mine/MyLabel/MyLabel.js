import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { ConstPath } from '../../../../constants'
import { SMap } from 'imobile_for_reactnative'

class MyLabel extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.mark
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
      'LABEL',
    )

    let sectionData = []
    sectionData.push({
      title: 'LABEL',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    let homePath = await FileTools.appendingHomeDirectory()
    let userPath =
      homePath + ConstPath.UserPath + this.props.user.currentUser.userName + '/'
    let datasourcePath =
      userPath +
      ConstPath.RelativePath.Datasource +
      'Label_' +
      this.props.user.currentUser.userName +
      '#.udb'
    return await SMap.removeDatasetByName(
      datasourcePath,
      this.itemInfo.item.name,
    )
  }

  exportData = async (name, exportToTemp = true) => {
    let homePath = await FileTools.appendingHomeDirectory()
    let userPath =
      homePath + ConstPath.UserPath + this.props.user.currentUser.userName + '/'
    let datasourcePath =
      userPath +
      ConstPath.RelativePath.Datasource +
      'Label_' +
      this.props.user.currentUser.userName +
      '#.udb'

    let todatasourcePath =
      userPath + ConstPath.RelativePath.Temp + name + '/' + name + '.udb'

    let archivePath, targetPath
    archivePath = userPath + ConstPath.RelativePath.Temp + name
    if (await FileTools.fileIsExist(archivePath)) {
      FileTools.deleteFile(archivePath)
    }

    let result = await DataHandler.creatLabelDatasource(
      this.props.user.currentUser,
      todatasourcePath,
    )
    if (result) {
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

      let uploadList
      if (this.state.batchMode) {
        uploadList = this._getSelectedNames(this._getSelectedList())
      } else {
        uploadList = [this.itemInfo.item.name]
      }

      await SMap.copyDataset(datasourcePath, todatasourcePath, uploadList)
      result = await FileTools.zipFile(archivePath, targetPath)
      FileTools.deleteFile(archivePath)
    }
    return result
  }

  _getSelectedNames = itemList => {
    let list = []
    for (let i = 0; i < itemList.length; i++) {
      list.push(itemList[i].item.name)
    }
    return list
  }
}

export default MyLabel
