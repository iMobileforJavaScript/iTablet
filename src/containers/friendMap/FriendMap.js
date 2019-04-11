/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import Container from '../../components/Container'
import { View, Text, FlatList, RefreshControl, Dimensions } from 'react-native'
import RenderFindItem from './RenderFindItem'
import { Toast, scaleSize } from '../../utils'
// import { InfoView } from '../../components'
import styles from './Styles'
import color from '../../styles/color'
import FetchUtils from '../../utils/FetchUtils'
import { SOnlineService } from 'imobile_for_reactnative'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import FriendListFileHandle from '../tabs/Friend/FriendListFileHandle'
import RNFS from 'react-native-fs'
export default class FriendMap extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.state = {
      data: [{}],
      isRefresh: false,
      progressWidth: this.screenWidth * 0.4,
      isLoadingData: false,
    }
    this.loadCount = 1
    this.flatListData = []
    this.allUserDataCount = -1
    this.currentLoadDataCount = 0
    this.friendList = []
  }
  componentDidMount() {
    // this._loadFirstUserData()
    this.currentLoadPage2 = 1
    let data = []
    if (this.props.user.users.length > 1) {
      this.getContacts()
    }
    this._loadFirstUserData2(this.currentLoadPage2, 100, data)
  }
  componentWillUnmount() {
    this._clearInterval()
    this.savefriendMap()
  }
  _clearInterval = () => {
    if (this.objProgressWidth !== undefined) {
      clearInterval(this.objProgressWidth)
      this.setState({ progressWidth: '100%' })
    }
  }

  savefriendMap = async () => {
    if (this.state.length < 1) return
    let data = JSON.stringify(this.state.data)
    let path =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      'friendMap.txt'
    RNFS.writeFile(path, data, 'utf8')
      .then(() => {})
      .catch(() => {})
  }

  _loadFirstUserData2 = async (currentPage, totalPage) => {
    try {
      await SOnlineService.syncAndroidCookie()
      let path =
        (await FileTools.getHomeDirectory()) +
        ConstPath.UserPath +
        this.props.user.currentUser.userName +
        '/' +
        ConstPath.RelativePath.Temp +
        'friendMap.txt'
      let exist = await FileTools.fileIsExist(path)
      if (exist) {
        let result = await RNFS.readFile(path)
        if (result) {
          let data = JSON.parse(result)
          let mapList = []
          //  console.log(data)
          if (data.length < 1) {
            this._showLoadProgressView()
            let data = await this.getCurrentLoadData2(currentPage, totalPage)
            this.setState({ data: data })
            this._clearInterval()
          } else {
            for (let index = 0; index < data.length; index++) {
              const element = data[index]
              let dataId = element.id
              let dataUrl =
                'https://www.supermapol.com/web/datas/' + dataId + '.json'
              // 'https://www.supermapol.com/web/datas/1916243026.json'
              let objDataJson = await FetchUtils.getObjJson(dataUrl)
              if (objDataJson) {
                if (objDataJson[0].serviceType === 'RESTMAP') {
                  mapList.push(element)
                }
              }
            }
            this.setState({ data: mapList })
            this._clearInterval()
          }
        }
      } else {
        this._showLoadProgressView()
        let data = await this.getCurrentLoadData2(currentPage, totalPage)
        // let objUserData = await this.getAllUserZipData(12)
        this.setState({ data: data })
        this._clearInterval()
      }
    } catch (e) {
      this._clearInterval()
    }
  }

  getContacts = async () => {
    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + this.props.user.currentUser.userName,
    )
    let srcFriendData = []
    await FriendListFileHandle.getContacts(userPath, 'friend.list', results => {
      if (results) {
        let result = results.userInfo
        for (let key in result) {
          if (result[key].id && result[key].name) {
            let frend = {}
            frend['id'] = result[key].id
            frend['markName'] = result[key].markName
            frend['name'] = result[key].name
            frend['info'] = result[key].info
            srcFriendData.push(result[key].name)
          }
        }
      }
    })
    this.friendList = srcFriendData
  }

  getCurrentLoadData2 = async (currentPage, totalPage) => {
    await SOnlineService.syncAndroidCookie()
    let data = []
    while (currentPage <= totalPage) {
      await this._loadUserData2(currentPage, data)
      if (data.length >= 1) {
        break
      }
      currentPage = currentPage + 1
      this.currentLoadPage2 = currentPage
    }
    return data
  }

  _loadFirstUserData = async () => {
    try {
      this._showLoadProgressView()
      await this._loadUserData(1)
    } finally {
      this._clearInterval()
    }
  }
  _showLoadProgressView = () => {
    this.objProgressWidth = setInterval(() => {
      let prevProgressWidth = this.state.progressWidth
      let currentPorWidth
      if (prevProgressWidth >= this.screenWidth - 300) {
        currentPorWidth = prevProgressWidth + 1
        if (currentPorWidth >= this.screenWidth - 50) {
          currentPorWidth = this.screenWidth - 50
          return
        }
      } else {
        currentPorWidth = prevProgressWidth * 1.01
      }
      this.setState({ progressWidth: currentPorWidth })
    }, 100)
  }
  _loadUserData2 = async (currentPage, currentData) => {
    if (!currentData) {
      currentData = []
    }
    try {
      let objUserData = await this.getAllUserZipData(currentPage)
      if (!objUserData) {
        return
      }
      this.currentLoadDataCount = currentPage * 9
      this.allUserDataCount = objUserData.total
      this.totalPage = objUserData.totalPage
      let objArrUserDataContent = objUserData.content
      if (!objArrUserDataContent) {
        return
      }
      let contentLength = objArrUserDataContent.length
      for (let i = 0; i < contentLength; i++) {
        let objContent = objArrUserDataContent[i]
        if (objContent && objContent.type === 'WORKSPACE') {
          let dataId = objContent.id
          let dataUrl =
            'https://www.supermapol.com/web/datas/' + dataId + '.json'
          let objDataJson = await FetchUtils.getObjJson(dataUrl)
          if (!objDataJson) {
            continue
          }
          let arrDataItemServices = objDataJson.dataItemServices
          if (arrDataItemServices) {
            let length = arrDataItemServices.length
            let restUrl
            for (let i = 0; i < length; i++) {
              let dataItemServices = arrDataItemServices[i]
              if (
                dataItemServices &&
                dataItemServices.serviceType === 'RESTMAP'
              ) {
                restUrl = dataItemServices.address
                break
              }
            }
            if (restUrl && restUrl !== '') {
              restUrl = restUrl + '/maps.json'
              let arrMapJson = await FetchUtils.getObjJson(restUrl, 6000)
              let arrMapInfos = []
              if (!arrMapJson) {
                continue
              }
              for (let j = 0; j < arrMapJson.length; j++) {
                let objMapJson = arrMapJson[j]
                let mapTitle = objMapJson.name
                let mapUrl = objMapJson.path
                let mapThumbnail = mapUrl + '/entireImage.png?'
                let objMapInfo = {
                  mapTitle: mapTitle,
                  mapUrl: mapUrl,
                  mapThumbnail: mapThumbnail,
                }
                arrMapInfos.push(objMapInfo)
                break
              }
              if (arrMapInfos.length > 0) {
                objContent.thumbnail = arrMapInfos[0].mapThumbnail
                currentData.push(objContent)
              }
            }
          }
        }
      }
    } catch (e) {
      // this.setState({ isLoadingData: true })
    }
    return currentData
  }
  _loadUserData = async currentPage => {
    let arrObjContent = []
    try {
      let objUserData = await this.getAllUserZipData(currentPage)
      this.currentLoadDataCount = currentPage * 9
      this.allUserDataCount = objUserData.total
      let objArrUserDataContent = objUserData.content
      let contentLength = objArrUserDataContent.length
      for (let i = 0; i < contentLength; i++) {
        let objContent = objArrUserDataContent[i]
        if (objContent.type === 'WORKSPACE') {
          arrObjContent.push(objContent)
        }
      }
      if (this.state.data.length === 1 && this.state.data[0].id === undefined) {
        this.flatListData = this.flatListData.concat(arrObjContent)
        this.setState({ data: this.flatListData })
      }
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ data: arrObjContent })
    }
    return arrObjContent
  }
  getAllUserZipData = currentPage => {
    let time = new Date().getTime()
    let uri = `https://www.supermapol.com/web/datas.json?currentPage=${currentPage}&tags=%5B%22%E7%94%A8%E6%88%B7%E6%95%B0%E6%8D%AE%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&t=${time}`
    return FetchUtils.getObjJson(uri, 3000)
  }
  _onRefresh2 = async () => {
    try {
      if (!this.state.isRefresh) {
        this.setState({ isRefresh: true })
        this.currentLoadPage2 = 1
        this.getCurrentLoadData2(
          this.currentLoadPage2,
          this.allUserDataCount,
        ).then(data => {
          this.setState({ isRefresh: false, data: data })
        })
      }
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ isRefresh: false })
    }
  }
  _onRefresh = async () => {
    try {
      if (!this.state.isRefresh) {
        this.loadCount = 1
        this.setState({ isRefresh: true })
        // this.flatListData = await this._loadUserData(1, 20)
        this.flatListData = await this._loadUserData2(1)

        this.setState({ isRefresh: false, data: this.flatListData })
      }
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ isRefresh: false })
    }
  }
  _loadData2 = async () => {
    try {
      // if (!this.state.isLoadingData) {
      // this.setState({ isLoadingData: true })
      this.currentLoadPage2 = this.currentLoadPage2 + 1
      let data = await this.getCurrentLoadData2(
        this.currentLoadPage2,
        this.totalPage,
      )
      if (data.length > 1) {
        let newData = [...this.state.data].concat(data)
        this.setState({ data: newData })
      }
      // this.setState({ data: newData, isLoadingData: false })
      // }
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ isLoadingData: false })
    }
  }
  _loadData = async () => {
    try {
      if (!this.state.isLoadingData) {
        this.setState({ data: this.flatListData, isLoadingData: true })
        this.loadCount = this.loadCount + 1
        let arrData = await this._loadUserData(this.loadCount)
        this.flatListData = this.flatListData.concat(arrData)
        this.setState({ data: this.flatListData, isLoadingData: false })
      }
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ isLoadingData: false })
    }
  }

  _footView() {
    // if (
    //   this.allUserDataCount >= this.state.data.length &&
    //   this.allUserDataCount > this.currentLoadDataCount
    // ) {
    //   return (
    //     <View
    //       style={{
    //         flex: 1,
    //         height: 50,
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //       }}
    //     >
    //       <ActivityIndicator
    //         style={{
    //           flex: 1,
    //           height: 30,
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //         }}
    //         color={'orange'}
    //         animating={true}
    //       />
    //       <Text
    //         style={{
    //           flex: 1,
    //           lineHeight: 20,
    //           fontSize: 12,
    //           textAlign: 'center',
    //           color: 'orange',
    //         }}
    //       >
    //         加载中...
    //       </Text>
    //     </View>
    //   )
    // } else {
    return (
      <View>
        <Text
          style={{
            flex: 1,
            lineHeight: 30,
            fontSize: 12,
            textAlign: 'center',
          }}
        >
          -----这是底线-----
        </Text>
      </View>
    )
    // }
  }

  _keyExtractor = (item, index) => {
    if (item.id !== undefined) {
      return item.id + '' + index * index
    }
    return index * index
  }

  _selectRender = () => {
    if (this.state.data.length === 1 && this.state.data[0].id === undefined) {
      return (
        <View
          style={[
            styles.noDataViewStyle,
            { backgroundColor: color.contentColorWhite },
          ]}
        >
          <View
            style={{
              height: 2,
              width: this.state.progressWidth,
              backgroundColor: '#1c84c0',
            }}
          />
        </View>
      )
    }

    return (
      <FlatList
        style={[
          styles.haveDataViewStyle,
          { backgroundColor: color.contentColorWhite },
        ]}
        data={this.state.data}
        renderItem={data => {
          let name = data.item.nickname
          if (this.friendList) {
            if (this.friendList.indexOf(name) !== -1) {
              return <RenderFindItem user={this.props.user} data={data.item} />
            }
          } else {
            return <View />
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefresh}
            onRefresh={this._onRefresh2}
            colors={['orange', 'red']}
            tintColor={'orange'}
            titleColor={'orange'}
            title={'刷新中...'}
            enabled={true}
          />
        }
        keyExtractor={this._keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={this._loadData2}
        ListFooterComponent={this._footView()}
      />
    )
  }

  renderView = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: scaleSize(28),
            flex: 1,
            marginTop: scaleSize(250),
          }}
        >
          {'无好友地图，请登录后游览'}
        </Text>
      </View>
    )
    // return(<InfoView title={"请登陆"}/>)
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '好友地图',
          navigation: this.props.navigation,
        }}
      >
        {this.props.user.users.length > 1
          ? this._selectRender()
          : this.renderView()}
      </Container>
    )
  }
}
