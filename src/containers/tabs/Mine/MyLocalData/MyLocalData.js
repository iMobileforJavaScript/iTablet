import React, { Component } from 'react'
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  AsyncStorage,
  RefreshControl,
} from 'react-native'
import { ListSeparator, TextBtn } from '../../../../components'
import { ConstPath, ConstInfo, Const } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import LocalDataPopupModal from './LocalDataPopupModal'
import { color, size } from '../../../../styles'
import { SScene } from 'imobile_for_reactnative'
import UserType from '../../../../constants/UserType'
import { scaleSize } from '../../../../utils'
import NavigationService from '../../../NavigationService'
export default class MyLocalData extends Component {
  props: {
    user: Object,
    navigation: Object,
    importWorkspace: () => {},
    showOnlineData: () => {},
    getContainer: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      sectionData: [],
      userName: this.props.navigation.getParam('userName', ''),
      modalIsVisible: false,
      isFirstLoadingModal: true,
      textValue: '扫描文件:',
      textDisplay: 'none',
      isRefreshing: false,
    }
  }
  componentDidMount() {
    this._setSectionDataState3()
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
      let udb = null
      let isWorkspace = false
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
          // (fileType.udb && fileName.indexOf(fileType.udb) !== -1)
          if (
            (fileType.smwu && fileName.indexOf(fileType.smwu) !== -1) ||
            (fileType.sxwu && fileName.indexOf(fileType.sxwu) !== -1) ||
            (fileType.sxw && fileName.indexOf(fileType.sxw) !== -1) ||
            (fileType.smw && fileName.indexOf(fileType.smw) !== -1)
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
              isWorkspace = true
            }
          } else if (fileType.udb && fileName.indexOf(fileType.udb) !== -1) {
            fileName = fileName.substring(0, fileName.length - 4)
            udb = {
              filePath: newPath,
              fileName: fileName,
              directory: fullFileDir,
            }
          }
          if (i === arrDirContent.length - 1) {
            if (!isWorkspace) {
              udb !== null && arrFilterFile.push(udb)
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
      // Toast.show('没有数据')
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
    try {
      // let result = await AsyncStorage.getItem('ExternalSectionData')
      // if (result !== null) {
      //   this.setState({ textDisplay: 'none' })
      // }
      let userSectionData
      if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
        userSectionData = []
      } else {
        userSectionData = await this._constructUserSectionData()
      }
      // this.setState({ sectionData: userSectionData })
      let customerSectionData = await this._constructCustomerSectionData()
      let newSectionData = userSectionData.concat(customerSectionData)
      this.setState({
        sectionData: [
          { title: '工作空间', data: newSectionData, isShowItem: true },
        ],
      })
      let externalSectionData = []
      let result = await AsyncStorage.getItem('ExternalSectionData')
      if (result !== null) {
        externalSectionData = JSON.parse(result)
      } else {
        externalSectionData = await this._constructExternalSectionData()
        AsyncStorage.setItem(
          'ExternalSectionData',
          JSON.stringify(externalSectionData),
        )
      }
      let newSectionData2 = newSectionData.concat(externalSectionData)
      this.setState({
        sectionData: [
          { title: '工作空间', data: newSectionData2, isShowItem: true },
        ],
        textDisplay: 'none',
      })
    } catch (e) {
      this.setState({ textDisplay: 'none' })
    }
  }

  _setSectionDataState2 = async () => {
    try {
      let result = await AsyncStorage.getItem('ExternalSectionData')
      let newSectionData
      if (result !== null) {
        this.setState({ textDisplay: 'none' })
        newSectionData = await this._constructAllUserSectionData()
      } else {
        /** 第一次进入*/
        let userSectionData
        if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
          userSectionData = []
        } else {
          userSectionData = await this._constructUserSectionData()
        }
        // this.setState({ sectionData: userSectionData })
        let customerSectionData = await this._constructCustomerSectionData()
        newSectionData = userSectionData.concat(customerSectionData)
        this.setState({
          sectionData: [
            { title: '工作空间', data: newSectionData, isShowItem: true },
          ],
        })
      }

      let externalSectionData = []
      if (result !== null) {
        externalSectionData = JSON.parse(result)
      } else {
        externalSectionData = await this._constructExternalSectionData()
        AsyncStorage.setItem(
          'ExternalSectionData',
          JSON.stringify(externalSectionData),
        )
      }
      let newSectionData2 = newSectionData.concat(externalSectionData)
      this.setState({
        sectionData: [
          { title: '工作空间', data: newSectionData2, isShowItem: true },
        ],
        textDisplay: 'none',
      })
    } catch (e) {
      this.setState({ textDisplay: 'none' })
    }
  }

  _setSectionDataState3 = async () => {
    try {
      // this.container.setLoading(true)
      let cacheSectionData = await this._constructCacheSectionData()
      this.setState({
        sectionData: cacheSectionData,
        textDisplay: 'none',
      })

      let userData
      if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
        userData = []
      } else {
        userData = await this._constructUserSectionData()
      }
      // this.setState({ sectionData: userSectionData })
      let customerSectionData = await this._constructCustomerSectionData()
      let qqData = await this._constructTecentOfQQ()
      let weixinData = await this._constructTecentOfweixin()
      let newData = userData.concat(customerSectionData, qqData, weixinData)
      let newSectionData = cacheSectionData.concat([
        { title: '外部数据', data: newData, isShowItem: true },
      ])
      this.setState(
        {
          sectionData: newSectionData,
        },
        () => {
          this.props.showOnlineData && this.props.showOnlineData()
          // this.container.setLoading(false)
        },
      )
      // let externalSectionData = []
      // let result = await AsyncStorage.getItem('ExternalSectionData')
      // if (result !== null) {
      //   externalSectionData = JSON.parse(result)
      // } else {
      //   externalSectionData = await this._constructExternalSectionData()
      //   AsyncStorage.setItem(
      //     'ExternalSectionData',
      //     JSON.stringify(externalSectionData),
      //   )
      // }
      // let newData2 = newData.concat(externalSectionData)
      // let newSectionData2 = cacheSectionData.concat([
      //   { title: '外部数据', data: newData2, isShowItem: true },
      // ])
      // this.setState({
      //   sectionData: newSectionData2,
      //   textDisplay: 'none',
      // })
    } catch (e) {
      this.setState({ textDisplay: 'none' })
    }
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
      // Toast.show('没有数据')
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
    return newData
    // let titleWorkspace = '工作空间'
    // let sectionData
    // if (newData.length === 0) {
    //   sectionData = []
    // } else {
    //   sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
    // }
    // return sectionData
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
    return newData
    // let titleWorkspace = '工作空间'
    // let sectionData
    // if (newData.length === 0) {
    //   sectionData = []
    // } else {
    //   sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
    // }
    // return sectionData
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
    return newData
    // let titleWorkspace = '用户数据'
    // let titleWorkspace2 = '游客数据'
    // let sectionData
    // if (newData.length === 0) {
    //   sectionData = []
    // } else {
    //   let arrUserData = []
    //   let arrCustomerData = []
    //   let userName =
    //     this.props.user.currentUser.userType === UserType.PROBATION_USER
    //       ? '/null23132/'
    //       : this.props.user.currentUser.userName
    //   for (let i = 0; i < newData.length; i++) {
    //     let objData = newData[i]
    //     if (
    //       objData.filePath.indexOf(ConstPath.RelativePath.ExternalData) !== -1
    //     ) {
    //       if (objData.filePath.indexOf(userName) !== -1) {
    //         arrUserData.push(objData)
    //       } else if (objData.filePath.indexOf('Customer') !== -1) {
    //         arrCustomerData.push(objData)
    //       }
    //     }
    //   }
    //   if (arrUserData.length === 0) {
    //     if (arrCustomerData.length === 0) {
    //       sectionData = []
    //     } else {
    //       sectionData = [
    //         { title: titleWorkspace2, data: arrCustomerData, isShowItem: true },
    //       ]
    //     }
    //   } else {
    //     if (arrCustomerData.length === 0) {
    //       sectionData = [
    //         { title: titleWorkspace, data: arrUserData, isShowItem: true },
    //       ]
    //     } else {
    //       sectionData = [
    //         { title: titleWorkspace, data: arrUserData, isShowItem: true },
    //         { title: titleWorkspace2, data: arrCustomerData, isShowItem: true },
    //       ]
    //     }
    //   }
    // }
    // return sectionData
  }
  /** 构造样例数据数据*/
  _constructCacheSectionData = async () => {
    this.homePath = await this._getHomePath()
    this.path = this.homePath + ConstPath.CachePath2
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
      false,
    )
    let titleWorkspace = '样例数据'
    let sectionData
    if (newData.length === 0) {
      sectionData = []
    } else {
      sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
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
      ConstPath.RelativeFilePath.ExternalData
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
      false,
    )
    return newData
    // let titleWorkspace = '用户数据'
    // let sectionData
    // if (newData.length === 0) {
    //   sectionData = []
    // } else {
    //   sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
    // }
    // return sectionData
  }
  /** 构造游客数据*/
  _constructCustomerSectionData = async () => {
    this.homePath = await this._getHomePath()
    this.path =
      this.homePath +
      ConstPath.CustomerPath +
      ConstPath.RelativeFilePath.ExternalData
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
      false,
    )
    return newData
    // let titleWorkspace = '游客数据'
    // let sectionData
    // if (newData.length === 0) {
    //   sectionData = []
    // } else {
    //   sectionData = [{ title: titleWorkspace, data: newData, isShowItem: true }]
    // }
    // return sectionData
  }

  _constructTecentOfQQ = async () => {
    this.homePath = await this._getHomePath()
    this.path = this.homePath + '/Tencent/QQfile_recv'
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
      false,
    )
    return newData
  }

  _constructTecentOfweixin = async () => {
    this.homePath = await this._getHomePath()
    this.path = this.homePath + '/Tencent/MicroMsg/Download'
    let newData = []
    await this._setFilterDatas(
      this.path,
      { smwu: 'smwu', sxwu: 'sxwu' },
      newData,
      false,
    )
    return newData
  }

  _renderSectionHeader = info => {
    let title = info.section.title
    if (title !== undefined) {
      let imageSource = info.section.isShowItem
        ? require('../../../../assets/Mine/local_data_open.png')
        : require('../../../../assets/Mine/local_data_close.png')
      let imageWidth = scaleSize(30)
      let height = scaleSize(80)
      let fontSize = size.fontSize.fontSizeXl
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
              tintColor: color.imageColorWhite,
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
                paddingLeft: 15,
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
    let path = info.item.directory.substring(this.homePath.length)
    let itemHeight = scaleSize(80)
    let imageWidth = scaleSize(40),
      imageHeight = scaleSize(40)
    // let separatorLineHeight = 1
    let fontSize = size.fontSize.fontSizeXl
    let imageColor = color.imageColorBlack
    let fontColor = color.fontColorBlack
    let display = info.section.isShowItem ? 'flex' : 'none'
    return (
      <TouchableOpacity
        style={{
          display: display,
          width: '100%',
          // paddingLeft: scaleSize(16),
          // paddingRight: scaleSize(16),
        }}
        onPress={() => {
          this.itemInfo = info
          if (this.state.isFirstLoadingModal) {
            this.setState({ modalIsVisible: true, isFirstLoadingModal: false })
          } else {
            this.setState({ modalIsVisible: true })
          }
        }}
      >
        <View
          style={{
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
              tintColor: imageColor,
            }}
            resizeMode={'contain'}
            source={require('../../../../assets/Mine/mine_my_online_data.png')}
          />
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text
              numberOfLines={1}
              style={{
                marginTop: scaleSize(5),
                color: fontColor,
                paddingLeft: 15,
                fontSize: fontSize,
              }}
            >
              {txtInfo}
            </Text>
            <Text
              ellipsizeMode={'middle'}
              numberOfLines={1}
              style={{
                marginTop: scaleSize(5),
                color: color.fontColorGray,
                paddingLeft: 15,
                fontSize: 10,
                height: 15,
                marginRight: 20,
              }}
            >
              {`路径:${path}`}
            </Text>
          </View>
          <Image
            style={{
              width: imageWidth,
              height: imageHeight,
              marginRight: 10,
              // tintColor: imageColor,
            }}
            resizeMode={'contain'}
            source={require('../../../../assets/Mine/icon_more_gray.png')}
          />
        </View>
        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: color.separateColorGray,
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
      this._closeModal()
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
      this._closeModal()
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
      }
    } catch (e) {
      this.setLoading(false)
      Toast.show('导入失败')
      this._closeModal()
    }
  }

  _showLocalDataPopupModal = () => {
    if (!this.state.isFirstLoadingModal) {
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

  _renderSectionSeparatorComponent = () => {
    return <ListSeparator color={color.contentColorWhite} height={1} />
  }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.isShowItem ? (
      <ListSeparator color={color.separateColorGray} height={1} />
    ) : null
  }

  goToMyOnlineData = async () => {
    NavigationService.navigate('MyOnlineData', {
      refreshData: this._setSectionDataState3,
    })
  }

  _renderHeaderBtn = () => {
    let btn = null
    if (
      this.props.user.currentUser.userType !== UserType.PROBATION_USER &&
      this.props.user.currentUser.userName
    ) {
      let title = Const.ONLINE_DATA
      let action = this.goToMyOnlineData

      btn = (
        <TextBtn
          btnText={title}
          textStyle={{
            color: 'white',
            fontSize: 17,
          }}
          btnClick={action}
        />
      )
    }
    return btn
  }

  render() {
    let sectionData = this.state.sectionData
    return (
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={2}
          ellipsizeMode={'head'}
          style={{
            width: '100%',
            backgroundColor: color.contentColorWhite,
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
            backgroundColor: color.contentColorWhite,
          }}
          sections={sectionData}
          initialNumToRender={20}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          renderSectionFooter={this._renderSectionSeparatorComponent}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._setSectionDataState3}
              colors={['orange', 'red']}
              titleColor={'orange'}
              tintColor={'orange'}
              title={'刷新中...'}
              enabled={true}
            />
          }
        />
        {this._showLocalDataPopupModal()}
      </View>
    )
  }
}
