/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
import { FlatList, TouchableOpacity, Text, View } from 'react-native'
import { Container } from '../../components'
import constants from '../workspace/constants'
import { Toast, scaleSize } from '../../utils'
import { MapToolbar } from '../workspace/componets'
import { Action, SMap, ThemeType } from 'imobile_for_reactnative'
import { LayerManager_item, LayerManager_tolbar } from './components'
import { ConstToolType } from '../../constants'
import { color, size } from '../../styles'

export default class MT_layerManager extends React.Component {
  props: {
    navigation: Object,
    editLayer: Object,
    layers: Object,
    setEditLayer: () => {},
    setCurrentLayer: () => {},
    getLayers: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      datasourceList: [],
      mapName: '',
      refreshing: false,
      currentOpenItemName: '', // 记录左滑的图层的名称
    }
  }

  componentDidMount() {
    this.setRefreshing(true)
    this.getData()
  }

  setRefreshing = refreshing => {
    if (refreshing === this.state.refreshing) return
    this.setState({
      refreshing: refreshing,
    })
  }

  getData = async () => {
    // this.container.setLoading(true)
    try {
      this.itemRefs = {}
      await this.props.getLayers()
      // this.map = await this.mapControl.getMap()
      // let layerNameArr = await this.map.getLayersByType()
      // let layerNameArr = await SMap.getLayersByType()
      // for (let i = 0; i < layerNameArr.length; i++) {
      //   layerNameArr[i].key = layerNameArr[i].name
      //   if (layerNameArr[i].isEditable) {
      //     this.props.setEditLayer && this.props.setEditLayer(layerNameArr[i])
      //   }
      // }
      await SMap.setAction(Action.SELECT)
      // let mapName = await this.map.getName()

      this.setState({
        // datasourceList: layerNameArr.concat(),
        refreshing: false,
      })
    } catch (e) {
      this.setRefreshing(false)
    }
  }

  // showSaveDialog = (isShow = true) => {
  //   this.saveDialog.setDialogVisible(isShow)
  // }
  //
  // showModifiedDialog = (isShow = true) => {
  //   this.modifiedDialog.setDialogVisible(isShow)
  // }
  //
  // showRenameDialog = (isShow = true, layer = null) => {
  //   this.renameDialog.setDialogVisible(isShow)
  //   if (layer) {
  //     this.renameLayer = layer
  //   }
  // }
  //
  // showRemoveDialog = (isShow = true, data = null, info = '') => {
  //   this.deleteDialog.setDialogVisible(isShow, info)
  //   if (data) {
  //     this.removeLayerData = data
  //   }
  // }
  //
  // /*LayerManager_tab点击方法*/
  // //地图切换
  // _map_change = async () => {
  //   let isModified = await this.map.isModified()
  //   if (isModified) {
  //     this.showModifiedDialog(true)
  //   } else {
  //     this.goToMapChange()
  //   }
  // }
  //
  // goToMapChange = () => {
  //   NavigationService.navigate('MapChange', {
  //     workspace: this.workspace,
  //     map: this.map,
  //   })
  //   // NavigationService.navigate('MapChange',{workspace: this.workspace, map:this.map, cb: this.getData})
  // }
  //
  // // 地图保存
  // saveAndGoToMapChange = () => {
  //   (async function() {
  //     try {
  //       let saveMap = await this.map.save()
  //       if (!saveMap) {
  //         Toast.show('保存失败')
  //       } else {
  //         this.showModifiedDialog(false)
  //         this.showSaveDialog(false)
  //         Toast.show('保存成功')
  //         this.goToMapChange()
  //       }
  //     } catch (e) {
  //       Toast.show('保存失败')
  //     }
  //   }.bind(this)())
  // }
  //
  // // 保存
  // saveMapAndWorkspace = ({ mapName, wsName, path }) => {
  //   this.container.setLoading(true)
  //   ;(async function() {
  //     try {
  //       let saveWs
  //       let info = {}
  //       if (!mapName) {
  //         Toast.show('请输入地图名称')
  //         return
  //       }
  //       if (this.state.path !== path || path === ConstPath.LocalDataPath) {
  //         info.path = path
  //       }
  //       if (this.showDialogCaption) {
  //         if (!wsName) {
  //           Toast.show('请输入工作空间名称')
  //           return
  //         }
  //         info.path = path
  //         info.caption = wsName
  //       }
  //       await this.map.setWorkspace(this.workspace)
  //       // 若名称相同，则不另存为
  //       // let saveMap = await this.map.save(mapName !== this.state.mapName ? mapName : '')
  //
  //       // saveWs = await this.workspace.saveWorkspace(info)
  //       if (this.showDialogCaption) {
  //         let index = await this.workspace.addMap(
  //           mapName,
  //           await this.map.toXML(),
  //         )
  //         if (index >= 0) {
  //           saveWs = await this.workspace.saveWorkspace(info)
  //           if (saveWs) {
  //             this.showSaveDialog(false)
  //             Toast.show('保存成功')
  //           } else {
  //             Toast.show('保存失败')
  //           }
  //         } else {
  //           Toast.show('该名称地图已存在')
  //         }
  //       } else {
  //         // 若名称相同，则不另存为
  //         let saveMap = await this.map.save(
  //           mapName !== this.state.mapName ? mapName : '',
  //         )
  //         saveWs = await this.workspace.saveWorkspace(info)
  //         if (!saveMap) {
  //           Toast.show('该名称地图已存在')
  //         } else if (saveWs || !this.showDialogCaption) {
  //           this.showSaveDialog(false)
  //           Toast.show('保存成功')
  //         } else if (saveWs === undefined) {
  //           Toast.show('该工作空间已存在')
  //         } else {
  //           Toast.show('保存失败')
  //         }
  //       }
  //       this.container.setLoading(false)
  //     } catch (e) {
  //       this.container.setLoading(false)
  //       Toast.show('保存失败')
  //     }
  //   }.bind(this)())
  // }
  //
  // //添加数据集
  // _add_dataset = () => {
  //   NavigationService.navigate('AddDataset', {
  //     workspace: this.workspace,
  //     map: this.map,
  //     layerList: this.state.datasourceList,
  //     cb: async () => {
  //       await this.getData()
  //       this.map && this.map.refresh()
  //     },
  //   })
  // }
  //
  // //新建图层组
  // _add_layer_group = () => {
  //   NavigationService.navigate('AddLayerGroup', {
  //     workspace: this.workspace,
  //     mapControl: this.mapControl,
  //     map: this.map,
  //     cb: this.getData,
  //   })
  // }
  //
  // //删除图层 / 解散图层组
  // _removeLayer = () => {
  //   (async function() {
  //     try {
  //       if (!this.map || !this.removeLayerData) return
  //       let result = false,
  //         info = '删除',
  //         isDeletedFromGroup = false
  //       if (this.removeLayerData.layer._SMLayerGroupId) {
  //         // 解散图层组
  //         result = await this.removeLayerData.layer.ungroup()
  //         info = '解散图层组'
  //       } else if (this.removeLayerData.groupName) {
  //         // 从图层组中删除图层
  //         let group = new LayerGroup()
  //         group._SMLayerId = this.removeLayerData.layerGroupId
  //         result = await group.remove(this.removeLayerData.layer)
  //         isDeletedFromGroup = true
  //       } else {
  //         // 删除图层
  //         let name = this.removeLayerData.name
  //         result = await this.map.removeLayer(name)
  //       }
  //       if (result) {
  //         Toast.show(info + '成功')
  //
  //         // TODO 更新解散的图层组
  //         if (
  //           (this.removeLayerData.layer._SMLayerGroupId &&
  //             this.removeLayerData.groupName) ||
  //           isDeletedFromGroup
  //         ) {
  //           let child = await this.getChildList({
  //             data: this.itemRefs[this.removeLayerData.groupName].props.data,
  //           })
  //           this.itemRefs[this.removeLayerData.groupName].updateChild(child)
  //         } else {
  //           await this.getData()
  //         }
  //         delete this.itemRefs[this.removeLayerData.name]
  //         this.removeLayerData = null
  //       } else {
  //         Toast.show(info + '失败')
  //       }
  //       this.deleteDialog && this.deleteDialog.setDialogVisible(false)
  //     } catch (e) {
  //       Toast.show('删除失败')
  //     }
  //   }.bind(this)())
  // }
  //
  // //图层重命名
  // _renameLayer = name => {
  //   (async function() {
  //     try {
  //       if (!this.map || !this.renameLayer) return
  //       await this.renameLayer.setCaption(name)
  //       Toast.show('修改成功')
  //       this.renameLayer = null
  //       await this.getData()
  //       this.renameDialog && this.renameDialog.setDialogVisible(false)
  //     } catch (e) {
  //       Toast.show('修改失败')
  //     }
  //   }.bind(this)())
  // }

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: scaleSize(80 + 1) * index,
      index,
    }
  }

  onPressRow = async ({ data }) => {
    this.index = await SMap.getLayerIndexByName(data.caption)
    this.props.setCurrentLayer &&
      this.props.setCurrentLayer(data, () => {
        if (GLOBAL.Type !== constants.MAP_THEME) {
          Toast.show('当前图层为' + data.caption)
        }
      })
    if (GLOBAL.Type === constants.MAP_EDIT && data.themeType <= 0) {
      SMap.setLayerEditable(data.path, true)
      if (data.type === 83) {
        GLOBAL.toolBox.setVisible(true, ConstToolType.GRID_STYLE, {
          containerType: 'list',
          isFullScreen: false,
          height: ConstToolType.HEIGHT[4],
        })
        GLOBAL.toolBox.showFullMap()
        this.props.navigation.navigate('MapView')
      } else if (data.type === 1 || data.type === 3 || data.type === 5) {
        GLOBAL.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
          containerType: 'symbol',
          isFullScreen: false,
          column: 4,
          height: ConstToolType.THEME_HEIGHT[3],
        })
        GLOBAL.toolBox.showFullMap()
        this.props.navigation.navigate('MapView')
      }
    } else if (GLOBAL.Type === constants.MAP_THEME) {
      switch (data.themeType) {
        case ThemeType.UNIQUE:
          this.props.navigation.navigate('MapView')
          Toast.show('当前图层为:' + data.name)
          GLOBAL.toolBox.showMenuAlertDialog(constants.THEME_UNIQUE_STYLE)
          break
        case ThemeType.RANGE:
          this.props.navigation.navigate('MapView')
          Toast.show('当前图层为:' + data.name)
          GLOBAL.toolBox.showMenuAlertDialog(constants.THEME_RANGE_STYLE)
          break
        case ThemeType.LABEL:
          this.props.navigation.navigate('MapView')
          Toast.show('当前图层为:' + data.name)
          GLOBAL.toolBox.showMenuAlertDialog(constants.THEME_UNIFY_LABEL)
          break
        default:
          Toast.show('提示:请选择专题图层')
          break
      }
    }
  }

  onToolPress = async ({ data }) => {
    this.toolBox.setVisible(true, ConstToolType.MAP_STYLE, {
      height: ConstToolType.THEME_HEIGHT[5],
      layername: data.name,
    })
  }

  getChildList = async ({ data }) => {
    try {
      if (data.type !== 'layerGroup') return
      this.container.setLoading(true)
      let layers = await SMap.getLayersByGroupPath(data.path)
      let child = []
      for (let i = 0; i < layers.length; i++) {
        child.push(this._renderItem({ item: layers[i] }))
      }
      this.container.setLoading(false)
      return child
    } catch (e) {
      this.container.setLoading(false)
      Toast.show('获取失败')
      return []
    }
  }

  setLayerVisible = (data, value) => {
    SMap.setLayerVisible(data.path, value)
  }

  _renderItem = ({ item }) => {
    // sectionID = sectionID || 0
    return (
      <LayerManager_item
        key={item.id}
        // sectionID={sectionID}
        // rowID={item.index}
        ref={ref => {
          if (!this.itemRefs) {
            this.itemRefs = {}
          }
          this.itemRefs[item.name] = ref
          return this.itemRefs[item.name]
        }}
        layer={item.layer}
        // map={this.map}
        data={item}
        isClose={this.state.currentOpenItemName !== item.name}
        mapControl={this.mapControl}
        setLayerVisible={this.setLayerVisible}
        onOpen={data => {
          // data, sectionID, rowID
          if (this.state.currentOpenItemName !== data.name) {
            let item = this.itemRefs[this.state.currentOpenItemName]
            item && item.close()
          }
          this.setState({
            currentOpenItemName: data.name,
          })
        }}
        onPress={this.onPressRow}
        onArrowPress={this.getChildList}
        onToolPress={this.onToolPress}
      />
    )
  }

  renderToolBar = () => {
    return <MapToolbar navigation={this.props.navigation} initIndex={1} />
  }

  renderList = () => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={{
            height: scaleSize(60),
            backgroundColor: color.content,
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              marginLeft: scaleSize(50),
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: size.fontSize.fontSizeXXl,
              color: color.white,
            }}
          >
            我的图层
          </Text>
        </TouchableOpacity>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setRefreshing(true)
            this.getData()
          }}
          ref={ref => (this.listView = ref)}
          data={this.props.layers}
          renderItem={this._renderItem}
          getItemLayout={this.getItemLayout}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    )
  }

  renderTool = () => {
    return (
      <LayerManager_tolbar ref={ref => (this.toolBox = ref)} {...this.props} />
    )
  }

  render() {
    let title
    if (GLOBAL.Type === constants.MAP_EDIT) {
      title = '地图制图'
    } else {
      title = '地图管理'
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: title,
          navigation: this.props.navigation,
        }}
        bottomBar={this.renderToolBar()}
      >
        {/*<LayerManager_tab*/}
        {/*mapChange={this._map_change}*/}
        {/*showSaveDialog={this.showSaveDialog}*/}
        {/*addDataset={this._add_dataset}*/}
        {/*addLayerGroup={this._add_layer_group}*/}
        {/*/>*/}
        {this.renderList()}
        {this.renderTool()}
        {/*<SaveDialog*/}
        {/*ref={ref => (this.saveDialog = ref)}*/}
        {/*confirmAction={this.saveMapAndWorkspace}*/}
        {/*showWsName={this.showDialogCaption}*/}
        {/*mapName={this.state.mapName}*/}
        {/*wsName={this.state.wsName}*/}
        {/*path={this.state.path}*/}
        {/*/>*/}
        {/*<ModifiedDialog*/}
        {/*ref={ref => (this.modifiedDialog = ref)}*/}
        {/*info={'当前地图已修改，是否保存？'}*/}
        {/*confirmAction={this.saveAndGoToMapChange}*/}
        {/*cancelAction={this.goToMapChange}*/}
        {/*/>*/}
        {/*<ModifiedDialog*/}
        {/*ref={ref => (this.deleteDialog = ref)}*/}
        {/*info={'是否要删除该图层？'}*/}
        {/*confirmAction={this._removeLayer}*/}
        {/*/>*/}
        {/*<InputDialog*/}
        {/*ref={ref => (this.renameDialog = ref)}*/}
        {/*title={'图层重命名'}*/}
        {/*label={'图层名称'}*/}
        {/*confirmAction={this._renameLayer}*/}
        {/*/>*/}
      </Container>
    )
  }
}
