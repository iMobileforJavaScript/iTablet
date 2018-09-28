import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  View,
  Platform,
} from 'react-native'
import { Container, EmptyView } from '../../components'
import { WorkspaceConnectionInfo, EngineType, Action, Point2D, Utility, WorkspaceType,Workspace } from 'imobile_for_javascript'
import { Toast, scaleSize } from '../../utils'
import { ConstPath } from '../../constains'
import NavigationService from '../NavigationService'
import { color } from '../../styles'

export default class WorkSpaceFileList extends Component {

  props: {
    title: string,
    navigation: Object,
    nav: Object,

    setEditLayer: () => {},
    setSelection: () => {},
    setBufferSetting: () => {},
    setOverlaySetting: () => {},
    setAnalystLayer: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.map = params.map
    this.mapControl = params.mapControl
    this.path = ConstPath.LocalDataPath
    this.title = params.title
    this.need = params.need
    this.state = {
      data: [],
      backPath: '',
      showData: false,
    }
  }

  componentDidMount() {
    (async function () {
      try {
        this.container.setLoading(true)
        let exist = await Utility.fileIsExistInHomeDirectory(ConstPath.LocalDataPath)
        if (!exist) {
          this.setState({
            showData: true,
          }, () => {
            this.container.setLoading(false)
          })
        } else {
          this.getFileList({path: this.path})
        }
      } catch (e) {
        this.container.setLoading(false)
      }
    }).bind(this)()
  }

  clearData = () => {
    this.props.setEditLayer(null)
    this.props.setSelection(null)
    this.props.setBufferSetting(null)
    this.props.setOverlaySetting(null)
    this.props.setAnalystLayer(null)
  }

  _offLine_More = () => {
    Toast.show('无法打开此类型文件')
  }

  getFileList = item => {
    (async function () {
      try {
        let absolutePath = await Utility.appendingHomeDirectory(item.path)
        let isDirectory = await Utility.isDirectory(absolutePath)
        if (!isDirectory) {
          let filename = item.path.substr(item.path.lastIndexOf('.')).toLowerCase()
          if (filename === '.sxmu' ) {
            this._toLoadMapView(absolutePath, 'map3D')
          } else if (filename === '.smwu' ) {
            this._toLoadMapView(absolutePath, '')
          } else if (filename === '.udb') {
            this._toLoadMapView(absolutePath, EngineType.UDB)
          } else {
            this._offLine_More()
          }
        } else {
          let filter = this.need === 'workspace' ? 'sxmu,smwu' : this.need === 'udb' ? 'udb' : ''
          let fileList = await Utility.getPathListByFilter(absolutePath, {
            type: filter,
          })
          // let fileList = await Utility.getPathListByFilter(absolutePath, {type: 'smwu'})
          this.setState({
            data: fileList,
            backPath: item.path,
            showData: true,
          })
          this.container.setLoading(false)
        }
      } catch (e) {
        this.container.setLoading(true)
      }
    }).bind(this)()
  }

