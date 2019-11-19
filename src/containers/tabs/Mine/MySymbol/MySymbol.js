import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { getLanguage } from '../../../../language/index'

class MySymbol extends MyDataPage {
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

  exportData = async () => {
    let homePath = await FileTools.appendingHomeDirectory()
    let targetPath = homePath + this.getRelativeExportPath()
    let archivePaths = []

    let symbolPath = homePath + this.itemInfo.item.path
    archivePaths = [symbolPath]

    let result = await FileTools.zipFiles(archivePaths, targetPath)
    return result
  }

  getItemPopupData = () => {
    let data
    data = [
      {
        title: getLanguage(this.props.language).Profile.UPLOAD_SYMBOL,
        action: () => {
          this._closeModal()
          this.ModalBtns && this.ModalBtns.setVisible(true)
        },
      },
      {
        title: getLanguage(this.props.language).Profile.DELETE_SYMBOL,
        action: this._onDeleteData,
      },
    ]
    return data
  }
}

export default MySymbol
