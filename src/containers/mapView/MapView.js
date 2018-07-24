/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { Workspace, SMMapView, Utility, Action, Point2D, EngineType } from 'imobile_for_javascript'
import PropTypes from 'prop-types'
import { PopList, Setting } from './componets'
import { PopMeasureBar, MTBtnList, Container, MTBtn } from '../../components'
import { Toast, Capture } from '../../utils'
import NavigationService from '../NavigationService'

import styles from './styles'

export default class MapView extends React.Component {

  static propTypes = {
    nav: PropTypes.object,
    editLayer: PropTypes.object,
    analystLayer: PropTypes.object,
    selection: PropTypes.object,
    latestMap: PropTypes.array,
    navigation: PropTypes.object,

    bufferSetting: PropTypes.object,
    overlaySetting: PropTypes.object,

    setEditLayer: PropTypes.func,
    setSelection: PropTypes.func,
    setLatestMap: PropTypes.func,
    setBufferSetting: PropTypes.func,
    setOverlaySetting: PropTypes.func,
    setAnalystLayer: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      data: params.data,
      popShow: false,       //  一级popView显示控制
      popType: '',
      measureShow: false,
      measureResult: 0,
      editLayer: {},
    }
    this.type = params.type || 'LOCAL'
    switch (params.type) {  //state.params.type最好进行判定
      case 'TD':
        this.DSParams = { server: 'http://t0.tianditu.com/vec_w/wmts', engineType: 23, driver: 'WMTS', alias: 'baseMap' }
        this.labelDSParams = { server: 'http://t0.tianditu.com/cva_w/wmts', engineType: 23, driver: 'WMTS', alias: 'label' }
        this.layerIndex = 0
        this.mapName = '天地图'
        break
      case 'Baidu':
        this.DSParams = { server: 'http://www.baidu.com', engineType: 227 }
        this.labelDSParams = false
        this.layerIndex = 0
        this.mapName = '百度地图'
        break
      case 'Google':
        this.DSParams = { server: 'http://www.google.cn/maps', engineType: 223 }
        this.labelDSParams = false
        this.layerIndex = 'roadmap'
        this.mapName = 'GOOGLE地图'
        break
      case 'OSM':
        this.DSParams = { server: 'http://openstreetmap.org', engineType: 228 }
        this.labelDSParams = false
        this.layerIndex = 0
        this.mapName = 'OSM'
        break
      case 'ONLINE':
        this.DSParams = { server: params.path || 'http://openstreetmap.org', engineType: 228 }
        this.labelDSParams = false
        this.layerIndex = 0
        break
      case 'UDB':
        this.DSParams = { server: params.path, engineType: EngineType.UDB }
        this.labelDSParams = false
        this.layerIndex = 'RoadNet'
        break
      case 'LOCAL':
      default:
        this.path = params.path
    }
  }

  componentDidMount() {
    this.props.setEditLayer(null)
    this.props.setSelection(null)
  }

  componentWillUnmount() {
    (async function(){
      this.props.setEditLayer(null)
      this.props.setSelection(null)
      await this._remove_measure_listener()
      await this._removeGeometrySelectedListener()
      this.map && await this.map.close()
      this.workspace && await this.workspace.closeWorkspace()
    }).bind(this)()
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.editLayer) !== JSON.stringify(this.props.editLayer)) {
      let name = nextProps.editLayer ? nextProps.editLayer.name : ''
      name && Toast.show('当前可编辑的图层为\n' + name)
    }
  }

  saveLatest = () => {
    // Capture.snapshot(this.mapRef, {}, uri => {
    //   this.image = uri
    // }, error => {
    //
    // })
    Capture.captureScreen({}, uri => {
      this.image = uri
      this.props.setLatestMap({
        path: this.DSParams && this.DSParams.server || this.path,
        type: this.type,
        name: this.mapName,
        image: uri,
      })
    }, error => {

    })
  }

  _onGetInstance = mapView => {
    this.mapView = mapView
    this._addMap()
  }

  _pop_list = (show, type) => {//底部BtnBar事件点击回掉，负责底部二级pop的弹出
    this.setState({
      popShow: show,
      popType: type,
    })
    this.mapControl && (async function () {
      if ((type === 'analyst' || type === 'collector') && show) {
        await this.mapControl.setAction(Action.SELECT)
      } else if (type !== 'data_edit' || !show) {
        await this.mapControl.setAction(Action.NONEACTION)
        return
      }
    }).bind(this)()
  }

  _chooseLayer = (type, isEdit = false, cb? = () => {}) => {
    NavigationService.navigate('ChooseEditLayer',{
      workspace: this.workspace,
      map: this.map,
      type: type,
      mapControl: this.mapControl,
      isEdit, cb })
  }

  _showSetting = type => {
    this.setting.showSetting(type)
  }

  _analyst = type => {
    // let ws = this.workspace
    // let map = this.map
    // NavigationService.navigate('ChooseEditLayer',{ workspace: ws, map: map, type: type })
  }

  //一级pop按钮 新增图层
  _addLayer = () => {
    let ws = this.workspace
    let map = this.map
    NavigationService.navigate('DataSourcelist',{ workspace: ws, map: map })
  }

  //一级pop按钮 图层管理 点击函数
  _layer_manager = () => {
    let ws = this.workspace
    let map = this.map
    NavigationService.navigate('LayerManager',{ workspace: ws, map: map, path: this.path, mapControl: this.mapControl })
  }

  //一级pop按钮 数据采集 点击函数
  _data_collection = () => {
    NavigationService.navigate('DataCollection', { workspace: this.workspace, map: this.map, mapControl: this.mapControl })
  }


  //一级pop按钮 数据管理 点击函数
  _data_manager = () => {
    NavigationService.navigate('DataManagement', { workspace: this.workspace, map: this.map, mapControl: this.mapControl })
  }

  //二级pop按钮 量算 点击函数
  _pop_measure_click = () => {
    this.setState({
      measureShow: !this.state.measureShow,
    })
    // TODO list:优化，不需每次都添加listener
    this._add_measure_listener()
  }

  /*测量功能模块*/

  _add_measure_listener = async () => {
    await this.mapControl.addMeasureListener({
      lengthMeasured: this._measure_callback,
      areaMeasured: this._measure_callback,
    })
  }

  _measure_callback = e => {
    let result = e.curResult
    this.setState({
      measureResult: result,
    })
  }

  _remove_measure_listener = async () => {
    await this.mapControl.removeMeasureListener()
  }

  _measure_line = async () => {
    await this.mapControl.setAction(Action.MEASURELENGTH)
  }

  _measure_square = async () => {
    await this.mapControl.setAction(Action.MEASUREAREA)
  }

  _measure_pause = async () => {
    await this.mapControl.setAction(Action.PAN)
    this.setState({
      measureResult: 0,
    })
  }

  _closeMeasureMode = async () => {
    await this.mapControl.setAction(Action.PAN)
    this._remove_measure_listener()
  }

  /** 选择事件监听 **/
  _addGeometrySelectedListener = async () => {
    await this.mapControl.addGeometrySelectedListener({
      geometrySelected: this.geometrySelected,
      geometryMultiSelected: this.geometryMultiSelected,
    })
  }

  _removeGeometrySelectedListener = async () => {
    await this.mapControl.removeGeometrySelectedListener()
  }

  geometrySelected = event => {
    let layerSelectable = true
    if (this.props.selection && this.props.selection.layer) {
      layerSelectable = this.props.selection.layer._SMLayerId !== event.layer._SMLayerId || this.props.selection.id !== event.id
    } else {
      layerSelectable = true
    }
    event.layer.getName().then(name => {
      Toast.show('选中 ' + name)
      Object.assign(event, {name: name})
      layerSelectable && this.props.setSelection(event)
    })
  }

  geometryMultiSelected = events => {
    // TODO 处理多选
    this.props.setSelection(events)
  }

  btnClick = () => {}

  toDoAction = () => {
    Toast.show('待完善')
  }

  // 地图保存
  saveMap = () => {
    (async function(){
      try {
        let saveMap = await this.map.save()
        if (!saveMap) {
          Toast.show('保存失败')
        } else {
          Toast.show('保存成功')
        }
      } catch (e) {
        Toast.show('保存失败')
      }

    }).bind(this)()
  }

  renderHeaderBtns = () => {
    let arr = []
    let headerBtnData = [{
      title: '打开',
      image: require('../../assets/public/icon-open-white.png'),
      action: this.toDoAction,
    }, {
      title: '保存',
      image: require('../../assets/public/icon-save-white.png'),
      action: this.saveMap,
    }, {
      title: '关闭',
      image: require('../../assets/public/icon-close-white.png'),
      action: this.toDoAction,
    }, {
      title: '首页',
      image: require('../../assets/public/icon-home-white.png'),
      action: () => NavigationService.goBack(this.props.nav.routes[1].key),
    }]
    headerBtnData.forEach(({title, image, action}) => {
      arr.push(
        <MTBtn key={title} BtnText={title} textColor={'white'} size={MTBtn.Size.SMALL} BtnImageSrc={image} BtnClick={action} />
      )
    })
    return arr
  }

  back = () => {
    // if (this.setting) {
    //   this.setting.closeChooseLayer()
    // }
    if (this.setting && this.setting.isVisible()) {
      this.setting.close()
    } else {
      // 返回到首页Tabs，key为首页的下一个界面，从key所在的页面返回
      // NavigationService.goBack(this.props.nav.routes[1].key)
      NavigationService.goBack()
    }
  }

  setLoading = (loading = false) => {
    this.container && this.container.setLoading(loading)
  }

  render() {
    let headerRight = this.renderHeaderBtns()
    return (
      <Container
        ref={ref => this.container = ref}
        initWithLoading
        headerProps={{
          navigation: this.props.navigation,
          headerRight: headerRight,
          backAction: this.back,
        }}>
        <SMMapView ref={ref => GLOBAL.mapView = ref} style={styles.map} onGetInstance={this._onGetInstance} />
        {
          this.state.measureShow &&
          <PopMeasureBar
            measureLine={this._measure_line}
            measureSquare={this._measure_square}
            measurePause={this._measure_pause}
            style={styles.measure}
            result={this.state.measureResult} />
        }
        {
          this.state.popShow && <PopList
            popType={this.state.popType}
            editLayer={this.props.editLayer}
            selection={this.props.selection}
            mapView={this.mapView}
            mapControl={this.mapControl}
            workspace={this.workspace}
            map={this.map}
            setLoading={this.setLoading}
            chooseLayer={this._chooseLayer}
            POP_List={this._pop_list}
            showSetting={this._showSetting}
            analyst={this._analyst}
            bufferSetting={this.props.bufferSetting}
            overlaySetting={this.props.overlaySetting}
            setOverlaySetting={this.props.setOverlaySetting}
            showMeasure={this._pop_measure_click}
          />
        }
        <MTBtnList
          POP_List={this._pop_list}
          layerManager={this._layer_manager}
          dataCollection={this._data_collection}
          dataManager={this._data_manager}
          addLayer={this._addLayer}
          chooseLayer={this._chooseLayer}
          editLayer={this.props.editLayer}
        />
        <Setting
          ref={ref => this.setting = ref}
          selection={this.props.selection}
          mapControl={this.mapControl}
          workspace={this.workspace}
          map={this.map}
          setLoading={this.setLoading}
          setBufferSetting={this.props.setBufferSetting}
          setOverlaySetting={this.props.setOverlaySetting}
          bufferSetting={this.props.bufferSetting}
          overlaySetting={this.props.overlaySetting}
          setAnalystLayer={this.props.setAnalystLayer}
        />
      </Container>
    )
  }

  _addMap = () => {
    // if (
    //   this.type === 'UDB' ||
    //   this.type === 'TD' ||
    //   this.type === 'Baidu' ||
    //   this.type === 'Google' ||
    //   this.type === 'OSM' ||
    //   this.type === 'ONLINE')
    // {
    //   this._addRemoteMap()
    // } else {
    //   this._addLocalMap()
    // }
    if (this.type === 'LOCAL') {
      this._addLocalMap()
    } else {
      this._addRemoteMap()
    }
  }

  _addLocalMap = () => {
    let workspaceModule = new Workspace()
    ;(async function () {
      try {
        this.workspace = await workspaceModule.createObj()
        this.mapControl = await this.mapView.getMapControl()
        this.map = await this.mapControl.getMap()

        let filePath = await Utility.appendingHomeDirectory(this.path)

        let openWk = await this.workspace.open(filePath)
        await this.map.setWorkspace(this.workspace)
        this.mapName = await this.workspace.getMapName(0)

        await this.map.open(this.mapName)
        // await this.map.setScale(0.00005)
        await this.map.refresh()
        await this._addGeometrySelectedListener()
        await this._addGestureDetector()

        this.container.setLoading(false)
        this.saveLatest()
      } catch (e) {
        this.container.setLoading(false)
      }
    }).bind(this)()
  }

  _addRemoteMap = () => {
    const workspaceModule = new Workspace()
    const point2dModule = new Point2D()
    ;(async function () {
      try {
        this.workspace = await workspaceModule.createObj()
        this.mapControl = await this.mapView.getMapControl()
        this.map = await this.mapControl.getMap()
        await this.map.setWorkspace(this.workspace)

        // this.mapName = await this.map.getName()

        await this.map.setScale(0.0001)
        navigator.geolocation.getCurrentPosition(
          position => {
            let lat = position.coords.latitude
            let lon = position.coords.longitude
            ;(async () => {
              let centerPoint = await point2dModule.createObj(lon, lat)
              await this.map.setCenter(centerPoint)
              await this.map.refresh()

              this.saveLatest()
            }).bind(this)()
          }
        )
        let dsBaseMap = await this.workspace.openDatasource(this.DSParams)

        let dataset = await dsBaseMap.getDataset(this.layerIndex)
        await this.map.addLayer(dataset, true)

        if (this.labelDSParams) {
          let dsLabel = await this.workspace.openDatasource(this.labelDSParams)
          await this.map.addLayer(await dsLabel.getDataset(this.layerIndex), true)
        }

        await this._addGeometrySelectedListener()
        await this._addGestureDetector()
        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
      }
    }).bind(this)()
  }
}

MapView.Type = {
  TD: 'TD',
  Baidu: 'Baidu',
  Google: 'Google',
  OSM: 'OSM',
  ONLINE: 'ONLINE',
  LOCAL: 'LOCAL',
  MAP_3D: 'MAP_3D',
}