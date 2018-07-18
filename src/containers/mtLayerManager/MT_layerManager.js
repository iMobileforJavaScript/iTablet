/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { FlatList } from 'react-native'
import { Container } from '../../components'
import { Toast } from '../../utils'
import { ConstPath } from '../../constains'
import NavigationService from '../NavigationService'

import { LayerManager_item, LayerManager_tab, SaveDialog, ModifiedDialog } from './components'

export default class MT_layerManager extends React.Component {

  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.mapControl = params.mapControl
    this.map = params.map
    this.showDialogCaption = params.path ? !params.path.endsWith('.smwu') : true
    this.state = {
      datasourceList: '',
      mapName: '',
      wsName: '',
      path: !this.showDialogCaption ? params.path : ConstPath.SampleDataPath,
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    this.container.setLoading(true)
    ;(async function () {
      let layerCount = await this.map.getLayersCount()
      let layerNameArr = []

      // let mapName = this.map.getName()
      // let workspace = this.workspace.getCaption()
      for (let i = 0; i < layerCount; i++) {
        let layer = await this.map.getLayer(i)
        let name = await layer.getName()
        let map = this.map
        layerNameArr.push({ key: name, obj: layer, map:map })
      }
      this.setState({
        datasourceList: layerNameArr,
        // mapName: mapName,
        // wsName: workspace,
      }, () => {
        this.container.setLoading(false)
      })
    }).bind(this)()
  }

  showSaveDialog = (isShow = true) => {
    this.saveDialog.setDialogVisible(isShow)
  }

  showModifiedDialog = (isShow = true) => {
    this.modifiedDialog.setDialogVisible(isShow)
  }

  /*LayerManager_tab点击方法*/
  //地图切换
  _map_change = async () => {
    let isModified = await this.map.isModified()
    if (isModified) {
      this.showModifiedDialog(true)
    } else {
      this.goToMapChange()
    }
  }

  goToMapChange = () => {
    NavigationService.navigate('MapChange',{workspace:this.workspace,map:this.map})
  }

  // 地图保存
  saveAndGoToMapChange = () => {
    (async function(){
      try {
        let saveMap = await this.map.save()
        if (!saveMap) {
          Toast.show('保存失败')
        } else {
          this.showModifiedDialog(false)
          this.showSaveDialog(false)
          Toast.show('保存成功')
          this.goToMapChange()
        }
      } catch (e) {
        Toast.show('保存失败')
      }

    }).bind(this)()
  }

  // 保存
  saveMapAndWorkspace= ({mapName, wsName, path}) =>{
    (async function(){
      try {
        let saveWs
        let info = {}
        if (this.state.path !== path || path === ConstPath.SampleDataPath) {
          info.path = path
        }
        if (wsName && this.showDialogCaption) {
          info.caption = wsName
        }
        saveWs = await this.workspace.saveWorkspace(info)
        await this.map.setWorkspace(this.workspace)
        let saveMap = await this.map.save(mapName)
        if (!saveMap) {
          Toast.show('该名称地图已存在')
        } else if (saveWs || !this.showDialogCaption) {
          this.showSaveDialog(false)
          Toast.show('保存成功')
        } else {
          Toast.show('保存失败')
        }
      } catch (e) {
        Toast.show('保存失败')
      }

    }).bind(this)()
  }

  //添加数据集
  _add_dataset=()=>{
    NavigationService.navigate('AddDataset',{
      workspace: this.workspace,
      map: this.map,
      cb: this.getData,
    })
  }

  //添加数据集
  _add_layer_group=()=>{
    NavigationService.navigate('AddLayerGroup',{
      workspace: this.workspace,
      map: this.map,
      cb: this.getData,
    })
  }

  _renderItem = ({ item }) => {
    let key = item.key
    let layer = item.obj
    let map = item.map
    return (
      <LayerManager_item layer={layer} name={key} map={map} mapControl={this.mapControl}/>
    )
  }

  render() {
    return (
      <Container
        ref={ref => this.container = ref}
        // initWithLoading
        headerProps={{
          title: '地图管理',
          navigation: this.props.navigation,
        }}>
        <LayerManager_tab
          mapChange={this._map_change}
          showSaveDialog={this.showSaveDialog}
          addDataset={this._add_dataset}
          addLayerGroup={this._add_layer_group}
        />
        <FlatList
          data={this.state.datasourceList}
          renderItem={this._renderItem}
        />
        <SaveDialog
          ref={ref => this.saveDialog = ref}
          confirmAction={this.saveMapAndWorkspace}
          showWsName={this.showDialogCaption}
          mapName={this.state.mapName}
          wsName={this.state.wsName}
          path={this.state.path}
        />
        <ModifiedDialog
          ref={ref => this.modifiedDialog = ref}
          workspace={this.workspace}
          confirmAction={this.saveAndGoToMapChange}
          cancelAction={this.goToMapChange}
        />
      </Container>
    )
  }
}