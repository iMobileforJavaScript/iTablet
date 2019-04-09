import React, { Component } from 'react'
import {
  FlatList,
  View,
  TouchableOpacity,
  Image,
  Text,
  NativeModules,
} from 'react-native'
import { ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import { SMap, EngineType, SOnlineService } from 'imobile_for_reactnative'
import UserType from '../../../../constants/UserType'
import { Container } from '../../../../components'
import MyDataPopupModal from '../MyData/MyDataPopupModal'
import LabelItem from './LabelItem'
import { color } from '../../../../styles'
import { InputDialog } from '../../../../components/Dialog'
import { Toast } from '../../../../utils'
import ModalBtns from '../MyModule/ModalBtns'
const appUtilsModule = NativeModules.AppUtils
export default class MyLabel extends Component {
  props: {
    user: any,
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      data: [],
      title: params.title,
      modalIsVisible: false,
      udbPath: '',
      showselect: false,
    }
    this.uploadList = []
    this.uploadType = null
  }

  componentDidMount() {
    this.container.setLoading(true)
    this.getData()
  }

  getData = async () => {
    let userPath = await FileTools.appendingHomeDirectory(
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? ConstPath.CustomerPath
        : ConstPath.UserPath + this.props.user.currentUser.userName + '/',
    )
    let path = userPath + ConstPath.RelativePath.Label + 'Label.udb'
    let data = await SMap.getUDBName(path)
    this.setState({ data: data, udbPath: path }, () => {
      this.container.setLoading(false)
    })
  }

  _renderItem = ({ item, index }) => {
    return (
      <LabelItem
        item={item}
        index={index}
        saveItemInfo={this.saveItemInfo}
        uploadListOfAdd={this.uploadListOfAdd}
        removeDataFromUpList={this.removeDataFromUpList}
        getShowSelect={this.getShowSelect}
      />
    )
  }

  getShowSelect = () => {
    return this.state.showselect
  }

  _keyExtractor = index => {
    return index
  }

  _closeModal = () => {
    this.setState({ modalIsVisible: false })
  }

  saveItemInfo = ({ item, index }) => {
    this.itemInfo = { item, index }
    this.setState({ modalIsVisible: true })
  }

  uploadListOfAdd = data => {
    this.uploadList.push(data)
  }

  removeDataFromUpList = data => {
    let index = this.uploadList.indexOf(data)
    if (index === -1) return
    this.uploadList.splice(index, 1)
  }

  creatDatasource = async datasourcePath => {
    let result = await SMap.createDatasource({
      server: datasourcePath,
      engineType: EngineType.UDB,
      alias: 'labelDatasource',
      description: 'Label',
    })
    return result
  }

  uploadDialog = name => {
    this.dialog.setDialogVisible(false)
    Toast.show('分享中')
    this.upload(name)
  }

  upload = async name => {
    if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
      Toast.show('请登录')
      return
    }
    try {
      this.container.setLoading(true, '正在分享')
      let userPath = await FileTools.appendingHomeDirectory(
        this.props.user.currentUser.userType === UserType.PROBATION_USER
          ? ConstPath.CustomerPath
          : ConstPath.UserPath + this.props.user.currentUser.userName + '/',
      )
      let datasourcePath = this.state.udbPath
      let todatasourcePath =
        userPath +
        ConstPath.RelativePath.ExternalData +
        name +
        '/' +
        name +
        '.udb'
      let result = this.creatDatasource(todatasourcePath)
      if (result) {
        let archivePath, targetPath
        archivePath = userPath + ConstPath.RelativePath.ExternalData + name
        targetPath =
          userPath + ConstPath.RelativePath.ExternalData + name + '_标注.zip'
        await SMap.copyDataset(
          datasourcePath,
          todatasourcePath,
          this.uploadList,
        )
        let zipResult = await FileTools.zipFile(archivePath, targetPath)
        if (zipResult) {
          let fileName = name + '_标注.zip'
          if (this.uploadType === 'weChat') {
            GLOBAL.shareFilePath = targetPath
            appUtilsModule
              .sendFileOfWechat({
                filePath: targetPath,
                title: fileName,
                description: 'SuperMap iTablet',
              })
              .then(
                result => {
                  this.container.setLoading(false)
                  !result && Toast.show('所分享文件超过10MB')
                  !result && FileTools.deleteFile(targetPath)
                },
                () => {
                  this.container.setLoading(false)
                  Toast.show('分享失败')
                  FileTools.deleteFile(targetPath)
                },
              )
          } else {
            SOnlineService.uploadFile(targetPath, fileName, {
              onProgress: progress => {
                return progress
              },
              onResult: async () => {
                Toast.show('分享成功')
                this.container.setLoading(false)
                FileTools.deleteFile(targetPath)
                FileTools.deleteFile(archivePath)
              },
            })
          }
        }
      }
    } catch (error) {
      Toast.show('分享失败，请检查网络')
      this.container.setLoading(false)
    }
  }

  _showMyDataPopupModal = () => {
    let data = [
      {
        title: '分享',
        action: () => {
          this._closeModal()
          this.ModalBtns.setVisible(true)
          this.setState({ showselect: true })
        },
      },
      {
        title: '删除数据',
        action: () => {
          SMap.removeDatasetByName(this.state.udbPath, this.itemInfo.item.title)
        },
      },
    ]
    return (
      <MyDataPopupModal
        // onDeleteData={this._onDeleteData}
        data={data}
        onCloseModal={this._closeModal}
        modalVisible={this.state.modalIsVisible}
      />
    )
  }

  headerRight = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.uploadList.length > 0) {
            this.dialog.setDialogVisible(true)
          } else {
            Toast.show('请选择要分享的数据集')
          }
        }}
      >
        <Image />
        <Text style={{ fontSize: 18, color: 'white' }}>{'分享'}</Text>
      </TouchableOpacity>
    )
  }

  renderDiaolog = () => {
    return (
      <InputDialog
        ref={ref => (this.dialog = ref)}
        placeholder={'请输入数据名称'}
        confirmAction={() => {
          this.setState({ showselect: false })
          this.uploadDialog(this.dialog.state.value)
        }}
        cancelAction={() => {
          this.dialog.setDialogVisible(false)
          this.setState({ showselect: false })
        }}
        confirmBtnTitle={'上传'}
        cancelBtnTitle={'取消'}
      />
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
        <FlatList
          initialNumToRender={20}
          ref={ref => (this.ref = ref)}
          renderItem={this._renderItem}
          data={this.state.data}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: color.separateColorGray,
                flex: 1,
                height: 1,
              }}
            />
          )}
        />
        {this._showMyDataPopupModal()}
        {this.renderDiaolog()}
        <ModalBtns
          ref={ref => {
            this.ModalBtns = ref
          }}
          actionOfOnline={() => {
            if (this.uploadList.length > 0) {
              this.dialog.setDialogVisible(true)
              this.ModalBtns.setVisible(false)
              this.uploadType = 'online'
            } else {
              Toast.show('请选择要分享的数据集')
            }
          }}
          actionOfWechat={() => {
            if (this.uploadList.length > 0) {
              this.dialog.setDialogVisible(true)
              this.ModalBtns.setVisible(false)
              this.uploadType = 'weChat'
            } else {
              Toast.show('请选择要分享的数据集')
            }
          }}
          cancel={() => {
            this.setState({ showselect: false })
          }}
        />
      </Container>
    )
  }
}
