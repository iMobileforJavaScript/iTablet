import React, { Component } from 'react'
import { View,PixelRatio,Image, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native'
import { BtnOne } from '../../components'
import { Container } from '../../components'
import NavigationService from '../NavigationService'
import { OpenMapfile } from 'imobile_for_javascript'
const src = require('../../assets/public/add_dataset.png')
const Fileicon = require('../../assets/public/icon-file.png')
export default class dataSourcelist extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.path = '/sdcard/SampleData'
    // data=[]
    this.state = {
      workspace: params.workspace,
      map: params.map,
      data: [],
      datasource:[{name:'1'},{name:'2'}],
    }
  }

  componentDidMount() {
    // this._adddata(this.path)
  }

  _addElement = (delegate, src, str) => {
    let element = <BtnOne BtnClick={delegate} BtnImageSrc={src} BtnText={str} />
    return (element)
  }

  _click_newdatasource = () => {
    NavigationService.navigate('NewDSource')
  }

   _adddata =async()=>{
     this.container.setLoading(true)
     let data = await this._getdatasourcelist(this.path)
     this.setState({data:data}, () => this.container.setLoading(false))
   }

  _getdatasourcelist = async path => {
    try {
      let OpenMapfileModule = new OpenMapfile()
      let filelist = await OpenMapfileModule.getfilelist(path)
      let data = []
      for (let i = 0; i < filelist.length; i++) {
        let isfile = await OpenMapfileModule.isdirectory(filelist[i])
        if (isfile === 'isfile') {
          await this._getdatasourcelist(filelist[i])
        }
        else {
          let filename = filelist[i].substr(filelist[i].lastIndexOf('.')).toLowerCase()
          if (filename === '.udb') {
            let datasource = { name: filelist[i].substr(filelist[i].lastIndexOf('/', filelist[i].lastIndexOf('/')) + 1),
              path:filelist[i],
            }
            data.push(datasource)
          }
        }
      }
      return data
    } catch (e) {
      console.log(e)
      return []
    }
  }

  _todataset = (w, m,p,n) => {
    NavigationService.navigate('DataSets',{workspace:w,map:m,path:p,name:n})
  }

  _renderItem = ({item}) => {
    return (<TouchableOpacity onPress={() => this._todataset(this.state.workspace, this.state.map,item.path,item.name)} style={styles.itemclick}>
      <Image source={Fileicon} style={styles.img}/>
      <Text style={styles.item}>{item.name}</Text>
    </TouchableOpacity>)
  }

  _keyExtractor = (item, index) => {
    return index
  }
  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        // initWithLoading
        headerProps={{
          title: '选择数据源',
          navigation: this.props.navigation,
          headerRight: [

          ],
        }}>
        <View style={styles.adddata}>
          {this._addElement(this._click_newdatasource, src, '新建数据源')}
        </View>
        <FlatList
          style={styles.container}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  item: {
    color: '#1296db',
    fontSize:20,
    margin:10,
    // flex:,
    // justifyContent: 'flex-start',
    // height: 39,
    paddingLeft: 5,
    textAlign:'center',
  },
  itemclick: {
    flexDirection:'row',
    // borderWidth: 1,
    // borderColor: '#DBDBDB',
    marginTop:15,
  },
  container: {

  },
  adddata: {
    width: 100,
    height: 100,
    marginTop: 15,
    marginLeft: 20,
  },
  img:{
    width:PixelRatio.get()*30,
    height:PixelRatio.get()*30,
    marginLeft:15,
    marginRight:10,
  },
})