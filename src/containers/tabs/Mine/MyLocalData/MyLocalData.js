import React, { Component } from 'react'
import {
  View,
  Text,
  SectionList,
  AsyncStorage,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native'
import { Container } from '../../../../components'
//eslint-disable-next-line
import { SOnlineService, SScene } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import LocalDataPopupModal from './LocalDataPopupModal'
import { color } from '../../../../styles'
import UserType from '../../../../constants/UserType'
import { getLanguage } from '../../../../language/index'
import LocalDataItem from './LocalDataItem'
import {
  _constructCacheSectionData,
  _constructUserSectionData,
  _constructCustomerSectionData,
  getOnlineData,
  downFileAction,
} from './Method'
import LocalDtaHeader from './LocalDataHeader'
import OnlineDataItem from './OnlineDataItem'
import { scaleSize } from '../../../../utils'
export default class MyLocalData extends Component {
  props: {
    language: String,
    user: Object,
    navigation: Object,
    down: Object,
    importWorkspace: () => {},
    importSceneWorkspace: () => {},
    updateDownList: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      sectionData: [],
      userName: this.props.navigation.getParam('userName', ''),
      modalIsVisible: false,
      isFirstLoadingModal: true,
      textDisplay: 'none',
      isRefreshing: false,
      activityShow: false,
    }
    this.pageSize = 10
    this.dataListTotal = null
    this.currentPage = 1
    this.deleteDataing = false
  }
  componentDidMount() {
    this._setSectionDataState3()
    if (Platform.OS === 'android') {
      SOnlineService.getAndroidSessionID().then(cookie => {
        this.cookie = cookie
      })
    }
  }

  _setSectionDataState3 = async () => {
    try {
      this.container.setLoading(true)
      let cacheSectionData = await _constructCacheSectionData(
        this.props.language,
      )
      this.setState({
        sectionData: cacheSectionData,
        textDisplay: 'none',
      })

      let userData
      if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
        userData = []
      } else {
        userData = await _constructUserSectionData(this.state.userName)
      }
      // this.setState({ sectionData: userSectionData })
      let customerSectionData = await _constructCustomerSectionData()
      // let qqData = await _constructTecentOfQQ()
      // let weixinData = await _constructTecentOfweixin()
      let online = {}
      if (this.props.user.currentUser.userType === UserType.PROBATION_USER) {
        online = {
          title: '在线数据',
          data: [],
          isShowItem: true,
          dataType: 'online',
        }
      } else {
        this.currentPage = 1
        let onlineData = await getOnlineData(
          this.currentPage,
          this.pageSize,
          result => {
            this.dataListTotal = result
          },
        )
        if (onlineData.length > 0) {
          online = {
            title: '在线数据',
            data: onlineData,
            isShowItem: true,
            dataType: 'online',
          }
        } else {
          Toast.show('网络请求失败')
        }
      }
      let newData = userData.concat(customerSectionData)
      let newSectionData = cacheSectionData.concat([
        {
          //'外部数据'
          title: getLanguage(this.props.language).Profile.ON_DEVICE,
          data: newData,
          isShowItem: true,
        },
        online,
      ])
      this.setState(
        {
          sectionData: newSectionData,
        },
        () => {
          this.setLoading(false)
        },
      )
    } catch (e) {
      this.setLoading(false)
      this.setState({ textDisplay: 'none' })
    }
  }

  changgeHearShowItem = title => {
    let sectionData = [...this.state.sectionData]
    for (let i = 0; i < sectionData.length; i++) {
      let data = sectionData[i]
      if (data.title === title) {
        if (data.title === getLanguage(this.props.language).Profile.ON_DEVICE) {
          sectionData[sectionData.length - 1].isShowItem = !data.isShowItem
        }
        data.isShowItem = !data.isShowItem
        break
      }
    }
    this.setState({ sectionData: sectionData })
  }

  itemOnpress = info => {
    this.itemInfo = info
    if (this.state.isFirstLoadingModal) {
      this.setState({ modalIsVisible: true, isFirstLoadingModal: false })
    } else {
      this.setState({ modalIsVisible: true })
    }
  }

  onlineItemOnPress = (item = {}) => {
    this.itemInfo = item
    if (this.state.isFirstLoadingModal) {
      this.setState({ modalIsVisible: true, isFirstLoadingModal: false })
    } else {
      this.setState({ modalIsVisible: true })
    }
  }

  _renderSectionHeader = info => {
    if (info.section.title === '在线数据') {
      return <View />
    }
    return (
      <LocalDtaHeader
        info={info}
        changgeHearShowItem={this.changgeHearShowItem}
      />
    )
  }

  _renderItem = info => {
    if (info.section.title === '在线数据') {
      if (!info.section.data.length > 0) {
        return <View />
      }
      return (
        <OnlineDataItem
          item={info.item}
          itemOnPress={this.onlineItemOnPress}
          down={this.props.down}
          updateDownList={this.props.updateDownList}
          index={info.index}
        />
      )
    } else {
      return <LocalDataItem info={info} itemOnpress={this.itemOnpress} />
    }
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
      this.setLoading(
        true,
        //'删除数据中...'
        getLanguage(this.props.language).Prompt.DELETING,
      )
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
          Toast.show(
            //'删除成功'
            getLanguage(this.props.language).Prompt.DELETED_SUCCESS,
          )
          let sectionData = [...this.state.sectionData]
          for (let i = 0; i < sectionData.length; i++) {
            let data = sectionData[i]
            if (data.title === this.itemInfo.section.title) {
              data.data.splice(this.itemInfo.index, 1)
              //'外部数据'
              if (
                data.title ===
                getLanguage(this.props.language).Profile.ON_DEVICE
              ) {
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
      Toast.show(
        //'删除失败')
        getLanguage(this.props.language).Prompt.FAILED_TO_DELETE,
      )
      this._closeModal()
    } finally {
      this.setLoading(false)
    }
  }

  _onImportWorkspace = async () => {
    try {
      this._closeModal()
      if (this.itemInfo !== undefined) {
        this.setLoading(
          true,
          //ConstInfo.DATA_IMPORTING
          getLanguage(this.props.language).Prompt.IMPORTING_DATA,
        )
        let filePath = this.itemInfo.item.filePath
        let is3D = await SScene.is3DWorkspace({ server: filePath })
        if (is3D === true) {
          let result = await this.props.importSceneWorkspace({
            server: filePath,
          })
          if (result === true) {
            Toast.show(
              getLanguage(this.props.language).Prompt.IMPORTED_3D_SUCCESS,
            )
          } else {
            Toast.show(
              getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT_3D,
            )
          }
        } else {
          let result = await this.props.importWorkspace({ path: filePath })
          if (result.msg !== undefined) {
            Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
          } else {
            Toast.show(getLanguage(this.props.language).Prompt.IMPORTED_SUCCESS)
          }
        }
        this.setLoading(false)
      }
    } catch (e) {
      this.setLoading(false)
      Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_IMPORT)
      this._closeModal()
    }
  }

  importData = async () => {
    this._closeModal()
    if (this.itemInfo.id) {
      downFileAction(
        this.props.down,
        this.itemInfo,
        this.props.user.currentUser.userName,
        this.cookie,
        this.props.updateDownList,
        this.props.importWorkspace,
      )
    } else {
      this._onImportWorkspace()
    }
  }

  deleteData = async () => {
    this._closeModal()
    if (this.itemInfo.id) {
      this.deleteDataOfOnline()
    } else {
      this._onDeleteData()
    }
  }

  deleteDataOfOnline = async () => {
    this.setLoading(true, '删除数据中...')
    this.setState({ modalIsVisible: false })
    this.deleteDataing = true
    try {
      let objContent = this.itemInfo
      let dataId = objContent.id + ''
      let result = await SOnlineService.deleteDataWithDataId(dataId)
      if (typeof result === 'boolean' && result) {
        let sectionData = JSON.parse(JSON.stringify(this.state.sectionData)) // [...this.state.sectionData]
        let oldOnline = sectionData[sectionData.length - 1]
        oldOnline.data.splice(this.itemInfo.index, 1)
        this.setState({ sectionData }, () => {
          Toast.show('数据删除成功')
          this.deleteDataing = false
        })
      } else {
        this.deleteDataing = false
        Toast.show('数据删除失败')
      }
    } catch (e) {
      this.deleteDataing = false
      Toast.show('网络错误')
    } finally {
      this.setLoading(false)
    }
  }

  _showLocalDataPopupModal = () => {
    if (!this.state.isFirstLoadingModal) {
      return (
        <LocalDataPopupModal
          language={this.props.language}
          onDeleteData={this.deleteData}
          onImportWorkspace={this.importData}
          onCloseModal={this._closeModal}
          modalVisible={this.state.modalIsVisible}
        />
      )
    }
  }

  setLoading = (visible, info) => {
    this.container && this.container.setLoading(visible, info)
  }

  _onLoadData = async () => {
    try {
      //防止data为空时调用
      //数据删除时不调用
      if (this.state.activityShow) return
      let section = this.state.sectionData[this.state.sectionData.length - 1]
      if (section.title !== '在线数据') return
      if (
        section.dataType &&
        section.dataType === 'online' &&
        section.data.length < 10
      )
        return
      if (
        this.dataListTotal &&
        this.state.sectionData[this.state.sectionData.length - 1].data.length >=
          this.dataListTotal
      )
        return
      //构建新数据

      this.setState({ activityShow: true })
      let sectionData = [...this.state.sectionData]
      let oldOnlineData = sectionData[sectionData.length - 1]
      let oldData = oldOnlineData.data
      sectionData.splice(sectionData.length - 1, 1)
      this.currentPage = this.currentPage + 1
      let data = await getOnlineData(this.currentPage, 10)
      if (data.length > 1) {
        let newData = oldData.concat(data)
        let online = {
          title: '在线数据',
          data: newData,
          isShowItem: true,
          dataType: 'online',
        }
        sectionData.push(online)
        this.setState({ sectionData: sectionData, activityShow: false })
      } else {
        this.currentPage = this.currentPage - 1
        Toast.show('网络异常')
        this.setState({ activityShow: false })
        // this.currentPage=this.currentPage-1
        // this._onLoadData()
      }
    } catch (error) {
      this.setState({ activityShow: false })
      Toast.show('网络异常')
    }
  }

  renderItemSeparatorComponent = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
  }

  renderActivityIndicator = () => {
    if (this.state.activityShow) {
      return (
        <View
          style={{
            flexDirection: 'column',
            flex: 1,
            marginTop: scaleSize(10),
            alignItems: 'center',
          }}
        >
          <ActivityIndicator animating={true} color="#4680DF" size="large" />
          <Text style={{ fontSize: scaleSize(20) }}>{'数据加载中...'}</Text>
        </View>
      )
    } else {
      return <View />
    }
  }

  render() {
    // console.log(this.state.sectionData)
    let sectionData = this.state.sectionData
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          // '导入'
          title: getLanguage(this.props.language).Profile.IMPORT,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <SectionList
          style={{
            flex: 1,
          }}
          sections={sectionData}
          keyExtractor={this._keyExtractor}
          renderSectionHeader={this._renderSectionHeader}
          // ItemSeparatorComponent={this.renderItemSeparatorComponent}
          renderItem={this._renderItem}
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
          onEndReached={this._onLoadData}
          onEndReachedThreshold={0.5}
          ListFooterComponent={this.renderActivityIndicator()}
        />
        {this._showLocalDataPopupModal()}
      </Container>
    )
  }
}
