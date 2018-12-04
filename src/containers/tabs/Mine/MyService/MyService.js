import React,{PureComponent,Component} from 'react'
import {
  View,
  FlatList,
  Text,
  Platform,
  DeviceEventEmitter,
  RefreshControl,
} from "react-native";
import Container from "../../../../components/Container";
import RenderServiceItem from './RenderServiceItem'
import {
  SOnlineService,
} from 'imobile_for_reactnative'
/**
 * 变量命名规则：私有为_XXX, 若变量为一个对象，则命名为 objXXX,若为一个数组，则命名为 arrXXX,...
 * */
let _strServiceList;
let _strDataList;
let _objServiceNameAndFileName;
let _objMapTitleAndRestTitle;
let _arrMaps = [];
let _arrPublishMaps=[];
let _arrDownloadingProgresses=[];
let _arrIsDownloadings=[];
let _arrIndexes=[];
export default class MyService extends Component{

  constructor(props){
    super(props);
    if(_strDataList !== undefined && _strServiceList !== undefined){
      this.state={
        mapArr:_arrMaps,
        arrIsDownloadings:_arrIsDownloadings,
        arrDownloadingProgresses:[],
        isRefreshing:false,
      }
    }else{
      this.state={
        mapArr:[],
        arrIsDownloadings:[],
        arrDownloadingProgresses:[],
        isRefreshing:false,
      }
    }
    this.downloadingListener={};
    this.downloadedListener={};
    this.downloadFailureListener={};
    this.arrDownloadProgressRefs= [];
    if(_strDataList === undefined && _strServiceList === undefined){
      this.loadOnlineDataAndService(1,20);
      this.addListener();
    }
  }
/** 服务名称对应数据名称 */
  configureServiceNameAndFileName (){
    // 构建{serviceName:fileName}字符串,可通过服务名找到对应的数据名称
    let dataContent = JSON.parse(_strDataList).content;
    let serviceNameAndFileName = '{';
    for(let i = 0;i<dataContent.length;i++){
      let fileName = dataContent[i].fileName;
      let dataItemServices=dataContent[i].dataItemServices;
      for(let j=0;j<dataItemServices.length;j++){
        let serviceName = dataItemServices[j].serviceName;
        if(i+1 === dataContent.length && j+1 === dataItemServices.length){
          serviceNameAndFileName = serviceNameAndFileName +"\""+ serviceName+"\":\""+fileName+"\"";
        }else{
          serviceNameAndFileName = serviceNameAndFileName +"\""+ serviceName+"\":\""+fileName+"\",";
        }
      }
      if(i+1 === dataContent.length && dataItemServices.length <= 0){
        serviceNameAndFileName = serviceNameAndFileName +"\""+ "dataItemServicesLength"+"\":\""+"undefined"+"\"";
      }
    }
    serviceNameAndFileName = serviceNameAndFileName + "}";
    _objServiceNameAndFileName = JSON.parse(serviceNameAndFileName);
  }
/** 地图名称对应服务名称 */
  configureMapTitleAndRestTile(){
    _arrMaps = [];
    // 1.存入地图数据
    // 2.构建{mapTile:restTile}字符串，可通过地图名称找到对应的服务名称
    let mapTileAndRestTitle = '{';
    let serviceContent = JSON.parse(_strServiceList).content;
    for(let i = 0;i<serviceContent.length;i++){
      let restTile = serviceContent[i].resTitle;
      _arrPublishMaps.push(restTile);

      let mapInfos = serviceContent[i].mapInfos;
      for(let j =0;j<mapInfos.length;j++){
        let mapInfo = mapInfos[j];
        _arrMaps.push(mapInfo);

        let mapTitle = mapInfos[j].mapTitle;
        if(i+1 === serviceContent.length && j+1 === mapInfos.length){
          mapTileAndRestTitle = mapTileAndRestTitle +"\""+ mapTitle+"\":\""+restTile+"\"";
        }else{
          mapTileAndRestTitle = mapTileAndRestTitle +"\""+ mapTitle+"\":\""+restTile+"\",";
        }
      }
      if(i+1 === serviceContent.length && mapInfos.length <= 0){
        mapTileAndRestTitle = mapTileAndRestTitle +"\""+ "mapInfoLength"+"\":\""+"undefined"+"\"";
      }
    }
    mapTileAndRestTitle = mapTileAndRestTitle + '}';
    _objMapTitleAndRestTitle = JSON.parse(mapTileAndRestTitle);
  }

  _changeDownloadingProgressState = progress =>{
    let index =_arrIndexes[_arrIndexes.length-1];
    this.arrDownloadProgressRefs[index].setDownloadProgress(progress);
  }

