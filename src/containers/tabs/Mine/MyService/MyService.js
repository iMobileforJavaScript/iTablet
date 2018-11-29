import React,{Component} from 'react'
import {
  View,
  FlatList,
  Text,
} from "react-native";
import { Toast } from '../../../../utils'
import Container from "../../../../components/Container";
import RenderServiceItem from './RenderServiceItem'

let serviceList;
let dataList;
let _objOnlineService;
let _serviceNameAndFileName;
let _mapTitleAndRestTitle;
let mapArr = [];
export default class MyService extends Component{

  constructor(props){
    super(props);
    if(dataList !== undefined && serviceList !== undefined){
      this.state={
        mapArr:mapArr,
      }
    }else{
      this.state={
        mapArr:[],
      }
    }
    _objOnlineService =this.props.navigation.getParam("objOnlineService",{});
    this.loadOnlineDataAndService(1,20);
  }


  loadOnlineDataAndService =async (currentPage, pageSize) =>{
    if(dataList !== undefined && serviceList !== undefined){
      return;
    }
    dataList =await _objOnlineService.getDataList(currentPage,pageSize);
    serviceList =await _objOnlineService.getServiceList(currentPage,pageSize);
// 构建{serviceName:fileName}字符串,可通过服务名找到对应的数据名称
    let dataContent = JSON.parse(dataList).content;
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
    _serviceNameAndFileName = JSON.parse(serviceNameAndFileName);

    // 1.存入地图数据
    // 2.构建{mapTile:restTile}字符串，可通过地图名称找到对应的服务名称
    let mapTileAndRestTitle = '{';
    let serviceContent = JSON.parse(serviceList).content;
    for(let i = 0;i<serviceContent.length;i++){
      let restTile = serviceContent[i].resTitle;
      let mapInfos = serviceContent[i].mapInfos;
      for(let j =0;j<mapInfos.length;j++){
        let mapInfo = mapInfos[j];
        mapArr.push(mapInfo);

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
    _mapTitleAndRestTitle = JSON.parse(mapTileAndRestTitle);

    this.setState({mapArr:mapArr});
  }

  render(){
    if(dataList === undefined || serviceList === undefined){
      return <Container
        headerProps={{
          title: '我的iTablet',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{lineHeight:40,fontSize:16}}>数据加载中...</Text>
        </View>
      </Container>
    }else{
      return <Container
        headerProps={{
          title: '我的iTablet',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <View style={{flex:1,}}>
          <FlatList
            data={this.state.mapArr}
            renderItem={({item, index}) => <RenderServiceItem
              mapName={item.mapTitle}
              imageUrl={item.mapThumbnail}
              sharedMapUrl={item.mapUrl}
              objOnlineService={_objOnlineService}
              serviceNameAndFileName={_serviceNameAndFileName}
              mapTileAndRestTitle={_mapTitleAndRestTitle}
              isDownloading={false}
            />
            }
          />
        </View>
      </Container>

    }
  }
}