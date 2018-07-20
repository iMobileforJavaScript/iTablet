/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { FlatList } from 'react-native'
import { Container, InputDialog } from '../../components'
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
        let caption = await layer.getCaption()
        let map = this.map
        layerNameArr.push({ key: name, caption: caption, obj: layer, map:map })
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

  showRenameDialog = (isShow = true, layer = null) => {
    this.renameDialog.setDialogVisible(isShow)
    if (layer) {
      this.renameLayer = layer
    }
  }
  
  showRemoveDialog = (isShow = true, layer = null) => {
    this.deleteDialog.setDialogVisible(isShow)
    if (layer) {
      this.removeLayer = layer
    }
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

  //删除图层
  _removeLayer = () => {
    (async function () {
      try {
        if (!this.map || !this.removeLayer) return
        let name = await this.removeLayer.getName()
        let result = await this.map.removeLayer(name)
        if (result) {
          Toast.show('删除成功')
          this.removeLayer = null
          await this.getData()
        } else {
          Toast.show('删除失败')
        }
        this.deleteDialog && this.deleteDialog.setDialogVisible(false)
      } catch (e) {
        Toast.show('删除失败')
      }
    }).bind(this)()
  }

  //图层重命名
  _renameLayer = name => {
    (async function () {
      try {
        if (!this.map || !this.renameLayer) return
        await this.renameLayer.setCaption(name)
        Toast.show('修改成功')
        this.renameLayer = null
        await this.getData()
        this.renameDialog && this.renameDialog.setDialogVisible(false)
      } catch (e) {
        Toast.show('修改失败')
      }
    }).bind(this)()
  }

  _renderItem = ({ item }) => {
    let caption = item.caption
    let layer = item.obj
    let map = item.map
    return (
      <LayerManager_item
        layer={layer}
        name={caption}
        map={map}
        mapControl={this.mapControl}
        showRemoveDialog={this.showRemoveDialog}
        showRenameDialog={this.showRenameDialog}
      />
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
          info={'当前地图已修改，是否保存？'}
          confirmAction={this.saveAndGoToMapChange}
          cancelAction={this.goToMapChange}
        />
        <ModifiedDialog
          ref={ref => this.deleteDialog = ref}
          info={'是否要删除该图层？'}
          confirmAction={this._removeLayer}
        />
        <InputDialog
          ref={ref => this.renameDialog = ref}
          title={'图层重命名'}
          label={'图层名称'}
          confirmAction={this._renameLayer}
        />
      </Container>
    )
  }
}