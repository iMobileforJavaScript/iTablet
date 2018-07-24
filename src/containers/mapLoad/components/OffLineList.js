import * as React from 'react'
import { View, StyleSheet, Dimensions, Text, FlatList, TouchableOpacity, PixelRatio } from 'react-native'
import NavigationService from '../../../containers/NavigationService'   //导航模块
import { Utility } from 'imobile_for_javascript'
import { BtnOne } from '../../../components'
import { Toast } from '../../../utils'
const src = require('../../../assets/public/data_collect.png')
const width = Dimensions.get('window').width
const testData = [{ key: '打开文件型工作空间' }, { key: "打开文件型数据源" }, { key: "打开web型数据源" }, { key: "新建文件型数据源" }]

class Item extends React.Component {

  props: {
    onPress: () => {},
    text: string,
  }

  action = () => {
    this.props.onPress && this.props.onPress()
  }

  render() {
    return (
      <View>
        <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={this.action} >
          <View style={styles.item}><Text style={{ fontSize: 18 }}>{this.props.text ? this.props.text : 'item'}</Text></View>
        </TouchableOpacity>
        <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#bbbbbb' }} />
      </View>
    )
  }
}

export default class OffLineList extends React.Component {

  _offLine_More = () => {
    Toast.show('待完善')
  }


  _btn_click = item => {
    if(item === '打开文件型工作空间'){
      NavigationService.navigate('WorkspaceFlieList')
    }
    else{
      this._offLine_More()
    }
    // NavigationService.navigate('Directory', {})
    // let homePath = Utility.getHomeDirectory()
    // let list = Utility.getDirectoryContent(homePath)
  }

  _renderItem = ({ item }) => {
    let key = item.key
    return (
      <BtnOne BtnClick={() => this._btn_click(item.key)} BtnImageSrc={src} BtnText={item.key} titleStyle={{ width: 90, paddingLeft: 15 }} />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={testData}
          renderItem={this._renderItem}
          horizontal={false}
          numColumns={4}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    justifyContent: 'center',
    width: width,
    paddingLeft: 15,
  },
  container: {
    width: 0.8*width,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
})
