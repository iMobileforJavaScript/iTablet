import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { getLanguage } from '../../../../language/index'
import { ConstPath } from '../../../../constants'
import NavigationService from '../../../NavigationService'
import { SMap, EngineType } from 'imobile_for_reactnative'

class MyDatasource extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.data
    this.state = {
      ...this.state,
      shareToLocal: true,
      shareToOnline: true,
      shareToIPortal: true,
      shareToWechat: true,
    }
  }

  getData = async () => {
    let data = await DataHandler.getLocalData(
      this.props.user.currentUser,
      'DATA',
    )

    let sectionData = []
    sectionData.push({
      title: 'DATA',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    if (!this.itemInfo) return false
    let udbPath = await FileTools.appendingHomeDirectory(
      this.itemInfo.item.path,
    )
    let uddPath = udbPath.substring(0, udbPath.lastIndexOf('.')) + '.udd'

    let result = await FileTools.deleteFile(udbPath)
    result = result && (await FileTools.deleteFile(uddPath))

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

    let udbPath = homePath + this.itemInfo.item.path
    let uddPath = udbPath.substring(0, udbPath.lastIndexOf('.')) + '.udd'
    archivePaths = [udbPath, uddPath]

    let result = await FileTools.zipFiles(archivePaths, targetPath)
    return result
  }

  getCustomPagePopupData = () => [
    {
      title: getLanguage(global.language).Profile.NEW_DATASOURCE,
      action: () => {
        this._closeModal()
        NavigationService.navigate('InputPage', {
          placeholder: getLanguage(global.language).Profile
            .ENTER_DATASOURCE_NAME,
          headerTitle: getLanguage(global.language).Profile.SET_DATASOURCE_NAME,
          type: 'name',
          cb: async name => {
            let homePath = await FileTools.appendingHomeDirectory()
            let datasourcePath =
              homePath +
              ConstPath.UserPath +
              this.props.user.currentUser.userName +
              '/' +
              ConstPath.RelativePath.Datasource
            await this.createDatasource(datasourcePath, name, name)
            this._getSectionData()
            NavigationService.goBack()
          },
        })
      },
    },
  ]

  getCustomItemPopupData = () => [
    {
      title: getLanguage(this.props.language).Profile.NEW_DATASET,
      action: () => {
        this._createDataset()
      },
    },
  ]

  onItemPress = info => {
    this.itemInfo = info
    this._openDatasource()
  }

  _openDatasource = () => {
    NavigationService.navigate('MyDataset', {
      data: this.itemInfo.item,
    })
  }

  _createDataset = () => {
    NavigationService.navigate('NewDataset', {
      data: this.itemInfo.item,
    })
  }

  createDatasource = async (
    datasourcePath,
    datasourceName,
    datasourceAlias,
  ) => {
    let newDatasourcePath = datasourcePath + datasourceName + '.udb'
    let datasourceParams = {}
    datasourceParams.server = newDatasourcePath
    datasourceParams.engineType = EngineType.UDB
    datasourceParams.alias = datasourceAlias
    await SMap.createDatasource(datasourceParams)
    SMap.closeDatasource(datasourceAlias)
  }
}

export default MyDatasource
