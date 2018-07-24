import * as React from 'react'
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, PixelRatio } from 'react-native'
import NavigationService from '../../../containers/NavigationService'   //导航模块
import { BtnOne } from '../../../components'
const src = require('../../../assets/public/data_collect.png')
const width = Dimensions.get('window').width
const testData = [{ key: '打开文件型工作空间' }, { key: "打开文件型数据源" }, { key: "打开web型数据源" }, { key: "新建文件型数据源" }]

// class Item extends React.Component {
//
//   props: {
//     onPress: () => {},
//     text: string,
//   }
//
//   action = () => {
//     this.props.onPress && this.props.onPress()
//   }
//
//   render() {
//     return (
//       <View>
//         <TouchableOpacity activeOpacity={0.8} style={styles.item} onPress={this.action} >
//           <View style={styles.item}><Text style={{ fontSize: 18 }}>{this.props.text ? this.props.text : 'item'}</Text></View>
//         </TouchableOpacity>
//         <View style={{ height: 2 / PixelRatio.get(), backgroundColor: '#bbbbbb' }} />
//       </View>
//     )
//   }
// }

export default class OffLineList extends React.Component {

  _offLine_More = () => {

  }


  _btn_workspace_click = () => {
    NavigationService.navigate('WorkspaceFlieList')
  }
  _btn_udb_click = () => {
    this._offLine_More()
  }
  _btn_web_click = () => {
    this._offLine_More()
  }
  _btn_newudb_click = () => {
    this._offLine_More()
  }

  _addElement = (delegate, src, str, style) => {
    if (typeof delegate === 'function' && typeof str === 'string') {

      let element = <BtnOne BtnClick={delegate} BtnImageSrc={src} BtnText={str} titleStyle={style} />
      return (element)
    } else {
      throw Error('BthBar: please check type of params')
    }
  }


  render() {
    return (
      <View style={styles.container}>
        {this._addElement(this._btn_workspace_click, src, testData[0].key, { width: 0.15 * width })}
        {this._addElement(this._btn_udb_click, src, testData[1].key, { width: 0.15 * width })}
        {this._addElement(this._btn_web_click, src, testData[2].key, { width: 0.15 * width })}
        {this._addElement(this._btn_newudb_click, src, testData[3].key, { width: 0.15 * width })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {
  },
  container: {
    width: 0.8 * width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    alignSelf: 'center',
  },
})
