import React,{PureComponent} from 'react'
import {
  Modal,
  TouchableOpacity,
  View,
  Dimensions,
  Text,
  Platform,
} from 'react-native'
import Toast from "../../../../utils/Toast";

import { color } from '../../../../styles'
import { SOnlineService } from 'imobile_for_reactnative'
const screenWidth = Dimensions.get('window').width



export default class PopupModal extends PureComponent{

  props:{
    onRefresh:()=>{},
    onModalClick:()=>{},
    isPublish:boolean,
    modalVisible:boolean,
    title:string,
    itemId:string,
    index:number,
  }

  constructor(props){
    super(props)

  }

  _onClose() {
    this.props.onModalClick(false)
  }

  _onRefresh(){
    this.props.onRefresh(this.props.itemId,this.props.isPublish,this.deleteService,this.props.index)
  }

  _onRequestClose (){

    if(Platform.OS === 'android'){
      this.props.onModalClick(false)
    }

  }
  _publishButton = (isPublish)=>{
    let title
    if(isPublish){
      title = '设为共有服务'
    }else{
      title = '设为私有服务'
    }
    return <TouchableOpacity
      style={{backgroundColor:color.content}}
      onPress = {
        async ()=>{
         let result =  await SOnlineService.changeServiceVisibilityWithServiceId(this.props.itemId,isPublish)
          if(typeof result === 'boolean' && result){
            Toast.show('设置成功')
            this._onRefresh()
            this._onClose()
          }else{
            Toast.show('设置失败')
          }
        }
      }
    >
      <Text style={{lineHeight:50,width:screenWidth,position:'relative',textAlign:'center',fontSize:16}}
      >{title}</Text>
      <View style={{width:screenWidth,height:1,backgroundColor: color.theme}}/>
    </TouchableOpacity>
  }

  _deleteButton = (title)=>{
    return <TouchableOpacity
      style={{backgroundColor:color.content}}
      onPress = {
        async ()=>{
          let result = await SOnlineService.deleteServiceWithServiceId(this.props.itemId)
          if(typeof result === 'boolean' && result){
            this.deleteService = true
            this._onRefresh()
            Toast.show('删除成功')
            this._onClose()
          }else{
            Toast.show('删除失败')
          }
        }
      }
    >
      <Text style={{lineHeight:50,width:screenWidth,position:'relative',textAlign:'center',fontSize:16}}
      >{title}</Text>
      <View style={{width:screenWidth,height:1,backgroundColor: color.theme}}/>
    </TouchableOpacity>
  }


  render(){

    let visible = this.props.modalVisible
    return (<Modal
      animationType={'slide'}
      transparent={true}
      visible={visible}
      onRequestClose={this._onRequestClose}
    >
      <TouchableOpacity
        style={{flex:1,}}
        activeOpacity={1}
        onPress={()=>{
          this._onClose()
        }}
      >
        <View style={{position: 'absolute',bottom:0}}>
          <View style={{width:screenWidth,height:4,backgroundColor:color.theme}}/>
          {this._publishButton(!this.props.isPublish)}
          <View style={{width:screenWidth,height:4,backgroundColor:color.theme}}/>
          {this._deleteButton('删除')}
        </View>
      </TouchableOpacity>

    </Modal>)
  }
}