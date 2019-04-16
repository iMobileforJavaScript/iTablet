/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import Container from '../../components/Container'
import { View, Text, FlatList, RefreshControl, Dimensions,ActivityIndicator } from 'react-native'
import RenderFindItem from './RenderFindItem'
import { Toast } from '../../utils'
import styles from './Styles'
import color from '../../styles/color'
import FetchUtils from '../../utils/FetchUtils'
import { SOnlineService } from 'imobile_for_reactnative'
import { getLanguage } from '../../language/index'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import RNFS from 'react-native-fs'
// import { FileTools } from '../../native'
// import { ConstPath } from '../../constants'
// import FriendListFileHandle from '../tabs/Friend/FriendListFileHandle'
export default class PublicMap extends Component {
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
    this.isLoading = false
    this.loadCount = 1
    this.flatListData = []
    this.allUserDataCount = -1
    this.currentLoadDataCount = 0
    this._onRefresh = this._onRefresh.bind(this)
    this._loadData2 = this._loadData2.bind(this)
    this.getCurrentLoadData2 = this.getCurrentLoadData2.bind(this)
    this._loadUserData2 = this._loadUserData2.bind(this)
    this.addMapCache = this.addMapCache.bind(this)
    this.saveMapCache = this.saveMapCache.bind(this)
    this._showLoadProgressView = this._showLoadProgressView.bind(this)
  }
  componentDidMount() {
    // this._loadFirstUserData()
    this.currentLoadPage2 = 1
    this._loadFirstUserData2(this.currentLoadPage2, 100)
  }
  componentWillUnmount() {
    this._clearInterval()
    this.saveMapCache()
  }

  _clearInterval = () => {
    if (this.objProgressWidth !== undefined) {
      clearInterval(this.objProgressWidth)
      this.setState({ progressWidth: '100%' })
    }
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
        'publicMap.txt'
      let exist = await FileTools.fileIsExist(path)
      if (exist) {
        let result = await RNFS.readFile(path)
        if (result) {
          let data = JSON.parse(result)
          let mapList = []

          if (!data[0].id) {
            this._showLoadProgressView()
            debugger
            this.getCurrentLoadData2(currentPage, totalPage)
            this._clearInterval()
          } else {
            for (let index = 0; index < data.length; index++) {
              const element = data[index]
              let dataId = element.id
              let dataUrl =
                'https://www.supermapol.com/web/datas/' + dataId + '.json'
              // 'https://www.supermapol.com/web/datas/1916243026.json'

              let bValid = false
              let objDataJson = await FetchUtils.getObjJson(dataUrl)
              if (objDataJson) {
                if (objDataJson.dataItemServices[0].serviceType === 'RESTMAP') {
                  mapList.push(element)
                  bValid = true
                }
              }
              if(!bValid){
                this.removeMapCache([element])
              }
              this.setState({ data: mapList })
            }
            this._clearInterval()
          }
        }
      } else {
        this._showLoadProgressView()
        debugger
        await this.getCurrentLoadData2(currentPage, totalPage)

        this._clearInterval()
      }
    } catch (e) {
      this._clearInterval()
    }
  }

  async getCurrentLoadData2(currentPage, totalPage) {
    await SOnlineService.syncAndroidCookie()
    if(!totalPage){
      totalPage = 100
    }
    if(this.isLoading === true){
      return
    }

    let data = []
    while (currentPage <= totalPage) {
      this.isLoading = true
      await this._loadUserData2(currentPage, data)
      //一条也刷新 
      if (data.length >= 1) {
        let newData = this.addMapCache(data)
        this.setState({ data: newData })
      }
      currentPage = currentPage + 1
      this.currentLoadPage2 = currentPage
      //加载15条跳出
      if(data.length > 5){
        break
      }
    }
    this.isLoading = false
    return data
  }
  _showLoadProgressView(){
    let thisHandle = this
    this.objProgressWidth = setInterval(() => {
      let prevProgressWidth = thisHandle.state.progressWidth
      let currentPorWidth
      if (prevProgressWidth >= thisHandle.screenWidth - 300) {
        currentPorWidth = prevProgressWidth + 1
        if (currentPorWidth >= thisHandle.screenWidth - 50) {
          currentPorWidth = thisHandle.screenWidth - 50
          return
        }
      } else {
        currentPorWidth = prevProgressWidth * 1.01
      }
      thisHandle.setState({ progressWidth: currentPorWidth })
    }, 100)
  }
  async _loadUserData2(currentPage, currentData){
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
          // 'https://www.supermapol.com/web/datas/1916243026.json'
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

  getAllUserZipData = currentPage => {
    let time = new Date().getTime()
    let uri = `https://www.supermapol.com/web/datas.json?currentPage=${currentPage}&orderBy=LASTMODIFIEDTIME&orderType=DESC&t=${time}`
    return FetchUtils.getObjJson(uri)
  }
  async saveMapCache(){
    if (this.state.length < 1) return
    let data = JSON.stringify(this.state.data)
    let path =
      (await FileTools.getHomeDirectory()) +
      ConstPath.UserPath +
      this.props.user.currentUser.userName +
      '/' +
      ConstPath.RelativePath.Temp +
      'publicMap.txt'
    RNFS.writeFile(path, data, 'utf8')
      .then(() => {})
      .catch(() => {})
  }

  removeMapCache(newMapData){
    if(!newMapData){
      return
    }
    let srcData = [...this.state.data]
    for(let i=0;i<newMapData.length;i++){
      let map = newMapData[i]

      let bFound = false
      let index
      for(let n=0;n<srcData.length;n++){
        if(srcData[n].MD5 === map.MD5){
          bFound = true
          index = n
          break
        }
      }

      if(!bFound){
        srcData.splice(index,1)
      }
    }

    return srcData
  }
  addMapCache(newMapData){
    if(!newMapData){
      return
    }
    let srcData = [...this.state.data]
    for(let i=0;i<newMapData.length;i++){
      let map = newMapData[i]

      let bFound = false
      for(let n=0;n<srcData.length;n++){
        if(srcData[n].MD5 === map.MD5){
          bFound = true
          break
        }
      }

      if(!bFound){
        srcData.push(map)
      }
    }

    return srcData
  }
  async _onRefresh(){
    try {
      this.setState({ isRefresh: true })
      setTimeout(()=>{
        this.setState({ isRefresh: false })
      },3000)
      // this.currentLoadPage2 = 1
      await this.getCurrentLoadData2(1, 100)
      await this.getCurrentLoadData2(this.currentLoadPage2, this.totalPage)
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ isRefresh: false })
    }
  }
  async _loadData2(){
    try {
      if(!this.state.isLoadingData){
        this.setState({ isLoadingData: true })
        this.currentLoadPage2 = this.currentLoadPage2 + 1
        await this.getCurrentLoadData2(this.currentLoadPage2,this.totalPage)
        this.setState({ isLoadingData: false })
      }
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ isLoadingData: false })
    }
  }
  _footView() {
    if (this.state.isLoadingData) {
      return (
        <View
          style={{
            flex: 1,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            style={{
              flex: 1,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            color={'orange'}
            animating={true}
          />
          <Text
            style={{
              flex: 1,
              lineHeight: 20,
              fontSize: 12,
              textAlign: 'center',
              color: 'orange',
            }}
          >
            加载中...
          </Text>
        </View>
      )
    } else {
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
            {/* -----这是底线----- */}
          </Text>
        </View>
      )
    }
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
          return <RenderFindItem user={this.props.user} data={data.item} />
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefresh}
            onRefresh={this._onRefresh}
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

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Prompt.PUBLIC_MAP,
          //'公共地图',
          navigation: this.props.navigation,
        }}
      >
        {this._selectRender()}
      </Container>
    )
  }
}
