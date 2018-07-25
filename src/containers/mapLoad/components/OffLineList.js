import * as React from 'react'
import { View, StyleSheet, Dimensions, Text, FlatList, TouchableOpacity, PixelRatio } from 'react-native'
import NavigationService from '../../../containers/NavigationService'   //导航模块
import { Utility, Workspace, MapControl } from 'imobile_for_javascript'
import { BtnOne } from '../../../components'
import { Toast,scaleSize} from '../../../utils'
const icon_workspace = require('../../../assets/MapLoad/icon-open-workspace.png')
const icon_udb = require('../../../assets/MapLoad/icon-opne-udb.png')
const icon_webudb = require('../../../assets/MapLoad/icon-open-webudb.png')
const icon_newudb = require('../../../assets/MapLoad/icon-new-datasource.png')
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
    
 props:{
    Workspace:any,
    Map:any,
 }
    
  constructor(props){
     super(props)
     this.workspace=this.props.Workspace
     this.map=this.props.map
     this.mapControl=this.props.mapControl
  }
  _offLine_More = () => {
    Toast.show('待完善')
  }


  _btn_workspace_click = () => {
    if(this.workspace !='noworkspace'){
      NavigationService.navigate('WorkspaceFlieList',{workspace:this.workspace,map:this.map,mapControl:this.mapControl})
    }
    else{
      NavigationService.navigate('WorkspaceFlieList',{})
    }
    
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
  // NavigationService.navigate('Directory', {})
  // let homePath = Utility.getHomeDirectory()
  // let list = Utility.getDirectoryContent(homePath)
  _addElement = (delegate, src, str, style) => {
    if (typeof delegate == 'function' && typeof str == 'string') {

      let element = <BtnOne BtnClick={delegate} BtnImageSrc={src} BtnText={str} titleStyle={styles.btntop} />
      return (element)
    } else {
      throw Error('BthBar: please check type of params')
    }
  }


  render() {
    return (
      <View style={styles.container}>
        {this._addElement(this._btn_workspace_click, icon_workspace, testData[0].key)}
        {this._addElement(this._btn_udb_click, icon_udb, testData[1].key)}
        {this._addElement(this._btn_web_click, icon_webudb, testData[2].key)}
        {this._addElement(this._btn_newudb_click, icon_newudb, testData[3].key)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  item: {

  },
  container: {
    width: 0.9 * width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    paddingTop:5,
    height:105,
    // backgroundColor:'white'
  },
  btntop:{
    width: 0.15 * width,
    marginTop:scaleSize(10),
  }
})