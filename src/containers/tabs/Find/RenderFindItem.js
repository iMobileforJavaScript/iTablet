import React from "react"
import { Component } from "react"
import {
  Image,
  Text,
  TouchableOpacity,
  View
} from "react-native"
import styles,{textHeight} from './Styles'

import {  Toast } from '../../../utils/index'

export default class RenderFindItem extends Component{

  props:{
    fileName:string,
    imageUrl:string,
    itemId:string,
    type:string,
    time:string,
    nickname:string,
  }



  render(){
    let date=new Date(this.props.time)
    let year = date.getFullYear()+"年"
    let month = (date.getMonth()+1)+"月"
    let day = date.getDate()+"日"
    let hour = date.getHours()+":"
    if(hour.length < 3){
      hour = "0"+hour
    }
    let minute = date.getMinutes()+''
    if(minute.length < 2){
      minute = "0"+minute
    }
    let time = year+month+day+" "+hour+minute
    return  <View>
      <TouchableOpacity style={styles.itemViewStyle}
            onPress={()=>{
              Toast.show('服务没有地图2')
            }
            }
      >
        <Image
          resizeMode={'contain'}
          style={styles.imageStyle}
          source={{uri:this.props.imageUrl}}/>

        <View >
          <Text style={styles.restTitleTextStyle} numberOfLines={1}>{this.props.fileName}</Text>
          <View style={styles.viewStyle2}>
            <Image style={styles.imageStyle2}
             resizeMode={'contain'}
                   source={require('../../../assets/tabBar/tab-我的-当前.png')}
            />
            <Text style={styles.textStyle2}>{this.props.nickname}</Text>
          </View>
          <View style={[styles.viewStyle2,{marginTop:5,}]}>
            <Image style={styles.imageStyle2}
                   resizeMode={'contain'}
                   source={require('../../../assets/tabBar/tmp-time-icon.png')}
            />
            <Text style={styles.textStyle2}>{time}</Text>
          </View>
          <View style={{flex:1}}/>
          <Text style={[styles.restTitleTextStyle,{lineHeight:textHeight,textAlign:'right',paddingRight:25}]}>...</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.separateViewStyle}/>
    </View>
  }
}