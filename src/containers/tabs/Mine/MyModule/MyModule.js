import React, { Component } from 'react'
import {
  SectionList,
  View,
  TouchableOpacity,
  Image,
  Text,
  RefreshControl,
  StyleSheet,
  NativeModules,
} from 'react-native'
import { ConstPath } from '../../../../constants'
import { FileTools, NativeMethod } from '../../../../native'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import UserType from '../../../../constants/UserType'
import { Container } from '../../../../components'
import MyDataPopupModal from '../MyData/MyDataPopupModal'
import NavigationService from '../../../NavigationService'
import ModuleItem from './ModuleItem'
import { color } from '../../../../styles'
import { InputDialog } from '../../../../components/Dialog'
import { Toast, scaleSize, setSpText } from '../../../../utils'
import ModalBtns from './ModalBtns'
import { getLanguage } from '../../../../language/index'
const appUtilsModule = NativeModules.AppUtils
// import {screen} from '../../../../utils'
export default class MyModule extends Component {
  props: {
    user: any,
    navigation: Object,
    exportModule: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      sectionData: [],
      title: params.title,
      modalIsVisible: false,
      isRefreshing: false,
    }
    this.formChat = params.formChat || false
    this.chatCallBack = params.chatCallBack
    this.isShowMore = params.formChat ? false : true
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    let data = []
    let isShowItem = false
    let user =
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? 'Customer'
        : this.props.user.currentUser.userName

    // let plottingData = await NativeMethod.getTemplates(
    //   user,
    //   ConstPath.Module.Plotting,
    // )

    let plottingData = await this._getPlotDataList(user)

