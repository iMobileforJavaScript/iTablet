import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { getLanguage } from '../../../../language/index'

class MyScene extends MyDataPage {
  constructor(props) {
    super(props)
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

    let scenePath = homePath + this.itemInfo.item.path
    let pxpPath = scenePath + '.pxp'
    archivePaths = [scenePath, pxpPath]

    let result = await FileTools.zipFiles(archivePaths, targetPath)
    return result
  }

  getItemPopupData = () => {
    let data
    data = [
      {
        title: getLanguage(this.props.language).Profile.UPLOAD_SCENE,
        action: () => {
          this._closeModal()
          this.ModalBtns && this.ModalBtns.setVisible(true)
        },
      },
      {
        title: getLanguage(this.props.language).Profile.DELETE_SCENE,
        action: this._onDeleteData,
      },
    ]
    return data
  }
}

export default MyScene
