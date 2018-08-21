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
import { Action } from 'imobile_for_javascript'

import { LayerManager_item, LayerManager_tab, SaveDialog, ModifiedDialog } from './components'

export default class MT_layerManager extends React.Component {

  props: {
    navigation: Object,
    editLayer: Object,
    setEditLayer: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.mapControl = params.mapControl
    this.map = params.map
    this.showDialogCaption = params.path ? !params.path.endsWith('.smwu') : true
    let path = params.path.substring(0, params.path.lastIndexOf('/') + 1)
    let wsName = params.path.substring(params.path.lastIndexOf('/') + 1)
    this.state = {
      datasourceList: '',
      mapName: '',
      wsName: wsName,
      path: !this.showDialogCaption ? path : ConstPath.LocalDataPath,
      currentEditIndex: props.editLayer.index >= 0 ? props.editLayer.index : -1, //当前编辑界面的index
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = () => {
    this.container.setLoading(true)
    ;(async function () {
      this.itemRefs = []
      this.map = await this.mapControl.getMap()
      let layerNameArr = await this.map.getLayersByType()
      let currentEditIndex = -1
      for(let i = 0; i < layerNameArr.length; i++) {
        layerNameArr[i].key = layerNameArr[i].name
        if (layerNameArr[i].isEditable) {
          currentEditIndex = layerNameArr[i].index
          this.props.setEditLayer && this.props.setEditLayer(layerNameArr[i])
        }
      }
      this.mapControl && await this.mapControl.setAction(Action.SELECT)
      let mapName = await this.map.getName()
      this.setState({
        datasourceList: layerNameArr.concat(),
        mapName: mapName,
        currentEditIndex: currentEditIndex,
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
    NavigationService.navigate('MapChange',{workspace: this.workspace, map:this.map})
    // NavigationService.navigate('MapChange',{workspace: this.workspace, map:this.map, cb: this.getData})
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
    this.container.setLoading(true)
    ;(async function(){
      try {
        let saveWs
        let info = {}
        if (!wsName) {
          Toast.show('请输入地图名称')
          return
        }
        if (this.state.path !== path || path === ConstPath.LocalDataPath) {
          info.path = path
        }
        if (wsName && this.showDialogCaption) {
          info.caption = wsName
        }
        await this.map.setWorkspace(this.workspace)
        // 若名称相同，则不另存为
        let saveMap = await this.map.save(mapName !== this.state.mapName ? mapName : '')
        saveWs = await this.workspace.saveWorkspace(info)
        this.container.setLoading(false)
        if (!saveMap) {
          Toast.show('该名称地图已存在')
        } else if (saveWs || !this.showDialogCaption) {
          this.showSaveDialog(false)
          Toast.show('保存成功')
        } else {
          Toast.show('保存失败')
        }
      } catch (e) {
        this.container.setLoading(false)
        Toast.show('保存失败')
      }
    }).bind(this)()
  }

  //添加数据集
  _add_dataset=()=>{
    NavigationService.navigate('AddDataset',{
      workspace: this.workspace,
      map: this.map,
      layerList: this.state.datasourceList,
      cb: () => {
        this.getData()
        this.map && this.map.refresh()
      },
    })
  }

  //新建图层组
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
    return (
      <LayerManager_item
        ref={ref => this.itemRefs[item.index] = ref}
        layer={item.layer}
        map={this.map}
        data={item}
        mapControl={this.mapControl}
        showRemoveDialog={this.showRemoveDialog}
        showRenameDialog={this.showRenameDialog}
        setEditable={data => {
          // 更新上一个编辑layer状态
          // 若data为空，则表示取消当前编辑图层，且没有新增编辑图层
          this.state.currentEditIndex >= 0 && this.itemRefs[this.state.currentEditIndex].updateEditable()
          this.setState({
            currentEditIndex: data ? data.index : -1,
          })
          this.props.setEditLayer && this.props.setEditLayer(data)
        }}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => this.container = ref}
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