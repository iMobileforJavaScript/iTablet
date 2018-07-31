import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  View,
} from 'react-native'
import { Container } from '../../components'
import { OpenMapfile, WorkspaceConnectionInfo, EngineType, Action, Point2D } from 'imobile_for_javascript'
import { Toast, scaleSize } from '../../utils'
import NavigationService from '../NavigationService'
import { color } from '../../styles'
const Filesicon = require('../../assets/public/icon-files.png')
const Fileicon = require('../../assets/public/icon-file.png')
export default class WorkSpaceFileList extends Component {

  props: {
    title: string,
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    const { nav } = this.props
    this.workspace = params.workspace ? params.workspace : 'noworkspace'
    this.map = params.map ? params.map : 'nomap'
    this.mapControl = params.mapControl ? params.mapControl : 'nomapControl'
    this.routes = nav.routes
    this.path = '/sdcard/sampleData'
    this.title = params.title
    this.need = params.need
    this.state = {
      data: [],
      backpath: '',

    }
  }

  componentDidMount() {
    this.container.setLoading(true)
    this._getfilelist(this.path)
  }



  _offLine_More = () => {
    Toast.show('无法打开此类型文件')
  }


  _getfilelist = async path => {
    let OpenMapfileModule = new OpenMapfile()
    let result = await OpenMapfileModule.isdirectory(path)
    if (result == 'notisfile') {
      let filename = path.substr(path.lastIndexOf('.')).toLowerCase()
      if (filename === '.smwu' && this.need === 'workspace') {
        let openpath = path.substr(path.indexOf('/') + 7, path.length)
        this._toloadmapview(openpath, type = '')
      }
      else if (filename === '.udb' && this.need === 'udb') {
        this._toloadmapview(path, type = 'UDB')
      }
      else {
        this._offLine_More()
      }
    }
    else {
      let filelist = await OpenMapfileModule.getfilelist(path)
      for (i = 0; i < filelist.length; i++) {
        let isfile = await OpenMapfileModule.isdirectory(filelist[i])
        filelist[i] = { key: filelist[i], isfile: isfile }
      }
      this.setState({
        data: filelist,
        backpath: path,
      })
      this.container.setLoading(false)
    }
  }


  _toloadmapview = async (path, type) => {
    if (this.workspace != 'noworkspace' && this.need === 'workspace') {
      let key = ''
      for (let index = 0; index < this.routes.length; index++) {
        if (this.routes[index].routeName === 'MapView') {
          key = this.routes[index + 1].key
        }
      }
      await this.map.close()
      await this.workspace.closeAllDatasource()
      let WorkspaceConnectionInfoModule = new WorkspaceConnectionInfo()
      let workspaceCOnnectionInfo = await WorkspaceConnectionInfoModule.createJSObj()
      let openpath = '/sdcard' + path
      await workspaceCOnnectionInfo.setServer(openpath)
      await workspaceCOnnectionInfo.setType(9)
      await this.workspace.open(workspaceCOnnectionInfo)
      await this.map.setWorkspace(this.workspace)
      this.mapName = await this.workspace.getMapName(0)
      await this.map.open(this.mapName)
      await this.mapControl.setAction(Action.SELECT)
      await this.map.refresh()
      NavigationService.goBack(key)
    }
    if (this.workspace != 'noworkspace' && this.need === 'udb') {
      // let str = path.substr(path.lastIndexOf('/') + 1)
      // let name = str.substr(0, str.lastIndexOf('.'))
      await this.map.close()
      await this.workspace.closeAllDatasource()
      // let datasources = await this.workspace.getDatasources()
      // let count = await datasources.getCount()
      // for (let index = 0; index < count; index++) {
      //   datasourcename = await (await datasources.get(index)).getAlias()
      //   if (name === datasourcename) {
      //     Toast.show('空间中此数据源已被打开')
      //     return
      //   }
      // }
      let key = ''
      for (let index = 0; index < this.routes.length; index++) {
        if (this.routes[index].routeName === 'MapView') {
          key = this.routes[index + 1].key
        }
      }
      // this.DSParams = { server: path, engineType: EngineType.UDB }
      // await this.workspace.openDatasource(this.DSParams)
      // await this.mapControl.setAction(Action.SELECT)
      // await this.map.refresh()
      // NavigationService.goBack(key)

      const point2dModule = new Point2D()

      // await this.map.setScale(0.0001)
      navigator.geolocation.getCurrentPosition(
        position => {
          let lat = position.coords.latitude
          let lon = position.coords.longitude
          ;(async () => {
            let centerPoint = await point2dModule.createObj(lon, lat)
            await this.map.setCenter(centerPoint)
            await this.mapControl.setAction(Action.PAN)
            await this.map.refresh()
            key && NavigationService.goBack(key)
          }).bind(this)()
        }
      )
      this.DSParams = { server: path, engineType: EngineType.UDB }
      let layerIndex = 0

      let dsBaseMap = await this.workspace.openDatasource(this.DSParams)

      let dataset = await dsBaseMap.getDataset(layerIndex)
      await this.map.addLayer(dataset, true)
    }
    else {
      NavigationService.navigate('MapView', { path: path, type: type })
    }
  }


