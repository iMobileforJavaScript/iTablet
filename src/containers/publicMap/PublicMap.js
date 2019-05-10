/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native'
import RenderFindItem from './RenderFindItem'
import { Toast, jsonUtil } from '../../utils'
import styles from './Styles'
import color from '../../styles/color'
import FetchUtils from '../../utils/FetchUtils'
import { SOnlineService } from 'imobile_for_reactnative'
import { getLanguage } from '../../language'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import RNFS from 'react-native-fs'
// import { Platform } from 'os'
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
      data: [],
      isRefresh: false,
      progressWidth: this.screenWidth * 0.4,
      isLoadingData: false,
    }
    this.isLoading = false
    this.loadCount = 1
    this.cacheData = []
    this.allUserDataCount = -1
    this.currentLoadDataCount = 0
    this.loadCacheEnd = false
    this._onRefresh = this._onRefresh.bind(this)
    this._loadData2 = this._loadData2.bind(this)
    this.getCurrentLoadData2 = this.getCurrentLoadData2.bind(this)
    this._loadUserData2 = this._loadUserData2.bind(this)
    this.addMapCache = this.addMapCache.bind(this)
    this.saveMapCache = this.saveMapCache.bind(this)
    this._showLoadProgressView = this._showLoadProgressView.bind(this)
    this._loadFirstUserData2 = this._loadFirstUserData2.bind(this)
  }
  componentDidMount() {
    // this._loadFirstUserData()
    FileTools.getHomeDirectory().then(value => {
      let path = value + ConstPath.CachePath + 'publicMap.txt'
      FileTools.fileIsExist(path).then(exist => {
        if (exist) {
          RNFS.readFile(path).then(result => {
            if (result && jsonUtil.isJSON(result)) {
              this.cacheData = JSON.parse(result)
            }
            this.currentLoadPage2 = 1
            this._loadFirstUserData2(this.currentLoadPage2, 300)
          })
        }
      })
    })
  }
  componentWillUnmount() {
    this._clearInterval()
    this.saveMapCache()
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     JSON.stringify(prevState) !== JSON.stringify(this.state)
  //   ) {
  //     return true
  //   }
  //   return false
  // }

  _clearInterval = () => {
    if (this.objProgressWidth !== undefined) {
      clearInterval(this.objProgressWidth)
      this.setState({ progressWidth: '100%' })
    }
  }
  async _loadFirstUserData2(currentPage, totalPage) {
    try {
      //debugger
      if (Platform.OS === 'android') {
        await SOnlineService.syncAndroidCookie()
      }
      // let path =
      //   (await FileTools.getHomeDirectory()) +
      //   ConstPath.CachePath +
      //   'publicMap.txt'
      //debugger
      if (this.cacheData.length > 0) {
        let data = [...this.cacheData]
        let mapList = []
        //debugger
        for (let index = 0; index < data.length; index++) {
          const element = data[index]
          let dataId = element.id
          let dataUrl =
            'https://www.supermapol.com/web/datas/' + dataId + '.json'
          // 'https://www.supermapol.com/web/datas/1916243026.json'

          let bValid = false
          // if (element.serviceStatus !== 'UNPUBLISHED') {
          //   this.removeMapCache([element])
          //   continue
          // }
          let objDataJson = await FetchUtils.getObjJson(dataUrl)
          if (
            objDataJson &&
            objDataJson.dataItemServices &&
            objDataJson.dataItemServices[0] &&
            objDataJson.dataItemServices[0].serviceType
          ) {
            //debugger
            if (
              objDataJson.dataItemServices[0].serviceType === 'RESTMAP' &&
              objDataJson.serviceStatus === 'PUBLISHED'
            ) {
              mapList.push(element)
              bValid = true
            }
          }
          if (!bValid) {
            this.removeMapCache([element])
          }
          this.setState({ data: mapList })
        }
        this._clearInterval()
        this.loadCacheEnd = true
      } else {
        this.loadCacheEnd = true
        this._showLoadProgressView()

        await this.getCurrentLoadData2(currentPage, totalPage)

        this._clearInterval()
      }
    } catch (e) {
      this._clearInterval()
    }
  }

  async getCurrentLoadData2(currentPage, totalPage) {
    await SOnlineService.syncAndroidCookie()
    if (!totalPage) {
      totalPage = 100
    }
    if (this.isLoading === true || this.loadCacheEnd === false) {
      return
    }

    let data = []
    while (currentPage <= totalPage) {
      this.isLoading = true
      await this._loadUserData2(currentPage, data)
      //一条也刷新
      if (data.length >= 1) {
        let newData = this.addMapCache(data)
        if (newData) {
          this.setState({ data: newData })
        }
      }
      currentPage = currentPage + 1
      this.currentLoadPage2 = currentPage
      //加载15条跳出
      if (data.length > 5) {
        break
      }
    }
    this.isLoading = false
    return data
  }
  _showLoadProgressView() {
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
  async _loadUserData2(currentPage, currentData) {
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
            if (objDataJson.serviceStatus !== 'PUBLISHED') {
              continue
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
  async saveMapCache() {
    if (this.cacheData < 1) return
    let data = JSON.stringify(this.cacheData)
    let path =
      (await FileTools.getHomeDirectory()) +
      ConstPath.CachePath +
      'publicMap.txt'
    RNFS.writeFile(path, data, 'utf8')
      .then(() => {})
      .catch(() => {})
  }

  removeMapCache(newMapData) {
    if (!newMapData) {
      return
    }
    // let srcData = [...this.cacheData]
    for (let i = 0; i < newMapData.length; i++) {
      let map = newMapData[i]

      let bFound = false
      let index
      for (let n = 0; n < this.cacheData.length; n++) {
        if (this.cacheData[n].MD5 === map.MD5) {
          bFound = true
          index = n
          break
        }
      }

      if (!bFound) {
        this.cacheData.splice(index, 1)
      }
    }

    return this.cacheData
  }
  addMapCache(newMapData) {
    if (!newMapData) {
      return
    }
    let bAddNew = false
    let srcData = this.cacheData //[...this.state.data]
    for (let i = 0; i < newMapData.length; i++) {
      let map = newMapData[i]
      let bFound = false
      for (let n = 0; n < srcData.length; n++) {
        if (srcData[n].MD5 === map.MD5) {
          bFound = true
          break
        }
      }

      if (!bFound) {
        bAddNew = true
        srcData.push(map)
      }
    }
    srcData = srcData.sort((obj1, obj2) => {
      let time1 = obj1.createTime
      let time2 = obj2.createTime
      return time2 - time1
    })

    if (bAddNew) {
      let data = JSON.stringify(srcData)
      FileTools.getHomeDirectory().then(value => {
        let path = value + ConstPath.CachePath + 'publicMap.txt'
        RNFS.writeFile(path, data, 'utf8')
      })
    }
    if (bAddNew) {
      return srcData
    } else {
      return false
    }
  }
  async _onRefresh() {
    try {
      this.setState({ isRefresh: true })
      setTimeout(() => {
        this.setState({ isRefresh: false })
      }, 3000)
      // this.currentLoadPage2 = 1
      await this.getCurrentLoadData2(1, 100)
      // await this.getCurrentLoadData2(this.currentLoadPage2, this.totalPage)
    } catch (e) {
      Toast.show('网络错误')
      this.setState({ isRefresh: false })
    }
  }
  async _loadData2() {
    try {
      if (!this.state.isLoadingData) {
        this.setState({ isLoadingData: true })
        // this.currentLoadPage2 = this.currentLoadPage2 + 1
        await this.getCurrentLoadData2(this.currentLoadPage2, this.totalPage)
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
            {getLanguage(global.language).Prompt.LOADING}
            {/* 加载中... */}
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
