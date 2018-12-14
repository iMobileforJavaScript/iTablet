import React,{Component} from 'react'
import {
  Image,
  SectionList,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Container } from '../../../../../components'
import styles, { textHeight } from "./Styles";
import NavigationService from "../../../../NavigationService";

export default class MyOnlineMap extends Component{


  constructor(props){
    super(props)
    this.scenes = this.props.navigation.getParam('scenes',[])
    this.mapInfos = this.props.navigation.getParam('mapInfos',[])
    this.state = {
      scenes:this.props.navigation.getParam('scenes',[]),
      mapInfos:this.props.navigation.getParam('mapInfos',[])
    }
  }
  _renderItem = (info) => {
    let mapTitle = info.item.mapTitle
    if(mapTitle !== undefined){
      return <TouchableOpacity

        onPress = {
          ()=>{
            NavigationService.navigate('ScanOnlineMap',{mapTitle: mapTitle,mapUrl:info.item.mapUrl})
          }
        }
      >
        <View  style={styles.itemViewStyle}>
          <Image
            resizeMode={'stretch'}
            style={styles.imageStyle}
            source={{uri:info.item.mapThumbnail}}/>
          <View >
            <Text style={[styles.restTitleTextStyle,]} numberOfLines={2}>{mapTitle}</Text>
            <Text numberOfLines={1}
              style={[styles.restTitleTextStyle,{fontSize:12,lineHeight:textHeight,textAlign:'right',paddingRight:25}]}>
              浏览地图</Text>
          </View>
        </View>
        <View style={styles.separateViewStyle}/>
      </TouchableOpacity>
    }
    return <View/>
  }

  _keyExtractor = (item,index) => {
    if(item.serviceId === undefined){
      return index*index+''
    }
    return item.serviceId + index*index+''
  }

  _renderSectionHeader = (section) => {
    let title = section.section.title
    if( title!== undefined){
      return <Text  style={styles.titleTextStyle}>{title}</Text>
    }
    return <View/>
  }

  _initSectionsData = ()=>{
    let sectionsData = []
    if(this.state.scenes.length > 0){
      if(this.state.mapInfos.length > 0){
        sectionsData = [{title:'二维地图',data:this.state.mapInfos},
          {title:'三维场景',data:this.state.scenes}]
      }else {
        sectionsData = [{title:'三维场景',data:this.state.scenes}]
      }

    }else{
      if(this.state.mapInfos.length > 0){
        sectionsData = [{title:'二维地图',data:this.state.mapInfos}]
      }
    }
    return sectionsData
  }

  render(){
    let arrSectionsData = this._initSectionsData()

    return <Container
      headerProps={{
        title: '在线地图',
        withoutBack: false,
        navigation: this.props.navigation,
      }}
    >
      <SectionList
        style={styles.haveDataViewStyle}
        sections={arrSectionsData}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        renderSectionHeader={this._renderSectionHeader}
      />
    </Container>
  }

}