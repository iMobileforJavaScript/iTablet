import React,{Component} from 'react'
import Container from "../../../components/Container";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  SOnlineService,
} from 'imobile_for_reactnative'
import RenderFindItem from "./RenderFindItem"
import {  Toast } from '../../../utils/index'
import styles from './Styles'

export default class Find extends Component{

  constructor(props){
    super(props)
    this.state={
      data:[{}],
      isRefresh:false,
      loadCount:1,
    }
    this.flatListData=[]
    this.userDataCount = -1
    this._loadUserData(1)
  }

  _loadUserData =async (currentPage) =>{
    let arrObjContent = []
    try{
      let strUserData = await SOnlineService.getAllUserDataList(currentPage)

      let objUserData = JSON.parse(strUserData)
      this.userDataCount = objUserData.total
      let objArrUserDataContent = objUserData.content
      let contentLength = objArrUserDataContent.length
      for(let i = 0;i < contentLength;i++){
        let objContent = objArrUserDataContent[i]
        arrObjContent.push(objContent)
      }
      if(this.state.data.length === 1 && this.state.data[0].id === undefined){
        this.flatListData = this.flatListData.concat(arrObjContent)
        this.setState({data:this.flatListData})
      }
    }catch (e) {
      Toast.show('网络错误')
      this.setState({data:arrObjContent})
    }
    return arrObjContent
  }

  _onRefresh =async () =>{
    try{
      if(!this.state.isRefresh){
        this.setState({isRefresh:true})
        this.flatListData = await this._loadUserData(1,20)
        this.setState({isRefresh:false,data:this.flatListData})
      }
    }catch (e) {
      Toast.show('网络错误')
      this.setState({isRefresh:false})
    }

  }
  _loadData = async () => {
    try{
      let currentPage = this.state.loadCount++
      let arrData =  await this._loadUserData(currentPage)
      this.flatListData =this.flatListData.concat(arrData)
      this.setState({data:this.flatListData})
    }catch (e) {
      Toast.show('网络错误')
      this.setState({isLoadData:false})
    }

  }

  _footView() {
    if (this.userDataCount >= this.state.data.length) {
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

  _keyExtractor = (item,index)=>{
    if(item.id !== undefined){
      return item.id+''+index*index
    }
    return index*index
  }

  _selectRender = () =>{
    if(this.state.data.length === 1 && this.state.data[0].id === undefined){
      return <View style={styles.noDataViewStyle}>
        <ActivityIndicator
          color={'gray'}
          animating={true}
        />
        <Text>Loading...</Text>
      </View>
    }

    return <FlatList
      style={styles.haveDataViewStyle}
      data={this.state.data}
      renderItem={(data)=>{
        return <RenderFindItem
          fileName={data.item.fileName}
          type={data.item.type}
          nickname={data.item.nickname}
          time={data.item.lastModfiedTime}
          itemId={data.item.id}
          imageUrl={data.item.thumbnail}
        />
      }}
      refreshControl={
        <RefreshControl
          refreshing={this.state.isRefresh}
          onRefresh={this._onRefresh}
          colors={['gray', 'orange']}
          tintColor={'gray'}
          title={'刷新中...'}
          enabled={true}
        />
      }
      keyExtractor={this._keyExtractor}
      onEndReachedThreshold={0.1}
      onEndReached={this._loadData}
      ListFooterComponent={this._footView()}
    />
  }

  render(){
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '用户数据',
          withoutBack: true,
          navigation: this.props.navigation,
        }}
      >
        {this._selectRender()}
      </Container>
    )
  }
}