  _refresh = async path => {

    await this._getfilelist(path)


  }

  _toback = async () => {
    if (this.state.backpath === '/sdcard/sampleData') {
      return
    }
    else {
      let backpath = this.state.backpath.substr(0, this.state.backpath.lastIndexOf("/", this.state.backpath.lastIndexOf('/')))
      this.setState({ backpath: backpath })
      await this._getfilelist(backpath)
    }
  }

  headerback = () => {
    if (this.state.backpath === '/sdcard/sampleData' || this.state.backpath === '/sdcard/sampleData') {
      return null
    }
    else {
      return <TouchableOpacity onPress={() => this._toback()}><Text style={styles.back}>返回上一层目录</Text></TouchableOpacity>
    }
  }
  Fileicon = ({ item }) => {
    if (item.isfile === 'isfile') {
      return (
        <TouchableOpacity onPress={() => this._refresh(item.key)} style={styles.row}>
          <View><Image source={Filesicon} style={styles.img} /></View>
          <Text style={styles.item}>{item.key}</Text>
        </TouchableOpacity>
      )
    }
    else {
      return <TouchableOpacity onPress={() => this._refresh(item.key)} style={styles.row}>
        <View><Image source={Fileicon} style={styles.img} /></View>
        <Text style={styles.item}>{item.key}</Text>
      </TouchableOpacity>
    }
  }

  itemseparator = () => {
    return (<View style={styles.itemseparator} />)
  }

  _keyExtractor = item => {
    return item.key
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => this.container = ref}
        initWithLoading
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
        }}>
        <FlatList
          ItemSeparatorComponent={this.itemseparator}
          style={styles.container}
          ListHeaderComponent={this.headerback}
          data={this.state.data}
          renderItem={this.Fileicon}
          keyExtractor={this._keyExtractor}
        />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background2,
  },
  item: {
    fontSize: 20,
    // justifyContent:'center',
    alignItems: 'center',
  },
  back: {
    fontSize: 20,
    color: '#1296db',
    paddingTop: scaleSize(30),
    paddingBottom: scaleSize(30),
    paddingLeft: scaleSize(30),
    height: scaleSize(100),
  },
  row: {
    flexDirection: 'row',
    borderColor: color.background3,
    borderWidth: scaleSize(2),
    backgroundColor: 'white',
    // justifyContent:'center',
    alignItems: 'center',
  },
  img: {
    width: scaleSize(80),
    height: scaleSize(80),
    marginLeft: scaleSize(30),
    marginRight: scaleSize(30),
  },
  itemseparator: {
    height: scaleSize(6),
  },
})