    let collectionData = await NativeMethod.getTemplates(
      user,
      ConstPath.Module.Collection,
    )
    // let plottingPath = userPath + ConstPath.RelativePath.ExternalDataPlotting
    // let collectionPath = userPath + ConstPath.RelativePath.ExternalDataCollection
    // let plottingData = await FileTools.getPathListByFilter(plottingPath, {extension: 'xml',type: 'file',})
    // let collectionData = await FileTools.getPathListByFilter(collectionPath, {extension: 'xml',type: 'file',})
    if (plottingData.length > 0) {
      isShowItem = true
      data.push({
        title: getLanguage(global.language).Profile.PLOTTING_TEMPLATE,
        data: plottingData,
        isShowItem: isShowItem,
      })
    }
    if (collectionData.length > 0) {
      isShowItem = true
      data.push({
        title: getLanguage(global.language).Profile.COLLECTION_TEMPLATE,
        //'采集模板',
        data: collectionData,
        isShowItem: isShowItem,
      })
    }
    this.setState({ sectionData: data })
  }

  // _getPlotDataList = async userName => {
  async _getPlotDataList(userName) {
    let path =
      ConstPath.UserPath + userName + '/' + ConstPath.RelativePath.Plotting
    let plotPath = await FileTools.appendingHomeDirectory(path)
    let list = []
    let arrDirContent = await FileTools.getDirectoryContent(plotPath)
    if (arrDirContent.length > 0) {
      for (let key in arrDirContent) {
        if (arrDirContent[key].type === 'directory') {
          let dirPath = plotPath + arrDirContent[key].name
          let dirContent = await FileTools.getDirectoryContent(dirPath)
          let hasSymbol, hasSymbolIcon
          if (dirContent.length === 0) continue
          for (let index in dirContent) {
            if (dirContent[index].type === 'directory') {
              if (dirContent[index].name === 'Symbol') {
                hasSymbol = true
              } else if (dirContent[index].name === 'SymbolIcon') {
                hasSymbolIcon = true
              }
            }
          }
          if (hasSymbol && hasSymbolIcon) {
            list.push({
              name: arrDirContent[key].name,
              path: plotPath + arrDirContent[key].name,
            })
          }
        }
      }
    }
    return list
  }

  _renderItem = ({ item, section, index }) => {
    if (!section.isShowItem) {
      return <View />
    }
    return (
      <ModuleItem
        item={item}
        index={index}
        section={section}
        saveItemInfo={this.saveItemInfo}
        uploadListOfAdd={this.uploadListOfAdd}
        removeDataFromUpList={this.removeDataFromUpList}
        isShowMore={this.isShowMore}
      />
    )
  }

  _keyExtractor = index => {
    return index
  }

  _closeModal = () => {
    this.setState({ modalIsVisible: false })
  }

  saveItemInfo = ({ item, index, section }) => {
    this.itemInfo = { item, index, section }
    this.setState({ modalIsVisible: true }, () => {
      this.MyDataPopModal && this.MyDataPopModal.setVisible(true)
    })
  }

  _showMyDataPopupModal = () => {
    let localOption = [
      {
        title: getLanguage(global.language).Profile.DELETE_TEMPLATE,
        //'删除数据',
        action: async () => {
          this.deleteData()
        },
      },
    ]
    let userOption = [
      {
        title: getLanguage(global.language).Profile.UPLOAD_TEMPLATE,
        //''分享',
        action: async () => {
          this._closeModal()
          this.ModalBtns.setVisible(true)
        },
      },
    ]
    let data
    if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
      data = localOption
    } else {
      data = userOption.concat(localOption)
    }
    return (
      <MyDataPopupModal
        // onDeleteData={this._onDeleteData}
        ref={ref => (this.MyDataPopModal = ref)}
        data={data}
      />
    )
  }

  deleteData = async () => {
    try {
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
      if (result) {
        this._closeModal()
        Toast.show(getLanguage(global.language).Prompt.DELETED_SUCCESS)
        //'删除成功')
        this.getData()
      } else {
        Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
        //'删除失败')
      }
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
      //'删除失败')
    }
  }

  shareData = async type => {
    try {
      this.ModalBtns.setVisible(false)
      // this.container.setLoading(true, '正在分享')
      Toast.show(getLanguage(global.language).Prompt.SHARING)
      //'正在分享')
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
      let userPath = await FileTools.appendingHomeDirectory(
        this.props.user.currentUser.userType === UserType.PROBATION_USER
          ? ConstPath.CustomerPath
          : ConstPath.UserPath + this.props.user.currentUser.userName + '/',
      )
      let toPath =
        userPath +
        ConstPath.RelativePath.ExternalData +
        ConstPath.RelativeFilePath.ExportData +
        'MyExport.zip'
      // console.warn(fromPath, toPath)
      let result = await FileTools.zipFile(fromPath, toPath)
      if (result) {
        let fileName = this.itemInfo.item.name
        if (type === 'weChat') {
          appUtilsModule
            .sendFileOfWechat({
              filePath: toPath,
              title: fileName + '.zip',
              description: 'SuperMap iTablet',
            })
            .then(
              result => {
                !result &&
                  Toast.show(
                    getLanguage(global.language).Prompt.SHARED_DATA_10M,
                  )
                //'所分享文件超过10MB')
                !result && FileTools.deleteFile(toPath)
                this.ModalBtns.setVisible(false)
              },
              () => {
                Toast.show(getLanguage(global.language).Prompt.SHARE_FAILED)
                //'分享失败')
                this.container.setLoading(false)
                FileTools.deleteFile(toPath)
              },
            )
        } else if (type === 'online') {
          SOnlineService.uploadFile(toPath, fileName, {
            onResult: () => {
              Toast.show(getLanguage(global.language).Prompt.SHARE_SUCCESS)
              //'分享成功')
              FileTools.deleteFile(toPath)
              this.container.setLoading(false)
              this.ModalBtns.setVisible(false)
            },
          })
        } else if (type === 'iportal') {
          this.ModalBtns.setVisible(false)
          let uploadResult = await SIPortalService.uploadData(
            toPath,
            fileName + '.zip',
          )
          uploadResult
            ? Toast.show(getLanguage(global.language).Prompt.SHARE_SUCCESS)
            : Toast.show(getLanguage(global.language).Prompt.SHARE_FAILED)
          FileTools.deleteFile(toPath)
          this.container.setLoading(false)
        } else if (this.chatCallBack) {
          this.container.setLoading(false)
          this.chatCallBack && this.chatCallBack(toPath)
          NavigationService.goBack()
        }
      }
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.SHARE_FAILED)
      //'分享失败')
    } finally {
      this.container.setLoading(false)
    }
  }

  renderDiaolog = () => {
    return (
      <InputDialog
        ref={ref => (this.dialog = ref)}
        placeholder={getLanguage(global.language).Prompt.ENTER_DATA_NAME}
        // {'请输入数据名称'}
        confirmAction={() => {
          this.uploadDialog(this.dialog.state.value)
        }}
        confirmBtnTitle={getLanguage(global.language).Prompt.SHARE}
        //{'上传'}
        cancelBtnTitle={getLanguage(global.language).Prompt.CANCEL}
        //{'取消'}
      />
    )
  }

  _renderSectionHeader = ({ section }) => {
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

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <SectionList
          initialNumToRender={20}
          ref={ref => (this.ref = ref)}
          renderItem={this._renderItem}
          sections={this.state.sectionData}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.getData}
              colors={['orange', 'red']}
              titleColor={'orange'}
              tintColor={'orange'}
              title={'刷新中...'}
              enabled={true}
            />
          }
          renderSectionHeader={this._renderSectionHeader}
        />
        {this._showMyDataPopupModal()}
        <ModalBtns
          ref={ref => (this.ModalBtns = ref)}
          actionOfOnline={
            UserType.isOnlineUser(this.props.user.currentUser)
              ? () => this.shareData('online')
              : undefined
          }
          actionOfIPortal={
            UserType.isIPortalUser(this.props.user.currentUser)
              ? () => this.shareData('iportal')
              : undefined
          }
          actionOfWechat={() => this.shareData('weChat')}
        />
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  sectionView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.contentColorGray,
    height: scaleSize(80),
  },
  sectionImg: {
    width: scaleSize(30),
    height: scaleSize(30),
    marginLeft: 10,
    tintColor: color.imageColorWhite,
  },
  sectionText: {
    color: color.fontColorWhite,
    paddingLeft: 15,
    fontSize: setSpText(26),
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  },
})
