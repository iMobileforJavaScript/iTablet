import React, { Component } from 'react'
import {
  FlatList,
  View,
  TouchableOpacity,
  Image,
  Text,
  NativeModules,
  RefreshControl,
  StyleSheet,
} from 'react-native'
import { ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'
import {
  SMap,
  EngineType,
  SOnlineService,
  SIPortalService,
} from 'imobile_for_reactnative'
import UserType from '../../../../constants/UserType'
import { Container } from '../../../../components'
import MyDataPopupModal from '../MyData/MyDataPopupModal'
import { color } from '../../../../styles'
import { InputDialog } from '../../../../components/Dialog'
import { Toast, scaleSize } from '../../../../utils'
import ModalBtns from '../MyModule/ModalBtns'
import { getLanguage } from '../../../../language/index'
import { MineItem } from '../component'
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
      isRefreshing: false,
      batchDelete: false,
    }
    this.uploadList = []
    this.uploadType = null
  }

  componentDidMount() {
    this.container.setLoading(true, getLanguage(global.language).Prompt.LOADING)
    this.getData()
  }

  getData = async () => {
    let userPath = await FileTools.appendingHomeDirectory(
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? ConstPath.CustomerPath
        : ConstPath.UserPath + this.props.user.currentUser.userName + '/',
    )
    let path =
      userPath +
      ConstPath.RelativePath.Datasource +
      'Label_' +
      this.props.user.currentUser.userName +
      '#.udb'
    let result = await FileTools.fileIsExist(path)
    if (!result) {
      this.creatDatasource(path)
    }
    let data = await SMap.getUDBNameOfLabel(path)
    this.setState({ data: data, udbPath: path }, () => {
      this.container.setLoading(false)
    })
  }

  _renderItem = ({ item, index }) => {
    let img = require('../../../../assets/Mine/mine_my_online_data_black.png')
    return (
      <MineItem
        item={item}
        image={img}
        text={item.title}
        disableTouch={this.state.batchDelete || this.state.showselect}
        showCheck={this.state.batchDelete || this.state.showselect}
        onPressMore={() => {
          this.saveItemInfo({ item, index })
        }}
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
    this.setState({ modalIsVisible: false }, () => {
      this.MyDataPopModal.setVisible(false)
      this.MyLabelPopModal.setVisible(false)
    })
  }

  saveItemInfo = ({ item, index }) => {
    this.itemInfo = { item, index }
    this.setState({ modalIsVisible: true }, () => {
      this.MyDataPopModal.setVisible(true)
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
        await SMap.removeDatasetByName(this.state.udbPath, deleteArr[i])
      }
      this.getData()
      Toast.show(getLanguage(global.language).Prompt.DELETED_SUCCESS)
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.FAILED_TO_DELETE)
    }
  }

  _selectAll = () => {
    let datasets = Object.assign([], this.state.data)
    for (let i = 0; i < datasets.length; i++) {
      datasets[i].checked = true
    }
    this.setState({ datasets })
  }

  _deseleteAll = () => {
    let datasets = Object.assign([], this.state.data)
    for (let i = 0; i < datasets.length; i++) {
      datasets[i].checked = false
    }
    this.setState({ datasets })
  }

  _getSelectedList = () => {
    let list = []
    for (let i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].checked === true) {
        list.push(this.state.data[i].title)
      }
    }
    return list
  }

  creatDatasource = async datasourcePath => {
    let result = await SMap.createDatasourceOfLabel({
      server: datasourcePath,
      engineType: EngineType.UDB,
      alias: 'Label_' + this.props.user.currentUser.userName + '#',
      description: 'Label',
    })
    return result
  }

  uploadDialog = name => {
    if (name === null || name === '') {
      Toast.show(getLanguage(global.language).Prompt.ENTER_DATA_NAME)
      //'请输入数据名称')
      return
    }
    this.dialog.setDialogVisible(false)
    this.upload(name)
  }

  upload = async name => {
    // if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
    //   Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN_AND_SHARE)
    //   //'请登录')
    //   return
    // }
    try {
      // this.container.setLoading(true, '正在分享')
      Toast.show(getLanguage(global.language).Prompt.SHARING)
      //'正在分享')
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
          userPath + ConstPath.RelativePath.ExternalData + 'MyExportLable.zip'
        await SMap.copyDataset(
          datasourcePath,
          todatasourcePath,
          this.uploadList,
        )
        let zipResult = await FileTools.zipFile(archivePath, targetPath)
        if (zipResult) {
          let fileName = name + '_标注.zip'
          if (this.uploadType === 'weChat') {
            appUtilsModule
              .sendFileOfWechat({
                filePath: targetPath,
                title: fileName,
                description: 'SuperMap iTablet',
              })
              .then(
                result => {
                  this.container.setLoading(false)
                  !result &&
                    Toast.show(getLanguage(global.language).Prompt.SHARE_FAILED)
                  //'分享失败')
                  !result && FileTools.deleteFile(targetPath)
                },
                () => {
                  this.container.setLoading(false)
                  Toast.show(getLanguage(global.language).Prompt.SHARE_FAILED)
                  //'分享失败')
                  FileTools.deleteFile(targetPath)
                },
              )
          } else if (this.uploadType === 'online') {
            SOnlineService.uploadFile(targetPath, name, {
              onProgress: progress => {
                return progress
              },
              onResult: async () => {
                Toast.show(getLanguage(global.language).Prompt.SHARE_SUCCESS)
                //'分享成功')
                this.container.setLoading(false)
                FileTools.deleteFile(targetPath)
                FileTools.deleteFile(archivePath)
              },
            })
          } else if (this.uploadType === 'iportal') {
            let uploadResult = await SIPortalService.uploadData(
              targetPath,
              fileName,
            )
            uploadResult
              ? Toast.show(getLanguage(global.language).Prompt.SHARE_SUCCESS)
              : Toast.show(getLanguage(global.language).Prompt.SHARE_FAILED)
            this.container.setLoading(false)
            FileTools.deleteFile(targetPath)
            FileTools.deleteFile(archivePath)
          }
        }
      }
      this._deseleteAll()
    } catch (error) {
      this._deseleteAll()
      Toast.show('分享失败')
      this.container.setLoading(false)
    }
  }

  _renderMyLabelPopupModal = () => {
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
        ref={ref => (this.MyLabelPopModal = ref)}
        data={data}
        onCloseModal={this._closeModal}
      />
    )
  }

  _showMyDataPopupModal = () => {
    let data = [
      {
        title: getLanguage(global.language).Profile.UPLOAD_MARK,
        //'分享',
        action: () => {
          this._closeModal()
          this.ModalBtns.setVisible(true)
          this.setState({ showselect: true })
        },
      },
      {
        title: getLanguage(global.language).Profile.DELETE_MARK,
        //'删除数据',
        action: () => {
          SMap.removeDatasetByName(
            this.state.udbPath,
            this.itemInfo.item.title,
          ).then(() => {
            this._closeModal()
            Toast.show(getLanguage(global.language).Prompt.DELETED_SUCCESS)
            //'删除成功')
            let newData = JSON.parse(JSON.stringify(this.state.data)) //[...this.state.data]
            newData.splice(this.itemInfo.index, 1)
            this.setState({ data: newData }, () => {})
          })
        },
      },
    ]
    return (
      <MyDataPopupModal
        // onDeleteData={this._onDeleteData}
        ref={ref => (this.MyDataPopModal = ref)}
        data={data}
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
            Toast.show(
              getLanguage(global.language).Prompt.SELECT_DATASET_TO_SHARE,
            )
            //'请选择要分享的数据集')
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
        placeholder={getLanguage(global.language).Prompt.ENTER_DATA_NAME}
        // {'请输入数据名称'}
        confirmAction={() => {
          this.setState({ showselect: false })
          this.uploadDialog(this.dialog.state.value)
        }}
        cancelAction={() => {
          this.dialog.setDialogVisible(false)
          this._deseleteAll()
          this.setState({ showselect: false })
        }}
        confirmBtnTitle={getLanguage(global.language).Prompt.SHARE}
        //{'分享'}
        cancelBtnTitle={getLanguage(global.language).Prompt.CANCEL}
        //{'取消'}
      />
    )
  }

  _renderHeaderRight = () => {
    if (this.state.batchDelete || this.state.showselect) {
      return (
        <TouchableOpacity
          onPress={() => {
            this._selectAll()
          }}
          style={styles.moreView}
        >
          <Text style={{ color: '#F0F0F0' }}>
            {getLanguage(global.language).Profile.SELECT_ALL}
          </Text>
        </TouchableOpacity>
      )
    }
    let moreImg = require('../../../../assets/home/Frenchgrey/icon_else_selected.png')
    return (
      <TouchableOpacity
        onPress={() => {
          this.MyLabelPopModal.setVisible(true)
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
            this._deseleteAll()
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
        <FlatList
          initialNumToRender={20}
          ref={ref => (this.ref = ref)}
          renderItem={this._renderItem}
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: color.separateColorGray,
                flex: 1,
                height: 1,
              }}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                try {
                  this.setState({ isRefreshing: true })
                  this.getData().then(() => {
                    this.setState({ isRefreshing: false })
                  })
                } catch (error) {
                  Toast.show('刷新失败')
                }
              }}
              colors={['orange', 'red']}
              titleColor={'orange'}
              tintColor={'orange'}
              title={'刷新中...'}
              enabled={true}
            />
          }
        />
        {this._renderMyLabelPopupModal()}
        {this._showMyDataPopupModal()}
        {this.renderDiaolog()}
        {this.state.batchDelete && this._renderBottom()}
        <ModalBtns
          ref={ref => {
            this.ModalBtns = ref
          }}
          actionOfOnline={
            UserType.isOnlineUser(this.props.user.currentUser)
              ? () => {
                this.uploadList = this._getSelectedList()
                if (this.uploadList.length > 0) {
                  this.dialog.setDialogVisible(true)
                  this.ModalBtns.setVisible(false)
                  this.uploadType = 'online'
                } else {
                  Toast.show(
                    getLanguage(global.language).Prompt
                      .SELECT_DATASET_TO_SHARE,
                  )
                  //'请选择要分享的数据集')
                }
              }
              : undefined
          }
          actionOfIPortal={
            UserType.isIPortalUser(this.props.user.currentUser)
              ? () => {
                this.uploadList = this._getSelectedList()
                if (this.uploadList.length > 0) {
                  this.dialog.setDialogVisible(true)
                  this.ModalBtns.setVisible(false)
                  this.uploadType = 'iportal'
                } else {
                  Toast.show(
                    getLanguage(global.language).Prompt
                      .SELECT_DATASET_TO_SHARE,
                  )
                }
              }
              : undefined
          }
          actionOfWechat={() => {
            this.uploadList = this._getSelectedList()
            if (this.uploadList.length > 0) {
              this.dialog.setDialogVisible(true)
              this.ModalBtns.setVisible(false)
              this.uploadType = 'weChat'
            } else {
              Toast.show(
                getLanguage(global.language).Prompt.SELECT_DATASET_TO_SHARE,
              )
              //'请选择要分享的数据集')
            }
          }}
          cancel={() => {
            this.uploadList = []
            this._deseleteAll()
            this.setState({ showselect: false })
          }}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
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
})
