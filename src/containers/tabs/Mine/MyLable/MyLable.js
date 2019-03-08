import React, { Component } from 'react'
import { FlatList, View, TouchableOpacity, Image, Text } from 'react-native'
import { ConstPath, ConstInfo } from '../../../../constants'
import { FileTools } from '../../../../native'
import { SMap, EngineType, SOnlineService } from 'imobile_for_reactnative'
import UserType from '../../../../constants/UserType'
import { Container } from '../../../../components'
import MyDataPopupModal from '../MyData/MyDataPopupModal'
import LableItem from './LableItem'
import { color } from '../../../../styles'
import { InputDialog } from '../../../../components/Dialog'
import { Toast } from '../../../../utils'
export default class MyLable extends Component {
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
    }
    this.uploadList = []
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    let userPath = await FileTools.appendingHomeDirectory(
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? ConstPath.CustomerPath
        : ConstPath.UserPath + this.props.user.currentUser.userName + '/',
    )
    let path = userPath + ConstPath.RelativePath.Lable + 'Lable.udb'
    let data = await SMap.getUDBName(path)
    this.setState({ data: data, udbPath: path })
  }

  _renderItem = ({ item, index }) => {
    return (
      <LableItem
        item={item}
        index={index}
        saveItemInfo={this.saveItemInfo}
        uploadListOfAdd={this.uploadListOfAdd}
        removeDataFromUpList={this.removeDataFromUpList}
      />
    )
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
      alias: 'Lable',
    })
    return result
  }

  uploadDialog = name => {
    this.dialog.setDialogVisible(false)
    Toast.show('上传中')
    this.upload(name)
  }

  upload = async name => {
    if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
      Toast.show('请登录')
      return
    }
    try {
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
          let fileName = name + '_标注'
          SOnlineService.uploadFile(targetPath, fileName, {
            onProgress: progress => {
              return progress
            },
            onResult: async () => {
              Toast.show(ConstInfo.SHARE_SUCCESS)
              FileTools.deleteFile(targetPath)
              FileTools.deleteFile(archivePath)
            },
          })
        }
      }
    } catch (error) {
      Toast.show('上传失败，请检查网络')
    }
  }

  _showMyDataPopupModal = () => {
    let data = [
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
          this.dialog.setDialogVisible(true)
        }}
      >
        <Image />
        <Text style={{ fontSize: 18, color: 'white' }}>{'上传'}</Text>
      </TouchableOpacity>
    )
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

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.state.title,
          withoutBack: false,
          navigation: this.props.navigation,
          headerRight: this.headerRight(),
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
      </Container>
    )
  }
}