  _toLoadMapView = (path, type) => {
    (async function () {
      if (this.workspace && this.need === 'workspace') {
        this.clearData()
        let key = ''
        let routes = this.props.nav.routes
        for (let index = 0; index < routes.length; index++) {
          if (routes[index].routeName === 'MapView') {
            key = index === routes.length - 1 ? '' : routes[index + 1].key
          }
        }
        await this.map.close()
        await this.workspace.closeAllDatasource()
        let WorkspaceConnectionInfoModule = new WorkspaceConnectionInfo()
        let workspaceCOnnectionInfo = await WorkspaceConnectionInfoModule.createJSObj()
        // let openpath = await Utility.appendingHomeDirectory(path)
        await workspaceCOnnectionInfo.setServer(path)
        await workspaceCOnnectionInfo.setType(WorkspaceType.SMWU)
        await this.workspace.open(workspaceCOnnectionInfo)
        await this.map.setWorkspace(this.workspace)

        let maps = await this.workspace.getMaps()
        let count = await maps.getCount()
        if (count > 0) {
          this.mapName = await this.workspace.getMapName(0)
          await this.map.open(this.mapName)
          await this.map.viewEntire()
        }
        // await this.mapControl.setAction(Action.SELECT)
        await this.mapControl.setAction(Action.PAN)
        await this.map.refresh()
        NavigationService.goBack(key)
      }
      else if(type==="map3D"&&this.workspace&&this.need === 'workspace'){
        this.clearData()
        let key = ''
        let routes = this.props.nav.routes
        for (let index = 0; index < routes.length; index++) {
          if (routes[index].routeName === 'Map3D') {
            key = index === routes.length - 1 ? '' : routes[index + 1].key
          }
        }
        let workspaceModule = new Workspace()
        this.workspace = await workspaceModule.createObj()   //创建workspace实例
        this.scene = await GLOBAL.sceneControl.getScene()      //获取场景对象
        await this.scene.setWorkspace(this.workspace)        //设置工作空间
        // let filePath = await Utility.appendingHomeDirectory(this.state.path)
        let openWk = await this.workspace.open(path)     //打开工作空间
        if (!openWk) {
          Toast.show(" 打开工作空间失败")
          return
        }
        this.mapName = await this.workspace.getSceneName(0) //获取场景名称
        this.setState({
          title: this.mapName,
        })
        await this.scene.open(this.mapName)                     //根据名称打开指定场景
        await this.scene.refresh()
        NavigationService.goBack(key)                           //刷新场景
      }
      else if (this.workspace && this.need === 'udb') {
        this.clearData()
        await this.map.close()
        await this.workspace.closeAllDatasource()
        let key = ''
        let routes = this.props.nav.routes
        for (let index = 0; index < routes.length; index++) {
          if (routes[index].routeName === 'MapView') {
            key = index === routes.length - 1 ? '' : routes[index + 1].key
          }
        }

        // const point2dModule = new Point2D()
        // navigator.geolocation.getCurrentPosition(
        //   position => {
        //     let lat = position.coords.latitude
        //     let lon = position.coords.longitude
        //     ;(async () => {
        //       let centerPoint = await point2dModule.createObj(lon, lat)
        //       await this.map.setCenter(centerPoint)
        //       await this.map.viewEntire()
        //       await this.mapControl.setAction(Action.PAN)
        //       await this.map.refresh()
        //       key && NavigationService.goBack(key)
        //     }).bind(this)()
        //   }
        // )

        this.DSParams = { server: path, engineType: EngineType.UDB }
        // let layerIndex = 0
        // let dsBaseMap = await this.workspace.openDatasource(this.DSParams)
        // let dataset = await dsBaseMap.getDataset(layerIndex)
        // await this.map.addLayer(dataset, true)
        await this.workspace.openDatasource(this.DSParams)
        await this.map.viewEntire()
        await this.mapControl.setAction(Action.PAN)
        await this.map.refresh()
        key && NavigationService.goBack(key)
      } else {
        if(type==="map3D"){
          NavigationService.navigate('Map3D', { path: path, isExample: true })
        }
        NavigationService.navigate('MapView', { path: path, type: type, DSParams: type === EngineType.UDB && { server: path, engineType: EngineType.UDB } })
      }
    }).bind(this)()
  }

  _refresh = async item => {
    await this.getFileList(item)
  }

  _toBack = async () => {
    // let isRootPath = Platform.OS === 'android' ? false : this.state.backPath === ConstPath.AppPath
    // if (this.state.backPath !== ConstPath.AppPath) {
    // if (isRootPath) {
    let backPath = this.state.backPath.substr(0, this.state.backPath.lastIndexOf("/", this.state.backPath.lastIndexOf('/')))
    await this.getFileList({path: backPath})
    // }
  }

  headerBack = () => {
    let isRootPath = Platform.OS === 'android' ? false : this.state.backPath === ConstPath.AppPath
    if (this.state.backPath === '' || isRootPath) {
      return null
    }
    else {
      return (
        <TouchableOpacity style={styles.headerBack} onPress={() => this._toBack()}>
          <Text style={styles.back}>返回上一层目录</Text>
          <Text style={styles.back}>{this.state.backPath}</Text>
        </TouchableOpacity>
      )
    }
  }

  renderItem = ({ item }) => {
    let image = item.isDirectory ? require('../../assets/public/icon-files.png') : require('../../assets/public/icon-file.png')
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => this._refresh(item)} style={styles.row}>
        <View style={styles.imgView}>
          <Image source={image} style={styles.img} />
        </View>
        <Text numberOfLines={1} style={styles.item}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  itemSeparator = () => {
    return (<View style={styles.itemSeparator} />)
  }

  _keyExtractor = item => {
    return item.path
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
        {this.headerBack()}
        {
          this.state.showData && (
            this.state.data.length > 0
              ? <FlatList
                ItemSeparatorComponent={this.itemSeparator}
                style={styles.container}
                data={this.state.data}
                renderItem={this.renderItem}
                keyExtractor={this._keyExtractor}
              />
              : <EmptyView />)
        }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.background2,
  },
  item: {
    marginLeft: scaleSize(30),
    fontSize: scaleSize(30),
  },
  back: {
    fontSize: scaleSize(30),
    color: '#1296db',
    paddingTop: scaleSize(30),
    paddingBottom: scaleSize(30),
    height: scaleSize(100),
  },
  row: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    borderColor: color.background3,
    borderWidth: scaleSize(2),
    backgroundColor: 'white',
    alignItems: 'center',
    paddingHorizontal: scaleSize(30),
  },
  imgView: {
    width: scaleSize(80),
    height: scaleSize(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  itemSeparator: {
    height: scaleSize(6),
  },
  headerBack: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(30),
  },
})