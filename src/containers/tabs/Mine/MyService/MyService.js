import React, { Component } from 'react'
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  SectionList,
} from 'react-native'
import { Container } from '../../../../components'
import RenderServiceItem from './RenderServiceItem'
import { SOnlineService,Utility } from 'imobile_for_reactnative'
import styles from './Styles'
import PopupModal from "./PopupModal";
import Toast from "../../../../utils/Toast";

/**
 * 变量命名规则：私有为_XXX, 若变量为一个对象，则命名为 objXXX,若为一个数组，则命名为 arrXXX,...
 * */

let _arrPrivateServiceList=[]
let _arrPublishServiceList=[]
/** 当前页加载多少条服务数据*/
let _iServicePageSize = 9
let _loadCount = 1
export default class MyService extends Component{
  props: {
    navigation: Object,
    user: Object,
    setUser: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      arrPrivateServiceList:_arrPrivateServiceList,
      arrPublishServiceList:_arrPublishServiceList,
      selections:[{title:'私有服务',data:_arrPrivateServiceList},
        {title:'共有服务',data:_arrPublishServiceList}],
      modalIsVisible:false,
      isRefreshing:false,
      isLoadingData:false,
    }
    this._initSectionsData(1,_iServicePageSize)
    this._renderItem = this._renderItem.bind(this)
    this._renderSectionHeader=this._renderSectionHeader.bind(this)
  }


  _initSectionsData= async (currentPage, pageSize) =>{
    try{
      let strServiceList = await SOnlineService.getServiceList(1, pageSize)
      let objServiceList = JSON.parse(strServiceList)
      this.serviceListTotal = objServiceList.total
      let arrPublishServiceList=[]
      let arrPrivateServiceList=[]
      /** 构造SectionsData数据*/
      for (let page = 1; page <= currentPage; page++) {
        if (page > 1) {
          strServiceList = await SOnlineService.getServiceList(page, pageSize)
          objServiceList = JSON.parse(strServiceList)
        }

        let objArrServiceContent = objServiceList.content
        for (let i = 0; i < objArrServiceContent.length; i++){
          let objContent = objArrServiceContent[i]
          let strThumbnail = objContent.thumbnail
          let strRestTitle = objContent.resTitle
          let strID = objContent.id
          let bIsPublish = false
          let objArrAuthorizeSetting = objContent.authorizeSetting
          for(let j = 0;j < objArrAuthorizeSetting.length;j++){
            let strPermissionType = objArrAuthorizeSetting[j].permissionType
            if(strPermissionType === 'READ'){
              bIsPublish = true
              break
            }
          }
          let strSectionsData = '{"restTitle":"'+strRestTitle+'","thumbnail":"'+strThumbnail+'","id":"'+strID+'","isPublish":'+bIsPublish+'}'
          let objSectionsData = JSON.parse(strSectionsData)
          if(bIsPublish){
            arrPublishServiceList.push(objSectionsData)
          }else{
            arrPrivateServiceList.push(objSectionsData)
          }

        }
      }
      /** 重新赋值，避免浅拷贝*/

      _arrPrivateServiceList = arrPrivateServiceList
      _arrPublishServiceList = arrPublishServiceList
      if(_arrPrivateServiceList.length === 0){
        _arrPrivateServiceList.push({})
      }
      if(_arrPublishServiceList.length === 0){
        _arrPublishServiceList.push({})
      }
      this.setState({arrPrivateServiceList:_arrPrivateServiceList,arrPublishServiceList:_arrPublishServiceList})
    }catch (e) {
      Toast.show('网络错误,下拉刷新数据')
      this.setState({ isRefreshing: false})
    }

  }

  _renderSectionHeader(section){
    let title = section.section.title
    if( title!== undefined){
      return <Text  style={styles.titleTextStyle}>{title}</Text>
    }
    return <View/>
  }
  _renderItem (info){
    let restTitle = info.item.restTitle
    if(restTitle!== undefined){
      let imageUri = info.item.thumbnail
      let isPublish = info.item.isPublish
      let itemId = info.item.id
      return <RenderServiceItem
        onItemPress={this._onItemPress}
        imageUrl={imageUri}
        restTitle={restTitle}
        isPublish={isPublish}
        itemId={ itemId}
      />
    }
    return <View>
      <Text style={[styles.titleTextStyle,{backgroundColor:'#353537',textAlign:'center'}]}>没有服务</Text>
    </View>
  }

  _keyExtractor = (item,index) => {
    if(item.id === undefined){
      return index*index
    }
    return item.id
  }

  _onItemPress=(isPublish,itemId,restTitle)=>{
    this.onClickItemId = itemId
    this.onClickItemRestTitle = restTitle
    this.onClickItemIsPublish = isPublish
    this.setState({modalIsVisible:true})
  }

  _onModalClick=(isVisible)=>{
    this.setState({modalIsVisible:isVisible})
  }

  _renderModal= ()=>{
    if(this.state.modalIsVisible){
      return <PopupModal
        onRefresh={this._onModalRefresh}
        onModalClick={this._onModalClick}
        modalVisible={(this.state.modalIsVisible)}
        title = {this.onClickItemRestTitle}
        isPublish={this.onClickItemIsPublish}
        itemId ={this.onClickItemId}/>
    }
  }

  _onModalRefresh = async () => {
    if (!this.state.isRefreshing) {
      this.setState({ isRefreshing: true})
      await this._initSectionsData(_loadCount,_iServicePageSize)
      this.setState({ isRefreshing: false})
    }
  }

  _onModalRefresh2 = async (itemId,isPublish,isDelete)=>{

    let index = 99999
    if(isPublish){
      let length = _arrPublishServiceList.length

      if(_arrPrivateServiceList.length >0 && _arrPrivateServiceList[0].restTitle === undefined){
        _arrPrivateServiceList.splice(0,1)
      }

      for(let i = 0;i < length;i++){

        let objService = _arrPublishServiceList[i]
        let id = objService.id
        if(id === itemId){
          index = i
          break
        }
      }
      if(index  !== 99999){
        if(typeof isDelete === 'boolean' && isDelete){
          _arrPublishServiceList.splice(index,1)
        }else{
          _arrPrivateServiceList.push(_arrPublishServiceList[index])
          _arrPublishServiceList.splice(index,1)
        }

      }

    }else{
      let length = _arrPrivateServiceList.length
      if(_arrPublishServiceList.length >0 && _arrPublishServiceList[0].restTitle === undefined){
        _arrPublishServiceList.splice(0,1)
      }
      for(let i = 0;i < length;i++){
        let objService = _arrPrivateServiceList[i]
        let id = objService.id
        if(id === itemId){
          index = i
          break
        }
      }
      if(index  !== 99999){
        if(typeof isDelete === 'boolean' && isDelete){
          _arrPrivateServiceList.splice(index,1)
        }else{
          _arrPublishServiceList.push(_arrPrivateServiceList[index])
          _arrPrivateServiceList.splice(index,1)
        }


      }
    }
    this.setState({arrPrivateServiceList:_arrPrivateServiceList,arrPublishServiceList:_arrPublishServiceList})
  }

  _onRefresh = async () => {
    if (!this.state.isRefreshing) {
      _loadCount = 1
      this.setState({ isRefreshing: true})
      await this._initSectionsData(1,_iServicePageSize)
      this.setState({ isRefreshing: false})
    }
  }
  _loadData = async () => {
    let publishLength = _arrPublishServiceList.length
    let privateLength = _arrPrivateServiceList.length
    let loadServiceCount = publishLength + privateLength
    if(!this.state.isLoadingData && this.serviceListTotal > _loadCount*_iServicePageSize && this.serviceListTotal > loadServiceCount){
      this.setState({isLoadingData:true})
      _loadCount = ++_loadCount
      await this._initSectionsData(_loadCount,_iServicePageSize)

      this.setState({isLoadingData:false})
    }
  }
  _footView() {
    if (this.state.isLoadingData) {
      return (
        <View
          style={{
            flex:1,
            height:50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ActivityIndicator
            style={{flex:1,height:30,justifyContent:'center',alignItems:'center'}}
            color={'orange'}
            animating ={true}
          />
          <Text
            style={{
              flex: 1,
              lineHeight: 20,
              fontSize: 16,
              textAlign: 'center',
              color:'white'
            }}
          >
            加载中...
          </Text>
        </View>
      )
    } else {
      return <View>
        <Text
          style={{
            flex: 1,
            lineHeight: 30,
            fontSize: 12,
            textAlign: 'center',
          }}
        >-----这是底线-----</Text>
      </View>
    }
  }
  _render=()=>{
    if(_arrPublishServiceList.length === 0 && _arrPrivateServiceList.length === 0){
      return <View style={styles.noDataViewStyle}>
        <ActivityIndicator
          color={'gray'}
          animating={true}
        />
        <Text>Loading...</Text>
      </View>
    }else {
      return <View style={{flex:1}}>
        <SectionList
          style={styles.haveDataViewStyle}
          sections={[{title:'私有服务',data:this.state.arrPrivateServiceList},
            {title:'共有服务',data:this.state.arrPublishServiceList}]}
          renderItem={this._renderItem}
          renderSectionHeader={this._renderSectionHeader}
          keyExtractor={this._keyExtractor}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              colors={['orange', 'red']}
              tintColor={'white'}
              title={'刷新中...'}
              enabled={true}
            />
          }
          onEndReachedThreshold={0.1}
          onEndReached={this._loadData}
          ListFooterComponent={this._footView()}
        />
        {this._renderModal()}
      </View>
    }
  }

  render(){
    return (<Container
      ref = { ref => this.container=ref }
      headerProps={{
        title: '我的服务',
        withoutBack: false,
        navigation: this.props.navigation,
      }}
    >
      {this._render()}

    </Container>)
  }

}
