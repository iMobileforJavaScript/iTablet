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

    let udbPath = homePath + this.itemInfo.item.path
    let uddPath = udbPath.substring(0, udbPath.lastIndexOf('.')) + '.udd'
    archivePaths = [udbPath, uddPath]

    let result = await FileTools.zipFiles(archivePaths, targetPath)
    return result
  }

  getPagePopupData = () => {
    let data = [
      {
        title: getLanguage(global.language).Profile.NEW_DATASOURCE,
        action: () => {
          this._closeModal()
          NavigationService.navigate('InputPage', {
            placeholder: getLanguage(global.language).Profile
              .ENTER_DATASOURCE_NAME,
            headerTitle: getLanguage(global.language).Profile
              .SET_DATASOURCE_NAME,
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
      {
        title: getLanguage(global.language).Profile.BATCH_OPERATE,
        action: () => {
          this.setState({
            batchMode: !this.state.batchMode,
          })
        },
      },
    ]
    return data
  }

  getItemPopupData = () => {
    let data
    data = [
      {
        title: getLanguage(this.props.language).Profile.NEW_DATASET,
        action: () => {
          this._createDataset()
        },
      },
      {
        title: getLanguage(this.props.language).Profile.UPLOAD_DATA,
        action: () => {
          this._closeModal()
          this.ModalBtns && this.ModalBtns.setVisible(true)
        },
      },
      {
        title: getLanguage(this.props.language).Profile.DELETE_DATA,
        action: this._onDeleteData,
      },
    ]
    return data
  }

  onItemPress = info => {
    this.itemInfo = info
    this._openDatasource()
  }

  _openDatasource = () => {
    NavigationService.navigate('DatasourcePage', {
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