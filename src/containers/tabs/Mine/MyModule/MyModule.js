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
import { SOnlineService } from 'imobile_for_reactnative'
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

    let plottingData = await NativeMethod.getTemplates(
      user,
      ConstPath.Module.Plotting,
    )
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
        title: '标绘模板',
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
    this.setState({ modalIsVisible: true })
  }

  _showMyDataPopupModal = () => {
    let data
    if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
      data = [
        {
          title: getLanguage(global.language).Profile.DELETE_DATA,
          //'删除数据',
          action: async () => {
            try {
              let filePath = this.itemInfo.item.path.substring(
                0,
                this.itemInfo.item.path.lastIndexOf('/'),
              )
              let result = await FileTools.deleteFile(filePath)
              if (result) {
                this._closeModal()
                Toast.show('删除成功')
                this.getData()
              } else {
                Toast.show('删除失败')
              }
            } catch (error) {
              Toast.show('删除失败')
            }
          },
        },
      ]
    } else {
      data = [
        {
          title: getLanguage(global.language).Profile.SHARE,
          //''分享',
          action: async () => {
            this._closeModal()
            this.ModalBtns.setVisible(true)

            // let expListPath = userPath + ConstPath.RelativePath.Map
            // let expList=await FileTools.getPathListByFilter(expListPath, {extension: 'exp',type: 'file',})
            // for (let index = 0; index < expList.length; index++) {
            //   const element = expList[index];
            //   let expPath=await FileTools.appendingHomeDirectory(element.path)
            //   let result=await SMap.getExpJson(expPath)
            //   let Json=JSON.parse(result)
            //   if(Json.Template){
            //     let xmlPath=await FileTools.appendingHomeDirectory(ConstPath.UserPath+Json.Template)
            //     let fileName=Json.Template.substring(Json.Template.lastIndexOf('/')+1)
            //     if(this.itemInfo.item.name.indexOf(fileName)>-1){
            //       let name=element.name.substring(0,element.name.indexOf('.'))
            //       let workspacePath=userPath+ConstPath.RelativePath.ExternalData +ConstPath.RelativeFilePath.ExportData +name+'/'+name+".smwu"
            //       this.props.exportModule&&this.props.exportModule({ maps: [name], outPath: workspacePath, isOpenMap: true ,xmlPath:xmlPath}).then((result)=>{
            //           this.container.setLoading(false)
            //           Toast.show("分享成功")
            //         },()=>{
            //           Toast.show("分享失败")
            //         })
            //       break
            //     }
            //   }
            // }
          },
        },
        {
          title: getLanguage(global.language).Profile.DELETE_DATA,
          //'删除数据',
          action: async () => {
            try {
              let filePath = await FileTools.appendingHomeDirectory(
                this.itemInfo.item.path,
              )

              let result = await FileTools.deleteFile(filePath)
              if (result) {
                this._closeModal()
                Toast.show('删除成功')
                this.getData()
              } else {
                Toast.show('删除失败')
              }
            } catch (error) {
              Toast.show('删除失败')
            }
          },
        },
      ]
    }
    return (
      <MyDataPopupModal
        // onDeleteData={this._onDeleteData}
        data={data}
        onCloseModal={this._closeModal}
        modalVisible={this.state.modalIsVisible}
      />
    )
  }

  shareData = async type => {
    try {
      this.ModalBtns.setVisible(false)
      this.container.setLoading(true, '正在分享')
      let fromPath = this.itemInfo.item.path.substring(
        0,
        this.itemInfo.item.path.lastIndexOf('/'),
      )
      let userPath = await FileTools.appendingHomeDirectory(
        this.props.user.currentUser.userType === UserType.PROBATION_USER
          ? ConstPath.CustomerPath
          : ConstPath.UserPath + this.props.user.currentUser.userName + '/',
      )
      let toPath =
        userPath +
        ConstPath.RelativePath.ExternalData +
        ConstPath.RelativeFilePath.ExportData +
        this.itemInfo.item.name +
        '.zip'
      // console.warn(fromPath, toPath)
      let result = await FileTools.zipFile(fromPath, toPath)
      if (result) {
        // console.warn(result, '!!!!!!!')
        let fileName = this.itemInfo.item.name
        if (type === 'weChat') {
          GLOBAL.shareFilePath = toPath
          appUtilsModule
            .sendFileOfWechat({
              filePath: toPath,
              title: fileName + '.zip',
              description: 'SuperMap iTablet',
            })
            .then(
              result => {
                !result && Toast.show('所分享文件超过10MB')
                !result && FileTools.deleteFile(toPath)
                this.ModalBtns.setVisible(false)
              },
              () => {
                Toast.show('分享失败')
                this.container.setLoading(false)
                FileTools.deleteFile(toPath)
              },
            )
        } else if (type === 'online') {
          SOnlineService.uploadFile(toPath, fileName, {
            onResult: () => {
              Toast.show('分享成功')
              FileTools.deleteFile(toPath)
              this.container.setLoading(false)
              this.ModalBtns.setVisible(false)
            },
          })
        } else if (this.chatCallBack) {
          this.container.setLoading(false)
          this.chatCallBack && this.chatCallBack(toPath)
          NavigationService.goBack()
        }
      }
    } catch (error) {
      // console.warn(error)
      Toast.show('分享失败')
    }
  }

  renderDiaolog = () => {
    return (
      <InputDialog
        ref={ref => (this.dialog = ref)}
        placeholder={'请输入数据名称'}
        confirmAction={() => {
          this.uploadDialog(this.dialog.state.value)
        }}
        confirmBtnTitle={'上传'}
        cancelBtnTitle={'取消'}
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
          actionOfOnline={() => this.shareData('online')}
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
