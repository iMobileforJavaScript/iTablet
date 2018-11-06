/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { FlatList } from 'react-native'
import { ListSeparator, Container, EmptyView, Dialog } from '../../components'
import { checkType, Toast, scaleSize } from '../../utils'
import PropTypes from 'prop-types'
import { Action, DatasetType } from 'imobile_for_reactnative'
import { LayerManager_item } from '../mtLayerManager/components'

export default class ChooseEditLayer extends React.Component {
  static propTypes = {
    editLayer: PropTypes.object,
    navigation: PropTypes.object,
    setEditLayer: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      datasourceList: '',
      showList: false,
    }
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.mapControl = params.mapControl
    this.isEdit = params.isEdit || false // 选择图层后是否为编辑状态
    this.map = params.map
    this.type = params.type || -1
    this.title = params.title || '选择编辑图层'
    this.cb = params.cb
    this.currentItem = {}
  }

  componentDidMount() {
    // (async function () {
    //   let layerNameArr = await this.map.getLayersByType(this.type)
    //   let arr = []
    //   for(let i = 0; i < layerNameArr.length; i++) {
    //     let layer = await this.map.getLayer(layerNameArr[i].index)
    //     let type = await (await layer.getDataset()).getType()
    // 排除文本图层和专题图
    // if (type === DatasetType.TEXT || layerNameArr[i].themeType > 0) continue
    // if (checkType.isVectorDataset(type)) {
    //   layerNameArr[i].layer = layer
    //   arr.push(layerNameArr[i])
    // }
    //   }
    //   this.setState({
    //     datasourceList: arr,
    //     showList: true,
    //   }, () => {
    //     this.container.setLoading(false)
    //   })
    // }).bind(this)()
    this.getData()
  }

  getData = async () => {
    this.container.setLoading(true)
    try {
      this.itemRefs = {}
      this.map = await this.mapControl.getMap()
      let layerNameArr = await this.map.getLayersByType(this.type)
      let arr = []
      for (let i = 0; i < layerNameArr.length; i++) {
        layerNameArr[i].key = layerNameArr[i].name
        if (
          layerNameArr[i].type === DatasetType.TEXT ||
          layerNameArr[i].themeType > 0
        )
          continue
        if (
          layerNameArr[i].type === 'layerGroup' ||
          checkType.isVectorDataset(layerNameArr[i].type)
        ) {
          arr.push(layerNameArr[i])
        }
      }
      let mapName = await this.map.getName()
      this.setState(
        {
          datasourceList: arr,
          mapName: mapName,
          showList: true,
        },
        () => {
          this.container.setLoading(false)
        },
      )
    } catch (e) {
      this.container.setLoading(false)
    }
  }

  select = ({ data }) => {
    if (data.type === 'layerGroup') {
      return this.getChildList({ data })
    } else {
      // let newList = this.state.layerList
      // if (newList[data.section + '-' + data.name]) {
      //   delete(newList[data.section + '-' + data.name])
      // } else {
      //   newList[data.section + '-' + data.name] = data
      // }
      // this.setState({
      //   layerList: newList,
      // })
      this._chooseEditLayer(data)
    }
  }

  getChildList = async ({ data }) => {
    try {
      if (data.type !== 'layerGroup') return
      let layer = data.layer
      this.container.setLoading(true)
      let layerGroup = layer
      let count = await layerGroup.getCount()
      let child = []
      for (let i = 0; i < count; i++) {
        let item = await layerGroup.getLayer(i)
        // 排除文本图层和专题图
        if (
          item.type === DatasetType.TEXT ||
          item.themeType > 0 ||
          (item.type !== this.type &&
            !checkType.isVectorDataset(item.type) &&
            item.type !== 'layerGroup')
        )
          continue
        if (
          item.type === 'layerGroup' ||
          item.type === this.type ||
          this.type === -1
        ) {
          child.push(this._renderItem({ item }))
        }
      }
      this.container.setLoading(false)
      return child
    } catch (e) {
      this.container.setLoading(false)
      Toast.show('获取失败')
      return []
    }
  }

  _chooseEditLayer = item => {
    (async function() {
      // this.container.setLoading(true)
      let layer = item.layer
      this.currentItem = item
      let dataset = await layer.getDataset()
      let datasource = await dataset.getDatasource()
      let datasourceIsReadOnly = await datasource.isReadOnly()
      let datasetIsReadOnly = await dataset.isReadOnly()
      if (datasourceIsReadOnly) {
        Toast.show('该图层所在数据源为只读')
      } else if (datasetIsReadOnly) {
        this.dialog.setDialogVisible(true)
      } else {
        await this.selectLayer()
      }
    }.bind(this)())
  }

  selectLayer = async () => {
    if (!this.currentItem.layer) return
    this.container.setLoading(true)
    let layer = this.currentItem.layer
    if (this.type === -1) {
      this.type = await (await layer.getDataset()).getType()
    }
    await layer.setSelectable(true)
    await layer.setVisible(true)
    await layer.setEditable(this.isEdit)
    this.currentItem.isEditable = await layer.getEditable()
    await this.mapControl.setAction(Action.SELECT)
    this.props.setEditLayer(this.currentItem)
    this.container.setLoading(false)
    this.props.navigation.goBack()
    this.cb && this.cb(true, this.type)
  }

  // _renderItem =  ({item}) => {
  //   let key = item.id
  //   return (
  //     <LayerItem key={key} data={item} map={this.map} onPress={this._chooseEditLayer}/>
  //   )
  // }

  _renderItem = ({ item }) => {
    // sectionID = sectionID || 0
    return (
      <LayerManager_item
        key={item.id}
        operable={false}
        swipeEnabled={false}
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
        map={this.map}
        data={item}
        mapControl={this.mapControl}
        onPress={this.select}
      />
    )
  }

  _renderSeparator = ({ leadingItem }) => {
    return <ListSeparator key={'separator_' + leadingItem.id} />
  }

  _keyExtractor = (item, index) => index + '-' + item.name

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: scaleSize(80 + 1) * index,
      index,
    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        initWithLoading
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
        }}
      >
        {this.state.showList &&
          (this.state.datasourceList.length > 0 ? (
            <FlatList
              ref={ref => (this.listView = ref)}
              keyExtractor={this._keyExtractor}
              data={this.state.datasourceList}
              renderItem={this._renderItem}
              ItemSeparatorComponent={this._renderSeparator}
              getItemLayout={this.getItemLayout}
            />
          ) : (
            <EmptyView />
          ))}
        <Dialog
          ref={ref => (this.dialog = ref)}
          type={Dialog.Type.MODAL}
          title={'提示'}
          info={'该图层为只读图层，是否设置为可编辑图层?'}
          confirmAction={async () => {
            await (await this.currentItem.getDataset()).setReadOnly(false) // 设置数据集为独占
            this.selectLayer()
          }}
        />
      </Container>
    )
  }
}
