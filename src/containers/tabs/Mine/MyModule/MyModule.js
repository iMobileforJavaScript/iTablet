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
import { color } from '../../../../styles'
import { InputDialog } from '../../../../components/Dialog'
import { Toast, scaleSize, setSpText } from '../../../../utils'
import ModalBtns from './ModalBtns'
import { getLanguage } from '../../../../language/index'
import { MineItem } from '../component'
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
      batchDelete: false,
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
    let img = require('../../../../assets/mapToolbar/list_type_map_black.png')
    return (
      <MineItem
        item={item}
        image={img}
        text={item.name}
        disableTouch={this.state.batchDelete}
        showRight={this.isShowMore}
        showCheck={this.state.batchDelete}
        onPressMore={() => {
          this.saveItemInfo({ item, section, index })
        }}
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

  _batchDelete = async () => {
    try {
      let deleteArr = this._getSelectedList()
      if (deleteArr.length === 0) {
        Toast.show(getLanguage(global.language).Prompt.SELECT_AT_LEAST_ONE)
        return
      }
      this.setState({ batchDelete: false })
      for (let i = 0; i < deleteArr.length; i++) {
        let filePath
        if (
          deleteArr[i].section.title ===
          getLanguage(global.language).Profile.COLLECTION_TEMPLATE
        ) {
          filePath = deleteArr[i].item.path.substring(
            0,
            deleteArr[i].item.path.lastIndexOf('/'),
          )
        } else if (
          deleteArr[i].section.title ===
          getLanguage(global.language).Profile.PLOTTING_TEMPLATE
        ) {
          filePath = deleteArr[i].item.path
        }
        await FileTools.deleteFile(filePath)
      }
      this.getData()
      Toast.show(getLanguage(global.language).Prompt.DELETED_SUCCESS)
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
    }
  }

  _selectAll = () => {
    let section = Object.assign([], this.state.sectionData)
    for (let i = 0; i < section.length; i++) {
      for (let n = 0; n < section[i].data.length; n++) {
        section[i].data[n].checked = true
      }
    }
    this.setState({ section })
  }

  _deselectAll = () => {
    let section = Object.assign([], this.state.sectionData)
    for (let i = 0; i < section.length; i++) {
      for (let n = 0; n < section[i].data.length; n++) {
        section[i].data[n].checked = false
      }
    }
    this.setState({ section })
  }

  _getSelectedList = () => {
    let list = []
    for (let i = 0; i < this.state.sectionData.length; i++) {
      for (let n = 0; n < this.state.sectionData[i].data.length; n++) {
        if (this.state.sectionData[i].data[n].checked === true) {
          list.push({
            item: this.state.sectionData[i].data[n],
            section: this.state.sectionData[i],
          })
        }
      }
    }
    return list
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
        userPath + ConstPath.RelativePath.Temp + 'MyExportTemplate.zip'
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
          SOnlineService.uploadFilebyType(toPath, fileName, 'UDB', {
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

  _renderMyModulePopupModal = () => {
    let data
    data = [
      {
        title: getLanguage(global.language).Profile.BATCH_DELETE,
        action: () => {
          this.setState({
            batchDelete: !this.state.batchDelete,
          })
        },
      },
    ]
    return (
      <MyDataPopupModal
        ref={ref => (this.MyModulePopModal = ref)}
        data={data}
        onCloseModal={this._closeModal}
      />
    )
  }

  _renderHeaderRight = () => {
    if (this.state.batchDelete) {
      return (
        <View style={styles.headerRightTextView}>
          <TouchableOpacity
            onPress={() => {
              this._deselectAll()
            }}
            style={styles.moreView}
          >
            <Text style={{ color: '#FBFBFB' }}>
              {getLanguage(global.language).Profile.DESELECT_ALL}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this._selectAll()
            }}
            style={styles.moreView}
          >
            <Text style={{ color: '#FBFBFB' }}>
              {getLanguage(global.language).Profile.SELECT_ALL}
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
    let moreImg = require('../../../../assets/home/Frenchgrey/icon_else_selected.png')
    return (
      <TouchableOpacity
        onPress={() => {
          this.MyModulePopModal.setVisible(true)
        }}
        style={styles.moreView}
      >
        <Image resizeMode={'contain'} source={moreImg} style={styles.moreImg} />
      </TouchableOpacity>
    )
  }

  _renderBottom = () => {
    return (
      <View style={styles.bottomStyle}>
        <TouchableOpacity
          onPress={() => {
            this._deselectAll()
            this.setState({
              batchDelete: !this.state.batchDelete,
            })
          }}
        >
          <Image
            style={{ height: scaleSize(40), width: scaleSize(40) }}
            source={require('../../../../assets/mapTools/icon_cancel_1.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this._batchDelete}>
          <Image
            style={{ height: scaleSize(40), width: scaleSize(40) }}
            source={require('../../../../assets/mapTools/icon_submit_black.png')}
          />
        </TouchableOpacity>
      </View>
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
          headerRight: this._renderHeaderRight(),
        }}
      >
        <SectionList
          initialNumToRender={20}
          ref={ref => (this.ref = ref)}
          renderItem={this._renderItem}
          sections={this.state.sectionData}
          keyExtractor={(item, index) => index.toString()}
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
        {this._renderMyModulePopupModal()}
        {this.state.batchDelete && this._renderBottom()}
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
  moreView: {
    height: '100%',
    marginRight: 10,
    // width: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImg: {
    flex: 1,
    height: scaleSize(40),
    width: scaleSize(40),
  },
  bottomStyle: {
    height: scaleSize(80),
    paddingHorizontal: scaleSize(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopColor: '#A0A0A0',
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  headerRightTextView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
