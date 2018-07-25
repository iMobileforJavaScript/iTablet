import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  PixelRatio,
} from 'react-native';
import { Container} from '../../components'
import { OpenMapfile,WorkspaceConnectionInfo ,Action} from 'imobile_for_javascript'
import { Toast } from '../../utils'
import NavigationService from '../NavigationService'
const Filesicon = require('../../assets/public/icon-files.png')
const Fileicon = require('../../assets/public/icon-file.png')
export default class WorkSpaceFileList extends React.Component {

  props: {
    title: string,
    navigation: Object,
    nav: Object,
  }
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.workspace = params.workspace ? params.workspace : 'noworkspace'
    this.map = params.map ? params.map : 'nomap'
    this.mapControl=params.mapControl? params.mapControl : 'nomapControl'
    const { nav } = this.props
    this.routes = nav.routes
    this.path = '/sdcard/sampleData';
    this.state = {
      data: [],
      backpath: ''

    }

  }

  componentDidMount() {
    this.container.setLoading(true)
    this._getfilelist(this.path);
  }



  _offLine_More = () => {
    Toast.show('无法打开此文件');
  }


  _getfilelist = async (path) => {
    let OpenMapfileModule = new OpenMapfile();
    let result = await OpenMapfileModule.isdirectory(path);
    if (result == 'notisfile') {
      let filename = path.substr(path.lastIndexOf('.')).toLowerCase();
      if (filename == '.smwu') {
        let openpath = path.substr(path.indexOf('/') + 7, path.length);
        this._toloadmapview(openpath)
      }
      else {
        this._offLine_More();
      }

    }
    else {
      let filelist = await OpenMapfileModule.getfilelist(path);
      for (i = 0; i < filelist.length; i++) {
        let isfile = await OpenMapfileModule.isdirectory(filelist[i]);
        filelist[i] = { key: filelist[i], isfile: isfile };
      }
      this.setState({
        data: filelist,
        backpath: path
      });
      this.container.setLoading(false)
    }
  }


  _toloadmapview = async(path) => {

    if (this.workspace != 'noworkspace' && this.map != 'nomap'&&this.mapControl !='nomapControl') {
      let key = ''
      for (let index = 0; index < this.routes.length; index++) {
        if (this.routes[index].routeName === 'MapView') {
          key = this.routes[index + 1].key
        }
      }
      await this.map.close()
      let WorkspaceConnectionInfoModule= new WorkspaceConnectionInfo()
      let workspaceCOnnectionInfo =await WorkspaceConnectionInfoModule.createJSObj()
      let openpath='/sdcard'+path
      await workspaceCOnnectionInfo.setServer(openpath)
      await workspaceCOnnectionInfo.setType(9)
      await this.workspace.open(workspaceCOnnectionInfo)
      await this.map.setWorkspace(this.workspace)
      this.mapName = await this.workspace.getMapName(0)
      await this.map.open(this.mapName)
      // await this.mapControl.setAction(Action.SELECT)
      await this.map.refresh()
      NavigationService.goBack(key)
    }
    else {
      NavigationService.navigate('MapView', { path: path })
    }
  }


  _refresh = async (path) => {

    await this._getfilelist(path);


  }

  _toback = async () => {
    if (this.state.backpath == '/sdcard/sampleData') {
      return;
    }
    else {
      let backpath = this.state.backpath.substr(0, this.state.backpath.lastIndexOf("/", this.state.backpath.lastIndexOf('/')))
      this.setState({ backpath: backpath });
      await this._getfilelist(backpath);
    }
  }

  headerback = () => {
    if (this.state.backpath == '/sdcard/sampleData' || this.state.backpath == '/sdcard/sampleData') {
      return null
    }
    else {
      return <TouchableOpacity onPress={() => this._toback()}><Text style={styles.back}>返回上一层目录</Text></TouchableOpacity>
    }
  }
  Fileicon = ({ item }) => {
    if (item.isfile == 'isfile') {
      return (
        <TouchableOpacity onPress={() => this._refresh(item.key)} style={styles.row}>
          <Image source={Filesicon} style={styles.img} />
          <Text style={styles.item}>{item.key}</Text>
        </TouchableOpacity>
      )
    }
    else {
      return <TouchableOpacity onPress={() => this._refresh(item.key)} style={styles.row}>
        <Image source={Fileicon} style={styles.img} />
        <Text style={styles.item}>{item.key}</Text>
      </TouchableOpacity>
    }


  }

  _keyExtractor = item => {
    return item.key
  }

  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        initWithLoading
        headerProps={{
          title: '选择文件',
          navigation: this.props.navigation,
          headerRight: [

          ],
        }}>
        <FlatList
          style={styles.container}
          ListHeaderComponent={this.headerback()}
          data={this.state.data}
          renderItem={this.Fileicon}
          keyExtractor={this._keyExtractor}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  listcontain: {
    marginTop: 15,
  },
  item: {
    fontSize: 20,
    margin: 10,
    flex: 1,
    // borderBottomWidth:1,
    // borderBottomColor:'#1296db'
  },
  back: {
    fontSize: 20,
    color: '#1296db',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 15,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,

  },
  img: {
    width: PixelRatio.get() * 30,
    height: PixelRatio.get() * 30,
    marginLeft: 15,
    marginRight: 10,
  },
});