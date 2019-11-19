import React from 'react'
import { TouchableOpacity, Image, Text } from 'react-native'
import { MyDataPage } from '../component'
import DataHandler from '../DataHandler'
import { FileTools } from '../../../../native'
import { getLanguage } from '../../../../language/index'
import styles from '../component/styles'

class MyTemplate extends MyDataPage {
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

  exportData = async () => {
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

    let toPath = homePath + this.getRelativeExportPath()
    let result = await FileTools.zipFile(fromPath, toPath)
    return result
  }

  getItemPopupData = () => {
    let data
    data = [
      {
        title: getLanguage(this.props.language).Profile.UPLOAD_TEMPLATE,
        action: () => {
          this._closeModal()
          this.ModalBtns && this.ModalBtns.setVisible(true)
        },
      },
      {
        title: getLanguage(this.props.language).Profile.DELETE_TEMPLATE,
        action: this._onDeleteData,
      },
    ]
    return data
  }

  renderSectionHeader = ({ section }) => {
    let title = section.title
    let imageSource = section.isShowItem
      ? require('../../../../assets/Mine/local_data_open.png')
      : require('../../../../assets/Mine/local_data_close.png')
    return (
      <TouchableOpacity
        style={styles.sectionView}
        onPress={() => {
          let sectionData = [...this.state.sectionData]
          for (let i = 0; i < sectionData.length; i++) {
            let data = sectionData[i]
            if (data.title === title) {
              data.isShowItem = !data.isShowItem
              break
            }
          }
          this.setState({ sectionData: sectionData })
        }}
      >
        <Image source={imageSource} style={styles.sectionImg} />
        <Text style={styles.sectionText}>{section.title}</Text>
      </TouchableOpacity>
    )
  }
}

export default MyTemplate
