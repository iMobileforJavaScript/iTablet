import React from 'react'
import { View, PixelRatio, Image, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native'
import { BtnOne } from '../../components'
import { Container } from '../../components'
import NavigationService from '../NavigationService'
const src = require('../../assets/public/add_dataset.png')
const Fileicon = require('../../assets/public/icon-file.png')
export default class dataSourcelist extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.map = params.map
    this.mapControl=params.mapControl
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    this._adddata()
  }

  _addElement = (delegate, src, str) => {
    let element = <BtnOne BtnClick={delegate} BtnImageSrc={src} BtnText={str} />
    return (element)
  }

  _click_newdatasource = () => {
    NavigationService.navigate('NewDSource')
  }

  _adddata = async () => {
    let result = await this._getdatasourcelist()
    this.setState({ data: result })
    this.container.setLoading(false)
  }

  _getdatasourcelist = async () => {
    this.container.setLoading(true)
    try {
      let datalist = []
      let count = await (await this.workspace.getDatasources()).getCount()
      for (let index = 0; index < count; index++) {
        let datasource = await (await this.workspace.getDatasources()).get(index)
        let datasourcename = await datasource.getAlias()
        let result = { datasource: datasource, name: datasourcename }
        datalist.push(result)
      }
      return datalist
    } catch (error) {
      console.log(error)
      return
    }

    // let OpenMapfileModule = new OpenMapfile();
    // let filelist = await OpenMapfileModule.getfilelist(path);
    // for (let i = 0; i < filelist.length; i++) {
    //   let isfile = await OpenMapfileModule.isdirectory(filelist[i]);
    //   if (isfile == 'isfile') {
    //     await this._getdatasourcelist(filelist[i]);
    //   }
    //   else {
    //     let filename = filelist[i].substr(filelist[i].lastIndexOf('.')).toLowerCase();
    //     if (filename == '.udb') {
    //       datasource = { name: filelist[i].substr(filelist[i].lastIndexOf('/', filelist[i].lastIndexOf('/')) + 1),
    //                      path:filelist[i]
    //                     };
    //       this.data.push(datasource);
    //     }
    //   }
    // }
  }

  _todataset = (w, m, p, n) => {
    NavigationService.navigate('DataSets', { workspace: w, map: m, datasource: p, name: n ,mapControl:this.mapControl})
  }

  _renderItem = ({ item }) => {
    return (<TouchableOpacity onPress={() => this._todataset(this.workspace, this.map, item.datasource, item.name)} style={styles.itemclick}>
      <Image source={Fileicon} style={styles.img} />
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
        initWithLoading
        headerProps={{
          title: '选择数据源',
          navigation: this.props.navigation,
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
    fontSize: 20,
    margin: 10,
    // flex:,
    // justifyContent: 'flex-start',
    // height: 39,
    paddingLeft: 5,
    textAlign: 'center',
  },
  itemclick: {
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: '#DBDBDB',
    marginTop: 15,
  },
  container: {

  },
  adddata: {
    width: 100,
    height: 100,
    marginTop: 15,
    marginLeft: 20,
  },
  img: {
    width: PixelRatio.get() * 30,
    height: PixelRatio.get() * 30,
    marginLeft: 15,
    marginRight: 10,
  },
})