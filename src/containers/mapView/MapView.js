/*
 Copyright © SuperMap. All rights reserved.
 Author: Wang zihao
 E-mail: zihaowang5325@qq.com
 */

import * as React from 'react'
import { Workspace, SMMapView, Action, Point2D } from 'imobile_for_javascript'
import PropTypes from 'prop-types'
import { PopList, Setting } from './componets'
import { PopMeasureBar, MTBtnList, Container, MTBtn, Dialog } from '../../components'
import { Toast, AudioAnalyst } from '../../utils'
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
    this.isExample = params.isExample || false

    this.DSParams = params.DSParams || null
    this.labelDSParams = params.labelDSParams || false
    this.layerIndex = params.layerIndex || 0
    this.mapName = params.mapName || ''
    this.path = params.path || ''
  }

  componentDidMount() {
    this.clearData()
  }

  componentWillUnmount() {
    this.closeWorkspace()
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.editLayer) !== JSON.stringify(this.props.editLayer) &&
      this.props.nav.routes[this.props.nav.index] === 'MapView'
    ) {
      let name = this.props.editLayer ? this.props.editLayer.name : ''
      name && Toast.show('当前可编辑的图层为\n' + name)
    }
  }

  clearData = () => {
    this.props.setEditLayer(null)
    this.props.setSelection(null)
    this.props.setBufferSetting(null)
    this.props.setOverlaySetting(null)
    this.props.setAnalystLayer(null)
  }

  closeWorkspace = () => {
    (async function () {
      this.clearData()
      await this._remove_measure_listener()
      await this._removeGeometrySelectedListener()
      this.map && await this.map.close()
      this.workspace && await this.workspace.closeWorkspace()
    }).bind(this)()
  }

  saveLatest = () => {
    if (this.isExample) return
    try {
      this.mapControl && this.mapControl.outputMap({ mapView: this.mapView }).then(({ result, uri }) => {
        if (result) {
          this.props.setLatestMap({
            path: this.DSParams && this.DSParams.server || this.path,
            type: this.type,
            name: this.mapName,
            image: uri,
            DSParams: this.DSParams,
            labelDSParams: this.labelDSParams,
            layerIndex: this.layerIndex,
            mapName: this.mapName,
          })
        }
      })
    } catch (e) {
      console.error(e)
    }
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
      await this.mapControl.setAction(show ? Action.SELECT : Action.PAN)
    }).bind(this)()
  }

  _chooseLayer = (type, isEdit = false, cb? = () => {}) => {
    NavigationService.navigate('ChooseEditLayer', {
      workspace: this.workspace,
      map: this.map,
      type: type,
      mapControl: this.mapControl,
      isEdit, cb,
    })
  }

  _showSetting = type => {
    this.setting.showSetting(type)
  }

  //一级pop按钮 新增图层
  _addLayer = () => {
    let ws = this.workspace
    let map = this.map
    NavigationService.navigate('DataSourcelist', { workspace: ws, map: map, mapControl: this.mapControl })
  }

  //一级pop按钮 图层管理 点击函数
  _layer_manager = () => {
    let ws = this.workspace
    let map = this.map
    NavigationService.navigate('LayerManager', {
      workspace: ws,
      map: map,
      path: this.path,
      mapControl: this.mapControl,
    })
  }

  //一级pop按钮 数据采集 点击函数
  _data_collection = () => {
    NavigationService.navigate('DataCollection', {
      workspace: this.workspace,
      map: this.map,
      mapControl: this.mapControl,
    })
  }


  //一级pop按钮 数据管理 点击函数
  _data_manager = () => {
    NavigationService.navigate('DataManagement', {
      workspace: this.workspace,
      map: this.map,
      mapControl: this.mapControl,
    })
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
    this.mapControl && await this.mapControl.removeMeasureListener()
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
    this.mapControl && await this.mapControl.removeGeometrySelectedListener()
  }

  geometrySelected = event => {
    let layerSelectable = true
    if (this.props.selection && this.props.selection.layer) {
      layerSelectable = this.props.selection.layer._SMLayerId !== event.layer._SMLayerId || this.props.selection.id !== event.id
    }
    event.layer.getName().then(name => {
      Toast.show('选中 ' + name)
      Object.assign(event, { name: name })
      layerSelectable && this.props.setSelection(event)
    })
  }

  geometryMultiSelected = events => {
    // TODO 处理多选
    this.props.setSelection(events)
  }

  toOpen = async () => {
    NavigationService.navigate('MapLoad', { workspace: this.workspace, map: this.map, mapControl: this.mapControl })
  }

  toCloesMap = () => {
    // await this.map.close()
    // await this.workspace.closeWorkspace()  //关闭空间  程序奔溃
    this.closeWorkspace()
    NavigationService.goBack(this.props.nav.routes[1].key)
  }

  // 地图保存
  saveMap = () => {
    (async function () {
      try {
        let saveMap = await this.map.save()
        let saveWs = await this.workspace.saveWorkspace()
        if (!saveMap || !saveWs) {
          Toast.show('保存失败')
        } else {
          Toast.show('保存成功')
        }
      } catch (e) {
        Toast.show('保存失败')
      }

    }).bind(this)()
  }

  // 显示删除图层Dialog
  showRemoveObjectDialog = () => {
    if (!this.map || !this.props.selection || !this.props.selection.name) {
      Toast.show('请选择目标')
      return
    }
    this.removeObjectDialog && this.removeObjectDialog.setDialogVisible(true)
  }

  // 删除图层
  removeObject = () => {
    (async function () {
      try {
        if (!this.map || !this.props.selection || !this.props.selection.id) return
        let selection = await this.props.selection.layer.getSelection()
        let result = await selection.recordset.deleteById(this.props.selection.id)
        if (result) {
          Toast.show('删除成功')
          this.props.setSelection()
          await this.map.refresh()
          await this.mapControl.setAction(Action.SELECT)
        } else {
          Toast.show('删除失败')
        }
        this.removeObjectDialog && this.removeObjectDialog.setDialogVisible(false)
      } catch (e) {
        Toast.show('删除失败')
      }
    }).bind(this)()
  }

  renderHeaderBtns = () => {
    if (this.isExample) return null
    let arr = []
    let headerBtnData = [{
      title: '语音',
      image: require('../../assets/public/icon-audio-white.png'),
      action: () => GLOBAL.AudioDialog.setVisible(true, 'top'),
    }, {
      title: '打开',
      image: require('../../assets/public/icon-open-white.png'),
      action: this.toOpen,
    }, {
      title: '保存',
      image: require('../../assets/public/icon-save-white.png'),
      action: this.saveMap,
    }, {
      title: '关闭',
      image: require('../../assets/public/icon-close-white.png'),
      action: this.toCloesMap,
    }]
    headerBtnData.forEach(({ title, image, action }) => {
      arr.push(
        <MTBtn key={title} BtnText={title} textColor={'white'} size={MTBtn.Size.SMALL} image={image}
          BtnClick={action}/>
      )
    })
    return arr
  }

  back = () => {
    if (this.setting && this.setting.isVisible()) {
      this.setting.close()
    } else {
      // 返回到首页Tabs，key为首页的下一个界面，从key所在的页面返回
      // NavigationService.goBack(this.props.nav.routes[1].key)
      this.closeWorkspace()
      NavigationService.goBack()
    }
  }

  setLoading = (loading = false) => {
    this.container && this.container.setLoading(loading)
  }

  _addMap = () => {
    if (this.type === 'LOCAL') {
      this._addLocalMap()
    } else {
      this._addRemoteMap()
    }
  }

  _addLocalMap = () => {
    if (!this.path) {
      Toast.show('没有找到地图')
      return
    }
    let workspaceModule = new Workspace()
    ;(async function () {
      try {
        this.workspace = await workspaceModule.createObj()
        this.mapControl = await this.mapView.getMapControl()
        this.map = await this.mapControl.getMap()

        AudioAnalyst.setConfig({
          workspace: this.workspace,
          mapControl: this.mapControl,
          map: this.map,
        })

        // let filePath = await Utility.appendingHomeDirectory(this.path)

        await this.workspace.open(this.path)
        await this.map.setWorkspace(this.workspace)
        this.mapName = await this.workspace.getMapName(0)

        if (this.mapName) {
          await this.map.open(this.mapName)
          // await this.map.viewEntire()
          // await this.map.setScale(0.00005)
          // await this.mapControl.setAction(Action.PAN)
          // await this.map.refresh()

          navigator.geolocation.getCurrentPosition(
            position => {
              let lat = position.coords.latitude
              let lon = position.coords.longitude
              ;(async () => {
                const point2dModule = new Point2D()
                let centerPoint = await point2dModule.createObj(lon, lat)
                await this.map.setCenter(centerPoint)
                await this.map.viewEntire()
                // await this.map.setScale(0.00005)
                await this.mapControl.setAction(Action.PAN)
                await this.map.refresh()
                this.saveLatest()
              }).bind(this)()
            }
          )
        }
        await this.map.refresh()

        await this._addGeometrySelectedListener()

        this.container.setLoading(false)
        // this.saveLatest()
      } catch (e) {
        this.container.setLoading(false)
      }
    }).bind(this)()
  }

  _addRemoteMap = () => {
    if (!this.DSParams) {
      Toast.show('没有找到地图')
      return
    }
    const workspaceModule = new Workspace()
    const point2dModule = new Point2D()
    ;(async function () {
      try {
        this.workspace = await workspaceModule.createObj()
        this.mapControl = await this.mapView.getMapControl()
        this.map = await this.mapControl.getMap()
        await this.map.setWorkspace(this.workspace)
        AudioAnalyst.setConfig({
          workspace: this.workspace,
          mapControl: this.mapControl,
          map: this.map,
        })
        this.mapName = await this.map.getName()

        // await this.map.setScale(0.0005)
        navigator.geolocation.getCurrentPosition(
          position => {
            let lat = position.coords.latitude
            let lon = position.coords.longitude
            ;(async () => {
              let centerPoint = await point2dModule.createObj(lon, lat)
              await this.map.setCenter(centerPoint)
              await this.map.viewEntire()
              await this.mapControl.setAction(Action.PAN)
              await this.map.refresh()

              this.saveLatest()
            }).bind(this)()
          }
        )
        await this.workspace.openDatasource(this.DSParams)
        if (this.labelDSParams) {
          let dsLabel = await this.workspace.openDatasource(this.labelDSParams)
          dsLabel && await this.map.addLayer(await dsLabel.getDataset(this.layerIndex), true)
        }
        await this.map.refresh()

        await this._addGeometrySelectedListener()
        this.container.setLoading(false)
      } catch (e) {
        this.container.setLoading(false)
      }
    }).bind(this)()
  }

  render() {
    let headerRight = this.renderHeaderBtns()
    return (
      <Container
        ref={ref => this.container = ref}
        initWithLoading
        headerProps={{
          title: this.isExample ? '示例地图' : '',
          navigation: this.props.navigation,
          headerRight: headerRight,
          backAction: this.back,
        }}>
        <SMMapView ref={ref => GLOBAL.mapView = ref} style={styles.map} onGetInstance={this._onGetInstance}/>
        {
          this.state.measureShow &&
          <PopMeasureBar
            measureLine={this._measure_line}
            measureSquare={this._measure_square}
            measurePause={this._measure_pause}
            style={styles.measure}
            result={this.state.measureResult}/>
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
            bufferSetting={this.props.bufferSetting}
            overlaySetting={this.props.overlaySetting}
            setOverlaySetting={this.props.setOverlaySetting}
            showMeasure={this._pop_measure_click}
            showRemoveObjectDialog={this.showRemoveObjectDialog}
            setSelection={this.props.setSelection}
          />
        }
        <MTBtnList
          hidden={this.isExample}
          POP_List={this._pop_list}
          layerManager={this._layer_manager}
          dataCollection={this._data_collection}
          dataManager={this._data_manager}
          addLayer={this._addLayer}
          chooseLayer={this._chooseLayer}
          editLayer={this.props.editLayer}
        />
        {
          !this.isExample &&
          <Setting
            ref={ref => this.setting = ref}
            selection={this.props.selection}
            mapControl={this.mapControl}
            workspace={this.workspace}
            mapView={this.mapView}
            map={this.map}
            setLoading={this.setLoading}
            setBufferSetting={this.props.setBufferSetting}
            setOverlaySetting={this.props.setOverlaySetting}
            bufferSetting={this.props.bufferSetting}
            overlaySetting={this.props.overlaySetting}
            setAnalystLayer={this.props.setAnalystLayer}
          />
        }
        <Dialog
          ref={ref => this.removeObjectDialog = ref}
          type={Dialog.Type.MODAL}
          title={'提示'}
          info={'是否要删除该对象吗？'}
          confirmAction={this.removeObject}
          confirmBtnTitle={'是'}
          cancelBtnTitle={'否'}
        />
      </Container>
    )
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