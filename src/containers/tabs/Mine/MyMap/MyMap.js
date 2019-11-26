import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { getLanguage } from '../../../../language/index'
import { ConstPath } from '../../../../constants'

class MyMap extends MyDataPage {
  constructor(props) {
    super(props)
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
      zipPath = homePath + this.getRelativeTempFilePath()
    } else {
      let exportPath = homePath + this.getRelativeExportPath()
      let availableName = await this._getAvailableFileName(
        exportPath,
        name,
        'zip',
      )
      zipPath = exportPath + availableName
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

  getItemPopupData = () => {
    let data
    data = [
      {
        title: getLanguage(this.props.language).Profile.UPLOAD_MAP,
        action: () => {
          this._closeModal()
          this.ModalBtns && this.ModalBtns.setVisible(true)
        },
      },
      {
        title: getLanguage(this.props.language).Profile.DELETE_MAP,
        action: this._onDeleteData,
      },
    ]
    return data
  }
}

export default MyMap