  addListener(){
    let downloadingEventType = 'com.supermap.RN.Mapcontrol.online_service_downloading';
    let downloadFailureType = 'com.supermap.RN.Mapcontrol.online_service_downloadfailure';
    let downloadedType ='com.supermap.RN.Mapcontrol.online_service_downloaded';
    if(Platform.OS === 'ios'){
      let callBackIos = SOnlineService.objCallBack();
      this.downloadingListener = callBackIos.addListener (downloadingEventType, (obj)=> {
        let progress = obj.progress;
        let result ='下载'+progress.toFixed(0) + "%";
        this._changeDownloadingProgressState(result);
      });
      this.downloadFailureListener =callBackIos.addListener(downloadFailureType,(obj)=>{
        this._changeIsDownloadingState(this.state.arrIsDownloadings.length+1);
        this._changeDownloadingProgressState('下载失败');

      });
      this.downloadedListener = callBackIos.addListener(downloadedType,(obj)=>{
        this._changeIsDownloadingState(this.state.arrIsDownloadings.length+1);
        this._changeDownloadingProgressState('下载完成');
      })
    }
    if(Platform.OS === 'android'){
      this.downloadingListener = DeviceEventEmitter.addListener(downloadingEventType,(obj)=> {
        let index =_arrIndexes[_arrIndexes.length-1];
        let result ='下载'+obj.toFixed(0) + "%";
        _arrDownloadingProgresses[index] = result;
        this.arrDownloadProgressRefs[index].setDownloadProgress(result);
      });
      this.downloadedListener = DeviceEventEmitter.addListener(downloadedType,(obj)=> {
        this._changeIsDownloadingState(this.state.arrIsDownloadings.length+1);
        this._changeDownloadingProgressState('下载完成');
      });
      this.downloadFailureListener = DeviceEventEmitter.addListener(downloadFailureType,(obj)=> {
        this._changeIsDownloadingState(this.state.arrIsDownloadings.length+1);
        this._changeDownloadingProgressState('下载失败');
      });
    }
  }

  getDataList =async (currentPage, pageSize) =>{
    _strDataList =await SOnlineService.getDataList(currentPage,pageSize);
  }

  getServiceList = async (currentPage, pageSize) =>{
    _strServiceList =await SOnlineService.getServiceList(currentPage,pageSize);
  }


  loadOnlineDataAndService =async () =>{
    await this.getDataList(1,20);
    await this.getServiceList(1,20);
    this.configureServiceNameAndFileName();
    this.configureMapTitleAndRestTile();
    if(Platform.OS === 'android'){await this._publishMaps();}
    for(let i = 0;i < _arrMaps.length;i++){
      _arrIsDownloadings.push(true);
      _arrDownloadingProgresses.push('未下载');
    }

    this.setState({mapArr:_arrMaps,
      arrIsDownloadings:_arrIsDownloadings,
      arrDownloadingProgresses:_arrDownloadingProgresses});


    return true;
  }

  componentWillUnmount(){
    if(this.downloadingListener.remove === 'function'){
      this.downloadingListener.remove();
    }
    if(this.downloadedListener.remove === 'function'){
      this.downloadingListener.remove();
    }
    if(this.downloadFailureListener.remove === 'function'){
      this.downloadingListener.remove();
    }

  }
  _publishMaps = async () => {
    for(let i=0;i<_arrPublishMaps.length;i++){
      let restTitle = _arrPublishMaps[i];
      let result = await SOnlineService.changeServiceVisibility(restTitle,true);
      if(typeof result === 'boolean' && result === true){
        _arrPublishMaps.push(restTitle);
      }
    }
  }

  setDownloadProgressRef = ref => {
    // 判断是否有着
   if(this.arrDownloadProgressRefs.indexOf(ref) === -1){
     this.arrDownloadProgressRefs.push(ref);
   }
  }

  _onRefresh =async ()=>{
    if(!this.state.isRefreshing){
      this.setState({isRefreshing:true});
      await this.getDataList(1,20);
      await this.getServiceList(1,20);
      this.configureServiceNameAndFileName();
      this.configureMapTitleAndRestTile();
      this.setState({isRefreshing:false,mapArr:_arrMaps,});
    }
  }

  _loadData =async () => {
    // await this.getDataList(2,20);
    // await this.getServiceList(2,20);
    // this.configureServiceNameAndFileName();
    // this.configureMapTitleAndRestTile();
    // this.setState({mapArr:_arrMaps,});
  }

  _changeIsDownloadingState = index =>{
    let arrIsDownloadings=[];
    let length = this.state.arrIsDownloadings.length;
    if(index > length){
      for(let i =0;i < length;i++){
        arrIsDownloadings.push(true);
      }
    }else{
      for(let i =0;i < length;i++){
        if(i === index){
          arrIsDownloadings.push(true);
        }else{
          arrIsDownloadings.push(false);
        }
      }
    }

    this.setState({arrIsDownloadings:arrIsDownloadings});
  }

  _itemOnPressCallBack = index => {
    _arrIndexes.push(index);
    this._changeIsDownloadingState(index);
  }

  render(){
    if(_strDataList === undefined || _strServiceList === undefined){
      return <Container
        headerProps={{
          title: '我的服务',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#505052'}}>
          <Text style={{lineHeight:40,fontSize:16}}>数据加载中...</Text>
        </View>
      </Container>
    }else{
      return <Container
        headerProps={{
          title: '我的服务',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <View style={{flex:1,}}>
          <FlatList
            data={this.state.mapArr}
            renderItem={({item,index}) => {
              return <RenderServiceItem
                ref={this.setDownloadProgressRef}
                index={index}
                mapName={item.mapTitle}
                imageUrl={item.mapThumbnail}
                sharedMapUrl={item.mapUrl}
                serviceNameAndFileName={_objServiceNameAndFileName}
                mapTileAndRestTitle={_objMapTitleAndRestTitle}
                isDownloading={this.state.arrIsDownloadings[index]}
                downloadProgress = {this.state.arrDownloadingProgresses[index]}
                itemOnPressCallBack={this._itemOnPressCallBack}
              />
            }
            }
            refreshControl = {
              (<RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                colors ={['gray','orange']}
                tintColor = {'gray'}
                title={'刷新中...'}
                enabled={true}
              />)
            }
            onEndReachedThreshold={0.1}
            onEndReached={this._loadData}
            ListFooterComponent = {
              <View style={{justifyContent: 'center',alignItems: 'center'}}><Text style={{flex:1,lineHeight: 30,fontSize: 16,textAlign: 'center'}}>加载中...</Text></View>
            }
          />
        </View>
      </Container>

    }
  }
}