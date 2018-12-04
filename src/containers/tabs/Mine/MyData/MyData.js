import React,{Component} from 'react'
import {
  View,
  Text,
  Image,
} from 'react-native'
import Container from "../../../../components/Container";

export default class MyData extends Component{
  render(){
    return <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '我的iTablet',
          withoutBack: false,
          navigation: this.props.navigation,
          // headerRight: (
          //   <BtnOne
          //     image={require('../../../assets/public/icon-setting-white.png')}
          //     onPress={}
          //   />
          // ),
        }}
      >
      <View style={{flex:1,backgroundColor:'#fff'}}>
        <Text>我的数据</Text>
      </View>
      </Container>



  }
}