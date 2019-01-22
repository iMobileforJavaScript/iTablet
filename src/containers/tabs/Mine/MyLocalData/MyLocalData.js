import React, { Component } from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import Container from '../../../../components/Container'
import { ConstPath, ConstInfo } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import LocalDataPopupModal from './LocalDataPopupModal'
import { color } from '../../../../styles'
import { SScene } from 'imobile_for_reactnative'
import UserType from '../../../../constants/UserType'
export default class MyLocalData extends Component {
  props: {
    user: Object,
    navigation: Object,
    importWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      sectionData: [],
      userName: this.props.navigation.getParam('userName', ''),
      modalIsVisible: false,
      textValue: '扫描文件:',
      textDisplay: 'flex',
    }
  }
  componentDidMount() {
    this._setSectionDataState()
  }

  _getHomePath = () => {
    return FileTools.appendingHomeDirectory()
  }
  /**
   * 深度遍历fullFileDir目录下的fileType数据
   * fullFileDir 文件目录
   * fileType 文件类型 {smwu:'smwu',sxwu:'sxwu',sxw:'sxw',smw:'smw',udb:'udb'}
   * arrFilterFile 添加到arrFilterFile数组中保存
   * */
  _setFilterDatas = async (fullFileDir, fileType, arrFilterFile) => {
    try {
      let isRecordFile = false
      let arrDirContent = await FileTools.getDirectoryContent(fullFileDir)
      for (let i = 0; i < arrDirContent.length; i++) {
        // console.warn(fullFileDir)
        let textValue = '扫描文件:' + fullFileDir
        this.setState({ textValue: textValue })
        let fileContent = arrDirContent[i]
        let isFile = fileContent.type
        let fileName = fileContent.name

        let newPath = fullFileDir + '/' + fileName
        if (isFile === 'file' && !isRecordFile) {
          if (
            (fileType.smwu && fileName.indexOf(fileType.smwu) !== -1) ||
            (fileType.sxwu && fileName.indexOf(fileType.sxwu) !== -1) ||
            (fileType.sxw && fileName.indexOf(fileType.sxw) !== -1) ||
            (fileType.smw && fileName.indexOf(fileType.smw) !== -1) ||
            (fileType.udb && fileName.indexOf(fileType.udb) !== -1)
          ) {
            if (
              !(
                fileName.indexOf('~[') !== -1 &&
                fileName.indexOf(']') !== -1 &&
                fileName.indexOf('@') !== -1
              )
            ) {
              fileName = fileName.substring(0, fileName.length - 5)
              arrFilterFile.push({
                filePath: newPath,
                fileName: fileName,
                directory: fullFileDir,
              })
              isRecordFile = true
            }
          }
        } else if (isFile === 'directory') {
          await this._setFilterDatas(newPath, fileType, arrFilterFile)
        }
      }
    } catch (e) {
      Toast.show('没有数据')
    }
    return arrFilterFile
  }
  _setSectionDataState = async () => {
    let userSectionData
    if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
      userSectionData = []
    } else {
      userSectionData = await this._constructUserSectionData()
    }
    this.setState({ sectionData: userSectionData })

    let customerSectionData = await this._constructCustomerSectionData()
    let newSectionData = userSectionData.concat(customerSectionData)
    this.setState({ sectionData: newSectionData })

    let externalSectionData = await this._constructExternalSectionData()
    let newSectionData2 = newSectionData.concat(externalSectionData)
    this.setState({ sectionData: newSectionData2, textDisplay: 'none' })
  }

  _setFilterExternalDatas = async (fullFileDir, fileType, arrFilterFile) => {
    try {
      let isRecordFile = false
      let arrDirContent = await FileTools.getDirectoryContent(fullFileDir)
      for (let i = 0; i < arrDirContent.length; i++) {
        // if(fullFileDir.indexOf(ConstPath.UserPath + this.state.userName + '/' + ConstPath.RelativePath.ExternalData) !== -1 ||
        //   fullFileDir.indexOf(ConstPath.UserPath + 'Customer/' + ConstPath.RelativePath.ExternalData) !== -1 ||
        //   fullFileDir.indexOf(ConstPath.CachePath) !== -1){
        //   continue
        // }
        if (fullFileDir.indexOf(ConstPath.AppPath) !== -1) {
          continue
        }
        let textValue = '扫描文件:' + fullFileDir
        this.setState({ textValue: textValue })
        let fileContent = arrDirContent[i]
        let isFile = fileContent.type
        let fileName = fileContent.name

        let newPath = fullFileDir + '/' + fileName
        if (isFile === 'file' && !isRecordFile) {
          if (
            (fileType.smwu && fileName.indexOf(fileType.smwu) !== -1) ||
            (fileType.sxwu && fileName.indexOf(fileType.sxwu) !== -1) ||
            (fileType.sxw && fileName.indexOf(fileType.sxw) !== -1) ||
            (fileType.smw && fileName.indexOf(fileType.smw) !== -1) ||
            (fileType.udb && fileName.indexOf(fileType.udb) !== -1)
          ) {
            if (
              !(
                fileName.indexOf('~[') !== -1 &&
                fileName.indexOf(']') !== -1 &&
                fileName.indexOf('@') !== -1
              )
            ) {
              fileName = fileName.substring(0, fileName.length - 5)
              arrFilterFile.push({
                filePath: newPath,
                fileName: fileName,
                directory: fullFileDir,
              })
              isRecordFile = true
            }
          }
        } else if (isFile === 'directory') {
          await this._setFilterExternalDatas(newPath, fileType, arrFilterFile)
        }
      }
    } catch (e) {
      Toast.show('没有数据')
    }
    return arrFilterFile
  }
  _constructExternalSectionData = async () => {
    this.homePath = await this._getHomePath()
    // this.path =
    //   this.homePath +
    //   ConstPath.UserPath +
    //   this.state.userName +
    //   '/' +
    //   ConstPath.RelativePath.ExternalData
    let newData = []
    await this._setFilterExternalDatas(
      this.homePath,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
    )

    let titleWorkspace = '外部数据'
    let sectionData
    if (newData.length === 0) {
      sectionData = []
    } else {
      sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
    }
    return sectionData
  }

  _constructUserSectionData = async () => {
    this.homePath = await this._getHomePath()
    this.path =
      this.homePath +
      ConstPath.UserPath +
      this.state.userName +
      '/' +
      ConstPath.RelativePath.ExternalData
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
    )
    let titleWorkspace = '用户数据'
    let sectionData
    if (newData.length === 0) {
      sectionData = []
    } else {
      sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
    }
    return sectionData
  }

  _constructCustomerSectionData = async () => {
    this.homePath = await this._getHomePath()
    this.path =
      this.homePath +
      ConstPath.CustomerPath +
      ConstPath.RelativePath.ExternalData
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
    )
    let titleWorkspace = '游客数据'
    let sectionData
    if (newData.length === 0) {
      sectionData = []
    } else {
      sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
    }
    return sectionData
  }

  _renderSectionHeader = info => {
    let title = info.section.title
    if (title !== undefined) {
      return (
        <TouchableOpacity
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
          style={{
            width: '100%',
            height: 60,
            backgroundColor: color.item_separate_white,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Text
            style={[
              {
                color: color.white,
                paddingLeft: 10,
                fontSize: 18,
                fontWeight: 'bold',
                backgroundColor: 'transparent',
              },
            ]}
          >
            {title}
          </Text>
        </TouchableOpacity>
      )
    }
    return <View />
  }

  _renderItem = info => {
    let txtInfo = info.item.fileName
    let itemHeight = 60
    let imageWidth = 30,
      imageHeight = 30
    let separatorLineHeight = 1
    let fontSize = Platform.OS === 'ios' ? 18 : 16
    let display = info.section.isShowItem ? 'flex' : 'none'
    return (
      <TouchableOpacity
        style={{ display: display }}
        onPress={() => {
          this.itemInfo = info
          this.setState({ modalIsVisible: true })
        }}
      >
        <View
          // display={display}
          style={{
            // display:display,
            width: '100%',
            flexDirection: 'row',
            backgroundColor: color.content_white,
            alignItems: 'center',
            height: itemHeight,
          }}
        >
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              marginLeft: 10,
              tintColor: color.font_color_white,
            }}
            resizeMode={'contain'}
            source={require('../../../../assets/Mine/mine_my_online_data.png')}
          />
          <Text
            numberOfLines={1}
            style={{
              color: color.font_color_white,
              paddingLeft: 15,
              fontSize: fontSize,
              flex: 1,
            }}
          >
            {txtInfo}
          </Text>
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              marginRight: 10,
              tintColor: color.font_color_white,
            }}
            resizeMode={'contain'}
            source={require('../../../../assets/Mine/mine_more_white.png')}
          />
        </View>
        <View
          /** 也可以在外面设置*/
          // display={display}
          style={{
            /** 也可以在style设置*/
            // display:display,
            width: '100%',
            height: separatorLineHeight,
            backgroundColor: color.item_separate_white,
          }}
        />
      </TouchableOpacity>
    )
  }

  _keyExtractor = (section, index) => {
    return 'id:' + index
  }

  _closeModal = () => {
    this.setState({ modalIsVisible: false })
  }

  _onDeleteData = async () => {
    try {
      if (this.itemInfo !== undefined) {
        let result = await FileTools.deleteFile(this.itemInfo.item.directory)
        if (result === true) {
          Toast.show('删除成功')
          let sectionData = [...this.state.sectionData]
          for (let i = 0; i < sectionData.length; i++) {
            let data = sectionData[i]
            if (data.title === this.itemInfo.section.title) {
              data.data.splice(this.itemInfo.index, 1)
              break
            }
          }
          this.setState({ sectionData: sectionData, modalIsVisible: false })
        }
      }
    } catch (e) {
      Toast.show('删除失败')
      this._closeModal()
    }
  }

  _onImportWorkspace = async () => {
    try {
      if (this.itemInfo !== undefined) {
        this.setLoading(true, ConstInfo.DATA_IMPORTING)
        let filePath = this.itemInfo.item.filePath
        let is3D = await SScene.is3DWorkspace({ server: filePath })
        if (is3D === true) {
          let result = await SScene.import3DWorkspace({ server: filePath })
          if (result === true) {
            Toast.show('导入3D成功')
          } else {
            Toast.show('导入3D失败')
          }
        } else {
          let result = await this.props.importWorkspace({ path: filePath })
          if (result.msg !== undefined) {
            Toast.show('导入失败')
          } else {
            Toast.show('导入成功')
          }
        }
        this.setLoading(false)
        this.setState({ modalIsVisible: false })
      }
    } catch (e) {
      this.setLoading(false)
      Toast.show('导入失败')
      this._closeModal()
    }
  }

  _showLocalDataPopupModal = () => {
    if (this.state.modalIsVisible) {
      return (
        <LocalDataPopupModal
          onDeleteData={this._onDeleteData}
          onImportWorkspace={this._onImportWorkspace}
          onCloseModal={this._closeModal}
          modalVisible={this.state.modalIsVisible}
        />
      )
    }
  }

  setLoading = (visible, info) => {
    this.container && this.container.setLoading(visible, info)
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '导入数据',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <Text
          numberOfLines={2}
          ellipsizeMode={'head'}
          style={{
            width: '100%',
            height: 30,
            backgroundColor: color.item_separate_white,
            display: this.state.textDisplay,
            fontSize: 10,
          }}
        >
          {this.state.textValue}
        </Text>
        <SectionList
          style={{
            flex: 1,
            backgroundColor: color.content_white,
          }}
          sections={this.state.sectionData}
          initialNumToRender={20}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderItem}
        />
        {this._showLocalDataPopupModal()}
      </Container>
    )
  }
}
