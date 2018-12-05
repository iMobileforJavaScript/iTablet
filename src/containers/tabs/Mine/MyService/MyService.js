import React, { Component } from 'react'
import {
  View,
  FlatList,
  Text,
  Platform,
  DeviceEventEmitter,
  RefreshControl,
} from 'react-native'
import Container from '../../../../components/Container'
import RenderServiceItem from './RenderServiceItem'
import { SOnlineService } from 'imobile_for_reactnative'
/**
 * 变量命名规则：私有为_XXX, 若变量为一个对象，则命名为 objXXX,若为一个数组，则命名为 arrXXX,...
 * */

/** 记录服务名对应的数据名称*/
let _objServiceNameAndFileName
/** 记录地图名称对应的服务名称*/
let _objMapTitleAndRestTitle
/** 记录加载的地图*/
let _arrMaps = []
/** 记录发布公开的服务地图，用于android*/
let _arrPublishMaps = []
/** 记录是否可以下载*/
let _arrIsDownloadings = []
/** 记录下载的item*/
let _arrIndexes = []
/** 当前页加载多少条数据*/
let _iPageSize = 10
/** 记录服务有多少个*/
let _iServiceListTotal
/** 记录数据有多少个*/
let _iDataListTotal
export default class MyService extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    // if (_objServiceNameAndFileName !== undefined && _objMapTitleAndRestTitle !== undefined) {
    //
    // } else {
    //   this.state = {
    //     mapArr: [],
    //     arrIsDownloadings: [],
    //     isRefreshing: false,
    //     isLoadingData:false,
    //     loadCount:0,
    //     isDead:false,
    //   }
    // }
    this.state = {
      mapArr: _arrMaps,
      arrIsDownloadings: _arrIsDownloadings,
      isRefreshing: false,
      isLoadingData:false,
      loadCount:0,
      isDead:false,
    }
    this.downloadingListener = {}
    this.downloadedListener = {}
    this.downloadFailureListener = {}
    this.arrDownloadProgressRefs = []
    this._addListener()
    if (_objServiceNameAndFileName === undefined && _objMapTitleAndRestTitle === undefined) {
      this._loadOnlineDataAndService(1, _iPageSize)
    }
  }
  /** 服务名称对应数据名称 */
  _configureServiceNameAndFileName = async (currentPage, pageSize)=>  {
    let realPageSize = pageSize * 2
    let strDataList = await SOnlineService.getDataList(1,realPageSize)
    // 构建{serviceName:fileName}字符串,可通过服务名找到对应的数据名称
    let objDataList = JSON.parse(strDataList);
    _iDataListTotal = objDataList.total;
    if(currentPage > 1){

      let isLoadingData = _iDataListTotal < (currentPage-1)*realPageSize
      if(isLoadingData){
        this.setState({isLoadingData:false})
        return _objServiceNameAndFileName
      }
    }

    let serviceNameAndFileName = '{'
    for(let page = 1;page <= currentPage;page++){
      if(page > 1){
        strDataList = await SOnlineService.getDataList(page,realPageSize)
        objDataList = JSON.parse(strDataList);
      }
      let dataContent = objDataList.content
      for (let i = 0; i < dataContent.length; i++) {
        let fileName = dataContent[i].fileName
        let dataItemServices = dataContent[i].dataItemServices
        for (let j = 0; j < dataItemServices.length; j++) {
          let serviceName = dataItemServices[j].serviceName
          serviceNameAndFileName =
            serviceNameAndFileName + '"' + serviceName + '":"' + fileName + '",'
        }
      }
    }
    serviceNameAndFileName = serviceNameAndFileName + '"finally":"null"}'
    return JSON.parse(serviceNameAndFileName)
  }
  /** 地图名称对应服务名称 */
  _configureMapTitleAndRestTile = async (currentPage, pageSize)=> {
    let strServiceList = await SOnlineService.getServiceList(1,pageSize)
    let objServiceList = JSON.parse(strServiceList);
    _iServiceListTotal = objServiceList.total
    if(currentPage > 1){

      let isLoadingData = _iServiceListTotal<(currentPage-1)*pageSize
      if(isLoadingData){
        this.setState({isLoadingData:false})
        return _objMapTitleAndRestTitle
      }
    }
    _arrMaps = []
    _arrPublishMaps =[]
    // 1.存入地图数据
    // 2.构建{mapTile:restTile}字符串，可通过地图名称找到对应的服务名称
    let mapTileAndRestTitle = '{'
    for(let page = 1;page <= currentPage;page++){
      if(page > 1){
        strServiceList = await SOnlineService.getServiceList(page,pageSize)
        objServiceList = JSON.parse(strServiceList);
      }
      let serviceContent = objServiceList.content
      for (let i = 0; i < serviceContent.length; i++) {
        let restTile = serviceContent[i].resTitle
        _arrPublishMaps.push(restTile)

        /**  三维场景*/
        let scenes = serviceContent[i].scenes
        let scenesCount = scenes.length
        if(scenesCount > 0){
          for(let i = 0;i < scenesCount;i++ ){
            let mapTitle = scenes[i].sceneName
            let mapUrl = scenes[i].sceneUrl
            let mapInfo ='{"mapTitle":"'+mapTitle+'","mapUrl":"'+mapUrl+'","mapThumbnail":"null","isScenes":'+true+'}'
            _arrMaps.push(JSON.parse(mapInfo))
            mapTileAndRestTitle = mapTileAndRestTitle + '"' + mapTitle+'":"' + restTile + '",'
          }
        }
        /**  二维地图*/
        let mapInfos = serviceContent[i].mapInfos
        /** 针对mapInfos没有元素时*/
        if (mapInfos.length <= 0) {
          let mapTitle = '无地图_'+page+i;
          mapTileAndRestTitle = mapTileAndRestTitle + '"' + mapTitle+'":"' + restTile + '",'
          if(scenesCount <=0 ){
            let mapInfo ='{"mapTitle":"'+mapTitle+'","mapUrl":"null","mapThumbnail":"null","isScenes":'+false+'}'
            _arrMaps.push(JSON.parse(mapInfo))
          }

        }
        else {
          /* mapInfos数组含有元素 */
          for (let j = 0; j < mapInfos.length; j++) {
            let mapUrl = mapInfos[j].mapUrl
            let mapThumbnail = mapInfos[j].mapThumbnail
            let mapTitle = mapInfos[j].mapTitle
            let strMapInfo ='{"mapTitle":"'+mapTitle+'","mapUrl":"'+mapUrl+'","mapThumbnail":"'+mapThumbnail+'","isScenes":'+false+'}'
            _arrMaps.push(JSON.parse(strMapInfo))
            mapTileAndRestTitle = mapTileAndRestTitle + '"' + mapTitle + '":"' + restTile + '",'
          }
        }
      }
    }
    mapTileAndRestTitle = mapTileAndRestTitle + '"finally":"null"}'
    return JSON.parse(mapTileAndRestTitle)
  }

  _changeDownloadingProgressState = progress => {
    if(!this.state.isDead){
      let index = _arrIndexes[_arrIndexes.length - 1]
      this.arrDownloadProgressRefs[index].setDownloadProgress(progress)
    }
  }

  _addListener = ()=> {
    let downloadingEventType =
      'com.supermap.RN.Mapcontrol.online_service_downloading'
    let downloadFailureType =
      'com.supermap.RN.Mapcontrol.online_service_downloadfailure'
    let downloadedType = 'com.supermap.RN.Mapcontrol.online_service_downloaded'
    if (Platform.OS === 'ios') {
      let callBackIos = SOnlineService.objCallBack()
      this.downloadingListener = callBackIos.addListener(
        downloadingEventType,
        obj => {
          let progress = obj.progress
          let result = '下载' + progress.toFixed(2) + '%'
          this._changeDownloadingProgressState(result)
        },
      )
      this.downloadFailureListener = callBackIos.addListener(
        downloadFailureType,
        () => {
          this._changeIsDownloadingState(
            this.state.arrIsDownloadings.length + 1,
          )
          this._changeDownloadingProgressState('下载失败')
        },
      )
      this.downloadedListener = callBackIos.addListener(downloadedType, () => {
        this._changeIsDownloadingState(this.state.arrIsDownloadings.length + 1)
        this._changeDownloadingProgressState('下载完成')
      })
    }
    if (Platform.OS === 'android') {
      this.downloadingListener = DeviceEventEmitter.addListener(
        downloadingEventType,
        obj => {
          let index = _arrIndexes[_arrIndexes.length - 1]
          let result = '下载' + obj.toFixed(2) + '%'
          this.arrDownloadProgressRefs[index].setDownloadProgress(result)
        },
      )
      this.downloadedListener = DeviceEventEmitter.addListener(
        downloadedType,
        () => {
          this._changeIsDownloadingState(
            this.state.arrIsDownloadings.length + 1,
          )
          this._changeDownloadingProgressState('下载完成')
        },
      )
      this.downloadFailureListener = DeviceEventEmitter.addListener(
        downloadFailureType,
        () => {
          this._changeIsDownloadingState(
            this.state.arrIsDownloadings.length + 1,
          )
          this._changeDownloadingProgressState('下载失败')
        },
      )
    }
  }

