import React, { Component } from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  Platform,
  AsyncStorage,
} from 'react-native'
import Container from '../../../../components/Container'
import { ConstPath, ConstInfo } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import LocalDataPopupModal from './LocalDataPopupModal'
import { color } from '../../../../styles'
import { SScene } from 'imobile_for_reactnative'
// import {  } from 'react-native-fs'
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
   *
   *            注：文件类型中，udb单独使用，不可与其他文件类型混用
   * */
  _setFilterDatas = async (
    fullFileDir,
    fileType,
    arrFilterFile,
    isShowText,
  ) => {
    try {
      let isRecordFile = false
      let arrDirContent = await FileTools.getDirectoryContent(fullFileDir)
      for (let i = 0; i < arrDirContent.length; i++) {
        if (isShowText === true) {
          let textValue = '扫描文件:' + fullFileDir
          this._setTextState(textValue)
        }
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
          await this._setFilterDatas(
            newPath,
            fileType,
            arrFilterFile,
            isShowText,
          )
        }
      }
    } catch (e) {
      Toast.show('没有数据')
    }
    return arrFilterFile
  }

  _setTextState = textValue => {
    try {
      new Promise(() => {
        this.setState({ textValue: textValue })
      })
    } catch (e) {
      //
    }
  }

  _setSectionDataState = async () => {
    let rootDirWorkspaceData = await this._constructExternalSectionData()
    if (rootDirWorkspaceData && rootDirWorkspaceData.length === 0) {
      this.setState({
        sectionData: rootDirWorkspaceData,
        textValue: '扫描结束，未发现可用数据',
      })
    } else {
      this.setState({ sectionData: rootDirWorkspaceData, textDisplay: 'none' })
    }
    // try {
    //
    //   let result = await AsyncStorage.getItem('ExternalSectionData')
    //   let newSectionData
    //   if (result !== null) {
    //     this.setState({ textDisplay: 'none' })
    //     newSectionData = await this._constructAllUserSectionData()
    //   } else {
    //     /** 第一次进入*/
    //     let userSectionData
    //     if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
    //       userSectionData = []
    //     } else {
    //       userSectionData = await this._constructUserSectionData()
    //     }
    //     // this.setState({ sectionData: userSectionData })
    //     let customerSectionData = await this._constructCustomerSectionData()
    //     newSectionData = userSectionData.concat(customerSectionData)
    //     this.setState({ sectionData: newSectionData })
    //   }
    //
    //   let externalSectionData = []
    //   if (result !== null) {
    //     externalSectionData = JSON.parse(result)
    //   } else {
    //     externalSectionData = await this._constructExternalSectionData()
    //     AsyncStorage.setItem(
    //       'ExternalSectionData',
    //       JSON.stringify(externalSectionData),
    //     )
    //   }
    //   let newSectionData2 = newSectionData.concat(externalSectionData)
    //   this.setState({ sectionData: newSectionData2, textDisplay: 'none' })
    // } catch (e) {
    //   this.setState({ textDisplay: 'none' })
    // }
  }

  _setFilterExternalDatas = async (fullFileDir, fileType, arrFilterFile) => {
    try {
      let isRecordFile = false
      let arrDirContent = await FileTools.getDirectoryContent(fullFileDir)
      for (let i = 0; i < arrDirContent.length; i++) {
        if (fullFileDir.indexOf(ConstPath.AppPath) !== -1) {
          continue
        }
        let textValue = '扫描文件:' + fullFileDir
        this._setTextState(textValue)
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

  /** 构造根目录下的工作空间数据*/
  _constructRootDirSectionData = async () => {
    this.homePath = await this._getHomePath()
    let newData = []
    await this._setFilterDatas(
      this.homePath,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
      true,
    )
    let titleWorkspace = '工作空间'
    let sectionData
    if (newData.length === 0) {
      sectionData = []
    } else {
      sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
    }
    return sectionData
  }

  /** 构造除iTablet目录以外的数据*/
  _constructExternalSectionData = async () => {
    this.homePath = await this._getHomePath()
    let newData = []
    await this._setFilterExternalDatas(
      this.homePath,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
      true,
    )

    let titleWorkspace = '工作空间'
    let sectionData
    if (newData.length === 0) {
      sectionData = []
    } else {
      sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
    }
    return sectionData
  }
  /** 构造游客以及当前用户数据*/
  _constructAllUserSectionData = async () => {
    this.homePath = await this._getHomePath()
    this.path = this.homePath + ConstPath.UserPath2
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
      false,
    )
    let titleWorkspace = '用户数据'
    let titleWorkspace2 = '游客数据'
    let sectionData
    if (newData.length === 0) {
      sectionData = []
    } else {
      let arrUserData = []
      let arrCustomerData = []
      let userName =
        this.props.user.currentUser.userType === UserType.PROBATION_USER
          ? '/null23132/'
          : this.props.user.currentUser.userName
      for (let i = 0; i < newData.length; i++) {
        let objData = newData[i]
        if (
          objData.filePath.indexOf(ConstPath.RelativePath.ExternalData) !== -1
        ) {
          if (objData.filePath.indexOf(userName) !== -1) {
            arrUserData.push(objData)
          } else if (objData.filePath.indexOf('Customer') !== -1) {
            arrCustomerData.push(objData)
          }
        }
      }
      if (arrUserData.length === 0) {
        if (arrCustomerData.length === 0) {
          sectionData = []
        } else {
          sectionData = [
            { title: titleWorkspace2, data: arrCustomerData, isShowItem: true },
          ]
        }
      } else {
        if (arrCustomerData.length === 0) {
          sectionData = [
            { title: titleWorkspace, data: arrUserData, isShowItem: true },
          ]
        } else {
          sectionData = [
            { title: titleWorkspace, data: arrUserData, isShowItem: true },
            { title: titleWorkspace2, data: arrCustomerData, isShowItem: true },
          ]
        }
      }
    }
    return sectionData
  }
  /** 构造当前用户数据*/
  _constructUserSectionData = async () => {
    this.homePath = await this._getHomePath()
    this.path =
      this.homePath +
      ConstPath.UserPath +
      this.state.userName +
      '/' +
      ConstPath.RelativePath.ExternalData2
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
      true,
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
  /** 构造游客数据*/
  _constructCustomerSectionData = async () => {
    this.homePath = await this._getHomePath()
    this.path =
      this.homePath +
      ConstPath.CustomerPath +
      ConstPath.RelativePath.ExternalData2
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
      true,
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
      let imageSource = info.section.isShowItem
        ? require('../../../../assets/Mine/local_data_open.png')
        : require('../../../../assets/Mine/local_data_close.png')
      let imageWidth = 20
      let height = 40
      let fontSize = 18
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
            height: height,
            backgroundColor: color.contentColorGray,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Image
            resizeMode={'contain'}
            style={{
              tintColor: color.fontColorWhite,
              marginLeft: 10,
              width: imageWidth,
              height: imageWidth,
            }}
            source={imageSource}
          />
          <Text
            style={[
              {
                color: color.fontColorWhite,
                paddingLeft: 10,
                fontSize: fontSize,
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
            backgroundColor: color.contentColorWhite,
            alignItems: 'center',
            height: itemHeight,
          }}
        >
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              marginLeft: 20,
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
            backgroundColor: color.itemColorGray,
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
      this.setLoading(true, '删除数据中...')
      if (this.itemInfo !== undefined) {
        let directory = this.itemInfo.item.directory

        let isExist = await FileTools.fileIsExist(directory)
        let result
        if (isExist === true) {
          result = await FileTools.deleteFile(this.itemInfo.item.directory)
        } else {
          result = true
        }
        if (result === true) {
          Toast.show('删除成功')
          let sectionData = [...this.state.sectionData]
          for (let i = 0; i < sectionData.length; i++) {
            let data = sectionData[i]
            if (data.title === this.itemInfo.section.title) {
              data.data.splice(this.itemInfo.index, 1)
              if (data.title === '外部数据') {
                AsyncStorage.setItem(
                  'ExternalSectionData',
                  JSON.stringify(data),
                )
              }
              break
            }
          }
          this.setState({ sectionData: sectionData, modalIsVisible: false })
        } else {
          this._closeModal()
        }
      }
    } catch (e) {
      Toast.show('删除失败')
      this._closeModal()
    } finally {
      this.setLoading(false)
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
    let sectionData = this.state.sectionData
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
            backgroundColor: color.content_white,
            display: this.state.textDisplay,
            paddingLeft: 10,
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
          sections={sectionData}
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
