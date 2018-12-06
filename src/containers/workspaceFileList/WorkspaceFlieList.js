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
import { EngineType, Utility, SScene } from 'imobile_for_reactnative'
import { Toast, scaleSize } from '../../utils'
import { ConstPath } from '../../constants'
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
    this.type = params.type
    this.path = ConstPath.LocalDataPath
    this.title = params.title
    this.cb = params.cb
    this.state = {
      data: [],
      backPath: ConstPath.AppPath,
      showData: false,
    }
  }

  componentDidMount() {
    (async function() {
      try {
        this.container.setLoading(true)
        let exist = await Utility.fileIsExistInHomeDirectory(
          ConstPath.LocalDataPath,
        )
        if (!exist) {
          this.setState(
            {
              showData: true,
            },
            () => {
              this.container.setLoading(false)
            },
          )
        } else {
          this.getFileList({ path: this.path })
        }
      } catch (e) {
        this.container.setLoading(false)
      }
    }.bind(this)())
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
    (async function() {
      try {
        let absolutePath = await Utility.appendingHomeDirectory(item.path)
        let isDirectory = await Utility.isDirectory(absolutePath)
        if (!isDirectory) {
          let filename = item.path
            .substr(item.path.lastIndexOf('.'))
            .toLowerCase()
          if (filename === '.sxwu') {
            this._toLoadMapView(absolutePath, 'sxwu')
          } else if (filename === '.smwu') {
            this._toLoadMapView(absolutePath, '.smwu')
          } else if (filename === '.udb') {
            if (this.cb) {
              this.cb(absolutePath)
              NavigationService.goBack() && this.container.setLoading(false)
            } else {
              this._toLoadMapView(absolutePath, EngineType.UDB)
            }
          } else if (filename === '.xml') {
            if (this.cb) {
              this.cb(absolutePath)
              NavigationService.goBack() && this.container.setLoading(false)
            }
          } else {
            this._offLine_More()
          }
        } else {
          let filter
          switch (this.type) {
            case 'WORKSPACE':
            case 'MAP_3D':
              filter = 'sxwu,smwu'
              break
            default:
              //filter = 'xml,udb'
              filter = 'sxwu,smwu,udb'
              break
          }
          let fileList = await Utility.getPathListByFilter(absolutePath, {
            type: filter,
          })
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
    }.bind(this)())
  }

  _toLoadMapView = (path, type) => {
    (async function() {
      switch (this.type) {
        case 'MAP_3D':
          this._loadMap3D(path, type)
          break
        default:
          this.cb && this.cb(path)
      }
    }.bind(this)())
  }

  _loadMap3D = async (path, type) => {
    switch (type) {
      case 'sxwu':
        try {
          this.container && this.container.setLoading(true, '正在打开地图')
          let data = { server: path }
          let result = await SScene.openWorkspace(data)
          let mapList = await SScene.getMapList()
          result && (await SScene.openMap(mapList[0].name))
          GLOBAL.openWorkspace = true
          SScene.setListener().then(() => {
            SScene.getAttribute()
            SScene.setCircleFly()
          })
          NavigationService.goBack() && this.container.setLoading(false)
        } catch (error) {
          Toast.show('打开失败')
          this.container.setLoading(false)
        }
        break
    }
  }

  _refresh = async item => {
    await this.getFileList(item)
  }

  _toBack = async () => {
    // let isRootPath = Platform.OS === 'android' ? false : this.state.backPath === ConstPath.AppPath
    // if (this.state.backPath !== ConstPath.AppPath) {
    // if (isRootPath) {
    let backPath = this.state.backPath.substr(
      0,
      this.state.backPath.lastIndexOf(
        '/',
        this.state.backPath.lastIndexOf('/'),
      ),
    )
    await this.getFileList({ path: backPath })
    // }
  }

  headerBack = () => {
    let isRootPath =
      Platform.OS === 'android'
        ? false
        : this.state.backPath === ConstPath.AppPath
    if (this.state.backPath === '' || isRootPath) {
      return null
    } else {
      return (
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => this._toBack()}
        >
          <Text style={styles.back}>返回上一层目录</Text>
          <Text style={styles.back}>{this.state.backPath}</Text>
        </TouchableOpacity>
      )
    }
  }

  renderItem = ({ item }) => {
    let image = item.isDirectory
      ? require('../../assets/public/icon-files.png')
      : require('../../assets/public/icon-file.png')
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => this._refresh(item)}
        style={styles.row}
      >
        <View style={styles.imgView}>
          <Image source={image} style={styles.img} />
        </View>
        <Text numberOfLines={1} style={styles.item}>
          {item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  itemSeparator = () => {
    return <View style={styles.itemSeparator} />
  }

  _keyExtractor = item => {
    return item.path
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        initWithLoading
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
        }}
      >
        {this.headerBack()}
        {this.state.showData &&
          (this.state.data.length > 0 ? (
            <FlatList
              ItemSeparatorComponent={this.itemSeparator}
              style={styles.container}
              data={this.state.data}
              renderItem={this.renderItem}
              keyExtractor={this._keyExtractor}
            />
          ) : (
            <EmptyView />
          ))}
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