/*  _getDataList = async (currentPage, pageSize) => {
    let strDataList = await SOnlineService.getDataList(currentPage, pageSize)
    return strDataList
  }

  _getServiceList = async (currentPage, pageSize) => {
    let strServiceList = await SOnlineService.getServiceList(currentPage, pageSize)
    return strServiceList
  }*/

  _loadOnlineDataAndService = async () => {
    _objServiceNameAndFileName =await this._configureServiceNameAndFileName(1,_iPageSize)
    _objMapTitleAndRestTitle =await this._configureMapTitleAndRestTile(1,_iPageSize)

    if (Platform.OS === 'android') {
      await this._publishMaps()
    }
    for (let i = 0; i < _arrMaps.length; i++) {
      _arrIsDownloadings.push(true)
    }

    this.setState({
      mapArr: _arrMaps,
      arrIsDownloadings: _arrIsDownloadings,
      loadCount:1,
    })

    return true
  }

  componentWillUnmount() {
    this.setState({isDead:true})
    if (this.downloadingListener.remove === 'function') {
      this.downloadingListener.remove()
    }
    if (this.downloadedListener.remove === 'function') {
      this.downloadingListener.remove()
    }
    if (this.downloadFailureListener.remove === 'function') {
      this.downloadingListener.remove()
    }

  }
  _publishMaps = async () => {
    for (let i = 0; i < _arrPublishMaps.length; i++) {
      let restTitle = _arrPublishMaps[i]
      let result = await SOnlineService.changeServiceVisibility(restTitle, true)
      if (typeof result === 'boolean' && result === true) {
        _arrPublishMaps.push(restTitle)
      }
    }
  }

  _setDownloadProgressRef = ref => {
    // 判断是否有着
    if (this.arrDownloadProgressRefs.indexOf(ref) === -1) {
      this.arrDownloadProgressRefs.push(ref)
    }
  }

  _onRefresh = async () => {
    if (!this.state.isRefreshing) {
      this.setState({ isRefreshing: true ,loadCount:1})
      _objServiceNameAndFileName=await this._configureServiceNameAndFileName(1,_iPageSize)
      _objMapTitleAndRestTitle=await this._configureMapTitleAndRestTile(1,_iPageSize)
      this.setState({ isRefreshing: false, mapArr: _arrMaps,loadCount:1 })
    }
  }

  _loadData = async () => {
    if(this.state.loadCount * _iPageSize < _iServiceListTotal && !this.state.isLoadingData){
      let loadCount = this.state.loadCount +1;
      this.setState({isLoadingData:true})
      _objServiceNameAndFileName=await this._configureServiceNameAndFileName(loadCount,_iPageSize)
      _objMapTitleAndRestTitle=await this._configureMapTitleAndRestTile(loadCount,_iPageSize)
      this.setState({mapArr:_arrMaps,loadCount:loadCount,isLoadingData:false});
    }

  }

  _changeIsDownloadingState = index => {
    let arrIsDownloadings=[]
    let length = this.state.arrIsDownloadings.length
    if(index < length){
      for(let i = 0;i <= length;i++){
        if(i === index){
          arrIsDownloadings.push(true)
        }else{
          arrIsDownloadings.push(false)
        }

      }
    }else{
      for(let i = 0;i<length;i++){
        arrIsDownloadings.push(true)
      }
    }
    _arrIsDownloadings=arrIsDownloadings
    this.setState({ arrIsDownloadings: _arrIsDownloadings })
  }

  _itemOnPressCallBack = index => {
    _arrIndexes.push(index)
    this.arrDownloadProgressRefs[index].setDownloadProgress('下载中...')
    this._changeIsDownloadingState(index)
  }

  _footView (){
    if(this.state.isLoadingData){
      return ( <View
        style={{ justifyContent: 'center', alignItems: 'center',backgroundColor: '#505052' }}
      >
        <Text
          style={{
            flex: 1,
            lineHeight: 20,
            fontSize: 12,
            textAlign: 'center',

          }}
        >
          加载中...
        </Text>
      </View>)
    }else{
      return <View/>
    }

  }
  /** 以便在刷新时能够确定其变化的位置，减少重新渲染的开销*/
  _keyExtractor = (item, index) => index*index;

  render() {
    if (_objServiceNameAndFileName === undefined || _objMapTitleAndRestTitle === undefined) {
      return (
        <Container
          headerProps={{
            title: '我的服务',
            withoutBack: false,
            navigation: this.props.navigation,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#505052',
            }}
          >
            <Text style={{ lineHeight: 40, fontSize: 16 }}>数据加载中...</Text>
          </View>
        </Container>
      )
    } else {
      return (
        <Container
          headerProps={{
            title: '我的服务',
            withoutBack: false,
            navigation: this.props.navigation,
          }}
        >
          <View style={{ flex: 1 }}>
            <FlatList
              keyExtractor={this._keyExtractor}
              data={this.state.mapArr}
              renderItem={({ item, index }) => {
                return (
                  <RenderServiceItem
                    ref={this._setDownloadProgressRef}
                    index={index}
                    isScenes={item.isScenes}
                    mapName={item.mapTitle}
                    imageUrl={item.mapThumbnail}
                    sharedMapUrl={item.mapUrl}
                    serviceNameAndFileName={_objServiceNameAndFileName}
                    mapTileAndRestTitle={_objMapTitleAndRestTitle}
                    isDownloading={this.state.arrIsDownloadings[index]}
                    itemOnPressCallBack={this._itemOnPressCallBack}
                  />
                )
              }}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefreshing}
                  onRefresh={this._onRefresh}
                  colors={['gray', 'orange']}
                  tintColor={'gray'}
                  title={'刷新中...'}
                  enabled={true}
                />
              }
              onEndReachedThreshold={0.2}
              onEndReached={this._loadData}
              ListFooterComponent={
               this._footView()
              }
            />
          </View>
        </Container>
      )
    }
  }
}
